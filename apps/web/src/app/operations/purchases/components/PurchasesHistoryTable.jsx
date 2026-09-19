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

import PurchasesAccordionDetails from './PurchasesAccordionDetails';

export default function PurchasesHistoryTable({
  groupedPurchases,
  expandedId,
  toggleRow
}) {
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
                    <PurchasesAccordionDetails group={group} isCompleted={isCompleted} />
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
