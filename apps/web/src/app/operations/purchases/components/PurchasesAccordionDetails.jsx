/**
 * @file PurchasesAccordionDetails.jsx
 * @module operations/purchases/components
 * @description Subtabla y consolidado de IVA / Flete para acordeón de compras (SRP < 150 líneas).
 * @responsibility Renderizar tabla detallada con columnas fiscales (Base, IVA %, IVA $, Subtotal) y balance contable.
 * @usedBy apps/web/src/app/operations/purchases/components/PurchasesHistoryTable.jsx
 * @dependencies react, next/navigation, @/components/ui/Button, ../purchases.module.css
 */
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import styles from '../purchases.module.css';

export default function PurchasesAccordionDetails({ group, isCompleted }) {
  const router = useRouter();

  const totalSinIvaCalc = group.totalSinIva !== undefined && group.totalSinIva !== null
    ? Number(group.totalSinIva)
    : (group.detalles || []).reduce((acc, d) => {
        if (d.subtotalSinIva !== undefined && d.subtotalSinIva !== null) return acc + Number(d.subtotalSinIva);
        const st = Number(d.subtotal) || 0;
        return acc + (d.tieneIva ? st / 1.19 : st);
      }, 0);

  const totalIvaCalc = group.totalIva !== undefined && group.totalIva !== null
    ? Number(group.totalIva)
    : (group.detalles || []).reduce((acc, d) => {
        if (d.montoIva !== undefined && d.montoIva !== null) return acc + Number(d.montoIva);
        const st = Number(d.subtotal) || 0;
        return acc + (d.tieneIva ? (st - (st / 1.19)) : 0);
      }, 0);

  const subtotalItems = (group.detalles || []).reduce((acc, d) => acc + Number(d.subtotal || 0), 0);
  const flete = Math.max(0, Number(group.total || 0) - subtotalItems);

  return (
    <div className={styles.detailsContainer}>
      {!isCompleted && (
        <div className={styles.incompleteBanner}>
          <span className={styles.incompleteBannerText}>
            ⚠️ Esta lista de compra aún tiene insumos pendientes por conseguir o comprar. Puedes continuar el checklist para completarlos o descartarlos.
          </span>
          <Button variant="secondary" onClick={() => router.push(`/operations/purchases/new?orderId=${group.id}`)}>
            Completar Lista
          </Button>
        </div>
      )}
      <h4 className={styles.detailsSectionTitle}>Detalle de la Compra</h4>
      <table className={styles.detailsTable}>
        <thead>
          <tr className={styles.detailsTableHeadRow}>
            <th className={styles.detailsTableCell}>Insumo</th>
            <th className={styles.detailsTableCell}>Presentación / Marca</th>
            <th className={styles.detailsTableCell}>Proveedor</th>
            <th className={styles.detailsTableCell}>Cant. Neta</th>
            <th className={styles.detailsTableCell}>Costo Unit.</th>
            <th className={styles.detailsTableCell}>Base Sin IVA</th>
            <th className={styles.detailsTableCell}>IVA (%)</th>
            <th className={styles.detailsTableCell}>IVA ($)</th>
            <th className={styles.detailsTableCell}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {group.detalles && group.detalles.length > 0 ? (
            group.detalles.map((d, idx) => {
              const tieneIva = d.tieneIva !== undefined ? Boolean(d.tieneIva) : true;
              const pct = tieneIva ? (Number(d.porcentajeIva !== undefined ? d.porcentajeIva : 19)) : 0;
              const subtotalNum = Number(d.subtotal || 0);
              const baseNum = d.subtotalSinIva !== undefined && d.subtotalSinIva !== null
                ? Number(d.subtotalSinIva)
                : (tieneIva ? subtotalNum / (1 + (pct / 100)) : subtotalNum);
              const montoIvaNum = d.montoIva !== undefined && d.montoIva !== null
                ? Number(d.montoIva)
                : (subtotalNum - baseNum);

              return (
                <tr key={d.id || idx} className={styles.detailsTableBodyRow}>
                  <td className={styles.detailsTableCell}>{d.insumo?.nombre || d.idInsumo}</td>
                  <td className={styles.detailsTableCell}>{d.presentacion || d.insumo?.marca || 'Empaque'}</td>
                  <td className={styles.detailsTableCell}>{d.proveedor?.nombre || d.idProveedor}</td>
                  <td className={styles.detailsTableCell}>{Number(d.cantidad)}</td>
                  <td className={styles.detailsTableCell}>${Number(d.precioUnitario).toLocaleString('es-CO')}</td>
                  <td className={styles.detailsTableCell}>${Math.round(baseNum).toLocaleString('es-CO')}</td>
                  <td className={styles.detailsTableCell}>{tieneIva ? `${pct}%` : '0% (Exento)'}</td>
                  <td className={styles.detailsTableCell}>${Math.round(montoIvaNum).toLocaleString('es-CO')}</td>
                  <td className={styles.detailsTableCell}>${Math.round(subtotalNum).toLocaleString('es-CO')}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" className={styles.detailsEmptyCell}>
                No hay detalles disponibles para esta compra.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.detailsTotalsContainer}>
        <div className={styles.totalsRow}>
          <span className={styles.totalsMutedLabel}>Subtotal Sin IVA:</span>
          <span>${Math.round(totalSinIvaCalc).toLocaleString('es-CO')}</span>
        </div>
        <div className={styles.totalsRow}>
          <span className={styles.totalsMutedLabel}>Total IVA Discriminado:</span>
          <span>${Math.round(totalIvaCalc).toLocaleString('es-CO')}</span>
        </div>
        {flete > 0 && (
          <div className={styles.totalsRow}>
            <span className={styles.totalsMutedLabel}>Flete Global:</span>
            <span>${Math.round(flete).toLocaleString('es-CO')}</span>
          </div>
        )}
        <div className={styles.totalsRowFinal}>
          <span>Total Factura:</span>
          <span>${Number(group.total).toLocaleString('es-CO')}</span>
        </div>
      </div>
    </div>
  );
}
