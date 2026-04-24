import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useStockOperationTypes } from '../../stock-lookups/stock-lookups.resource';
import { launchStockoperationAddOrEditWorkSpace } from '../stock-operation.utils';
import { useStockOperationAndItems } from '../stock-operations.resource';

interface StockOperationRelatedLinkProps {
  stockOperationUuid: string;
  operationNumber: string;
}

const StockOperationRelatedLink: React.FC<StockOperationRelatedLinkProps> = ({
  stockOperationUuid,
  operationNumber,
}) => {
  const { error, isLoading, types } = useStockOperationTypes();
  const {
    error: stockOperationError,
    isLoading: isStockOperationLoading,
    items: stockOperation,
  } = useStockOperationAndItems(stockOperationUuid);
  const { t } = useTranslation();

  const handleEdit = useCallback(() => {
    const operationType = types?.results?.find((op) => op?.uuid === stockOperation?.operationTypeUuid);
    if (!operationType) {
      return;
    }
    launchStockoperationAddOrEditWorkSpace(
      t,
      operationType,
      stockOperation,
      stockOperation?.requisitionStockOperationUuid,
    );
  }, [types, stockOperation, t]);

  if (isLoading || error || stockOperationError || isStockOperationLoading) return null;
  return (
    <button
      onClick={handleEdit}
      style={{
        cursor: 'pointer',
        textDecoration: 'underline',
        background: 'none',
        border: 'none',
        padding: 0,
        color: 'inherit',
      }}
      type="button"
    >
      {operationNumber}
    </button>
  );
};

export default StockOperationRelatedLink;
