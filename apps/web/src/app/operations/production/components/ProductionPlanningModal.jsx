/**
 * @file ProductionPlanningModal.jsx
 * @module operations/production/components
 * @description Modal enfocado con backdrop para la planificación de nuevas órdenes de producción.
 * @responsibility Aislar el formulario creador de órdenes evitando que compita con el flujo de la bitácora.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 */
'use client';

import React, { useEffect } from 'react';
import ProductionOrderCreator from './ProductionOrderCreator';
import styles from '../production.module.css';

export default function ProductionPlanningModal({
  isOpen,
  onClose,
  recipes,
  selectedRecipe,
  setSelectedRecipe,
  qty,
  setQty,
  bom,
  bomLoading,
  hasShortage,
  handlePurchaseShortage,
  handleCreateOrder,
  orphanProducts
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className={styles.modalContent}>
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
          orphanProducts={orphanProducts}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
