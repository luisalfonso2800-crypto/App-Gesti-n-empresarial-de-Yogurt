/**
 * @file CartContext.jsx
 * @module context/CartContext
 * @description Contexto global para manejar el carrito sincronizado de compras multi-lista.
 * @responsibility Proveer estado reactivo multi-lista sincronizado con el backend (PostgreSQL).
 *   PROHIBIDO generar IDs locales tipo "local-" para entidades que deban persistir en base de datos.
 *   Toda orden nueva se crea inmediatamente en backend y usa el UUID real retornado por Prisma.
 * @usedBy apps/web/src/app/layout.jsx, Header.jsx, useCartManager.js
 * @dependencies react, @/lib/api-client
 */
'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [lists, setLists] = useState({});
  const [activeListId, setActiveListId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  /**
   * Normaliza una orden retornada por el backend al formato interno del contexto.
   * @param {Object} order - Orden cruda del backend
   * @returns {Object} - Lista normalizada para el estado local
   */
  const normalizeOrder = useCallback((order) => ({
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
  }), []);

  /**
   * Descarga las órdenes activas del backend y sincroniza el estado local.
   * Preserva la lista activa si aún existe después del refresco.
   */
  const fetchActiveOrders = useCallback(async () => {
    try {
      setIsSyncing(true);
      const orders = await apiClient.get('/purchases/orders/active');
      if (orders && orders.length > 0) {
        const newLists = {};
        orders.forEach(order => {
          newLists[order.id] = normalizeOrder(order);
        });
        setLists(newLists);

        // Preservar la lista activa si todavía existe en el backend
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
    } finally {
      setIsSyncing(false);
      setLastUpdated(Date.now());
    }
  }, [normalizeOrder]);

  // Carga inicial al montar el provider
  useEffect(() => {
    fetchActiveOrders();
  }, [fetchActiveOrders]);

  /**
   * Actualiza el estado local de listas y la lista activa, sincronizando sessionStorage.
   * @param {Object} newLists    - Nuevo mapa de listas
   * @param {string} newActiveId - ID de la lista que debe quedar activa
   */
  const saveState = useCallback((newLists, newActiveId) => {
    setLists(newLists);
    setActiveListId(newActiveId);
    setLastUpdated(Date.now());
    if (newActiveId) {
      sessionStorage.setItem('activeListId', newActiveId);
    } else {
      sessionStorage.removeItem('activeListId');
    }
  }, []);

  /**
   * Crea una nueva orden de compra PERSISTIDA en PostgreSQL via POST /purchases/orders.
   * La respuesta del backend contiene el UUID real y el consecutivo (ORD-2026-XXXX).
   * PROHIBIDO usar IDs locales tipo "local-" para ninguna entidad persistida.
   *
   * @param {string} customName - Nombre personalizado de la lista (sufijo del nombre formal)
   * @returns {string|null} - UUID real de la orden creada, o null si hubo error
   */
  const createList = useCallback(async (customName = 'Nueva Lista') => {
    try {
      // Generar el nombre formal consistente con el patrón de la aplicación
      const nombreFormal = `Lista de Compra - ${customName} - ${new Date().toLocaleDateString()}`;

      // Persistir en backend: acepta items: [] (orden vacía inicial)
      const newOrder = await apiClient.post('/purchases/orders', {
        nombre: nombreFormal,
        items: [],
      });

      if (!newOrder || !newOrder.id) {
        throw new Error('El backend no retornó un ID válido para la nueva orden');
      }

      // Añadir la nueva orden al estado local usando el UUID real de Prisma
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
  }, [normalizeOrder]);

  /**
   * Elimina una lista. Si tiene UUID real (no local), llama al backend.
   * Activa la siguiente lista disponible o limpia el estado.
   * @param {string} id - UUID de la lista a eliminar
   */
  const deleteList = useCallback(async (id) => {
    // Solo órdenes locales residuales (no deberían existir tras esta corrección,
    // pero se mantiene la guarda defensiva)
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

  /**
   * Establece la lista activa por ID. Solo permite IDs que existan en el estado actual.
   * @param {string} id - UUID de la lista a activar
   */
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

  const activeList = activeListId && lists[activeListId] ? lists[activeListId] : null;
  const cartItems = activeList ? activeList.items : [];

  /**
   * Añade un ítem al estado local de la lista indicada.
   * La persistencia real en backend ocurre cuando el usuario confirma "Preparar Orden"
   * o cuando el ítem se transfiere vía moveItem.
   * Previene duplicados usando la tripla (idInsumo, idPresentacion, idProveedor).
   *
   * @param {Object} item      - Ítem normalizado a añadir
   * @param {string} listId    - UUID de la lista destino (default: activeListId)
   */
  const addToCart = useCallback((item, listId) => {
    const targetId = listId || activeListId;
    if (!targetId) return;

    setLists(prev => {
      if (!prev[targetId]) return prev;
      const key = `${item.insumoId || item.idInsumo}_${item.presentacionId || item.idPresentacion}_${item.proveedorId || item.idProveedor}`;
      const existing = prev[targetId].items.find(t =>
        `${t.insumoId || t.idInsumo}_${t.presentacionId || t.idPresentacion}_${t.proveedorId || t.idProveedor}` === key
      );
      if (existing) return prev; // No duplicar
      const newLists = { ...prev };
      newLists[targetId] = {
        ...newLists[targetId],
        items: [...newLists[targetId].items, item],
      };
      return newLists;
    });
    setLastUpdated(Date.now());
  }, [activeListId]);

  /**
   * Elimina un ítem del estado local de la lista indicada.
   * @param {string} id     - ID del ítem a eliminar
   * @param {string} listId - UUID de la lista (default: activeListId)
   */
  const removeFromCart = useCallback((id, listId) => {
    const targetId = listId || activeListId;
    if (!targetId) return;
    setLists(prev => {
      if (!prev[targetId]) return prev;
      const newLists = { ...prev };
      newLists[targetId] = {
        ...newLists[targetId],
        items: newLists[targetId].items.filter(item => item.id !== id),
      };
      return newLists;
    });
    setLastUpdated(Date.now());
  }, [activeListId]);

  /**
   * Vacía todos los ítems de la lista indicada en el estado local.
   * @param {string} listId - UUID de la lista (default: activeListId)
   */
  const clearCart = useCallback((listId) => {
    const targetId = listId || activeListId;
    if (!targetId) return;
    setLists(prev => {
      if (!prev[targetId]) return prev;
      const newLists = { ...prev };
      newLists[targetId] = { ...newLists[targetId], items: [] };
      return newLists;
    });
    setLastUpdated(Date.now());
  }, [activeListId]);

  /** Fuerza una sincronización completa con el backend */
  const refreshCart = useCallback(() => {
    fetchActiveOrders();
  }, [fetchActiveOrders]);

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider value={{
      lists, activeListId, activeList, cartItems, isSyncing, lastUpdated,
      createList, deleteList, setActiveList,
      addToCart, removeFromCart, clearCart, refreshCart, cartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
