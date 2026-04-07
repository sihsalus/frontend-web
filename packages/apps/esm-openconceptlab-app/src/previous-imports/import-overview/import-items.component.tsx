import {
  DataTableSkeleton,
  Link,
  Pagination,
  PaginationSkeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { ErrorState, usePagination } from '@openmrs/esm-framework';
import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useImportItems } from './import-items.resource';
import styles from './import-items.scss';

interface ImportItemsProps {
  importUuid: string;
}

const ImportItems: React.FC<ImportItemsProps> = ({ importUuid }) => {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(5);

  const { data: importItems, error, isLoading } = useImportItems(importUuid);
  const { results, currentPage, goTo } = usePagination(importItems ?? [], pageSize);

  if (isLoading) {
    return (
      <div>
        <DataTableSkeleton showHeader={false} showToolbar={false} columnCount={2} />
        <PaginationSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorState headerTitle={t('importItems', 'Import Error Details')} error={error} />;
  }

  if (!importItems?.length) {
    return <p>{t('noImportErrors', 'No error details found')}</p>;
  }

  const headerData = [
    {
      header: t('conceptOrMapping', 'Concept/Mapping'),
      key: 'uuid',
    },
    {
      header: t('message', 'Message'),
      key: 'errorMessage',
    },
  ];

  return (
    <div>
      <Table size="sm" className={styles.tableBordered}>
        <TableHead>
          <TableRow className={styles.tableHeaderRow}>
            {headerData.map((header, i) => (
              <TableHeader key={i} isSortable={true}>
                {header.header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {results?.map((row) => (
            <Fragment key={row.uuid}>
              <TableRow className={styles.tableDataRow}>
                <TableCell>
                  <Link href={row.versionUrl}>
                    {row.type} {row.uuid}
                  </Link>
                </TableCell>
                <TableCell>{row.errorMessage}</TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
      <Pagination
        className={styles.pagination}
        size="sm"
        page={currentPage}
        pageSize={pageSize}
        pageSizes={[5, 10, 20, 50, 100]}
        totalItems={importItems.length}
        onChange={({ page, pageSize }) => {
          goTo(page);
          setPageSize(pageSize);
        }}
      />
    </div>
  );
};

export default ImportItems;
