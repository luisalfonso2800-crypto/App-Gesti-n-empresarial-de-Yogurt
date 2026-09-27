/**
 * @file page.jsx
 * @module catalog/suppliers
 * @description Orquestador de la vista del directorio de proveedores con búsqueda, filtros y paginación.
 * @responsibility Instanciar la vista de la tabla, filtros y modal de creación/edición.
 * @usedBy Next.js App Router
 * @dependencies Hooks y Componentes locales.
 */
'use client';
import React, { useState } from 'react';
import { useSuppliersData } from './hooks/useSuppliersData';
import { useSupplierForm } from './hooks/useSupplierForm';
import { SuppliersHeader } from './components/SuppliersHeader';
import { SuppliersTable } from './components/SuppliersTable';
import { SupplierModal } from '@/components/catalog/SupplierModal';

export default function SuppliersPage() {
  const { items, loading, error, fetchItems, handleToggleActive } = useSuppliersData();
  const form = useSupplierForm({ onSuccess: fetchItems });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  return (
    <div>
      <SuppliersHeader 
        onNew={form.handleOpenModal} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onResetFilters={handleResetFilters}
      />
      <SuppliersTable 
        items={items} 
        loading={loading} 
        error={error}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onEdit={form.handleOpenModal} 
        onToggleActive={handleToggleActive}
        onNew={() => form.handleOpenModal(null)}
      />
      <SupplierModal 
        isOpen={form.isModalOpen} 
        onClose={form.handleCloseModal}
        editingItem={form.editingItem} 
        onSuccess={fetchItems}
      />
    </div>
  );
}
