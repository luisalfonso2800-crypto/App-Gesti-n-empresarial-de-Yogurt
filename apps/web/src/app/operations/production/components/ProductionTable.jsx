/**
 * @file ProductionTable.jsx
 * @module operations/production/components
 * @description Tabla de órdenes de producción.
 * @responsibility Renderizar las órdenes registradas y boton de cierre.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 * @dependencies @/components/ui/Table, Badge, Button, States
 */
import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import styles from '../production.module.css';

export function ProductionTable({ productions, loading, error, onComplete, onNew }) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (productions.length === 0) {
    return (
      <AssistedEmptyState
        icon="⚙️"
        title="Comienza programando tu primera Orden de Producción"
        description="Programa órdenes de transformación por lote a partir de las recetas activas."
        actionLabel="+ Programar Producción"
        onAction={() => onNew && onNew()}
        topButtonLabel="Nueva Producción"
      />
    );
  }

  return (
    <Table>
      <THead>
        <TR>
          <TH>Producto (ID)</TH>
          <TH>Fecha</TH>
          <TH>Planificada</TH>
          <TH>Producida</TH>
          <TH>Estado</TH>
          <TH>Acciones</TH>
        </TR>
      </THead>
      <TBody>
        {productions.map((item) => (
          <TR key={item.id}>
            <TD>{item.idProducto}</TD>
            <TD>{new Date(item.fechaProduccion).toLocaleDateString()}</TD>
            <TD>{Number(item.cantidadPlanificada).toFixed(2)}</TD>
            <TD>{item.cantidadProducidaReal ? Number(item.cantidadProducidaReal).toFixed(2) : '-'}</TD>
            <TD>
              <Badge status={item.estado === 'COMPLETADA' ? 'active' : 'inactive'}>
                {item.estado}
              </Badge>
            </TD>
            <TD>
              {item.estado !== 'COMPLETADA' && (
                <Button onClick={() => onComplete(item)}>Cerrar Orden (Real)</Button>
              )}
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
