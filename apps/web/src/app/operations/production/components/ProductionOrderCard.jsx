/**
 * @file ProductionOrderCard.jsx
 * @module operations/production/components
 * @description Tarjeta para orden de producción en planta con telemetría de lote, split de inóculo y Design System MANNÁ.
 * @responsibility Renderizar tarjeta de orden individual de producción con nombres legibles, estado operativo y acciones.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 * @dependencies react, next/navigation, lucide-react, ../production.module.css
 */
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, CheckCircle2, PackageOpen, Clock, AlertTriangle, FlaskConical } from 'lucide-react';
import ProductionIncidentModal from './ProductionIncidentModal';
import styles from '../production.module.css';

export default function ProductionOrderCard({ order, startOrder, openComplete, onReportIncident }) {
  const router = useRouter();
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  const nombreProducto = order.producto?.nombre || order.receta?.nombre || 'YOGURT BASE';
  const uMed = order.receta?.unidadRendimiento || order.receta?.unidadMedida || 'Litros';
  const cantidad = Number(order.cantidadPlanificada) || 0;
  const fechaProd = order.fechaProduccion ? new Date(order.fechaProduccion).toLocaleDateString('es-CO') : 'Sin fecha';
  const codigoLote = order.idLote ? order.idLote.split('-')[0].toUpperCase() : null;

  // Extracción genealógica de división de lote / inóculo guardado
  const lotePrincipal = order.lotes?.[0];
  const loteHijoInoculo = lotePrincipal?.lotesHijos?.[0] || order.lotes?.find(l => l.idLotePadre || l.tipoLote === 'SEMIELABORADO_WIP');
  const tieneInoculo = Boolean(order.estado === 'COMPLETADA' && (loteHijoInoculo || order.reservaInoculo?.cantidad > 0));
  const cantInoculo = Number(loteHijoInoculo?.cantidadInicial || order.reservaInoculo?.cantidad || 0);
  const cantEnvasar = Math.max(0, Number(order.cantidadProducidaReal || order.cantidadReal || lotePrincipal?.cantidadInicial || 0) - (loteHijoInoculo ? 0 : cantInoculo));
  const codInoculo = loteHijoInoculo?.id ? loteHijoInoculo.id.split('-')[0].toUpperCase() : (order.reservaInoculo?.codigoLoteHijo || 'INOC');

  const getStatusBadge = () => {
    if (order.estado === 'EN_PROCESO') return <span className={`${styles.orderStatusBadge} ${styles.orderStatusEnProceso}`}>🟡 En Fermentación / Proceso</span>;
    if (order.estado === 'COMPLETADA') return <span className={`${styles.orderStatusBadge} ${styles.orderStatusCompletada}`}>✔ Lote Liquidado</span>;
    return <span className={`${styles.orderStatusBadge} ${styles.orderStatusPlanificada}`}>⚪ Planificada</span>;
  };

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <div className={styles.orderHeaderInfo}>
          <h3 className={styles.orderProductTitle}>{nombreProducto}</h3>
          <span className={styles.orderLoteSub}>{codigoLote ? `LOTE: ${codigoLote}` : 'ORDEN EN COLA'}</span>
        </div>
        <div className={styles.orderHeaderRight}>
          <span className={styles.pillPlanta}>EN PLANTA</span>
          {getStatusBadge()}
        </div>
      </div>

      {tieneInoculo ? (
        <div className={styles.splitVolumeGrid}>
          <div>
            <div className={styles.volumeBlockHeader}>🥛 DISPONIBLE PARA ENVASAR</div>
            <div className={styles.volumeBlockValue}>{cantEnvasar} {uMed} <span className={styles.infoGridLabel}>en cava</span></div>
          </div>
          <div>
            <div className={styles.volumeBlockHeader}>🧫 INICIADOR GUARDADO</div>
            <div className={styles.volumeBlockValue}>{cantInoculo} {uMed} <span className={styles.inoculumHighlight}>({codInoculo})</span></div>
          </div>
        </div>
      ) : (
        <div className={styles.orderInfoGrid}>
          <div className={styles.infoGridItem}>
            <span className={styles.infoGridLabel}>Volumen / Cantidad</span>
            <span className={styles.infoGridValue}>
              {order.estado === 'COMPLETADA' && order.cantidadProducidaReal != null ? `${Number(order.cantidadProducidaReal)} ${uMed} obtenidos` : `${cantidad} ${uMed} en proceso`}
            </span>
          </div>
          <div className={styles.infoGridItem}>
            <span className={styles.infoGridLabel}>Fecha Inicio</span>
            <span className={styles.infoGridValue}>{fechaProd}</span>
          </div>
        </div>
      )}

      <div className={styles.orderTelemetry}>
        <Clock size={13} />
        <span>{order.estado === 'EN_PROCESO' ? 'Fermentación activa en tanque' : order.estado === 'COMPLETADA' ? 'Control de calidad y cavas completado' : 'Listo para dosificación e inicio'}</span>
      </div>

      <div className={styles.orderFooter}>
        {order.estado === 'PLANIFICADA' && (
          <button type="button" className={styles.btnMannaSecondary} onClick={() => startOrder(order.id)}>
            <Play size={14} className={styles.iconSpaced} /> Iniciar Proceso
          </button>
        )}
        {order.estado === 'EN_PROCESO' && (
          <div className={styles.orderActionsGroup}>
            <button type="button" onClick={() => setShowIncidentModal(true)} className={styles.btnIncident}>
              <AlertTriangle size={13} className={styles.iconSpaced} /> ⚠ Reportar Incidencia
            </button>
            <button type="button" className={styles.btnMannaPrimary} onClick={() => openComplete(order)}>
              <CheckCircle2 size={14} className={styles.iconSpaced} /> ✔ Finalizar y Liquidar Lote
            </button>
          </div>
        )}
        {order.estado === 'COMPLETADA' && codigoLote && (
          <div className={styles.orderActionsGroup}>
            <span className={styles.loteLink} onClick={() => router.push('/operations/lots')}>
              <PackageOpen size={14} /> Ver Lote: {codigoLote}
            </span>
            {codInoculo && (
              <span className={styles.inoculumLink} onClick={() => router.push('/operations/lots')}>
                <FlaskConical size={12} /> Iniciador: {codInoculo}
              </span>
            )}
          </div>
        )}
      </div>

      {showIncidentModal && (
        <ProductionIncidentModal isOpen={showIncidentModal} onClose={() => setShowIncidentModal(false)} order={order} onReportIncident={onReportIncident} />
      )}
    </div>
  );
}

