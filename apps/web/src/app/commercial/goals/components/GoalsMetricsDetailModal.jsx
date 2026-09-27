/**
 * @file GoalsMetricsDetailModal.jsx
 * @module commercial/goals/components
 * @description Modal inteligente de desglose interactivo de KPIs para Rumbo MANNÁ (SRP < 140 líneas).
 * @responsibility Mostrar desglose cuantitativo y lista filtrada al hacer click en los KPIs.
 * @usedBy apps/web/src/app/commercial/goals/page.jsx
 * @dependencies react, @/components/ui/SmartModal, lucide-react, @/lib/formatters, ../goals.module.css
 */
'use client';

import React from 'react';
import SmartModal from '@/components/ui/SmartModal';
import { Sprout, CheckCircle2, TrendingUp, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../goals.module.css';

export function GoalsMetricsDetailModal({
  isOpen,
  onClose,
  type,
  metrics,
  goals = [],
  availableFunds,
  onApplyFilter
}) {
  if (!isOpen) return null;

  const harvestedGoals = goals.filter(g => (g.progresoPorcentaje || 0) >= 100);
  const activeGoals = goals.filter(g => (g.progresoPorcentaje || 0) < 100);

  const getModalConfig = () => {
    switch (type) {
      case 'harvested':
        return {
          title: 'Metas Cosechadas y Cumplidas (100%)',
          subtitle: 'Objetivos alcanzados que representan victorias consolidadas.',
          icon: CheckCircle2,
          list: harvestedGoals,
          filterType: 'COSECHADA'
        };
      case 'active':
        return {
          title: 'Metas en Crecimiento y Ritmo Activo',
          subtitle: 'Proyectos y sueños que están recibiendo flujo o aportes periódicos.',
          icon: TrendingUp,
          list: activeGoals,
          filterType: 'EN_CRECIMIENTO'
        };
      case 'funds':
        return {
          title: 'Balance de Fondos y Utilidad para Metas',
          subtitle: 'Distribución de liquidez disponible para sembrar en sueños personales o proyectos.',
          icon: Wallet,
          list: [],
          filterType: null,
          isFundsView: true
        };
      case 'all':
      default:
        return {
          title: 'Historial Total de Metas y Sueños',
          subtitle: 'Consolidado general de metas activas y logradas en el sistema.',
          icon: Sprout,
          list: goals,
          filterType: 'TODOS'
        };
    }
  };

  const { title, subtitle, icon: IconComponent, list, filterType, isFundsView } = getModalConfig();

  return (
    <SmartModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={IconComponent}
    >
      <div className={styles.modalDetailContainer}>
        {isFundsView ? (
          <div className={styles.modalFundsBreakdown}>
            <div className={styles.fundsCardItem}>
              <span>Fondos Disponibles para Asignar:</span>
              <strong className={styles.fundsCardBigVal}>
                {formatCurrency(availableFunds?.fondosDisponibles || 0)}
              </strong>
            </div>
            <div className={styles.fundsCardItemRow}>
              <span>Utilidad Neta Operativa:</span>
              <strong>{formatCurrency(availableFunds?.utilidadNetaOperativa || 0)}</strong>
            </div>
            <div className={styles.fundsCardItemRow}>
              <span>Aportes Reservados (Alcancías):</span>
              <strong>{formatCurrency(availableFunds?.aportesReservados || 0)}</strong>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.modalMetricsSummaryRow}>
              <div className={styles.modalSummaryBadge}>
                <strong>{list.length}</strong> meta(s) encontradas
              </div>
              {onApplyFilter && filterType && (
                <button
                  type="button"
                  className={styles.modalFilterApplyBtn}
                  onClick={() => {
                    onApplyFilter(filterType);
                    onClose();
                  }}
                >
                  Filtrar en el tablero principal →
                </button>
              )}
            </div>

            <div className={styles.modalGoalsScrollList}>
              {list.length === 0 ? (
                <p className={styles.modalEmptyNotice}>No hay metas en esta categoría.</p>
              ) : (
                list.map(goal => (
                  <div key={goal.id} className={styles.modalGoalItem}>
                    <div className={styles.modalGoalItemHead}>
                      <span className={styles.modalGoalTitle}>{goal.titulo}</span>
                      <span className={styles.modalGoalProgVal}>{goal.progresoPorcentaje || 0}%</span>
                    </div>
                    <div className={styles.modalGoalItemMeta}>
                      <span>Meta: {formatCurrency(goal.valorObjetivo)}</span>
                      <span>Acumulado: {formatCurrency(goal.valorActual)}</span>
                      <span>Ámbito: {goal.ambito === 'PERSONAL_FAMILIAR' ? 'Personal' : 'Empresa'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </SmartModal>
  );
}
