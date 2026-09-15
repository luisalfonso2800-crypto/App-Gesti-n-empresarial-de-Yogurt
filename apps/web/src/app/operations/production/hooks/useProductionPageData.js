/**
 * @file useProductionPageData.js
 * @module operations/production/hooks
 * @description Hook orquestador de órdenes de producción, recetas, cálculo de BOM y liquidación de lotes.
 * @responsibility Administrar ciclo de vida de producción, disparador de órdenes de compra por faltantes y cierre de lote.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 * @dependencies react, @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useProductionPageData() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [creating, setCreating] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [qty, setQty] = useState(1);
  const [bom, setBom] = useState([]);
  const [bomLoading, setBomLoading] = useState(false);
  
  const [completeModal, setCompleteModal] = useState({ open: false, order: null, realQty: '' });
  const [realDetails, setRealDetails] = useState({});

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/production');
      setOrders(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipesAndProducts = async () => {
    try {
      const [recipesRes, productsRes] = await Promise.all([
        apiClient.get('/recipes').catch(() => []),
        apiClient.get('/products').catch(() => [])
      ]);
      setRecipes(recipesRes || []);
      setProducts(productsRes || []);
    } catch (e) {}
  };

  useEffect(() => {
    fetchOrders();
    fetchRecipesAndProducts();
  }, []);

  const loadBom = async () => {
    if (!selectedRecipe || !qty) return;
    setBomLoading(true);
    try {
      const res = await apiClient.get(`/production/recipe-bom/${selectedRecipe}?cantidad=${qty}`);
      setBom(res);
    } catch (e) {
      console.error(e);
    } finally {
      setBomLoading(false);
    }
  };

  useEffect(() => {
    if (creating) loadBom();
  }, [selectedRecipe, qty, creating]);

  const hasShortage = bom.some(b => b.faltante > 0);

  const startOrder = async (id) => {
    try {
      await apiClient.post(`/production/${id}/start`);
      fetchOrders();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCreateOrder = async (targetEstado = 'PLANIFICADA') => {
    try {
      const rec = recipes.find(r => r.id === selectedRecipe);
      await apiClient.post('/production', {
        idProducto: rec?.idProducto || selectedRecipe, 
        cantidadPlanificada: qty,
        fechaProduccion: new Date().toISOString(),
        estado: targetEstado,
        detalles: bom.map(b => ({
          idInsumo: b.idInsumo,
          idProductoIntermedio: b.idProductoIntermedio,
          cantidadTeorica: b.requeridoTeorico,
          unidad: b.unidad,
          costoTeorico: b.costoTeorico
        }))
      });
      setCreating(false);
      fetchOrders();
    } catch (e) {
      alert(e.message);
    }
  };

  const handlePurchaseShortage = async () => {
    try {
      const faltantes = bom.filter(b => b.faltante > 0).map(b => ({ idInsumo: b.idInsumo, faltante: b.faltante }));
      await apiClient.post('/production/create-purchase-order-from-shortage', { itemsFaltantes: faltantes });
      alert('Orden de Compra generada automáticamente. Revisa el módulo de compras.');
    } catch (e) {
      alert(e.message);
    }
  };

  const openComplete = (order) => {
    const rd = {};
    order.detalles?.forEach((d) => { rd[d.id] = d.cantidadTeorica; });
    setRealDetails(rd);
    setCompleteModal({ open: true, order, realQty: order.cantidadPlanificada });
  };

  const submitComplete = async () => {
    try {
      await apiClient.patch(`/production/${completeModal.order.id}/complete`, {
        cantidadProducidaReal: completeModal.realQty,
        detalles: Object.keys(realDetails).map(id => ({
          id,
          cantidadRealUtilizada: realDetails[id]
        }))
      });
      setCompleteModal({ open: false, order: null, realQty: '' });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('onboarding:refresh'));
        window.dispatchEvent(new Event('onboarding-refresh'));
      }
      fetchOrders();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleReportIncident = async ({ idProduccion, motivo, volumenRescatado, volumenPerdido, unidad, observaciones }) => {
    try {
      const ord = orders.find(o => o.id === idProduccion);
      const payloadDetalles = ord?.detalles?.map(d => ({
        id: d.id,
        cantidadRealUtilizada: d.cantidadTeorica
      })) || [];

      await apiClient.patch(`/production/${idProduccion}/complete`, {
        cantidadProducidaReal: volumenRescatado,
        detalles: payloadDetalles
      });
      fetchOrders();
    } catch (e) {
      alert(e.message);
    }
  };

  return {
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
    products,
    orphanProducts: (products || []).filter(
      (p) => (p.activo ?? true) && !recipes.some((r) => String(r.idProducto) === String(p.id))
    )
  };
}
