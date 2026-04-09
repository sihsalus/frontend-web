import type { StoredAuditEntry } from './types';

const STORE_NAME = 'entries';
const DB_VERSION = 2;

// Cache connections to avoid opening a new handle on every operation.
const dbCache = new Map<string, IDBDatabase>();

function openDb(dbName: string): Promise<IDBDatabase> {
  const cached = dbCache.get(dbName);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Fresh install: create store with timestamp index for efficient eviction.
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp');
      } else if (event.oldVersion < 2) {
        // Migrate v1 → v2: add timestamp index.
        const store = req.transaction!.objectStore(STORE_NAME);
        if (!store.indexNames.contains('timestamp')) {
          store.createIndex('timestamp', 'timestamp');
        }
      }
    };

    req.onsuccess = () => {
      const db = req.result;
      // Evict cache entry if the connection is closed externally (e.g. version bump).
      db.onclose = () => dbCache.delete(dbName);
      dbCache.set(dbName, db);
      resolve(db);
    };

    req.onerror = () => reject(req.error ?? new Error('Failed to open IndexedDB'));
  });
}

export async function putEntry(dbName: string, entry: StoredAuditEntry): Promise<void> {
  const db = await openDb(dbName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(entry);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to put entry in IndexedDB'));
  });
}

export async function getAllEntries(dbName: string): Promise<StoredAuditEntry[]> {
  const db = await openDb(dbName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result as StoredAuditEntry[]);
    req.onerror = () => reject(req.error ?? new Error('Failed to get all entries from IndexedDB'));
  });
}

export async function clearEntries(dbName: string, ids: string[]): Promise<void> {
  const db = await openDb(dbName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    ids.forEach((id) => store.delete(id));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to clear entries from IndexedDB'));
  });
}

export async function countEntries(dbName: string): Promise<number> {
  const db = await openDb(dbName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Failed to count entries in IndexedDB'));
  });
}

export async function deleteOldestEntries(dbName: string, keepCount: number): Promise<void> {
  const all = await getAllEntries(dbName);
  if (all.length <= keepCount) return;
  const toDelete = [...all]
    .sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1))
    .slice(0, all.length - keepCount)
    .map((e) => e.id);
  await clearEntries(dbName, toDelete);
}
