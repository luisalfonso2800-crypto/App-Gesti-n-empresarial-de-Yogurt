/**
 * @file cartOperations.js
 * @module catalog/supplier-prices/hooks
 * @description Operaciones de adición, remoción y persistencia del carrito multi-lista.
 * @responsibility Ejecutar llamadas API y despacho de notificaciones toast para compra de insumos.
 * @usedBy apps/web/src/app/catalog/supplier-prices/hooks/useCartManager.jsx
 */
import React from 'react';
import { apiClient } from '@/lib/api-client';
import { CartToastMessage } from '../components/parts/CartToastMessage';
import { buildCartItem, findExistingCartItem } from './cartManagerHelpers';

export async function executeItemMove(cartItem, fromListId, toListId, toListName, { refreshCart, showNotification, setIsSelectorOpen, setPendingItem, setIsMoving }) {
  try {
    setIsMoving(true);
    if (!cartItem.itemId) throw new Error('El ítem aún no tiene un ID persistido.');
    await apiClient.post('/purchases/items/move', { itemId: cartItem.itemId, fromOrderId: fromListId, toOrderId: toListId });
    await refreshCart();
    showNotification(`Ítem transferido exitosamente a ${toListName}`, 'success');
    setIsSelectorOpen(false);
    setPendingItem(null);
  } catch (e) {
    showNotification(e.message || 'Error al transferir el ítem', 'error');
  } finally {
    setIsMoving(false);
  }
}

export async function toggleItemInList(item, targetListId, customLists, deps) {
  const { cartItems, lists, addToCart, removeFromCart, refreshCart, showNotification, pauseNotification, resumeNotification, handleChangeList, isMoving } = deps;
  const existing = findExistingCartItem(cartItems, item);
  if (existing) {
    try {
      await apiClient.delete(`/purchases/orders/${targetListId}/items/${existing.id}`);
      removeFromCart(existing.id, targetListId);
      refreshCart();
      showNotification('Ítem removido de la lista de compra', 'info');
    } catch (error) {
      showNotification('Error al remover el ítem de la lista', 'error');
    }
    return;
  }

  const newItem = buildCartItem(item);
  addToCart(newItem, targetListId);
  const contextLists = customLists || lists;
  const listName = contextLists[targetListId]?.customName || contextLists[targetListId]?.name || 'Lista Activa';
  const activeBackendLists = Object.values(contextLists).filter(l => !l.id.startsWith('local-'));
  const hasMultipleLists = activeBackendLists.length > 1;

  const renderToast = (isReady, savedItem = null) => (
    <CartToastMessage
      listName={listName}
      hasMultipleLists={hasMultipleLists}
      isReady={isReady}
      isMoving={isMoving}
      savedItem={savedItem}
      targetListId={targetListId}
      onPause={pauseNotification}
      onResume={resumeNotification}
      onChangeList={handleChangeList}
    />
  );

  showNotification(renderToast(false), 'success');

  try {
    const persisted = await apiClient.post(`/purchases/orders/${targetListId}/items`, {
      idInsumo: newItem.idInsumo,
      idProveedor: newItem.idProveedor,
      idPresentacion: newItem.idPresentacion,
      cantidad: 1,
      precioEstimado: newItem.precioCompra
    });
    showNotification(renderToast(true, { ...newItem, itemId: persisted.id }), 'success');
    refreshCart();
  } catch (error) {
    showNotification('Error al guardar el ítem en la lista de compra', 'error');
  }
}
