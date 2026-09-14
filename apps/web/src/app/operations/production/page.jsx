/**
 * @file page.jsx
 * @module operations/production
 * @description Orquestador de la vista de Bitácora de Fabricación y Producción (SRP + CSS Modules).
 * @responsibility Presentar cabecera, listado de órdenes de producción y delegar modales de planificación y cierre.
 * @usedBy Next.js router (/operations/production)
 * @dependencies react, @/components/ui/States, @/components/ui/AssistedEmptyState, @/components/ui/Button, lucide-react
 */
'use client';

import React from 'react';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import { Button } from '@/components/ui/Button';
import { ClipboardList } from 'lucide-react';
import styles from './production.module.css';
import { useProductionPageData } from './hooks/useProductionPageData';
import ProductionOrderCreator from './components/ProductionOrderCreator';
import ProductionOrderCard from './components/ProductionOrderCard';
import ProductionOrderCompleteModal from './components/ProductionOrderCompleteModal';

export default function ProductionPage() {
  const {
    orders,
    loading,
    error,
    creating,
    setCreating,
    recipes,
    selectedRecipe,
    setSelectedRecipe,
    qty,
    setQty,
    bom,
    bomLoading,
    hasShortage,
    completeModal,
    setCompleteModal,
    realDetails,
    setRealDetails,
    startOrder,
    handleCreateOrder,
    handlePurchaseShortage,
    openComplete,
    submitComplete
  } = useProductionPageData();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <ClipboardList size={32} className={styles.icon} />
          <div>
            <h1 className={styles.title}>Bitácora de Fabricación</h1>
            <p className={styles.subtitle}>Control de Planta, Rendimientos y Trazabilidad de Lotes</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => setCreating(true)}>+ Nueva Producción</Button>
      </header>

      {creating && (
        <ProductionOrderCreator
          recipes={recipes}
          selectedRecipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
          qty={qty}
          setQty={setQty}
          bom={bom}
          bomLoading={bomLoading}
          hasShortage={hasShortage}
          handlePurchaseShortage={handlePurchaseShortage}
          handleCreateOrder={handleCreateOrder}
          onClose={() => setCreating(false)}
        />
      )}

      {orders.length === 0 ? (
        <AssistedEmptyState
          icon="⚙️"
          title="Comienza programando tu primera Orden de Producción"
          description="Programa órdenes de transformación por lote a partir de las recetas activas."
          actionLabel="+ Programar Producción"
          onAction={() => setCreating(true)}
          topButtonLabel="+ Nueva Producción"
        />
      ) : (
        <div className={styles.grid}>
          {orders.map((order) => (
            <ProductionOrderCard
              key={order.id}
              order={order}
              startOrder={startOrder}
              openComplete={openComplete}
            />
          ))}
        </div>
      )}

      <ProductionOrderCompleteModal
        completeModal={completeModal}
        setCompleteModal={setCompleteModal}
        realDetails={realDetails}
        setRealDetails={setRealDetails}
        submitComplete={submitComplete}
      />
    </div>
  );
}
