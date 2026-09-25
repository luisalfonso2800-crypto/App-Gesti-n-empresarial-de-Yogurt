# TAREA CONTROLADA — SUITE E2E DE COMPRAS EN CADENA: ABASTECIMIENTO DE MATERIAS PRIMAS Y EMPAQUES

OBJETIVO TÉCNICO:
Crear en `apps/web/e2e/purchases/purchases-seed-chain.spec.js` (≤ 140 líneas) la prueba E2E encargada de registrar mediante la UI real (`/operations/purchases/new?mode=direct`) la compra maestra de insumos requerida para costear y fabricar las recetas de los 10 productos huérfanos:
1. Insumos a comprar: Leche Entera, Cultivo Yogurt, Cultivo Kumis, Azúcar Blanca, Fruta Fresa, Fruta Mora, Botellas 1L y Vasos 250g.
2. REGLA DE IDEMPOTENCIA TOTAL:
   - Verificar si el archivo `apps/web/e2e/.test-data/purchases.chain.json` ya contiene una compra maestra registrada.
   - Navegar a `/operations/inventory`: si las materias primas ya registran stock > 0, reutilizar los datos y omitir la duplicación de compras.
   - Si no hay stock suficiente, ejecutar el registro de compra.
3. ALTA / SELECCIÓN DE PROVEEDOR:
   - Seleccionar un proveedor existente en el desplegable o crearlo al vuelo si la lista está vacía ("PROVEEDOR_E2E_CENTRAL", NIT: "900987654-1").
4. REGISTRO EN FILAS DE COMPRA:
   - Diligenciar líneas de insumos asegurando cantidad > 0, precio unitario real pactado y empaques comerciales enteros (sin decimales fraccionarios).
   - Pulsar "Confirmar Compra" / "Guardar y Registrar Compra".
   - Interceptar la respuesta exitosa del backend (200/201).
5. HANDOFF:
   - Persistir los identificadores en `apps/web/e2e/.test-data/purchases.chain.json` y `supplies.chain.json` para que las etapas de Recetas y Producción conozcan los insumos con stock real.

REGLAS DE CUOTA Y ARQUITECTURA:
- CERO modificaciones a código de producción (`apps/web/src/**`, `apps/api/**`).
- PROHIBIDO ejecutar Playwright automáticamente (la ejecución la realiza el operador humano).
- CERO `waitForTimeout` ciegos; usar aserciones web-first de Playwright.
- Archivo único en JavaScript (.js), estrictamente ≤ 140 líneas (regla `check-e2e-limits.js`).

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 2 LECTURAS):
- `apps/web/e2e/purchases/purchases-chain.spec.js` (patrón de compra existente)
- `apps/web/e2e/helpers/chain-state.js`

ACCIONES ESPECÍFICAS EN `purchases-seed-chain.spec.js`:
- Navegar a `/operations/purchases/new?mode=direct`.
- Esperar que el formulario cargue (`form, table, div[class*="purchase"]`).
- Seleccionar o verificar proveedor activo.
- Llenar filas de insumos esenciales con selectores resilientes (`select[name*="insumo" i], input[placeholder*="insumo" i]`, cantidad y precio).
- Hacer clic en el botón de guardado superior o inferior (`button:has-text("Guardar"), button:has-text("Confirmar")`).
- Esperar redirección a `/operations/purchases` o toast de compra exitosa.
- Guardar el estado JSON en `.test-data/purchases.chain.json`.

VERIFICACIÓN OBLIGATORIA:
1. `node --check apps/web/e2e/purchases/purchases-seed-chain.spec.js`
2. `node apps/web/e2e/helpers/check-e2e-limits.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Archivo creado con ≤ 140 líneas y sintaxis limpia (código 0).
- `check-e2e-limits.js` retorna 0.
- DETENTE inmediatamente tras reportar. NO ejecutes Playwright.

REPORTE FINAL REQUERIDO:
Entregar ÚNICAMENTE:
- Archivo creado y conteo de líneas.
- Lista de insumos y cantidades abastecidas.
- Comando para que el operador humano ejecute la prueba en PowerShell.
- Estado: [COMPLETADO / BLOQUEADO].
