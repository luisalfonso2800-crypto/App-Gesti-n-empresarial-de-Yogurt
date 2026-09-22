# FASE 8 — PRODUCCIÓN, RECETAS Y WIP

## Reglas heredadas
- NO modificar código.
- NO asumir que un campo existe porque su nombre lo sugiere.
- Si no se puede demostrar, marcar NO VERIFICADO.
- Máximo 1500 palabras. Tablas > prosa.
- DETENERSE al terminar. No avanzar a Fase 9.

## Contexto heredado (29 hallazgos únicos)
Fase 4 ya encontró:
- HAL-F4-01: compras no actualizan costoPromedio
- HAL-F4-02: hardcoding $3400 en costo WIP
- HAL-F4-03: fallback || 1 en rendimientoBase

Fase 6 ya encontró:
- HAL-F6-01: Math.ceil destruye cantidadTeorica

Fase 7 ya encontró:
- HAL-F7-02: liquidación de costo contra costoPromedio instantáneo

Fases previas relevantes:
- HAL-F1-05: extractCanonicalUnit tercer normalizador
- HAL-F2-04: VASO/TAPA/ETIQUETA rechazados en recetas

## Tareas

### T1. Inventario de campos de producción
Localizar en schema.prisma y DTOs:
- rendimientoBase
- cantidadRequerida
- cantidadPlanificada
- cantidadProducidaReal
- cantidadTeorica
- cantidadRealUtilizada
- mermaPorcentaje
- unidadLote
Para cada uno: tipo, escala, semántica inferida, uso, relación con otros.

### T2. Auditoría del escalamiento
Rastrear el flujo:
  cantidad receta original
  ↓
  cantidad producción solicitada
  ↓
  factor = cantidadSolicitada / rendimientoBase
  ↓
  BOM escalada
Verificar:
- ¿Se calcula factor en cada línea o una sola vez?
- ¿rendimientoBase = 0 → fallback || 1 (HAL-F4-03)?
- ¿Se redondea el factor?
- Ejemplo: receta rendimientoBase=100 L, producir 250 L
  factor = 2.5. ¿Se aplica antes o después de redondeo por línea?

### T3. Auditoría de merma
- ¿mermaPorcentaje tiene validación 0 ≤ merma < 100?
- ¿Se aplica antes o después de Math.ceil en discretas?
- Ejemplo:
  Receta pide 1000 g, merma 5% → reqTeorico = 1050 g.
  Si se redondea antes: ceil(1000 * 1.05) = 1050.
  Si se redondea después: ceil(1000) * 1.05 = 1050.
  ¿Qué hace el sistema?

### T4. Transferencia de costo WIP → producto final
Auditar cómo se transfiere:
- Cantidad producida del intermedio
- Costo del intermedio
- Cantidad consumida del intermedio en producto final
- Costo transferido al producto final
Verificar:
- ¿La cantidad del intermedio se mide en la misma unidad?
- ¿El costo se transfiere proporcionalmente?
- Ejemplo: 100 L de base láctea a $3,400/L = $340,000.
  Si se consumen 50 L para 200 unidades de yogurt:
  costoUnitarioFinal = $340,000 × 0.5 / 200 = $850.

### T5. Diferencias entre producto intermedio y final
- ¿Un mismo campo (cantidadProducidaReal) mide cosas distintas según
  tipo de producto?
- ¿La unidad de lote (Litros/UNIDAD) coincide con la unidad de
  rendimiento de la receta?
- ¿El redondeo Math.ceil se aplica a intermedios también?

### T6. Relación con hallazgos previos
- HAL-F4-02 (hardcoding $3400): ¿afecta todos los WIP o solo lácteos?
- HAL-F6-01 (Math.ceil): ¿se aplica a cantidadTeorica del WIP?
- HAL-F7-02 (costoPromedio instantáneo): ¿afecta transferencia WIP?

## Formato de hallazgos
ID: HAL-F8-XX
Severidad | Archivo | Línea | Campo | Problema |
Fórmula actual vs esperada | Unidad | Redondeo |
Ejemplo numérico | Impacto | Condición que lo dispara.

## Entrega
- Inventario de campos (T1)
- Auditoría de escalamiento (T2)
- Auditoría de merma (T3)
- Transferencia WIP → final (T4)
- Diferencias intermedio/final (T5)
- Relación con fases previas (T6)
- Conteo por severidad
- NO VERIFICADO
- Máximo 1500 palabras
- DETENERSE. No avanzar a Fase 9.