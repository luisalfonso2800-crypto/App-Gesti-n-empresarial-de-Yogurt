'use client';

/**
 * @file RecipeStagesTimeline.jsx
 * @module catalog/recipes/components/parts
 * @description Panel izquierdo (Pipeline / Hoja de Ruta) con fichas compactas de etapa e indicadores de completitud.
 * @responsibility Renderizar la lista scrolleable fija de etapas, semáforos y plantillas rápidas (< 130 líneas).
 * @usedBy RecipeStagesMasterDetail
 */

import React from 'react';
import styles from './recipe-stages.module.css';

export function RecipeStagesTimeline({
  etapas = [],
  selectedIndex = 0,
  isCommercial = false,
  onSelectStage,
  onAddEtapa,
  onApplyTemplate
}) {
  const activeStages = etapas.filter(e => e.activo !== false);

  return (
    <div className={styles.timelineCol}>
      <div className={styles.timelineToolbar}>
        <div className={styles.timelineTemplateGroup}>
          <button
            type="button"
            className={styles.templateBtn}
            onClick={() => onApplyTemplate && onApplyTemplate('BASE_TANQUE')}
            title="Ruta de fermentación y cultivo en tanque refrigerado"
          >
            🥛 Base Láctea (WIP)
          </button>
          <button
            type="button"
            className={styles.templateBtn}
            onClick={() => onApplyTemplate && onApplyTemplate('ENVASADO_COMERCIAL')}
            title="Asistente guiado para dosificación, jalea y sellado en envases"
          >
            📦 Empaque Comercial
          </button>
          <button
            type="button"
            className={styles.templateBtn}
            onClick={() => onApplyTemplate && onApplyTemplate('JALEA_FRUTA')}
            title="Ruta estándar para preparación de fruta y jaleas en marmita"
          >
            🍓 Cocción de Fruta / Jalea
          </button>
        </div>
      </div>

      {activeStages.length === 0 ? (
        <div className={styles.emptyTimeline}>
          <p className={styles.emptyTimelineTitle}>
            {isCommercial ? 'Base requerida' : 'Sin etapas aún'}
          </p>
          <p className={styles.emptyTimelineText}>
            {isCommercial
              ? 'Inicie con la incorporación de base láctea desde tanque.'
              : 'Usa una plantilla o agrega la primera etapa.'}
          </p>
          {isCommercial && (
            <div className={styles.commercialSuggestionBox}>
              <button
                type="button"
                className={styles.commercialSuggestionBtn}
                onClick={() => onApplyTemplate && onApplyTemplate('INCORPORACION_BASE')}
                title="Inyectar Recepción y Verificación de Yogurt Base"
              >
                🥛 + 1° Incorporación Base
              </button>
            </div>
          )}
        </div>
      ) : (
        etapas.map((etapa, idx) => {
          if (etapa.activo === false) return null;
          const isSelected = selectedIndex === idx;
          const isComplete = Boolean(etapa.nombre?.trim() && Number(etapa.tiempoEstandarMin) > 0);
          const timeDisplay = Number(etapa.tiempoEstandarMin) > 0 ? `${etapa.tiempoEstandarMin}m` : null;
          const tempDisplay = (Number(etapa.tempMinimaGrados) > 0 || Number(etapa.tempMaximaGrados) > 0)
            ? `${etapa.tempMinimaGrados || 0}-${etapa.tempMaximaGrados || 0}°C`
            : null;
          const itemsCount = etapa.detalles?.filter(d => d.activo !== false).length || 0;

          return (
            <div
              key={idx}
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
        })
      )}

      <button
        type="button"
        className={styles.addStageBtn}
        onClick={() => onAddEtapa && onAddEtapa()}
        title="Crear una nueva etapa vacía"
      >
        <span>+</span> Agregar Etapa
      </button>
    </div>
  );
}
