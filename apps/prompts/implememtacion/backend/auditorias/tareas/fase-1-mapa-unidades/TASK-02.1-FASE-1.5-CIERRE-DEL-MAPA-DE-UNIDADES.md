# FASE 1.5 — CIERRE DEL MAPA DE UNIDADES

## Reglas
- NO modificar código.
- NO avanzar a Fase 2.
- Máximo 800 palabras. Usa tablas, no prosa.
- Antes de leer un archivo, decide si puedes responder con grep.
- Si algo no se puede demostrar, marcar `NO VERIFICADO`.

## Tareas

### T1. Reclasificar HAL-F1-01
Cambiar severidad de ALTO a CRÍTICO con justificación basada en la definición
del prompt: "inconsistencia estructural activa que produce resultados distintos
para el mismo input según qué módulo la consuma".

### T2. Ejemplo numérico demostrado para HAL-F1-01
Formato obligatorio:
- Entrada
- Conversión A (UnitConverter)
- Conversión B (unitNormalizer)
- Resultado actual
- Resultado esperado
- Diferencia absoluta y porcentual

### T3. Ejemplo numérico demostrado para HAL-F1-02
Formato obligatorio:
- Producto con presentación real
- Unidad de lote actual (código)
- Unidad de lote esperada
- Consecuencia en Kardex
- Inconsistencia dimensional

### T4. Mapa de consumidores de normalizadores
Grep (no lectura completa) para listar:
- Archivos que importan `unit-converter.js`
- Archivos que importan `unitNormalizer.js`
- Archivos con lógica ad-hoc de unidades (buscar patrones como
  `['Lt','Lts','Kg','Kgs']`, `unidadBase`, `.includes(`)
Salida: tabla `archivo | normalizador usado | módulo | riesgo`.

### T5. Roles de unidad faltantes
Completar o marcar explícitamente:
- unidad de venta
- unidad de despacho
- unidad de cálculo de costos
- unidad de inventario (diferenciada de base)
Para cada uno: `encontrada | no encontrada | requiere Fase X`.

### T6. Cierre de NO VERIFICADO
Listar los ítems de Fase 1 que quedan abiertos y condicionan Fase 2.

## Entrega
- Tabla de hallazgos actualizada (HAL-F1-01 reclasificado)
- Mapa de consumidores
- Roles faltantes
- NO VERIFICADO consolidado
- Máximo 800 palabras
- DETENERSE. No avanzar a Fase 2.