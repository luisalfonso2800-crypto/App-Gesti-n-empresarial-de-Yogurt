/**
 * @file PurchasesHistoryTable.jsx
 * @module operations/purchases/components
 * @description Tabla de compras finalizadas con desglose expandible de insumos y balance contable.
 * @responsibility Renderizar el listado histórico de compras y sus partidas de flete/insumos.
 * @usedBy apps/web/src/app/operations/purchases/page.jsx
 * @dependencies react, next/navigation, lucide-react, @/components/ui/Table, @/components/ui/Badge, @/components/ui/Button
 */
import React from 'react';
import { useRouter } from 'next/navigation';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from '../purchases.module.css';

export default function PurchasesHistoryTable({
  groupedPurchases,
  expandedId,
  toggleRow
}) {
  const router = useRouter();

  return (
    <Table>
      <THead>
        <TR>
          <TH>Lista / Identificador</TH>
          <TH>Fecha</TH>
          <TH>Ítems</TH>
          <TH>Total ($)</TH>
          <TH>Estado</TH>
        </TR>
      </THead>
      <TBody>
        {groupedPurchases.map((group) => {
          const orden = group.orden;
          const title = group.isGrouped && orden ? `${orden.codigo} - ${orden.nombre}` : `Compra Directa - ${new Date(group.fechaCompra).toLocaleDateString()}`;
          
          let conseguidosCount = group.detalles.length;
          let faltantesCount = 0;
          let isCompleted = true;

          if (group.isGrouped && orden) {
            const totalItems = orden.items ? orden.items.length : 0;
            faltantesCount = Math.max(0, totalItems - conseguidosCount);
            if (faltantesCount > 0) {
              isCompleted = false;
            }
          }

          return (
            <React.Fragment key={group.id}>
              <TR 
                className={expandedId === group.id ? styles.tableRowInteractiveActive : styles.tableRowInteractive} 
                onClick={() => toggleRow(group.id)}
              >
                <TD>
                  <div className={styles.rowTitleContainer}>
                    {expandedId === group.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    <strong>{title}</strong>
                  </div>
                </TD>
                <TD>{new Date(group.fechaCompra).toLocaleDateString()}</TD>
                <TD>
                  <span className={styles.itemsConseguidosText}>{conseguidosCount} conseguidos</span>
                  {faltantesCount > 0 && (
                    <span className={styles.itemsFaltantesText}>
                      / {faltantesCount} faltantes
                    </span>
                  )}
                </TD>
                <TD>${Number(group.total).toLocaleString('es-CO')}</TD>
                <TD>
                  <Badge status={isCompleted ? 'active' : 'warning'}>
                    {isCompleted ? 'Completada' : 'En Ruta / Parcial'}
                  </Badge>
                </TD>
              </TR>
              {expandedId === group.id && (
                <TR>
                  <TD colSpan="5" className={styles.detailsCellWrapper}>
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
                            <th className={styles.detailsTableCell}>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.detalles && group.detalles.length > 0 ? (
                            group.detalles.map((d, idx) => (
                              <tr key={d.id || idx} className={styles.detailsTableBodyRow}>
                                <td className={styles.detailsTableCell}>{d.insumo?.nombre || d.idInsumo}</td>
                                <td className={styles.detailsTableCell}>{d.presentacion || d.insumo?.marca || 'Empaque'}</td>
                                <td className={styles.detailsTableCell}>{d.proveedor?.nombre || d.idProveedor}</td>
                                <td className={styles.detailsTableCell}>{Number(d.cantidad)}</td>
                                <td className={styles.detailsTableCell}>${Number(d.precioUnitario).toLocaleString('es-CO')}</td>
                                <td className={styles.detailsTableCell}>${Number(d.subtotal).toLocaleString('es-CO')}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className={styles.detailsEmptyCell}>
                                No hay detalles disponibles para esta compra.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      
                      <div className={styles.detailsTotalsContainer}>
                        <div className={styles.totalsRow}>
                          <span className={styles.totalsMutedLabel}>Subtotal Ítems:</span>
                          <span>${Number(group.detalles.reduce((acc, d) => acc + Number(d.subtotal), 0)).toLocaleString('es-CO')}</span>
                        </div>
                        <div className={styles.totalsRow}>
                          <span className={styles.totalsMutedLabel}>Flete Global:</span>
                          <span>${Number(group.total - group.detalles.reduce((acc, d) => acc + Number(d.subtotal), 0)).toLocaleString('es-CO')}</span>
                        </div>
                        <div className={styles.totalsRowFinal}>
                          <span>Total Compra:</span>
                          <span>${Number(group.total).toLocaleString('es-CO')}</span>
                        </div>
                      </div>

                    </div>
                  </TD>
                </TR>
              )}
            </React.Fragment>
          );
        })}
      </TBody>
    </Table>
  );
}
