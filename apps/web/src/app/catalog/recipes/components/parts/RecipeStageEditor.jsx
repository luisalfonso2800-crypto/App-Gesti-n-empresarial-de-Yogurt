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
import { RecipeStageBomTable } from './RecipeStageBomTable';
import styles from './recipe-stages.module.css';

export function RecipeStageEditor({
  etapa,
  stageIndex,
  totalStagesCount,
  supplies = [],
  products = [],
  currentRecipeProductId = null,
  summaryText = '',
  formatMinutesToDigitalClock,
  onUpdateEtapa,
  onRemoveEtapa,
  onMoveEtapa,
  onDuplicateEtapa,
  onAddDetalle,
  onUpdateDetalle,
  onRemoveDetalle
}) {
  if (!etapa) {
    return (
      <div className={styles.workspaceCol}>
        <div className={styles.emptyWorkspace}>Seleccione una etapa del panel izquierdo para comenzar.</div>
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

      <div className={styles.formRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>TIEMPO ESTÁNDAR</label>
          <div className={styles.timeInputWrapper}>
            <input className={styles.input} type="number" min="0" value={etapa.tiempoEstandarMin === 0 || etapa.tiempoEstandarMin === '0' ? '' : (etapa.tiempoEstandarMin ?? '')} onChange={e => onUpdateEtapa(stageIndex, 'tiempoEstandarMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)} placeholder="0 min" />
            <span className={styles.timeClockPill} title="Equivalencia en reloj">
              ✦ ({formatMinutesToDigitalClock ? formatMinutesToDigitalClock(etapa.tiempoEstandarMin) : `${etapa.tiempoEstandarMin || 0}m`})
            </span>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>RANGO DE TOLERANCIA (MIN - MÁX)</label>
          <div className={styles.rangeInputsRow}>
            <input className={styles.input} type="number" min="0" value={etapa.tiempoMinimoMin === 0 || etapa.tiempoMinimoMin === '0' ? '' : (etapa.tiempoMinimoMin ?? '')} onChange={e => onUpdateEtapa(stageIndex, 'tiempoMinimoMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)} placeholder="Mín min" />
            <input className={styles.input} type="number" min="0" value={etapa.tiempoMaximoMin === 0 || etapa.tiempoMaximoMin === '0' ? '' : (etapa.tiempoMaximoMin ?? '')} onChange={e => onUpdateEtapa(stageIndex, 'tiempoMaximoMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)} placeholder="Máx min" />
          </div>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>TEMPERATURA OPERATIVA (°C)</label>
          <div className={styles.rangeInputsRow}>
            <input className={styles.input} type="number" step="0.1" value={etapa.tempMinimaGrados ?? ''} onChange={e => onUpdateEtapa(stageIndex, 'tempMinimaGrados', e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder="Mín °C" />
            <input className={styles.input} type="number" step="0.1" value={etapa.tempMaximaGrados ?? ''} onChange={e => onUpdateEtapa(stageIndex, 'tempMaximaGrados', e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder="Máx °C" />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>INSTRUCCIONES DE OPERACIÓN</label>
          <input className={styles.input} value={etapa.instrucciones || ''} onChange={e => onUpdateEtapa(stageIndex, 'instrucciones', e.target.value)} placeholder="Instrucciones para el operario de planta..." />
        </div>
      </div>

      <RecipeStageBomTable etapa={etapa} stageIndex={stageIndex} supplies={supplies} products={products} currentRecipeProductId={currentRecipeProductId} onAddDetalle={onAddDetalle} onUpdateDetalle={onUpdateDetalle} onRemoveDetalle={onRemoveDetalle} />

      <div className={styles.actionFooter}>
        <div className={styles.orderButtonGroup}>
          <button type="button" className={styles.btnOrder} disabled={stageIndex === 0} onClick={() => onMoveEtapa && onMoveEtapa(stageIndex, 'UP')} title="Mover etapa hacia arriba">▲ Subir</button>
          <button type="button" className={styles.btnOrder} disabled={stageIndex === totalStagesCount - 1} onClick={() => onMoveEtapa && onMoveEtapa(stageIndex, 'DOWN')} title="Mover etapa hacia abajo">▼ Bajar</button>
          {onDuplicateEtapa && (
            <button type="button" className={styles.btnDuplicate} onClick={() => onDuplicateEtapa(stageIndex)} title="Duplicar esta etapa completa con sus insumos">📑 Duplicar Etapa</button>
          )}
        </div>
        <button type="button" className={styles.btnDeleteStage} onClick={() => onRemoveEtapa(stageIndex)} title="Eliminar esta etapa de la receta">✕ Eliminar Etapa</button>
      </div>
    </div>
  );
}
