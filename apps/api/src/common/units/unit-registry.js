/**
 * @file unit-registry.js
 * @module common/units
 * @description Registro canónico centralizado de magnitudes, unidades y factores de conversión.
 * Unifica los 4 clasificadores fragmentados del sistema (HAL-F1-01, HAL-F1-04, HAL-F1-05, HAL-F1-06, HAL-F2-01, HAL-F2-04, HAL-F2-05).
 */

export const MAGNITUDES = {
  MASA: 'MASA',
  VOLUMEN: 'VOLUMEN',
  CONTEO: 'CONTEO'
};

/**
 * Tabla canónica:
 * - Base MASA: Gramos (g = 1, kg = 1000, mg = 0.001)
 * - Base VOLUMEN: Mililitros (ml = 1, l = 1000, oz = 29.5735 fl oz líquido)
 * - Base CONTEO: Unidades (und = 1)
 */
export const CANONICAL_UNITS = {
  // Masa
  'g': { magnitude: MAGNITUDES.MASA, factor: 1, label: 'Gramos' },
  'kg': { magnitude: MAGNITUDES.MASA, factor: 1000, label: 'Kilogramos' },
  'mg': { magnitude: MAGNITUDES.MASA, factor: 0.001, label: 'Miligramos' },

  // Volumen
  'ml': { magnitude: MAGNITUDES.VOLUMEN, factor: 1, label: 'Mililitros' },
  'l': { magnitude: MAGNITUDES.VOLUMEN, factor: 1000, label: 'Litros' },
  'oz': { magnitude: MAGNITUDES.VOLUMEN, factor: 29.5735, label: 'Onzas Fluidas' },

  // Conteo
  'und': { magnitude: MAGNITUDES.CONTEO, factor: 1, label: 'Unidades' },
  'paq': { magnitude: MAGNITUDES.CONTEO, factor: 1, label: 'Paquetes' }
};

/**
 * Mapeo exhaustivo de alias y sinónimos a claves canónicas
 */
export const UNIT_ALIASES = {
  // Masa (g)
  'g': 'g',
  'gr': 'g',
  'grs': 'g',
  'gramo': 'g',
  'gramos': 'g',

  // Masa (kg)
  'kg': 'kg',
  'kgs': 'kg',
  'kilo': 'kg',
  'kilos': 'kg',
  'kilogramo': 'kg',
  'kilogramos': 'kg',

  // Masa (mg)
  'mg': 'mg',
  'mgs': 'mg',
  'miligramo': 'mg',
  'miligramos': 'mg',

  // Volumen (ml)
  'ml': 'ml',
  'mls': 'ml',
  'mililitro': 'ml',
  'mililitros': 'ml',
  'cc': 'ml',

  // Volumen (l)
  'l': 'l',
  'lt': 'l',
  'lts': 'l',
  'litro': 'l',
  'litros': 'l',

  // Volumen (oz)
  'oz': 'oz',
  'onza': 'oz',
  'onzas': 'oz',
  'fl oz': 'oz',
  'fl_oz': 'oz',

  // Conteo (und)
  'und': 'und',
  'unds': 'und',
  'unid': 'und',
  'unids': 'und',
  'unidad': 'und',
  'unidades': 'und',
  'pza': 'und',
  'pzas': 'und',
  'pieza': 'und',
  'piezas': 'und',
  'vaso': 'und',
  'vasos': 'und',
  'tapa': 'und',
  'tapas': 'und',
  'etiqueta': 'und',
  'etiquetas': 'und',
  'botella': 'und',
  'botellas': 'und',

  // Conteo (paq)
  'paq': 'paq',
  'paquete': 'paq',
  'paquetes': 'paq'
};

/**
 * Normaliza cualquier string de unidad a su clave canónica en minúsculas ('g', 'kg', 'ml', 'l', 'oz', 'und', 'mg').
 * @param {string} unitStr
 * @returns {string|null} Clave canónica o null si no se reconoce
 */
