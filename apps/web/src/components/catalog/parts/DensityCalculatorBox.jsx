/**
 * @file DensityCalculatorBox.jsx
 * @module components/catalog/parts
 * @description Calculadora interactiva con balanza y recipiente conocido (< 90 líneas).
 */
import React, { useState } from 'react';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../supply-modal.module.css';

const VOLUMEN_OPTIONS = [
  { label: '250 ml', ml: 250 },
  { label: '500 ml', ml: 500 },
  { label: '16 oz (473 ml)', ml: 473 },
  { label: '32 oz (946 ml)', ml: 946 },
  { label: '1.000 ml (1 Litro)', ml: 1000 },
  { label: 'Otro (ml manual)', ml: 'otro' }
];

export function DensityCalculatorBox({ disabled, onApplyCalc }) {
  const [volSelect, setVolSelect] = useState('500');
  const [volCustom, setVolCustom] = useState('');
  const [pesoGramos, setPesoGramos] = useState('');

  const activeMl = volSelect === 'otro' ? parseFloat(volCustom) || 0 : parseFloat(volSelect) || 0;
  const pesoNum = parseFloat(pesoGramos) || 0;
  const calculatedLive = activeMl > 0 && pesoNum > 0 ? (pesoNum / activeMl).toFixed(2) : null;

  return (
    <div className={styles.densityCalcBox}>
      <div className={styles.densityCalcGrid}>
        <div className={modalStyles.inputGroup}>
          <label className={styles.densityCalcLabel}>1. Recipiente / Volumen</label>
          <select
            value={volSelect}
            disabled={disabled}
            onChange={(e) => {
              setVolSelect(e.target.value);
              onApplyCalc(e.target.value === 'otro' ? volCustom : e.target.value, pesoGramos);
            }}
            className={modalStyles.input}
          >
            {VOLUMEN_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.ml}>{opt.label}</option>
            ))}
          </select>
          {volSelect === 'otro' && (
            <input
              type="text"
              inputMode="decimal"
              placeholder="Volumen en ml"
              value={volCustom}
              disabled={disabled}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9.]/g, '');
                setVolCustom(raw);
                onApplyCalc(raw, pesoGramos);
              }}
              className={`${modalStyles.input} ${styles.densityCustomMlInput}`}
            />
          )}
        </div>

        <div className={modalStyles.inputGroup}>
          <label className={styles.densityCalcLabel}>2. Peso neto en gramos (sin el envase)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="Ej: 515"
            value={pesoGramos}
            disabled={disabled}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9.]/g, '');
              setPesoGramos(raw);
              onApplyCalc(volSelect === 'otro' ? volCustom : volSelect, raw);
            }}
            className={`${modalStyles.input} ${styles.numberRightInput}`}
          />
        </div>
      </div>

      {calculatedLive && (
        <div className={styles.densityCalcResult}>
          <span>Densidad calculada: <strong>{calculatedLive} g/ml</strong></span>
        </div>
      )}
    </div>
  );
}
