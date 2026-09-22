# FASE 7 — COSTOS, IVA Y DESCUENTOS

## Reglas heredadas
- NO modificar código.
- NO asumir que una fórmula es correcta porque existe.
- Si no se puede demostrar, marcar NO VERIFICADO.
- Máximo 1500 palabras. Tablas > prosa.
- DETENERSE al terminar. No avanzar a Fase 8.

## Contexto heredado (25 hallazgos)
Fase 4 ya encontró:
- HAL-F4-01: compras no actualizan costoPromedio
- HAL-F4-02: hardcoding $3400 en costo WIP
- HAL-F4-03: fallback || 1 en rendimientoBase
- HAL-F4-04: base gravable ignorada en backend
- HAL-F4-05: IVA incluido en costo unitario (consolidado con F3-04)
- HAL-F4-06: redondeo IVA por línea (MEDIO)
- HAL-F4-07: 288 conversiones Number()

Fase 1-3 relevantes:
- HAL-F1-03: heurística costoUnitario > 100
- HAL-F3-04: costoUnidadBase sin validación
- HAL-F3-05: cantidadOz asume densidad 1.0

## Tareas

### T1. Inventario de fórmulas de costo
Localizar TODAS las implementaciones de:
- costoPromedio (CPP)
- costoUnidadBase
- costoTeorico
- costoReal
- costoUnitarioFabricacion
- utilidad / margen / markup
- desviación de costo

Para cada una: archivo | línea | fórmula literal | unidad | escala |
tipo (Decimal/Number) | redondeo | caso límite (0, negativo).

### T2. Auditoría de IVA y descuentos
Rastrear:
- precioIncluyeIva true: base = precio / (1 + tarifa)
- precioIncluyeIva false: base = precio; IVA = base * tarifa
- Descuentos: ¿se aplican antes o después del IVA?
- Orden: subtotal → descuento → base → IVA → total
- ¿Se redondea en cada paso o al final?
Ejemplo obligatorio:
  Producto $119.000 con IVA 19% incluido y descuento 10%
  ¿Cuál es el orden correcto?
  ¿Qué produce el sistema actual?

### T3. Costos teóricos vs reales
Auditar:
- costoTeorico = reqTeorico × costoUnitario
- costoReal = qtyReal × costoReal
- desviacion = costoReal - costoTeorico
- ¿Se usa el costo histórico del lote o el costo actual?
- Ejemplo: si el costo del insumo subió entre la planeación y la
  producción, ¿cuál se usa para calcular la desviación?

### T4. Margen y utilidad
Auditar:
- utilidadUnitaria = precioVenta - costoUnitario
- margen = utilidad / precioVenta
- ¿Se calcula sobre precio con o sin IVA?
- ¿Qué pasa si precioVenta < costoUnitario (margen negativo)?
- ¿Se permite vender con margen negativo?

### T5. Descuentos
Auditar:
- ¿Hay descuento por línea y descuento global?
- ¿Cómo interactúan?
- ¿Se aplica descuento al IVA o solo a la base?
- ¿Hay validación de descuento máximo (100%)?
- Ejemplo: descuento 100% → ¿total = 0 o total = IVA?

### T6. Relación con hallazgos previos
- HAL-F4-01: si no se actualiza CPP, ¿qué costo usa el sistema?
- HAL-F4-02: si el costo WIP cae a $3400, ¿cómo afecta el margen?
- HAL-F1-03: si el costo unitario se divide por 1000, ¿el margen
  explota?

## Formato de hallazgos
ID: HAL-F7-XX
Severidad | Archivo | Línea | Fórmula | Actual vs esperada |
Unidades | Escala | Redondeo | Ejemplo numérico |
Impacto | Condición que lo dispara.

## Entrega
- Inventario de fórmulas (T1)
- IVA y descuentos (T2)
- Costos teóricos vs reales (T3)
- Margen y utilidad (T4)
- Descuentos (T5)
- Relación con fases previas (T6)
- Conteo por severidad
- NO VERIFICADO
- Máximo 1500 palabras
- DETENERSE. No avanzar a Fase 8.