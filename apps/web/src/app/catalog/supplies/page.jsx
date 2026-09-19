/**
 * @file page.jsx
 * @module catalog/supplies
 * @description Orquestador de la vista del catálogo de insumos con eliminación segura.
 * @responsibility Instanciar la vista de la tabla, filtros y modales de edición/eliminación.
 * @usedBy Next.js App Router
 * @dependencies Hooks y Componentes locales.
 */
'use client';
import React, { useState } from 'react';
import { useNotification } from '@/context/NotificationContext';
import { useSuppliesData } from './hooks/useSuppliesData';
import { useSupplyForm } from './hooks/useSupplyForm';
import { SuppliesHeader } from './components/SuppliesHeader';
import { SuppliesTable } from './components/SuppliesTable';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { SupplyModal } from '@/components/catalog/SupplyModal';
import styles from './supplies.module.css';

export default function SuppliesPage() {
  const { showNotification } = useNotification();
  const {
    items,
    loading,
    error,
    actionNotice,
    clearActionNotice,
    fetchItems,
    handleToggleActive,
    handleDeleteSupply
  } = useSuppliesData();

  const handleFormSuccess = (savedData) => {
    fetchItems();
    if (savedData?.customMessage) {
      showNotification(savedData.customMessage, 'success');
    } else {
      const actionText = form.editingItem ? 'actualizado correctamente' : 'registrado exitosamente';
      const name = savedData?.nombre ? ` "${savedData.nombre}"` : '';
      showNotification(`Insumo${name} ${actionText}.`, 'success');
    }
  };

  const form = useSupplyForm({ onSuccess: handleFormSuccess });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const categories = [...new Set(items.map(i => i.categoria))].filter(Boolean);

  const handleOpenDelete = (item) => { setDeleteError(null); setDeletingItem(item); };
  const handleCloseDelete = () => { if (!isDeleting) { setDeletingItem(null); setDeleteError(null); } };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    setDeleteError(null);
    const result = await handleDeleteSupply(deletingItem.id);
    setIsDeleting(false);
    if (result.success) setDeletingItem(null);
    else setDeleteError(result.message);
  };

  return (
    <div>
      <SuppliesHeader 
        onNew={form.handleOpenModal} 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
        categories={categories}
      />

      {actionNotice && (
        <div className={styles.toastAlert}>
          <span>⚠️ {actionNotice?.message || actionNotice}</span>
          <button className={styles.toastClose} onClick={clearActionNotice} aria-label="Cerrar aviso">
            &times;
          </button>
        </div>
      )}

      <SuppliesTable 
        items={items} loading={loading} error={error}
        searchTerm={searchTerm} categoryFilter={categoryFilter}
        onEdit={form.handleOpenModal} onToggleActive={handleToggleActive}
        onDelete={handleOpenDelete}
        onNew={() => form.handleOpenModal(null)}
      />

      <SupplyModal 
        isOpen={form.isModalOpen} onClose={form.handleCloseModal}
        editingItem={form.editingItem} onSuccess={handleFormSuccess}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(deletingItem)}
        item={deletingItem}
        isDeleting={isDeleting}
        errorMessage={deleteError}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDelete}
      />
    </div>
  );
}
