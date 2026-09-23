/**
 * @file useProductionPageData.js
 * @module operations/production/hooks
 * @description Hook orquestador de órdenes de producción, recetas, cálculo de BOM y liquidación de lotes.
 * @responsibility Administrar ciclo de vida de producción, disparador de órdenes de compra por faltantes y cierre de lote.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 * @dependencies react, @/lib/api-client
 */
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useNotification } from '@/context/NotificationContext';

export function useProductionPageData() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showNotification } = useNotification();
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

  useEffect(() => {
    const action = searchParams?.get('action');
    const productId = searchParams?.get('productId');
    if (action === 'new' || productId) {
      setCreating(true);
    }
  }, [searchParams]);

  const handleProduceProduct = useCallback((recipeId, baseYield) => {
    setSelectedRecipe(recipeId);
    if (baseYield && Number(baseYield) > 0) {
      setQty(Number(baseYield));
    }
    setCreating(true);
  }, []);

  const handleClosePlanning = useCallback(() => {
    setCreating(false);
    if (searchParams?.get('action') || searchParams?.get('productId')) {
      router.replace('/operations/production');
    }
  }, [router, searchParams]);

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
      showNotification(`Orden rechazada: ${e.message}`, 'error');
    }
  };

  const handlePurchaseShortage = async () => {
    try {
      const faltantes = bom.filter(b => b.faltante > 0).map(b => ({ idInsumo: b.idInsumo, faltante: b.faltante }));
      const res = await apiClient.post('/production/create-purchase-order-from-shortage', { itemsFaltantes: faltantes });
      setCreating(false);
      if (res?.id) {
        router.push(`/operations/purchases/new?orderId=${res.id}`);
      } else {
        router.push('/operations/purchases');
      }
    } catch (e) {
      showNotification(`Error al crear orden de compra: ${e.message}`, 'error');
    }
  };

  const openComplete = (order) => {
    const rd = {};
    order.detalles?.forEach((d) => { rd[d.id] = d.cantidadTeorica; });
    setRealDetails(rd);
    setCompleteModal({ open: true, order, realQty: order.cantidadPlanificada });
  };

  const submitComplete = async (reservaOverride = null, fechaVencimientoOverride = null, explicitOrderId = null) => {
    try {
      const orderId = explicitOrderId || completeModal.order?.id;
      if (!orderId) {
        throw new Error('Identificador de orden de producción no proporcionado o inválido');
      }
      const currentOrder = completeModal.order;
      const reserva = reservaOverride !== null ? reservaOverride : (completeModal.reservaInoculo || null);

      // Extraer estrategia de asignación de inóculo definida en la orden
      const estrategia = currentOrder?.asignacionInoculo || currentOrder?.estrategiaInoculo || currentOrder?.detalles?.find(d => d.idProductoIntermedio)?.asignacionInoculo;
      let desgloseLotes = null;

      if (estrategia?.modo === 'MEZCLA' && Array.isArray(estrategia.lotes)) {
        desgloseLotes = estrategia.lotes
          .filter(l => l.idLote && Number(l.cantidad) > 0)
          .map(l => ({ idLote: l.idLote, litrosADescontar: Number(l.cantidad) }));
      } else if (estrategia?.modo === 'LOTE_UNICO' && estrategia.idLote) {
        const detWip = currentOrder?.detalles?.find(d => d.idProductoIntermedio);
        const totalWip = Number(realDetails[detWip?.id] ?? detWip?.cantidadTeorica ?? 0);
        desgloseLotes = [{ idLote: estrategia.idLote, litrosADescontar: totalWip }];
      }

      await apiClient.patch(`/production/${orderId}/complete`, {
        id: orderId,
        idProduccion: orderId,
        reservarInoculo: Boolean(reserva?.activo),
        cantidadProducidaReal: completeModal.realQty,
        fechaVencimiento: fechaVencimientoOverride || completeModal.fechaVencimiento || null,
        reservaInoculo: reserva,
        desgloseLotes,
        detalles: Object.keys(realDetails).map(id => ({
          id,
          cantidadRealUtilizada: realDetails[id]
        }))
      });
      setCompleteModal({ open: false, order: null, realQty: '', reservaInoculo: null });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('onboarding:refresh'));
        window.dispatchEvent(new Event('onboarding-refresh'));
      }
      fetchOrders();
    } catch (e) {
      showNotification(`Error al finalizar orden: ${e.message}`, 'error');
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
      showNotification(`Error al reportar incidente: ${e.message}`, 'error');
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
    handleProduceProduct,
    handleClosePlanning,
    products,
    orphanProducts: (products || []).filter(
      (p) => (p.activo ?? true) && !recipes.some((r) => String(r.idProducto) === String(p.id))
    )
  };
}
