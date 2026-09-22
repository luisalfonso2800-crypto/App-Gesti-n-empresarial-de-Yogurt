# INFORME-23: FASE 6.6 — CUADRE DE CONTEO Y NOMENCLATURA

> **Documento:** Auditoría Forense de Trazabilidad, Nomenclatura de Fusiones y Cuadre Definitivo (Fases 1 a 6)  
> **Directiva base:** `TASK-07.2-FASE-6.6-CUADRE-CONTEO-Y-NOMENCLATURA.md`  
> **Estado:** Fases 1 a 6 cerradas al 100%. Fase 7 habilitada.

---

## 1. Nomenclatura Formal de Hallazgos Consolidados (T2)

Para preservar la trazabilidad forense sin generar IDs artificiales:
- **`HAL-F1-02` (ALTO) + `HAL-F3-02` (CRÍTICO):** Sobrevive como **`HAL-F3-02`** (ID Maestro de Causa Raíz: falta de propagación de `unidadMedida`, subsumiendo el síntoma de hardcoding en producción).
- **`HAL-F3-04` (ALTO) + `HAL-F4-05` (ALTO):** Sobrevive como **`HAL-F3-04`** (ID Maestro de Tarifa Proveedor en `supplier-prices.service.js` L52: validación dimensional e IVA incluido).

---

## 2. Lista Explícita y Verificada de Hallazgos Únicos (T1, T3)

### **CRÍTICOS (13):**
1. `HAL-F1-01`: Dualidad conversor `oz` (Frontend 1x vs Backend 29.57x).
2. `HAL-F1-03`: Heurística `costoUnitario > 100` divide por 1000 en unidades pequeñas.
3. `HAL-F1-04`: Escalado compras case-sensitive `['Lt','Lts','Kg','Kgs']` omite `Litros`/`Kilogramos`.
4. `HAL-F1-06`: `areUnitsCompatible('oz','ml')` retorna `false`.
5. `HAL-F2-01`: `areUnitsCompatible` rechaza escalas válidas de la misma magnitud (`kg`/`g`, `l`/`ml`).
6. `HAL-F2-02`: Descuento de stock en Kardex sin normalizar unidad.
7. `HAL-F2-04`: `recipes.service.js` L270 rechaza empaques nominales (`VASO`/`TAPA`/`ETIQUETA`).
8. `HAL-F3-02`: Desconexión de `Presentacion.unidadMedida` hacia lote de producción.
9. `HAL-F3-03`: Inyección forzada de 1000 ml / 33.8 oz en tanques/baldes granel.
10. `HAL-F4-01`: Compras incrementa stock físico pero no recalcula ni actualiza `costoPromedio`.
11. `HAL-F4-02`: Fallback hardcodeado a $3,400 COP en costo de WIP si $\le 0$ o $>50000$.
12. `HAL-F4-03`: Fallback `|| 1` ante `rendimientoBase = 0` genera explosión de materiales.
13. `HAL-F4-07`: Degradación arquitectónica sistemática `Decimal` $\to$ `Number()` (288 ocurrencias).

### **ALTOS (10):**
1. `HAL-F1-05`: Tercer normalizador local (`extractCanonicalUnit`) fragmentado.
2. `HAL-F2-03`: Asume equivalencia $1\text{ L} = 1000\text{ g}$ sin densidad en producto lácteo (error 3.2%).
3. `HAL-F2-05`: Unidad `mg` omitida transversalmente en clasificadores frontend y backend.
4. `HAL-F3-01`: Sobreescribe `cantidadPresentacion = 1` en recepción de compras.
5. `HAL-F3-04`: Cálculo de `costoUnidadBase` sin validación dimensional e incluyendo IVA.
6. `HAL-F3-05`: `cantidadOz` asume densidad $1.0\text{ g/ml}$ en presentaciones de masa.
7. `HAL-F4-04`: Backend toma `cantidad * precioUnitario` como base gravable si omite campo.
8. `HAL-F4-08`: Antipatrón `Math.max(0, ...)` oculta saldos negativos y destruye evidencia.
9. `HAL-F5-03`: Cuádruple casteo cruzado Frontend $\leftrightarrow$ Backend (BD Decimal $\to$ JSON string $\to$ Web Number $\to$ Backend Number).
10. `HAL-F6-01`: `Math.ceil` destruye la cantidad teórica de formulación en órdenes de producción.

### **MEDIOS (2):**
1. `HAL-F4-06`: Redondeo de IVA línea a línea con `Math.round` en frontend.
2. `HAL-F6-03`: Redondeo de filas en dashboards analíticos que distorsiona los totales agregados.

---

## 3. Conteo Final Certificado (Fases 1 a 6)
- **CRÍTICO:** 13
- **ALTO:** 10
- **MEDIO:** 2  
**Total Hallazgos Únicos Consolidados:** **25**

---
**CONTEO CUADRADO Y TRAZABILIDAD CERTIFICADA. DETENIDO. LISTO PARA FASE 7.**
