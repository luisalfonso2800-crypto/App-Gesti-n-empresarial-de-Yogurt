/**
 * @file FormPhaseFleteSection.jsx
 * @module operations/purchases/new/parts
 * @description Sección para registrar el flete global y costo adicional de transporte de la jornada.
 * @responsibility Entrada numérica formateada de flete, visualización en letras y descripción contextual.
 * @usedBy apps/web/src/app/operations/purchases/new/components/FormPhase.jsx
 * @dependencies React, @/utils/numberToWords, ../../new-purchase.module.css
 */
import React from 'react';
import { montoATextoPesos } from '@/utils/numberToWords';
import styles from '../../new-purchase.module.css';

export default function FormPhaseFleteSection({ flete, setFlete }) {
  return (
    <div className={styles.fleteSection}>
      <div className={styles.fleteRow1}>
        <label className={styles.fleteLabel}>
          Flete / Costo adicional global ($):
        </label>

        <input
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={flete}
          onChange={e => {
            let val = e.target.value.replace(/\D/g, '');
            if (val !== '') {
              val = parseInt(val, 10).toLocaleString('es-CO');
            }
            setFlete(val);
          }}
          className={styles.fleteInput}
        />

        {flete !== '' && Number(flete.replace(/\D/g, '')) > 0 && (
          <span className={styles.fletePill}>
            <span className={styles.fletePillIcon}>✦</span>
            {montoATextoPesos(flete)}
          </span>
        )}
      </div>

      <span className={styles.fleteSubtext}>
        Transportes, domicilios o lo que costó ir a buscar estos productos
      </span>
    </div>
  );
}
