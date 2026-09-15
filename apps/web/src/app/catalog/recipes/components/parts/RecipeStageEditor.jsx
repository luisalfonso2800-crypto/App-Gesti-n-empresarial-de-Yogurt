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
import { RecipeStageActionBar } from './RecipeStageActionBar';
import { formatToleranceRangeHours, formatTemperatureRangeF } from '../recipeHelpers';
import styles from './recipe-stages.module.css';

export function RecipeStageEditor({
  etapa,
  stageIndex,
  totalStagesCount,
  etapas = [],
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
  onRemoveDetalle,
  onSelectStage,
  onAddEtapa
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

      <div className={styles.formRow3}>
        <div className={styles.parameterCard}>
          <div className={styles.labelRow}>
            <label className={styles.labelNowrap}>TIEMPO ESTÁNDAR</label>
          </div>
          <div className={styles.timeInputWrapper}>
            <input className={styles.input} type="number" min="0" value={etapa.tiempoEstandarMin === 0 || etapa.tiempoEstandarMin === '0' ? '' : (etapa.tiempoEstandarMin ?? '')} onChange={e => onUpdateEtapa(stageIndex, 'tiempoEstandarMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)} placeholder="0 min" />
            <span className={styles.timeClockPill} title="Equivalencia en reloj">
              ✦ ({formatMinutesToDigitalClock ? formatMinutesToDigitalClock(etapa.tiempoEstandarMin) : `${etapa.tiempoEstandarMin || 0}m`})
            </span>
          </div>
        </div>

        <div className={styles.parameterCard}>
          <div className={styles.labelRow}>
            <label className={styles.labelNowrap}>RANGO DE TOLERANCIA</label>
            {formatToleranceRangeHours(etapa.tiempoMinimoMin, etapa.tiempoMaximoMin) && (
              <span className={styles.telemetryPill} title="Equivalencia en horas">
                {formatToleranceRangeHours(etapa.tiempoMinimoMin, etapa.tiempoMaximoMin)}
              </span>
            )}
          </div>
          <div className={styles.rangeInputsRow}>
            <div className={styles.inputGroupPrefix}>
              <span className={styles.inputPrefix}>MÍN</span>
              <input className={styles.inputInner} type="number" min="0" value={etapa.tiempoMinimoMin === 0 || etapa.tiempoMinimoMin === '0' ? '' : (etapa.tiempoMinimoMin ?? '')} onChange={e => onUpdateEtapa(stageIndex, 'tiempoMinimoMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)} placeholder="0 min" />
            </div>
            <div className={styles.inputGroupPrefix}>
              <span className={styles.inputPrefix}>MÁX</span>
              <input className={styles.inputInner} type="number" min="0" value={etapa.tiempoMaximoMin === 0 || etapa.tiempoMaximoMin === '0' ? '' : (etapa.tiempoMaximoMin ?? '')} onChange={e => onUpdateEtapa(stageIndex, 'tiempoMaximoMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)} placeholder="0 min" />
            </div>
          </div>
        </div>

        <div className={styles.parameterCard}>
          <div className={styles.labelRow}>
            <label className={styles.labelNowrap}>TEMPERATURA OPERATIVA (°C)</label>
            {formatTemperatureRangeF(etapa.tempMinimaGrados, etapa.tempMaximaGrados) && (
              <span className={styles.telemetryPill} title="Equivalencia en Fahrenheit">
                {formatTemperatureRangeF(etapa.tempMinimaGrados, etapa.tempMaximaGrados)}
              </span>
            )}
          </div>
          <div className={styles.rangeInputsRow}>
            <div className={styles.inputGroupPrefix}>
              <span className={styles.inputPrefix}>MÍN</span>
              <input className={styles.inputInner} type="number" step="0.1" value={etapa.tempMinimaGrados ?? ''} onChange={e => onUpdateEtapa(stageIndex, 'tempMinimaGrados', e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder="0.0 °C" />
            </div>
            <div className={styles.inputGroupPrefix}>
              <span className={styles.inputPrefix}>MÁX</span>
              <input className={styles.inputInner} type="number" step="0.1" value={etapa.tempMaximaGrados ?? ''} onChange={e => onUpdateEtapa(stageIndex, 'tempMaximaGrados', e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder="0.0 °C" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>INSTRUCCIONES DE OPERACIÓN</label>
        <textarea className={styles.textarea} rows={3} value={etapa.instrucciones || ''} onChange={e => onUpdateEtapa(stageIndex, 'instrucciones', e.target.value)} placeholder="Instrucciones para el operario de planta..." />
      </div>

      <RecipeStageBomTable etapa={etapa} stageIndex={stageIndex} supplies={supplies} products={products} currentRecipeProductId={currentRecipeProductId} onAddDetalle={onAddDetalle} onUpdateDetalle={onUpdateDetalle} onRemoveDetalle={onRemoveDetalle} />

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
