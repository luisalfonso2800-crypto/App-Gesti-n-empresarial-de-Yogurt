/**
 * @file useProductionForm.js
 * @module operations/production/hooks
 * @description Gestión de formularios de creación y completitud de órdenes de producción.
 * @responsibility Controlar estado de variantes, cantidades, simulación de BOM y submit.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';

export function useProductionForm({ recipes, onSuccess }) {
  const [view, setView] = useState('list'); // list, create, complete
  const [editingItem, setEditingItem] = useState(null);
  
  // Create Form State
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [cantidadPlanificada, setCantidadPlanificada] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [bomSimulado, setBomSimulado] = useState([]);
  
  // Complete Form State
  const [completeDetalles, setCompleteDetalles] = useState([]);

  const handleOpenCreate = () => {
    setSelectedRecipeId('');
    setCantidadPlanificada(1);
    setSelectedVariants({});
    setBomSimulado([]);
    setView('create');
  };

  const handleOpenComplete = (item) => {
    setEditingItem(item);
    setCompleteDetalles(item.detalles.map(d => ({
      ...d,
      cantidadRealUtilizada: d.cantidadRealUtilizada ?? d.cantidadTeorica
    })));
    setView('complete');
  };

  const handleCloseView = () => {
    setView('list');
    setEditingItem(null);
  };

  const selectedRecipe = useMemo(() => {
    return recipes.find(r => r.id === selectedRecipeId);
  }, [recipes, selectedRecipeId]);

  const variantGroups = useMemo(() => {
    if (!selectedRecipe) return [];
    const groups = new Set();
    selectedRecipe.etapas?.forEach(e => {
      e.detalles?.forEach(d => {
        if (d.esOpcional && d.grupoVariante && d.grupoVariante !== 'NINGUNO') {
          groups.add(d.grupoVariante);
        }
      });
    });
    return Array.from(groups);
  }, [selectedRecipe]);

  const handleVariantChange = (group, val) => {
    setSelectedVariants(prev => {
      const n = { ...prev };
      if (val) n[group] = true;
      else delete n[group];
      return n;
    });
  };

  const simularBOM = async () => {
    if (!selectedRecipeId || cantidadPlanificada <= 0) return;
    try {
      const vStr = Object.keys(selectedVariants).join(',');
      const data = await apiClient.get(`/production/recipe-bom/${selectedRecipeId}?cantidad=${cantidadPlanificada}&variantes=${vStr}`);
      setBomSimulado(data);
    } catch (err) {
      alert("Error simulando BOM: " + err.message);
    }
  };

  useEffect(() => {
    if (selectedRecipeId) {
      const timer = setTimeout(() => simularBOM(), 300);
      return () => clearTimeout(timer);
    } else {
      setBomSimulado([]);
    }
  }, [selectedRecipeId, cantidadPlanificada, selectedVariants]);

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    try {
      const data = {
        idProducto: selectedRecipe.idProducto,
        fechaProduccion: new Date().toISOString(),
        cantidadPlanificada: Number(cantidadPlanificada),
        estado: 'PLANIFICADA',
        detalles: bomSimulado.map(b => ({
          idInsumo: b.idInsumo,
          cantidadTeorica: b.requeridoTeorico,
          unidad: b.unidad,
          costoTeorico: b.costoTeorico
        }))
      };
      await apiClient.post('/production', data);
      handleCloseView();
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  const handleSubmitComplete = async (e) => {
    e.preventDefault();
    try {
      const data = {
        cantidadProducidaReal: Number(editingItem.cantidadPlanificada),
        detalles: completeDetalles.map(d => ({
          id: d.id,
          cantidadRealUtilizada: Number(d.cantidadRealUtilizada)
        }))
      };
      await apiClient.patch(`/production/${editingItem.id}/complete`, data);
      handleCloseView();
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.message || 'Error al completar');
    }
  };

  return {
    view, editingItem, selectedRecipeId, setSelectedRecipeId,
    cantidadPlanificada, setCantidadPlanificada, selectedVariants,
    bomSimulado, completeDetalles, setCompleteDetalles,
    handleOpenCreate, handleOpenComplete, handleCloseView,
    handleVariantChange, variantGroups, handleSubmitCreate, handleSubmitComplete
  };
}
