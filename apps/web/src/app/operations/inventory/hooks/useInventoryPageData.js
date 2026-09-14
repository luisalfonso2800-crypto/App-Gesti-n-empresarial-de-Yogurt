/**
 * @file useInventoryPageData.js
 * @module operations/inventory/hooks
 * @description Hook orquestador de datos para InventoryPage: stock de bodega y cava, kpis, kárdex y ajustes.
 * @responsibility Cargar inventarios, calcular valorizaciones y procesar ajustes individuales.
 * @usedBy apps/web/src/app/operations/inventory/page.jsx
 * @dependencies react, @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useInventoryPageData() {
  const [activeTab, setActiveTab] = useState('INSUMOS');
  const [inventory, setInventory] = useState([]);
  const [finishedProducts, setFinishedProducts] = useState([]);
  const [metadata, setMetadata] = useState({ valorTotalBodega: 0, totalCriticos: 0, totalBajoMinimo: 0, totalReferencias: 0 });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [expandedId, setExpandedId] = useState(null);
  const [movements, setMovements] = useState({});
  const [loadingMovements, setLoadingMovements] = useState(false);

  const [isGlobalAdjustmentOpen, setIsGlobalAdjustmentOpen] = useState(false);
  const [adjustmentModal, setAdjustmentModal] = useState({ open: false, item: null, tipo: 'AJUSTE_POSITIVO', cantidad: '', motivo: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'INSUMOS') {
        const response = await apiClient.get('/inventory');
        setInventory(response.data || []);
        setMetadata(response.metadata || { valorTotalBodega: 0, totalCriticos: 0, totalBajoMinimo: 0, totalReferencias: 0 });
      } else if (activeTab === 'PRODUCTOS') {
        const data = await apiClient.get('/inventory/finished-products');
        setFinishedProducts(data || []);
      }
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchMovements = async (id) => {
    setLoadingMovements(true);
    try {
      const data = await apiClient.get(`/inventory/${id}/movements`);
      setMovements(prev => ({ ...prev, [id]: data }));
    } catch (err) {
      console.error('Error al cargar movimientos', err);
    } finally {
      setLoadingMovements(false);
    }
  };

  const handleToggleRow = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (!movements[id]) {
        fetchMovements(id);
      }
    }
  };

  const submitAdjustment = async () => {
    if (!adjustmentModal.motivo && ['AJUSTE_NEGATIVO', 'MERMA_DESPERDICIO'].includes(adjustmentModal.tipo)) {
      alert('Motivo requerido para salidas o mermas');
      return;
    }
    
    let cantidadAjuste = Number(adjustmentModal.cantidad);
    if (['AJUSTE_NEGATIVO', 'MERMA_DESPERDICIO', 'SALIDA_VENTA'].includes(adjustmentModal.tipo)) {
      cantidadAjuste = -Math.abs(cantidadAjuste);
    } else {
      cantidadAjuste = Math.abs(cantidadAjuste);
    }

    try {
      await apiClient.post('/inventory/adjustments', {
        idInsumo: activeTab === 'INSUMOS' ? adjustmentModal.item.idInsumo : undefined,
        idProducto: activeTab === 'PRODUCTOS' ? adjustmentModal.item.idProducto : undefined,
        cantidadAjuste,
        tipo: adjustmentModal.tipo,
        motivo: adjustmentModal.motivo || 'Ajuste manual'
      });
      setAdjustmentModal({ open: false, item: null, tipo: 'AJUSTE_POSITIVO', cantidad: '', motivo: '' });
      fetchData();
      if (expandedId) fetchMovements(expandedId);
    } catch (e) {
      alert('Error guardando ajuste');
    }
  };

  return {
    activeTab,
    setActiveTab,
    inventory,
    finishedProducts,
    metadata,
    loading,
    error,
    expandedId,
    movements,
    loadingMovements,
    isGlobalAdjustmentOpen,
    setIsGlobalAdjustmentOpen,
    adjustmentModal,
    setAdjustmentModal,
    handleToggleRow,
    submitAdjustment,
    fetchData
  };
}
