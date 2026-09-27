/**
 * @file LotsMetricsDetailModal.jsx
 * @module operations/lots/components
 * @description Modal inteligente de desglose interactivo de KPIs para Lotes (SRP < 150 líneas).
 * @responsibility Mostrar desglose contextual de los 4 KPIs (Totales, Existencias, Cepas, Alertas FEFO).
 * @usedBy apps/web/src/app/operations/lots/page.jsx
 * @dependencies react, lucide-react, @/components/ui/SmartModal, ../lots.module.css
 */
'use client';

import React from 'react';
import SmartModal from '@/components/ui/SmartModal';
import { Layers, CheckCircle2, Dna, AlertTriangle } from 'lucide-react';
import styles from '../lots.module.css';

export function LotsMetricsDetailModal({
  isOpen,
  onClose,
  type,
  metrics,
  lots = [],
  getStatus,
  onSelectTab
}) {
  if (!isOpen) return null;

  const inStockLots = lots.filter(l => Number(l.cantidadDisponible) > 0);
  const strainsLots = lots.filter(l => (l.tipoLote === 'SEMIELABORADO_WIP' || Boolean(l.idLotePadre)) && Number(l.cantidadDisponible) > 0);
  const alertLots = lots.filter(l => {
    if (Number(l.cantidadDisponible) <= 0) return false;
    const status = getStatus(l.fechaVencimiento);
    return status.color === 'danger' || status.color === 'warning';
  });

  const getModalConfig = () => {
    switch (type) {
      case 'inStock':
        return {
          title: 'Lotes en Existencia Activa',
          subtitle: 'Productos y cepas disponibles para despacho o consumo en cava.',
          icon: CheckCircle2,
          list: inStockLots,
          tabTarget: 'EXISTENCIA'
        };
      case 'strains':
        return {
          title: 'Cepas Semielaboradas e Inóculos WIP',
          subtitle: 'Trazabilidad biológica de cepas madre y pases operativos (F0 a F4).',
          icon: Dna,
          list: strainsLots,
          tabTarget: 'CEPAS'
        };
      case 'alerts':
        return {
          title: 'Lotes en Riesgo FEFO y Vencimientos',
          subtitle: 'Lotes con saldo activo que están vencidos o próximos a vencer (<= 15 días).',
          icon: AlertTriangle,
          list: alertLots,
          tabTarget: 'TODOS'
        };
      case 'all':
      default:
        return {
          title: 'Historial Consolidado de Lotes',
          subtitle: 'Bitácora completa de lotes registrados en el sistema.',
          icon: Layers,
          list: lots,
          tabTarget: 'TODOS'
        };
    }
  };

  const { title, subtitle, icon: IconComponent, list, tabTarget } = getModalConfig();

  return (
    <SmartModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={IconComponent}
    >
      <div className={styles.modalDetailContainer}>
        <div className={styles.modalMetricsSummaryRow}>
          <div className={styles.modalSummaryBadge}>
            <strong>{list.length}</strong> lote(s) encontrados
          </div>
          {onSelectTab && (
            <button
              type="button"
              className={styles.modalFilterApplyBtn}
              onClick={() => {
                onSelectTab(tabTarget);
                onClose();
              }}
            >
              Aplicar a la tabla principal →
            </button>
          )}
        </div>

        <div className={styles.modalLotsScrollList}>
          {list.length === 0 ? (
            <p className={styles.modalEmptyNotice}>No hay lotes en esta categoría de métrica.</p>
          ) : (
            list.map(lote => {
              const cod = lote.codigoLote || (lote.id ? lote.id.split('-')[0].toUpperCase() : 'N/A');
              const status = getStatus ? getStatus(lote.fechaVencimiento) : { text: 'N/A' };
              const prodName = lote.producto?.nombre || 'Insumo Interno';
              const isInoculo = lote.tipoLote === 'SEMIELABORADO_WIP' || Boolean(lote.idLotePadre);

              return (
                <div key={lote.id} className={styles.modalLotItem}>
                  <div className={styles.modalLotItemHead}>
                    <span className={styles.modalLotCode}>{cod}</span>
                    <span className={styles.modalLotBadgeStatus}>{status.text}</span>
                  </div>
                  <div className={styles.modalLotItemBody}>
                    <div className={styles.modalLotProdName}>
                      {prodName} {isInoculo && <span className={styles.badgeInoculumSm}>🧫 Cepa</span>}
                    </div>
                    <div className={styles.modalLotMeta}>
                      <span>Disp: <strong>{Number(lote.cantidadDisponible)}</strong> {lote.unidad || 'UND'}</span>
                      <span>Vence: {lote.fechaVencimiento ? new Date(lote.fechaVencimiento).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </SmartModal>
  );
}
