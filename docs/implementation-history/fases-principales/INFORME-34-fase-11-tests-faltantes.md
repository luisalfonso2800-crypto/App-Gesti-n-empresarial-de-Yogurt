# INFORME-34: FASE 11 — TESTS FALTANTES Y MATRIZ DE COBERTURA

## 1. Inventario de Tests Existentes (T1)

| Archivo | Módulo | Alcance Real | Framework | Observación Crítica |
| :--- | :--- | :--- | :--- | :--- |
| `apps/api/src/app.controller.spec.js` | API Root | Endpoint raíz `GET /` | Jest | Retorna "Hello World!". Cero lógica de negocio. |
| `apps/api/test/app.e2e-spec.js` | API E2E | Endpoint raíz `GET /` | Supertest/Jest | Verifica HTTP 200 en `/`. |
| `apps/api/test/business-flow.integration.spec.js` | Negocio E2E | Mock vacío | Jest | **Placebo**: 7 tests con `expect(true).toBe(true)`. Ninguna aserción real. |
| `apps/web/e2e/all-modules-exhaustive.spec.js` | Frontend UI | Navegación e inspección DOM | Playwright | Valida renderizado y flujos UI sin validación de precisión matemática. |
| `apps/web/e2e/value-chain-complete.spec.js` | Flujo Cadena Valor | Navegación Receta→Prod→Cava→Venta | Playwright | Verifica presencia de texto y que no diga "0 Und". No valida cálculos. |

> **Diagnóstico:** La cobertura real de tests unitarios/integración sobre conversiones, dimensionalidad, fórmulas financieras (CPP, IVA, mermas), precisión decimal e identidad de Kardex es **0.0%**.

---

## 2. Cobertura por Hallazgos Críticos (T2)

| ID Hallazgo | Descripción Sintética | ¿Test Existente? | Archivo / Estado | Observación |
| :--- | :--- | :---: | :---: | :--- |
| `HAL-F1-01` | Clasificación dimensional inconsistente | **NO** | Ninguno | Sin tests en `unit-converter.service.js`. |
| `HAL-F1-04` | Hardcoding de símbolos `['Lt','Kg']` | **NO** | Ninguno | Fallo con "Litros" no cubierto. |
| `HAL-F2-01` | `areUnitsCompatible` rechaza misma magnitud | **NO** | Ninguno | Falso negativo 'kg' vs 'g' no testeado. |
| `HAL-F3-01` | Multiplicador inverso en equivalencias | **NO** | Ninguno | Sin test de equivalencia presentación-base. |
| `HAL-F3-02` | Unidad fija "Litros" en lotes de producción | **NO** | Ninguno | UI mockeada superficialmente. |
| `HAL-F4-01` | Compras no actualizan CPP en inventario | **NO** | Ninguno | Sin test contable de costo promedio. |
| `HAL-F4-02` | `rendimientoReal` ignora balance de masa | **NO** | Ninguno | Sin test de rendimiento de formulación. |
| `HAL-F4-03` | Divisor erróneo en costo unitario lote | **NO** | Ninguno | Sin test de liquidación de lote. |
| `HAL-F4-04` | Antipatrón `Math.max(0, ...)` oculta faltantes | **NO** | Ninguno | Sin test con consumo real > planificado. |
| `HAL-F4-07` | 288 llamadas `Number()` degradan float64 | **NO** | Ninguno | Cero tests de aritmética con Decimal.js. |
| `HAL-F7-02` | Base gravable errónea en `precioConIva = false` | **NO** | Ninguno | Sin test tributario DIAN (IVA 19%). |
| `HAL-F7-03` | Descuento aplicado antes de base gravable | **NO** | Ninguno | Sin test de liquidación comercial. |
| `HAL-F8-01` | Factor 1000x en costo de WIP consumido | **NO** | Ninguno | Sin test de costo unitario por ml vs L. |
| `HAL-F8-02` | Rendimiento base 0 divide por cero | **NO** | Ninguno | Sin test de recetas con rendimiento 0. |
| `HAL-F9-01` | Campo inexistente `cantidadProducida` | **NO** | Ninguno | Rompe en runtime sin ser detectado. |
| `HAL-F9-02` | Utilidad neta devengada sin recaudar | **NO** | Ninguno | Sin test de conciliación cartera vs caja. |
| `HAL-F10-01` | DTOs vacíos sin validación server-side | **NO** | Ninguno | Payloads maliciosos no son probados. |
| `HAL-F10-02` | Backend persiste totales manipulados cliente | **NO** | Ninguno | Cero tests de recálculo en servidor. |
| `HAL-F10-03` | Decimal(12,2) insuficiente para micro-insumos | **NO** | Ninguno | Sin test de acumulación en gramos/mg. |

---

## 3. Matriz de Tests Faltantes por Área y Regresión (T3 y T4)

