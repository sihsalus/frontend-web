import { View, ViewOff } from '@carbon/react/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SensitiveDataRevealProps {
  children: React.ReactNode;
}

const SensitiveDataReveal: React.FC<SensitiveDataRevealProps> = ({ children }) => {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(true)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          color: '#0f62fe',
          padding: 0,
          fontSize: '0.75rem',
        }}
        aria-label={t('revealSensitiveData', 'Ver dato protegido')}
      >
        <View size={14} />
        {t('sensitiveData', 'Dato sensible')}
      </button>
    );
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      {children}
      <button
        type="button"
        onClick={() => setRevealed(false)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex' }}
        aria-label={t('hideSensitiveData', 'Ocultar dato')}
      >
        <ViewOff size={14} />
      </button>
    </span>
  );
};

export default SensitiveDataReveal;
