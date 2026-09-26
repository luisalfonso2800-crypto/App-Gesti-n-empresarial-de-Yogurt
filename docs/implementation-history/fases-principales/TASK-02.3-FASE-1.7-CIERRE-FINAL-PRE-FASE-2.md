# FASE 1.7 — CIERRE FINAL PRE-FASE 2

## Reglas
- NO modificar código.
- NO avanzar a Fase 2.
- Máximo 300 palabras. Solo actualizar tabla y conteo.
- Usa grep, no lectura completa.

## Tareas

### T1. Formalizar HAL-F1-05
Archivo: apps/api/src/recipes/recipes.service.js L19-38
Problema: Implementa su propio normalizador regex `extractCanonicalUnit`
         en paralelo a UnitConverter y unitNormalizer.js.
Severidad: ALTO
Consecuencia: Tercer normalizador independiente; fragmentación estructural.

### T2. Reformular HAL-F1-03
Documentar explícitamente cómo se determina `isSmallUnit`.
Dejar claro que el umbral monetario es dimensionalmente inválido
(discrimina por precio, no por unidad).

### T3. Ajustar HAL-F1-04
Marcar como `RIESGO POTENCIAL — REQUIERE VERIFICACIÓN` si no puedes
confirmar desde seeds/schema que existan insumos con `unidadBase` en
'kg', 'L', 'kilo', 'litro'. Si puedes confirmarlo, mantener CRÍTICO.

### T4. Documentar flujo de HAL-F1-01
¿El frontend envía unidad o solo cantidad? ¿El backend re-convierte?
Si no se puede desde código, marcar `NO VERIFICADO — requiere DTO de recetas`.

### T5. Actualizar conteo y cerrar Fase 1.

## Entrega
- Tabla final con HAL-F1-01 a HAL-F1-05.
- Conteo por severidad.
- Máximo 300 palabras.
- DETENERSE. Listo para autorizar Fase 2.