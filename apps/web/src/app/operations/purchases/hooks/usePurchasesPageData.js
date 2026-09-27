/**
 * @file usePurchasesPageData.js
 * @module operations/purchases/hooks
 * @description Hook orquestador de datos para PurchasesPage: compras históricas, órdenes activas, filtros, KPIs y paginación.
 * @responsibility Cargar datos del backend, calcular agrupaciones, métricas, filtros reactivos y paginación (10/pág).
 * @usedBy apps/web/src/app/operations/purchases/page.jsx
 * @dependencies react, @/lib/api-client, @/context/NotificationContext, @/context/CartContext
 */
import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';
import { useNotification } from '@/context/NotificationContext';
import { useCart } from '@/context/CartContext';

const PAGE_SIZE = 10;

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

  // Estados de filtrado, métricas y paginación
  const [filterSearch, setFilterSearch] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMetricDetail, setActiveMetricDetail] = useState(null);

  const [groupedPurchases, setGroupedPurchases] = useState([]);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/purchases');
      setPurchases(data || []);
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

  // Reset de página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filterSearch, filterSupplier, filterStatus]);

  // Lista única de proveedores para el filtro
  const suppliersList = useMemo(() => {
    const seen = new Set();
    const list = [];
    groupedPurchases.forEach(g => {
      g.detalles?.forEach(d => {
        const provName = d.proveedor?.nombre || d.idProveedor;
        if (provName && !seen.has(String(provName))) {
          seen.add(String(provName));
          list.push({ nombre: String(provName), nit: d.proveedor?.nit || '' });
        }
      });
    });
    return list.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [groupedPurchases]);

  // Métricas globales del módulo de compras
  const globalMetrics = useMemo(() => {
    const totalPurchases = groupedPurchases.length;
    let totalSpent = 0;
    let completedPurchasesCount = 0;

    groupedPurchases.forEach(g => {
      totalSpent += Number(g.total) || 0;
      const orden = g.orden;
      let isCompleted = true;
      if (g.isGrouped && orden) {
        const totalItemsInOrder = orden.items ? orden.items.length : 0;
        const conseguidosCount = g.detalles.length;
        if (totalItemsInOrder > conseguidosCount) {
          isCompleted = false;
        }
      }
      if (isCompleted) completedPurchasesCount++;
    });

    return {
      totalPurchases,
      totalSpent,
      completedPurchasesCount,
      activeOrdersCount: activeOrders.length,
      uniqueSuppliersCount: suppliersList.length
    };
  }, [groupedPurchases, activeOrders, suppliersList]);

  // Filtrado reactivo de compras
  const filteredPurchases = useMemo(() => {
    return groupedPurchases.filter(group => {
      const orden = group.orden;
      let isCompleted = true;
      if (group.isGrouped && orden) {
        const totalItemsInOrder = orden.items ? orden.items.length : 0;
        const conseguidosCount = group.detalles.length;
        if (totalItemsInOrder > conseguidosCount) {
          isCompleted = false;
        }
      }

      // 1. Filtro Estado
      if (filterStatus === 'COMPLETADA' && !isCompleted) return false;
      if (filterStatus === 'PARCIAL' && isCompleted) return false;

      // 2. Filtro Proveedor
      if (filterSupplier) {
        const hasSupplier = group.detalles?.some(d => {
          const provName = d.proveedor?.nombre || d.idProveedor;
          return String(provName) === String(filterSupplier);
        });
        if (!hasSupplier) return false;
      }

      // 3. Filtro Búsqueda
      if (filterSearch) {
        const term = filterSearch.toLowerCase().trim();
        const title = group.isGrouped && orden ? `${orden.codigo} ${orden.nombre}` : `Compra Directa ${group.id}`;
        const matchTitle = title.toLowerCase().includes(term);
        const matchDetail = group.detalles?.some(d => {
          const insName = d.insumo?.nombre || d.idInsumo || '';
          const provName = d.proveedor?.nombre || d.idProveedor || '';
          return String(insName).toLowerCase().includes(term) || String(provName).toLowerCase().includes(term);
        });
        if (!matchTitle && !matchDetail) return false;
      }

      return true;
    });
  }, [groupedPurchases, filterStatus, filterSupplier, filterSearch]);

  // Paginación fija de 10 elementos
  const totalPages = Math.max(1, Math.ceil(filteredPurchases.length / PAGE_SIZE));
  const paginatedPurchases = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPurchases.slice(start, start + PAGE_SIZE);
  }, [filteredPurchases, currentPage]);

  const hasFilters = Boolean(filterSearch || filterSupplier || filterStatus !== 'TODOS');
  const clearFilters = () => {
    setFilterSearch('');
    setFilterSupplier('');
    setFilterStatus('TODOS');
  };

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
    purchases, loading, error, activeOrders, expandedId, isMergingMode, selectedForMerge,
    deleteModalOpen, deleteError, isSubmittingDelete, editNameModalOpen, editNameValue,
    editNameError, isSubmittingEditName, groupedPurchases, toggleRow, handleToggleMergeSelection,
    executeMerge, handleEditNameSubmit, executeDelete, setIsMergingMode, setSelectedForMerge,
    setDeleteModalOpen, setDeleteError, setEditNameModalOpen, setEditNameValue, setEditNameError,
    // Nuevas propiedades de filtrado, KPIs y paginación
    filterSearch, setFilterSearch,
    filterSupplier, setFilterSupplier,
    filterStatus, setFilterStatus,
    hasFilters, clearFilters,
    filteredCount: filteredPurchases.length,
    paginatedPurchases,
    currentPage, setCurrentPage,
    totalPages, PAGE_SIZE,
    globalMetrics, suppliersList,
    activeMetricDetail, setActiveMetricDetail
  };
}
