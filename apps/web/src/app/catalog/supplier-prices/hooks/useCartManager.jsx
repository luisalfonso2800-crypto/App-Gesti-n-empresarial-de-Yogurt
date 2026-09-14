/**
 * @file useCartManager.jsx
 * @module catalog/supplier-prices/hooks
 * @description Hook puente para conectar la tabla de lista de precios con el carrito multi-lista (SRP < 120 líneas, cero inline styles).
 * @responsibility Gestionar altas, bajas y transferencias de insumos entre órdenes de compra.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies @/context/CartContext, @/context/NotificationContext, next/navigation, ../components/parts/MoveListModal, ./cartManagerHelpers, ./cartOperations
 */
'use client';
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useNotification } from '@/context/NotificationContext';
import { MoveListModal } from '../components/parts/MoveListModal';
import { buildCartItem, findExistingCartItem } from './cartManagerHelpers';
import { executeItemMove, toggleItemInList } from './cartOperations';

export function useCartManager() {
  const router = useRouter();
  const { lists, activeListId, cartItems, addToCart, removeFromCart, clearCart, refreshCart, createList } = useCart();
  const { showNotification, pauseNotification, resumeNotification } = useNotification();

  const [pendingItem, setPendingItem] = useState(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const executeMove = useCallback((cartItem, fromListId, toListId, toListName) => {
    return executeItemMove(cartItem, fromListId, toListId, toListName, {
      refreshCart, showNotification, setIsSelectorOpen, setPendingItem, setIsMoving
    });
  }, [refreshCart, showNotification]);

  const handleChangeList = useCallback((addedItem, fromListId) => {
    const backendLists = Object.values(lists).filter(l => !l.id.startsWith('local-'));
    const otherLists = backendLists.filter(l => l.id !== fromListId);
    if (otherLists.length === 0) {
      showNotification('No hay otras listas activas disponibles. Crea una nueva lista desde el carrito.', 'error');
      return;
    }
    if (otherLists.length === 1) {
      executeMove(addedItem, fromListId, otherLists[0].id, otherLists[0].name);
    } else {
      setPendingItem({ item: addedItem, fromListId });
      setIsSelectorOpen(true);
    }
  }, [lists, executeMove, showNotification]);

  const handleToggleWithList = useCallback((item, targetListId, customLists = null) => {
    return toggleItemInList(item, targetListId, customLists, {
      cartItems, lists, addToCart, removeFromCart, refreshCart,
      showNotification, pauseNotification, resumeNotification, handleChangeList, isMoving
    });
  }, [cartItems, lists, addToCart, removeFromCart, refreshCart, showNotification, pauseNotification, resumeNotification, handleChangeList, isMoving]);

  const togglePurchaseItem = useCallback(async (item) => {
    const existing = findExistingCartItem(cartItems, item);
    if (existing) return handleToggleWithList(item, activeListId);
    
    const listsKeys = Object.keys(lists);
    if (listsKeys.length > 1 && !activeListId) {
      setPendingItem({ item: buildCartItem(item), fromListId: null });
      setIsSelectorOpen(true);
    } else if (listsKeys.length === 0 || !activeListId) {
      try {
        const newListId = await createList('');
        if (newListId) {
          handleToggleWithList(item, newListId, { ...lists, [newListId]: { id: newListId, name: 'Nueva Lista', customName: '' } });
        } else {
          showNotification('Error al crear la lista automáticamente', 'error');
        }
      } catch (err) {
        showNotification('Error al crear la lista automáticamente', 'error');
      }
    } else {
      handleToggleWithList(item, activeListId);
    }
  }, [cartItems, lists, activeListId, handleToggleWithList, createList, showNotification]);

  const clearPurchaseList = useCallback(() => {
    if (!activeListId || cartItems.length === 0) return;
    clearCart(activeListId);
    showNotification('Se vació la lista de compra actual', 'info');
  }, [clearCart, activeListId, cartItems.length, showNotification]);

  const proceedToPurchase = useCallback(() => {
    router.push(activeListId ? `/operations/purchases/new?orderId=${activeListId}` : '/operations/purchases/new');
  }, [activeListId, router]);

  const MoveListModalComponent = (
    <MoveListModal
      isOpen={isSelectorOpen}
      onClose={() => { setIsSelectorOpen(false); setPendingItem(null); }}
      pendingItem={pendingItem}
      activeListId={activeListId}
      lists={lists}
      isMoving={isMoving}
      onConfirmMove={executeMove}
    />
  );

  return {
    selectedForPurchase: cartItems,
    togglePurchaseItem,
    clearPurchaseList,
    proceedToPurchase,
    isSelectorOpen,
    setIsSelectorOpen,
    pendingItem,
    handleToggleWithList,
    MoveListModal: MoveListModalComponent,
  };
}
