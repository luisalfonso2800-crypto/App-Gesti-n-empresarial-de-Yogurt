# FASE 6 — REDONDEO Y UNIDADES DISCRETAS

## Reglas heredadas
- NO modificar código.
- NO asumir que Math.ceil es inocuo.
- Si no se puede demostrar, marcar NO VERIFICADO.
- Máximo 1500 palabras. Tablas > prosa.
- DETENERSE al terminar. No avanzar a Fase 7.

## Contexto heredado
- HAL-F4-06: Math.round en cada línea de venta vs al total.
- HAL-F4-08: Math.max(0, ...) como antipatrón contable.
- HAL-F4-07: 288 conversiones Number() (68% en cálculos financieros).
- HAL-F1-03: heurística costoUnitario > 100 divide por 1000.
- HAL-F2-04: extractCanonicalUnit no reconoce VASO/TAPA/ETIQUETA.

## Tareas

### T1. Inventario de todos los redondeos
Grep en apps/api y apps/web por:
- Math.round, Math.ceil, Math.floor
- .toFixed(  (con todos los decimales usados)
- Math.trunc
Para cada ocurrencia: archivo | línea | campo | operación |
decimales | motivo aparente | etapa (cálculo/almacenamiento/presentación).

### T2. Clasificar redondeos por propósito
Categorizar cada ocurrencia en:
- Redondeo para almacenamiento (al guardar en BD)
- Redondeo para cálculo (intermedio, antes de otro cálculo)
- Redondeo para presentación (antes de mostrar al usuario)
- Redondeo fiscal (IVA, base gravable, total factura)
- Redondeo de unidades físicas (discretas, indivisibles)

Regla: el redondeo para presentación NUNCA debe afectar el cálculo.
Buscar violaciones.

### T3. Auditoría específica de Math.ceil en UNIDADES_DISCRETAS
Localizar UNIDADES_DISCRETAS (production.repository.js L18).
Documentar:
- Qué unidades están incluidas (UNIDAD, VASO, TAPA, ETIQUETA, etc.)
- Dónde se aplica Math.ceil
- Por qué (ej. no se puede pedir 14.2 tapas, se piden 15)
- ¿Se aplica antes o después del cálculo de costos?
- ¿La cantidad redondeada se usa para costo también, o solo para
  cantidad física?
- ¿Se vuelve a redondear en otra capa?

Ejemplo obligatorio:
  Receta: 14.2 tapas necesarias
  Math.ceil → 15 tapas
  ¿El costo se calcula sobre 14.2 o sobre 15?
  ¿El inventario descuenta 14.2 o 15?
  Si hay 100 tapas y se piden 14.2:
    - Descuenta 14.2 → quedan 85.8 (fracción irreal de tapa)
    - Descuenta 15 → quedan 85 (correcto)
  Documentar qué hace el sistema actual.

### T4. Error acumulativo por redondeo temprano
Buscar el patrón:
  valor real
  → redondeo
  → nuevo cálculo
  → redondeo
  → nuevo cálculo

Especialmente en:
- IVA línea → IVA total
- Costo unitario → costo total → costo promedio
- Stock parcial → stock acumulado

Ejemplo numérico:
  1000 líneas de $10.505 cada una (IVA 19% incluido)
  Redondeo por línea: round(10.505/1.19) = round(8.827) = 9
  Base total: 9000
  Redondeo global: round(10505/1.19) = round(8827.73) = 8828
  Diferencia: 172 COP acumulados por redondeo temprano.

### T5. Redondeo en producción y merma
Auditar:
- cantidadTeorica vs cantidadReal: ¿se redondean antes de comparar?
- mermaPorcentaje: ¿se redondea antes de aplicar?
- factorEscala: ¿se redondea?
- costoTeorico vs costoReal: ¿se redondean antes de calcular desviación?

### T6. Relación con hallazgos previos
- HAL-F4-06 (redondeo IVA): ¿es el único caso de redondeo temprano?
- HAL-F4-08 (Math.max): ¿oculta errores de redondeo?
- HAL-F1-03 (>100): ¿aplica Math.round después?
- HAL-F2-04 (VASO/TAPA): ¿está en UNIDADES_DISCRETAS?

## Formato de hallazgos
ID: HAL-F6-XX
Severidad | Archivo | Línea | Campo | Problema |
Fórmula actual | Comportamiento esperado |
Ejemplo numérico demostrado | Impacto | Condición que lo dispara.

## Entrega
- Inventario de redondeos (T1)
- Clasificación por propósito (T2)
- Auditoría Math.ceil unidades discretas (T3)
- Error acumulativo (T4)
- Redondeo en producción (T5)
- Relación con fases previas (T6)
- Conteo por severidad
- NO VERIFICADO
- Máximo 1500 palabras
- DETENERSE. No avanzar a Fase 7.