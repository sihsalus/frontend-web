import { Tile } from '@carbon/react';
import { Lock } from '@carbon/react/icons';
import React from 'react';

interface UnauthorizedStateProps {
  privilege: string | string[];
  description?: string;
}

export function UnauthorizedState({ privilege, description }: UnauthorizedStateProps) {
  const privilegeLabel = Array.isArray(privilege) ? privilege.join(', ') : privilege;
  const body = description ?? `You need the "${privilegeLabel}" privilege to access this section.`;

  return (
    <Tile>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Lock size={20} />
        <strong>Access Denied</strong>
      </div>
      <p>{body}</p>
    </Tile>
  );
}
