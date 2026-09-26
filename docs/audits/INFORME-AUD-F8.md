# INFORME DE AUDITORÍA FRONTEND DELTA — FASE F8: FORMATO DE NÚMEROS, FECHAS Y UNIDADES

> **Fecha:** 2026-09-22  
> **Ámbito:** Frontend (`apps/web/src`) — Evaluación de la capa de serialización, formateo monetario COP, parseo de strings Decimal y representación en pantallas de planta.  
> **Estado:** ✅ FASE F8 COMPLETADA

---

## 1. Diagnóstico del Formateador Canónico (`formatters.js`)

Se auditó el comportamiento de `formatCurrency`, `cleanCurrency`, `onlyNumbers` y `numberToWordsSpanish`:
- **Redondeo Forzado a Entero:**  
  `formatCurrency` ejecuta: `const numeric = Math.round(Number(val) || 0)`.
  - **Alineación con Moneda Colombiana:** En Colombia (COP), la moneda comercial no circula con centavos en efectivo. El redondeo a entero es la convención legal para totales de facturación y recibos de caja.
  - **Vulnerabilidad en Costos Unitarios Micro:** Si se pasa un costo unitario de insumo con 4 decimales (`HAL-F10-03`, ej: `$18.4523` por gramo de cultivo), `formatCurrency` lo renderiza como `$18 COP`, ocultando la precisión decimal que el backend sí persiste.
- **Limpieza de Strings Monetarios (`cleanCurrency`):**  
  `String(str).replace(/\D/g, '')`. Elimina todo punto o coma. Si el usuario tipea `1500.50`, el método lo convierte a `150050` (multiplicación por 100 catastrófica si el input tenía separador decimal). Por diseño de `CurrencySmartInput`, este componente solo acepta enteros de COP.

---

## 2. Parseo de Strings Decimales Provenientes de Prisma

El backend remediado envía campos numéricos serializados desde `Decimal.js` (ej: `"1500.3333"`, `"0.19"`, `"120.00"`).
- **Mapeo en Hooks:**  
  En `useSaleForm.js`, `useProductionPageData.js` y `useExpensesPageData.js`:
  - Se utiliza `Number(val || 0)` o `parseFloat(val)`.
  - **Evaluación:** **Conforme para lectura:** JavaScript convierte strings numéricos `"1500.33"` a flotantes válidos de doble precisión para renderizar en pantalla sin NaN.
  - **Riesgo:** Si un valor Decimal supera la precisión segura de entero `Number.MAX_SAFE_INTEGER` (no aplica en las escalas del negocio lácteo).

---

## 3. Matriz de Formato y Presentación en Componentes UI

| Dato / Magnitud | Componente / Helper | Formato Aplicado | Estado | Observación Técnica |
| :--- | :--- | :--- | :---: | :--- |
| **Totales de Venta / Facturas** | `formatCurrency` | `$ 1.250.000` (Entero sin decimales) | ✅ **CONFORME** | Cumple norma contable COP y legibilidad visual. |
| **Costos Unitarios de Insumos** | Tablas de Insumos y Recetas | `formatCurrency` | ⚠️ **INCOMPLETO** | Trunca micro-costos (ej: $18.4523 -> $18). Requiere formateador con 2-4 decimales para costos unitarios (`formatUnitCost`). |
| **Fechas de Vencimiento / Producción** | `toLocaleDateString()` / `toISOString` | `DD/MM/YYYY` o `YYYY-MM-DD` | ✅ **CONFORME** | Desacoplado de horas; previene desfasaje de huso horario UTC vs COT (`America/Bogota`). |
| **Porcentajes de IVA / Merma** | Inputs directos (`step="0.1"`) | `19%`, `2.5%` | ✅ **CONFORME** | Permite decimales para mermas fraccionarias. |
| **Traducción Número a Letras** | `numberToWordsSpanish` | `"Ciento cincuenta mil pesos M/CTE"` | ✅ **CONFORME** | Utilizado en comprobantes de impresión de ventas y recibos de pago. |

---

## 4. Conclusiones y Recomendaciones de la Fase F8

1. **Crear helper específico para costos unitarios (`formatUnitCost`):** En `apps/web/src/lib/formatters.js`, crear una función que permita visualizar hasta 4 decimales cuando el valor sea menor a $100 COP o contenga decimales significativos (ej: `$18.4523/g`).
2. **Proteger `cleanCurrency` frente a copiado y pegado con decimales:** Asegurar que si el usuario pega `$1.500,50`, no se interprete como `$150.050`.
