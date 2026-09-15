/**
 * @file useProductDeleteManager.js
 * @module catalog/products/hooks
 * @description Hook gestor para el flujo de eliminación segura de productos.
 * @responsibility Administrar el estado del modal de confirmación y feedback de eliminación.
 * @dependencies react
 */
import { useState } from 'react';

export function useProductDeleteManager({ onDeleteProduct }) {
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleOpenDelete = (item) => {
    setDeleteError(null);
    setDeletingItem(item);
  };

  const handleCloseDelete = () => {
    if (isDeleting) return;
    setDeletingItem(null);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem || !onDeleteProduct) return;
    setIsDeleting(true);
    setDeleteError(null);
    const isMultiple = Array.isArray(deletingItem.ids);
    const result = isMultiple 
      ? await onDeleteProduct(deletingItem.ids)
      : await onDeleteProduct(deletingItem.id);
    setIsDeleting(false);
    if (result?.success) {
      setDeletingItem(null);
    } else {
      setDeleteError(result?.message || 'Error al eliminar');
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
