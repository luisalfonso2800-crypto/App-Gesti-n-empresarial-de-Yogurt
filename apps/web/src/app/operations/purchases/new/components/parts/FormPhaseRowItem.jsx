/**
 * @file FormPhaseRowItem.jsx
 * @module operations/purchases/new/parts
 * @description Fila orquestadora para compra de insumo (< 150 líneas, SRP, 0 inline styles).
 * @responsibility Delegar selectores, empaque, valores económicos y controles de IVA a sus subcomponentes.
 * @usedBy apps/web/src/app/operations/purchases/new/components/FormPhase.jsx
 * @dependencies React, ../../new-purchase.module.css, ./FormPhaseRowSelectors, ./FormPhaseRowPackaging, ./FormPhaseRowEconomics, ./FormPhaseRowIvaSection
 */
import React from 'react';
import styles from '../../new-purchase.module.css';
import FormPhaseRowSelectors from './FormPhaseRowSelectors';
import FormPhaseRowPackaging from './FormPhaseRowPackaging';
import FormPhaseRowPokaYokeAlerts from './FormPhaseRowPokaYokeAlerts';
import FormPhaseRowEconomics from './FormPhaseRowEconomics';
import FormPhaseRowIvaSection from './FormPhaseRowIvaSection';

export default function FormPhaseRowItem(props) {
  const { row, idx, removeRow, updateDetalle } = props;

  const empaquesNum = parseInt(row.empaques, 10) || 0;
  const precioUnitarioNum = parseInt(row.precioUnitario, 10) || 0;
  const contNetoNum = parseFloat(row.contenidoNeto) || 1;
  const ingresoNeto = Math.round(empaquesNum * contNetoNum);
  const unidadLabel = row.unidadMedida === 'Unidades' ? 'und' : (row.unidadMedida || 'ml');

  const tieneIva = row.tieneIva !== undefined ? Boolean(row.tieneIva) : true;
  const pctIva = tieneIva ? (Number(row.porcentajeIva !== undefined ? row.porcentajeIva : 19) || 0) : 0;
  const precioIncluyeIva = row.precioIncluyeIva !== undefined ? Boolean(row.precioIncluyeIva) : true;

  let subtotalSinIva = 0;
  let montoIva = 0;
  let subtotalConIva = 0;

  if (!tieneIva) {
    subtotalSinIva = precioUnitarioNum * empaquesNum;
    montoIva = 0;
    subtotalConIva = subtotalSinIva;
  } else if (tieneIva && precioIncluyeIva) {
    subtotalConIva = precioUnitarioNum * empaquesNum;
    subtotalSinIva = pctIva > 0 ? (subtotalConIva / (1 + (pctIva / 100))) : subtotalConIva;
    montoIva = subtotalConIva - subtotalSinIva;
  } else {
    subtotalSinIva = precioUnitarioNum * empaquesNum;
    montoIva = subtotalSinIva * (pctIva / 100);
    subtotalConIva = subtotalSinIva + montoIva;
  }

  const subtotalRow = Math.round(subtotalConIva);
  const baseRow = Math.round(subtotalSinIva);
  const ivaRow = Math.round(montoIva);

  const isUnconfigured = Boolean(
    row.isUnconfigured && (
      !row.proveedor?.id ||
      empaquesNum <= 0 ||
      precioUnitarioNum <= 0
    )
  );

  const uBase = (row.insumo?.unidadBase || '').toLowerCase();
  const esMedible = ['kg', 'g', 'l', 'ml'].includes(uBase);
  const esUnidad = (row.empaqueTipo === 'UNIDAD' || row.empaque === 'UNIDAD');
  const esContenidoUno = parseFloat(row.contenidoNeto || '1') === 1;
  const emp = (row.empaque || row.empaqueTipo || '').toUpperCase();
  const esMultiEmpaque = ['BOLSA', 'BULTO', 'CAJA', 'BIDÓN', 'CANASTILLA', 'ENVASE'].some(k => emp.includes(k));
  const cont = parseFloat(row.contenidoNeto || '0');
  const hasPokaYokeWarning = Boolean((esMedible && esUnidad && esContenidoUno) || (esMultiEmpaque && cont === 1));

  const cardBorderClass = isUnconfigured
    ? styles.formRowCardUnconfigured
    : (idx === 0 ? styles.formRowCardFirst : styles.formRowCardNormal);

  return (
    <div className={`${styles.formRowCard} ${cardBorderClass}`}>
      <div className={styles.rowCardTopBar}>
        <div className={styles.rowCardTagGroup}>
          {idx === 0 && !isUnconfigured && <span className={styles.lastAddedBadge}>✦ ÚLTIMA ADICIÓN</span>}
          {row.fromCotizacion && (
            <span className={styles.cotizacionBadge}>
              ✓ Cotización activa
            </span>
          )}
          {isUnconfigured && (
            <span className={styles.unconfiguredPill}>
              ⚠️ Insumo añadido desde stock — Complete proveedor, empaque y precio
            </span>
          )}
          <span className={styles.rowItemNumber}>ÍTEM #{idx + 1}</span>
        </div>
        <button
          type="button"
          onClick={() => removeRow(row.id)}
          className={styles.rowDeleteBtn}
          title="Eliminar este ítem"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>

      <div className={styles.line1Grid}>
        <FormPhaseRowSelectors {...props} />
        <FormPhaseRowPackaging row={row} updateDetalle={updateDetalle} hasPokaYokeWarning={hasPokaYokeWarning} />
      </div>

      <FormPhaseRowPokaYokeAlerts row={row} />

      <FormPhaseRowEconomics
        row={row}
        updateDetalle={updateDetalle}
        precioUnitarioNum={precioUnitarioNum}
        ingresoNeto={ingresoNeto}
        unidadLabel={unidadLabel}
        subtotalRow={subtotalRow}
        hasPokaYokeWarning={hasPokaYokeWarning}
      />

      <FormPhaseRowIvaSection
        row={row}
        updateDetalle={updateDetalle}
        tieneIva={tieneIva}
        pctIva={pctIva}
        precioIncluyeIva={precioIncluyeIva}
        baseRow={baseRow}
        ivaRow={ivaRow}
        subtotalRow={subtotalRow}
      />

      {row.insumo && empaquesNum > 0 && (
        <div className={styles.rowItemFooterSummary}>
          ✦ <strong>Resumen:</strong> Comprando <strong>{row.empaques || 0} {row.empaque?.toLowerCase() || 'unidades'}</strong> de <strong>{Number(row.contenidoNeto || 1).toLocaleString('es-CO')} {row.unidadMedida || 'ml'}</strong> cada una. Ingresarán <strong>{Number(empaquesNum * contNetoNum).toLocaleString('es-CO')} {row.unidadMedida || 'ml'}</strong> de <em>{row.insumo.nombre || 'insumo'}</em> a bodega por <strong>${subtotalRow.toLocaleString('es-CO')}</strong>.
        </div>
      )}
    </div>
  );
}
