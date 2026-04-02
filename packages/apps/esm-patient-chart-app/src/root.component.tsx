import React, { useCallback, useRef, useSyncExternalStore } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import { dashboardPath, spaRoot, basePath } from './constants';
import PatientChart from './patient-chart/patient-chart.component';
import styles from './root.scss';

function useLocationHref() {
  return useSyncExternalStore(
    (cb) => {
      // single-spa fires popstate after navigateToUrl
      window.addEventListener('popstate', cb);
      // single-spa also fires this custom event after routing
      window.addEventListener('single-spa:routing-event', cb);
      return () => {
        window.removeEventListener('popstate', cb);
        window.removeEventListener('single-spa:routing-event', cb);
      };
    },
    () => window.location.href,
  );
}

export default function Root() {
  const href = useLocationHref();

  const routerRef = useRef<ReturnType<typeof createBrowserRouter> | null>(null);

  const getRouter = useCallback(() => {
    // Recreate router when the URL changes externally so it picks up the new location
    routerRef.current = createBrowserRouter(
      createRoutesFromElements(
        <>
          <Route path={basePath} element={<PatientChart />} />
          <Route path={dashboardPath} element={<PatientChart />} />
        </>,
      ),
      { basename: spaRoot },
    );
    return routerRef.current;
  }, [href]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.patientChartWrapper}>
      <RouterProvider router={getRouter()} />
    </div>
  );
}

/**
 * DO NOT REMOVE THIS COMMENT
 * THE TRANSLATION KEYS AND VALUES USED IN THE COMMON LIB IS WRITTEN HERE
 * t('paginationPageText', 'of {{count}} pages', {count})
 * t("emptyStateText", 'There are no {{displayText}} to display for this patient', {displayText: "sample text"})
 * t('record', 'Record')
 * t('errorCopy','Sorry, there was a problem displaying this information. You can try to reload this page, or contact the site administrator and quote the error code above.')
 * t('error', 'Error')
 * t('seeAll', 'See all')
 * t('paginationItemsCount', `{{pageItemsCount}} / {{count}} items`, { count: totalItems, pageItemsCount });
 * t('Routine')
 * t('Stat')
 * t('On scheduled date')
 */
