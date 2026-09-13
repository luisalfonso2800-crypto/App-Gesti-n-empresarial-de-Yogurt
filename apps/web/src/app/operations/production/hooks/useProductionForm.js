/**
 * @file useProductionForm.js
 * @module operations/production/hooks
 * @description Gestión de formularios de creación y completitud de órdenes de producción con trazabilidad de Lote Padre WIP.
 * @responsibility Controlar estado de variantes, cantidades, fecha de vencimiento proyectada, simulación de BOM dual y selección de lotes padre.
 * @usedBy apps/web/src/app/operations/production/page.jsx, apps/web/src/app/operations/production/components/ProductionModal.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

/**
 * Hook personalizado para manejar el estado y ciclo de vida de los formularios de producción.
 * @param {Object} params Parámetros de inicialización.
 * @param {Array} params.recipes Lista de recetas disponibles.
 * @param {Function} [params.onSuccess] Callback ejecutado al completar una acción con éxito.
 */
export function useProductionForm({ recipes = [], onSuccess }) {
  const [view, setView] = useState('list'); // list, create, complete
  const [editingItem, setEditingItem] = useState(null);
  
  // Create Form State
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [cantidadPlanificada, setCantidadPlanificada] = useState(1);
  const [fechaProduccion, setFechaProduccion] = useState(() => new Date().toISOString().split('T')[0]);
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [selectedVariants, setSelectedVariants] = useState({});
  const [bomSimulado, setBomSimulado] = useState([]);
  
  // Parent Lot (WIP) State
  const [availableParentLots, setAvailableParentLots] = useState([]);
  const [selectedParentLotId, setSelectedParentLotId] = useState('');
  const [parentLotsLoading, setParentLotsLoading] = useState(false);

  // Complete Form State
  const [completeDetalles, setCompleteDetalles] = useState([]);
  const [completeFechaVencimiento, setCompleteFechaVencimiento] = useState('');
  const [completeSelectedParentLotId, setCompleteSelectedParentLotId] = useState('');

  // Helper para calcular fecha proyectada por defecto
  const calcularFechaVencimientoDefault = useCallback((baseDateStr, diasVidaUtil = 21) => {
    const base = baseDateStr ? new Date(baseDateStr) : new Date();
    const target = new Date(base.getTime() + (Number(diasVidaUtil) || 21) * 86400000);
    return target.toISOString().split('T')[0];
  }, []);

  const handleOpenCreate = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setSelectedRecipeId('');
    setCantidadPlanificada(1);
    setFechaProduccion(todayStr);
    setFechaVencimiento(calcularFechaVencimientoDefault(todayStr, 21));
    setSelectedVariants({});
    setBomSimulado([]);
    setAvailableParentLots([]);
    setSelectedParentLotId('');
    setView('create');
  };

  const handleOpenComplete = (item) => {
    setEditingItem(item);
    setCompleteDetalles((item.detalles || []).map(d => ({
      ...d,
      cantidadRealUtilizada: d.cantidadRealUtilizada ?? d.cantidadTeorica
    })));
    const expDefault = item.fechaVencimiento
      ? new Date(item.fechaVencimiento).toISOString().split('T')[0]
      : calcularFechaVencimientoDefault(item.fechaProduccion || new Date(), 21);
    setCompleteFechaVencimiento(expDefault);

    // Cargar lotes si algún detalle es un producto intermedio
    const intermediateDetail = item.detalles?.find(d => d.idProductoIntermedio);
    if (intermediateDetail?.idProductoIntermedio) {
      apiClient.get(`/lots?idProducto=${intermediateDetail.idProductoIntermedio}&estado=DISPONIBLE`)
        .then(lots => {
          const validLots = (lots || []).filter(l => 
            (!l.idProducto || l.idProducto === intermediateDetail.idProductoIntermedio) &&
            l.estado !== 'AGOTADO' && l.estado !== 'DESCARTADO' && Number(l.cantidadDisponible) > 0
          );
          setAvailableParentLots(validLots);
          if (validLots.length > 0) {
            setCompleteSelectedParentLotId(validLots[0].id);
          }
        })
        .catch(() => {});
    }

    setView('complete');
  };

  const handleCloseView = () => {
    setView('list');
    setEditingItem(null);
  };

  const selectedRecipe = useMemo(() => {
    return recipes.find(r => r.id === selectedRecipeId);
  }, [recipes, selectedRecipeId]);

  // Al seleccionar receta o cambiar fecha de fabricación, recalcular fecha de vencimiento proyectada si no ha sido manipulada arbitrariamente
  useEffect(() => {
    if (selectedRecipe) {
      const diasVida = selectedRecipe.producto?.diasVidaUtil || 21;
      setFechaVencimiento(calcularFechaVencimientoDefault(fechaProduccion, diasVida));
    }
  }, [selectedRecipeId, fechaProduccion, selectedRecipe, calcularFechaVencimientoDefault]);

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

  // Simulación de BOM escalonado
  const simularBOM = useCallback(async () => {
    if (!selectedRecipeId || Number(cantidadPlanificada) <= 0) return;
    try {
      const vStr = Object.keys(selectedVariants).join(',');
      const data = await apiClient.get(`/production/recipe-bom/${selectedRecipeId}?cantidad=${cantidadPlanificada}&variantes=${vStr}`);
      setBomSimulado(data);

      // Detectar si requiere producto intermedio (WIP a granel)
      const wipItem = data.find(b => b.esProductoIntermedio || b.idProductoIntermedio);
      if (wipItem?.idProductoIntermedio) {
        setParentLotsLoading(true);
        try {
          const lots = await apiClient.get(`/lots?idProducto=${wipItem.idProductoIntermedio}&estado=DISPONIBLE`);
          const validLots = (lots || []).filter(l => 
            (!l.idProducto || l.idProducto === wipItem.idProductoIntermedio) &&
            l.estado !== 'AGOTADO' && l.estado !== 'DESCARTADO' && Number(l.cantidadDisponible) > 0
          );
          setAvailableParentLots(validLots);
          if (validLots.length > 0) {
            setSelectedParentLotId(wipItem.idLoteSugerido || validLots[0].id);
          } else {
            setSelectedParentLotId('');
          }
        } catch {
          setAvailableParentLots([]);
          setSelectedParentLotId('');
        } finally {
          setParentLotsLoading(false);
        }
      } else {
        setAvailableParentLots([]);
        setSelectedParentLotId('');
      }
    } catch (err) {
      alert("Error simulando BOM: " + err.message);
    }
  }, [selectedRecipeId, cantidadPlanificada, selectedVariants]);

  useEffect(() => {
    if (selectedRecipeId) {
      const timer = setTimeout(() => simularBOM(), 300);
      return () => clearTimeout(timer);
    } else {
      setBomSimulado([]);
      setAvailableParentLots([]);
      setSelectedParentLotId('');
    }
  }, [selectedRecipeId, cantidadPlanificada, selectedVariants, simularBOM]);

  // Ítem intermedio detectado en la receta actual
  const currentWipItem = useMemo(() => {
    return bomSimulado.find(b => b.esProductoIntermedio || b.idProductoIntermedio) || null;
  }, [bomSimulado]);

  // Lote padre actualmente seleccionado
  const selectedParentLot = useMemo(() => {
    return availableParentLots.find(l => l.id === selectedParentLotId) || null;
  }, [availableParentLots, selectedParentLotId]);

  const handleSubmitCreate = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedRecipe) return;

    try {
      const data = {
        idProducto: selectedRecipe.idProducto,
        fechaProduccion: new Date(fechaProduccion).toISOString(),
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento).toISOString() : null,
        cantidadPlanificada: Number(cantidadPlanificada),
        estado: 'PLANIFICADA',
        detalles: bomSimulado.map(b => ({
          idInsumo: b.idInsumo || null,
          idProductoIntermedio: b.idProductoIntermedio || null,
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
    if (e && e.preventDefault) e.preventDefault();
    if (!editingItem) return;

    try {
      const data = {
        cantidadProducidaReal: Number(editingItem.cantidadPlanificada),
        fechaVencimiento: completeFechaVencimiento ? new Date(completeFechaVencimiento).toISOString() : undefined,
        detalles: completeDetalles.map(d => ({
          id: d.id,
          cantidadRealUtilizada: Number(d.cantidadRealUtilizada),
          idLotePadre: d.idProductoIntermedio ? (completeSelectedParentLotId || undefined) : undefined
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
    view, editingItem, selectedRecipeId, setSelectedRecipeId, selectedRecipe,
    cantidadPlanificada, setCantidadPlanificada,
    fechaProduccion, setFechaProduccion,
    fechaVencimiento, setFechaVencimiento,
    completeFechaVencimiento, setCompleteFechaVencimiento,
    selectedVariants, bomSimulado, completeDetalles, setCompleteDetalles,
    handleOpenCreate, handleOpenComplete, handleCloseView,
    handleVariantChange, variantGroups, handleSubmitCreate, handleSubmitComplete,
    // Parent lot properties & methods
    availableParentLots, selectedParentLotId, setSelectedParentLotId,
    selectedParentLot, currentWipItem, parentLotsLoading,
    completeSelectedParentLotId, setCompleteSelectedParentLotId
  };
}
