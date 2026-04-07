import { useSession } from '@openmrs/esm-framework';
import { useEffect } from 'react';

import { auditLogger } from './AuditLogger';
import type { AuditEvent } from './types';

export function useAuditLogger(): (event: Omit<AuditEvent, 'timestamp' | 'userUuid' | 'sessionId'>) => void {
  const session = useSession();

  useEffect(() => {
    if (session?.authenticated && session.user?.uuid && session.sessionId) {
      auditLogger.setSession(session.user.uuid, session.sessionId);
    }
  }, [session]);

  return auditLogger.log.bind(auditLogger);
}
