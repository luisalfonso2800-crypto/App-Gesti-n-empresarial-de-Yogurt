/**
 * @file page.jsx
 * @module operations/purchases
 * @description Orquestador principal del módulo de compras, historial y gestión de listas (SRP < 120 líneas).
 */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import { ContextBanner } from '@/components/ui/ContextBanner';
import { ListPlus, ShoppingCart } from 'lucide-react';
import styles from './purchases.module.css';
import { usePurchasesPageData } from './hooks/usePurchasesPageData';
import PurchasesActiveOrdersSection from './components/PurchasesActiveOrdersSection';
import PurchasesHistoryTable from './components/PurchasesHistoryTable';
import PurchasesModals from './components/PurchasesModals';
import { PurchasesMetrics } from './components/PurchasesMetrics';
import { PurchasesMetricsDetailModal } from './components/PurchasesMetricsDetailModal';
import { PurchasesFilterBar } from './components/PurchasesFilterBar';
import { PurchasesPagination } from './components/PurchasesPagination';

export default function PurchasesPage() {
  const router = useRouter();
  const {
    purchases, loading, error, activeOrders, expandedId, isMergingMode, selectedForMerge,
    deleteModalOpen, deleteError, isSubmittingDelete, editNameModalOpen, editNameValue,
    editNameError, isSubmittingEditName, toggleRow, handleToggleMergeSelection,
    executeMerge, handleEditNameSubmit, executeDelete, setIsMergingMode, setSelectedForMerge,
    setDeleteModalOpen, setDeleteError, setEditNameModalOpen, setEditNameValue, setEditNameError,
    filterSearch, setFilterSearch, filterSupplier, setFilterSupplier,
    filterStatus, setFilterStatus, hasFilters, clearFilters, filteredCount,
    paginatedPurchases, currentPage, setCurrentPage, totalPages, PAGE_SIZE,
    globalMetrics, suppliersList, activeMetricDetail, setActiveMetricDetail
  } = usePurchasesPageData();

  return (
    <div className={styles.pageContainer}>
      <ContextBanner
        title="Concepto Técnico"
        description="Aquí se documenta la llegada de insumos. Registra listas en ruta, consolida compras finalizadas y permite unificar órdenes."
        action={
          <div className={styles.actions}>
            <Button onClick={() => router.push('/catalog/supplier-prices')} variant="secondary">
              <ListPlus size={16} /> Crear / Gestionar Lista
            </Button>
            <Button onClick={() => router.push('/operations/purchases/new?mode=direct')}>
              <ShoppingCart size={16} /> Nueva Compra Directa
            </Button>
          </div>
        }
      />
      <PurchasesMetrics metrics={globalMetrics} loading={loading} onCardClick={setActiveMetricDetail} />
      <PurchasesActiveOrdersSection
        activeOrders={activeOrders} isMergingMode={isMergingMode}
        selectedForMerge={selectedForMerge} setIsMergingMode={setIsMergingMode}
        setSelectedForMerge={setSelectedForMerge} executeMerge={executeMerge}
        handleToggleMergeSelection={handleToggleMergeSelection} setEditNameValue={setEditNameValue}
        setEditNameModalOpen={setEditNameModalOpen} setDeleteModalOpen={setDeleteModalOpen}
      />
      <PurchasesFilterBar
        filterSearch={filterSearch} setFilterSearch={setFilterSearch}
        filterSupplier={filterSupplier} setFilterSupplier={setFilterSupplier}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
        suppliers={suppliersList} hasFilters={hasFilters} clearFilters={clearFilters}
      />
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : purchases.length === 0 ? (
        <AssistedEmptyState
          icon="🛒" title="Comienza registrando tu primera Compra"
          description="Registra entradas de insumos a bodega para abastecer la planta y actualizar Kardex."
          actionLabel="+ Nueva Compra" onAction={() => router.push('/operations/purchases/new?mode=direct')}
          topButtonLabel="Nueva Compra Directa"
        />
      ) : (
        <>
          <PurchasesHistoryTable groupedPurchases={paginatedPurchases} expandedId={expandedId} toggleRow={toggleRow} />
          {filteredCount > 0 && (
            <PurchasesPagination
              currentPage={currentPage} totalPages={totalPages}
              totalItems={filteredCount} itemsPerPage={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
      <PurchasesModals
        editNameModalOpen={editNameModalOpen} setEditNameModalOpen={setEditNameModalOpen}
        editNameValue={editNameValue} setEditNameValue={setEditNameValue}
        editNameError={editNameError} setEditNameError={setEditNameError}
        isSubmittingEditName={isSubmittingEditName} handleEditNameSubmit={handleEditNameSubmit}
        deleteModalOpen={deleteModalOpen} setDeleteModalOpen={setDeleteModalOpen}
        deleteError={deleteError} setDeleteError={setDeleteError}
        isSubmittingDelete={isSubmittingDelete} executeDelete={executeDelete}
      />
      <PurchasesMetricsDetailModal
        isOpen={Boolean(activeMetricDetail)} onClose={() => setActiveMetricDetail(null)}
        detailType={activeMetricDetail} metrics={globalMetrics} suppliersList={suppliersList}
        onFilterBySupplier={setFilterSupplier} onFilterByStatus={setFilterStatus}
        onNewPurchase={() => router.push('/operations/purchases/new?mode=direct')}
        onNewOrder={() => router.push('/catalog/supplier-prices')}
      />
    </div>
  );
}
