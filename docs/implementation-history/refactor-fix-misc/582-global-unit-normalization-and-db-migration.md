TAREA:
Normalización Global de Unidades de Medida en Base de Datos, Backend y Frontend (/catalog/recipes)

OBJETIVO:
Estandarizar de forma universal el manejo de unidades de medida en toda la plataforma: crear un diccionario canónico compartido, ejecutar un script de migración para normalizar todos los registros existentes en la base de datos (PostgreSQL/Prisma) y asegurar que el motor de recetas calcule costos sin desfases dimensionales.

ESTÁNDAR CANÓNICO DE UNIDADES DEL SISTEMA:
- Masa Pequeña: 'g' (Gramos, gr, grs) -> canónico: 'g'
- Masa Grande: 'kg' (Kilogramos, kilo, kilos, kgs) -> canónico: 'kg' (Factor: 1 kg = 1000 g)
- Volumen Pequeño: 'ml' (Mililitros, mls, cc) -> canónico: 'ml'
- Volumen Grande: 'l' (Litros, lt, lts) -> canónico: 'l' (Factor: 1 l = 1000 ml)
- Unidad Discreta: 'und' (Unidades, unidad, unds, piezas) -> canónico: 'und'

PASO 1: MÓDULO UTILITARIO CANÓNICO COMPARTIDO
Crear o ubicar la función utilitaria de normalización en `apps/web/src/utils/unitNormalizer.js` (y su equivalente o exportación en API si aplica):
```javascript
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
  // De mayor a menor (ej. kg a g, l a ml)
  if ((from === 'kg' && to === 'g') || (from === 'l' && to === 'ml')) return 1000;
  // De menor a mayor (ej. g a kg, ml a l)
  if ((from === 'g' && to === 'kg') || (from === 'ml' && to === 'l')) return 0.001;
  return 1;
}