export function normalizeUnit(unitStr) {
  if (!unitStr || typeof unitStr !== 'string') return null;
  const clean = unitStr.toLowerCase().trim();
  if (UNIT_ALIASES[clean]) {
    return UNIT_ALIASES[clean];
  }
  // Búsqueda regex de fallback para casos como "1 Litro" o "envase (Vaso)"
  if (/\b(litro|litros|lt|lts|l)\b/i.test(clean)) return 'l';
  if (/\b(mililitro|mililitros|ml|cc)\b/i.test(clean)) return 'ml';
  if (/\b(kilogramo|kilogramos|kg|kgs|kilo|kilos)\b/i.test(clean)) return 'kg';
  if (/\b(gramo|gramos|gr|grs|g)\b/i.test(clean)) return 'g';
  if (/\b(miligramo|miligramos|mg)\b/i.test(clean)) return 'mg';
  if (/\b(onza|onzas|oz)\b/i.test(clean)) return 'oz';
  if (/\b(unidad|unidades|und|pza|vaso|tapa|etiqueta|botella)\b/i.test(clean)) return 'und';
  if (/\b(paquete|paquetes|paq)\b/i.test(clean)) return 'paq';

  return null;
}

/**
 * Retorna la magnitud física asociada a una unidad (MASA, VOLUMEN, CONTEO).
 * @param {string} unitStr
 * @returns {string|null}
 */
export function getMagnitude(unitStr) {
  const canonical = normalizeUnit(unitStr);
  if (!canonical || !CANONICAL_UNITS[canonical]) return null;
  return CANONICAL_UNITS[canonical].magnitude;
}

/**
 * Obtiene el factor multiplicador para convertir de fromUnit a toUnit:
 * toAmount = fromAmount * factor
 * @param {string} fromUnit
 * @param {string} toUnit
 * @returns {number|null} Factor de conversión o null si son incompatibles
 */
export function getFactor(fromUnit, toUnit) {
  const canFrom = normalizeUnit(fromUnit);
  const canTo = normalizeUnit(toUnit);

  if (!canFrom || !canTo) return null;
  if (canFrom === canTo) return 1;

  const metaFrom = CANONICAL_UNITS[canFrom];
  const metaTo = CANONICAL_UNITS[canTo];

  if (!metaFrom || !metaTo) return null;
  if (metaFrom.magnitude !== metaTo.magnitude) return null; // Incompatibilidad dimensional

  return metaFrom.factor / metaTo.factor;
}

/**
 * Comprueba si dos unidades son dimensionalmente compatibles entre sí (misma magnitud).
 * @param {string} unitA
 * @param {string} unitB
 * @returns {boolean}
 */
export function areCompatible(unitA, unitB) {
  if (!unitA || !unitB) return false;
  const magA = getMagnitude(unitA);
  const magB = getMagnitude(unitB);
  return magA !== null && magA === magB;
}

/**
 * Convierte una cantidad de fromUnit a toUnit dentro de la misma magnitud física.
 * @param {number} qty
 * @param {string} fromUnit
 * @param {string} toUnit
 * @returns {number}
 */
export function convert(qty, fromUnit, toUnit) {
  const factor = getFactor(fromUnit, toUnit);
  if (factor === null) {
    throw new Error(`Conversión dimensional incompatible entre "${fromUnit}" y "${toUnit}"`);
  }
  return Number(qty) * factor;
}

/**
 * Conversión explícita entre volumen y masa exigiendo densidad física (HAL-F2-03).
 * Evita la asunción ingenua de 1 L = 1 kg para productos con densidad distinta a 1.0.
 * @param {number} volumeQty - Cantidad de volumen (en Litros o normalizada a Litros)
 * @param {number} densityKgPerL - Densidad en kg/L (ej. leche ~1.032 kg/L)
 * @returns {number} Masa en kilogramos
 */
export function convertVolumeToMass(volumeQty, densityKgPerL = 1.0) {
  if (!densityKgPerL || densityKgPerL <= 0) {
    throw new Error('Densidad debe ser un número positivo para convertir volumen a masa');
  }
  return Number(volumeQty) * Number(densityKgPerL);
}
