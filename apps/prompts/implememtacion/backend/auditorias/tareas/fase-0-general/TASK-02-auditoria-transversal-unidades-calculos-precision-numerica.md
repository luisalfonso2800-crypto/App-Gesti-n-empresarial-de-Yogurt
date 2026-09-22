# AUDITORÍA TÉCNICA FORENSE — MODO BAJO CONSUMO DE CUOTA

## 0. REGLAS DE EJECUCIÓN (OBLIGATORIAS)

- NO modificar código. NO refactorizar. NO proponer implementación todavía.
- NO asumir que una fórmula es correcta porque existe.
- NO asumir que Decimal garantiza precisión si luego se convierte a Number.
- Si algo no se puede demostrar con código/schema/DTO/test/config, marcarlo como:
  `NO VERIFICADO`
- NO rellenar vacíos con suposiciones.

### Control de consumo (crítico)
1. Antes de leer un archivo, decide si es estrictamente necesario. Si puedes responder
   con una búsqueda (grep/ripgrep) en lugar de leer el archivo completo, hazlo.
2. NO leas archivos completos si solo necesitas 20 líneas. Usa rangos.
3. NO indexes ni recorras: node_modules, dist, build, .next, coverage, migraciones
   históricas, archivos generados, lock files.
4. Trabaja SIEMPRE en modo asíncrono (Agent Manager), nunca en chat síncrono.
5. Al terminar cada fase: DETENTE y reporta. NO continúes a la siguiente fase por
   iniciativa propia. Espera instrucción explícita.
6. Limita cada informe de fase a 1500 palabras máximo. Usa tablas, no prosa.
7. Si una fase requiere más de 40 tool calls, detente y reporta progreso parcial.

## 1. OBJETIVO GENERAL

Auditar unidades, conversiones, compatibilidad dimensional, fórmulas de negocio,
precisión numérica, conversión Decimal↔Number, redondeos y acumulación de errores
en todo el sistema, con trazabilidad entre frontend, backend, Prisma y PostgreSQL.

Módulos a cubrir (en orden de prioridad si hay que cortar):
1. Inventario / Kardex
2. Compras / Costo promedio ponderado
3. Producción / Recetas / BOM / WIP
4. Ventas / IVA / Descuentos
5. Presentaciones / Conversión de unidades
6. Finanzas / Pagos / Cartera
7. Catálogos e insumos
8. Metas

## 2. FASES (EJECUTAR UNA POR VEZ)

### FASE 1 — Mapa de unidades
- Identificar todas las unidades reales en el código (no supuestas).
- Determinar cómo se interpreta `oz` (masa o volumen) con evidencia.
- Documentar unidad base / compra / inventario / receta / producción / lote /
  venta / presentación / despacho / costos.
- Salida: tabla `unidad | módulo | rol | archivo | línea`.

### FASE 2 — Compatibilidad dimensional
- Auditar `areUnitsCompatible` y equivalentes.
- Verificar que MASA / VOLUMEN / CONTEO estén separados.
- Buscar conversiones masa↔volumen y, si existen, localizar la densidad y su origen.
- Salida: matriz de compatibilidad + hallazgos.

### FASE 3 — Presentaciones
- Auditar `cantidadPresentacion`, `cantidadEquivalenteBase`, `cantidadOz`, `cantidadMl`.
- Verificar equivalencia 1 presentación = X unidad base en compra, inventario,
  producción, venta y costos.
- Salida: tabla de presentaciones con equivalencia real vs esperada.

### FASE 4 — Inventario de fórmulas
- Buscar operaciones matemáticas en +, -, *, /, %, Math.* en TS/JS/SQL/Prisma.
- Inventariar: stock, costo promedio ponderado, recetas, merma, producción,
  ventas, pagos, finanzas.
- Para cada fórmula: fórmula actual vs esperada, unidades, escala, redondeo,
  casos límite, división por cero, negativos, error acumulativo.
- Salida: inventario tabular (una fila por fórmula).

