/**
 * @file useCartManager.js
 * @module catalog/supplier-prices/hooks
 * @description Hook puente para conectar la tabla de lista de precios con el carrito multi-lista.
 * @responsibility Añadir o eliminar items del carrito, y gestionar la transferencia de ítems
 *   entre órdenes con dos escenarios: transferencia automática (2 listas) o modal selector (3+).
 *   NO maneja lógica de UI de la tabla ni del formulario de filtros.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies @/context/CartContext, @/context/NotificationContext, @/lib/api-client,
 *   @/components/ui/Modal, @/components/ui/Button, lucide-react
 */
'use client';
import React, { useState, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useNotification } from '@/context/NotificationContext';
import { apiClient } from '@/lib/api-client';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ArrowRightLeft } from 'lucide-react';

export function useCartManager() {
  const { lists, activeListId, cartItems, addToCart, removeFromCart, clearCart, refreshCart } = useCart();
  const { showNotification, pauseNotification, resumeNotification } = useNotification();

  // Ítem que acaba de ser añadido y podría necesitar transferencia
  const [pendingItem, setPendingItem] = useState(null);

  // Controla la apertura del Modal de selección (Escenario B: 3+ listas)
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // Lista destino seleccionada en el modal selector
  const [selectedTargetList, setSelectedTargetList] = useState('');

  // Estado de carga durante la petición de transferencia (previene doble envío)
  const [isMoving, setIsMoving] = useState(false);

  // Alias semántico para los ítems activos del carrito
  const selectedForPurchase = cartItems;

  /**
   * Construye el objeto normalizado de ítem para el carrito.
   * Mapea propiedades de la API a los nombres esperados por CartContext.
   * @param {Object} item - Ítem crudo del precio proveedor
   * @returns {Object} - Ítem normalizado listo para addToCart
   */
  const buildCartItem = useCallback((item) => ({
    ...item,
    nombreInsumo: item.insumo?.Nombre_Insumo || item.insumo?.nombre || 'Insumo',
    nombreProveedor: item.proveedor?.Nombre_Proveedor || item.proveedor?.nombre || 'Proveedor',
    idInsumo: item.idInsumo,
    idProveedor: item.idProveedor,
    idPresentacion: item.idPresentacion,
    marca: item.insumo?.Marca || item.insumo?.marca || 'Sin marca',
    categoria: item.insumo?.Categoria || item.insumo?.categoria || 'Materia Prima',
    presentacionCompra: item.presentacionCompra || 'Paquete',
    contenidoBase: item.cantidadEquivalenteBase || item.cantidadPresentacion || 1,
    unidadBase: item.insumo?.Unidad_Base || item.insumo?.unidadBase || 'Unidades',
    unidadMedida: item.unidadPresentacion || item.insumo?.Unidad_Base || item.insumo?.unidadBase || 'Unidad',
    stockMinimo: item.insumo?.Stock_Minimo || item.insumo?.stockMinimo || 0,
    precioCompra: item.precioCompra,
    costoUnidadBase: item.costoUnidadBase,
  }), []);

  /**
   * Ejecuta la transferencia de un ítem entre dos órdenes vía el endpoint real.
   * El ítem debe haber sido añadido primero a la orden origen (activeListId).
   * Escenario A: se llama directo con fromListId y toListId conocidos (2 listas).
   * Escenario B: se llama desde la confirmación del modal (3+ listas).
   *
   * IMPORTANTE: el CartContext almacena ítems localmente sin persistir el itemId de la
   * orden en backend. Para mover necesitamos refrescar y encontrar el item real.
   * Por eso hacemos: addToCart local → refreshCart → buscamos en el backend el itemId real.
  /**
   * Ejecuta la transferencia de un ítem entre dos órdenes vía el endpoint real.
   *
   * @param {Object} cartItem  - Ítem normalizado que DEBE contener el 'itemId' real de base de datos
   * @param {string} fromListId - ID de la orden origen
   * @param {string} toListId   - ID de la orden destino
   * @param {string} toListName - Nombre humano de la orden destino (para el toast)
   */
  const executeMoveItem = useCallback(async (cartItem, fromListId, toListId, toListName) => {
    try {
      setIsMoving(true);

      if (!cartItem.itemId) {
        throw new Error('El ítem aún no tiene un ID persistido. Intente nuevamente en un momento.');
      }

      // Llamar al endpoint de transferencia transaccional con el ID real
      await apiClient.post('/purchases/items/move', {
        itemId: cartItem.itemId,
        fromOrderId: fromListId,
        toOrderId: toListId,
      });

      // Sincronizar el carrito globalmente para reflejar el cambio
      await refreshCart();

      showNotification(`Ítem transferido exitosamente a ${toListName}`, 'success');
      setIsSelectorOpen(false);
      setSelectedTargetList('');
      setPendingItem(null);
    } catch (e) {
      showNotification(e.message || 'Error al transferir el ítem', 'error');
    } finally {
      setIsMoving(false);
    }
  }, [refreshCart, showNotification]);

  /**
   * Maneja el click en "Cambiar de lista" dentro del toast.
   * - Escenario A (exactamente 2 listas activas): transfiere automáticamente a la otra lista.
   * - Escenario B (3 o más listas): abre el Modal selector para que el usuario elija.
   * @param {Object} addedItem    - Ítem normalizado que fue añadido
   * @param {string} fromListId   - Lista en la que se añadió el ítem (origen)
   */
  const handleChangeList = useCallback((addedItem, fromListId) => {
    // Obtener todas las listas activas en backend (no locales)
    const backendLists = Object.values(lists).filter(l => !l.id.startsWith('local-'));
    const otherLists = backendLists.filter(l => l.id !== fromListId);

    if (otherLists.length === 0) {
      showNotification('No hay otras listas activas disponibles. Crea una nueva lista desde el carrito.', 'error');
      return;
    }

    if (otherLists.length === 1) {
      // Escenario A: transferencia directa e inmediata a la única otra lista
      const targetList = otherLists[0];
      executeMoveItem(addedItem, fromListId, targetList.id, targetList.name);
    } else {
      // Escenario B: 3+ listas → abrir modal selector
      setPendingItem({ item: addedItem, fromListId });
      setSelectedTargetList('');
      setIsSelectorOpen(true);
    }
  }, [lists, executeMoveItem, showNotification]);

  /**
   * Añade un ítem a la lista indicada (o activa) y muestra el toast con el botón "Cambiar de lista".
   * Si el ítem ya estaba en el carrito, lo elimina (toggle).
   * @param {Object} item         - Ítem crudo del precio proveedor
   * @param {string} targetListId - ID de la lista destino (default: activeListId)
   */
  const handleToggleWithList = useCallback(async (item, targetListId) => {
    const existing = cartItems.find(i => i.id === item.id);
    if (existing) {
      removeFromCart(item.id, targetListId);
      return;
    }

    const newItem = buildCartItem(item);
    
    // Primero, añadimos visualmente rápido al contexto local
    addToCart(newItem, targetListId);
    
    const listName = lists[targetListId]?.customName || lists[targetListId]?.name || 'Lista Activa';

    // Construimos el toast inicial en estado "Guardando..." para bloquear transferencias prematuras
    const buildToast = (isReady, savedItem = null) => (
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
        onMouseEnter={pauseNotification}
        onMouseLeave={resumeNotification}
      >
        <span>Añadido a {listName}</span>
        <button
          disabled={!isReady || isMoving}
          onClick={() => isReady && savedItem && handleChangeList(savedItem, targetListId)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.25rem',
            background: 'rgba(255,255,255,0.2)', border: '1px solid white',
            borderRadius: '4px', padding: '0.25rem 0.5rem',
            color: 'white', cursor: (!isReady || isMoving) ? 'not-allowed' : 'pointer',
            opacity: (!isReady || isMoving) ? 0.6 : 1,
          }}
        >
          <ArrowRightLeft size={14} />
          {!isReady ? 'Guardando...' : isMoving ? 'Transfiriendo...' : 'Cambiar de lista'}
        </button>
      </div>
    );

    // Mostramos el toast de guardando
    showNotification(buildToast(false), 'success');

    try {
      // Persistimos en la base de datos de inmediato
      const persistedItem = await apiClient.post(`/purchases/orders/${targetListId}/items`, {
        idInsumo: newItem.idInsumo,
        idProveedor: newItem.idProveedor,
        idPresentacion: newItem.idPresentacion,
        cantidad: 1, // Por defecto al añadir
        precioEstimado: newItem.precioCompra
      });

      // Actualizamos el ítem con su ID real de Prisma para que 'handleChangeList' pueda usarlo
      const finalItem = { ...newItem, itemId: persistedItem.id };
      
      // Actualizamos el toast para habilitar el botón "Cambiar de lista"
      showNotification(buildToast(true, finalItem), 'success');
      
      // Sincronizamos silenciosamente para que la UI tenga el ID real también
      refreshCart();
    } catch (error) {
      console.error('Error persisting item to order:', error);
      showNotification('Error al guardar el ítem en la lista de compra', 'error');
    }
  }, [cartItems, lists, addToCart, removeFromCart, buildCartItem, showNotification, pauseNotification, resumeNotification, handleChangeList, isMoving, refreshCart]);


  /**
   * Toggle principal: si hay más de 1 lista y ninguna está activa, abre el selector.
   * En el flujo normal, delega a handleToggleWithList con la lista activa.
   * @param {Object} item - Ítem crudo del precio proveedor
   */
  const togglePurchaseItem = useCallback((item) => {
    const existing = cartItems.find(i => i.id === item.id);
    if (existing) {
      removeFromCart(item.id);
      return;
    }
    const listsKeys = Object.keys(lists);
    if (listsKeys.length > 1 && !activeListId) {
      // Sin lista activa y múltiples disponibles → mostrar selector de lista
      setPendingItem({ item: buildCartItem(item), fromListId: null });
      setIsSelectorOpen(true);
    } else {
      handleToggleWithList(item, activeListId);
    }
  }, [cartItems, lists, activeListId, removeFromCart, buildCartItem, handleToggleWithList]);

  const clearPurchaseList = useCallback(() => clearCart(), [clearCart]);

  const proceedToPurchase = useCallback(async () => {}, []);

  /**
   * Modal de selección de lista destino (Escenario B: 3+ listas activas).
   * Se renderiza directamente desde el hook para mantener toda la lógica co-locada.
   */
  const MoveListModal = isSelectorOpen ? (
    <Modal
      isOpen={isSelectorOpen}
      onClose={() => { setIsSelectorOpen(false); setPendingItem(null); }}
      title="Seleccionar lista destino"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
          Selecciona la lista de compra a la que deseas transferir este insumo:
        </p>

        {(() => {
          const fromId = pendingItem?.fromListId || activeListId;
          const options = Object.values(lists).filter(
            l => l.id !== fromId && !l.id.startsWith('local-')
          );

          if (options.length === 0) {
            return (
              <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '4px', textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#374151', fontSize: '0.875rem' }}>
                  No hay otras listas activas disponibles.
                </p>
                <p style={{ margin: '0.5rem 0 0', color: '#6b7280', fontSize: '0.75rem' }}>
                  Crea una nueva lista desde el carrito primero.
                </p>
              </div>
            );
          }

          return (
            <select
              value={selectedTargetList}
              onChange={e => setSelectedTargetList(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
            >
              <option value="">-- Seleccione una lista --</option>
              {options.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          );
        })()}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
          <Button
            variant="secondary"
            onClick={() => { setIsSelectorOpen(false); setPendingItem(null); }}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={isMoving || !selectedTargetList}
            onClick={() => {
              if (!pendingItem || !selectedTargetList) return;
              const fromId = pendingItem.fromListId || activeListId;
              const toList = lists[selectedTargetList];
              executeMoveItem(pendingItem.item, fromId, selectedTargetList, toList?.name || 'la lista');
            }}
          >
            {isMoving ? 'Transfiriendo...' : 'Confirmar transferencia'}
          </Button>
        </div>
      </div>
    </Modal>
  ) : null;

  return {
    selectedForPurchase,
    togglePurchaseItem,
    clearPurchaseList,
    proceedToPurchase,
    isSelectorOpen,
    setIsSelectorOpen,
    pendingItem,
    handleToggleWithList,
    MoveListModal,
  };
}
