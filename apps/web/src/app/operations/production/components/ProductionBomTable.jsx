/**
 * @file ProductionBomTable.jsx
 * @module operations/production/components
 * @description Tabla de explosión de materiales (BOM) con alineación tabular quirúrgica y columnas estrictas.
 * @responsibility Renderizar tabla con Insumo, Req. Teórico, Stock Actual, Costo Unit., Subtotal, Faltante y Estado alineados verticalmente.
 * @usedBy apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx
 * @dependencies react, @/components/ui/Badge, @/lib/formatters, ../production.module.css
 */

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/formatters';
import styles from '../production.module.css';

export function ProductionBomTable({ items = [] }) {
  return (
    <table className={styles.bomTable}>
      <thead>
        <tr>
          <th className={styles.thInsumo}>Insumo</th>
          <th className={styles.thReq}>Req. Teórico</th>
          <th className={styles.thStock}>Stock Actual</th>
          <th className={styles.thCostUnit}>Costo Unit.</th>
          <th className={styles.thSubtotal}>Subtotal</th>
          <th className={styles.thFaltante}>Faltante</th>
          <th className={styles.thStatus}>Estado</th>
        </tr>
      </thead>
      <tbody>
        {items.map((b) => {
          const isInsufficient = Number(b.faltante) > 0;
          const key = b.idInsumo || b.idProductoIntermedio || b.nombreInsumo;
          return (
            <tr key={key} className={isInsufficient ? styles.missingRow : undefined}>
              <td className={styles.colText}>{b.nombreInsumo}</td>
              <td className={styles.colNumber}>
                {Number(b.requeridoTeorico).toFixed(2)} {b.unidad}
              </td>
              <td className={styles.colNumber}>
                {Number(b.stockActual).toFixed(2)} {b.unidad}
              </td>
              <td className={styles.colNumber}>
                {formatCurrency(b.costoUnitarioCalculado)}
              </td>
              <td className={styles.colNumber}>
                {formatCurrency(b.subtotalCalculado)}
              </td>
              <td className={`${styles.colNumber} ${isInsufficient ? styles.missingText : ''}`}>
                {Number(b.faltante).toFixed(2)} {b.unidad}
              </td>
              <td className={styles.colStatus}>
                {isInsufficient ? (
                  <Badge status="inactive">Insuficiente</Badge>
                ) : (
                  <Badge status="active">Suficiente</Badge>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
