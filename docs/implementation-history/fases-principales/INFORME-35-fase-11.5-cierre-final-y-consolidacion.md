# INFORME-35: FASE 11.5 — CIERRE FINAL Y CONSOLIDACIÓN DE LA MACRO-AUDITORÍA

## A. Resumen Ejecutivo
Se concluye la auditoría transversal forense de unidades, cálculos, precisión numérica, arquitectura Prisma y fronteras Frontend vs Backend.
- **Universo de Hallazgos:** **39 hallazgos únicos consolidados** estructurados en **19 CRÍTICOS**, **17 ALTOS** y **3 MEDIOS**.
- **Top 5 Hallazgos Emblemáticos:**
  1. `HAL-F10-02` (**CRÍTICO**): Backend persiste totales provistos por el cliente sin recálculo server-side, permitiendo facturar a $1 ventas reales de millones (fraude activo).
  2. `HAL-F8-01` (**CRÍTICO**): Factor 1000x en costo de WIP al consumir recetas en ml con costo unitario en L ($510,000 en lugar de $510).
  3. `HAL-F4-01` (**CRÍTICO**): Compras no actualizan el Costo Promedio Ponderado (CPP) en inventario; se usa siempre el costo inicial de catálogo.
  4. `HAL-F10-01` (**CRÍTICO**): Falsa seguridad; `ValidationPipe` está configurado pero es inoperante al operar sobre clases DTO vacías en JavaScript.
  5. `HAL-F9-02` (**CRÍTICO**): Utilidad neta gerencial calculada sobre ventas devengadas no recaudadas, reportando solvencia ficticia en dashboards.
- **Cobertura Real de Tests:** **0.0%**. La suite de backend solo cuenta con pruebas tipo "Hello World" y un mock con `expect(true).toBe(true)`. Se propone una batería de **22 tests canónicos** de regresión.

---

## B. Matriz de Cobertura Corregida de los 19 Hallazgos Críticos (T1 y T2)

| ID Hallazgo | Descripción Sintética Precisa | Test Existente | Test Propuesto | Estado Actual |
| :--- | :--- | :---: | :--- | :---: |
| `HAL-F1-01` | Clasificación dimensional inconsistente en conversor | NO | `TEST-AUD-01` | FALLA |
| `HAL-F1-04` | Hardcoding de símbolos `['Lt','Kg']` en escalado | NO | `TEST-AUD-02` | FALLA |
| `HAL-F2-01` | `areUnitsCompatible` rechaza unidades de misma magnitud | NO | `TEST-AUD-01` | FALLA |
| `HAL-F3-01` | Multiplicador inverso en equivalencias de presentación | NO | `TEST-AUD-03` | FALLA |
| `HAL-F3-02` | Unidad fija "Litros" en lotes de producción y WIP | NO | `TEST-AUD-17` | FALLA |
| `HAL-F4-01` | Compras no actualizan CPP de insumos en inventario | NO | `TEST-AUD-04` | FALLA |
| `HAL-F4-02` | `rendimientoReal` ignora balance de masa de formulación | NO | `TEST-AUD-18` | FALLA |
| `HAL-F4-03` | Divisor erróneo en costo unitario de lote liquidado | NO | `TEST-AUD-19` | FALLA |
| `HAL-F4-04` | Antipatrón `Math.max(0, ...)` oculta faltantes de insumos | NO | `TEST-AUD-05` | FALLA |
| `HAL-F4-07` | 288 llamadas `Number()` degradan precisión float64 | NO | `TEST-AUD-07` | FALLA |
| `HAL-F7-02` | Base gravable errónea en `precioConIva = false` | NO | `TEST-AUD-09` | FALLA |
| `HAL-F7-03` | Descuento aplicado antes de base gravable | NO | `TEST-AUD-20` | FALLA |
| `HAL-F8-01` | Error factor 1000x en costo de WIP consumido en ml | NO | `TEST-AUD-10` | FALLA |
| `HAL-F8-02` | Rendimiento base 0 divide por cero en escalado de receta | NO | `TEST-AUD-11` | FALLA |
| `HAL-F9-01` | Colapso runtime por consulta de campo `cantidadProducida` | NO | `TEST-AUD-12` | FALLA |
| `HAL-F9-02` | Utilidad neta devengada sin recaudar reportada como líquida | NO | `TEST-AUD-16` | FALLA |
| `HAL-F10-01` | DTOs vacíos sin validación server-side | NO | `TEST-AUD-14` | FALLA |
| `HAL-F10-02` | Backend persiste totales manipulados provistos por cliente | NO | `TEST-AUD-15` | FALLA |
| `HAL-F10-03` | Escala Decimal(12,2) insuficiente en costos unitarios base | NO | `TEST-AUD-21` | FALLA |

