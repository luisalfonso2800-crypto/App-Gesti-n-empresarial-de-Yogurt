# INFORME-20: FASE 5.5 — CONSOLIDACIÓN DE HALLAZGOS DECIMAL VS NUMBER

> **Documento:** Consolidación Estructural de Precisión Decimal, Sub-ítems Materializados y Conteo Definitivo  
> **Directiva base:** `TASK-06.1-FASE-5.5-CONSOLIDACION-DECIMAL-VS-NUMBER.md`  
> **Estado:** Fase 5 cerrada formalmente. Fase 6 habilitada.

---

## 1. Reformulación Estructural de HAL-F4-07 (T1)

Se absorben `HAL-F5-01`, `HAL-F5-02` y `HAL-F5-04` como instancias de manifestación física dentro del hallazgo arquitectónico raíz:

### **HAL-F4-07 (CRÍTICO Arquitectónico): Degradación Sistemática Decimal $\to$ Number**
Prisma recupera `@db.Decimal` nativos pero el código los degrada a `IEEE 754 float64` antes de operar.
- **Instancias Verificadas en Código:**
  1. `production.repository.js` L732-739: Deducción de stock en Kardex de insumos.
  2. `inventory.repository.js` L150-164: Liquidación de Costo Promedio Ponderado (CPP).
  3. `sales.repository.js` L127-132: Deducción de stock en Kardex de producto terminado.
  4. `production.repository.js` L1027-1039: Valuación ponderada de lotes intermedios WIP.
  5. `payments.repository.js` L54-59: Liquidación de saldo pendiente en cartera.
  6. **288 conversiones** `Number()` dispersas en servicios y repositorios del backend.

---

## 2. Hallazgo Independiente Mantenido: HAL-F5-03 (T2)

| ID | Severidad | Módulo / Ubicación | Problema Técnico | Impacto Cuantificado |
| :--- | :--- | :--- | :--- | :--- |
| **HAL-F5-03** | **ALTO** | `useSaleForm.js` L120 vs `sales.repository.js` | Cuádruple casteo y redondeo cruzado Frontend $\leftrightarrow$ Backend (BD Decimal $\to$ JSON $\to$ Web Number $\to$ Backend Number). | Desfase de centavos en base imponible de facturas con IVA incluido frente a la DIAN. |

---

## 3. Aclaración de Serialización Prisma $\to$ JSON (T3)

- **Configuración Detectada:** `@prisma/client` versión `^7.10.0` sobre Node.js/Express.
- **Comportamiento Técnico:** Prisma `Decimal` implementa `.toJSON()`, el cual por especificación oficial de Prisma retorna un **`string`** (ej. `"10500.00"`) para evitar desbordamiento float64 en el transporte HTTP.
- **Diagnóstico:** El frontend recibe un string que inmediatamente coerciona a float64 con `Number()` o `Math.round()`, activando la degradación fuera de la base de datos.

---

## 4. Cuantificación y Desglose de las 288 Conversiones (T4)

- **Cálculos Financieros y de Stock (CRÍTICAS / ALTO RIESGO):** ~**195 (68%)** en sumas de kardex, subtotales, IVA, liquidación de costos y factores de merma.
- **DTOs y Mapeos de Salida (MEDIO / BAJO RIESGO):** ~**65 (22%)** en endpoints REST para serializar a cliente.
- **Logging, Validaciones y Timestamps (INOCUAS):** ~**28 (10%)** en identificadores o comparaciones de fechas.

---

## 5. Conteo Consolidado Actualizado (T5)

- **Fase 5:**
  - **CRÍTICO:** 0 nuevos (se absorben como instancias de `HAL-F4-07`).
  - **ALTO:** 1 nuevo (`HAL-F5-03`).
- **Acumulado Transversal Único (Fases 1 a 5):**
  - **CRÍTICO:** 13
  - **ALTO:** 9 *(8 previos + HAL-F5-03)*
  - **MEDIO:** 1
  - **Total:** **23 hallazgos únicos consolidados**.

---
**FASE 5 COMPLETADA AL 100%. DETENIDO SEGÚN REGLA. LISTO PARA AUTORIZAR FASE 6.**
