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

  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setConfirmDelete(false);
    if (onRemoveEtapa) onRemoveEtapa(stageIndex);
  };

  return (
    <div className={styles.actionBar}>
      {/* Zona izquierda: Gestión y Riesgo */}
      <div className={styles.actionGroupLeft}>
        <div className={styles.orderButtonGroup}>
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
          className={confirmDelete ? styles.btnDangerDeleteConfirm : styles.btnDangerDelete}
          onClick={handleDelete}
          onBlur={() => setConfirmDelete(false)}
          title={confirmDelete ? "Haga clic de nuevo para confirmar eliminación" : "Eliminar esta etapa de la receta"}
        >
          {confirmDelete ? "⚠️ ¿Confirmar?" : "✕ Eliminar Etapa"}
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
