# FASE 4.6 — ACLARACIÓN DE DECIMAL Y PATRÓN MATH.MAX

## Reglas
- NO modificar código.
- NO avanzar a Fase 5.
- Máximo 250 palabras.

## Tareas

### T1. Aclarar HAL-F4-07
Reformular:
- La BD SÍ usa Decimal (Prisma @db.Decimal).
- El problema NO es ausencia de Decimal, es conversión sistemática
  a Number() antes de operar.
- La ausencia de decimal.js agrava el problema pero no es la causa raíz.
Recomendación de fix en dos capas:
1. Corto plazo: usar .plus(), .times(), etc. de Prisma.Decimal sin
   convertir a Number.
2. Mediano plazo: instalar decimal.js para operaciones entre Decimals
   que no pasan por Prisma.
Mantener severidad CRÍTICO (arquitectónico).

### T2. Formalizar HAL-F4-08
Problema: uso sistemático de Math.max(0, ...) en cálculos financieros
oculta saldos negativos y destruye evidencia.
Ocurrencias:
- production.repository.js L735, L790, L832
- inventory.repository.js
- sales.repository.js L128
- payments.repository.js L55
Ejemplo:
  Cliente paga $12,000 por venta de $10,000.
  Actual: Math.max(0, 10000 - 12000) = 0. Sobrepago perdido.
  Esperado: saldo = 0, saldoAFavor = 2000.
Severidad: ALTO.
Módulo: transversal (cartera, pagos, inventario, producción).

### T3. Corregir conteo consolidado
Registros brutos: 13 CRÍTICOS + 9 ALTOS + 1 MEDIO = 23.
Consolidaciones:
- F1-02 (ALTO) + F3-02 (CRÍTICO) → 1 CRÍTICO → resta 1 ALTO.
- F3-04 (ALTO) + F4-05 (ALTO) → 1 ALTO → resta 1 ALTO.
Conteo consolidado: 13 CRÍTICOS + 7 ALTOS + 1 MEDIO = 21.
(Verificar si HAL-F4-08 añade 1 ALTO → 22 únicos.)

## Entrega
- Reformulación HAL-F4-07.
- HAL-F4-08 formalizado.
- Conteo corregido.
- Máximo 250 palabras.
- DETENERSE. Listo para autorizar Fase 5.