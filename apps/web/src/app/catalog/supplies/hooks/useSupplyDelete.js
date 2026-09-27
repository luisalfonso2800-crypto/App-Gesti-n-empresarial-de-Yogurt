/**
 * @file useSupplyDelete.js
 * @module catalog/supplies/hooks
 * @description Hook para coordinar la confirmación y eliminación de insumos (SRP < 50 líneas).
 * @responsibility Administrar estados de borrado (modal, loading, error) y llamada a la API.
 */
import { useState } from 'react';

export function useSupplyDelete(handleDeleteSupply) {
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleOpenDelete = (item) => {
    setDeleteError(null);
    setDeletingItem(item);
  };

  const handleCloseDelete = () => {
    if (!isDeleting) {
      setDeletingItem(null);
      setDeleteError(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    setDeleteError(null);
    const result = await handleDeleteSupply(deletingItem.id);
    setIsDeleting(false);
    if (result.success) {
      setDeletingItem(null);
    } else {
      setDeleteError(result.message);
    }
  };

  return {
    deletingItem,
    isDeleting,
    deleteError,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete
  };
}
