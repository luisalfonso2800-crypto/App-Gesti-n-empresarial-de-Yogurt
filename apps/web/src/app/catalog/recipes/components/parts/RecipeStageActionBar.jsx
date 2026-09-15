'use client';

/**
 * @file RecipeStageActionBar.jsx
 * @module catalog/recipes/components/parts
 * @description Barra de acciones del pie del editor de etapas con gestión (orden, duplicar, eliminar) y navegación de flujo (< 110 líneas).
 * @responsibility Separar controles destructivos/gestión de los botones de navegación secuencial.
 * @usedBy RecipeStageEditor
 */

import React from 'react';
import styles from './recipe-stages.module.css';

export function RecipeStageActionBar({
  stageIndex,
  totalStagesCount,
  etapas = [],
  onMoveEtapa,
  onDuplicateEtapa,
  onRemoveEtapa,
  onSelectStage,
  onAddEtapa
}) {
  const hasPrev = stageIndex > 0;
  const hasNext = stageIndex < totalStagesCount - 1;

  const prevStageName = hasPrev
    ? (etapas[stageIndex - 1]?.nombre || `Etapa ${stageIndex}`)
    : null;

  const nextStageName = hasNext
    ? (etapas[stageIndex + 1]?.nombre || `Etapa ${stageIndex + 2}`)
    : null;

  const handlePrev = () => {
    if (hasPrev && onSelectStage) {
      onSelectStage(stageIndex - 1);
    }
  };

  const handleNext = () => {
    if (hasNext && onSelectStage) {
      onSelectStage(stageIndex + 1);
    } else if (!hasNext && onAddEtapa) {
      onAddEtapa();
    }
  };

  return (
    <div className={styles.actionBar}>
      {/* Zona izquierda: Gestión y Riesgo */}
      <div className={styles.actionGroupLeft}>
        <div className={styles.orderButtonGroup}>
          <button
            type="button"
            className={styles.btnOrder}
            disabled={stageIndex === 0}
            onClick={() => onMoveEtapa && onMoveEtapa(stageIndex, 'UP')}
            title="Mover etapa hacia arriba"
          >
            ▲ Subir
          </button>
          <button
            type="button"
            className={styles.btnOrder}
            disabled={stageIndex === totalStagesCount - 1}
            onClick={() => onMoveEtapa && onMoveEtapa(stageIndex, 'DOWN')}
            title="Mover etapa hacia abajo"
          >
            ▼ Bajar
          </button>
          {onDuplicateEtapa && (
            <button
              type="button"
              className={styles.btnDuplicate}
              onClick={() => onDuplicateEtapa(stageIndex)}
              title="Duplicar esta etapa completa con sus insumos"
            >
              📑 Duplicar Etapa
            </button>
          )}
        </div>

        <button
          type="button"
          className={styles.btnDangerDelete}
          onClick={() => onRemoveEtapa && onRemoveEtapa(stageIndex)}
          title="Eliminar esta etapa de la receta"
        >
          ✕ Eliminar Etapa
        </button>
      </div>

      {/* Zona derecha: Navegación de Flujo */}
      <div className={styles.actionGroupRight}>
        <button
          type="button"
          className={styles.btnPrevStage}
          disabled={!hasPrev}
          onClick={handlePrev}
          title={hasPrev ? `Ir a: ${prevStageName}` : 'Primera etapa alcanzada'}
        >
          {hasPrev ? `← ${stageIndex}. ${prevStageName}` : '← Anterior'}
        </button>

        <button
          type="button"
          className={styles.btnNextStage}
          onClick={handleNext}
          title={hasNext ? `Ir a: ${nextStageName}` : 'Agregar y pasar a nueva etapa'}
        >
          {hasNext ? `${nextStageName} →` : '+ Siguiente Etapa'}
        </button>
      </div>
    </div>
  );
}
