# FASE 1.8 — FORMALIZACIÓN DE HALLAZGOS FINALES Y HABILITACIÓN FASE 2

## Reglas
- NO modificar código.
- NO avanzar a Fase 2 hasta cerrar esta fase.
- Máximo 300 palabras. Solo tabla + conteo + precondiciones.

## Tareas

### T1. Formalizar HAL-F1-05
Archivo: apps/api/src/recipes/recipes.service.js L19-38
Problema: Tercer normalizador (extractCanonicalUnit) en paralelo a
         UnitConverter y unitNormalizer.js.
Severidad: ALTO
Consecuencia: Fragmentación triple de normalizadores.

### T2. Formalizar HAL-F1-06
Archivo: recipes.service.js + areUnitsCompatible
Problema: areUnitsCompatible('oz','ml') retorna FALSE aunque UnitConverter
         los considera compatibles (ambos volumen).
Efecto: Bloqueo funcional de guardado de recetas con oz.
Severidad: CRÍTICO
Ejemplo: Receta base ml + ingrediente oz → BadRequestException.

### T3. Reclasificar HAL-F1-02
De MEDIO a ALTO. Justificar: afecta Kardex y balance de masa.

### T4. Actualizar HAL-F1-04
Quitar "RIESGO POTENCIAL". Confirmar error activo con:
- Leche Entera (unidadBase='Litros') no escala (espera 'Lt'/'Lts').
- Azúcar Blanco (unidadBase='Kilogramos') no escala (espera 'Kg'/'Kgs').
Añadir ejemplo: compra de 1 L ingresa 1 al stock en vez de 1000.

### T5. Corregir conteo
- CRÍTICO: 4 (HAL-F1-01, HAL-F1-03, HAL-F1-04, HAL-F1-06)
- ALTO: 2 (HAL-F1-02, HAL-F1-05)
- MEDIO: 0
- Total: 6

### T6. Añadir precondiciones 4 y 5 para Fase 2
4. Coherencia entre los tres clasificadores dimensionales.
5. Auditoría de denegación funcional de areUnitsCompatible.

## Entrega
- Tabla final Fase 1 con HAL-F1-01 a HAL-F1-06.
- Conteo corregido.
- Precondiciones 1-5 para Fase 2.
- Máximo 300 palabras.
- DETENERSE. Listo para autorizar Fase 2.