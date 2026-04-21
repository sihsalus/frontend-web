import { useCallback, useEffect, useState } from 'react';
import type { FormExpanded, SessionMode } from '../types';

type FormCollapseToggleEvent = CustomEvent<{ value: FormExpanded }>;
const formViewEmbeddedStateKey = '__openmrsFormViewEmbedded';

export function useFormCollapse(sessionMode: SessionMode): {
  isFormExpanded: FormExpanded;
  hideFormCollapseToggle: () => void;
} {
  const [isFormExpanded, setIsFormExpanded] = useState<FormExpanded>(undefined);

  const hideFormCollapseToggle = useCallback(() => {
    (window as typeof window & { [formViewEmbeddedStateKey]?: boolean })[formViewEmbeddedStateKey] = false;
    const HideFormCollapseToggle = new CustomEvent('openmrs:form-view-embedded', { detail: { value: false } });
    window.dispatchEvent(HideFormCollapseToggle);
  }, []);

  const handleFormCollapseToggle = useCallback((event: Event): void => {
    const customEvent = event as FormCollapseToggleEvent;
    const nextValue = customEvent.detail?.value;
    if (typeof nextValue === 'boolean' || typeof nextValue === 'undefined') {
      setIsFormExpanded(nextValue);
    }
  }, []);

  useEffect(() => {
    const isToggleVisible = sessionMode != 'embedded-view';
    (window as typeof window & { [formViewEmbeddedStateKey]?: boolean })[formViewEmbeddedStateKey] = isToggleVisible;
    const FormCollapseToggleVisibleEvent = new CustomEvent('openmrs:form-view-embedded', {
      detail: { value: isToggleVisible },
    });

    window.dispatchEvent(FormCollapseToggleVisibleEvent);
  }, [sessionMode]);

  useEffect(() => {
    window.addEventListener('openmrs:form-collapse-toggle', handleFormCollapseToggle);

    return (): void => {
      window.removeEventListener('openmrs:form-collapse-toggle', handleFormCollapseToggle);
    };
  }, [handleFormCollapseToggle]);

  return {
    isFormExpanded,
    hideFormCollapseToggle,
  };
}
