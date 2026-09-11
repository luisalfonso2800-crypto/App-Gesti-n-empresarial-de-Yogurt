/**
 * @file page.jsx
 * @module catalog/suppliers
 * @description Orquestador de la vista del directorio de proveedores.
 * @responsibility Instanciar la vista de la tabla y centralizar hooks de datos.
 * @usedBy Next.js App Router
 * @dependencies Hooks y Componentes locales.
 */
'use client';
import React from 'react';
import { useSuppliersData } from './hooks/useSuppliersData';
import { useSupplierForm } from './hooks/useSupplierForm';
import { SuppliersHeader } from './components/SuppliersHeader';
import { SuppliersTable } from './components/SuppliersTable';
import { SupplierModal } from './components/SupplierModal';

export default function SuppliersPage() {
  const { items, loading, error, fetchItems, handleToggleActive } = useSuppliersData();
  const form = useSupplierForm({ onSuccess: fetchItems });

  return (
    <div>
      <SuppliersHeader onNew={form.handleOpenModal} />
      <SuppliersTable 
        items={items} loading={loading} error={error}
        onEdit={form.handleOpenModal} onToggleActive={handleToggleActive}
      />
      <SupplierModal 
        isOpen={form.isModalOpen} onClose={form.handleCloseModal}
        editingItem={form.editingItem} formData={form.formData}
        handleChange={form.handleChange} handleSubmit={form.handleSubmit}
        isSubmitting={form.isSubmitting} errorMsg={form.errorMsg}
      />
    </div>
  );
}
