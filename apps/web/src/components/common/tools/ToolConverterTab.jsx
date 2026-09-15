/**
 * @file ToolConverterTab.jsx
 * @module components/common/tools
 * @description Pestaña de conversor de unidades reactivo para planta (Volumen y Masa) (SRP < 150 líneas).
 * @responsibility Conversión bidireccional inmediata de unidades de planta (ml, fl oz, L, g, kg, lb).
 * @usedBy apps/web/src/components/common/tools/PlantToolsModal.jsx
 * @dependencies react, ./plant-tools.module.css
 */
'use client';

import React, { useState } from 'react';
import styles from './plant-tools.module.css';

// Factores a base estándar (Volumen base: ml, Masa base: g)
const VOLUME_FACTORS = {
  ml: 1,
  floz: 29.5735,
  l: 1000
};

const MASS_FACTORS = {
  g: 1,
  kg: 1000,
  lb: 453.592
};

function formatValue(num) {
  if (num === null || num === undefined || isNaN(num)) return '';
  return String(Math.round(num * 1000) / 1000);
}

export function ToolConverterTab() {
  const [magnitude, setMagnitude] = useState('volume'); // 'volume' | 'mass'
  const [baseValue, setBaseValue] = useState(1000); // 1000 ml o 1000 g por defecto

  const factors = magnitude === 'volume' ? VOLUME_FACTORS : MASS_FACTORS;

  const handleChange = (unitKey, inputStr) => {
    if (inputStr === '') {
      setBaseValue(null);
      return;
    }
    const val = parseFloat(inputStr);
    if (isNaN(val)) return;
    setBaseValue(val * factors[unitKey]);
  };

  const getDisplay = (unitKey) => {
    if (baseValue === null) return '';
    return formatValue(baseValue / factors[unitKey]);
  };

  return (
    <div>
      <div className={styles.converterSelector}>
        <button
          type="button"
          className={`${styles.converterTypeBtn} ${magnitude === 'volume' ? styles.converterTypeBtnActive : ''}`}
          onClick={() => {
            setMagnitude('volume');
            setBaseValue(1000);
          }}
        >
          🥛 Volumen (Líquidos)
        </button>
        <button
          type="button"
          className={`${styles.converterTypeBtn} ${magnitude === 'mass' ? styles.converterTypeBtnActive : ''}`}
          onClick={() => {
            setMagnitude('mass');
            setBaseValue(1000);
          }}
        >
          ⚖️ Masa (Sólidos)
        </button>
      </div>

      <div className={styles.converterRows}>
        {magnitude === 'volume' ? (
          <>
            <div className={styles.converterRow}>
              <span className={styles.unitLabel}>Mililitros</span>
              <div className={styles.unitInputWrapper}>
                <input
                  type="number"
                  step="any"
                  className={styles.unitInput}
                  value={getDisplay('ml')}
                  onChange={(e) => handleChange('ml', e.target.value)}
                  placeholder="0"
                />
                <span className={styles.unitBadge}>ml</span>
              </div>
            </div>

            <div className={styles.converterRow}>
              <span className={styles.unitLabel}>Onza líquida</span>
              <div className={styles.unitInputWrapper}>
                <input
                  type="number"
                  step="any"
                  className={styles.unitInput}
                  value={getDisplay('floz')}
                  onChange={(e) => handleChange('floz', e.target.value)}
                  placeholder="0"
                />
                <span className={styles.unitBadge}>fl oz</span>
              </div>
            </div>

            <div className={styles.converterRow}>
              <span className={styles.unitLabel}>Litros</span>
              <div className={styles.unitInputWrapper}>
                <input
                  type="number"
                  step="any"
                  className={styles.unitInput}
                  value={getDisplay('l')}
                  onChange={(e) => handleChange('l', e.target.value)}
                  placeholder="0"
                />
                <span className={styles.unitBadge}>L</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.converterRow}>
              <span className={styles.unitLabel}>Gramos</span>
              <div className={styles.unitInputWrapper}>
                <input
                  type="number"
                  step="any"
                  className={styles.unitInput}
                  value={getDisplay('g')}
                  onChange={(e) => handleChange('g', e.target.value)}
                  placeholder="0"
                />
                <span className={styles.unitBadge}>g</span>
              </div>
            </div>

            <div className={styles.converterRow}>
              <span className={styles.unitLabel}>Kilogramos</span>
              <div className={styles.unitInputWrapper}>
                <input
                  type="number"
                  step="any"
                  className={styles.unitInput}
                  value={getDisplay('kg')}
                  onChange={(e) => handleChange('kg', e.target.value)}
                  placeholder="0"
                />
                <span className={styles.unitBadge}>kg</span>
              </div>
            </div>

            <div className={styles.converterRow}>
              <span className={styles.unitLabel}>Libras</span>
              <div className={styles.unitInputWrapper}>
                <input
                  type="number"
                  step="any"
                  className={styles.unitInput}
                  value={getDisplay('lb')}
                  onChange={(e) => handleChange('lb', e.target.value)}
                  placeholder="0"
                />
                <span className={styles.unitBadge}>lb</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={styles.converterNotice}>
        Conversión reactiva de referencia para planta láctea.
      </div>
    </div>
  );
}
