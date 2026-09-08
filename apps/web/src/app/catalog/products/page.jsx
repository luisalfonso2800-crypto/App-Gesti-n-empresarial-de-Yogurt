/**
 * @file page.jsx
 * @module catalog/products
 * @description Controlador principal para el catálogo de productos terminados.
 * @responsibility Punto de entrada del Next.js Router (<120 líneas).
 * @usedBy Next.js App Router
 * @dependencies Hooks locales y componentes visuales.
 */
'use client';
import React from 'react';
import { useProductsData } from './hooks/useProductsData';
import { useProductForm } from './hooks/useProductForm';
import { ProductsHeader } from './components/ProductsHeader';
import { ProductsTable } from './components/ProductsTable';
import { ProductModal } from './components/ProductModal';

export default function ProductsPage() {
  const { items, loading, error, fetchItems, handleToggleActive } = useProductsData();
  const form = useProductForm({ onSuccess: fetchItems });

  return (
    <div>
      <ProductsHeader onNew={form.handleOpenModal} />
      <ProductsTable 
        items={items} loading={loading} error={error}
        onEdit={form.handleOpenModal} onToggleActive={handleToggleActive}
      />
      <ProductModal 
        isOpen={form.isModalOpen} onClose={form.handleCloseModal}
        editingItem={form.editingItem} formData={form.formData}
        handleChange={form.handleChange} handleSubmit={form.handleSubmit}
      />
    </div>
  );
}
