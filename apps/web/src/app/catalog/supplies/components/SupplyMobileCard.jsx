/**
 * @file SupplyMobileCard.jsx
 * @module catalog/supplies/components
 * @description Tarjeta responsiva para visualizar todos los datos de un insumo en móviles (SRP < 135 líneas).
 * @responsibility Presentar datos de insumo, stock, densidad, trazabilidad y acciones táctiles.
 * @usedBy apps/web/src/app/catalog/supplies/components/SuppliesTable.jsx
 * @dependencies react, lucide-react, @/components/ui/Badge, ../utils/supplyTraceability
 */
import React from 'react';
import { Pencil, Power, Trash2, ShieldCheck, ShieldAlert, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { checkSupplyTraceability } from '../utils/supplyTraceability';
import styles from '../supplies.module.css';

export function SupplyMobileCard({ item, code, onEdit, onToggleActive, onDelete }) {
  const { hasTraceability, totalMoves, stockActual, reasons, canDelete } = checkSupplyTraceability(item);
  const stockMinimo = Number(item.stockMinimo || 0);
  const isOut = stockActual <= 0;
  const isLow = stockActual > 0 && stockActual <= stockMinimo;
  const dotClass = isOut ? styles.dotDanger : isLow ? styles.dotWarning : styles.dotSuccess;
  const stockStatusText = isOut ? 'Agotado' : isLow ? 'Bajo Mínimo' : 'En Rango';

  return (
    <article className={styles.mobileCard}>
      <div className={styles.mobileCardHeader}>
        <div className={styles.mobileCardTopRow}>
          <span className={styles.codeBadge}>{code}</span>
          <div className={styles.mobileCardBadges}>
            <span className={styles.categoryBadge}>{item.categoria}</span>
            <Badge status={item.activo ? 'active' : 'inactive'}>
              {item.activo ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
        <h3 className={styles.mobileCardTitle}>{item.nombre}</h3>
        <div className={styles.supplySubMeta}>
          {item.marca && <span className={styles.metaBadge}>{item.marca}</span>}
          {item.subcategoria && <span className={styles.subCategoryText}>{item.subcategoria}</span>}
          {item.empaque && <span className={styles.metaEmpaqueText}>{item.empaque}</span>}
        </div>
      </div>

      <div className={styles.mobileCardSpecsGrid}>
        <div className={styles.mobileSpecItem}>
          <span className={styles.specLabel}>Stock Actual / Mín</span>
          <div className={styles.stockRow}>
            <span className={`${styles.stockStatusDot} ${dotClass}`} title={stockStatusText} />
            <span className={styles.specValue}>
              {stockActual.toLocaleString('es-CO')} / {stockMinimo.toLocaleString('es-CO')} {item.unidadBase}
            </span>
          </div>
        </div>

        <div className={styles.mobileSpecItem}>
          <span className={styles.specLabel}>Unidad & Densidad</span>
          <span className={styles.specValue}>
            {item.unidadBase} {item.densidad && Number(item.densidad) !== 1 ? `(${Number(item.densidad).toFixed(2)} g/ml)` : ''}
          </span>
        </div>

        <div className={styles.mobileSpecItem}>
          <span className={styles.specLabel}>Costo Referencia</span>
          <span className={styles.specValue}>$ {Number(item.costoBase || 0).toLocaleString('es-CO')}</span>
        </div>

        <div className={styles.mobileSpecItem}>
          <span className={styles.specLabel}>Trazabilidad</span>
          {hasTraceability ? (
            <span className={styles.traceabilityBadgeHas}>
              <ShieldAlert size={12} strokeWidth={2.2} />
              <span>Con Trazabilidad</span>
            </span>
          ) : (
            <span className={styles.traceabilityBadgeNone}>
              <ShieldCheck size={12} strokeWidth={2.2} />
              <span>Sin Trazabilidad</span>
            </span>
          )}
        </div>

        {item.observaciones && (
          <div className={`${styles.mobileSpecItem} ${styles.specItemFull}`}>
            <span className={styles.specLabel}>Observaciones</span>
            <p className={styles.specText}>{item.observaciones}</p>
          </div>
        )}
      </div>

      <div className={styles.mobileCardActions}>
        <button
          type="button"
          onClick={() => onEdit(item)}
          className={`${styles.mobileActionBtn} ${styles.actionBtnEdit}`}
          aria-label="Editar insumo"
        >
          <Pencil size={15} strokeWidth={2} />
          <span>Editar</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleActive(item)}
          className={`${styles.mobileActionBtn} ${item.activo ? styles.actionBtnDeactivate : styles.actionBtnActivate}`}
          aria-label={item.activo ? 'Desactivar insumo' : 'Activar insumo'}
        >
          <Power size={15} strokeWidth={2} />
          <span>{item.activo ? 'Desactivar' : 'Activar'}</span>
        </button>

        {canDelete ? (
          <button
            type="button"
            onClick={() => onDelete(item)}
            className={`${styles.mobileActionBtn} ${styles.actionBtnDelete}`}
            aria-label="Eliminar definitivamente"
          >
            <Trash2 size={15} strokeWidth={2} />
            <span>Eliminar</span>
          </button>
        ) : (
          <div
            className={`${styles.mobileActionBtn} ${styles.actionBtnBlockedMobile}`}
            title={
              item.activo 
                ? 'Para eliminar primero desactive el insumo' 
                : `Protegido: cuenta con historial (${reasons.join(', ')})`
            }
          >
            <Lock size={14} strokeWidth={2} />
            <span>{item.activo ? 'Desactivar p/borrar' : 'Protegido'}</span>
          </div>
        )}
      </div>
    </article>
  );
}