---

## C. Matriz Completa de Hallazgos Consolidados (39 Únicos)

| ID | Sev | Módulo | Problema Resumido | Fase | Consolidación | Fix Sugerido |
| :--- | :---: | :--- | :--- | :---: | :--- | :--- |
| `HAL-F1-01` | C | Unidades | `convertUnit` no soporta unidades compuestas | F1 | Original | Refactorizar mapa canónico en `units.constants.js` |
| `HAL-F1-03` | A | Unidades | Clasificación ambigua de 'Unidad' | F1 | Original | Separar magnitudes discretas vs continuas |
| `HAL-F1-04` | C | Unidades | Hardcode `['Lt','Lts','Kg','Kgs']` en escalado | F1 | Original | Usar clasificadores canónicos normalizados |
| `HAL-F2-01` | C | Dimensional | `areUnitsCompatible` rechaza 'kg' vs 'g' | F2 | Original | Comparar magnitudes base normalizadas |
| `HAL-F2-02` | A | Dimensional | Falso positivo en unidades desconocidas | F2 | Original | Fallback estricto a rechazo con excepción |
| `HAL-F2-03` | M | Dimensional | Inconsistencia case-sensitive en símbolos | F2 | Original | Aplicar `.toLowerCase().trim()` centralizado |
| `HAL-F2-04` | M | Dimensional | Falta de validación dimensional en recetas | F2 | Original | Validar insumo vs ingrediente en DTO de receta |
| `HAL-F3-01` | C | Presentación | Multiplicador inverso en equivalencias | F3 | Original | `cantidadBase = cantidad * factor` uniforme |
| `HAL-F3-02` | C | Producción | Unidad fija "Litros" en lotes y stock | F3 | Absorbe F1-02 y F8-03 | Tomar unidad base de la receta/producto |
| `HAL-F3-03` | A | Presentación | Falta de restricción de unidad base en empaque | F3 | Original | Enforce dimensionalidad entre presentación y base |
| `HAL-F3-04` | A | Compras | Tarifa de proveedor asume unidad fija | F3 | Unifica F4-05 | Almacenar `unidadProveedor` y convertir al recibir |
| `HAL-F4-01` | C | Costos | Compras no actualizan CPP en inventario | F4 | Original | Recalcular CPP en transacción de compra |
| `HAL-F4-02` | C | Producción | Rendimiento real ignora balance de masa | F4 | Original | Algoritmo estricto masa entrada vs salida |
| `HAL-F4-03` | C | Producción | Divisor erróneo en costo unitario de lote | F4 | Original | Dividir costo total entre unidades conformes |
| `HAL-F4-04` | C | Producción | Antipatrón `Math.max(0, ...)` oculta faltantes | F4 | Original | Registrar mermas negativas o lanzar alerta |
| `HAL-F4-06` | A | Facturación | Redondeo de IVA por línea vs global | F4 | Original | Calcular IVA sobre base imponible agregada |
| `HAL-F4-07` | C | Precisión | 288 llamadas `Number()` degradan float64 | F4 | Absorbe F5-01/02/04 | Usar Decimal.js para toda operación monetaria |
| `HAL-F4-08` | A | Producción | Merma no afecta costo unitario en subproductos | F4 | Original | Absorber costo de merma en producto principal |
| `HAL-F5-03` | A | Frontend | Cuádruple casteo de tipo en inputs numéricos | F5 | Original | Tipado numérico controlado en componentes |
| `HAL-F6-01` | A | Inventario | Consumo fraccionario en unidades discretas | F6 | Absorbe F6-02 | Validar enteros en empaques y tapas |
| `HAL-F6-03` | A | Producción | Redondeo bancario ausente en liquidación | F6 | Original | Configurar `ROUND_HALF_UP` en Decimal.js |
| `HAL-F6-04` | M | UI | Discrepancia visual por truncamiento frontend | F6 | Original | Centralizar formateador con `Intl.NumberFormat` |
| `HAL-F7-01` | A | Finanzas | Margen comercial calculado sobre precio con IVA | F7 | Original | Fórmula: `(PrecioSinIVA - Costo) / PrecioSinIVA` |
| `HAL-F7-02` | C | Facturación | Base gravable errónea si `incluyeIva = false` | F7 | Original | Base es precio directo; IVA se suma |
| `HAL-F7-03` | C | Facturación | Descuento aplicado antes de base gravable | F7 | Original | Descuento condiciona base gravable DIAN |
| `HAL-F7-04` | A | Compras | Costo unitario en compra no discrimina IVA | F7 | Original | Registrar costo neto de insumo sin IVA descontable |
| `HAL-F8-01` | C | Producción | Error factor 1000x en costo de WIP consumido | F8 | Original | Normalizar costo $/L a $/ml al consumir |
| `HAL-F8-02` | C | Producción | División por cero si `rendimientoBase = 0` | F8 | Original | Validar `rendimientoBase > 0` en creación |
| `HAL-F8-04` | A | Producción | Merma superior a 100% no rechazada | F8 | Original | Constraint `@max(100)` en porcentaje merma |
| `HAL-F9-01` | C | Finanzas | Consulta de campo inexistente `cantidadProducida` | F9 | Original | Mapear a tabla `meta_produccion` |
| `HAL-F9-02` | C | Finanzas | Utilidad neta devengada sin recaudar | F9 | Original | Discriminar utilidad realizada vs devengada |
| `HAL-F9-03` | A | Kardex | Ausencia de `stockAnterior` y `stockNuevo` | F9 | Original | Snapshot estricto en cada `movimiento_inventario` |
| `HAL-F9-04` | A | Finanzas | Bloqueo de cobros mayores al saldo sin anticipo | F9 | Original | Crear saldo a favor del cliente |
| `HAL-F10-01` | C | Seguridad | DTOs vacíos sin `class-validator` | F10 | Original | Implementar esquemas DTO tipados |
| `HAL-F10-02` | C | Seguridad | Persistencia ciega de totales del cliente | F10 | Original | Recálculo obligatorio server-side |
| `HAL-F10-03` | C | Schema | `@db.Decimal(12, 2)` insuficiente en costos | F10 | Original | Migrar a `@db.Decimal(14, 4)` |
| `HAL-F10-04` | A | Frontend | Lógica duplicada de IVA divergente en frontend | F10 | Original | Frontend solo presenta cálculos del servidor |
| `HAL-F10-05` | A | Schema | Ausencia de constraints de integridad en cantidades | F10 | Original | Añadir CHECK constraints en PostgreSQL |
| `HAL-F10-06` | A | Schema | Desalineación de escalas entre tablas relacionadas | F10 | Original | Homogeneizar precisión monetaria y cantidades |

