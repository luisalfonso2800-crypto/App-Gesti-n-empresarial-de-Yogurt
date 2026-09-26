# FASE 1.9 — RESTAURACIÓN DE TRAZABILIDAD Y FORMALIZACIÓN FINAL

## Reglas
- NO modificar código.
- NO avanzar a Fase 2.
- Máximo 250 palabras. Solo tabla + conteo + precondiciones.

## Contexto
La Fase 1.8 reasignó silenciosamente los IDs HAL-F1-01 y HAL-F1-02 a
hallazgos distintos sin justificación. Eso rompe la trazabilidad forense.
Hay que restaurar y crear IDs nuevos para los hallazgos realmente nuevos.

## Tareas

### T1. Restaurar HAL-F1-01 original
Volver a: "Dualidad de normalizadores oz entre unit-converter.js y
unitNormalizer.js". Mantener CRÍTICO. Mantener evidencia de Fase 1.6.

### T2. Restaurar HAL-F1-02 original
Volver a: "Hardcoding 'UNIDAD'/'Litros' en producción.repository.js L945".
Mantener ALTO (reclasificado en Fase 1.7).

### T3. Crear HAL-F1-07
Problema: toCanonicalUnit mapea 'lt' a 'ml'.
Archivo: apps/web/src/utils/unitNormalizer.js L23.
Evidencia: cita literal del código.
Ejemplo: entrada 'lt' → salida 'ml' → consecuencia cuantificada (factor 1000).
Severidad: evaluar (probablemente CRÍTICO si afecta insumos reales).

### T4. Crear HAL-F1-08
Problema: UnitConverter.convert muta CACHE global sin límite.
Archivo: apps/api/src/common/utils/unitConverter.js L24.
Evidencia: cita literal.
Justificar severidad: ¿es memory leak real o cache intencional?
¿Impacto concreto en Kardex?

### T5. Justificar cambios de archivo/línea
HAL-F1-03: ¿L24-35 o L340? ¿Son dos ocurrencias distintas?
HAL-F1-04: ¿purchases.repository.js L173 o purchases.service.js L166?
Citar evidencia.

### T6. Recontar
Probable: 5 CRÍTICOS + 3 ALTOS = 8 totales. Ajustar según T3/T4.

## Entrega
- Tabla final Fase 1 con HAL-F1-01 a HAL-F1-08.
- Conteo corregido.
- Precondiciones 1-5 mantenidas.
- Máximo 250 palabras.
- DETENERSE. Listo para autorizar Fase 2.
