# FASE 2.5 — CIERRE DE HALLAZGOS DIMENSIONALES (PENDIENTE DE ESPECIFICACIÓN)
# FASE 2.5 — CIERRE DE HALLAZGOS DIMENSIONALES

## Reglas
- NO modificar código.
- NO avanzar a Fase 3.
- Máximo 250 palabras. Solo tabla + ajustes + relación con Fase 1.

## Tareas

### T1. Desdoblar HAL-F2-02
Mantener el ID único pero añadir agravante explícito:
"Math.max(0, stockActual - qtyReal) oculta el error silenciosamente.
Un stock negativo sería la señal de alarma natural; forzarlo a 0
destruye la evidencia y desincroniza el Kardex."

### T2. Aclarar HAL-F2-04
Determinar con cita del flujo:
- ¿La receta con VASO/TAPA se rechaza con BadRequestException?
- ¿O la unidad se ignora y queda como string crudo en el BOM?
Severidad se ajusta según el caso:
- Rechazo → CRÍTICO (bloqueo funcional)
- Ignorancia → ALTO (validación posterior falla silenciosamente)

### T3. Formalizar HAL-F2-05
Problema: mg no está mapeado en unitNormalizer (web) ni en
extractCanonicalUnit (backend).
Consecuencia: si insumo tiene unidadBase='mg' y receta pide 'g',
areUnitsCompatible('mg','g') = false → rechazo.
Severidad: ALTO.
Ejemplo numérico: 500 mg de cultivo láctico vs 0.5 g de receta.

### T4. Añadir sección "Relación con Fase 1"
- HAL-F1-06 se amplifica en HAL-F2-01 (no es solo oz, es cualquier
  par de la misma magnitud).
- HAL-F1-05 es causa raíz de HAL-F2-01.
- HAL-F1-04 se agrava con HAL-F2-02 (entra mal, sale mal).

### T5. Actualizar conteo
CRÍTICO: 2 (HAL-F2-01, HAL-F2-02)
ALTO: 3 (HAL-F2-03, HAL-F2-04, HAL-F2-05)
Total: 5

## Entrega
- Tabla final Fase 2 con HAL-F2-01 a HAL-F2-05.
- Relación con Fase 1.
- Conteo actualizado.
- Máximo 250 palabras.
- DETENERSE. Listo para autorizar Fase 3.