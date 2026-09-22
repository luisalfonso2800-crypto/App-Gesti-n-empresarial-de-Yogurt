# FASE 8.5 — CONSOLIDACIÓN DE PRODUCCIÓN Y WIP

## Reglas
- NO modificar código.
- NO avanzar a Fase 9.
- Máximo 350 palabras.

## Tareas

### T1. Consolidar HAL-F8-03 dentro de HAL-F3-02
HAL-F8-03 (L945, ignora receta.unidadRendimiento) y HAL-F3-02 (L945,
ignora Presentacion.unidadMedida) son el mismo hardcoding en la misma
línea.
Reformular HAL-F3-02 con dos causas raíz:
1. No propaga Presentacion.unidadMedida (F3-02 original).
2. No propaga receta.unidadRendimiento (F8-03).
Consolidaciones previas: absorbe HAL-F1-02 (Fase 1).
NO crear HAL-F8-03 como ID independiente.

### T2. Formalizar HAL-F8-04
Problema: cantidadProducidaReal no tiene columna de unidad. Su
semántica depende de producto.categoria === 'INTERMEDIO_WIP'.
Ejemplo: un intermedio reclasificado como final deja lotes históricos
con cantidad interpretada erróneamente (100 L → 100 und).
Severidad: ALTO.
Ubicación: schema.prisma (Produccion) + production.repository.js.

### T3. Nota HAL-F4-03 ↔ HAL-F8-02
Ambos son validaciones Poka-Yoke faltantes en production.repository.js:
- HAL-F4-03: rendimientoBase = 0 → fallback || 1.
- HAL-F8-02: mermaPorcentaje fuera de [0, 100).
Mantener IDs separados (recomendaciones distintas), pero anotar la
relación en el informe final.

### T4. Actualizar conteo
Fase 8 aporta: 1 CRÍTICO (F8-01) + 2 ALTOS (F8-02, F8-04).
Acumulado: 15 CRÍTICOS + 14 ALTOS + 3 MEDIOS = 32.

## Entrega
- HAL-F3-02 reformulado con dos causas raíz.
- HAL-F8-04 formalizado.
- Nota de relación F4-03 ↔ F8-02.
- Conteo actualizado.
- Máximo 350 palabras.
- DETENERSE. Listo para autorizar Fase 9.