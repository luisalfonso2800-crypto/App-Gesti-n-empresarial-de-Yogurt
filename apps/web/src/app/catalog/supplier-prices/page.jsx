/**
 * @file page.jsx
 * @module catalog/supplier-prices
 * @description Orquestador de la vista de precios de proveedores con filtros en cadena y paginación (SRP < 120 líneas).
 * @responsibility Integrar hooks de estado, datos, filtros en cascada y modales.
 * @usedBy Next.js App Router
 * @dependencies useSupplierPricesData, useCartManager, UI components
 */
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ContextBanner } from '@/components/ui/ContextBanner';
import { useSupplierPricesData } from './hooks/useSupplierPricesData';
import { useCartManager } from './hooks/useCartManager';
import { PricesFilterBar } from './components/PricesFilterBar';
import { PricesComparisonTable } from './components/PricesComparisonTable';
import { CartSidebar } from './components/CartSidebar';
import { SupplierPriceModal } from './components/SupplierPriceModal';
import { SummaryCard } from './components/SummaryCard';
import { SupplierPricesMetrics } from './components/SupplierPricesMetrics';
import { MetricsDetailModal } from './components/MetricsDetailModal';

function SupplierPricesContent() {
  const searchParams = useSearchParams();
  const {
    items, loading, error, filteredItems, handleToggleActive, handleSubmitForm,
    filterProveedor, setFilterProveedor, filterInsumo, setFilterInsumo,
    filterPresentacion, setFilterPresentacion, filterEstado, setFilterEstado,
    filterSearch, setFilterSearch, filterSort, setFilterSort, clearFilters, hasFilters,
    uniqueProveedores, uniqueInsumos, availableInsumos, availablePresentaciones,
    bestPricesMap, summaryCard, globalMetrics
  } = useSupplierPricesData();

  const { selectedForPurchase, togglePurchaseItem, clearPurchaseList, proceedToPurchase, MoveListModal } = useCartManager();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeMetricDetail, setActiveMetricDetail] = useState(null);
  const [allInsumos, setAllInsumos] = useState([]);
  const [allProveedores, setAllProveedores] = useState([]);

  useEffect(() => {
    const searchFromUrl = searchParams?.get('search');
    if (searchFromUrl) setFilterSearch(searchFromUrl);
  }, [searchParams, setFilterSearch]);
  
  useEffect(() => {
    let isMounted = true;
    import('@/lib/api-client').then(async ({ apiClient }) => {
      try {
        const [ins, provs] = await Promise.all([apiClient.get('/supplies').catch(() => []), apiClient.get('/suppliers').catch(() => [])]);
        if (isMounted) {
          setAllInsumos(Array.isArray(ins) ? ins : []);
          setAllProveedores(Array.isArray(provs) ? provs : []);
        }
      } catch (err) { console.warn('[SupplierPrices] Error catálogos auxiliares:', err); }
    });
    return () => { isMounted = false; };
  }, []);

  const handleOpenModal = (item = null) => { setEditingItem(item); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingItem(null); };

  return (
    <div>
      <ContextBanner 
        title="Tarifas y Cotizaciones de Proveedores" 
        description="Compara precios de compra por presentación y costo equivalente unitario en planta." 
        action={<Button onClick={() => handleOpenModal()}>+ Nueva Tarifa</Button>}
      />
      <SupplierPricesMetrics metrics={globalMetrics} loading={loading} onCardClick={setActiveMetricDetail} />
      <PricesFilterBar 
        filterProveedor={filterProveedor} setFilterProveedor={setFilterProveedor}
        filterInsumo={filterInsumo} setFilterInsumo={setFilterInsumo}
        filterPresentacion={filterPresentacion} setFilterPresentacion={setFilterPresentacion}
        filterEstado={filterEstado} setFilterEstado={setFilterEstado}
        filterSort={filterSort} setFilterSort={setFilterSort}
        filterSearch={filterSearch} setFilterSearch={setFilterSearch}
        hasFilters={hasFilters} clearFilters={clearFilters}
        uniqueProveedores={uniqueProveedores} availableInsumos={availableInsumos}
        availablePresentaciones={availablePresentaciones}
      />
      <SummaryCard summaryCard={summaryCard} />
      <PricesComparisonTable 
        items={items} filteredItems={filteredItems} loading={loading} error={error}
        bestPricesMap={bestPricesMap} selectedForPurchase={selectedForPurchase}
        handleOpenModal={handleOpenModal} handleToggleActive={handleToggleActive}
        togglePurchaseItem={togglePurchaseItem} onNewTarifa={() => handleOpenModal(null)}
      />
      <CartSidebar selectedForPurchase={selectedForPurchase} clearPurchaseList={clearPurchaseList} proceedToPurchase={proceedToPurchase} />
      <SupplierPriceModal 
        isOpen={isModalOpen} onClose={handleCloseModal} editingItem={editingItem}
        onSubmit={handleSubmitForm} allInsumos={allInsumos} allProveedores={allProveedores}
        onSupplyCreated={(newS) => setAllInsumos(prev => [newS, ...prev])}
        onSupplierCreated={(newP) => setAllProveedores(prev => [newP, ...prev])}
      />
      <MetricsDetailModal
        isOpen={Boolean(activeMetricDetail)} onClose={() => setActiveMetricDetail(null)}
        detailType={activeMetricDetail} metrics={globalMetrics} items={items}
        uniqueProveedores={uniqueProveedores} uniqueInsumos={uniqueInsumos}
        onFilterBySupplier={setFilterProveedor} onFilterByInsumo={setFilterInsumo}
        onFilterByStatus={setFilterEstado} onOpenNewTarifa={() => handleOpenModal(null)}
      />
      {MoveListModal}
    </div>
  );
}

export default function SupplierPricesPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SupplierPricesContent />
    </Suspense>
  );
}
