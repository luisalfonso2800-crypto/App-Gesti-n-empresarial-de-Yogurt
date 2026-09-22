/**
 * @file unitNormalizer.js
 * @module web/utils
 * @description Registro canónico frontend alineado 100% con unit-registry de backend (T3, HAL-F1-01).
 * Corrige la dualidad oz: oz en volumen fluido equivale a 29.5735 ml.
 */

export const MAGNITUDES = {
  MASA: 'MASA',
  VOLUMEN: 'VOLUMEN',
  CONTEO: 'CONTEO'
};

export const CANONICAL_UNITS = {
  MASS_SMALL: 'g',
  MASS_BIG: 'kg',
  VOL_SMALL: 'ml',
  VOL_BIG: 'l',
  UNIT: 'und',
  // Nuevas claves canónicas completas
  MASS_MICRO: 'mg',
  VOL_OZ: 'oz',
  PACKAGE: 'paq'
};

export const UNIT_OPTIONS = [
  { value: 'g', label: 'Gramos (g)', category: 'mass' },
  { value: 'kg', label: 'Kilogramos (kg)', category: 'mass' },
  { value: 'mg', label: 'Miligramos (mg)', category: 'mass' },
  { value: 'ml', label: 'Mililitros (ml)', category: 'volume' },
  { value: 'l', label: 'Litros (l)', category: 'volume' },
  { value: 'oz', label: 'Onzas Fluidas (oz)', category: 'volume' },
  { value: 'und', label: 'Unidades (und)', category: 'unit' },
  { value: 'paq', label: 'Paquetes (paq)', category: 'unit' }
];

const UNIT_MAP = {
  // Masa
  'g': 'g', 'gr': 'g', 'grs': 'g', 'gramo': 'g', 'gramos': 'g',
  'kg': 'kg', 'kgs': 'kg', 'kilo': 'kg', 'kilos': 'kg', 'kilogramo': 'kg', 'kilogramos': 'kg',
  'mg': 'mg', 'miligramo': 'mg', 'miligramos': 'mg',

  // Volumen
  'ml': 'ml', 'mls': 'ml', 'mililitro': 'ml', 'mililitros': 'ml', 'cc': 'ml',
  'l': 'l', 'lt': 'l', 'lts': 'l', 'litro': 'l', 'litros': 'l',
  'oz': 'oz', 'onza': 'oz', 'onzas': 'oz', 'fl oz': 'oz',

  // Conteo
  'und': 'und', 'unidad': 'und', 'unidades': 'und', 'pza': 'und', 'piezas': 'und',
  'vaso': 'und', 'tapa': 'und', 'etiqueta': 'und', 'botella': 'und',
  'paq': 'paq', 'paquete': 'paq', 'paquetes': 'paq'
};

const UNIT_FACTORS = {
  'g': { mag: MAGNITUDES.MASA, factor: 1 },
  'kg': { mag: MAGNITUDES.MASA, factor: 1000 },
  'mg': { mag: MAGNITUDES.MASA, factor: 0.001 },

  'ml': { mag: MAGNITUDES.VOLUMEN, factor: 1 },
  'l': { mag: MAGNITUDES.VOLUMEN, factor: 1000 },
  'oz': { mag: MAGNITUDES.VOLUMEN, factor: 29.5735 }, // Normalizado con backend

  'und': { mag: MAGNITUDES.CONTEO, factor: 1 },
  'paq': { mag: MAGNITUDES.CONTEO, factor: 1 }
};

export function toCanonicalUnit(unitStr) {
  const u = String(unitStr || '').toLowerCase().trim();
  if (UNIT_MAP[u]) return UNIT_MAP[u];
  if (/\b(litro|litros|lt|lts|l)\b/i.test(u)) return 'l';
  if (/\b(mililitro|mililitros|ml|cc)\b/i.test(u)) return 'ml';
  if (/\b(kilogramo|kilogramos|kg|kgs|kilo|kilos)\b/i.test(u)) return 'kg';
  if (/\b(gramo|gramos|gr|grs|g)\b/i.test(u)) return 'g';
  if (/\b(miligramo|miligramos|mg)\b/i.test(u)) return 'mg';
  if (/\b(onza|onzas|oz)\b/i.test(u)) return 'oz';
  if (/\b(unidad|unidades|und|pza|vaso|tapa|etiqueta|botella)\b/i.test(u)) return 'und';
  return u;
}

export function getUnitConversionFactor(fromUnit, toUnit) {
  const from = toCanonicalUnit(fromUnit);
  const to = toCanonicalUnit(toUnit);
  if (from === to) return 1;

  const metaFrom = UNIT_FACTORS[from];
  const metaTo = UNIT_FACTORS[to];

  if (!metaFrom || !metaTo || metaFrom.mag !== metaTo.mag) {
    return 1;
  }

  return metaFrom.factor / metaTo.factor;
}
