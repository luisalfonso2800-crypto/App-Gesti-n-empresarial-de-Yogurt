/**
 * @file PricesComparisonTable.jsx
 * @module catalog/supplier-prices/components
 * @description Tabla comparativa de precios de insumos cotizados con desglose de IVA y costo unitario base.
 * @responsibility Presentar cotizaciones comparadas, destacar tarifa más económica y permitir agregar a orden.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies react, @/components/ui/Table, @/components/ui/Badge, @/components/ui/Button
 */
import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import { formatCurrency } from '@/lib/formatters';
import styles from '../supplier-prices.module.css';

export function PricesComparisonTable({
  items, filteredItems, loading, error, bestPricesMap, selectedForPurchase,
  handleOpenModal, handleToggleActive, togglePurchaseItem, onNewTarifa
}) {
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
    <Table>
      <THead>
        <TR>
          <TH>Insumo</TH>
          <TH>Proveedor</TH>
          <TH>Presentación Compra</TH>
          <TH>Precio Empaque</TH>
          <TH>Base / IVA ($)</TH>
          <TH>Costo Final / Und Base</TH>
          <TH>Estado</TH>
          <TH>Acciones</TH>
        </TR>
      </THead>
      <TBody>
        {filteredItems.length === 0 ? (
          <TR>
            <TD colSpan="8" className={styles.emptyTableText}>No hay resultados para los filtros aplicados</TD>
          </TR>
        ) : (
          filteredItems.map((item) => {
            const itemCosto = Number(item.costoUnidadBase || 0);
            const isBestPrice = item.activo && itemCosto === bestPricesMap.get(item.idInsumo);
            const isAdded = selectedForPurchase.some(p => (p.insumoId === item.idInsumo || p.idInsumo === item.idInsumo) && (p.proveedorId === item.idProveedor || p.idProveedor === item.idProveedor));
            const alreadyHasSameProviderAndInsumo = !isAdded && selectedForPurchase.some(p => (p.insumoId === item.idInsumo || p.idInsumo === item.idInsumo) && (p.proveedorId === item.idProveedor || p.idProveedor === item.idProveedor));
            
            const precioEmpaque = Number(item.precioCompra || item.precio || 0);
            const tieneIva = item.tieneIva ?? true;
            const porcentajeIva = Number(item.porcentajeIva || 19);
            const precioIncluyeIva = item.precioIncluyeIva ?? true;
            let baseSinIva = Number(item.costoBaseSinIva || 0);
            let montoIva = Number(item.montoIva || 0);

            if (baseSinIva <= 0 && precioEmpaque > 0) {
              baseSinIva = (!tieneIva || !precioIncluyeIva) ? precioEmpaque : (precioEmpaque / (1 + (porcentajeIva / 100)));
              montoIva = !tieneIva ? 0 : (precioIncluyeIva ? (precioEmpaque - baseSinIva) : (precioEmpaque * (porcentajeIva / 100)));
            } else if (montoIva <= 0 && tieneIva && baseSinIva > 0) {
              montoIva = precioEmpaque - baseSinIva;
            }

            return (
              <TR key={item.id}>
                <TD>{item.insumo?.Nombre_Insumo || item.insumo?.nombre || item.idInsumo}</TD>
                <TD>{item.proveedor?.Nombre_Proveedor || item.proveedor?.nombre || item.idProveedor}</TD>
                <TD>
                  <div className={styles.priceCell}>
                    <span>{item.presentacionCompra || `${item.cantidadPresentacion || 1} ${item.unidadPresentacion || 'Paquete'}`}</span>
                    <span className={styles.subPriceText}>Eq: {item.cantidadEquivalenteBase ? Number(item.cantidadEquivalenteBase).toLocaleString('es-CO') : ''} {item.insumo?.Unidad_Base || item.insumo?.unidadBase || ''}</span>
                  </div>
                </TD>
                <TD>
                  <div className={styles.priceCell}>
                    <strong className={styles.finalPriceCell}>${Number(item.precioCompra).toLocaleString('es-CO')}</strong>
                    <span className={styles.finalPriceLabel}>(Total a pagar)</span>
                  </div>
                </TD>
                <TD>
                  <div className={styles.priceCell}>
                    <span className={styles.taxBreakdownCell}>{formatCurrency(tieneIva ? baseSinIva : precioEmpaque)}</span>
                    {tieneIva ? (
                      <span className={styles.ivaSubtext}>+ {formatCurrency(montoIva)} (IVA {porcentajeIva}%)</span>
                    ) : (
                      <span className={styles.ivaSubtextExempt}>Sin IVA (No aplica)</span>
                    )}
                  </div>
                </TD>
                <TD>
                  <div className={styles.priceCell}>
                    <span>${Number(item.costoUnidadBase || 0).toLocaleString('es-CO', { minimumFractionDigits: Number(item.costoUnidadBase || 0) % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })} / {item.insumo?.Unidad_Base || item.insumo?.unidadBase || 'Unidad'}</span>
                    {isBestPrice && <span className={styles.bestPriceBadge}>★ Más Económico</span>}
                  </div>
                </TD>
                <TD>
                  <Badge status={item.activo ? 'active' : 'inactive'}>{item.activo ? 'Activo' : 'Inactivo'}</Badge>
                </TD>
                <TD>
                  <div className={styles.actions}>
                    <Button variant="secondary" onClick={() => handleOpenModal(item)}>Editar</Button>
                    <Button variant={item.activo ? 'danger' : 'primary'} onClick={() => handleToggleActive(item)}>
                      {item.activo ? 'Desactivar' : 'Activar'}
                    </Button>
                    {item.activo && (
                      <Button variant={isAdded ? "secondary" : "success"} disabled={alreadyHasSameProviderAndInsumo} onClick={() => togglePurchaseItem(item)}>
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
  );
}
