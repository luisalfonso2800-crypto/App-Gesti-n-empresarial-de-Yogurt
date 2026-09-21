/**
 * @file SaleInvoicePrintModal.jsx
 * @module commercial/sales/components
 * @description Modal de comprobante editorial exacto MANNÁ e impresión directa (SRP < 130 líneas).
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 * @dependencies react, @/components/ui/SmartModal, @/lib/formatters, lucide-react, @/context/InvoiceConfigContext
 */
'use client';

import React from 'react';
import { Printer } from 'lucide-react';
import SmartModal from '@/components/ui/SmartModal';
import { formatCurrency } from '@/lib/formatters';
import modalStyles from '@/components/ui/SmartModal.module.css';
import { useInvoiceConfig } from '@/context/InvoiceConfigContext';
import { InvoiceHeaderEditorial, InvoiceDataColumns, InvoiceCorporateFooter } from './SaleInvoiceParts';
import styles from './sale-invoice-print-modal.module.css';

export default function SaleInvoicePrintModal({ isOpen, onClose, sale }) {
  const { config } = useInvoiceConfig();
  if (!sale) return null;

  const items = sale.detalles || [];
  const clientName = sale.cliente?.nombre || sale.clienteNombre || 'CLIENTE GENERAL';
  const idVenta = sale.id ? sale.id.slice(0, 8).toUpperCase() : 'N/A';
  const fecha = sale.fechaVenta ? new Date(sale.fechaVenta).toLocaleDateString() : new Date().toLocaleDateString();

  const subtotalBruto = Number(sale.subtotal || items.reduce((acc, i) => acc + (Number(i.cantidad || 0) * Number(i.precioUnitario || 0)), 0));
  const descuentoTotal = Number(sale.descuentoTotal || items.reduce((acc, i) => acc + Number(i.descuento || 0), 0));
  const baseGravable = Number(sale.baseImponible || Math.max(0, subtotalBruto - descuentoTotal));

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <SmartModal isOpen={isOpen} onClose={onClose} title="Comprobante de Venta" subtitle={`Venta #${idVenta}`} isDirty={false}>
      <div className={styles.editorialVoucherContainer}>
        <InvoiceHeaderEditorial idVenta={idVenta} fecha={fecha} config={config} />
        <InvoiceDataColumns sale={sale} clientName={clientName} fecha={fecha} />

        <table className={styles.tableContainer}>
          <thead>
            <tr>
              <th className={`${styles.tableTh} ${styles.tableThCenter}`}>#</th>
              <th className={`${styles.tableTh} ${styles.tableThLeft}`}>Producto</th>
              <th className={`${styles.tableTh} ${styles.tableThCenter}`}>Cant.</th>
              <th className={`${styles.tableTh} ${styles.tableThRight}`}>Precio unitario</th>
              <th className={`${styles.tableTh} ${styles.tableThRight}`}>Descuento</th>
              <th className={`${styles.tableTh} ${styles.tableThRight}`}>IVA</th>
              <th className={`${styles.tableTh} ${styles.tableThRight}`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const cant = Number(item.cantidad || 0);
              const precio = Number(item.precioUnitario || 0);
              const desc = Number(item.descuento || 0);
              const isGift = precio === 0 || (desc > 0 && desc >= (cant * precio));
              const tarifaIva = Number(item.tarifaIva ?? (sale.aplicaIva ? 19 : 0));

              return (
                <tr key={item.id || idx}>
                  <td className={`${styles.tableTd} ${styles.tableTdCenter}`}>{idx + 1}</td>
                  <td className={styles.tableTd}>{item.producto?.nombre || item.nombreProducto || `Ítem #${idx + 1}`}</td>
                  <td className={`${styles.tableTd} ${styles.tableTdCenter}`}>{cant}</td>
                  <td className={`${styles.tableTd} ${styles.tableTdRight}`}>
                    {isGift ? <span className={styles.giftBadge}>CORTESÍA</span> : formatCurrency(precio)}
                  </td>
                  <td className={`${styles.tableTd} ${styles.tableTdRight}`}>
                    {desc > 0 ? <span className={styles.itemDiscountBadge}>- {formatCurrency(desc)}</span> : '-'}
                  </td>
                  <td className={`${styles.tableTd} ${styles.tableTdRight}`}>{tarifaIva > 0 ? `${tarifaIva}%` : '0%'}</td>
                  <td className={`${styles.tableTd} ${styles.tableTdTotal}`}>
                    {isGift ? <span className={styles.giftBadge}>OBSEQUIO</span> : formatCurrency(item.totalLinea || Math.max(0, (cant * precio) - desc))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className={styles.bottomSectionGrid}>
          <div className={styles.observationsBox}>
            <div>
              <div className={styles.observationsTitle}>OBSERVACIONES</div>
              <div className={styles.observationsContent}>{sale.observaciones || 'Sin observaciones particulares en la emisión de esta orden.'}</div>
            </div>
            <div className={styles.observationsGratitude}>&ldquo;{config.fraseProposito || 'Gracias por ser parte de este propósito.'}&rdquo;</div>
          </div>

          <div className={styles.financialSummaryCard}>
            <div className={styles.financialRow}><span>Subtotal:</span><span>{formatCurrency(subtotalBruto)}</span></div>
            {descuentoTotal > 0 && (
              <div className={styles.financialDiscountRow}><span>Descuentos:</span><span>- {formatCurrency(descuentoTotal)}</span></div>
            )}
            <div className={styles.financialRow}><span>Base gravable:</span><span>{formatCurrency(baseGravable)}</span></div>
            <div className={styles.financialRow}>
              <span>IVA ({sale.aplicaIva ? '19%' : '0%'}):</span>
              <span>{formatCurrency(sale.ivaTotal || 0)}</span>
            </div>
            <div className={styles.financialRowTotal}><span>TOTAL FACTURA:</span><span>{formatCurrency(sale.totalVenta)}</span></div>

            {sale.tipoPago === 'CONTADO' ? (
              <div className={styles.creditSummaryBox}>
                <div className={styles.financialRow}><span>Total Pagado:</span><strong>{formatCurrency(sale.totalVenta)}</strong></div>
              </div>
            ) : (
              <div className={styles.creditSummaryBox}>
                <div className={styles.financialRow}><span>Abonado:</span><strong>{formatCurrency(sale.valorPagado || 0)}</strong></div>
                <div className={styles.financialRow}><span>Saldo Pendiente:</span><span className={styles.creditPendingValue}>{formatCurrency(sale.saldoPendiente || 0)}</span></div>
              </div>
            )}
          </div>
        </div>

        <InvoiceCorporateFooter config={config} />
      </div>

      <div className={styles.actionsRow}>
        <button type="button" onClick={onClose} className={modalStyles.btnCancel}>Cerrar</button>
        <button type="button" onClick={handlePrint} className={styles.btnPrint}>
          <Printer size={16} /> Imprimir Comprobante
        </button>
      </div>
    </SmartModal>
  );
}
