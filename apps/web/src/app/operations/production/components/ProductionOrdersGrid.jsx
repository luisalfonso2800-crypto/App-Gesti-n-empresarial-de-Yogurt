/**
 * @file ProductionOrdersGrid.jsx
 * @module operations/production/components
 * @description Muestra el listado de órdenes o el estado guiado vacío.
 * @responsibility Renderizar cuadrícula de tarjetas de producción o AssistedEmptyState.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 */
import React from 'react';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import ProductionOrderCard from './ProductionOrderCard';
import styles from '../production.module.css';

export default function ProductionOrdersGrid({
  orders = [],
  onOpenCreate,
  startOrder,
  openComplete,
  handleReportIncident
}) {
  if (orders.length === 0) {
    return (
      <AssistedEmptyState
        icon="⚙️"
        title="Comienza programando tu primera Orden de Producción"
        description="Programa órdenes de transformación por lote a partir de las recetas activas."
        actionLabel="+ Programar Producción"
        onAction={onOpenCreate}
        topButtonLabel="+ Nueva Producción"
      />
    );
  }

  return (
    <div className={styles.grid}>
      {orders.map((order) => (
        <ProductionOrderCard
          key={order.id}
          order={order}
          startOrder={startOrder}
          openComplete={openComplete}
          onReportIncident={handleReportIncident}
        />
      ))}
    </div>
  );
}
