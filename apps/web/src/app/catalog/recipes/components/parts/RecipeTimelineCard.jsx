'use client';

/**
 * @file RecipeTimelineCard.jsx
 * @module catalog/recipes/components/parts
 * @description Tarjeta compacta individual para la lista de etapas del pipeline con reordenamiento Poka-Yoke (< 75 líneas).
 * @responsibility Renderizar número, título, badges de telemetría y botones ▲/▼ asistidos.
 */

import React from 'react';
import styles from './recipe-stages.module.css';

export function RecipeTimelineCard({
  etapa,
  idx,
  totalStages,
  isSelected,
  onSelectStage,
  onMoveEtapa,
  onDeleteEtapa
}) {
  const isComplete = Boolean(etapa.nombre?.trim() && Number(etapa.tiempoEstandarMin) > 0);
  const timeDisplay = Number(etapa.tiempoEstandarMin) > 0 ? `${etapa.tiempoEstandarMin}m` : null;
  const tempDisplay = (Number(etapa.tempMinimaGrados) > 0 || Number(etapa.tempMaximaGrados) > 0)
    ? `${etapa.tempMinimaGrados || 0}-${etapa.tempMaximaGrados || 0}°C`
    : null;
  const itemsCount = etapa.detalles?.filter(d => d.activo !== false).length || 0;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (totalStages <= 1) return;
    if (itemsCount > 0) {
      const confirmDelete = window.confirm(`¿Eliminar la etapa "${etapa.nombre || `Etapa ${idx + 1}`}" que contiene ${itemsCount} insumo(s)?`);
      if (!confirmDelete) return;
    }
    if (onDeleteEtapa) onDeleteEtapa(idx);
  };

  return (
    <div
      className={`${styles.timelineCard} ${isSelected ? styles.timelineCardActive : ''}`}
      onClick={() => onSelectStage(idx)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectStage(idx);
        }
      }}
    >
      <div className={styles.timelineCardHeader}>
        <span className={styles.stageNumberBadge}>{etapa.orden || idx + 1}</span>
        <span className={styles.timelineCardTitle} title={etapa.nombre || 'Etapa sin nombre'}>
          {etapa.nombre || `Etapa ${idx + 1}`}
        </span>
        <div className={styles.stageCardActions} onClick={e => e.stopPropagation()}>
          <button
            type="button"
            className={styles.btnCardOrder}
            disabled={idx === 0}
            onClick={() => onMoveEtapa && onMoveEtapa(idx, 'UP')}
            title="Mover etapa hacia arriba"
          >
            ▲
          </button>
          <button
            type="button"
            className={styles.btnCardOrder}
            disabled={idx === totalStages - 1}
            onClick={() => onMoveEtapa && onMoveEtapa(idx, 'DOWN')}
            title="Mover etapa hacia abajo"
          >
            ▼
          </button>
          <button
            type="button"
            className={styles.stageDeleteCardBtn}
            disabled={totalStages <= 1}
            onClick={handleDelete}
            title={totalStages <= 1 ? 'La receta debe tener al menos una etapa' : 'Eliminar esta etapa'}
          >
            🗑
          </button>
        </div>
        <span className={isComplete ? styles.statusPillComplete : styles.statusPillIncomplete}>
          {isComplete ? 'Completa' : 'Incompleta'}
        </span>
      </div>

      <div className={styles.timelineBadgesRow}>
        {timeDisplay && <span className={styles.microBadge}>⏱ {timeDisplay}</span>}
        {tempDisplay && <span className={styles.microBadge}>🌡 {tempDisplay}</span>}
        <span className={styles.microBadge}>📦 {itemsCount} {itemsCount === 1 ? 'insumo' : 'insumos'}</span>
      </div>
    </div>
  );
}
