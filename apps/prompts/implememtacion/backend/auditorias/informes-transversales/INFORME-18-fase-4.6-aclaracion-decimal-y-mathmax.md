# INFORME-18: FASE 4.6 — ACLARACIÓN DE DECIMAL Y PATRÓN MATH.MAX

> **Documento:** Reformulación Arquitectónica de Decimal, Formalización del Patrón Math.max y Cuadre de Conteo  
> **Directiva base:** `TASK-05.2-FASE-4.6-ACLARACION-DECIMAL-Y-MATHMAX.md`  
> **Estado:** Fase 4 cerrada formalmente. Fase 5 habilitada.

---

## 1. Reformulación Arquitectónica de HAL-F4-07 (T1)

- **Diagnóstico Preciso:** PostgreSQL y Prisma **SÍ** almacenan como `Decimal` (`@db.Decimal`). La causa raíz **NO** es la ausencia de Decimal en base de datos, sino la **conversión sistemática y prematura con `Number()` o `parseFloat()` antes de cualquier operación aritmética**, degradando la precisión a `IEEE 754 float64`.
- **Estrategia de Mitigación en Dos Capas:**
  1. *Corto plazo:* Explotar la API nativa de `Prisma.Decimal` (`.plus()`, `.minus()`, `.times()`, `.dividedBy()`) directamente en el código de backend sin invocar `Number()`.
  2. *Mediano plazo:* Incorporar `decimal.js` / `big.js` para cálculos complejos en capas desacopladas de Prisma.
- **Severidad:** **CRÍTICO** *(Defecto Arquitectónico Estructural)*.

---

## 2. Formalización de HAL-F4-08: Patrón Destructivo `Math.max(0, ...)` (T2)

- **Severidad:** **ALTO** *(Transversal a Cartera, Pagos, Inventario y Producción)*.
- **Evidencia en Código:** `production.repository.js` (L735, L790, L832), `sales.repository.js` (L128), `payments.repository.js` (L55) e `inventory.repository.js`.
- **Mecanismo de Falla:** Forzar `Math.max(0, ...)` destruye silenciosamente los saldos negativos que sirven como alarmas de auditoría contable y gravimétrica.
- **Ejemplo Demostrado:**
  - Venta de $\$10,000\text{ COP}$. El cliente abona $\$12,000\text{ COP}$.
  - *Actual:* `Math.max(0, 10000 - 12000) = 0`. El sobrepago de $\$2,000\text{ COP}$ se pierde en el limbo financiero.
  - *Esperado:* `saldo = 0`, registrando `saldoAFavor = $2,000 COP` en la cartera del cliente.

---

## 3. Conteo Corregido y Consolidado (T3)

- **Registros Brutos:** 13 CRÍTICOS + 10 ALTOS + 1 MEDIO = 24.
- **Consolidaciones Formales:**
  1. `HAL-F1-02` (ALTO) absorbido por `HAL-F3-02` (CRÍTICO) $\to$ resta 1 ALTO.
  2. `HAL-F3-04` (ALTO) unificado con `HAL-F4-05` (ALTO) $\to$ resta 1 ALTO.
- **Total Hallazgos Únicos Consolidados (Fases 1 a 4):**
  - **CRÍTICO:** 13
  - **ALTO:** 8 *(7 previos + HAL-F4-08)*
  - **MEDIO:** 1
  - **Total:** **22 hallazgos únicos consolidados**

---
**FASE 4 TOTALMENTE FINALIZADA. DETENIDO SEGÚN REGLA. LISTO PARA FASE 5.**
