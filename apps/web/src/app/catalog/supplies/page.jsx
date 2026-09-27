/**
 * @file page.jsx
 * @module catalog/supplies
 * @description Orquestador de la vista del catálogo de insumos con filtrado multicriterio y eliminación segura.
 * @responsibility Instanciar la vista de la tabla, filtros multidimensionales y modales de edición/eliminación.
 * @usedBy Next.js App Router
 * @dependencies Hooks y Componentes locales.
 */
'use client';
import React, { useState } from 'react';
import { useNotification } from '@/context/NotificationContext';
import { useSuppliesData } from './hooks/useSuppliesData';
import { useSupplyForm } from './hooks/useSupplyForm';
import { useSupplyDelete } from './hooks/useSupplyDelete';
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
  const deleteCtrl = useSupplyDelete(handleDeleteSupply);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    stockStatus: '',
    traceability: '',
    activeStatus: ''
  });

  const categories = [...new Set(items.map(i => i.categoria))].filter(Boolean);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ search: '', category: '', stockStatus: '', traceability: '', activeStatus: '' });
  };

  return (
    <div>
      <SuppliesHeader 
        onNew={form.handleOpenModal} 
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
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
        items={items} 
        loading={loading} 
        error={error}
        filters={filters}
        onEdit={form.handleOpenModal} 
        onToggleActive={handleToggleActive}
        onDelete={deleteCtrl.handleOpenDelete}
        onNew={() => form.handleOpenModal(null)}
      />

      <SupplyModal 
        isOpen={form.isModalOpen} 
        onClose={form.handleCloseModal}
        editingItem={form.editingItem} 
        onSuccess={handleFormSuccess}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(deleteCtrl.deletingItem)}
        item={deleteCtrl.deletingItem}
        isDeleting={deleteCtrl.isDeleting}
        errorMessage={deleteCtrl.deleteError}
        onConfirm={deleteCtrl.handleConfirmDelete}
        onClose={deleteCtrl.handleCloseDelete}
      />
    </div>
  );
}
