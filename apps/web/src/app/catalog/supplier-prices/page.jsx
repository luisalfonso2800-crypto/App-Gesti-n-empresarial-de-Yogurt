/**
 * @file page.jsx
 * @module catalog/supplier-prices
 * @description Orquestador principal de la vista de precios de proveedores.
 * @responsibility Integrar hooks de estado, datos y renderizar componentes. (Debe ser menor a 120 líneas).
 *   También captura deep-links desde el SCADA (?search=Insumo&insumoId=uuid) para precargar el filtro.
 * @usedBy Next.js App Router
 * @dependencies useSupplierPricesData, useCartManager, UI components
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ContextBanner } from '@/components/ui/ContextBanner';
import styles from './supplier-prices.module.css';

import { useSupplierPricesData } from './hooks/useSupplierPricesData';
import { useCartManager } from './hooks/useCartManager';
import { PricesFilterBar } from './components/PricesFilterBar';
import { PricesComparisonTable } from './components/PricesComparisonTable';
import { CartSidebar } from './components/CartSidebar';
import { SupplierPriceModal } from './components/SupplierPriceModal';
import { SummaryCard } from './components/SummaryCard';

export default function SupplierPricesPage() {
  // Captura parámetros de deep-link del SCADA (ej. ?search=Leche+cruda&insumoId=uuid)
  const searchParams = useSearchParams();

  const {
    items, loading, error, filteredItems,
    handleToggleActive, handleSubmitForm,
    filterInsumo, setFilterInsumo, filterProveedor, setFilterProveedor,
    filterEstado, setFilterEstado, filterSearch, setFilterSearch,
    filterSort, setFilterSort, clearFilters, hasFilters,
    uniqueInsumos, uniqueProveedores, bestPricesMap, summaryCard
  } = useSupplierPricesData();

  const {
    selectedForPurchase, togglePurchaseItem,
    clearPurchaseList, proceedToPurchase,
    MoveListModal,
  } = useCartManager();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [allInsumos, setAllInsumos] = useState([]);
  const [allProveedores, setAllProveedores] = useState([]);

  // Al montar: si la URL trae ?search= (deep-link del SCADA), precarga el filtro de búsqueda
  useEffect(() => {
    const searchFromUrl = searchParams?.get('search');
    if (searchFromUrl) {
      setFilterSearch(searchFromUrl);
    }
  }, [searchParams]);
  
  // Load global catalogs for the form
  React.useEffect(() => {
    import('@/lib/api-client').then(({ apiClient }) => {
      Promise.all([
        apiClient.get('/supplies'),
        apiClient.get('/suppliers')
      ]).then(([insumosData, proveedoresData]) => {
        setAllInsumos(insumosData);
        setAllProveedores(proveedoresData);
      }).catch(err => console.error("Error loading catalogs:", err));
    });
  }, []);

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Precios de Proveedores</h1>
          <p className={styles.subtitle}>Histórico y lista de tarifas vigentes cotizadas por cada proveedor.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>Nuevo Registro</Button>
      </div>
      <ContextBanner 
        title="Concepto Técnico" 
        description="Permite comparar cuánto cuesta cada insumo dependiendo del proveedor." 
      />

      <PricesFilterBar 
        filterInsumo={filterInsumo} setFilterInsumo={setFilterInsumo}
        filterProveedor={filterProveedor} setFilterProveedor={setFilterProveedor}
        filterEstado={filterEstado} setFilterEstado={setFilterEstado}
        filterSort={filterSort} setFilterSort={setFilterSort}
        filterSearch={filterSearch} setFilterSearch={setFilterSearch}
        hasFilters={hasFilters} clearFilters={clearFilters}
        uniqueInsumos={uniqueInsumos} uniqueProveedores={uniqueProveedores}
      />

      <SummaryCard summaryCard={summaryCard} />

      <PricesComparisonTable 
        items={items} filteredItems={filteredItems} loading={loading} error={error}
        bestPricesMap={bestPricesMap} selectedForPurchase={selectedForPurchase}
        handleOpenModal={handleOpenModal} handleToggleActive={handleToggleActive}
        togglePurchaseItem={togglePurchaseItem}
      />

      <CartSidebar 
        selectedForPurchase={selectedForPurchase}
        clearPurchaseList={clearPurchaseList} proceedToPurchase={proceedToPurchase}
      />

      <SupplierPriceModal 
        isOpen={isModalOpen} onClose={handleCloseModal}
        editingItem={editingItem} onSubmit={handleSubmitForm}
        allInsumos={allInsumos} allProveedores={allProveedores}
      />

      {/* Modal selector de lista destino cuando hay 3+ listas activas */}
      {MoveListModal}
    </div>
  );
}
