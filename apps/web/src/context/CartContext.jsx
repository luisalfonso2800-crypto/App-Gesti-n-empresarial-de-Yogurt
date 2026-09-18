/**
 * @file CartContext.jsx
 * @module context/CartContext
 * @description Contexto global para manejar el carrito sincronizado de compras multi-lista.
 * @responsibility Proveer estado reactivo multi-lista sincronizado con el backend (PostgreSQL).
 * @usedBy apps/web/src/app/layout.jsx, Header.jsx, useCartManager.js
 * @dependencies react, @/context/useCartState
 */
'use client';
import React, { createContext, useContext, useCallback } from 'react';
import { useCartState } from './useCartState';

const CartContext = createContext();

export function CartProvider({ children }) {
  const {
    lists,
    setLists,
    activeListId,
    isSyncing,
    lastUpdated,
    setLastUpdated,
    fetchActiveOrders,
    createList,
    deleteList,
    setActiveList,
  } = useCartState();

  const activeList = activeListId && lists[activeListId] ? lists[activeListId] : null;
  const cartItems = activeList ? activeList.items : [];

  const addToCart = useCallback((item, listId) => {
    const targetId = listId || activeListId;
    if (!targetId) return;

    setLists(prev => {
      if (!prev[targetId]) return prev;
      const key = `${item.insumoId || item.idInsumo}_${item.presentacionId || item.idPresentacion}_${item.proveedorId || item.idProveedor}`;
      const existing = prev[targetId].items.find(t =>
        `${t.insumoId || t.idInsumo}_${t.presentacionId || t.idPresentacion}_${t.proveedorId || t.idProveedor}` === key
      );
      if (existing) return prev;
      return {
        ...prev,
        [targetId]: {
          ...prev[targetId],
          items: [...prev[targetId].items, item],
        },
      };
    });
    setLastUpdated(Date.now());
  }, [activeListId, setLists, setLastUpdated]);

  const removeFromCart = useCallback((id, listId) => {
    const targetId = listId || activeListId;
    if (!targetId) return;
    setLists(prev => {
      if (!prev[targetId]) return prev;
      return {
        ...prev,
        [targetId]: {
          ...prev[targetId],
          items: prev[targetId].items.filter(item => item.id !== id),
        },
      };
    });
    setLastUpdated(Date.now());
  }, [activeListId, setLists, setLastUpdated]);

  const clearCart = useCallback((listId) => {
    const targetId = listId || activeListId;
    if (!targetId) return;
    setLists(prev => {
      if (!prev[targetId]) return prev;
      return {
        ...prev,
        [targetId]: { ...prev[targetId], items: [] },
      };
    });
    setLastUpdated(Date.now());
  }, [activeListId, setLists, setLastUpdated]);

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
