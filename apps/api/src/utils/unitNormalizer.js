export const CANONICAL_UNITS = {
  MASS_SMALL: 'g',
  MASS_BIG: 'kg',
  VOL_SMALL: 'ml',
  VOL_BIG: 'l',
  UNIT: 'und'
};

export function toCanonicalUnit(unitStr) {
  const u = String(unitStr || '').toLowerCase().trim();
  if (['g', 'gr', 'grs', 'gramo', 'gramos'].includes(u)) return CANONICAL_UNITS.MASS_SMALL;
  if (['kg', 'kgs', 'kilo', 'kilos', 'kilogramo', 'kilogramos'].includes(u)) return CANONICAL_UNITS.MASS_BIG;
  if (['ml', 'mls', 'mililitro', 'mililitros', 'cc'].includes(u)) return CANONICAL_UNITS.VOL_SMALL;
  if (['l', 'lt', 'lts', 'litro', 'litros'].includes(u)) return CANONICAL_UNITS.VOL_BIG;
  if (['und', 'unidad', 'unidades', 'pza', 'piezas'].includes(u)) return CANONICAL_UNITS.UNIT;
  return u;
}

export function getUnitConversionFactor(fromUnit, toUnit) {
  const from = toCanonicalUnit(fromUnit);
  const to = toCanonicalUnit(toUnit);
  if (from === to) return 1;
  if ((from === 'kg' && to === 'g') || (from === 'l' && to === 'ml')) return 1000;
  if ((from === 'g' && to === 'kg') || (from === 'ml' && to === 'l')) return 0.001;
  return 1;
}
