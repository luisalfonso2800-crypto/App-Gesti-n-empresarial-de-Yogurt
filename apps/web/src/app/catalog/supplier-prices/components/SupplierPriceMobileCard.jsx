/**
 * @file SupplierPriceMobileCard.jsx
 * @module catalog/supplier-prices/components
 * @description Tarjeta responsiva para visualizar tarifas de proveedores en móviles y tablets (SRP < 135 líneas).
 * @responsibility Presentar detalles de cotización, desglose fiscal, costo unitario y botones táctiles.
 * @usedBy apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx
 * @dependencies react, lucide-react, @/components/ui/Badge, @/lib/formatters, ./parts/PriceRowActions
 */
import React from 'react';
import { ShoppingCart, Trash2, Pencil, Power, AlertTriangle, CheckCircle2, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/formatters';
import styles from '../supplier-prices.module.css';

export function SupplierPriceMobileCard({
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

  return (
    <article className={styles.mobileCard}>
      <div className={styles.mobileCardHeader}>
        <div className={styles.mobileCardTopRow}>
          <div className={styles.mobileInsumoHeader}>
            <h3 className={styles.mobileCardTitle}>
              {item.insumo?.Nombre_Insumo || item.insumo?.nombre || item.idInsumo}
            </h3>
            <div className={styles.mobileProveedorName}>
              <Building2 size={13} className={styles.inlineIcon} />
              <span>{item.proveedor?.Nombre_Proveedor || item.proveedor?.nombre || item.idProveedor}</span>
            </div>
          </div>
          <Badge status={item.activo ? 'active' : 'inactive'}>
            {item.activo ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>

        <div className={styles.mobileStockRow}>
          {isLowStock ? (
            <span className={styles.badgeLowStock}><AlertTriangle size={11} /> Stock Bajo ({stockActual} {unidadBase})</span>
          ) : (
            <span className={styles.badgeGoodStock}><CheckCircle2 size={11} /> Stock Óptimo ({stockActual} {unidadBase})</span>
          )}
          {isBestPrice && <span className={styles.bestPriceBadge}>★ Más Económico</span>}
          {(item.esHabitual || item.predeterminado) && <span className={styles.habitualBadge}>🏷️ Habitual</span>}
        </div>
      </div>

      <div className={styles.mobileCardSpecsGrid}>
        <div className={styles.mobileSpecItem}>
          <span className={styles.specLabel}>Presentación Compra</span>
          <span className={styles.specValue}>{item.presentacionCompra || 'Estándar'}</span>
          <span className={styles.specSub}>Eq: {item.cantidadEquivalenteBase || 1} {unidadBase}</span>
        </div>

        <div className={styles.mobileSpecItem}>
          <span className={styles.specLabel}>Precio Empaque</span>
          <span className={styles.specValueHighlight}>${Number(precioEmpaque).toLocaleString('es-CO')}</span>
          <span className={styles.specSub}>
            {tieneIva ? `Base: ${formatCurrency(baseSinIva)} (+IVA ${porcentajeIva}%)` : 'Sin IVA'}
          </span>
        </div>

        <div className={`${styles.mobileSpecItem} ${styles.specItemFull}`}>
          <span className={styles.specLabel}>Costo Final Unidad Base</span>
          <span className={styles.specCostoBase}>
            ${Number(item.costoUnidadBase || 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {unidadBase}
          </span>
        </div>
      </div>

      <div className={styles.mobileCardActions}>
        {item.activo && (
          <button
            type="button"
            onClick={() => onToggleCart(item)}
            disabled={alreadyHasSameProviderAndInsumo}
            className={`${styles.mobileActionBtn} ${isAdded ? styles.btnCartActive : styles.btnCart}`}
          >
            {isAdded ? <Trash2 size={15} /> : <ShoppingCart size={15} />}
            <span>{isAdded ? 'Quitar de Orden' : alreadyHasSameProviderAndInsumo ? 'En Lista' : 'Añadir a Orden'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onEdit(item)}
          className={`${styles.mobileActionBtn} ${styles.btnEditAction}`}
          aria-label="Editar tarifa"
        >
          <Pencil size={15} />
          <span>Editar</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleActive(item)}
          className={`${styles.mobileActionBtn} ${item.activo ? styles.btnPowerActive : styles.btnPowerInactive}`}
          aria-label={item.activo ? 'Desactivar tarifa' : 'Activar tarifa'}
        >
          <Power size={15} />
          <span>{item.activo ? 'Desactivar' : 'Activar'}</span>
        </button>
      </div>
    </article>
  );
}
