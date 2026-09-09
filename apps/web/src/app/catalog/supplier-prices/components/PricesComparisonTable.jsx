/**
 * @file PricesComparisonTable.jsx
 * @module catalog/supplier-prices/components
 * @description Tabla interactiva con selector multi-lista ocasional.
 * @responsibility Presentar precios y disparar adición a carrito multi-lista.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies @/components/ui/Table, Modal, etc.
 */
import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import { useCart } from '@/context/CartContext';
import styles from '../supplier-prices.module.css';

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
  // New props for multi-list
  isSelectorOpen,
  setIsSelectorOpen,
  pendingItem,
  handleToggleWithList
}) {
  const { lists } = useCart();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (items.length === 0) return <EmptyState title="No hay registros" description="Crea el primer registro para comenzar" />;

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
              const isAdded = selectedForPurchase.some(p => p.id === item.id);
              const alreadyHasSameProviderAndInsumo = !isAdded && selectedForPurchase.some(p => p.idInsumo === item.idInsumo && p.idProveedor === item.idProveedor);
              
              return (
                <TR key={item.id}>
                  <TD>{item.insumo?.Nombre_Insumo || item.insumo?.nombre || item.idInsumo}</TD>
                  <TD>{item.proveedor?.Nombre_Proveedor || item.proveedor?.nombre || item.idProveedor}</TD>
                  <TD>{item.cantidadPresentacion || 1} {item.unidadPresentacion || 'Paquete'}</TD>
                  <TD>{item.cantidadEquivalenteBase} {item.insumo?.Unidad_Base || item.insumo?.unidadBase || ''}</TD>
                  <TD>${item.precioCompra}</TD>
                  <TD>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span>${item.costoUnidadBase} / {item.insumo?.Unidad_Base || item.insumo?.unidadBase || 'Unidad'}</span>
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
      
      {/* Selector Multi-lista Ocasional */}
      <Modal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} title="Seleccionar Lista de Destino">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p>Existen múltiples listas de compra activas. ¿A cuál deseas añadir este insumo?</p>
          {Object.values(lists).map(l => (
            <Button key={l.id} variant="secondary" onClick={() => {
              handleToggleWithList(pendingItem, l.id);
              setIsSelectorOpen(false);
            }}>
              Añadir a: {l.customName} ({l.items.length} items)
            </Button>
          ))}
          <Button onClick={() => setIsSelectorOpen(false)} variant="danger">Cancelar</Button>
        </div>
      </Modal>
    </>
  );
}
