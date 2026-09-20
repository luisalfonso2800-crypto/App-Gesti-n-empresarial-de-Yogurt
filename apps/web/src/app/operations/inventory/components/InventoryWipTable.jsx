/**
 * @file InventoryWipTable.jsx
 * @module operations/inventory/components
 * @description Tabla de semielaborados e inóculos WIP activos con trazabilidad FEFO.
 * @responsibility Renderizar lotes de cepas e inóculos con semáforo de días restantes y lote padre.
 * @usedBy apps/web/src/app/operations/inventory/page.jsx
 * @dependencies react, @/components/ui/Table, @/components/ui/Badge
 */
'use client';

import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import styles from '../inventory.module.css';

export default function InventoryWipTable({ wipLots = [] }) {
  const getFefoBadge = (fechaVencimiento) => {
    if (!fechaVencimiento) return <Badge variant="neutral">Sin Vencimiento</Badge>;
    const diffDays = Math.ceil((new Date(fechaVencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return <Badge variant="danger">Vencido ({Math.abs(diffDays)}d atrás)</Badge>;
    if (diffDays <= 3) return <Badge variant="warning">⚠️ {diffDays} días restantes</Badge>;
    return <Badge variant="success">✅ {diffDays} días restantes</Badge>;
  };

  return (
    <div className={styles.tableWrapper}>
      <Table>
        <THead>
          <TR>
            <TH>Lote / Cepa</TH>
            <TH>Base / Producto</TH>
            <TH className={styles.thRight}>Stock Disponible</TH>
            <TH className={styles.thCenter}>Caducidad (FEFO)</TH>
            <TH className={styles.thCenter}>Lote Origen</TH>
          </TR>
        </THead>
        <TBody>
          {wipLots.map((lote) => {
            const stockQty = Number(lote.cantidadDisponible ?? lote.cantidadActual ?? 0);
            const unit = lote.unidad || 'Litros';
            return (
              <TR key={lote.id} className={styles.tableRow}>
                <TD>
                  <div className={styles.flexCenter}>
                    <span className={styles.wipIcon}>🧫</span>
                    <strong className={styles.monoStrong}>
                      {lote.codigoLote || (lote.id ? lote.id.slice(0, 8) : 'INOC-WIP')}
                    </strong>
                  </div>
                  <div className={styles.wipNotes} title={`Reserva de inóculo / Lote Padre: ${lote.lotePadre?.codigoLote || lote.lotePadre?.id?.slice(0, 8) || 'Inicial'}`}>
                    Reserva inóculo · Padre: {lote.lotePadre?.codigoLote || lote.lotePadre?.id?.slice(0, 8) || 'Inicial'}
                  </div>
                </TD>
                <TD>
                  <div>
                    <span className={styles.categoryBadge}>{lote.producto?.nombre || 'Inóculo Base'}</span>
                    {lote.observaciones && <p className={styles.wipNotes}>{lote.observaciones}</p>}
                  </div>
                </TD>
                <TD className={styles.tdRight}>
                  <span className={styles.monoStrong}>{stockQty} {unit}</span>
                </TD>
                <TD className={styles.tdCenter}>
                  {getFefoBadge(lote.fechaVencimiento)}
                </TD>
                <TD className={styles.tdCenter}>
                  <Badge variant="neutral">
                    {lote.lotePadre ? (lote.lotePadre.codigoLote || (lote.lotePadre.id ? lote.lotePadre.id.slice(0, 8) : 'Padre')) : 'Inicial'}
                  </Badge>
                </TD>
              </TR>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
}
