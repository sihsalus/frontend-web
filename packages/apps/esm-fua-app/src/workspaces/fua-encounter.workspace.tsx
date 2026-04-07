import { Button, InlineLoading } from '@carbon/react';
import { openmrsFetch, restBaseUrl, showSnackbar, useConfig, useSession, useVisit } from '@openmrs/esm-framework';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { Config } from '../config-schema';
import FuaHtmlViewer from '../components/fua-html-viewer.component';

interface FuaEncounterWorkspaceProps {
  patientUuid: string;
  encounterUuid?: string;
  visitUuid?: string;
}

const FuaEncounterWorkspace: React.FC<FuaEncounterWorkspaceProps> = ({ patientUuid, encounterUuid, visitUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<Config>();
  const session = useSession();
  const { currentVisit, isLoading: isLoadingVisit } = useVisit(patientUuid);
  const [isInitializing, setIsInitializing] = useState(true);
  const [fuaId, setFuaId] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retrySeed, setRetrySeed] = useState(0);

  useEffect(() => {
    if (isLoadingVisit) {
      return;
    }

    const effectiveVisitUuid = visitUuid ?? currentVisit?.uuid;

    if (!effectiveVisitUuid) {
      const message = t('noActiveVisitForFua', 'No hay una visita activa para crear FUA');
      setErrorMessage(message);
      setIsInitializing(false);
      return;
    }

    const createEncounterAndFua = async () => {
      try {
        setIsInitializing(true);
        setErrorMessage(null);

        let createdEncounterUuid = encounterUuid;

        if (!createdEncounterUuid) {
          const encounterPayload: Record<string, unknown> = {
            patient: patientUuid,
            visit: effectiveVisitUuid,
            encounterType: config.encounterTypeUuid,
            encounterDatetime: new Date().toISOString(),
          };

          if (session?.sessionLocation?.uuid) {
            encounterPayload.location = session.sessionLocation.uuid;
          }

          const encounterResponse = await openmrsFetch<{ uuid: string }>(`${restBaseUrl}/encounter`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: encounterPayload,
          });

          createdEncounterUuid = encounterResponse?.data?.uuid;
        }

        if (!createdEncounterUuid) {
          throw new Error(t('couldNotCreateEncounter', 'No se pudo crear el encuentro para FUA'));
        }

        const fuaResponse = await openmrsFetch<{ uuid?: string; fuaUuid?: string; id?: string | number }>(
          `${config.fuaApiBasePath}/create`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              patientUuid,
              visitUuid: effectiveVisitUuid,
              encounterUuid: createdEncounterUuid,
            },
          },
        );

        const createdFuaId =
          fuaResponse?.data?.uuid ?? fuaResponse?.data?.fuaUuid ?? (fuaResponse?.data?.id ? String(fuaResponse.data.id) : undefined);
        setFuaId(createdFuaId);

        showSnackbar({
          title: t('fuaCreated', 'FUA creado'),
          subtitle: t('fuaCreatedWithEncounter', 'Se creó un encuentro y se inició el FUA correctamente'),
          kind: 'success',
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : t('errorCreatingFua', 'Ocurrió un error al crear el FUA');
        setErrorMessage(message);
        showSnackbar({
          title: t('errorCreatingFua', 'Ocurrió un error al crear el FUA'),
          subtitle: message,
          kind: 'error',
        });
      } finally {
        setIsInitializing(false);
      }
    };

    void createEncounterAndFua();
  }, [
    config.encounterTypeUuid,
    config.fuaApiBasePath,
    encounterUuid,
    currentVisit?.uuid,
    isLoadingVisit,
    patientUuid,
    retrySeed,
    session,
    t,
    visitUuid,
  ]);

  if (isInitializing) {
    return (
      <div style={{ padding: '1rem' }}>
        <InlineLoading description={t('creatingFua', 'Creando FUA...')} />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={{ padding: '1rem', display: 'grid', gap: '1rem' }}>
        <p>{errorMessage}</p>
        <Button kind="primary" onClick={() => setRetrySeed((seed) => seed + 1)}>
          {t('retry', 'Reintentar')}
        </Button>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <FuaHtmlViewer fuaId={fuaId} />
    </div>
  );
};

export default FuaEncounterWorkspace;
