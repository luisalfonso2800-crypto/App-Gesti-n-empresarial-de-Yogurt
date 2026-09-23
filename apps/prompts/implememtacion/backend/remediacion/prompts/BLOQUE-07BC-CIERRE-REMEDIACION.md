text
# BLOQUE 7B+7C — CIERRE DE HALLAZGOS MENORES

## REGLAS ANTI-QUEMA (obligatorias)
1. PROHIBIDO lanzar subagentes de investigación o de cualquier tipo.
2. PROHIBIDO usar Claude Opus o Sonnet. Usar Gemini Flash (Low).
3. Máximo 20 lecturas de archivo en total.
4. Máximo 12 ediciones en total.
5. NO explorar el repositorio. Ir directo a los archivos listados.
6. Si superas cualquier límite, DETENTE y reporta progreso parcial.
7. Un commit atómico por hallazgo.
8. DETENERSE al terminar. NO avanzar al cierre final.

## Contexto
Auditoría forense (INFORME-36).
Bloques 1-7A completados (32/39 hallazgos resueltos).

Hallazgos a corregir en este bloque:
- HAL-F4-02 (CRÍTICO): hardcoding a $3,400 COP en costo WIP si
  costoUnitario ≤ 0 o > 50000.
- HAL-F4-03 (CRÍTICO): fallback `|| 1` en rendimientoBase = 0
  genera explosión de materiales.
- HAL-F8-02 (ALTO): merma sin validación de rango (0 ≤ m < 100).
- HAL-F8-04 (ALTO): polimorfismo sin unidad en cantidadProducidaReal.
- HAL-F6-01 (ALTO): Math.ceil destruye cantidadTeorica en formulación.
- HAL-F6-03 (MEDIO): redondeo de filas en dashboards distorsiona
  agregados.

## Tareas

### T1. HAL-F4-02: eliminar hardcoding $3,400
Archivo: apps/api/src/production/production.repository.js L251-253.
Código actual:
if (costoUnitario <= 0 || costoUnitario > 50000) {
costoUnitario = 3400;
}

text
Fix:
- Si costoUnitario <= 0 o > 50000, lanzar BadRequestException con
  mensaje descriptivo.
- NO sustituir por constante. Si el costo es inválido, es un error
  de datos, no una razón para inventar un valor.

### T2. HAL-F4-03: validar rendimientoBase
Archivo: apps/api/src/production/production.repository.js L157.
Código actual:
const factorEscala = cantidadProduccion / (Number(receta.rendimientoBase) || 1);

text
Fix:
- Validar antes de calcular:
if (!receta.rendimientoBase || Number(receta.rendimientoBase) <= 0) {
throw new BadRequestException('rendimientoBase debe ser > 0');
}
const factorEscala = cantidadProduccion / Number(receta.rendimientoBase);

text
- Añadir validación también en el DTO Zod de recetas.

### T3. HAL-F8-02: validar rango de merma
Archivo: apps/api/src/production/production.repository.js L183-186.
Código actual:
const merma = Number(det.mermaPorcentaje) || 0;
reqTeorico = reqTeorico * (1 + (merma / 100));

text
Fix:
- Validar 0 ≤ merma < 100.
- Añadir validación en el schema Zod de recetas.

### T4. HAL-F8-04: añadir unidadCantidadProducida
Archivo: apps/api/prisma/schema.prisma modelo Produccion.
Fix:
- Añadir campo:
unidadCantidadProducida String @default("UNIDAD")

text
- Migración con `prisma migrate dev`.
- En production.repository.js, al crear Produccion, asignar la
unidad explícita.
- Backfill: para registros históricos, inferir la unidad según
categoría del producto.

### T5. HAL-F6-01: preservar cantidadTeorica original
Archivo: apps/api/src/production/production.repository.js L172-173.
Fix:
- Guardar `cantidadTeoricaOriginal` (Decimal sin ceil) ANTES del
redondeo.
- Mantener `cantidadTeorica` redondeada para consumo físico.
- Calcular desviación contra `cantidadTeoricaOriginal`.

### T6. HAL-F6-03: redondeo en dashboards
Archivos: apps/api/src/dashboard/dashboard.service.js y
apps/api/src/simulation/simulation.engine.service.js.
Fix:
- Sumar valores crudos primero, redondear UNA VEZ al final.
- NO redondear fila por fila.

### T7. Tests de regresión
Crear apps/api/src/common/tests/bloque-7bc.spec.js con:
- TEST-AUD-EMERG-08 (HAL-F4-02): costo inválido lanza excepción.
- TEST-AUD-EMERG-09 (HAL-F4-03): rendimientoBase=0 lanza excepción.
- TEST-AUD-EMERG-10 (HAL-F8-02): merma 150% lanza excepción.
- TEST-AUD-EMERG-11 (HAL-F8-04): unidadCantidadProducida se persiste.
- TEST-AUD-EMERG-12 (HAL-F6-01): cantidadTeoricaOriginal preserva decimales.
- TEST-AUD-EMERG-13 (HAL-F6-03): suma de dashboard no distorsiona.

### T8. Verificación y cierre
- Correr suite completa: 52 + 6 = 58 tests esperados.
- Confirmar 0 regresiones.
- Documentar en INFORME-REMEDIACION-07BC.md.

## Entrega
- INFORME-REMEDIACION-07BC.md.
- Máximo 1500 palabras.
- DETENERSE. NO avanzar al cierre final.

## Criterios de aceptación
1. Los 6 hallazgos marcados como RESUELTOS.
2. 6 tests nuevos pasan.
3. 0 regresiones (58 tests verdes).
4. 6 commits atómicos:
 - fix(production): throw on invalid costo instead of hardcode (HAL-F4-02)
 - fix(production): validate rendimientoBase > 0 (HAL-F4-03)
 - fix(production): validate merma range 0-100 (HAL-F8-02)
 - fix(schema): add unidadCantidadProducida to Produccion (HAL-F8-04)
 - fix(production): preserve cantidadTeoricaOriginal (HAL-F6-01)
 - fix(dashboard): sum raw then round once (HAL-F6-03)
🏁 Después del 7B+7C
Solo queda un bloque de cierre:

text
# CIERRE FINAL DE REMEDIACIÓN

## Tareas
1. Reporte consolidado de los 39 hallazgos (todos RESUELTOS o
   PARCIALES justificados).
2. Actualizar BACKLOG_POST_AUDITORIA.md con hallazgos emergentes
   (G-02 a G-07 + 283 Number() restantes + otros).
3. Reporte de cobertura de tests (22 planificados vs
   implementados).
4. Recomendaciones de próximos pasos.
5. Tag final: post-remediacion-completa.

## Entrega
INFORME-FINAL-REMEDIACION.md. Máximo 2000 palabras.