# INFORME-36: FASE 11.6 — RECONCILIACIÓN FINAL DEL LIBRO MAYOR DE AUDITORÍA

## 1. Reconciliación de IDs y Severidades (T1, T3)
Se cotejó el inventario del libro mayor de auditoría contra las certificaciones oficiales de las Fases 7.6 (`INFORME-26`), 8.5 (`INFORME-28`), 9.5 (`INFORME-30`) y 10.6 (`INFORME-33`), restaurando las descripciones y severidades originales:

### A. Los 19 Hallazgos CRÍTICOS Oficiales
1. `HAL-F1-01`: Dualidad conversor `oz` (Frontend 1x vs Backend 29.57x).
2. `HAL-F1-03`: Heurística `costoUnitario > 100` divide por 1000 en unidades pequeñas.
3. `HAL-F1-04`: Escalado compras case-sensitive `['Lt','Lts','Kg','Kgs']` omite `Litros`/`Kilogramos`.
4. `HAL-F1-06`: `areUnitsCompatible('oz','ml')` retorna `false`.
5. `HAL-F2-01`: `areUnitsCompatible` rechaza escalas válidas de la misma magnitud física.
6. `HAL-F2-02`: Descuento de stock en Kardex sin normalizar unidad.
7. `HAL-F2-04`: `recipes.service.js` rechaza empaques nominales (`VASO`/`TAPA`/`ETIQUETA`).
8. `HAL-F3-02`: Desconexión de `Presentacion.unidadMedida` hacia lote de producción.
9. `HAL-F3-03`: Inyección forzada de 1000 ml / 33.8 oz en tanques/baldes granel.
10. `HAL-F4-01`: Compras no recalcula ni actualiza `costoPromedio` en inventario.
11. `HAL-F4-02`: Fallback hardcodeado a $3,400 COP en costo de WIP si $\le 0$ o $>50000$.
12. `HAL-F4-03`: Fallback `|| 1` ante `rendimientoBase = 0` genera explosión de materiales.
13. `HAL-F4-07`: Degradación arquitectónica sistemática `Decimal` $\to$ `Number()` (288 llamadas).
14. `HAL-F7-01`: Margen operativo en dashboard calculado sobre precio de venta con IVA.
15. `HAL-F8-01`: Factor 1000x en costo de WIP consumido en ml con precio por litro.
16. `HAL-F9-01`: Excepción runtime por consulta de campo inexistente `cantidadProducida`.
17. `HAL-F9-02`: Utilidad neta gerencial devengada sin recaudar computada como liquidez.
18. `HAL-F10-01`: DTOs transaccionales vacíos sin validación de esquema `class-validator`.
19. `HAL-F10-02`: Backend persiste totales provistos por el cliente sin recálculo server-side.

### B. Los 17 Hallazgos ALTOS Oficiales
1. `HAL-F1-05`: Tercer normalizador local (`extractCanonicalUnit`) fragmentado.
2. `HAL-F2-03`: Asume equivalencia $1\text{ L} = 1000\text{ g}$ sin densidad en producto lácteo (error 3.2%).
3. `HAL-F2-05`: Unidad `mg` omitida transversalmente en clasificadores frontend y backend.
4. `HAL-F3-01`: Sobreescribe `cantidadPresentacion = 1` en recepción de compras.
5. `HAL-F3-04`: Cálculo de `costoUnidadBase` sin validación dimensional e incluyendo IVA.
6. `HAL-F3-05`: `cantidadOz` asume densidad $1.0\text{ g/ml}$ en presentaciones de masa.
7. `HAL-F4-04`: Backend toma `cantidad * precioUnitario` como base gravable si omite campo.
8. `HAL-F4-08`: Antipatrón `Math.max(0, ...)` oculta saldos negativos y destruye evidencia.
9. `HAL-F5-03`: Cuádruple casteo cruzado Frontend $\leftrightarrow$ Backend (Decimal $\to$ JSON $\to$ Number).
10. `HAL-F6-01`: `Math.ceil` destruye cantidad teórica en formulación de órdenes de producción.
11. `HAL-F7-02`: Liquidación de consumo real contra `costoPromedio` instantáneo y no de lote.
12. `HAL-F7-03`: Inexistencia de validación de descuento máximo (permite facturar a $0 COP).
13. `HAL-F8-02`: Omite validación de rango físico en merma ($0 \le m < 100$).
14. `HAL-F8-04`: Polimorfismo sin unidad en recetas multipropósito.
15. `HAL-F9-03`: Ausencia de `stockAnterior` y `stockNuevo` en Kardex (riesgo sancionatorio DIAN).
16. `HAL-F9-04`: Bloqueo de cobros mayores al saldo sin soporte de anticipo o notas a favor.
17. `HAL-F10-03`: Escala `@db.Decimal(12, 2)` insuficiente en costos unitarios base.

