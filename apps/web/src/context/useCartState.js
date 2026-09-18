/**
 * @file useCartState.js
 * @module context/useCartState
 * @description Hook de lógica interna para CartProvider: estado reactivo y sincronización de órdenes activas.
 * @responsibility Manejar listas, lista activa, sincronización con el backend y persistencia en sessionStorage.
 * @usedBy apps/web/src/context/CartContext.jsx
 * @dependencies react, @/lib/api-client
 */
'use client';
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

/**
 * Normaliza una orden retornada por el backend al formato interno del carrito.
 * @param {Object} order - Orden cruda del backend
 * @returns {Object} - Lista normalizada para el estado local
 */
export const normalizeOrder = (order) => ({
  id: order.id,
  name: `${order.codigo} - ${order.nombre}`,
  customName: order.nombre,
  codigo: order.codigo,
  estado: order.estado,
  createdAt: order.createdAt || order.fechaCreacion || new Date().toISOString(),
  items: (order.items || []).map(i => ({
    id: i.id,
    insumoId: i.idInsumo,
    proveedorId: i.idProveedor,
    presentacionId: i.idPresentacion,
    cantidad: i.cantidad,
    estadoItem: i.estadoItem,
    precioEstimado: i.precioEstimado,
    insumo: i.insumo,
    proveedor: i.proveedor,
    presentacion: i.presentacion,
  })),
});

export function useCartState() {
  const [lists, setLists] = useState({});
  const [activeListId, setActiveListId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const fetchActiveOrders = useCallback(async () => {
    try {
      setIsSyncing(true);
      let orders = [];
      try {
        const res = await apiClient.get('/purchases/orders/active');
        orders = Array.isArray(res) ? res : [];
      } catch (err) {
        console.warn('[CartContext] Servidor de planta no disponible, iniciando carrito vacío local.');
        orders = [];
      }

      if (orders && orders.length > 0) {
        const newLists = {};
        orders.forEach(order => {
          newLists[order.id] = normalizeOrder(order);
        });
        setLists(newLists);

        const storedActiveId = sessionStorage.getItem('activeListId');
        if (storedActiveId && newLists[storedActiveId]) {
          setActiveListId(storedActiveId);
        } else {
          setActiveListId(orders[0].id);
          sessionStorage.setItem('activeListId', orders[0].id);
        }
      } else {
        setLists({});
        setActiveListId(null);
        sessionStorage.removeItem('activeListId');
      }
    } catch (e) {
      console.error('Error fetching active orders for cart sync:', e);
      setLists({});
      setActiveListId(null);
    } finally {
      setIsSyncing(false);
      setLastUpdated(Date.now());
    }
  }, []);

  useEffect(() => {
    fetchActiveOrders();
  }, [fetchActiveOrders]);

  const createList = useCallback(async (customName = 'Nueva Lista') => {
    try {
      const nombreFormal = `Lista de Compra - ${customName} - ${new Date().toLocaleDateString()}`;
      const newOrder = await apiClient.post('/purchases/orders', {
        nombre: nombreFormal,
        items: [],
      });

      if (!newOrder || !newOrder.id) {
        throw new Error('El backend no retornó un ID válido para la nueva orden');
      }

      const normalized = normalizeOrder(newOrder);
      setLists(prev => ({ ...prev, [newOrder.id]: normalized }));
      setActiveListId(newOrder.id);
      sessionStorage.setItem('activeListId', newOrder.id);
      setLastUpdated(Date.now());
      return newOrder.id;
    } catch (e) {
      console.error('Error al crear lista en backend:', e);
      return null;
    }
  }, []);

  const deleteList = useCallback(async (id) => {
    if (!id.startsWith('local-')) {
      try {
        await apiClient.delete(`/purchases/orders/${id}`);
      } catch (e) {
        console.error('Error al eliminar lista en backend:', e);
      }
    }
    setLists(prev => {
      const newLists = { ...prev };
      delete newLists[id];
      const newActiveId = activeListId === id ? (Object.keys(newLists)[0] || null) : activeListId;
      if (newActiveId) {
        sessionStorage.setItem('activeListId', newActiveId);
      } else {
        sessionStorage.removeItem('activeListId');
      }
      setActiveListId(newActiveId);
      setLastUpdated(Date.now());
      return newLists;
    });
  }, [activeListId]);

  const setActiveList = useCallback((id) => {
    setLists(prev => {
      if (prev[id]) {
        setActiveListId(id);
        sessionStorage.setItem('activeListId', id);
        setLastUpdated(Date.now());
      }
      return prev;
    });
  }, []);

  return {
    lists,
    setLists,
    activeListId,
    setActiveListId,
    isSyncing,
    lastUpdated,
    setLastUpdated,
    fetchActiveOrders,
    createList,
    deleteList,
    setActiveList,
  };
}