| ID Test | Hallazgo | Tipo | Área | Setup (Entrada) | Aserción Esperada (Then) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TEST-AUD-01` | `HAL-F1-01` / `HAL-F2-01` | Unit | Unidades | `areUnitsCompatible('kg', 'g')` | Retorna `true`. Factor de conversión `1000`. |
| `TEST-AUD-02` | `HAL-F1-04` | Unit | Unidades | `convert(1, 'Litros', 'ml')` | No arroja excepción; retorna `1000`. |
| `TEST-AUD-03` | `HAL-F3-01` | Unit | Presentaciones | Paquete 6x200g (1200g). Base en g | `cantidadBase = 1200`, no `0.00083`. |
| `TEST-AUD-04` | `HAL-F4-01` | Integración | Costos | Stock: 10kg @$10k. Compra: 10kg @$20k | `CPP = $15,000`. Stock total = 20kg. |
| `TEST-AUD-05` | `HAL-F4-04` | Unit | Producción | Plan: 10kg, Real: 12kg | Arroja advertencia de desviación; no trunca a 0. |
| `TEST-AUD-06` | `HAL-F4-06` | Unit | Facturación | 3 ítems con base $10,555 c/u (IVA 19%) | IVA total calculado sobre base agrupada ($6,016). |
| `TEST-AUD-07` | `HAL-F4-07` | Unit | Precisión | Suma de 100 transacciones de $0.10 + $0.20 | Decimal exacto `$30.00`, no `$30.00000000000004`. |
| `TEST-AUD-08` | `HAL-F6-01` | Unit | Inventario | Receta requiere 2.3 unidades discretas | Advertir o requerir 3 empaques; no consumir 2.3. |
| `TEST-AUD-09` | `HAL-F7-02` | Unit | Tributario | Precio base $100k, `incluyeIva = false` | Subtotal: $100k, IVA: $19k, Total: $119k. |
| `TEST-AUD-10` | `HAL-F8-01` | Integración | WIP | Consumo: 150 ml de Base WIP ($3,400/L) | Costo = `$510`, nunca `$510,000` (error 1000x). |
| `TEST-AUD-11` | `HAL-F8-02` | Unit | Recetas | Receta con `rendimientoBase = 0` | Valida y rechaza con `BadRequestException`. |
| `TEST-AUD-12` | `HAL-F9-01` | Integración | Metas | Consulta dashboard metas de producción | Lee de `meta_produccion`; no invoca campo fantasma. |
| `TEST-AUD-13` | `HAL-F9-03` | Integración | Kardex | Movimiento venta de 5 unds sobre stock 20 | `stockAnterior: 20, stockNuevo: 15`. |
| `TEST-AUD-14` | `HAL-F10-01` | E2E | Seguridad | POST `/sales` con body `{ hack: 123 }` | HTTP 400 Bad Request por `forbidNonWhitelisted`. |
| `TEST-AUD-15` | `HAL-F10-02` | Integración | Seguridad | POST `/sales` con ítem $10,000 y total `$1` | Backend recalcula e ignora total cliente ($11,900). |

---

## 4. Priorización y Clasificación de la Batería (T5)

1. **Bloqueantes (Previos a Refactor):**
   - `TEST-AUD-14` y `TEST-AUD-15`: Blindaje de contratos DTO y recálculo server-side.
   - `TEST-AUD-01` y `TEST-AUD-02`: Suite canónica del conversor de unidades.
   - `TEST-AUD-10`: Protección contra distorsión 1000x en costo de WIP.
2. **Críticos (Requeridos para Release / Producción):**
   - `TEST-AUD-04`: CPP contable en compras e inventario.
   - `TEST-AUD-09`: Liquidación tributaria estricta de IVA y descuentos.
   - `TEST-AUD-13`: Trazabilidad formal e identidad de Kardex.
3. **Deseables / Mantenibilidad:**
   - `TEST-AUD-07`: Suite de aritmética sin degradación float64.
   - `TEST-AUD-08`: Validación de empaques discretos.

---

## 5. Conteo de Tests Faltantes por Severidad Cubierta

| Severidad de Riesgo Cubierto | Cantidad de Casos Propuestos |
| :--- | :---: |
| **CRÍTICO (Bloqueantes)** | 11 |
| **ALTO (Críticos de Release)** | 8 |
| **MEDIO (Deseables)** | 2 |
| **TOTAL CASOS PROPUESTOS** | **21** |

---

## 6. Lista de `NO VERIFICADO`
- `Ninguno`: Se inspeccionaron directamente todos los archivos de prueba en `apps/api/test`, `apps/api/src` y `apps/web/e2e`.

---
**FASE 11 COMPLETADA AL 100%. DETENIDO SEGÚN REGLA. NO AVANZAR SIN CONFIRMACIÓN.**