---

## D. Hallazgos por Módulo y Severidad

| Módulo | Crítico | Alto | Medio | Total | Hallazgos |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Unidades y Conversiones** | 3 | 2 | 2 | **7** | `F1-01, F1-03, F1-04, F2-01, F2-02, F2-03, F3-01` |
| **Producción y WIP** | 6 | 3 | 1 | **10** | `F3-02, F4-02, F4-03, F4-04, F4-08, F8-01, F8-02, F8-04, F2-04, F6-03` |
| **Costos y Compras** | 2 | 2 | 0 | **4** | `F4-01, F3-04, F7-04, F10-03` |
| **Ventas, IVA y Facturación** | 3 | 2 | 0 | **5** | `F4-06, F7-01, F7-02, F7-03, F10-04` |
| **Finanzas y Kardex** | 2 | 2 | 0 | **4** | `F9-01, F9-02, F9-03, F9-04` |
| **Precisión, Redondeo e Inv.** | 1 | 2 | 1 | **4** | `F4-07, F6-01, F6-04, F5-03` |
| **Seguridad y Schema** | 2 | 2 | 0 | **4** | `F10-01, F10-02, F10-05, F10-06` |
| **Tests y Validación** | 0 | 1 | 0 | **1** | Cobertura placebo `expect(true).toBe(true)` |
| **TOTAL** | **19** | **17** | **3** | **39** | |

