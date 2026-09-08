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
  const [newProv, setNewProv] = useState({ nombre: '', nitCedula: '', telefono: '', personaContacto: '', email: '', direccion: '', observaciones: '', activo: true });
  
  const [showInsumoModal, setShowInsumoModal] = useState(false);
  const [targetRowId, setTargetRowId] = useState(null);
  const [newInsumo, setNewInsumo] = useState({ nombre: '', categoria: 'MATERIA_PRIMA', unidadBase: 'KG', stockMinimo: 0, marca: '' });

  return {
    showProvModal, setShowProvModal,
    newProv, setNewProv,
    showInsumoModal, setShowInsumoModal,
    targetRowId, setTargetRowId,
    newInsumo, setNewInsumo
  };
}