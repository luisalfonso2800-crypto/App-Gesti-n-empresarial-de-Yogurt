/**
 * @file StageCardBomFields.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Campos de datos de configuración de etapa: nombre, tiempos, temperaturas e instrucciones.
 * @responsibility Renderizar el grid de inputs de parámetros operativos de una etapa de receta con reloj digital.
 */

import React from 'react';
import styles from '../recipe-modal.module.css';

/**
 * @param {object} props
 * @param {object} props.etapa - Datos de la etapa
 * @param {number} props.eIdx - Índice de la etapa
 * @param {Function} props.onUpdateEtapa - Callback para actualizar un campo de la etapa
 * @param {Function} props.formatMinutesToDigitalClock - Formatter de minutos a reloj digital (HH:MM)
 */
export function StageCardBomFields({ etapa, eIdx, onUpdateEtapa, formatMinutesToDigitalClock }) {
  return (
    <div className={styles.grid3}>
      <div>
        <label className={styles.label}>Nombre Fase</label>
        <input className={styles.input} value={etapa.nombre} onChange={e => onUpdateEtapa(eIdx, 'nombre', e.target.value)} required />
      </div>

      <div className={styles.timeInputContainer}>
        <label className={styles.label}>Tiempo Estándar (Min)</label>
        <input
          className={styles.input} type="number" min="0"
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
              className={styles.input} type="number" min="0"
              value={etapa.tiempoMinimoMin === 0 || etapa.tiempoMinimoMin === '0' ? '' : (etapa.tiempoMinimoMin ?? '')}
              onChange={e => onUpdateEtapa(eIdx, 'tiempoMinimoMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)}
              placeholder="Mín: 0"
            />
            <div className={styles.timeRangeClockBadge} title="Equivalencia tiempo mínimo">⏱️ {formatMinutesToDigitalClock(etapa.tiempoMinimoMin)}</div>
          </div>
          <div className={styles.timeRangeItem}>
            <input
              className={styles.input} type="number" min="0"
              value={etapa.tiempoMaximoMin === 0 || etapa.tiempoMaximoMin === '0' ? '' : (etapa.tiempoMaximoMin ?? '')}
              onChange={e => onUpdateEtapa(eIdx, 'tiempoMaximoMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)}
              placeholder="Máx: 0"
            />
            <div className={styles.timeRangeClockBadge} title="Equivalencia tiempo máximo">⏱️ {formatMinutesToDigitalClock(etapa.tiempoMaximoMin)}</div>
          </div>
        </div>
      </div>

      <div>
        <label className={styles.label}>Temp. Mínima (°C)</label>
        <input className={styles.input} type="number" step="0.1" value={etapa.tempMinimaGrados || 0} onChange={e => onUpdateEtapa(eIdx, 'tempMinimaGrados', parseFloat(e.target.value) || 0)} />
      </div>

      <div>
        <label className={styles.label}>Temp. Máxima (°C)</label>
        <input className={styles.input} type="number" step="0.1" value={etapa.tempMaximaGrados || 0} onChange={e => onUpdateEtapa(eIdx, 'tempMaximaGrados', parseFloat(e.target.value) || 0)} />
      </div>

      <div>
        <label className={styles.label}>Instrucciones</label>
        <input className={styles.input} value={etapa.instrucciones || ''} onChange={e => onUpdateEtapa(eIdx, 'instrucciones', e.target.value)} />
      </div>
    </div>
  );
}
