/**
 * @file ProductionBomTable.jsx
 * @module operations/production/components
 * @description Tabla de explosión de materiales (BOM) con alineación tabular quirúrgica y columnas estrictas.
 * @responsibility Renderizar tabla con Insumo, Req. Teórico, Stock Actual, Costo Unit., Subtotal, Faltante y Estado alineados verticalmente.
 * @usedBy apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx
 * @dependencies react, @/components/ui/Badge, @/lib/formatters, ../production.module.css
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/formatters';
import styles from '../production.module.css';

export function ProductionBomTable({ items = [] }) {
  const [allocationState, setAllocationState] = useState({});

  const handleToggle = (key, update, callback) => {
    setAllocationState(prev => ({ ...prev, [key]: { ...(prev[key] || {}), ...update } }));
    if (callback) callback(update);
  };

  return (
    <table className={styles.bomTable}>
      <thead>
        <tr>
          <th className={styles.thInsumo}>📦 Insumo</th>
          <th className={styles.thReq}>📐 Req. Teórico</th>
          <th className={styles.thStock}>🏢 Stock Actual</th>
          <th className={styles.thCostUnit}>Costo Unit.</th>
          <th className={styles.thSubtotal}>💲 Subtotal</th>
          <th className={styles.thFaltante}>Faltante</th>
          <th className={styles.thStatus}>🚦 Estado</th>
        </tr>
      </thead>
      <tbody>
        {items.map((b) => {
          const isInsufficient = Number(b.faltante) > 0;
          const key = b.idInsumo || b.idProductoIntermedio || b.nombreInsumo;
          const primerLote = b.lotesDisponibles?.[0];
          const saldoPrimerLote = Number(primerLote?.cantidadConvertida || 0);
          const req = Number(b.requeridoTeorico || 0);
          const hasMulti = b.esProductoIntermedio && b.lotesDisponibles && b.lotesDisponibles.length > 1;
          const needsDecision = hasMulti && saldoPrimerLote < req;
          const lotesCompletos = hasMulti ? b.lotesDisponibles.filter(l => Number(l.cantidadConvertida || 0) >= req) : [];
          const activeAlloc = allocationState[key] || b.asignacionInoculo || {};
          const currentMode = activeAlloc.modo || 'MEZCLA';
          const selectedUniqueId = activeAlloc.idLote || lotesCompletos[0]?.id;
          const segundoLote = hasMulti ? b.lotesDisponibles[1] : null;
          const faltantePrimerLote = segundoLote ? Math.min(Number(segundoLote?.cantidadConvertida || 0), req - saldoPrimerLote) : 0;

          return (
            <React.Fragment key={key}>
              <tr className={isInsufficient ? styles.missingRow : undefined}>
                <td className={styles.colText}>
                  <div>{b.nombreInsumo}</div>
                  {b.esProductoIntermedio && (
                    <div className={styles.wipStrainBadge}>
                      🧫 Cava: {Number(b.stockActual).toFixed(1)} {b.unidad} disp. {!needsDecision && primerLote ? `(${primerLote.codigoLote})` : ''}
                    </div>
                  )}
                </td>
                <td className={styles.colNumber}>{Number(b.requeridoTeorico).toFixed(2)} {b.unidad}</td>
                <td className={styles.colNumber}>{Number(b.stockActual).toFixed(2)} {b.unidad}</td>
                <td className={styles.colNumber}>{formatCurrency(b.costoUnitarioCalculado)}</td>
                <td className={styles.colNumber}>{formatCurrency(b.subtotalCalculado)}</td>
                <td className={`${styles.colNumber} ${isInsufficient ? styles.missingText : ''}`}>
                  {Number(b.faltante).toFixed(2)} {b.unidad}
                </td>
                <td className={styles.colStatus}>
                  {isInsufficient ? <Badge status="inactive">Insuficiente</Badge> : <Badge status="active">Suficiente</Badge>}
                </td>
              </tr>
              {needsDecision && (
                <tr className={styles.wipSubRow}>
                  <td colSpan={7} className={styles.wipSubRowCell}>
                    <div className={styles.wipSubRowContent}>
                      <span className={styles.wipSubRowTitle}>🧫 Asignación de Cepa:</span>
                      <div className={styles.wipOptionsContainer}>
                        <button
                          type="button"
                          onClick={() => handleToggle(key, {
                            modo: 'MEZCLA',
                            lotes: [{ idLote: primerLote.id, cantidad: saldoPrimerLote }, { idLote: segundoLote?.id, cantidad: faltantePrimerLote }]
                          }, b.onAllocationChange)}
                          className={`${styles.wipPill} ${currentMode === 'MEZCLA' ? styles.wipPillActiveMezcla : ''}`}
                        >
                          <span>⚡ Mezclar FEFO:</span>
                          <span>{primerLote?.codigoLote} ({saldoPrimerLote.toFixed(0)}{b.unidad}) + {segundoLote?.codigoLote} ({faltantePrimerLote.toFixed(0)}{b.unidad})</span>
                        </button>
                        {lotesCompletos.length > 0 && (
                          <div
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                handleToggle(key, { modo: 'LOTE_UNICO', idLote: selectedUniqueId }, b.onAllocationChange);
                              }
                            }}
                            onClick={() => handleToggle(key, { modo: 'LOTE_UNICO', idLote: selectedUniqueId }, b.onAllocationChange)}
                            className={`${styles.wipPill} ${currentMode === 'LOTE_UNICO' ? styles.wipPillActiveUnico : ''}`}
                          >
                            <span>🎯 Lote Único:</span>
                            <select
                              className={styles.wipSelectInner}
                              value={selectedUniqueId}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleToggle(key, { modo: 'LOTE_UNICO', idLote: e.target.value }, b.onAllocationChange);
                              }}
                            >
                              {lotesCompletos.map(l => (
                                <option key={l.id} value={l.id}>
                                  {l.codigoLote || l.codigo || l.numero || l.id.slice(0, 8)} ({Number(l.cantidadConvertida || l.cantidadActual || l.stockActual).toFixed(0)}{b.unidad})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
