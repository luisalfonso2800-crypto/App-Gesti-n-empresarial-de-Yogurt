# FASE 10.5 — CIERRE DE SCHEMA Y SEGURIDAD SERVER-SIDE

## Reglas
- NO modificar código.
- NO avanzar a Fase 11.
- Máximo 350 palabras.
- Tablas y síntesis directas.

## Tareas

### T1. Consolidación de HAL-F10-01 y HAL-F10-02 (Brecha de Seguridad y Fiabilidad Financiera)
- Evaluar la interconexión entre la ausencia de DTOs tipados/validados (`sales.dto.js`, `purchases.dto.js`, etc.) y la persistencia ciega de subtotales/totales enviados desde el cliente sin recálculo server-side.
- Formalizar el vector de manipulación de payloads y desincronización de libros contables.

### T2. Resolución y Agravante de HAL-F10-03 (Escalas en Decimales de Costos Unitarios)
- Confirmar el impacto de `@db.Decimal(12, 2)` en insumos con dosificación en gramos/miligramos frente a la escala estándar recomendada `@db.Decimal(14, 4)` o superior.
- Citar regla de negocio y riesgo de acumulación de error en órdenes de producción masivas.

### T3. Cuadre Oficial y Conteo Consolidado
- Fase 10: 2 CRÍTICOS (`HAL-F10-01`, `HAL-F10-02`) + 1 ALTO (`HAL-F10-03`) = 3 hallazgos.
- Total Acumulado Oficial: 19 CRÍTICOS + 17 ALTOS + 3 MEDIOS = **39 hallazgos únicos consolidados**.

## Entrega
- Brecha server-side consolidada.
- Agravante de escala de costos formalizado.
- Conteo oficial acumulado validado (39 únicos).
- Máximo 350 palabras.
- DETENERSE. Listo para Fase 11.
