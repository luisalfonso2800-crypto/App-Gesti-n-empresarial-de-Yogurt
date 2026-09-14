/**
 * @file useChecklistItemActions.js
 * @module operations/purchases/new/hooks
 * @description Hook con la lógica de negocio y llamadas de API para un ítem del checklist.
 * @responsibility Mover a otra lista, registrar motivos y asentar compra como conseguida.
 * @usedBy apps/web/src/app/operations/purchases/new/components/ChecklistItemRow.jsx
 * @dependencies React, apiClient, CartContext, NotificationContext
 */
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useCart } from '@/context/CartContext';
import { useNotification } from '@/context/NotificationContext';

export function useChecklistItemActions({
  item,
  checklistMgr,
  proveedoresDB,
  setPendingItems,
  setComprasAsentadas
}) {
  const { updateChecklistItem, checklistItems, setChecklistItems, simulationResult } = checklistMgr;
  const { lists, refreshCart } = useCart();
  const { showNotification } = useNotification();
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedTargetList, setSelectedTargetList] = useState('');
  const [moveError, setMoveError] = useState(null);
  const [isMoving, setIsMoving] = useState(false);

  const availableLists = Object.values(lists).filter(l => l.id !== item.currentOrderId && !l.id.startsWith('local-'));

  const handleMoveList = async () => {
    if (!selectedTargetList || isMoving) {
      if (!selectedTargetList) setMoveError('Seleccione una lista destino');
      return;
    }
    try {
      setIsMoving(true);
      setMoveError(null);
      await apiClient.post('/purchases/items/move', {
        itemId: item.orderItemId,
        fromOrderId: item.currentOrderId,
        toOrderId: selectedTargetList
      });
      showNotification(`Ítem transferido exitosamente a ${lists[selectedTargetList]?.name || 'la orden'}`, 'success');
      refreshCart();
      const newSelection = checklistItems.filter(i => i._id !== item._id);
      setChecklistItems(newSelection);
      sessionStorage.setItem('selectedForPurchase', JSON.stringify(newSelection));
      window.dispatchEvent(new Event('cartUpdated'));
      setIsMoveModalOpen(false);
      setSelectedTargetList('');
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Error al mover ítem';
      setMoveError(msg);
      showNotification(msg, 'error');
    } finally {
      setIsMoving(false);
    }
  };

  const handleMantenerEnLista = () => {
    if (!item.motivoNoConseguido) return;
    updateChecklistItem(item._id, 'estadoOperativo', 'PENDIENTE_OTRO_PROVEEDOR');
    setPendingItems(prev => [...prev, { ...item, fechaRegistro: new Date().toLocaleTimeString() }]);
    const newSelection = checklistItems.filter(i => i._id !== item._id);
    setChecklistItems(newSelection);
    sessionStorage.setItem('selectedForPurchase', JSON.stringify(newSelection));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleDescartarItem = async () => {
    updateChecklistItem(item._id, 'estadoOperativo', 'DESCARTADO');
    const newSelection = checklistItems.filter(i => i._id !== item._id);
    setChecklistItems(newSelection);
    sessionStorage.setItem('selectedForPurchase', JSON.stringify(newSelection));
    window.dispatchEvent(new Event('cartUpdated'));

    if (item.currentOrderId && item.orderItemId) {
      try {
        await apiClient.patch(`/purchases/orders/${item.currentOrderId}/items/${item.orderItemId}`, { estadoItem: 'DESCARTADO' });
      } catch (e) { console.error('Failed to update item state', e); }
    }
  };

  const handleConseguido = async () => {
    updateChecklistItem(item._id, 'estadoOperativo', 'CONSEGUIDO');
    const simItem = simulationResult?.itemsLiquidados?.find(si => si.idPrecioProveedor === (item.idPrecioProveedor || item.priceData?.id));
    if (!simItem) return;
    
    let empaqueNom = item.empaqueAlternativo || item.priceData?.presentacionCompra || item.insumoData?.empaque || 'UNIDAD';
    if (String(empaqueNom).includes(' x ') || String(empaqueNom).includes(' X ')) {
      empaqueNom = String(empaqueNom).split(/\s+[xX]\s+/)[0];
    }
    const contVal = Number(item.contenidoBaseEditado || item.contenidoBase || item.priceData?.cantidadEquivalenteBase || 1);
    const uMed = item.unidadBaseEditada || item.insumoData?.unidadBase || item.unidadBase || item.unidadMedida || 'und';
    const presComercial = `${String(empaqueNom).trim().toUpperCase()} x ${contVal.toLocaleString('es-CO')} ${uMed}`;

    const payload = {
      idProveedor: item.idProveedorAlternativo || item.proveedorData?.id,
      esNuevoProveedor: false,
      idOrden: item.currentOrderId,
      condicion: 'CONTADO',
      total: simItem.subtotal,
      fechaCompra: new Date().toISOString(),
      detalles: [{
        idInsumo: item.idInsumo,
        esNuevoInsumo: false,
        cantidad: item.cantidadSolicitada,
        precioUnitario: item.precioCompraActual,
        subtotal: simItem.subtotal,
        empaque: String(empaqueNom).trim().toUpperCase(),
        presentacion: presComercial,
        empaques: item.cantidadSolicitada,
        contenidoBase: contVal,
        unidadEmpaque: uMed,
        cantidadBaseTotal: simItem.ingresoNetoBodega,
        costoBase: simItem.costoBaseUnitario,
        marca: item.marcaAlternativa || item.insumoData?.marca || item.marca || ''
      }]
    };

    try {
      const res = await apiClient.post('/purchases', payload);
      if (res) {
        setComprasAsentadas(prev => [...prev, { ...item, ...payload.detalles[0], idCompra: res.id, provNombre: proveedoresDB.find(p => p.id === payload.idProveedor)?.nombre || item.proveedorData?.nombre }]);
        const remainingItems = checklistItems.filter(i => i._id !== item._id);
        setChecklistItems(remainingItems);
        sessionStorage.setItem('selectedForPurchase', JSON.stringify(remainingItems));
        window.dispatchEvent(new Event('cartUpdated'));

        if (item.currentOrderId && item.orderItemId) {
          try {
            await apiClient.patch(`/purchases/orders/${item.currentOrderId}/items/${item.orderItemId}`, { estadoItem: 'COMPRADO' });
          } catch (err) { console.error('Error actualizando item de orden:', err); }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    lists,
    availableLists,
    isMoveModalOpen,
    setIsMoveModalOpen,
    selectedTargetList,
    setSelectedTargetList,
    moveError,
    setMoveError,
    isMoving,
    handleMoveList,
    handleMantenerEnLista,
    handleDescartarItem,
    handleConseguido
  };
}
