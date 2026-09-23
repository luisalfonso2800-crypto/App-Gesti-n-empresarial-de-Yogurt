/**
 * @file StageCardItem.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Tarjeta de etapa individual en acordeón exclusivo: modo colapsado o expandido con BOM y reloj digital.
 * @responsibility Orquestar la vista colapsada/expandida de una etapa, delegando header y campos a subcomponentes.
 * @usedBy apps/web/src/app/catalog/recipes/components/modal-parts/RecipeStagesList.jsx
 */

import React from 'react';
import { IngredientsFormSection } from '../IngredientsFormSection';
import { StageCardHeader } from './StageCardHeader';
import { StageCardBomFields } from './StageCardBomFields';
import styles from '../recipe-modal.module.css';

export function StageCardItem({
  etapa, eIdx, isExpanded, summaryText, totalStagesCount,
  supplies, products, currentRecipeProductId, formatMinutesToDigitalClock,
  onExpand, onCollapse, onRemoveEtapa, onMoveEtapa,
  onUpdateEtapa, onAddDetalle, onUpdateDetalle, onRemoveDetalle
}) {
  // 1. Vista Colapsada (~45px de altura)
  if (!isExpanded) {
    return (
      <div
        className={styles.collapsedStageRow}
        onClick={onExpand}
        title="Haz clic para desplegar y editar esta etapa"
      >
        <div className={styles.collapsedStageInfo}>
          <span className={styles.collapsedStageName}>
            Etapa {etapa.orden}: {etapa.nombre || 'Etapa sin nombre'}
          </span>

          {/* Badges de Tiempo y Temperatura */}
          <div className={styles.collapsedBadgesRow}>
            {Number(etapa.tiempoEstandarMin) > 0 && (
              <span className={styles.collapsedBadge}>⏱️ {etapa.tiempoEstandarMin}m</span>
            )}
            {(Number(etapa.tempMinimaGrados) > 0 || Number(etapa.tempMaximaGrados) > 0) && (
              <span className={styles.collapsedBadge}>🌡️ {etapa.tempMinimaGrados}°C - {etapa.tempMaximaGrados}°C</span>
            )}
          </div>

          <span className={styles.collapsedSummaryText}>{summaryText}</span>
        </div>

        <div className={styles.collapsedActions}>
          {onMoveEtapa && (
            <div className={styles.stageMoveGroup}>
              <button type="button" disabled={eIdx === 0}
                onClick={(e) => { e.stopPropagation(); onMoveEtapa(eIdx, 'UP'); }}
                className={styles.btnMoveStage} title="Subir etapa (ejecutar antes)">▲</button>
              <button type="button" disabled={eIdx === totalStagesCount - 1}
                onClick={(e) => { e.stopPropagation(); onMoveEtapa(eIdx, 'DOWN'); }}
                className={styles.btnMoveStage} title="Bajar etapa (ejecutar después)">▼</button>
            </div>
          )}
          <button type="button" onClick={(e) => { e.stopPropagation(); onExpand(); }} className={styles.btnEditCollapsed}>
            Editar
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onRemoveEtapa(eIdx); }}
            className={styles.btnRemoveCollapsed} title="Eliminar etapa">✕</button>
        </div>
      </div>
    );
  }

  // 2. Vista Expandida con controles completos
  return (
    <div className={styles.stageCard}>
      <StageCardHeader
        etapa={etapa} eIdx={eIdx} totalStagesCount={totalStagesCount}
        onCollapse={onCollapse} onRemoveEtapa={onRemoveEtapa} onMoveEtapa={onMoveEtapa}
      />

      <StageCardBomFields
        etapa={etapa} eIdx={eIdx}
        onUpdateEtapa={onUpdateEtapa}
        formatMinutesToDigitalClock={formatMinutesToDigitalClock}
      />

      <IngredientsFormSection
        etapa={etapa} etapaIndex={eIdx}
        supplies={supplies} products={products}
        currentRecipeProductId={currentRecipeProductId}
        onAdd={onAddDetalle} onUpdate={onUpdateDetalle} onRemove={onRemoveDetalle}
      />

      {/* Cápsula Reactiva de Retroalimentación Textual en Lenguaje de Planta */}
      <div className={styles.stageFeedbackCapsule}>
        <span className={styles.stageFeedbackIcon}>📋</span>
        <div className={styles.stageFeedbackContent}>
          <strong className={styles.stageFeedbackHeading}>Lectura de Operación en Planta:</strong>
          <div className={styles.stageFeedbackBody}>{summaryText}</div>
        </div>
      </div>
    </div>
  );
}
