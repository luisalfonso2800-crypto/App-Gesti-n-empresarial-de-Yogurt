/**
 * @file CavaCommercialTable.jsx
 * @module operations/inventory/components
 * @description Tabla de Cava Comercial (Envasados) con análisis financiero: costo, precio venta, margen y venta proyectada (SRP < 135 líneas).
 * @usedBy apps/web/src/app/operations/inventory/page.jsx
 */
import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/formatters';
import styles from '../inventory.module.css';

export default function CavaCommercialTable({ items = [], onAdjust }) {
  const formatPresentation = (item) => {
    const pNom = item.producto?.nombre || item.nombre || 'Producto';
    const presObj = item.producto?.presentacion || item.presentacion;
    const presNombre = item.presentacionNombre || item.nombrePresentacion || presObj?.nombre || '';
    const volPres = item.volumenPresentacion || presObj?.volumen || presObj?.volumenOzMl || item.contenidoNeto || '';
    const volLimpio = volPres.includes('/') ? volPres.split('/')[1].trim() : volPres;
    const detallePres = volLimpio ? `${presNombre} • ${volLimpio}` : presNombre;

    return { pNom, detallePres: detallePres || 'Unidad Comercial' };
  };

  const calculatedItems = items.map((item) => {
    const { pNom, detallePres } = formatPresentation(item);
    const stock = Number(item.cantidadActual || 0);
    const costoUnit = Number(item.costoPromedio || item.producto?.costoEstandar || 0);
    const precioVenta = Number(item.producto?.precioVentaSug || item.producto?.precioVenta || item.precioVenta || 0);
    const gananciaUnit = Math.max(0, precioVenta - costoUnit);
    const margenPct = precioVenta > 0 ? (gananciaUnit / precioVenta) * 100 : 0;
    const ventaTotal = stock * precioVenta;
    const gananciaTotal = stock * gananciaUnit;

    return { ...item, pNom, detallePres, stock, costoUnit, precioVenta, gananciaUnit, margenPct, ventaTotal, gananciaTotal };
  });

  const totalPotencial = calculatedItems.reduce((acc, it) => acc + it.ventaTotal, 0);
  const totalUtilidad = calculatedItems.reduce((acc, it) => acc + it.gananciaTotal, 0);

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.cavaFinancialSummary}>
        <div className={styles.financialCard}>
          <span className={styles.financialLabel}>Total Potencial en Cava</span>
          <strong className={styles.financialValuePotential}>{formatCurrency(totalPotencial)}</strong>
        </div>
        <div className={styles.financialCard}>
          <span className={styles.financialLabel}>Utilidad Bruta Proyectada</span>
          <strong className={styles.financialValueProfit}>{formatCurrency(totalUtilidad)}</strong>
        </div>
      </div>

      <Table>
        <THead>
          <TR>
            <TH>Producto Terminado</TH>
            <TH className={styles.thRight}>Stock Actual</TH>
            <TH className={styles.thRight}>Costo Unit.</TH>
            <TH className={styles.thRight}>P. Venta</TH>
            <TH className={styles.thRight}>Margen Unit.</TH>
            <TH className={styles.thRight}>Venta Total</TH>
            <TH className={styles.thRight}>Ganancia Total</TH>
            <TH className={styles.thCenter}>Acciones</TH>
          </TR>
        </THead>
        <TBody>
          {calculatedItems.length === 0 ? (
            <TR>
              <TD colSpan={8} className={styles.emptyText}>No hay productos terminados envasados en Cava.</TD>
            </TR>
          ) : (
            calculatedItems.map((item) => (
              <TR key={item.idProducto || item.id} className={styles.tableRow}>
                <TD>
                  <strong className={styles.monoStrong}>{item.pNom}</strong>
                  <span className={styles.tableSubtext}>{item.detallePres}</span>
                </TD>
                <TD className={styles.tdRight}>
                  <span className={styles.badgeUnits}>{item.stock.toLocaleString('es-CO')} Und</span>
                </TD>
                <TD className={styles.tdRight}>{formatCurrency(item.costoUnit)}</TD>
                <TD className={styles.tdRight}>{formatCurrency(item.precioVenta)}</TD>
                <TD className={styles.tdRight}>
                  <div className={styles.positiveText}>{formatCurrency(item.gananciaUnit)}</div>
                  <small className={styles.textMuted}>{item.margenPct.toFixed(1)}%</small>
                </TD>
                <TD className={styles.tdRight}><strong>{formatCurrency(item.ventaTotal)}</strong></TD>
                <TD className={styles.tdRight}><strong className={styles.positiveText}>{formatCurrency(item.gananciaTotal)}</strong></TD>
                <TD className={styles.tdCenter}>
                  <Button variant="secondary" size="sm" onClick={() => onAdjust(item)}>Ajustar</Button>
                </TD>
              </TR>
            ))
          )}
        </TBody>
      </Table>
    </div>
  );
}
