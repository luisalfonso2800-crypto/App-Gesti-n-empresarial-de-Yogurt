/**
 * @file ProductionOrderCard.jsx
 * @module operations/production/components
 * @description Tarjeta para orden de producción con estado, planificado vs real y acciones operativas.
 * @responsibility Renderizar tarjeta de orden individual de producción.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 * @dependencies react, next/navigation, lucide-react, @/components/ui/Badge, @/components/ui/Button
 */
import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Play, CheckCircle, PackageOpen } from 'lucide-react';
import styles from '../production.module.css';

export default function ProductionOrderCard({
  order,
  startOrder,
  openComplete
}) {
  const router = useRouter();

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <span className={styles.orderId}>{order.id.split('-')[0].toUpperCase()}</span>
        <Badge status={order.estado === 'COMPLETADA' ? 'active' : order.estado === 'EN_PROCESO' ? 'warning' : 'default'}>
          {order.estado.replace('_', ' ')}
        </Badge>
      </div>
      <div className={styles.orderBody}>
        <p><strong>Planificado:</strong> {Number(order.cantidadPlanificada)} und</p>
        {order.estado === 'COMPLETADA' && <p><strong>Producido:</strong> {Number(order.cantidadProducidaReal)} und</p>}
        <p><strong>Fecha Fabricación:</strong> {new Date(order.fechaProduccion).toLocaleDateString()}</p>
        {order.fechaVencimiento && (
          <p><strong>Vencimiento:</strong> {new Date(order.fechaVencimiento).toLocaleDateString()}</p>
        )}
      </div>
      <div className={styles.orderFooter}>
        {order.estado === 'PLANIFICADA' && (
          <Button variant="secondary" size="sm" onClick={() => startOrder(order.id)}>
            <Play size={14} className={styles.iconSpaced} /> Iniciar
          </Button>
        )}
        {order.estado === 'EN_PROCESO' && (
          <Button variant="primary" size="sm" onClick={() => openComplete(order)}>
            <CheckCircle size={14} className={styles.iconSpaced} /> Cerrar Orden
          </Button>
        )}
        {order.estado === 'COMPLETADA' && order.idLote && (
          <span className={styles.loteLink} onClick={() => router.push('/operations/inventory')}>
            <PackageOpen size={14} /> Lote: {order.idLote.split('-')[0]}
          </span>
        )}
      </div>
    </div>
  );
}
