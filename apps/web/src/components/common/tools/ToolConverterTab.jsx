/**
 * @file ToolConverterTab.jsx
 * @module components/common/tools
 * @description Pestaña de conversor de unidades reactivo para planta (Volumen y Masa) (SRP < 150 líneas).
 * @responsibility Conversión bidireccional inmediata de unidades de planta (ml, fl oz, L, g, kg, lb).
 * @usedBy apps/web/src/components/common/tools/PlantToolsModal.jsx
 * @dependencies react, ./useUnitConverter, ./plant-tools.module.css
 */
'use client';

import React from 'react';
import { useUnitConverter } from './useUnitConverter';
import styles from './plant-tools.module.css';

const VOLUME_UNITS = [
  { key: 'ml', label: 'Mililitros', badge: 'ml' },
  { key: 'floz', label: 'Onza líquida', badge: 'fl oz' },
  { key: 'l', label: 'Litros', badge: 'L' }
];

const MASS_UNITS = [
  { key: 'g', label: 'Gramos', badge: 'g' },
  { key: 'kg', label: 'Kilogramos', badge: 'kg' },
  { key: 'lb', label: 'Libras', badge: 'lb' }
];

export function ToolConverterTab() {
  const { magnitude, switchMagnitude, handleChange, getDisplay } = useUnitConverter();
  const currentUnits = magnitude === 'volume' ? VOLUME_UNITS : MASS_UNITS;

  return (
    <div>
      <div className={styles.converterSelector}>
        <button
          type="button"
          className={`${styles.converterTypeBtn} ${magnitude === 'volume' ? styles.converterTypeBtnActive : ''}`}
          onClick={() => switchMagnitude('volume')}
        >
          🥛 Volumen (Líquidos)
        </button>
        <button
          type="button"
          className={`${styles.converterTypeBtn} ${magnitude === 'mass' ? styles.converterTypeBtnActive : ''}`}
          onClick={() => switchMagnitude('mass')}
        >
          ⚖️ Masa (Sólidos)
        </button>
      </div>

      <div className={styles.converterRows}>
        {currentUnits.map((u) => (
          <div key={u.key} className={styles.converterRow}>
            <span className={styles.unitLabel}>{u.label}</span>
            <div className={styles.unitInputWrapper}>
              <input
                type="number"
                step="any"
                className={styles.unitInput}
                value={getDisplay(u.key)}
                onChange={(e) => handleChange(u.key, e.target.value)}
                placeholder="0"
              />
              <span className={styles.unitBadge}>{u.badge}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.converterNotice}>
        Conversión reactiva de referencia para planta láctea.
      </div>
    </div>
  );
}
