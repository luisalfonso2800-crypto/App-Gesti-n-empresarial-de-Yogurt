/**
 * @file PricesComparisonTable.jsx
 * @module catalog/supplier-prices/components
 * @description Tabla comparativa de precios de insumos con modal inteligente SmartModal para selección multi-lista.
 * @responsibility Presentar tabla de precios cotizados y orquestar selección/adición segura a listas de compra con Poka-Yoke.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies react, @/components/ui/Table, @/components/ui/Badge, @/components/ui/Button, @/components/ui/SmartModal, @/context/CartContext
 */

import React, { useState, useEffect } from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import SmartModal from '@/components/ui/SmartModal';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import { useCart } from '@/context/CartContext';
import styles from '../supplier-prices.module.css';

/**
 * Modal inteligente para selección de lista de compra destino.
 * Cumple al 100% con AGENTS.md (SmartModal, cápsula Poka-Yoke, botón con title contextual y captura de errores API).
 */
export function SelectTargetListModal({
  isOpen,
  onClose,
  pendingItem,
  lists,
  handleToggleWithList
}) {
  const [selectedListId, setSelectedListId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Reiniciar estados al abrir o cerrar el modal
  useEffect(() => {
    if (!isOpen) {
      setSelectedListId('');
      setModalError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Extracción segura de datos del ítem cotizado
  const itemData = pendingItem?.item || pendingItem;
  const insumoNombre = itemData?.insumo?.Nombre_Insumo || itemData?.insumo?.nombre || itemData?.nombreInsumo || 'Insumo';
  const proveedorNombre = itemData?.proveedor?.Nombre_Proveedor || itemData?.proveedor?.nombre || itemData?.nombreProveedor || 'Proveedor';
  const precioFormateado = itemData?.precioCompra ? `$${Number(itemData.precioCompra).toLocaleString('es-CO')}` : '';

  // Filtro de listas de compra activas en el sistema
  const activeLists = Object.values(lists || {}).filter(l => !l.id?.startsWith('local-'));
  const targetList = selectedListId ? lists[selectedListId] : null;
  const targetListName = targetList?.customName || targetList?.name || 'Lista de compra';

  // Configuración contextual del botón primario
  const isConfirmDisabled = !selectedListId || isSubmitting;
  const confirmTitle = !selectedListId
    ? 'Seleccione una lista de compras de destino para continuar'
    : isSubmitting
    ? 'Procesando vinculación del insumo...'
    : `Confirmar adición a ${targetListName}`;

  // Manejador seguro de confirmación de transferencia
  const handleConfirm = async () => {
    if (!selectedListId || isSubmitting) return;
    setIsSubmitting(true);
    setModalError('');
    try {
      if (handleToggleWithList) {
        await handleToggleWithList(pendingItem, selectedListId);
      }
      onClose();
    } catch (err) {
      // Captura de texto plano seguro evitando fallas de serialización
      const errorMsg = err.response?.data?.message || err.message || 'Error al vincular el insumo a la orden seleccionada';
      setModalError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : String(errorMsg));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDirty = Boolean(selectedListId);

  return (
    <SmartModal
      isOpen={isOpen}
      onClose={onClose}
      title="Seleccionar Lista de Destino"
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {/* Banner de Error API Dinámico */}
      {modalError && (
        <div style={{
          marginBottom: '1rem',
          backgroundColor: '#FEF2F2',
          border: '1px solid #F87171',
          color: '#B91C1C',
          padding: '0.6rem 0.85rem',
          borderRadius: '6px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚠️</span>
          <span>{modalError}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.4 }}>
          Existen múltiples listas de compra activas en el sistema. Selecciona a cuál orden de compra deseas incorporar esta cotización:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#374151' }}>
            Orden / Lista de Compra <span style={{ color: '#E11D48' }}>*</span>
          </label>
          <select
            value={selectedListId}
            onChange={(e) => setSelectedListId(e.target.value)}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              fontSize: '0.875rem',
              backgroundColor: '#FFFFFF',
              color: '#111827',
              outline: 'none'
            }}
          >
            <option value="">-- Seleccione una lista de compras --</option>
            {activeLists.map(l => (
              <option key={l.id} value={l.id}>
                {l.customName || l.name} ({l.items?.length || 0} ítems)
              </option>
            ))}
          </select>
        </div>

        {/* Cápsula Resumen Poka-Yoke */}
        {selectedListId && itemData && (
          <div style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '6px',
            fontSize: '0.76rem',
            color: '#166534',
            lineHeight: 1.4
          }}>
            <strong>Resumen:</strong> Se vinculará el insumo <strong>{insumoNombre}</strong> cotizado con el proveedor <strong>{proveedorNombre}</strong>{precioFormateado ? <> a un precio de <strong>{precioFormateado}</strong></> : null} dentro de la orden <strong>{targetListName}</strong>.
          </div>
        )}

        {/* Botonera de Confirmación */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={isConfirmDisabled}
            onClick={handleConfirm}
            title={confirmTitle}
            style={isConfirmDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            {isSubmitting ? 'Vinculando...' : 'Confirmar adición'}
          </Button>
        </div>
      </div>
    </SmartModal>
  );
}

export function PricesComparisonTable({
  items,
  filteredItems,
  loading,
  error,
  bestPricesMap,
  selectedForPurchase,
  handleOpenModal,
  handleToggleActive,
  togglePurchaseItem,
  // Props para multi-lista
  isSelectorOpen,
  setIsSelectorOpen,
  pendingItem,
  handleToggleWithList,
  onNewTarifa
}) {
  const { lists } = useCart();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (items.length === 0) {
    return (
      <AssistedEmptyState
        icon="💰"
        title="Comienza registrando tu primera Tarifa de Proveedor"
        description="Cotiza tarifas de compra para calcular costos base de materia prima."
        actionLabel="+ Nueva Tarifa"
        onAction={() => onNewTarifa && onNewTarifa()}
        topButtonLabel="Nueva Tarifa"
      />
    );
  }

  return (
    <>
      <Table>
        <THead>
          <TR>
            <TH>Insumo</TH>
            <TH>Proveedor</TH>
            <TH>Presentación Compra</TH>
            <TH>Contenido Base</TH>
            <TH>Precio Compra</TH>
            <TH>Costo Unidad Base</TH>
            <TH>Estado</TH>
            <TH>Acciones</TH>
          </TR>
        </THead>
        <TBody>
          {filteredItems.length === 0 ? (
            <TR>
              <TD colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No hay resultados para los filtros aplicados</TD>
            </TR>
          ) : (
            filteredItems.map((item) => {
              const isBestPrice = item.activo && item.costoUnidadBase === bestPricesMap.get(item.idInsumo);
              const isAdded = selectedForPurchase.some(p => 
                (p.insumoId === item.idInsumo || p.idInsumo === item.idInsumo) &&
                (p.proveedorId === item.idProveedor || p.idProveedor === item.idProveedor) &&
                (p.presentacionId === item.idPresentacion || p.idPresentacion === item.idPresentacion || (!p.presentacionId && !item.idPresentacion))
              );
              const alreadyHasSameProviderAndInsumo = !isAdded && selectedForPurchase.some(p => 
                (p.insumoId === item.idInsumo || p.idInsumo === item.idInsumo) && 
                (p.proveedorId === item.idProveedor || p.idProveedor === item.idProveedor)
              );
              
              return (
                <TR key={item.id}>
                  <TD>{item.insumo?.Nombre_Insumo || item.insumo?.nombre || item.idInsumo}</TD>
                  <TD>{item.proveedor?.Nombre_Proveedor || item.proveedor?.nombre || item.idProveedor}</TD>
                  <TD>{item.presentacionCompra || `${item.cantidadPresentacion || 1} ${item.unidadPresentacion || 'Paquete'}`}</TD>
                  <TD>{item.cantidadEquivalenteBase ? Number(item.cantidadEquivalenteBase).toLocaleString('es-CO') : ''} {item.insumo?.Unidad_Base || item.insumo?.unidadBase || ''}</TD>
                  <TD>${Number(item.precioCompra).toLocaleString('es-CO')}</TD>
                  <TD>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span>${Number(item.costoUnidadBase || 0).toLocaleString('es-CO', { minimumFractionDigits: Number(item.costoUnidadBase || 0) % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })} / {item.insumo?.Unidad_Base || item.insumo?.unidadBase || 'Unidad'}</span>
                      {isBestPrice && (
                        <span className={styles.bestPriceBadge}>Recomendado</span>
                      )}
                    </div>
                  </TD>
                  <TD>
                    <Badge status={item.activo ? 'active' : 'inactive'}>
                      {item.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TD>
                  <TD>
                    <div className={styles.actions}>
                      <Button variant="secondary" onClick={() => handleOpenModal(item)}>Editar</Button>
                      <Button 
                        variant={item.activo ? 'danger' : 'primary'} 
                        onClick={() => handleToggleActive(item)}
                      >
                        {item.activo ? 'Desactivar' : 'Activar'}
                      </Button>
                      {item.activo && (
                        <Button 
                          variant={isAdded ? "secondary" : "success"} 
                          disabled={alreadyHasSameProviderAndInsumo}
                          onClick={() => togglePurchaseItem(item)}
                        >
                          {isAdded ? 'Quitar (Añadido)' : alreadyHasSameProviderAndInsumo ? 'Ya añadido (Mismo Prov.)' : 'Comprar'}
                        </Button>
                      )}
                    </div>
                  </TD>
                </TR>
              );
            })
          )}
        </TBody>
      </Table>
      
      {/* Selector Multi-lista Ocasional Estandarizado con SmartModal */}
      <SelectTargetListModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        pendingItem={pendingItem}
        lists={lists}
        handleToggleWithList={handleToggleWithList}
      />
    </>
  );
}
