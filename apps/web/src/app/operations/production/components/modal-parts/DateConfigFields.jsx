/**
 * @file DateConfigFields.jsx
 * @module operations/production/components/modal-parts
 * @description Campos de fecha de fabricación y fecha de vencimiento para la orden de producción.
 * @responsibility Renderizar inputs de fecha con validación poka-yoke de rango (vencimiento > fabricación).
 */

import React from 'react';
import baseStyles from '../production.module.css';
import styles from '../production-modal.module.css';

/**
 * @param {object} props
 * @param {string} props.fechaProduccion - Fecha de fabricación programada (ISO string)
 * @param {Function} props.setFechaProduccion - Setter de fecha de fabricación
 * @param {string} props.fechaVencimiento - Fecha de vencimiento del lote (ISO string)
 * @param {Function} props.setFechaVencimiento - Setter de fecha de vencimiento
 * @param {boolean} props.isVencimientoValid - Si la fecha de vencimiento es posterior a la de fabricación
 */
export function DateConfigFields({ fechaProduccion, setFechaProduccion, fechaVencimiento, setFechaVencimiento, isVencimientoValid }) {
  return (
    <div className={baseStyles.grid2}>
      <div>
        <label className={styles.label}>Fecha de Fabricación Programada</label>
        <input
          className={baseStyles.input}
          type="date"
          value={fechaProduccion}
          onChange={e => setFechaProduccion(e.target.value)}
          required
        />
      </div>
      <div>
        <label className={styles.label}>FECHA DE VENCIMIENTO DEL LOTE</label>
        <input
          className={baseStyles.input}
          type="date"
          min={fechaProduccion || undefined}
          value={fechaVencimiento}
          onChange={e => setFechaVencimiento(e.target.value)}
          required
        />
        {!isVencimientoValid && fechaVencimiento && (
          <span className={styles.dateErrorText}>
            La fecha de vencimiento debe ser posterior a la fecha de fabricación.
          </span>
        )}
      </div>
    </div>
  );
}
