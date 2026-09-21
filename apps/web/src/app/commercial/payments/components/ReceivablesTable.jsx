/**
 * @file ReceivablesTable.jsx
 * @module commercial/payments/components
 * @description Tabla de cartera agrupada por cliente (Master-Detail) con SRP < 120 líneas.
 * @responsibility Agrupar facturas por cliente, renderizar filas maestras y coordinar modales.
 * @usedBy apps/web/src/app/commercial/payments/page.jsx
 * @dependencies react, @/components/ui/Table, ./ReceivableClientRow, ../payments.module.css
 */
'use client';

import React, { useMemo } from 'react';
import { Table, THead, TBody, TR, TH } from '@/components/ui/Table';
import styles from '../payments.module.css';
import ReceivableClientRow from './ReceivableClientRow';

export default function ReceivablesTable({
  receivables = [],
  onOpenAbono,
  onOpenSaldar,
  onOpenInvoice
}) {
  const clientGroups = useMemo(() => {
    const map = new Map();

    for (const item of receivables) {
      const clientId = item.idCliente || item.cliente?.id || 'sin_cliente';
      if (!map.has(clientId)) {
        map.set(clientId, {
          cliente: item.cliente,
          facturas: [],
          saldoTotalCliente: 0,
          totalFacturadoCliente: 0,
          totalAbonadoCliente: 0
        });
      }
      const group = map.get(clientId);
      group.facturas.push(item);
      group.saldoTotalCliente += Number(item.saldoPendiente || 0);
      group.totalFacturadoCliente += Number(item.totalVenta || 0);
      group.totalAbonadoCliente += Number(item.valorPagado || 0);
    }

    return Array.from(map.values()).sort((a, b) => b.saldoTotalCliente - a.saldoTotalCliente);
  }, [receivables]);

  return (
    <Table>
      <THead>
        <TR>
          <TH>Cliente</TH>
          <TH className={styles.clientMasterCenterCell}>Cuentas Activas</TH>
          <TH>Total Facturado</TH>
          <TH>Total Abonado</TH>
          <TH>Saldo Consolidado</TH>
        </TR>
      </THead>
      <TBody>
        {clientGroups.map((group, index) => (
          <ReceivableClientRow
            key={group.cliente?.id || `group-${index}`}
            clientGroup={group}
            onOpenAbono={onOpenAbono}
            onOpenSaldar={onOpenSaldar}
            onOpenInvoice={onOpenInvoice}
          />
        ))}
      </TBody>
    </Table>
  );
}
