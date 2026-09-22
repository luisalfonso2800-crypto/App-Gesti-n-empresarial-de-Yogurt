# FASE 1.6 — CIERRE DEFINITIVO DE HALLAZGOS DE UNIDADES

## Reglas
- NO modificar código.
- NO avanzar a Fase 2.
- Máximo 500 palabras. Solo actualizar tabla y conteo.
- Antes de leer archivo, intenta con grep.
- Si algo no se puede demostrar, marcar NO VERIFICADO.

## Tareas

### T1. Formalizar HAL-F1-03 (inventory.service.js)
- Añadir a tabla de hallazgos con severidad CRÍTICO.
- Campo: costoUnitario / unidad.
- Fórmula actual: `if (costoUnitario > 100) costoUnitario /= 1000;`
- Ejemplo numérico demostrado con al menos dos unidades distintas
  (kg vs g) mostrando el resultado actual y el esperado.
- Mencionar como agravante que el archivo importa UnitConverter y no lo usa.

### T2. Formalizar HAL-F1-04 (purchases.repository.js L173)
- Añadir a tabla de hallazgos con severidad CRÍTICO.
- Fórmula actual: `if (['Lt','Lts','Kg','Kgs'].includes(unidadBase)) cantidad *= 1000;`
- Ejemplo numérico: mismo insumo con 'kg', 'Kg', 'kilo', 'L' mostrando
  cuáles escalan y cuáles no.
- Impacto: inconsistencia de inventario según string exacto de unidad.

### T3. Verificar consumidores reales de unitNormalizer.js
- grep en apps/api, apps/web, tests, seeds, scripts.
- Resultado: lista de consumidores o "ninguno".
- Si no hay consumidores: reclasificar HAL-F1-01 a ALTO (riesgo latente).
- Si hay al menos uno: mantener CRÍTICO y listar consumidor.

### T4. Intentar cerrar los dos NO VERIFICADO
- Buscar en schema.prisma si existe campo de unidad con default 'oz'.
- Buscar en seeds si algún insumo tiene unidadBase = 'oz'.
- Si no se puede desde código: dejar marcado como
  "requiere consulta a BD de producción".

### T5. Actualizar conteo por severidad y entregar tabla final.

## Entrega
- Tabla de hallazgos final Fase 1 (con HAL-F1-01 a HAL-F1-04).
- Conteo por severidad.
- NO VERIFICADO consolidado.
- Máximo 500 palabras.
- DETENERSE. No avanzar a Fase 2.