### C. Los 3 Hallazgos MEDIOS Oficiales
1. `HAL-F4-06`: Redondeo de IVA línea a línea con `Math.round` en frontend.
2. `HAL-F6-03`: Redondeo de filas en dashboards analíticos que distorsiona totales agregados.
3. `HAL-F7-04`: Confusión entre descuentos comerciales y financieros condicionados antes de IVA.

---

## 2. Decisión sobre HAL-F10-04, HAL-F10-05 y HAL-F10-06 (T2)
- **Decisión:** **OPCIÓN B: ELIMINARLOS DEL CONTEO OFICIAL**.
- **Justificación:** Fueron observaciones secundarias agregadas en la redacción previa sin pasar por el proceso formal de auditoría de la Fase 10 (que cerró estrictamente con 3 hallazgos: `HAL-F10-01`, `F10-02` y `F10-03`). Quedan archivados como notas técnicas de arquitectura, preservando intacto el libro mayor de 39 hallazgos.

---

## 3. Reconciliación Modular Canónica (T4)

| Módulo Canónico | Críticos | Altos | Medios | Total | IDs Asignados |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Unidades y Clasificadores** | 4 | 1 | 0 | **5** | `HAL-F1-01, F1-03, F1-04, F1-06, F1-05` |
| **Compatibilidad Dimensional** | 3 | 2 | 0 | **5** | `HAL-F2-01, F2-02, F2-04, F2-03, F2-05` |
| **Presentaciones y Equivalencias** | 2 | 3 | 0 | **5** | `HAL-F3-02, F3-03, F3-01, F3-04, F3-05` |
| **Fórmulas Matemáticas y Costos** | 4 | 2 | 1 | **7** | `HAL-F4-01, F4-02, F4-03, F4-07, F4-04, F4-08, F4-06` |
| **Arquitectura de Tipos y Frontend** | 0 | 1 | 0 | **1** | `HAL-F5-03` |
| **Redondeo y Unidades Discretas** | 0 | 1 | 1 | **2** | `HAL-F6-01, F6-03` |
| **IVA, Márgenes y Descuentos** | 1 | 2 | 1 | **4** | `HAL-F7-01, F7-02, F7-03, F7-04` |
| **Producción, Recetas y WIP** | 1 | 2 | 0 | **3** | `HAL-F8-01, F8-02, F8-04` |
| **Kardex, Ventas y Finanzas** | 2 | 2 | 0 | **4** | `HAL-F9-01, F9-02, F9-03, F9-04` |
| **Schema Prisma y Seguridad Server**| 2 | 1 | 0 | **3** | `HAL-F10-01, F10-02, F10-03` |
| **TOTAL CONSOLIDADO** | **19** | **17** | **3** | **39** | |

---

## 4. Declaración de Conteo Final Definitivo (T5)
- **Total Hallazgos Únicos:** **39**.
- **Distribución:** **19 CRÍTICOS**, **17 ALTOS**, **3 MEDIOS**.
- **Consistencia:** 100% conciliado con las certificaciones intermedias (`INFORME-26`, `28`, `30` y `33`).

---
**ESTADO: RECONCILIACIÓN FINAL COMPLETADA. LIBRO MAYOR CERRADO. FIN DE LA AUDITORÍA.**
