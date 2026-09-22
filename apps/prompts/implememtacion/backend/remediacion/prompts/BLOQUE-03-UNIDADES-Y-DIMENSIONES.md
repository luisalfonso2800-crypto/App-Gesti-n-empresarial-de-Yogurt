Prompt del Bloque 3 (Unidades y dimensiones)
Este es el bloque más grande de la remediación: 8 hallazgos relacionados con unidades, clasificadores y dimensiones.

text
# BLOQUE 3 DE REMEDIACIÓN — UNIDADES Y DIMENSIONES

## Contexto
Auditoría forense completada (INFORME-36).
Bloques 1 y 2 completados.
Hallazgos a corregir en este bloque:
- HAL-F1-01 (CRÍTICO): Dualidad conversor oz (Frontend 1x vs Backend 29.57x).
- HAL-F1-06 (CRÍTICO): areUnitsCompatible('oz','ml') retorna false.
- HAL-F2-01 (CRÍTICO): areUnitsCompatible rechaza kg vs g, l vs ml.
- HAL-F2-04 (CRÍTICO): recipes.service.js rechaza VASO/TAPA/ETIQUETA.
- HAL-F1-04 (CRÍTICO): Escalado compras case-sensitive ['Lt','Lts','Kg','Kgs'].
- HAL-F1-05 (ALTO): Tercer normalizador extractCanonicalUnit fragmentado.
- HAL-F2-03 (ALTO): Asume 1 L = 1000 g sin densidad.
- HAL-F2-05 (ALTO): mg omitida en clasificadores.

Causa raíz común: fragmentación de clasificadores de unidades
(UnitConverter, unitNormalizer, extractCanonicalUnit, ad-hoc).

## Alcance
- apps/api/src/common/utils/unit-converter.js
- apps/api/src/utils/unitNormalizer.js (backend)
- apps/web/src/utils/unitNormalizer.js (frontend)
- apps/api/src/recipes/recipes.service.js
- apps/api/src/purchases/purchases.repository.js
- Cualquier archivo con lógica ad-hoc de unidades
  (grep por ['Lt','Lts','Kg','Kgs'], unidadBase, .includes())

## Reglas de ejecución
- Cada fix cita su hallazgo origen.
- Cada fix incluye su test de regresión (TEST-AUD-01, TEST-AUD-02,
  TEST-AUD-17).
- Un commit atómico por hallazgo.
- Rama: remediation/bloque-3-unidades.
- NO modificar fixes de Bloques 1 y 2.
- Preservar la compatibilidad con el frontend actual.
- Si aparece hallazgo nuevo, va a BACKLOG_POST_AUDITORIA.md.
- DETENERSE al terminar. No avanzar a Bloque 4.

## Tareas

### T1. Diseñar el clasificador canónico único
Crear apps/api/src/common/units/unit-registry.js con:
- Enumeración de magnitudes: MASA, VOLUMEN, CONTEO.
- Mapa canónico: { 'g': {magnitude: MASA, factor: 1},
  'kg': {magnitude: MASA, factor: 1000},
  'mg': {magnitude: MASA, factor: 0.001},
  'ml': {magnitude: VOLUMEN, factor: 1},
  'l': {magnitude: VOLUMEN, factor: 1000},
  'oz': {magnitude: VOLUMEN, factor: 29.5735},
  'und': {magnitude: CONTEO, factor: 1}, ...}
- Aliases: 'kilo', 'kilos', 'kilogramo', 'litros', 'lt', 'lts',
  'gramos', 'grs', 'mililitros', 'mls', 'onza', 'onzas', 'pza',
  'pieza', 'vaso', 'tapa', 'etiqueta', 'paq', 'paquete'.
- Funciones:
  - normalizeUnit(u): devuelve la clave canónica o null.
  - getMagnitude(u): devuelve MASA/VOLUMEN/CONTEO o null.
  - getFactor(from, to): devuelve factor de conversión o null.
  - areCompatible(a, b): true si misma magnitud.
  - convert(qty, from, to): conversión dimensional.

### T2. Unificar unit-converter.js (backend) con el registry
- Reemplazar la implementación actual de unit-converter.js por un
  wrapper que use el registry.
- Preservar la API pública actual (UnitConverter.convert, etc.) para
  no romper consumidores existentes.
- Si algún consumidor usaba lógica específica de unit-converter.js,
  documentar el cambio.

### T3. Unificar unitNormalizer.js (frontend) con el registry
- Opción A: importar el registry en el frontend (mismo package).
- Opción B: duplicar el registry en apps/web (si no hay monorepo
  shared package).
- Decidir según la estructura del repo.
- Preservar la API actual (toCanonicalUnit, getUnitConversionFactor).

