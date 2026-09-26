# FASE 11 — TESTS FALTANTES

## Reglas heredadas
- NO modificar código.
- NO escribir tests. Solo analizar los existentes y proponer los faltantes.
- Si no se puede demostrar, marcar NO VERIFICADO.
- Máximo 1200 palabras. Tablas > prosa.
- DETENERSE al terminar. No avanzar a Fase 11.5.

## Contexto heredado (39 hallazgos únicos)
Todos los hallazgos de Fases 1-10 están documentados en informes previos.
La Fase 11 es la última antes del cierre final.

## Tareas

### T1. Inventario de tests existentes
Buscar en apps/api y apps/web:
- tests unitarios (*.spec.js, *.test.js)
- tests de integración
- tests E2E
Listar: archivo | módulo | qué prueba | framework (Jest, Vitest, Mocha).

### T2. Cobertura por hallazgo crítico
Para cada CRÍTICO de las Fases 1-10, verificar si existe test que:
- Lo detecte como bug actual, o
- Lo prevenga en el futuro.
Tabla: ID hallazgo | ¿test existente? | archivo test | observación.

Ejemplos:
- HAL-F1-04 (escalado ['Lt','Lts','Kg','Kgs']): ¿hay test con
  'Litros' o 'Kilogramos'?
- HAL-F2-01 (areUnitsCompatible rechaza misma magnitud): ¿hay test
  con kg vs g?
- HAL-F4-01 (compras no actualizan CPP): ¿hay test que verifique CPP
  después de compra?
- HAL-F8-01 (factor 1000x WIP): ¿hay test de costo de WIP consumido
  en ml?
- HAL-F10-02 (totales del cliente): ¿hay test de payload manipulado?

### T3. Tests faltantes por área
Proponer (sin implementar) tests para:

**Unidades y conversiones:**
- Conversión oz ↔ ml ↔ g con todos los clasificadores.
- Conversión kg ↔ g ↔ mg.
- areUnitsCompatible con misma magnitud distinta escala.

**Cálculos:**
- CPP con múltiples compras a precios distintos.
- IVA con precioIncluyeIva true/false.
- Descuento comercial vs financiero.
- Margen sobre base vs sobre total.

**Inventario:**
- Identidad stockNuevo = stockAnterior + entrada - salida por clase.
- Descuento de stock en unidad distinta a la del catálogo.

**Producción:**
- Factor 1000x WIP: 150 ml de base → costo esperado $510, no $510,000.
- rendimientoBase = 0.
- merma > 100%.
- Math.ceil en discretas con cantidad teórica fraccionaria.

**Ventas y finanzas:**
- Payload manipulado con totales alterados.
- Pago que excede saldo.
- Utilidad neta sin recaudo vs recaudada.

**Frontend vs Backend:**
- Cálculo de IVA coincidente entre frontend y backend.
- Payload con baseGravable explícito vs implícito.

### T4. Tests de regresión por hallazgo
Para cada CRÍTICO, proponer un test específico que:
- Replique el bug actual.
- Falle con el código actual.
- Pase cuando se aplique el fix.
Tabla: ID | título del test | setup | assertion | validación.

### T5. Priorización
Clasificar los tests faltantes en:
- Bloqueantes (deben existir antes de cualquier refactor).
- Críticos (deben existir antes de release).
- Deseables (nice to have).

### T6. Relación con hallazgos previos
¿Qué hallazgos requieren test específico por su complejidad o
criticidad?

## Entrega
- Inventario de tests existentes (T1)
- Cobertura por hallazgo crítico (T2)
- Tests faltantes por área (T3)
- Tests de regresión por hallazgo (T4)
- Priorización (T5)
- Relación con hallazgos previos (T6)
- Conteo de tests faltantes por severidad
- NO VERIFICADO
- Máximo 1200 palabras
- DETENERSE. No avanzar a Fase 11.5.