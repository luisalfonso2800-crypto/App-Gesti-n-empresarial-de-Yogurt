/**
 * @file unitNormalizer.js
 * @module utils (backend)
 * @description Wrapper unificado de normalización delegando en UnitRegistry (T2).
 */

import { normalizeUnit, getFactor } from '../common/units/unit-registry';

export const CANONICAL_UNITS = {
  MASS_SMALL: 'g',
  MASS_BIG: 'kg',
  VOL_SMALL: 'ml',
  VOL_BIG: 'l',
  UNIT: 'und'
};

export function toCanonicalUnit(unitStr) {
  const norm = normalizeUnit(unitStr);
  return norm || String(unitStr || '').toLowerCase().trim();
}

export function getUnitConversionFactor(fromUnit, toUnit) {
  const factor = getFactor(fromUnit, toUnit);
  return factor !== null ? factor : 1;
}
