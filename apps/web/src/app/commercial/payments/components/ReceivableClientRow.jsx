/**
 * @file ReceivableClientRow.jsx
 * @module commercial/payments/components
 * @description Fila agrupada por cliente con acordeón desplegable de facturas (SRP < 130 líneas).
 * @responsibility Renderizar consolidado del cliente y subtabla de facturas con acciones.
 * @usedBy apps/web/src/app/commercial/payments/components/ReceivablesTable.jsx
 * @dependencies react, @/lib/formatters, lucide-react, ../payments.module.css
 */
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../payments.module.css';

export default function ReceivableClientRow({
  clientGroup,
  onOpenAbono,
  onOpenSaldar,
  onOpenInvoice
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { cliente, facturas, saldoTotalCliente, totalFacturadoCliente, totalAbonadoCliente } = clientGroup;

  const getBadge = (item) => {
    if (item.saldoPendiente < 0) return <span className={styles.badgeSaldado}>ANTICIPO: {formatCurrency(Math.abs(item.saldoPendiente))}</span>;
    if (item.saldoPendiente === 0) return <span className={styles.badgeSaldado}>SALDADO</span>;
    if (item.estadoVencimiento === 'VENCIDO') return <span className={styles.badgeVencido}>VENCIDO ({item.diasVencido} d)</span>;
    if (item.estadoVencimiento === 'POR_VENCER') return <span className={styles.badgePorVencer}>POR VENCER ({item.diasPorVencer} d)</span>;
    return <span className={styles.badgeAlDia}>AL DÍA</span>;
  };

  return (
    <>
      <tr className={styles.clientMasterRow} onClick={() => setIsExpanded(!isExpanded)}>
        <td className={styles.clientMasterCell}>
          <div className={styles.clientMasterTitleCell}>
            <span className={styles.chevronBtn}>
              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </span>
            <div>
              <strong className={styles.clientName}>{cliente?.nombre || 'CLIENTE GENERAL'}</strong>
              <span className={styles.clientDoc}>{cliente?.telefono ? `Tel: ${cliente.telefono}` : 'Sin teléfono'}</span>
            </div>
          </div>
        </td>
        <td className={styles.clientMasterCenterCell}>
          <span className={styles.invoicesCountBadge}>
            {facturas.length} {facturas.length === 1 ? 'cuenta' : 'cuentas'}
          </span>
        </td>
        <td>{formatCurrency(totalFacturadoCliente)}</td>
        <td className={styles.textPaid}>{formatCurrency(totalAbonadoCliente)}</td>
        <td className={styles.textPendingMaster}>
          {formatCurrency(saldoTotalCliente)}
        </td>
      </tr>

      {isExpanded && (
        <tr>
          <td colSpan={5} className={styles.expandedSubtableCell}>
            <div className={styles.subtableWrapper}>
              <table className={styles.subtable}>
                <thead>
                  <tr>
                    <th className={styles.subtableTh}>Venta (# ID)</th>
                    <th className={styles.subtableTh}>Fecha</th>
                    <th className={styles.subtableTh}>Vencimiento</th>
                    <th className={styles.subtableTh}>Total</th>
                    <th className={styles.subtableTh}>Abonado</th>
                    <th className={styles.subtableTh}>Saldo</th>
                    <th className={styles.subtableTh}>Estado</th>
                    <th className={styles.subtableTh}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {facturas.map((sale) => (
                    <tr key={sale.id}>
                      <td className={styles.subtableTd}>
                        <span className={styles.saleIdTag}>#{sale.id.slice(0, 8)}</span>
                      </td>
                      <td className={styles.subtableTd}>
                        {new Date(sale.fechaVenta).toLocaleDateString()}
                      </td>
                      <td className={styles.subtableTd}>
                        {sale.fechaLimitePago ? new Date(sale.fechaLimitePago).toLocaleDateString() : 'Inmediato'}
                      </td>
                      <td className={styles.subtableTd}>{formatCurrency(sale.totalVenta)}</td>
                      <td className={`${styles.subtableTd} ${styles.textPaid}`}>
                        {formatCurrency(sale.valorPagado)}
                      </td>
                      <td className={`${styles.subtableTd} ${styles.textPending}`}>
                        <strong>{formatCurrency(sale.saldoPendiente)}</strong>
                      </td>
                      <td className={styles.subtableTd}>{getBadge(sale)}</td>
                      <td className={styles.subtableTd}>
                        <div className={styles.actionButtonsRow}>
                          {sale.saldoPendiente > 0 && (
                            <>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onOpenAbono(sale); }}
                                className={styles.btnActionAbonar}
                              >
                                Abonar
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onOpenSaldar(sale); }}
                                className={styles.btnActionSaldar}
                              >
                                Saldar
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            title="Ver e Imprimir Comprobante"
                            onClick={(e) => { e.stopPropagation(); onOpenInvoice(sale); }}
                            className={styles.btnActionView}
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
