import { openmrsFetch } from '@openmrs/esm-framework';

import { clearEntries, countEntries, deleteOldestEntries, getAllEntries, putEntry } from './db';
import type { AuditEvent, AuditLoggerConfig, StoredAuditEntry } from './types';

const DEFAULTS: Required<AuditLoggerConfig> = {
  endpoint: '/ws/rest/v1/sihsalus/audit',
  dbName: 'sihsalus-audit-log',
  maxOfflineEntries: 500,
};

const FLUSH_BATCH_SIZE = 50;
// Max events accepted per second to prevent log-flood attacks.
const RATE_LIMIT_PER_SECOND = 20;

class AuditLogger {
  private config: Required<AuditLoggerConfig> = { ...DEFAULTS };
  private sessionRef: { userUuid: string; sessionId: string } | null = null;
  private onlineHandler: (() => void) | null = null;
  private initialized = false;

  // Rate-limiting state
  private rateLimitCount = 0;
  private rateLimitResetAt = 0;

  configure(config: Partial<AuditLoggerConfig>): void {
    if (config.endpoint !== undefined && !AuditLogger.isSafeEndpoint(config.endpoint)) {
      console.error('[AuditLogger] Rejected unsafe endpoint:', config.endpoint);
      const { endpoint: _ignored, ...rest } = config;
      this.config = { ...DEFAULTS, ...rest };
      return;
    }
    this.config = { ...DEFAULTS, ...config };
  }

  setSession(userUuid: string, sessionId: string): void {
    this.sessionRef = { userUuid, sessionId };
  }

  clearSession(): void {
    this.sessionRef = null;
  }

  init(): void {
    if (this.initialized) return;
    this.initialized = true;
    this.onlineHandler = () => {
      this.flush().catch((err) => console.error('[AuditLogger] Online flush failed:', err));
    };
    globalThis.addEventListener('online', this.onlineHandler);
    if (navigator.onLine) {
      this.flush().catch((err) => console.error('[AuditLogger] Initial flush failed:', err));
    }
  }

  destroy(): void {
    if (this.onlineHandler) {
      globalThis.removeEventListener('online', this.onlineHandler);
      this.onlineHandler = null;
    }
    this.initialized = false;
  }

  log(event: Omit<AuditEvent, 'timestamp' | 'userUuid' | 'sessionId'>): Promise<void> {
    if (!this.sessionRef) return Promise.resolve();

    if (this.isRateLimited()) {
      console.warn('[AuditLogger] Rate limit exceeded, event dropped:', event.eventType);
      return Promise.resolve();
    }

    const entry: StoredAuditEntry = {
      ...event,
      timestamp: new Date().toISOString(),
      userUuid: this.sessionRef.userUuid,
      sessionId: this.sessionRef.sessionId,
      id: crypto.randomUUID(),
    };

    if (navigator.onLine) {
      return this.sendEntries([entry]).catch((err) => {
        console.error('[AuditLogger] Send failed, queuing:', err);
        return this.queueEntry(entry).catch((qErr) =>
          console.error('[AuditLogger] Queue failed, event lost:', qErr),
        );
      });
    }

    return this.queueEntry(entry).catch((err) =>
      console.error('[AuditLogger] Queue failed, event lost:', err),
    );
  }

  async flush(): Promise<void> {
    const { dbName } = this.config;
    const entries = await getAllEntries(dbName);
    if (!entries.length) return;

    for (let i = 0; i < entries.length; i += FLUSH_BATCH_SIZE) {
      const batch = entries.slice(i, i + FLUSH_BATCH_SIZE);
      try {
        await this.sendEntries(batch);
        await clearEntries(dbName, batch.map((e) => e.id));
      } catch (err) {
        console.error('[AuditLogger] Flush batch failed, stopping:', err);
        break;
      }
    }
  }

  private async queueEntry(entry: StoredAuditEntry): Promise<void> {
    const { dbName, maxOfflineEntries } = this.config;
    const count = await countEntries(dbName);
    if (count >= maxOfflineEntries) {
      await deleteOldestEntries(dbName, maxOfflineEntries - 1);
    }
    await putEntry(dbName, entry);
  }

  private async sendEntries(entries: StoredAuditEntry[]): Promise<void> {
    const response = await openmrsFetch(this.config.endpoint, {
      method: 'POST',
      body: entries,
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Audit flush failed: ${response.status}`);
    }
  }

  private isRateLimited(): boolean {
    const now = Date.now();
    if (now >= this.rateLimitResetAt) {
      this.rateLimitCount = 0;
      this.rateLimitResetAt = now + 1000;
    }
    this.rateLimitCount++;
    return this.rateLimitCount > RATE_LIMIT_PER_SECOND;
  }

  /**
   * Only allow relative paths (same-origin) or absolute URLs on the current origin.
   * Prevents config injection from redirecting audit logs to external servers.
   */
  private static isSafeEndpoint(endpoint: string): boolean {
    if (endpoint.startsWith('/')) return true;
    try {
      const url = new URL(endpoint);
      return url.origin === globalThis.location?.origin;
    } catch {
      return false;
    }
  }
}

export const auditLogger = new AuditLogger();
