/**
 * @file GoalsMetrics.jsx
 * @module commercial/goals/components
 * @description Tarjetas métricas superiores interactivas para Rumbo MANNÁ (MAN-UI-003, SRP < 120 líneas).
 * @responsibility Mostrar 4 KPIs clave (Total Metas, Cosechadas/Cumplidas, En Crecimiento Activo, Fondos Disponibles).
 * @usedBy apps/web/src/app/commercial/goals/page.jsx
 * @dependencies react, lucide-react, @/lib/formatters, ../goals.module.css
 */
'use client';

import React from 'react';
import { Sprout, CheckCircle2, TrendingUp, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../goals.module.css';

export function GoalsMetrics({ metrics, loading, onCardClick }) {
  if (loading || !metrics) return null;

  const {
    totalGoals = 0,
    harvestedCount = 0,
    activeGrowingCount = 0,
    availableFunds = 0
  } = metrics;

  return (
    <div className={styles.metricsGrid} role="region" aria-label="Métricas de Rumbo MANNÁ">
      {/* 1. Total Metas Sembradas */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('all')}
        title="Ver todas las metas sembradas"
      >
        <div className={styles.metricIconWrapper}>
          <Sprout size={20} className={styles.metricIconForest} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Metas Sembradas</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{totalGoals}</span>
            <span className={styles.metricBadge}>Totales</span>
          </div>
          <span className={styles.metricHint}>Ver todas →</span>
        </div>
      </button>

      {/* 2. Cosechadas / Cumplidas */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('harvested')}
        title="Ver metas cumplidas al 100%"
      >
        <div className={styles.metricIconWrapper}>
          <CheckCircle2 size={20} className={styles.metricIconSuccess} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Cosechadas (100%)</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{harvestedCount}</span>
            <span className={styles.metricBadgeSuccess}>Cumplidas</span>
          </div>
          <span className={styles.metricHint}>Ver logros →</span>
        </div>
      </button>

      {/* 3. En Crecimiento / Ritmo Activo */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('active')}
        title="Ver metas en proceso activo"
      >
        <div className={styles.metricIconWrapper}>
          <TrendingUp size={20} className={styles.metricIconBio} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>En Crecimiento</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{activeGrowingCount}</span>
            <span className={styles.metricBadgeBio}>En Camino</span>
          </div>
          <span className={styles.metricHint}>Filtrar activas →</span>
        </div>
      </button>

      {/* 4. Fondos Disponibles para Asignar */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('funds')}
        title="Ver fondos y utilidad neta disponible"
      >
        <div className={styles.metricIconWrapper}>
          <Wallet size={20} className={styles.metricIconGold} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Fondos Asignables</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{formatCurrency(availableFunds)}</span>
          </div>
          <span className={styles.metricHint}>Ver balance →</span>
        </div>
      </button>
    </div>
  );
}
