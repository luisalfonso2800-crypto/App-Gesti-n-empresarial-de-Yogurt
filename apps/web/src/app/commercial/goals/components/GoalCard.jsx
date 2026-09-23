'use client';

import React from 'react';
import { Trash2, Pencil, Coins } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../goals.module.css';

const RITMO_CLASSES = {
  ADELANTADA: styles.ritmoAdelantada, EN_RITMO: styles.ritmoEnRitmo,
  EN_RIESGO: styles.ritmoEnRiesgo, ATRASADA: styles.ritmoAtrasada, CUMPLIDA: styles.ritmoCumplida,
};

const BOTANICO_LABELS = {
  SEMILLA: '🌱 Semilla (0-25%)', EN_CRECIMIENTO: '🌿 En Crecimiento (26-70%)',
  FLORACION: '🌸 Floración (71-99%)', COSECHADA: '🍇 Cosechada (100%)',
};

function getStrategyBadge(goal) {
  const est = goal.estrategiaAsignacion || 'MANUAL';
  if (est === 'PORCENTAJE') return `📊 ${goal.porcentajeFlujo || 0}% Flujo`;
  if (est === 'CASCADA') return `🌊 Cascada #${goal.ordenPrioridad || 1}`;
  return '🏺 Alcancía Manual';
}

/**
 * @file GoalCard.jsx
 * @description Tarjeta cuantitativa de meta/sueño con edición, aporte y estado botánico (< 125 líneas).
 */
export function GoalCard({ goal, onEdit, onDelete, onOpenContribute }) {
  const isPersonal = goal.ambito === 'PERSONAL_FAMILIAR';
  const falta = Math.max(0, goal.valorObjetivo - goal.valorActual);
  const progreso = Math.min(100, Math.max(0, goal.progresoPorcentaje || 0));
  const isManual = (goal.estrategiaAsignacion || 'MANUAL') === 'MANUAL';

  const formatUnit = (val) => {
    if (goal.tipoMetrica === 'PRODUCCION_LITROS') {
      return `${Math.round(val).toLocaleString('es-CO')} Lts`;
    }
    return formatCurrency(val);
  };

  /** Estilo dinámico de la barra de progreso — valor porcentual calculado en runtime */
  const progressBarStyle = { width: `${progreso}%` };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardBadges}>
          <span className={`${styles.ambitoBadge} ${isPersonal ? styles.ambitoPersonal : styles.ambitoEmpresarial}`}>
            {isPersonal ? 'Sueño Personal' : 'Objetivo Empresa'}
          </span>
          <span className={styles.botanicoBadge}>
            {BOTANICO_LABELS[goal.estadoBotanico] || goal.estadoBotanico}
          </span>
          <span className={styles.estrategiaBadge}>
            {getStrategyBadge(goal)}
          </span>
        </div>
        <div className={styles.cardActions}>
          {onEdit && (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => onEdit(goal)}
              title="Editar meta"
              aria-label="Editar meta"
            >
              <Pencil size={15} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.deleteBtn}`}
              onClick={() => onDelete(goal.id)}
              title="Archivar meta"
              aria-label="Archivar meta"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className={styles.cardTitle}>{goal.titulo}</h3>
        {goal.descripcion && <p className={styles.cardDesc}>{goal.descripcion}</p>}
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressLabelRow}>
          <span>Progreso</span>
          <strong>{progreso}%</strong>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} style={progressBarStyle} />
        </div>
      </div>

      <div className={styles.qaGrid}>
        <div className={styles.qaItem}>
          <span className={styles.qaQuestion}>¿Cuánto necesitamos?</span>
          <span className={styles.qaAnswer}>{formatUnit(goal.valorObjetivo)}</span>
        </div>
        <div className={styles.qaItem}>
          <span className={styles.qaQuestion}>¿Cuánto llevamos?</span>
          <span className={styles.qaAnswer}>{formatUnit(goal.valorActual)}</span>
        </div>
        <div className={styles.qaItem}>
          <span className={styles.qaQuestion}>¿Cuánto nos falta?</span>
          <span className={styles.qaAnswer}>{formatUnit(falta)}</span>
        </div>
        <div className={styles.qaItem}>
          <span className={styles.qaQuestion}>¿Vamos a tiempo?</span>
          <span className={styles.qaAnswer}>{goal.tiempoTranscurridoPorcentaje || 0}% plazo</span>
        </div>
      </div>

      {isPersonal && isManual && onOpenContribute && (
        <button
          type="button"
          className={styles.contributeBtn}
          onClick={() => onOpenContribute(goal)}
        >
          <Coins size={15} />
          + Sembrar Fondos
        </button>
      )}

      <div className={styles.cardFooter}>
        <span className={`${styles.ritmoBadge} ${RITMO_CLASSES[goal.estadoRitmo] || styles.ritmoEnRitmo}`}>
          {goal.estadoRitmo || 'EN RITMO'}
        </span>
        <span className={styles.cardDates}>
          Hasta {new Date(goal.fechaFin).toLocaleDateString('es-CO')}
        </span>
      </div>

      {goal.observaciones && <p className={styles.rewardQuote}>"{goal.observaciones}"</p>}
    </div>
  );
}
