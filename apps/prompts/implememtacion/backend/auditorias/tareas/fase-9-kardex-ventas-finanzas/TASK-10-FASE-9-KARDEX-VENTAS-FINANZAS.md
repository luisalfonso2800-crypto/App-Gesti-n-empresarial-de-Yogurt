# FASE 9 — KARDEX, VENTAS Y FINANZAS

## Reglas heredadas
- NO modificar código.
- NO asumir que una función existe porque su nombre lo sugiere.
- Si no se puede demostrar, marcar NO VERIFICADO.
- Máximo 1800 palabras (fase amplia). Tablas > prosa.
- DETENERSE al terminar. No avanzar a Fase 10.

## Contexto heredado (32 hallazgos únicos)
Fase 1-2:
- HAL-F2-02: descuento stock sin normalizar + Math.max(0,...)
- HAL-F1-04: escalado compras ['Lt','Lts','Kg','Kgs']
- HAL-F1-03: heurística costoUnitario > 100

Fase 4:
- HAL-F4-01: compras no actualizan costoPromedio
- HAL-F4-08: Math.max(0,...) antipatrón contable
- HAL-F4-04: base gravable ignorada en backend

Fase 6-7:
- HAL-F6-03: redondeo en dashboards distorsiona agregados
- HAL-F7-01: margen sobre precio con IVA

## Tareas

### T1. Auditoría de Kardex
Inventario de todas las clases de movimiento:
- Compra
- Venta
- Producción (consumo)
- Producción (entrada producto terminado)
- Merma
- Descarte
- Ajuste
- Conversión
- Transferencia
Para cada clase: archivo | línea | fórmula | unidades |
¿respeta identidad stockNuevo = stockAnterior + entrada - salida?

Verificar que todas las clases usen la misma unidad de inventario.
Ejemplo: si compra ingresa kg y venta descuenta unidades, ¿cómo
se reconcilian?

### T2. Auditoría de ventas
Rastrear:
- cantidad vendida (en qué unidad)
- unidad de venta (¿base, comercial, presentación?)
- cantidad descontada del inventario
- precio unitario (¿en qué unidad?)
- costo unitario (¿de qué lote?)
- utilidad unitaria y total
- margen
Ejemplo:
  Venta de 1 "Caja × 12 und" de yogurt
  → ¿descuenta 1 caja o 12 unidades del stock?
  → ¿el precio es de caja o de unidad?
  → ¿el costo es de caja o de unidad?

### T3. Auditoría de pagos y cartera
- saldoPendiente
- valorPagado
- nuevoSaldo
- ¿Se maneja sobrepago?
- ¿Se maneja pago parcial?
- ¿Qué pasa si un cliente paga dos veces la misma factura?
Ejemplo:
  Venta $100,000
  Pago 1: $60,000 → saldo esperado $40,000
  Pago 2: $50,000 → saldo esperado -$10,000 (saldoAFavor $10,000)
  ¿Qué hace el sistema?

### T4. Auditoría financiera
- fondosDisponibles
- ingresos / egresos
- aportes
- metas empresariales
Verificar:
- ¿Se cuenta dos veces una operación?
- ¿Los ingresos incluyen ventas a crédito o solo cobradas?
- ¿Los egresos incluyen compras a crédito o solo pagadas?
- Ejemplo: venta $100,000 a crédito 30 días, aún no cobrada.
  ¿Aparece como ingreso? ¿Como cuenta por cobrar?

### T5. Auditoría de metas
- metasEmpresariales
- ¿Cómo se calcula el cumplimiento?
- ¿Se compara contra ventas facturadas o cobradas?
- ¿Se compara contra utilidad bruta o neta?

### T6. Relación con hallazgos previos
- HAL-F4-08: ¿cuántas veces aparece Math.max(0,...) en pagos?
- HAL-F4-04: ¿cómo afecta el saldo de cartera?
- HAL-F2-02: ¿el Kardex de ventas descuenta en unidad correcta?

## Formato de hallazgos
ID: HAL-F9-XX
Severidad | Archivo | Línea | Campo | Problema |
Fórmula actual vs esperada | Ejemplo numérico |
Impacto | Condición que lo dispara.

## Entrega
- Auditoría de Kardex por clase de movimiento (T1)
- Auditoría de ventas (T2)
- Auditoría de pagos y cartera (T3)
- Auditoría financiera (T4)
- Auditoría de metas (T5)
- Relación con fases previas (T6)
- Conteo por severidad
- NO VERIFICADO
- Máximo 1800 palabras
- DETENERSE. No avanzar a Fase 10.