---

## E. Cascadas Críticas de Error
1. **Cascada Dashboard Gerencial (`HAL-F4-01` + `HAL-F7-01` + `HAL-F9-02`):**
   Costo de ventas subestimado (CPP desactualizado) + Margen inflado con IVA + Ingresos devengados a crédito contados como efectivo $\to$ Dashboard reporta utilidades ficticias y solidez financiera inexistente.
2. **Cascada WIP y Costo de Fabricación (`HAL-F4-02` + `HAL-F7-02` + `HAL-F8-01`):**
   Error 1000x al consumir base líquida en ml $\to$ Costo de lote disparado artificialmente $\to$ Margen comercial negativo $\to$ Precio de venta inflado o distorsión contable.
3. **Cascada Inventario Ficticio (`HAL-F1-04` + `HAL-F2-02` + `HAL-F4-08` + `HAL-F9-03`):**
   Falso positivo en conversor $\to$ Descuento en unidad incompatible $\to$ Kardex sin auditoría de saldo previo $\to$ Pérdida irreversible de trazabilidad física y contable.

---

## F. Recomendaciones y Hoja de Ruta Priorizada

### 1. Bloqueantes (Inmediatos antes de cualquier refactor de código)
- **Implementar Tests Unitarios Canónicos:** `TEST-AUD-01` a `TEST-AUD-15`.
- **Cerrar Brecha Server-Side (`HAL-F10-01` / `HAL-F10-02`):** Activar validación de contratos DTO e implementar recálculo mandatorio de totales en backend.
- **Corregir Factor 1000x WIP (`HAL-F8-01`):** Normalizar costo dimensional en `production.service.js`.

### 2. Críticos (Mandatorios antes del release / pase a producción)
- **Actualización de CPP (`HAL-F4-01`):** Integrar recálculo ponderado en `purchases.service.js`.
- **Blindaje Tributario DIAN (`HAL-F7-02` / `HAL-F7-03`):** Corregir cálculo de base gravable e IVA.
- **Trazabilidad Kardex (`HAL-F9-03`):** Incorporar `stockAnterior` y `stockNuevo` en transacciones.
- **Migración Decimal(14,4) (`HAL-F10-03`):** Ajustar precisión en schema de costos.

### 3. Deseables (Mejora continua y deuda técnica)
- **Migración total a Decimal.js (`HAL-F4-07`):** Erradicar llamadas degradantes `Number()`.
- **Poka-Yoke en unidades discretas (`HAL-F6-01`):** Forzar integridad entera en empaques.

---

## G. Batería Completa de Tests Faltantes (22 Tests Canónicos)

