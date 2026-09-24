/**
 * @file page.jsx
 * @module operations/purchases
 * @description Orquestador principal del módulo de compras, historial y gestión de listas (SRP + CSS Modules).
 * @responsibility Orquestar cabecera, órdenes en ruta, historial consolidado y modales auxiliares.
 * @usedBy Next.js App Router
 * @dependencies Next.js, lucide-react, @/components/ui/Button, ./hooks/usePurchasesPageData, ./components/PurchasesActiveOrdersSection, ./components/PurchasesHistoryTable, ./components/PurchasesModals
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

export default function PurchasesPage() {
  const router = useRouter();
  const {
    purchases, loading, error, activeOrders, expandedId, isMergingMode, selectedForMerge,
    deleteModalOpen, deleteError, isSubmittingDelete, editNameModalOpen, editNameValue,
    editNameError, isSubmittingEditName, groupedPurchases, toggleRow, handleToggleMergeSelection,
    executeMerge, handleEditNameSubmit, executeDelete, setIsMergingMode, setSelectedForMerge,
    setDeleteModalOpen, setDeleteError, setEditNameModalOpen, setEditNameValue, setEditNameError
  } = usePurchasesPageData();

  return (
    <div>
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

      <PurchasesActiveOrdersSection
        activeOrders={activeOrders}
        isMergingMode={isMergingMode}
        selectedForMerge={selectedForMerge}
        setIsMergingMode={setIsMergingMode}
        setSelectedForMerge={setSelectedForMerge}
        executeMerge={executeMerge}
        handleToggleMergeSelection={handleToggleMergeSelection}
        setEditNameValue={setEditNameValue}
        setEditNameModalOpen={setEditNameModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : purchases.length === 0 ? (
        <AssistedEmptyState
          icon="🛒"
          title="Comienza registrando tu primera Compra"
          description="Registra entradas de insumos a bodega para abastecer la planta y actualizar Kardex."
          actionLabel="+ Nueva Compra"
          onAction={() => router.push('/operations/purchases/new?mode=direct')}
          topButtonLabel="Nueva Compra Directa"
        />
      ) : (
        <PurchasesHistoryTable
          groupedPurchases={groupedPurchases}
          expandedId={expandedId}
          toggleRow={toggleRow}
        />
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
    </div>
  );
}

