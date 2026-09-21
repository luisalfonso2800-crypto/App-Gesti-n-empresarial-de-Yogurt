/**
 * @file unit-converter.js
 * @module common/utils
 * @description Utilidad pura para estandarización y conversión de unidades de medida (Masa, Volumen, Unidades).
 */

const UNIT_SYNONYMS = {
  // Masa (Base: Gramos)
  'G': 'G',
  'GR': 'G',
  'GRS': 'G',
  'GRAMO': 'G',
  'GRAMOS': 'G',
  'KG': 'KG',
  'KGS': 'KG',
  'KILO': 'KG',
  'KILOGRAMO': 'KG',
  'KILOGRAMOS': 'KG',
  'MG': 'MG',
  'MILIGRAMO': 'MG',
  'MILIGRAMOS': 'MG',

  // Volumen (Base: Mililitros)
  'ML': 'ML',
  'MILILITRO': 'ML',
  'MILILITROS': 'ML',
  'L': 'L',
  'LT': 'L',
  'LTS': 'L',
  'LITRO': 'L',
  'LITROS': 'L',
  'OZ': 'OZ',
  'ONZA': 'OZ',
  'ONZAS': 'OZ',

  // Unidades discretas
  'UND': 'UND',
  'UNID': 'UND',
  'UNIDAD': 'UND',
  'UNIDADES': 'UND',
  'PZA': 'UND',
  'PIEZA': 'UND',
  'PAQUETE': 'PAQ',
  'PAQ': 'PAQ'
};

const MASS_FACTORS = {
  'G': 1,
  'KG': 1000,
  'MG': 0.001
};

const VOLUME_FACTORS = {
  'ML': 1,
  'L': 1000,
  'OZ': 29.5735
};

export class UnitConverter {
  /**
   * Normaliza un string de unidad a su clave canónica en mayúsculas.
   * @param {string} unit
   * @returns {string}
   */
  static normalizeUnit(unit) {
    if (!unit || typeof unit !== 'string') return '';
    const clean = unit.trim().toUpperCase();
    return UNIT_SYNONYMS[clean] || clean;
  }

  /**
   * Obtiene el factor multiplicador entre dos unidades compatibles: toAmount = fromAmount * factor.
   * @param {string} fromUnit
   * @param {string} toUnit
   * @returns {number}
   */
  static getConversionFactor(fromUnit, toUnit) {
    const from = this.normalizeUnit(fromUnit);
    const to = this.normalizeUnit(toUnit);

    if (!from || !to || from === to) return 1;

    // Familia Masa
    if (MASS_FACTORS[from] && MASS_FACTORS[to]) {
      return MASS_FACTORS[from] / MASS_FACTORS[to];
    }

    // Familia Volumen
    if (VOLUME_FACTORS[from] && VOLUME_FACTORS[to]) {
      return VOLUME_FACTORS[from] / VOLUME_FACTORS[to];
    }

    return 1;
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
    const factor = this.getConversionFactor(fromUnit, toUnit);
    return num * factor;
  }
}
