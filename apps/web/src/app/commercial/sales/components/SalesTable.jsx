/**
 * @file SalesTable.jsx
 * @module commercial/sales/components
 * @description Renderiza historial de facturas.
 * @responsibility Pintar las ventas, totales cobrados y pendientes por cobrar.
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 * @dependencies @/components/ui/Table, Badge, States
 */
import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';

export function SalesTable({ sales, loading, error }) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (sales.length === 0) return <EmptyState title="No hay ventas" description="Registra la primera venta" />;

  return (
    <Table>
      <THead>
        <TR>
          <TH>Cliente (ID)</TH>
          <TH>Fecha</TH>
          <TH>Total</TH>
          <TH>Saldo</TH>
          <TH>Estado</TH>
        </TR>
      </THead>
      <TBody>
        {sales.map((item) => (
          <TR key={item.id}>
            <TD>{item.idCliente}</TD>
            <TD>{new Date(item.fechaVenta).toLocaleDateString()}</TD>
            <TD>${Number(item.totalVenta).toFixed(2)}</TD>
            <TD>${Number(item.saldoPendiente).toFixed(2)}</TD>
            <TD>
              <Badge status={item.estado === 'COMPLETADO' ? 'active' : 'inactive'}>
                {item.estado}
              </Badge>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
