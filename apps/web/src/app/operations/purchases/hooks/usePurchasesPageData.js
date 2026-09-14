/**
 * @file usePurchasesPageData.js
 * @module operations/purchases/hooks
 * @description Hook orquestador de datos para PurchasesPage: compras históricas, órdenes activas, fusión y eliminación.
 * @responsibility Cargar datos del backend, calcular agrupaciones y administrar estados de modales auxiliares.
 * @usedBy apps/web/src/app/operations/purchases/page.jsx
 * @dependencies react, @/lib/api-client, @/context/NotificationContext, @/context/CartContext
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useNotification } from '@/context/NotificationContext';
import { useCart } from '@/context/CartContext';

export function usePurchasesPageData() {
  const { showNotification } = useNotification();
  const { refreshCart, lastUpdated } = useCart();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeOrders, setActiveOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const [isMergingMode, setIsMergingMode] = useState(false);
  const [selectedForMerge, setSelectedForMerge] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);
  const [editNameModalOpen, setEditNameModalOpen] = useState(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [editNameError, setEditNameError] = useState(null);
  const [isSubmittingEditName, setIsSubmittingEditName] = useState(false);

  const [groupedPurchases, setGroupedPurchases] = useState([]);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/purchases');
      setPurchases(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar compras históricas');
    }
    setLoading(false);
  };

  const fetchActiveOrders = async () => {
    try {
      const orders = await apiClient.get('/purchases/orders/active');
      setActiveOrders(orders || []);
    } catch (err) {
      console.warn('Advertencia: No se pudieron cargar las órdenes activas', err);
      setActiveOrders([]);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    fetchActiveOrders();
  }, [lastUpdated]);

  useEffect(() => {
    const grouped = [];
    const orderMap = new Map();

    purchases.forEach((compra) => {
      if (compra.idOrden) {
        if (!orderMap.has(compra.idOrden)) {
          orderMap.set(compra.idOrden, {
            id: compra.idOrden,
            isGrouped: true,
            orden: compra.orden,
            fechaCompra: compra.fechaCompra,
            total: 0,
            compras: [],
            detalles: []
          });
        }
        const group = orderMap.get(compra.idOrden);
        group.total += Number(compra.total);
        group.compras.push(compra);
        const mappedDetalles = (compra.detalles || []).map(d => ({ ...d, proveedor: d.proveedor || compra.proveedor }));
        group.detalles.push(...mappedDetalles);
        if (new Date(compra.fechaCompra) > new Date(group.fechaCompra)) {
          group.fechaCompra = compra.fechaCompra;
        }
      } else {
        grouped.push({
          id: compra.id,
          isGrouped: false,
          fechaCompra: compra.fechaCompra,
          total: Number(compra.total),
          detalles: (compra.detalles || []).map(d => ({ ...d, proveedor: d.proveedor || compra.proveedor })),
          compra: compra
        });
      }
    });

    grouped.push(...Array.from(orderMap.values()));
    grouped.sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra));

    setGroupedPurchases(grouped);
  }, [purchases]);

  const toggleRow = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleToggleMergeSelection = (id) => {
    setSelectedForMerge(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const executeMerge = async () => {
    if (selectedForMerge.length < 2) return;
    try {
      const resp = await apiClient.post('/purchases/orders/merge', { sourceOrderIds: selectedForMerge });
      showNotification(`Listas fusionadas exitosamente en ${resp.newOrder?.codigo}`, 'success');
      setIsMergingMode(false);
      setSelectedForMerge([]);
      refreshCart();
      fetchActiveOrders();
    } catch (e) {
      showNotification(e.message || 'Error al fusionar', 'error');
    }
  };
  
  const handleEditNameSubmit = async () => {
    if (!editNameModalOpen || !editNameValue.trim() || isSubmittingEditName) return;
    setIsSubmittingEditName(true);
    setEditNameError(null);
    try {
      const nombreFinal = `Lista de Compra - ${editNameValue.trim().toUpperCase()} - ${new Date().toLocaleDateString()}`;
      await apiClient.patch(`/purchases/orders/${editNameModalOpen}`, { nombre: nombreFinal });
      showNotification('Nombre actualizado', 'success');
      setEditNameModalOpen(null);
      setEditNameValue('');
      refreshCart();
      fetchActiveOrders();
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Error al actualizar nombre';
      setEditNameError(msg);
      showNotification(msg, 'error');
    } finally {
      setIsSubmittingEditName(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteModalOpen || isSubmittingDelete) return;
    setIsSubmittingDelete(true);
    setDeleteError(null);
    try {
      await apiClient.delete(`/purchases/orders/${deleteModalOpen}`);
      showNotification('Lista eliminada', 'success');
      setActiveOrders(prev => prev.filter(o => o.id !== deleteModalOpen));
      setDeleteModalOpen(null);
      refreshCart();
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Error al eliminar lista';
      setDeleteError(msg);
      showNotification(msg, 'error');
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  return {
    purchases,
    loading,
    error,
    activeOrders,
    expandedId,
    isMergingMode,
    selectedForMerge,
    deleteModalOpen,
    deleteError,
    isSubmittingDelete,
    editNameModalOpen,
    editNameValue,
    editNameError,
    isSubmittingEditName,
    groupedPurchases,
    toggleRow,
    handleToggleMergeSelection,
    executeMerge,
    handleEditNameSubmit,
    executeDelete,
    setIsMergingMode,
    setSelectedForMerge,
    setDeleteModalOpen,
    setDeleteError,
    setEditNameModalOpen,
    setEditNameValue,
    setEditNameError
  };
}
