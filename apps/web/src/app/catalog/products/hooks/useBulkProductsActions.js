/**
 * @file useBulkProductsActions.js
 * @module catalog/products/hooks
 * @description Hook gestor para acciones masivas (activar, desactivar, eliminar) sobre productos seleccionados.
 * @responsibility Ejecutar operaciones en lote contra el backend y proveer feedback al usuario.
 * @dependencies @/lib/api-client
 */
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export function useBulkProductsActions({ onRefresh, onNotify, onClearSelection }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkToggleActive = async (selectedIds, targetActive) => {
    if (!selectedIds || selectedIds.length === 0 || isProcessing) return;
    setIsProcessing(true);
    try {
      await Promise.all(
        selectedIds.map(id => apiClient.patch(`/products/${id}`, { activo: targetActive }))
      );
      const actionName = targetActive ? 'activaron' : 'desactivaron';
      onNotify(`Se ${actionName} ${selectedIds.length} producto${selectedIds.length > 1 ? 's' : ''} exitosamente.`);
      onClearSelection();
      await onRefresh();
    } catch (err) {
      onNotify(err.message || 'Error al ejecutar la acción masiva');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkActivate = (selectedIds) => handleBulkToggleActive(selectedIds, true);
  const handleBulkDeactivate = (selectedIds) => handleBulkToggleActive(selectedIds, false);

  const handleBulkDelete = async (selectedIds, openConfirmModal) => {
    if (!selectedIds || selectedIds.length === 0) return;
    if (openConfirmModal) {
      openConfirmModal(selectedIds);
    }
  };

  return {
    isProcessing,
    handleBulkActivate,
    handleBulkDeactivate,
    handleBulkDelete
  };
}
