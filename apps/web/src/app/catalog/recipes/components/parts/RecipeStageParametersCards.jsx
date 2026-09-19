'use client';
/**
 * @file RecipeStageParametersCards.jsx
 * @module catalog/recipes/components/parts
 * @description Tarjetas gemelas clarificadas con iconografía (⏱/🌡), objetivo prioritario (🎯) y tolerancias (↓/↑) (< 120 líneas).
 */
import React, { useEffect } from 'react';
import styles from './recipe-stages.module.css';

export function RecipeStageParametersCards({ etapa, stageIndex, onUpdateEtapa }) {
  const minTime = etapa.tiempoMinimoMin === '' || etapa.tiempoMinimoMin == null ? null : Number(etapa.tiempoMinimoMin);
  const targetTime = etapa.tiempoEstandarMin === '' || etapa.tiempoEstandarMin == null ? null : Number(etapa.tiempoEstandarMin);
  const maxTime = etapa.tiempoMaximoMin === '' || etapa.tiempoMaximoMin == null ? null : Number(etapa.tiempoMaximoMin);
  const isTimeInvalid = (minTime !== null && targetTime !== null && minTime > targetTime) || (targetTime !== null && maxTime !== null && targetTime > maxTime) || (minTime !== null && maxTime !== null && minTime > maxTime);
  const hoursEquiv = targetTime > 0 ? `≈ ${(targetTime / 60).toFixed(1)} h` : (maxTime > 0 ? `≈ ${(maxTime / 60).toFixed(1)} h` : null);

  const minTemp = etapa.tempMinimaGrados === '' || etapa.tempMinimaGrados == null ? null : Number(etapa.tempMinimaGrados);
  const targetTemp = etapa.tempObjetivoGrados === '' || etapa.tempObjetivoGrados == null ? null : Number(etapa.tempObjetivoGrados);
  const maxTemp = etapa.tempMaximaGrados === '' || etapa.tempMaximaGrados == null ? null : Number(etapa.tempMaximaGrados);

  useEffect(() => {
    const isZeroOrEmpty = etapa.tempObjetivoGrados === 0 || etapa.tempObjetivoGrados === '0' || etapa.tempObjetivoGrados === '' || etapa.tempObjetivoGrados == null;
    if (isZeroOrEmpty && minTemp !== null && maxTemp !== null && minTemp > 0 && maxTemp > 0) {
      onUpdateEtapa(stageIndex, 'tempObjetivoGrados', Number(((minTemp + maxTemp) / 2).toFixed(1)));
    }
  }, [minTemp, maxTemp, etapa.tempObjetivoGrados, stageIndex, onUpdateEtapa]);

  const isTempInvalid = (minTemp !== null && targetTemp !== null && targetTemp < minTemp) || (targetTemp !== null && maxTemp !== null && targetTemp > maxTemp) || (minTemp !== null && maxTemp !== null && minTemp > maxTemp);
  const refTemp = targetTemp !== null ? targetTemp : (maxTemp !== null ? maxTemp : minTemp);
  const fahrenheitEquiv = refTemp !== null ? `≈ ${((refTemp * 9/5) + 32).toFixed(1)} °F` : null;

  return (
    <div className={styles.formRow}>
      {/* Tarjeta 1: Tiempo Operativo */}
      <div className={styles.parameterCard}>
        <div className={styles.labelRow}>
          <label className={styles.labelNowrap}>⏱ TIEMPO OPERATIVO (MIN)</label>
          {hoursEquiv && <span className={styles.microEquivText}>{hoursEquiv}</span>}
        </div>
        <div className={styles.twinInputsRow}>
          <div className={`${styles.inputGroupPrefix} ${styles.inputGroupCompact} ${isTimeInvalid ? styles.inputErrorBorder : ''}`}>
            <span className={styles.inputPrefix}>↓ Mín</span>
            <input
              className={styles.inputInner}
              type="number"
              min="0"
              value={etapa.tiempoMinimoMin === 0 || etapa.tiempoMinimoMin === '0' ? '' : (etapa.tiempoMinimoMin ?? '')}
              onChange={e => onUpdateEtapa(stageIndex, 'tiempoMinimoMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)}
              placeholder="0"
            />
            <span className={styles.inputSuffix}>min</span>
          </div>
          <div className={`${styles.inputGroupPrefix} ${styles.inputPrimaryTarget} ${isTimeInvalid ? styles.inputErrorBorder : ''}`}>
            <span className={`${styles.inputPrefix} ${styles.inputPrefixTarget}`}>🎯 Objetivo</span>
            <input
              className={styles.inputInner}
              type="number"
              min="0"
              value={etapa.tiempoEstandarMin === 0 || etapa.tiempoEstandarMin === '0' ? '' : (etapa.tiempoEstandarMin ?? '')}
              onChange={e => onUpdateEtapa(stageIndex, 'tiempoEstandarMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)}
              placeholder="0"
            />
            <span className={styles.inputSuffix}>min</span>
          </div>
          <div className={`${styles.inputGroupPrefix} ${styles.inputGroupCompact} ${isTimeInvalid ? styles.inputErrorBorder : ''}`}>
            <span className={styles.inputPrefix}>↑ Máx</span>
            <input
              className={styles.inputInner}
              type="number"
              min="0"
              value={etapa.tiempoMaximoMin === 0 || etapa.tiempoMaximoMin === '0' ? '' : (etapa.tiempoMaximoMin ?? '')}
              onChange={e => onUpdateEtapa(stageIndex, 'tiempoMaximoMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)}
              placeholder="0"
            />
            <span className={styles.inputSuffix}>min</span>
          </div>
        </div>
        {isTimeInvalid && (
          <span className={styles.paramErrorText}>
            El valor mínimo no puede superar el objetivo ni el máximo
          </span>
        )}
      </div>

      {/* Tarjeta 2: Temperatura Operativa */}
      <div className={styles.parameterCard}>
        <div className={styles.labelRow}>
          <label className={styles.labelNowrap}>🌡 TEMPERATURA OPERATIVA (°C)</label>
          {fahrenheitEquiv && <span className={styles.microEquivText}>{fahrenheitEquiv}</span>}
        </div>
        <div className={styles.twinInputsRow}>
          <div className={`${styles.inputGroupPrefix} ${styles.inputGroupCompact} ${isTempInvalid ? styles.inputErrorBorder : ''}`}>
            <span className={styles.inputPrefix}>↓ Mín</span>
            <input
              className={styles.inputInner}
              type="number"
              step="0.1"
              value={etapa.tempMinimaGrados ?? ''}
              onChange={e => onUpdateEtapa(stageIndex, 'tempMinimaGrados', e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="0.0"
            />
            <span className={styles.inputSuffix}>°C</span>
          </div>
          <div className={`${styles.inputGroupPrefix} ${styles.inputPrimaryTarget} ${isTempInvalid ? styles.inputErrorBorder : ''}`}>
            <span className={`${styles.inputPrefix} ${styles.inputPrefixTarget}`}>🎯 Objetivo</span>
            <input
              className={styles.inputInner}
              type="number"
              step="0.1"
              value={etapa.tempObjetivoGrados ?? ''}
              onChange={e => onUpdateEtapa(stageIndex, 'tempObjetivoGrados', e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="0.0"
            />
            <span className={styles.inputSuffix}>°C</span>
          </div>
          <div className={`${styles.inputGroupPrefix} ${styles.inputGroupCompact} ${isTempInvalid ? styles.inputErrorBorder : ''}`}>
            <span className={styles.inputPrefix}>↑ Máx</span>
            <input
              className={styles.inputInner}
              type="number"
              step="0.1"
              value={etapa.tempMaximaGrados ?? ''}
              onChange={e => onUpdateEtapa(stageIndex, 'tempMaximaGrados', e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="0.0"
            />
            <span className={styles.inputSuffix}>°C</span>
          </div>
        </div>
        {isTempInvalid && (
          <span className={styles.paramErrorText}>
            El objetivo debe estar entre MÍN y MÁX
          </span>
        )}
      </div>
    </div>
  );
}
