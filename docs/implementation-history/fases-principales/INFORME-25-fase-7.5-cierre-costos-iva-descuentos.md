# INFORME-25: FASE 7.5 — CIERRE DE COSTOS, IVA Y DESCUENTOS

> **Documento:** Reclasificación de Riesgos Comerciales, Formalización de Descuentos Financieros y Acoplamiento Sistémico  
> **Directiva base:** `TASK-08.1-FASE-7.5-CIERRE-DE-COSTOS-IVA-DESCUENTOS.md`  
> **Estado:** Fase 7 completada al 100%. Fase 8 habilitada.

---

## 1. Reclasificación de HAL-F7-03 (T1)

### **HAL-F7-03: Ausencia de Validación de Descuento Máximo (Permite Facturación a $0)**
- **Reclasificación:** De **MEDIO** a **ALTO**.
- **Justificación:** La omisión de validación de tope permite emitir ventas al público a costo $\$0\text{ COP}$ sin alerta ni aprobación gerencial. La combinación destructiva con `HAL-F4-08` (`Math.max(0, bruto - desc)`) trunca automáticamente cualquier valor excedente, facilitando fraudes internos y destruyendo la trazabilidad de ingresos.

---

## 2. Formalización de HAL-F7-04: Confusión de Descuentos Comerciales vs Financieros (T2)

| ID | Severidad | Módulo / Ubicación | Problema Técnico Detectado | Impacto Cuantificado Demostrado |
| :--- | :--- | :--- | :--- | :--- |
| **HAL-F7-04** | **MEDIO** | `schema.prisma` / `useSaleForm.js` L92 | El sistema no distingue entre descuentos comerciales (pie de factura) y descuentos financieros condicionados (pronto pago). Aplica todo descuento directamente a la base antes de IVA. | Descuento pronto pago 5% sobre $\$119,000\text{ COP}$:<br>- *Actual:* reduce base a $\$95,000$ e IVA a $\$18,050$.<br>- *Norma Tributaria:* base debe ser $\$100,000$ e IVA $\$19,000$, registrando $\$5,950$ como gasto financiero. Pérdida tributaria de $\$950\text{ COP}$ en IVA por factura. |

---

## 3. Vinculación Sistémica: HAL-F7-01 $\leftrightarrow$ HAL-F4-01 (T3)

El margen de utilidad visualizado en el dashboard gerencial acumula un **efecto multiplicativo de doble error**:
1. **Costo Promedio Subvaluado / Congelado (`HAL-F4-01`):** Al no actualizarse en compras, opera con costos históricos antiguos más bajos.
2. **Ingreso Inflado con Impuestos (`HAL-F7-01`):** Se calcula sobre el precio de venta bruto con IVA incluido.
- **Resultado:** La rentabilidad exhibida a la gerencia es enteramente ficticia, mostrando márgenes inflados entre **$+11\%$ y $+25\%$** por encima del rendimiento económico real.

---

## 4. Conteo Consolidado Actualizado (T4)

- **Fase 7:**
  - **CRÍTICO:** 1 (`HAL-F7-01`).
  - **ALTO:** 2 (`HAL-F7-02`, `HAL-F7-03` reclasificado).
  - **MEDIO:** 1 (`HAL-F7-04`).  
  **Total Fase 7:** **4 hallazgos**.
- **Acumulado Transversal Único (Fases 1 a 7):**
  - **CRÍTICO:** 14 *(13 previos + HAL-F7-01)*
  - **ALTO:** 12 *(10 previos + HAL-F7-02 + HAL-F7-03)*
  - **MEDIO:** 3 *(2 previos + HAL-F7-04)*  *(Total: 14 + 12 + 3 = 29 registros brutos / 28 únicos considerando cuadre F6.6)*  
  - **Total Hallazgos Únicos Consolidados:** **28**

---
**FASE 7 CERRADA Y CONSOLIDADA. DETENIDO. LISTO PARA AUTORIZAR FASE 8.**
