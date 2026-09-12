/**
 * @file page.jsx
 * @module catalog/supplies
 * @description Orquestador de la vista del catálogo de insumos.
 * @responsibility Instanciar la vista de la tabla y manejar filtros.
 * @usedBy Next.js App Router
 * @dependencies Hooks y Componentes locales.
 */
'use client';
import React, { useState } from 'react';
import { useSuppliesData } from './hooks/useSuppliesData';
import { useSupplyForm } from './hooks/useSupplyForm';
import { SuppliesHeader } from './components/SuppliesHeader';
import { SuppliesTable } from './components/SuppliesTable';
import { SupplyModal } from '@/components/catalog/SupplyModal';

export default function SuppliesPage() {
  const { items, loading, error, fetchItems, handleToggleActive } = useSuppliesData();
  const form = useSupplyForm({ onSuccess: fetchItems });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [...new Set(items.map(i => i.categoria))].filter(Boolean);

  return (
    <div>
      <SuppliesHeader 
        onNew={form.handleOpenModal} 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
        categories={categories}
      />
      <SuppliesTable 
        items={items} loading={loading} error={error}
        searchTerm={searchTerm} categoryFilter={categoryFilter}
        onEdit={form.handleOpenModal} onToggleActive={handleToggleActive}
      />
      <SupplyModal 
        isOpen={form.isModalOpen} onClose={form.handleCloseModal}
        editingItem={form.editingItem} onSuccess={fetchItems}
      />
    </div>
  );
}
