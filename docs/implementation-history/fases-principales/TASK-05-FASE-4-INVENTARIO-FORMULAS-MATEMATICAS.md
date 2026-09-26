# FASE 4 — INVENTARIO DE FÓRMULAS MATEMÁTICAS DE NEGOCIO

## Reglas heredadas
- NO modificar código.
- NO asumir que una fórmula es correcta porque existe.
- Si no se puede demostrar, marcar NO VERIFICADO.
- Máximo 2000 palabras (fase más amplia que las anteriores). Tablas > prosa.
- DETENERSE al terminar. No avanzar a Fase 5.

## Contexto heredado (15 hallazgos únicos)
Fase 1 (unidades):
- HAL-F1-01: dualidad normalizadores oz (CRÍTICO)
- HAL-F1-02/03-02: hardcoding unidad lote + unidadMedida no propaga (CRÍTICO consolidado)
- HAL-F1-03: heurística costoUnitario > 100 (CRÍTICO)
- HAL-F1-04: escalado ['Lt','Lts','Kg','Kgs'] en compras (CRÍTICO)
- HAL-F1-05: extractCanonicalUnit tercer normalizador (ALTO)
- HAL-F1-06: areUnitsCompatible('oz','ml') = false (CRÍTICO)

Fase 2 (dimensional):
- HAL-F2-01: areUnitsCompatible rechaza misma magnitud distinta escala (CRÍTICO)
- HAL-F2-02: descuento stock sin normalizar + Math.max(0,...) (CRÍTICO)
- HAL-F2-03: 1 L = 1000 g sin densidad (ALTO)
- HAL-F2-04: extractCanonicalUnit no reconoce VASO/TAPA/ETIQUETA (CRÍTICO)
- HAL-F2-05: mg no soportado en clasificadores (ALTO)

Fase 3 (presentaciones):
- HAL-F3-01: sobreescribe cantidadPresentacion = 1 (ALTO)
- HAL-F3-03: inyección forzada 1000ml en granel (CRÍTICO)
- HAL-F3-04: costoUnidadBase sin validación dimensional (ALTO)
- HAL-F3-05: cantidadOz asume densidad 1.0 (ALTO)

## Tareas

### T1. Inventario de operaciones aritméticas
Grep por patrones (en apps/api y apps/web):
- Sumas/restas/multiplicaciones/divisiones directas sobre campos
  monetarios o de cantidad.
- Math.round, Math.ceil, Math.floor, Math.min, Math.max, Math.abs.
- Operadores % (módulo).
- Decimal.js / decimal.js / big.js si existieran.
Para cada ocurrencia: archivo | línea | operación | campos involucrados.

### T2. Fórmulas de negocio específicas
Localizar y documentar la implementación exacta de:
- stockNuevo = stockAnterior ± cantidad (inventario, kardex)
- Costo promedio ponderado (compras)
- cantidadNecesaria / cantidadPlanificada / factorEscalamiento (recetas)
- merma / rendimiento / cantidadReal / cantidadTeorica (producción)
- costoTeorico / costoReal / desviacionCantidad / desviacionCosto (producción)
- subtotal / descuento / baseGravable / IVA / total / saldo / utilidad /
  margen (ventas)
- saldoPendiente / valorPagado / nuevoSaldo (pagos)
- fondosDisponibles / ingresos / egresos / aportes (finanzas)
- costoUnidadBase (supplier-prices)

Para cada fórmula:
- Fórmula actual implementada (cita literal).
- Fórmula esperada según reglas del negocio.
- Unidades involucradas.
- Escala decimal.
- Redondeo aplicado.
- Casos límite: cantidad=0, stock=0, costo=0, IVA=0, descuento=100%, etc.
- División por cero.
- Resultados negativos posibles.
- Error acumulativo si se re-redondea.

### T3. Costo promedio ponderado (prioridad máxima)
Auditar en detalle:
- ¿Dónde se calcula?
- ¿Se usa Decimal o Number?
- ¿Se redondea antes o después de aplicar?
- Ejemplo numérico con múltiples compras:
  Compra 1: 10 kg a $1000/kg
  Compra 2: 5 kg a $2000/kg
  Compra 3: 2 kg a $500/kg
  Costo esperado: (10000 + 10000 + 1000) / 17 = $1235.29/kg
  ¿El sistema produce esto o algo distinto?

### T4. Cálculos de IVA y descuentos
Auditar específicamente:
- ¿precioIncluyeIva se maneja correctamente?
- Fórmula: base = precio / (1 + IVA); IVA = precio - base
  vs IVA = base * tarifa; total = base + IVA
- ¿Se redondea en línea o en factura?
- Ejemplo numérico: 3 productos con IVA 19%, verificar centavos.

### T5. Cálculos de producción y merma
Auditar:
- rendimientoBase = 0
- cantidadPlanificada > cantidadProducidaReal
- mermaPorcentaje > 100
- factor = cantidadSolicitada / rendimientoBase

### T6. Relación con hallazgos previos
Identificar qué fórmulas amplifican HAL-F1-03, HAL-F2-02, HAL-F3-03.

## Formato de hallazgos
ID: HAL-F4-XX
Severidad | Archivo | Línea | Fórmula |
Actual vs esperada | Unidades | Escala | Redondeo |
Ejemplo numérico demostrado | Impacto | Condición que lo dispara.

## Entrega
- Inventario de operaciones aritméticas (T1)
- Inventario de fórmulas de negocio (T2)
- Auditoría costo promedio ponderado (T3)
- Auditoría IVA y descuentos (T4)
- Auditoría producción y merma (T5)
- Conexiones con fases previas (T6)
- Conteo por severidad
- NO VERIFICADO
- Máximo 2000 palabras
- DETENERSE. No avanzar a Fase 5.