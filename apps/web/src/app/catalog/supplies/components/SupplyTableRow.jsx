/**
 * @file SupplyTableRow.jsx
 * @module catalog/supplies/components
 * @description Fila individual enriquecida para la tabla desktop de insumos (SRP < 140 líneas).
 * @responsibility Renderizar datos de stock, densidad, trazabilidad y acciones protegidas.
 * @usedBy apps/web/src/app/catalog/supplies/components/SuppliesTable.jsx
 * @dependencies react, lucide-react, @/components/ui/Table, @/components/ui/Badge, ../utils/supplyTraceability
 */
import React from 'react';
import { Pencil, Power, Trash2, ShieldCheck, ShieldAlert, Lock } from 'lucide-react';
import { TR, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { checkSupplyTraceability } from '../utils/supplyTraceability';
import styles from '../supplies.module.css';

export function SupplyTableRow({ item, code, onEdit, onToggleActive, onDelete }) {
  const { hasTraceability, totalMoves, stockActual, reasons, canDelete } = checkSupplyTraceability(item);
  const stockMinimo = Number(item.stockMinimo || 0);
  const isOut = stockActual <= 0;
  const isLow = stockActual > 0 && stockActual <= stockMinimo;
  const dotClass = isOut ? styles.dotDanger : isLow ? styles.dotWarning : styles.dotSuccess;
  const stockStatusText = isOut ? 'Agotado' : isLow ? 'Bajo Mínimo' : 'En Rango';

  return (
    <TR>
      <TD className={styles.codeCell}>
        <span className={styles.codeBadge}>{code}</span>
      </TD>
      <TD>
        <div className={styles.nameCellWrapper}>
          <span className={styles.supplyNameText}>{item.nombre}</span>
          <div className={styles.supplySubMeta}>
            {item.marca && <span className={styles.metaBadge}>{item.marca}</span>}
            {item.empaque && <span className={styles.metaEmpaqueText}>{item.empaque}</span>}
          </div>
          {item.observaciones && (
            <span className={styles.supplyNotesText} title={item.observaciones}>
              {item.observaciones}
            </span>
          )}
        </div>
      </TD>
      <TD>
        <div className={styles.categoryWrapper}>
          <span className={styles.categoryBadge}>{item.categoria}</span>
          {item.subcategoria && <span className={styles.subCategoryText}>{item.subcategoria}</span>}
        </div>
      </TD>
      <TD>
        <div className={styles.unitDensityWrapper}>
          <span className={styles.unitBadge}>{item.unidadBase}</span>
          {item.densidad && Number(item.densidad) !== 1 && (
            <span className={styles.densityText} title="Densidad para dosificación/conversión">
              {Number(item.densidad).toFixed(3)} g/ml
            </span>
          )}
        </div>
      </TD>
      <TD>
        <div className={styles.stockColWrapper}>
          <div className={styles.stockRow}>
            <span className={`${styles.stockStatusDot} ${dotClass}`} title={stockStatusText} />
            <span className={styles.stockActualVal}>
              <strong>{stockActual.toLocaleString('es-CO')}</strong> {item.unidadBase}
            </span>
          </div>
          <span className={styles.stockMinLabel}>Mín: {stockMinimo.toLocaleString('es-CO')}</span>
        </div>
      </TD>
      <TD className={styles.costCell}>
        <span className={styles.costValue}>
          $ {Number(item.costoBase || 0).toLocaleString('es-CO')}
        </span>
      </TD>
      <TD>
        {hasTraceability ? (
          <span 
            className={styles.traceabilityBadgeHas} 
            title={`Insumo con historial: ${reasons.join(', ')}. No puede eliminarse, solo desactivarse.`}
          >
            <ShieldAlert size={12} strokeWidth={2.2} />
            <span>Con Trazabilidad</span>
          </span>
        ) : (
          <span 
            className={styles.traceabilityBadgeNone} 
            title="Sin movimientos ni dependencias registradas en planta."
          >
            <ShieldCheck size={12} strokeWidth={2.2} />
            <span>Sin Trazabilidad</span>
          </span>
        )}
      </TD>
      <TD>
        <Badge status={item.activo ? 'active' : 'inactive'}>
          {item.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      </TD>
      <TD>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionBtnEdit}
            onClick={() => onEdit(item)}
            title="Editar insumo"
            aria-label="Editar insumo"
          >
            <Pencil size={14} strokeWidth={2} />
            <span>Editar</span>
          </button>

          <button
            type="button"
            className={item.activo ? styles.actionBtnDeactivate : styles.actionBtnActivate}
            onClick={() => onToggleActive(item)}
            title={item.activo ? 'Desactivar insumo' : 'Activar insumo'}
            aria-label={item.activo ? 'Desactivar' : 'Activar'}
          >
            <Power size={14} strokeWidth={2} />
            <span>{item.activo ? 'Desactivar' : 'Activar'}</span>
          </button>

          {canDelete ? (
            <button
              type="button"
              className={styles.actionBtnDelete}
              onClick={() => onDelete(item)}
              title="Eliminar definitivamente (sin trazabilidad)"
              aria-label="Eliminar definitivamente"
            >
              <Trash2 size={14} strokeWidth={2} />
            </button>
          ) : (
            <span
              className={styles.actionBtnDeleteBlocked}
              title={
                item.activo 
                  ? 'Para eliminar primero debe desactivar el insumo' 
                  : `Insumo protegido por trazabilidad (${reasons.join(', ')})`
              }
            >
              <Lock size={12} strokeWidth={2} />
            </span>
          )}
        </div>
      </TD>
    </TR>
  );
}