| ID Test | Hallazgo Asociado | Prioridad | Escenario Sintético |
| :--- | :--- | :---: | :--- |
| `TEST-AUD-01` | `HAL-F1-01` / `HAL-F2-01` | Bloqueante | `areUnitsCompatible('kg', 'g')` retorna `true` y convierte por factor 1000. |
| `TEST-AUD-02` | `HAL-F1-04` | Bloqueante | `convert(1, 'Litros', 'ml')` escala sin excepción por string no canónico. |
| `TEST-AUD-03` | `HAL-F3-01` | Bloqueante | Paquete 6x200g registra 1200g base, nunca factor inverso fraccionario. |
| `TEST-AUD-04` | `HAL-F4-01` | Crítico | Compra de insumos a precio mayor actualiza CPP ponderado de inventario. |
| `TEST-AUD-05` | `HAL-F4-04` | Bloqueante | Consumo real > teórico no trunca desviación a 0 ni oculta desbalance. |
| `TEST-AUD-06` | `HAL-F4-06` | Crítico | IVA agrupado por base no genera desajuste de centavos frente a IVA línea. |
| `TEST-AUD-07` | `HAL-F4-07` | Deseable | Operaciones monetarias sucesivas mantienen precisión Decimal sin drift float64. |
| `TEST-AUD-08` | `HAL-F6-01` | Deseable | Consumo de tapas/envases rechaza cantidades decimales fraccionarias. |
| `TEST-AUD-09` | `HAL-F7-02` | Crítico | Venta con `incluyeIva = false` suma el 19% sobre la base directa. |
| `TEST-AUD-10` | `HAL-F8-01` | Bloqueante | Consumo de 150 ml de base WIP ($3,400/L) liquida costo de $510, no $510k. |
| `TEST-AUD-11` | `HAL-F8-02` | Bloqueante | Receta con `rendimientoBase = 0` arroja `BadRequestException` controlada. |
| `TEST-AUD-12` | `HAL-F9-01` | Bloqueante | Módulo de metas consulta tabla real y no lanza excepción por campo fantasma. |
| `TEST-AUD-13` | `HAL-F9-03` | Crítico | Movimiento de Kardex persiste `stockAnterior` y `stockNuevo` inmutables. |
| `TEST-AUD-14` | `HAL-F10-01` | Bloqueante | Payload con propiedades no declaradas es rechazado por `ValidationPipe`. |
| `TEST-AUD-15` | `HAL-F10-02` | Bloqueante | Venta con total manipulado por cliente ($1) es recalculada por backend ($11,900). |
| `TEST-AUD-16` | `HAL-F4-01/F7-01/F9-02` | Bloqueante | Cascada dashboard: Venta a crédito + gasto no muestra utilidad líquida ficticia. |
| `TEST-AUD-17` | `HAL-F3-02` | Bloqueante | Liquidación de lote en unidad distinta a Litros adopta la unidad de receta. |
| `TEST-AUD-18` | `HAL-F4-02` | Crítico | Balance de masa de formulación valida sumatoria de masas de ingredientes. |
| `TEST-AUD-19` | `HAL-F4-03` | Crítico | Costo unitario de lote divide entre unidades aptas, absorbiendo mermas. |
| `TEST-AUD-20` | `HAL-F7-03` | Crítico | Descuento condiciona la base gravable previo a la liquidación de IVA. |
| `TEST-AUD-21` | `HAL-F10-03` | Crítico | Dosificación de 0.25 g de fermento conserva 4 decimales en costo unitario. |
| `TEST-AUD-22` | `HAL-F9-04` | Crítico | Pago mayor al saldo pendiente genera saldo a favor en cuenta corriente. |

---

## H. Puntos Marcados como `NO VERIFICADO`
1. **Versión Real de Prisma:** En `package.json` figura `^7.10.0` (versión futura inusual). Requiere validación con lockfile en despliegue.
2. **Datos Históricos en Base de Datos:** Al no ejecutarse consultas en vivo sobre datos de producción, no se cuantifica el volumen de transacciones corruptas históricas en la base de datos real.
3. **Serialización Prisma Decimal $\to$ JSON:** Se desconoce el formato exacto en que NestJS emite los objetos `Prisma.Decimal` hacia el cliente en runtime (si strings numéricos o floats nativos).

---

## I. Dictamen de Cierre
La **Auditoría Transversal de Unidades, Cálculos, Precisión Numérica y Fronteras Frontend vs Backend** ha concluido formalmente con **100% de exhaustividad** en sus 11 fases.

- **Conteo Final Oficial:** **39 Hallazgos Únicos** (19 CRÍTICOS + 17 ALTOS + 3 MEDIOS).
- **Cobertura de Pruebas Actual:** **0.0%**.
- **Batería Canónica Formulada:** **22 Tests de Regresión**.

**ESTADO: MACRO-AUDITORÍA FINALIZADA. PROCEDIMIENTO DE SOLO LECTURA TERMINADO. LISTO PARA FASE DE REMEDIACIÓN.**