### FASE 5 — Decimal vs Number
- Inventariar Number(), parseFloat(), parseInt(), toFixed(), Math.*.
- Detectar cadenas Decimal → Number → cálculo → Decimal y Decimal → Number → JSON.
- Salida: tabla `archivo | línea | campo | origen | destino | motivo | riesgo`.

### FASE 6 — Redondeo y unidades discretas
- Clasificar redondeos: almacenamiento / cálculo / presentación / fiscal / físicas.
- Auditar Math.ceil() en UNIDAD, VASO, TAPA, ETIQUETA.
- Demostrar con ejemplo numérico el caso 14.2 tapas → 15 tapas y qué cantidad
  debe conservarse para BOM teórico, solicitado, físico, costo teórico,
  consumo real e inventario.
- Salida: tabla de redondeos + ejemplo demostrado.

### FASE 7 — Costos, IVA y descuentos
- Auditar que todo costo tenga unidad explícita ($/kg, $/g, $/L, $/ml, $/unidad).
- Auditar precioIncluyeIva true/false, base = precio/(1+IVA) vs IVA = base*tarifa.
- Verificar que subtotal + IVA - descuento no genere diferencias de centavos.
- Salida: fórmulas verificadas + contraejemplos numéricos si hay error.

### FASE 8 — Producción, recetas, WIP
- Auditar rendimientoBase, cantidadRequerida, Planificada, ProducidaReal,
  Teorica, RealUtilizada, mermaPorcentaje.
- Verificar escalamiento y caso rendimientoBase = 0.
- Auditar transferencia de costo/cantidad WIP → producto final.

### FASE 9 — Kardex, ventas y finanzas
- Verificar identidad stockNuevo = stockAnterior + entrada - salida por clase
  de movimiento y misma unidad de inventario.
- Auditar cantidad vendida vs descontada, precio por unidad base/comercial/
  presentación, utilidad unitaria y total.
- Auditar que ingreso/egreso/comprometido/pagado/pendiente sean consistentes
  y no se cuente dos veces una operación.

### FASE 10 — Schema Prisma y frontend vs backend
- Matriz `campo | tabla | tipo BD | escala | uso | riesgo`.
- Detectar inconsistencias entre Decimal(12,2), (12,4), (14,2), (5,2).
- Auditar si frontend convierte unidades, redondea, calcula subtotales/IVA/
  totales/costos/márgenes o transforma Decimal.
- Detectar discrepancias frontend calcula X / backend calcula Y.

### FASE 11 — Tests faltantes
- Listar tests existentes sobre unidades, conversiones, costos, producción,
  inventario, ventas, IVA, descuentos, precisión.
- Proponer casos faltantes SIN implementarlos.

## 3. CLASIFICACIÓN DE RIESGOS

Para cada hallazgo:
- CRÍTICO: información financiera/inventario/costos/producción/ventas incorrecta
  de forma material.
- ALTO: resultado incorrecto bajo condiciones reales determinadas.
- MEDIO: inconsistencia técnica que puede combinarse y generar error.
- BAJO: precisión/robustez/mantenibilidad con impacto limitado.

Formato obligatorio por hallazgo:
ID | Severidad | Módulo | Archivo | Línea | Campo | Problema | Valor/unidad |
Fórmula actual | Comportamiento esperado | Ejemplo numérico | Impacto |
Condición que lo dispara | Evidencia | Recomendación

## 4. REGLA DE EJEMPLOS NUMÉRICOS

No basta con "puede haber pérdida de precisión". Demostrar con entrada, conversión,
operación, resultado actual, resultado esperado y diferencia.
Si no se puede demostrar con los datos disponibles:
`RIESGO POTENCIAL — REQUIERE VERIFICACIÓN`

## 5. ENTREGA POR FASE

Cada fase entrega:
- Tabla de hallazgos (formato arriba)
- Conteo por severidad
- Lista de `NO VERIFICADO`
- Máximo 1500 palabras

Al terminar la fase: DETENERSE. No avanzar a la siguiente sin instrucción.