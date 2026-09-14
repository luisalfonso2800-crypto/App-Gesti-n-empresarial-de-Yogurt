/**
 * @file StageCardItem.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Tarjeta de etapa individual en acordeón exclusivo: modo colapsado o expandido con BOM y reloj digital.
 * @responsibility Renderizar los controles de tiempo, temperatura, orden cronológico, detalle de insumos e insignias tipo reloj.
 * @usedBy apps/web/src/app/catalog/recipes/components/modal-parts/RecipeStagesList.jsx
 * @dependencies react, ../IngredientsFormSection, ../recipe-modal.module.css
 */

import React from 'react';
import { IngredientsFormSection } from '../IngredientsFormSection';
import styles from '../recipe-modal.module.css';

export function StageCardItem({
  etapa,
  eIdx,
  isExpanded,
  summaryText,
  totalStagesCount,
  supplies,
  products,
  currentRecipeProductId,
  formatMinutesToDigitalClock,
  onExpand,
  onCollapse,
  onRemoveEtapa,
  onMoveEtapa,
  onUpdateEtapa,
  onAddDetalle,
  onUpdateDetalle,
  onRemoveDetalle
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
              <span className={styles.collapsedBadge}>
                ⏱️ {etapa.tiempoEstandarMin}m
              </span>
            )}
            {(Number(etapa.tempMinimaGrados) > 0 || Number(etapa.tempMaximaGrados) > 0) && (
              <span className={styles.collapsedBadge}>
                🌡️ {etapa.tempMinimaGrados}°C - {etapa.tempMaximaGrados}°C
              </span>
            )}
          </div>

          <span className={styles.collapsedSummaryText}>
            {summaryText}
          </span>
        </div>

        <div className={styles.collapsedActions}>
          {onMoveEtapa && (
            <div className={styles.stageMoveGroup}>
              <button
                type="button"
                disabled={eIdx === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveEtapa(eIdx, 'UP');
                }}
                className={styles.btnMoveStage}
                title="Subir etapa (ejecutar antes)"
              >
                ▲
              </button>
              <button
                type="button"
                disabled={eIdx === totalStagesCount - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveEtapa(eIdx, 'DOWN');
                }}
                className={styles.btnMoveStage}
                title="Bajar etapa (ejecutar después)"
              >
                ▼
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            className={styles.btnEditCollapsed}
          >
            Editar
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveEtapa(eIdx);
            }}
            className={styles.btnRemoveCollapsed}
            title="Eliminar etapa"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  // 2. Vista Expandida con controles completos
  return (
    <div className={styles.stageCard}>
      <div className={styles.stageHeader}>
        <div className={styles.stageHeaderTitleGroup}>
          <h3>Etapa {etapa.orden}: {etapa.nombre || 'Nueva Etapa'}</h3>
          <span className={styles.stageEditingBadge}>
            En Edición
          </span>
        </div>
        <div className={styles.stageHeaderActions}>
          {onMoveEtapa && (
            <div className={styles.stageMoveGroup}>
              <button
                type="button"
                disabled={eIdx === 0}
                onClick={() => onMoveEtapa(eIdx, 'UP')}
                className={styles.btnMoveStageExpanded}
                title="Subir etapa (ejecutar antes)"
              >
                ▲ Subir
              </button>
              <button
                type="button"
                disabled={eIdx === totalStagesCount - 1}
                onClick={() => onMoveEtapa(eIdx, 'DOWN')}
                className={styles.btnMoveStageExpanded}
                title="Bajar etapa (ejecutar después)"
              >
                ▼ Bajar
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={onCollapse}
            className={styles.btnCollapseStage}
            title="Contraer esta etapa"
          >
            Plegar ▲
          </button>
          <button 
            type="button" 
            onClick={() => onRemoveEtapa(eIdx)}
            className={styles.btnRemoveStage}
          >
            Eliminar Etapa
          </button>
        </div>
      </div>

      <div className={styles.grid3}>
        <div>
          <label className={styles.label}>Nombre Fase</label>
          <input 
            className={styles.input} 
            value={etapa.nombre} 
            onChange={e => onUpdateEtapa(eIdx, 'nombre', e.target.value)} 
            required 
          />
        </div>

        <div className={styles.timeInputContainer}>
          <label className={styles.label}>Tiempo Estándar (Min)</label>
          <input 
            className={styles.input} 
            type="number" 
            min="0" 
            value={etapa.tiempoEstandarMin === 0 || etapa.tiempoEstandarMin === '0' ? '' : (etapa.tiempoEstandarMin ?? '')} 
            onChange={e => onUpdateEtapa(eIdx, 'tiempoEstandarMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)} 
            placeholder="0"
          />
          <div className={styles.timeClockBadge} title="Equivalencia en horas y minutos">
            ⏱️ {formatMinutesToDigitalClock(etapa.tiempoEstandarMin)}
          </div>
        </div>

        <div>
          <label className={styles.label}>T. Min / Max (Min)</label>
          <div className={styles.timeRangeInputsRow}>
            <div className={styles.timeRangeItem}>
              <input 
                className={styles.input} 
                type="number" 
                min="0" 
                value={etapa.tiempoMinimoMin === 0 || etapa.tiempoMinimoMin === '0' ? '' : (etapa.tiempoMinimoMin ?? '')} 
                onChange={e => onUpdateEtapa(eIdx, 'tiempoMinimoMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)} 
                placeholder="Mín: 0"
              />
              <div className={styles.timeRangeClockBadge} title="Equivalencia tiempo mínimo">
                ⏱️ {formatMinutesToDigitalClock(etapa.tiempoMinimoMin)}
              </div>
            </div>
            <div className={styles.timeRangeItem}>
              <input 
                className={styles.input} 
                type="number" 
                min="0" 
                value={etapa.tiempoMaximoMin === 0 || etapa.tiempoMaximoMin === '0' ? '' : (etapa.tiempoMaximoMin ?? '')} 
                onChange={e => onUpdateEtapa(eIdx, 'tiempoMaximoMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)} 
                placeholder="Máx: 0"
              />
              <div className={styles.timeRangeClockBadge} title="Equivalencia tiempo máximo">
                ⏱️ {formatMinutesToDigitalClock(etapa.tiempoMaximoMin)}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className={styles.label}>Temp. Mínima (°C)</label>
          <input 
            className={styles.input} 
            type="number" 
            step="0.1" 
            value={etapa.tempMinimaGrados || 0} 
            onChange={e => onUpdateEtapa(eIdx, 'tempMinimaGrados', parseFloat(e.target.value) || 0)} 
          />
        </div>

        <div>
          <label className={styles.label}>Temp. Máxima (°C)</label>
          <input 
            className={styles.input} 
            type="number" 
            step="0.1" 
            value={etapa.tempMaximaGrados || 0} 
            onChange={e => onUpdateEtapa(eIdx, 'tempMaximaGrados', parseFloat(e.target.value) || 0)} 
          />
        </div>

        <div>
          <label className={styles.label}>Instrucciones</label>
          <input 
            className={styles.input} 
            value={etapa.instrucciones || ''} 
            onChange={e => onUpdateEtapa(eIdx, 'instrucciones', e.target.value)} 
          />
        </div>
      </div>

      <IngredientsFormSection 
        etapa={etapa} 
        etapaIndex={eIdx}
        supplies={supplies}
        products={products}
        currentRecipeProductId={currentRecipeProductId}
        onAdd={onAddDetalle}
        onUpdate={onUpdateDetalle}
        onRemove={onRemoveDetalle}
      />

      {/* Cápsula Reactiva de Retroalimentación Textual en Lenguaje de Planta */}
      <div className={styles.stageFeedbackCapsule}>
        <span className={styles.stageFeedbackIcon}>📋</span>
        <div className={styles.stageFeedbackContent}>
          <strong className={styles.stageFeedbackHeading}>
            Lectura de Operación en Planta:
          </strong>
          <div className={styles.stageFeedbackBody}>
            {summaryText}
          </div>
        </div>
      </div>
    </div>
  );
}
