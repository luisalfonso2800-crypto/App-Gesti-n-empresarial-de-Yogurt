/**
 * @file purchases/new/hooks/useChecklistManager.js
 * @module hooks/useChecklistManager
 * @description Hook encargado de manejar el estado del checklist, cálculo de totales y alertas.
 * @responsibility Consolidar la capa lógica interactiva del checklist (Fase 1).
 * @usedBy apps/web/src/app/operations/purchases/new/page.jsx
 * @dependencies apiClient, useState, useEffect
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useChecklistManager(initialItems, phase) {
  const [checklistItems, setChecklistItems] = useState([]);
  const [simulationResult, setSimulationResult] = useState({ subtotalGlobal: 0, itemsLiquidados: [] });
  
  useEffect(() => {
    if (initialItems.length > 0) {
      setChecklistItems(initialItems);
    }
  }, [initialItems]);

  useEffect(() => {
    const simulate = async () => {
      try {
        const itemsPayload = checklistItems.filter(i => i.estadoOperativo !== 'DESCARTADO').map(item => ({
          idPrecioProveedor: item.idPrecioProveedor || item.priceData?.id,
          cantidadEmpaques: item.cantidadSolicitada || 1,
          precioEmpaque: item.precioCompraActual || 0,
          factorReal: item.contenidoBaseEditado || item.contenidoBase || item.priceData?.cantidadEquivalenteBase || 1,
          unidadBase: item.unidadBaseEditada || item.insumoData?.unidadBase || item.unidadBase || item.unidadMedida
        }));

        if (itemsPayload.length > 0) {
          const res = await apiClient.post('/purchases/simulate', { items: itemsPayload });
          setSimulationResult(res || { subtotalGlobal: 0, itemsLiquidados: [] });
        } else {
          setSimulationResult({ subtotalGlobal: 0, itemsLiquidados: [] });
        }
      } catch (e) {
        console.error('Error simulating (Handled gracefully):', e);
        // Fallback safely so the UI doesn't break
        setSimulationResult({ subtotalGlobal: 0, itemsLiquidados: [], error: e.message || 'Error de simulación' });
      }
    };
    
    if (phase === 1 && checklistItems.length > 0) {
      simulate();
    } else if (checklistItems.length === 0) {
      setSimulationResult({ subtotalGlobal: 0, itemsLiquidados: [] });
    }
  }, [checklistItems, phase]);

  const updateChecklistItem = (id, field, value) => {
    setChecklistItems(items => items.map(it => 
      it._id === id ? { ...it, [field]: value } : it
    ));
  };

  const removeChecklistItem = (id) => {
    setChecklistItems(items => items.map(it => 
      it._id === id ? { ...it, estadoOperativo: 'DESCARTADO' } : it
    ));
  };

  const checklistGrouped = checklistItems.reduce((acc, item) => {
    const prov = item.proveedorData?.nombre || item.proveedorNombre || 'Sin Proveedor';
    if (!acc[prov]) acc[prov] = [];
    acc[prov].push(item);
    return acc;
  }, {});

  return { checklistItems, setChecklistItems, simulationResult, updateChecklistItem, removeChecklistItem, checklistGrouped };
}