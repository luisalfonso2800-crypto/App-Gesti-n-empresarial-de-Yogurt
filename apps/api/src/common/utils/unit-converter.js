/**
 * @file unit-converter.js
 * @module common/utils
 * @description Wrapper de compatibilidad hacia atrás sobre UnitRegistry (T2, HAL-F1-01, HAL-F1-06, HAL-F2-01).
 * Preserva la interfaz estática existente de UnitConverter delegando al registro canónico.
 */

import { normalizeUnit, getFactor, areCompatible, convert as registryConvert, CANONICAL_UNITS } from '../units/unit-registry';

export class UnitConverter {
  /**
   * Normaliza un string de unidad a su clave canónica en mayúsculas (para preservar contrato previo).
   * @param {string} unit
   * @returns {string}
   */
  static normalizeUnit(unit) {
    const canonical = normalizeUnit(unit);
    return canonical ? canonical.toUpperCase() : (unit ? String(unit).trim().toUpperCase() : '');
  }

  /**
   * Obtiene el factor multiplicador entre dos unidades compatibles: toAmount = fromAmount * factor.
   * @param {string} fromUnit
   * @param {string} toUnit
   * @returns {number}
   */
  static getConversionFactor(fromUnit, toUnit) {
    const factor = getFactor(fromUnit, toUnit);
    return factor !== null ? factor : 1;
  }

  /**
   * Convierte una cantidad de una unidad a otra si son de la misma familia.
   * @param {number|string} amount
   * @param {string} fromUnit
   * @param {string} toUnit
   * @returns {number}
   */
  static convert(amount, fromUnit, toUnit) {
    const num = Number(amount) || 0;
    try {
      return registryConvert(num, fromUnit, toUnit);
    } catch {
      return num;
    }
  }

  /**
   * Comprueba compatibilidad dimensional.
   * @param {string} fromUnit
   * @param {string} toUnit
   * @returns {boolean}
   */
  static areUnitsCompatible(fromUnit, toUnit) {
    return areCompatible(fromUnit, toUnit);
  }
}
