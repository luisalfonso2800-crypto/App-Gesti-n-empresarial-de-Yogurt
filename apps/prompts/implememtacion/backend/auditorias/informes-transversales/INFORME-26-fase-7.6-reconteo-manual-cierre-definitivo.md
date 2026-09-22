# INFORME-26: FASE 7.6 — RECONTEO MANUAL Y CIERRE DEFINITIVO

> **Documento:** Auditoría Forense de Conteo Manual, Nomenclatura de Fusiones y Cierre Oficial (Fases 1 a 7)  
> **Directiva base:** `TASK-08.2-FASE-7.6-RECONTEO-MANUAL-Y-CIERRE-DEFINITIVO.md`  
> **Estado:** Fases 1 a 7 certificadas. Fase 8 habilitada.

---

## 1. Lista Explícita de CRÍTICOS (14)

1. `HAL-F1-01`: Dualidad conversor `oz` (Frontend 1x vs Backend 29.57x).
2. `HAL-F1-03`: Heurística `costoUnitario > 100` divide por 1000 en unidades pequeñas.
3. `HAL-F1-04`: Escalado compras case-sensitive `['Lt','Lts','Kg','Kgs']` omite `Litros`/`Kilogramos`.
4. `HAL-F1-06`: `areUnitsCompatible('oz','ml')` retorna `false`.
5. `HAL-F2-01`: `areUnitsCompatible` rechaza escalas válidas de la misma magnitud física.
6. `HAL-F2-02`: Descuento de stock en Kardex sin normalizar unidad.
7. `HAL-F2-04`: `recipes.service.js` L270 rechaza empaques nominales (`VASO`/`TAPA`/`ETIQUETA`).
8. `HAL-F3-02`: Desconexión de `Presentacion.unidadMedida` hacia lote de producción.
9. `HAL-F3-03`: Inyección forzada de 1000 ml / 33.8 oz en tanques/baldes granel.
10. `HAL-F4-01`: Compras no recalcula ni actualiza `costoPromedio` en inventario.
11. `HAL-F4-02`: Fallback hardcodeado a $3,400 COP en costo de WIP si $\le 0$ o $>50000$.
12. `HAL-F4-03`: Fallback `|| 1` ante `rendimientoBase = 0` genera explosión de materiales.
13. `HAL-F4-07`: Degradación arquitectónica sistemática `Decimal` $\to$ `Number()` (288 ocurrencias).
14. `HAL-F7-01`: Margen operativo en dashboard calculado sobre precio de venta con IVA.  
**Total CRÍTICOS = 14**

---

## 2. Lista Explícita de ALTOS (12)

1. `HAL-F1-05`: Tercer normalizador local (`extractCanonicalUnit`) fragmentado.
2. `HAL-F2-03`: Asume equivalencia $1\text{ L} = 1000\text{ g}$ sin densidad en producto lácteo (error 3.2%).
3. `HAL-F2-05`: Unidad `mg` omitida transversalmente en clasificadores frontend y backend.
4. `HAL-F3-01`: Sobreescribe `cantidadPresentacion = 1` en recepción de compras.
5. `HAL-F3-04`: Cálculo de `costoUnidadBase` sin validación dimensional e incluyendo IVA.
6. `HAL-F3-05`: `cantidadOz` asume densidad $1.0\text{ g/ml}$ en presentaciones de masa.
7. `HAL-F4-04`: Backend toma `cantidad * precioUnitario` como base gravable si omite campo.
8. `HAL-F4-08`: Antipatrón `Math.max(0, ...)` oculta saldos negativos y destruye evidencia.
9. `HAL-F5-03`: Cuádruple casteo cruzado Frontend $\leftrightarrow$ Backend (Decimal $\to$ JSON $\to$ Web Number $\to$ Backend Number).
10. `HAL-F6-01`: `Math.ceil` destruye la cantidad teórica de formulación en órdenes de producción.
11. `HAL-F7-02`: Liquidación de consumo real contra `costoPromedio` instantáneo en vez del histórico de lote.
12. `HAL-F7-03`: Inexistencia de validación de descuento máximo (permite facturar a $\$0\text{ COP}$).  
**Total ALTOS = 12**

---

## 3. Lista Explícita de MEDIOS (3)

1. `HAL-F4-06`: Redondeo de IVA línea a línea con `Math.round` en frontend.
2. `HAL-F6-03`: Redondeo de filas en dashboards analíticos que distorsiona los totales agregados.
3. `HAL-F7-04`: Confusión entre descuentos comerciales y financieros condicionados antes de IVA.  
**Total MEDIOS = 3**

---

## 4. Consolidaciones Formales y Verificación (T4, T5)

- `HAL-F1-02` (ALTO) $\to$ Absorbido por `HAL-F3-02` (CRÍTICO).
- `HAL-F4-05` (ALTO) $\to$ Unificado con `HAL-F3-04` (ALTO).

### Ecuación de Cierre Definitivo:
- Total registros brutos documentados: $14\text{ (CRÍTICOS)} + 14\text{ (ALTOS)} + 3\text{ (MEDIOS)} = 31$
- Menos 2 registros absorbidos por consolidación: $-2$
- **Total Únicos Reales:** $14\text{ CRÍTICOS} + 12\text{ ALTOS} + 3\text{ MEDIOS} = \mathbf{29}$

---
**CONTEO FINAL OFICIAL DECLARADO: 29 HALLAZGOS ÚNICOS CONSOLIDADOS. DETENIDO. LISTO PARA FASE 8.**
