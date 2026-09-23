/**
 * @file useUnitConverter.js
 * @module components/common/tools
 * @description Hook para conversión bidireccional de unidades de planta (Volumen y Masa).
 * @responsibility Encapsular estado y lógica de conversión de unidades, retornando estado y handlers.
 * @usedBy apps/web/src/components/common/tools/ToolConverterTab.jsx
 */

import { useState } from 'react';

/** Factores de conversión a base estándar (Volumen base: ml, Masa base: g) */
const VOLUME_FACTORS = { ml: 1, floz: 29.5735, l: 1000 };
const MASS_FACTORS = { g: 1, kg: 1000, lb: 453.592 };

/**
 * Formatea un número eliminando decimales innecesarios (máx 3 cifras significativas).
 * @param {number|null} num
 * @returns {string}
 */
function formatValue(num) {
  if (num === null || num === undefined || isNaN(num)) return '';
  return String(Math.round(num * 1000) / 1000);
}

/**
 * @returns {{ magnitude, setMagnitude, getDisplay, handleChange }}
 */
export function useUnitConverter() {
  const [magnitude, setMagnitude] = useState('volume'); // 'volume' | 'mass'
  const [baseValue, setBaseValue] = useState(1000); // 1000 ml o 1000 g por defecto

  const factors = magnitude === 'volume' ? VOLUME_FACTORS : MASS_FACTORS;

  /**
   * Cambia la magnitud activa y reinicia el valor base.
   * @param {'volume'|'mass'} mag
   */
  const switchMagnitude = (mag) => {
    setMagnitude(mag);
    setBaseValue(1000);
  };

  /**
   * Actualiza el valor base al editar cualquier campo de unidad.
   * @param {string} unitKey - Clave de unidad (ml, floz, l, g, kg, lb)
   * @param {string} inputStr - Valor raw del input
   */
  const handleChange = (unitKey, inputStr) => {
    if (inputStr === '') { setBaseValue(null); return; }
    const val = parseFloat(inputStr);
    if (!isNaN(val)) setBaseValue(val * factors[unitKey]);
  };

  /**
   * Retorna el valor convertido para una unidad dada.
   * @param {string} unitKey
   * @returns {string}
   */
  const getDisplay = (unitKey) => {
    if (baseValue === null) return '';
    return formatValue(baseValue / factors[unitKey]);
  };

  return { magnitude, switchMagnitude, handleChange, getDisplay };
}
