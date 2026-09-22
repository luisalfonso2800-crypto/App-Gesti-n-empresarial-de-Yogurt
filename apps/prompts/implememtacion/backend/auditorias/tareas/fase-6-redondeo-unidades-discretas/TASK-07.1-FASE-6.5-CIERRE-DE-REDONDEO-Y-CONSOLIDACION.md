# FASE 6.5 — CONSOLIDACIÓN DE REDONDEOS

## Reglas
- NO modificar código.
- NO avanzar a Fase 7.
- Máximo 300 palabras.

## Tareas

### T1. Consolidar HAL-F6-02 como consecuencia de HAL-F6-01
No es hallazgo independiente. Es la consecuencia directa de
que cantidadTeorica se guarde como 15 en vez de 14.2.
Reformular HAL-F6-01 con tres consecuencias:
1. Costo teórico sobre 15 en vez de 14.2.
2. Desviación siempre 0 o 1 (consecuencia HAL-F6-02).
3. Análisis histórico de merma pierde granularidad.

### T2. Formalizar HAL-F6-03
Redondeo en dashboards que contamina agregados.
Ejemplo: 100 filas de $1000.50
  round por fila: 1001 × 100 = $100,100
  round del total: 100,050
  Diferencia: $50
Ubicación: dashboard.service.js, simulation.engine.service.js
Severidad: MEDIO.

### T3. Cuantificar impacto anualizado del error de IVA
Si la licitación escolar se factura 52 veces/año:
  Sobrecoste: $500 × 52 = $26,000 COP/año
  IVA reportado de más: $273 × 52 = $14,196 COP/año
Bandera roja para auditoría DIAN.
Añadir al informe final de HAL-F4-06.

### T4. Actualizar conteo
Fase 6: 1 ALTO (HAL-F6-01 con HAL-F6-02 absorbido) + 1 MEDIO (HAL-F6-03).
Acumulado: 13 CRÍTICOS + 9 ALTOS + 2 MEDIOS = 24 únicos.

## Entrega
- HAL-F6-01 reformulado con consecuencias.
- HAL-F6-03 formalizado.
- Impacto anualizado cuantificado.
- Conteo corregido.
- Máximo 300 palabras.
- DETENERSE. Listo para autorizar Fase 7.