# TESTS E2E — COMPRAS: MOTOR DE CÁLCULOS, EMPAQUES, CONVERSIONES E IMPUESTOS

## ⚠️ REGLAS ESTRICTAS DE ULTRA-AHORRO DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes.
3. NO ejecutar Playwright (la ejecución es exclusiva del operador humano).
4. NO modificar código de producción en `apps/web/src` o `apps/api/src`.
5. LÍMITES DUROS: Máximo 5 lecturas de inspección, exactamente 1 archivo `.spec.js` a crear, máximo 8 llamadas totales a herramientas.
6. LÍMITE DE TAMAÑO: Tests declarativos y explícitos (sin bucles dinámicos `for...of`).
7. Al terminar de redactar el archivo, DETENERSE inmediatamente sin reportes redundantes.

---

## 📌 CONTEXTO DE CÁLCULOS EN COMPRAS
- **Ruta UI:** `/operations/purchases/new?mode=direct`
- **Fórmulas a auditar:**
  * `Ingreso Neto a Bodega = Cant. Empaques × Contenido por Empaque`
  * `Costo Base Unitario = Precio Unitario / Contenido por Empaque`
  * `Subtotal Línea = Cant. Empaques × Precio Unitario`
  * `IVA Adicional: Base = Subtotal | IVA = Base × (Tasa / 100) | Total = Base + IVA`
  * `IVA Incluido: Base = Subtotal / (1 + Tasa / 100) | IVA = Subtotal - Base | Total = Subtotal`
  * `Total Compra a Pagar = ∑(Subtotales Líneas) + IVA Consolidado + Flete Global`
  * `Proyección de Letras = Conversión en español del valor entero final a pesos M/CTE`
- **Catálogo de Empaques:** `UNIDAD`, `BOLSA`, `CAJA`, `BULTO`, `BOTELLA`, `BIDÓN`, `CANASTILLA`, `ENVASE`, `OTRO`.
- **Unidades Evaluadas:** `kg`, `g`, `L`, `ml`, `oz`, `und`.

---

## 🛠️ TAREAS DE CONSTRUCCIÓN

### T1. Lecturas Mínimas de Inspección (Máximo 3 archivos)
Inspeccionar únicamente los selectores de inputs y contenedores numéricos:
1. `apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowEconomics.jsx`
2. `apps/web/src/app/operations/purchases/new/hooks/useFormPhaseData.js` (solo bloque de cálculo/totales)
3. `apps/web/e2e/helpers/purchase-form.js`

---

### T2. Crear `apps/web/e2e/purchases/purchases-calculations.spec.js`
Implementar 22 tests explícitos divididos en 5 bloques matemáticos:

#### Bloque 1 — Masa, Volumen, Conteo y Decimales (8 tests)
- **C01 [Masa entera]:** BULTO × 50 kg × 2 → Ingreso Neto: "100 kg".
- **C02 [Masa en gramos]:** BOLSA × 500 g × 4 → Ingreso Neto: "2.000 g" o "2 kg".
- **C03 [Masa decimal]:** CAJA × 1.5 kg × 6 → Ingreso Neto: "9 kg".
- **C04 [Volumen en litros]:** BIDÓN × 20 L × 3 → Ingreso Neto: "60 L".
- **C05 [Volumen en mililitros]:** BOTELLA × 750 ml × 4 → Ingreso Neto: "3.000 ml" o "3 L".
- **C06 [Volumen decimal fraccionado]:** ENVASE × 0.25 L × 8 → Ingreso Neto: "2 L" o "2.000 ml".
- **C07 [Unidades enteras]:** CANASTILLA × 12 und × 5 → Ingreso Neto: "60 und".
- **C08 [Volumen en Onzas]:** ENVASE × 8 oz × 10 → Ingreso Neto: "80 oz".

#### Bloque 2 — Costo Base Unitario Derivado ($ / Unidad) (3 tests)
- **C09 [Costo por kg]:** BULTO × 25 kg a $50.000 → Costo Base Unitario: "$2.000 / kg".
- **C10 [Costo por Litro]:** BOTELLA × 2 L a $6.000 → Costo Base Unitario: "$3.000 / L".
- **C11 [Costo por Unidad individual]:** CAJA × 24 und a $12.000 → Costo Base Unitario: "$500 / und".

#### Bloque 3 — Liquidación Tributaria e IVA (5 tests)
- **C12 [IVA 19% Adicional]:** 5 empaques × $10.000 → Base: $50.000 | IVA: $9.500 | Subtotal: $59.500.
- **C13 [IVA 19% Incluido]:** 10 empaques × $11.900 → Base: $100.000 | IVA: $19.000 | Subtotal: $119.000.
- **C14 [IVA 5% Canasta Básica]:** 10 empaques × $10.500 (IVA Incluido) → Base: $100.000 | IVA: $5.000 | Subtotal: $105.000.
- **C15 [Exento / Sin IVA]:** Checkbox Aplica IVA desmarcado → Base = Subtotal | IVA: $0.
- **C16 [Recálculo reactivo]:** Conmutar tasa de 19% a 5% en vivo → Verificar actualización inmediata de Base e IVA.

#### Bloque 4 — Flete Global, Acumulación Multilínea y Letras (3 tests)
- **C17 [Flete sumado al total]:** Compra con Subtotal $100.000 + Flete $15.000 → Total a Pagar: $115.000.
- **C18 [Multilínea consolidada]:** Fila 1 ($50.000) + Fila 2 ($30.000) + Flete ($10.000) → Total: $90.000.
- **C19 [Proyección de Letras]:** Total de $150.000 → Barra fija/resumen muestra texto: "Ciento cincuenta mil pesos".

#### Bloque 5 — Invariantes de Entrada y Límites (3 tests)
- **C20 [Cantidad 0]:** Ingresar Cantidad = 0 → Normaliza a 1 o deshabilita botón de guardado.
- **C21 [Precio 0]:** Ingresar Precio = 0 → Alerta Poka-Yoke de precio requerido mayor a 0.
- **C22 [Contenido 0]:** Ingresar Contenido = 0 → Bloqueo preventivo de división por cero en costo unitario.

---

## 🛑 CONDICIÓN DE TERMINACIÓN Y DETENCIÓN
- Archivo `apps/web/e2e/purchases/purchases-calculations.spec.js` creado con los 22 tests.
- CERO ejecuciones de comandos Playwright.
- CERO modificaciones a código de producción.
- DETENTE inmediatamente tras generar el archivo.

## 📋 REPORTE DE SALIDA (ESTRICTO)
Responde ÚNICAMENTE con:
• Archivo creado y total de líneas.
• Desglose de tests implementados (22 tests en 5 bloques).
• Comando exacto para que el operador humano ejecute la prueba en PowerShell:
  `$env:CI = "true"; pnpm --filter web exec playwright test purchases/purchases-calculations --reporter=list --timeout=25000; Remove-Item Env:CI`