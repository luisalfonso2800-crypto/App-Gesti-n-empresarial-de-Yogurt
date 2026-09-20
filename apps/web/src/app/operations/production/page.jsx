/**
 * @file page.jsx
 * @module operations/production
 * @description Orquestador de la vista de Bitácora de Fabricación y Producción (SRP + CSS Modules).
 * @responsibility Presentar cabecera, delegar launchpad, modal de planificación, órdenes y cierre.
 * @usedBy Next.js router (/operations/production)
 */
'use client';

import React from 'react';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { Button } from '@/components/ui/Button';
import { ClipboardList } from 'lucide-react';
import styles from './production.module.css';
import { useProductionPageData } from './hooks/useProductionPageData';
import ProductionPlanningModal from './components/ProductionPlanningModal';
import ProductionOrdersGrid from './components/ProductionOrdersGrid';
import ProductionOrderCompleteModal from './components/ProductionOrderCompleteModal';
import ProductionRecipeWarningBanner from './components/ProductionRecipeWarningBanner';
import ProductionProductLaunchpad from './components/ProductionProductLaunchpad';

function ProductionPageContent() {
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
    submitComplete,
    handleReportIncident,
    handleProduceProduct,
    handleClosePlanning,
    products,
    orphanProducts
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

      <ProductionRecipeWarningBanner orphanProducts={orphanProducts} />

      <ProductionProductLaunchpad
        products={products}
        recipes={recipes}
        onProduceProduct={handleProduceProduct}
      />

      <ProductionPlanningModal
        isOpen={creating}
        onClose={handleClosePlanning}
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
        orphanProducts={orphanProducts}
      />

      <ProductionOrdersGrid
        orders={orders}
        onOpenCreate={() => setCreating(true)}
        startOrder={startOrder}
        openComplete={openComplete}
        handleReportIncident={handleReportIncident}
      />

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

export default function ProductionPage() {
  return (
    <React.Suspense fallback={<LoadingState />}>
      <ProductionPageContent />
    </React.Suspense>
  );
}
