/**
 * @file purchases/new/hooks/usePurchaseModals.js
 * @module hooks/usePurchaseModals
 * @description Hook encargado de manejar los estados booleanos de los modales en nueva compra.
 * @responsibility Consolidar la capa de UI interactiva (Fase 1).
 * @usedBy apps/web/src/app/operations/purchases/new/page.jsx
 * @dependencies useState
 */
import { useState } from 'react';

export function usePurchaseModals() {
  const [showProvModal, setShowProvModal] = useState(false);
  const [showInsumoModal, setShowInsumoModal] = useState(false);
  const [targetRowId, setTargetRowId] = useState(null);

  // Initial data can be passed, but the modals manage their own forms
  const [initialProvData, setInitialProvData] = useState({});
  const [initialSupplyData, setInitialSupplyData] = useState({});

  return {
    showProvModal, setShowProvModal,
    showInsumoModal, setShowInsumoModal,
    targetRowId, setTargetRowId,
    initialProvData, setInitialProvData,
    initialSupplyData, setInitialSupplyData
  };
}