### T4. Refactorizar extractCanonicalUnit en recipes.service.js
- Reemplazar la implementación regex por:
  ```javascript
  const { normalizeUnit, getMagnitude } = require('...unit-registry');
  function extractCanonicalUnit(u) {
    return normalizeUnit(u); // puede devolver null
  }
Arreglar areUnitsCompatible para usar getMagnitude:

javascript
function areUnitsCompatible(a, b) {
  const magA = getMagnitude(a);
  const magB = getMagnitude(b);
  return magA !== null && magA === magB;
}
Eso resuelve HAL-F1-06, HAL-F2-01 y HAL-F2-04 de una vez.

T5. Arreglar escalado en compras (HAL-F1-04)
En purchases.repository.js L173:

Reemplazar:

javascript
const isLtsOrKgs = ['Lt', 'Lts', 'Kg', 'Kgs'].includes(currentInsumo.unidadBase);
const incrementStock = isLtsOrKgs ? cantidadBaseTotal * 1000 : cantidadBaseTotal;
Por:

javascript
const { getFactor } = require('...unit-registry');
const factor = getFactor(currentInsumo.unidadBase, 'g') ||
               getFactor(currentInsumo.unidadBase, 'ml') ||
               1;
const incrementStock = cantidadBaseTotal * factor;
Ajustar según la unidad base real del insumo.

T6. Formalizar la densidad (HAL-F2-03)
Opción A: añadir campo densidad en Insumo (Decimal).

Opción B: registrar la ausencia como deuda y forzar conversión
explícita cuando se requiera masa ↔ volumen.

Decidir y justificar.

Mínimo: reemplazar la conversión implícita 1 L = 1 kg por una
función convertVolumeToMass(qty, density) que exija densidad
explícita.

T7. Añadir mg a todos los clasificadores (HAL-F2-05)
Incluir 'mg' en el registry.

Verificar que las fórmulas que usan mg se calculan correctamente.

T8. Tests de regresión
TEST-AUD-01: areUnitsCompatible('kg', 'g') → true.
TEST-AUD-02: convert(1, 'Litros', 'ml') → 1000.
TEST-AUD-17: Lote generado en unidad de receta (no hardcoded).
Añadir TEST-AUD-EMERG-01: convert('oz', 'ml') → 29.5735.

T9. Smoke test
Crear receta con ingredientes en kg, g, ml, l, oz, mg.

Verificar que se guarda sin BadRequestException.

Crear compra en 'Litros' y 'Kilogramos' → verificar stock
escalado correctamente.

Crear producción con WIP consumido en ml → costo correcto.

T10. Verificación y cierre
Correr suite completa (10 + 4 = ~14 tests).

Confirmar 0 regresiones.

Documentar en INFORME-REMEDIACION-03.md.

Formato de entrega
INFORME-REMEDIACION-03.md con T1-T10.

Máximo 2000 palabras (bloque grande).

DETENERSE. No avanzar a Bloque 4.

Criterios de aceptación
Los 8 hallazgos marcados como RESUELTOS.

Un único clasificador canónico en uso (no coexisten 3).

areUnitsCompatible devuelve true para kg/g, l/ml, oz/ml.

Compras en 'Litros'/'Kilogramos' escalan correctamente.

VASO/TAPA/ETIQUETA son aceptados en recetas.

mg se maneja en todos los clasificadores.

0 regresiones en tests de Bloques 1 y 2.

Smoke test funcional documentado.

text

## 📉 Consumo estimado

- Bloque 3: ~20-25% de Fase 1 (es el más grande).
- Modelo: **Gemini 3 High** o **Claude Opus**.
- Tiempo: 60-90 min.

## 💎 Resumen

Los Bloques 1 y 2 están **bien ejecutados** y resuelven 5 de los 19 CRÍTICOS. El código es sólido y los tests pasan. Pero hay **una deuda técnica importante**: el recálculo de sales del Bloque 1 asume `precioIncluyeIva = false` y usa redondeo por línea — ambos problemas que el Bloque 4 tendrá que resolver. Conviene documentarlo ahora para no olvidarlo.

**Acción inmediata antes de Bloque 3:**

1. Verificar si `sales.repository.js` (post-Bloque 1) consulta `precioIncluyeIva`.
2. Registrar los 3 hallazgos secundarios en `BACKLOG_POST_AUDITORIA.md`.
3. Confirmar el smoke test funcional del Bloque 1.

Si esos tres puntos están OK, **Bloque 3 autorizado** con el prompt de arriba. Es el bloque más complejo de la remediación porque unifica los 4 clasificadores de unidades en uno solo; si sale bien, resuelve 8 hallazgos de una vez.