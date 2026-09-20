'use client';

/**
 * @file RecipeStageEditor.jsx
 * @module catalog/recipes/components/parts
 * @description Banco de trabajo para la edición reactiva de la etapa seleccionada.
 * @responsibility Renderizar campos térmicos, temporales, telemetría y subtabla BOM (< 140 líneas).
 * @usedBy apps/web/src/app/catalog/recipes/components/modal-parts/RecipeStagesList.jsx
 */

import React from 'react';
import { RecipeStageTelemetryCard } from './RecipeStageTelemetryCard';
import { RecipeStageParametersCards } from './RecipeStageParametersCards';
import { RecipeStageBomTable } from './RecipeStageBomTable';
import { RecipeStageActionBar } from './RecipeStageActionBar';
import styles from './recipe-stages.module.css';

export function RecipeStageEditor({
  etapa,
  stageIndex,
  totalStagesCount,
  etapas = [],
  supplies = [],
  products = [],
  currentRecipeProductId = null,
  rendimientoBase = 0,
  summaryText = '',
  formatMinutesToDigitalClock,
  onUpdateEtapa,
  onRemoveEtapa,
  onMoveEtapa,
  onDuplicateEtapa,
  onAddDetalle,
  onUpdateDetalle,
  onRemoveDetalle,
  onSelectStage,
  onAddEtapa
}) {
  if (!etapa) {
    return (
      <div className={styles.workspaceCol}>
        <div className={styles.emptyWorkspace}>
          👋 Comienza tu receta: Selecciona una de las Plantillas Rápidas arriba o pulsa &apos;+ Agregar Etapa&apos; para definir los parámetros del proceso.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.workspaceCol}>
      <RecipeStageTelemetryCard summaryText={summaryText} />

      <div className={styles.fieldGroup}>
        <label className={styles.label}>NOMBRE DE LA ETAPA O FASE *</label>
        <input className={styles.input} value={etapa.nombre || ''} onChange={e => onUpdateEtapa(stageIndex, 'nombre', e.target.value)} placeholder="Ej: Pasteurización, Enfriamiento, Fermentación..." required />
      </div>

      <RecipeStageParametersCards etapa={etapa} stageIndex={stageIndex} onUpdateEtapa={onUpdateEtapa} />

      <div className={styles.fieldGroup}>
        <label className={styles.label}>INSTRUCCIONES DE OPERACIÓN</label>
        <textarea className={styles.textarea} rows={3} value={etapa.instrucciones || ''} onChange={e => onUpdateEtapa(stageIndex, 'instrucciones', e.target.value)} placeholder="Instrucciones para el operario de planta..." />
      </div>

      <RecipeStageBomTable etapa={etapa} stageIndex={stageIndex} supplies={supplies} products={products} currentRecipeProductId={currentRecipeProductId} rendimientoBase={rendimientoBase} onAddDetalle={onAddDetalle} onUpdateDetalle={onUpdateDetalle} onRemoveDetalle={onRemoveDetalle} />

      <RecipeStageActionBar
        stageIndex={stageIndex}
        totalStagesCount={totalStagesCount}
        etapas={etapas}
        onMoveEtapa={onMoveEtapa}
        onDuplicateEtapa={onDuplicateEtapa}
        onRemoveEtapa={onRemoveEtapa}
        onSelectStage={onSelectStage}
        onAddEtapa={onAddEtapa}
      />
    </div>
  );
}
