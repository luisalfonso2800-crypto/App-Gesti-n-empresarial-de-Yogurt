# FASE 4.5 — CIERRE DE FÓRMULAS Y CONSOLIDACIÓN

## Reglas
- NO modificar código.
- NO avanzar a Fase 5.
- Máximo 350 palabras. Solo tabla + aclaraciones.

## Tareas

### T1. Añadir ejemplo numérico a HAL-F4-04
Venta: 1 unidad a $10,500 COP, IVA 19% incluido.
Frontend envía { cantidad: 1, precioUnitario: 10500 } sin baseGravable.
Backend: baseGravable = 10500; IVA = 1995; total = 12495.
Esperado: base = 8823.53; IVA = 1676.47; total = 10500.
Diferencia: $1,995 (19% de sobrecobro).

### T2. Formalizar HAL-F4-07
Problema: Ausencia total de librería decimal (Decimal.js,
bignumber.js, big.js) en el proyecto.
Toda aritmética financiera se hace en IEEE 754 float64.
Causa raíz común de HAL-F1-03, HAL-F4-05, HAL-F4-06.
Severidad: CRÍTICO (arquitectónico).
Ejemplo: 0.1 + 0.2 = 0.30000000000000004.
Recomendación: instalar decimal.js o big.js y refactorizar
cálculos financieros.

### T3. Añadir nota a HAL-F4-06
"Este hallazgo asume HAL-F4-04 resuelto. En estado actual,
la combinación produce error del 19%, no ±$1 COP."

### T4. Consolidar HAL-F3-04 + HAL-F4-05
Ambos en supplier-prices.service.js L52. Son dos problemas
distintos en la misma línea: validación dimensional + IVA
incluido. Consolidar como hallazgo maestro con doble
recomendación.

### T5. Actualizar conteo
Fase 4: 4 CRÍTICOS + 2 ALTOS + 1 MEDIO = 7.
Acumulado: 13 CRÍTICOS + 9 ALTOS + 1 MEDIO = 23 (21 únicos).

## Entrega
- Tabla final Fase 4 con HAL-F4-01 a HAL-F4-07.
- Nota de consolidación F3-04/F4-05.
- Conteo actualizado.
- Máximo 350 palabras.
- DETENERSE. Listo para autorizar Fase 5.