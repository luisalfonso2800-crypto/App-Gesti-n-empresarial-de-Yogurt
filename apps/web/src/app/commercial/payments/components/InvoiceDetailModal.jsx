/**
 * @file InvoiceDetailModal.jsx
 * @module commercial/payments/components
 * @description Modal editorial de detalle e impresión de comprobante de venta/factura para Cartera (SRP < 130 líneas).
 * @usedBy apps/web/src/app/commercial/payments/page.jsx
 * @dependencies react, @/components/ui/SmartModal, @/lib/api-client, @/lib/formatters, lucide-react, @/context/InvoiceConfigContext
 */
'use client';

import React, { useState, useEffect } from 'react';
import { Printer } from 'lucide-react';
import SmartModal from '@/components/ui/SmartModal';
import { apiClient } from '@/lib/api-client';
import { formatCurrency } from '@/lib/formatters';
import modalStyles from '@/components/ui/SmartModal.module.css';
import { useInvoiceConfig } from '@/context/InvoiceConfigContext';
import { InvoiceHeaderEditorial, InvoiceDataColumns, InvoiceCorporateFooter } from '@/app/commercial/sales/components/SaleInvoiceParts';
import styles from '@/app/commercial/sales/components/sale-invoice-print-modal.module.css';

export default function InvoiceDetailModal({ isOpen, onClose, saleItem }) {
  const { config } = useInvoiceConfig();
  const [saleDetail, setSaleDetail] = useState(null);

  useEffect(() => {
    if (isOpen && saleItem?.id) {
      apiClient
        .get(`/sales/${saleItem.id}`)
        .then((res) => setSaleDetail(res?.data || res))
        .catch(() => setSaleDetail(saleItem));
    } else {
      setSaleDetail(null);
    }
  }, [isOpen, saleItem]);

  if (!saleItem) return null;
  const current = saleDetail || saleItem;
  const items = current.detalles || [];
  const clientName = current.cliente?.nombre || current.clienteNombre || 'CLIENTE GENERAL';
  const idVenta = current.id ? current.id.slice(0, 8).toUpperCase() : 'N/A';
  const fecha = current.fechaVenta ? new Date(current.fechaVenta).toLocaleDateString() : new Date().toLocaleDateString();

  const subtotalBruto = Number(current.subtotal || items.reduce((acc, i) => acc + (Number(i.cantidad || 0) * Number(i.precioUnitario || 0)), 0));
  const descuentoTotal = Number(current.descuentoTotal || items.reduce((acc, i) => acc + Number(i.descuento || 0), 0));
  const baseGravable = Number(current.baseImponible || Math.max(0, subtotalBruto - descuentoTotal));

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <SmartModal isOpen={isOpen} onClose={onClose} title="Comprobante de Venta" subtitle={`Venta #${idVenta}`} isDirty={false}>
      <div className={styles.editorialVoucherContainer}>
        <InvoiceHeaderEditorial idVenta={idVenta} fecha={fecha} config={config} />
        <InvoiceDataColumns sale={current} clientName={clientName} fecha={fecha} />

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
              const tarifaIva = Number(item.tarifaIva ?? (current.aplicaIva ? 19 : 0));

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
              <div className={styles.observationsContent}>{current.observaciones || 'Sin observaciones registradas.'}</div>
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
              <span>IVA ({current.aplicaIva ? '19%' : '0%'}):</span>
              <span>{formatCurrency(current.ivaTotal || 0)}</span>
            </div>
            <div className={styles.financialRowTotal}><span>TOTAL FACTURA:</span><span>{formatCurrency(current.totalVenta)}</span></div>

            <div className={styles.creditSummaryBox}>
              <div className={styles.financialRow}><span>Abonado:</span><strong>{formatCurrency(current.valorPagado || 0)}</strong></div>
              <div className={styles.financialRow}><span>Saldo Pendiente:</span><span className={styles.creditPendingValue}>{formatCurrency(current.saldoPendiente || 0)}</span></div>
            </div>
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
