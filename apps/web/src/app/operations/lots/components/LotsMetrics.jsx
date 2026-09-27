/**
 * @file LotsMetrics.jsx
 * @module operations/lots/components
 * @description Tarjetas de métricas interactivas superiores para la bitácora de lotes en cava (SRP < 120 líneas).
 * @responsibility Mostrar 4 KPIs clave (Total Lotes, En Existencia, Cepas Vivas WIP, En Alerta / Vencidos).
 * @usedBy apps/web/src/app/operations/lots/page.jsx
 * @dependencies react, lucide-react, ../lots.module.css
 */
'use client';

import React from 'react';
import { Layers, CheckCircle2, Dna, AlertTriangle } from 'lucide-react';
import styles from '../lots.module.css';

export function LotsMetrics({ metrics, loading, onCardClick }) {
  if (loading || !metrics) return null;

  const {
    totalLots = 0,
    inStockCount = 0,
    strainsCount = 0,
    alertCount = 0
  } = metrics;

  return (
    <div className={styles.metricsGrid} role="region" aria-label="Métricas de Lotes y Cava">
      {/* 1. Total Lotes Registrados */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('all')}
        title="Ver todos los lotes"
      >
        <div className={styles.metricIconWrapper}>
          <Layers size={20} className={styles.metricIconForest} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Total Lotes</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{totalLots}</span>
            <span className={styles.metricBadge}>Historial</span>
          </div>
          <span className={styles.metricHint}>Ver bitácora →</span>
        </div>
      </button>

      {/* 2. En Existencia Activa */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('inStock')}
        title="Filtrar lotes con saldo disponible"
      >
        <div className={styles.metricIconWrapper}>
          <CheckCircle2 size={20} className={styles.metricIconSuccess} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>En Existencia</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{inStockCount}</span>
            <span className={styles.metricBadgeSuccess}>Disponibles</span>
          </div>
          <span className={styles.metricHint}>Filtrar activos →</span>
        </div>
      </button>

      {/* 3. Cepas / Semielaborados WIP */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('strains')}
        title="Filtrar cepas e iniciadores vivos"
      >
        <div className={styles.metricIconWrapper}>
          <Dna size={20} className={styles.metricIconBio} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Cepas Vivas WIP</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{strainsCount}</span>
            <span className={styles.metricBadgeBio}>Inóculos</span>
          </div>
          <span className={styles.metricHint}>Ver pases F0-F4 →</span>
        </div>
      </button>

      {/* 4. En Alerta / Vencidos */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('alerts')}
        title="Lotes próximos a vencer o vencidos"
      >
        <div className={styles.metricIconWrapper}>
          <AlertTriangle size={20} className={styles.metricIconAlert} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Riesgo / Vencidos</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{alertCount}</span>
            <span className={styles.metricBadgeAlert}>FEFO</span>
          </div>
          <span className={styles.metricHint}>Revisar cava →</span>
        </div>
      </button>
    </div>
  );
}
