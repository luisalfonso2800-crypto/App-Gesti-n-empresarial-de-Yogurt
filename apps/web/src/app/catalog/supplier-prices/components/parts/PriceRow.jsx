/**
 * @file PriceRow.jsx
 * @module catalog/supplier-prices/components/parts
 * @description Fila atómica de cotización con semáforo de inventario, fecha, notas, tarifa económica/habitual (< 120 líneas).
 * @usedBy apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx
 */
'use client';

import React from 'react';
import { TR, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import PriceRowActions from './PriceRowActions';
import styles from '../../supplier-prices.module.css';

export default function PriceRow({
  item,
  isBestPrice,
  isAdded,
  alreadyHasSameProviderAndInsumo,
  onToggleCart,
  onEdit,
  onToggleActive
}) {
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

  const stockActual = Number(item.insumo?.stockActual ?? item.insumo?.Stock_Actual ?? 0);
  const stockMinimo = Number(item.insumo?.stockMinimo ?? item.insumo?.Stock_Minimo ?? 0);
  const isLowStock = stockMinimo > 0 && stockActual <= stockMinimo;
  const unidadBase = item.insumo?.Unidad_Base || item.insumo?.unidadBase || 'und';

  const fechaActualizada = item.updatedAt ? new Date(item.updatedAt) : (item.createdAt ? new Date(item.createdAt) : null);
  const diasAntiguedad = fechaActualizada ? Math.floor((new Date() - fechaActualizada) / (1000 * 60 * 60 * 24)) : 0;
  const esCotizacionAntigua = diasAntiguedad > 30;

  return (
    <TR>
      <TD>
        <div className={styles.insumoCell}>
          <strong className={styles.insumoTitle}>{item.insumo?.Nombre_Insumo || item.insumo?.nombre || item.idInsumo}</strong>
          <div className={styles.stockSubtext}>
            <span>Stock: {stockActual.toLocaleString('es-CO')} {unidadBase}</span>
            {isLowStock ? (
              <span className={styles.badgeLowStock}><AlertTriangle size={11} /> Bajo Mínimo</span>
            ) : (
              <span className={styles.badgeGoodStock}><CheckCircle2 size={11} /> Abastecido</span>
            )}
          </div>
        </div>
      </TD>

      <TD>
        <div className={styles.proveedorCell}>
          <div className={styles.proveedorNameRow}>
            <span className={styles.proveedorTitle}>{item.proveedor?.Nombre_Proveedor || item.proveedor?.nombre || item.idProveedor}</span>
            {item.observaciones && (
              <span className={styles.obsBadge} title={item.observaciones}>
                <Info size={13} />
              </span>
            )}
          </div>
          <div className={styles.dateSubtextRow}>
            <span>{fechaActualizada ? `Act: ${fechaActualizada.toLocaleDateString('es-CO')}` : 'Act: Reciente'}</span>
            {esCotizacionAntigua && <span className={styles.badgeAntigua}>⚠️ &gt;30d</span>}
          </div>
        </div>
      </TD>

      <TD>
        <div className={styles.priceCell}>
          <span>{item.presentacionCompra || `${item.cantidadPresentacion || 1} ${item.unidadPresentacion || 'Paquete'}`}</span>
          <span className={styles.subPriceText}>Eq: {item.cantidadEquivalenteBase ? Number(item.cantidadEquivalenteBase).toLocaleString('es-CO') : ''} {unidadBase}</span>
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
          <span className={styles.costoUndText}>${Number(item.costoUnidadBase || 0).toLocaleString('es-CO', { minimumFractionDigits: Number(item.costoUnidadBase || 0) % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })} / {unidadBase}</span>
          <div className={styles.badgesWrapper}>
            {isBestPrice && <span className={styles.bestPriceBadge}>★ Más Económico</span>}
            {(item.esHabitual || item.predeterminado) && <span className={styles.habitualBadge}>🏷️ Habitual</span>}
          </div>
        </div>
      </TD>

      <TD>
        <Badge status={item.activo ? 'active' : 'inactive'}>{item.activo ? 'Activo' : 'Inactivo'}</Badge>
      </TD>

      <TD>
        <PriceRowActions
          item={item}
          isAdded={isAdded}
          alreadyHasSameProviderAndInsumo={alreadyHasSameProviderAndInsumo}
          onToggleCart={onToggleCart}
          onEdit={onEdit}
          onToggleActive={onToggleActive}
        />
      </TD>
    </TR>
  );
}
