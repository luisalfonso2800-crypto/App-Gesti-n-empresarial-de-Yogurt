/**
 * @file useHeaderCart.js
 * @module components/shell/parts
 * @description Hook de estado, control de modales y preparación de compras para Header.
 * @responsibility Administrar interacción del carrito multi-lista, edición de nombres y eliminación.
 * @usedBy apps/web/src/components/shell/Header.jsx
 * @dependencies react, next/navigation, @/context/CartContext, @/context/NotificationContext, @/lib/api-client
 */
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useNotification } from '@/context/NotificationContext';
import { apiClient } from '@/lib/api-client';

export function useHeaderCart() {
  const router = useRouter();
  const { 
    lists, 
    activeListId, 
    activeList, 
    cartItems, 
    cartCount, 
    setActiveList, 
    removeFromCart, 
    clearCart, 
    createList, 
    refreshCart, 
    isSyncing, 
    deleteList 
  } = useCart();
  
  const { showNotification } = useNotification();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);

  const [listToDelete, setListToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  const [editNameModalOpen, setEditNameModalOpen] = useState(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [editNameError, setEditNameError] = useState(null);
  const [isSubmittingEditName, setIsSubmittingEditName] = useState(false);
  const [isCreatingList, setIsCreatingList] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditNameSubmit = async () => {
    if (!editNameModalOpen || !editNameValue.trim() || isSubmittingEditName) return;
    setIsSubmittingEditName(true);
    setEditNameError(null);
    try {
      const nombreFinal = `Lista de Compra - ${editNameValue.trim().toUpperCase()} - ${new Date().toLocaleDateString()}`;
      if (!editNameModalOpen.startsWith('local-')) {
        await apiClient.patch(`/purchases/orders/${editNameModalOpen}`, { nombre: nombreFinal });
      }
      showNotification('Nombre actualizado', 'success');
      setEditNameModalOpen(null);
      setEditNameValue('');
      refreshCart();
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Error al actualizar nombre';
      setEditNameError(msg);
      showNotification(msg, 'error');
    } finally {
      setIsSubmittingEditName(false);
    }
  };

  const handleDeleteList = async () => {
    if (!listToDelete || isSubmittingDelete) return;
    setIsSubmittingDelete(true);
    setDeleteError(null);
    try {
      if (!listToDelete.startsWith('local-')) {
        await apiClient.delete(`/purchases/orders/${listToDelete}`);
      } else {
        deleteList(listToDelete);
      }
      showNotification('Lista eliminada correctamente', 'success');
      setListToDelete(null);
      refreshCart();
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Error al eliminar lista';
      setDeleteError(msg);
      showNotification(msg, 'error');
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  const proceedToPurchase = async () => {
    if (!activeListId || !activeList) return;
    try {
      if (activeListId.startsWith('local-')) {
        const payload = {
          nombre: activeList.name,
          items: cartItems.map(item => ({
            insumoId: item.insumoId || item.idInsumo || item.id,
            proveedorId: item.proveedorId || item.idProveedor,
            presentacionId: item.presentacionId || item.idPresentacion || null,
            cantidad: Number(item.cantidad || 1),
            precioEstimado: Number(item.precioEmpaque || item.precio || item.precioEstimado || item.costoUnidadBase || 0)
          }))
        };
        const order = await apiClient.post('/purchases/orders', payload);
        refreshCart();
        router.push(`/operations/purchases/new?orderId=${order.id}`);
      } else {
        router.push(`/operations/purchases/new?orderId=${activeListId}`);
      }
      setIsCartOpen(false);
    } catch (e) {
      showNotification(e.message || 'Error al preparar la orden.', 'error');
      setIsCartOpen(false);
    }
  };

  return {
    lists,
    activeListId,
    activeList,
    cartCount,
    isSyncing,
    isCartOpen,
    setIsCartOpen,
    cartRef,
    listToDelete,
    setListToDelete,
    deleteError,
    setDeleteError,
    isSubmittingDelete,
    editNameModalOpen,
    setEditNameModalOpen,
    editNameValue,
    setEditNameValue,
    editNameError,
    setEditNameError,
    isSubmittingEditName,
    isCreatingList,
    createList,
    setActiveList,
    removeFromCart,
    clearCart,
    proceedToPurchase,
    handleEditNameSubmit,
    handleDeleteList,
    showNotification
  };
}
