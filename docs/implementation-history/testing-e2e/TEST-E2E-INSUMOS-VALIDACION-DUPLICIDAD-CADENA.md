# TEST E2E — INSUMOS: VALIDACIÓN + POKA-YOKE DUPLICIDAD (MODO AHORRO DE QUOTA)

## ⚠️ REGLAS ESTRICTAS ANTI-CONSUMO DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes.
3. PROHIBIDO ejecutar Playwright, builds, dev servers o git commands.
4. PROHIBIDO modificar código fuente de producción en `apps/web/src` o `apps/api/src`.
5. PROHIBIDO alterar `presentations-validations.spec.js` o suites previas.
6. LÍMITES DUROS: Máximo 4 lecturas de archivo, exactamente 1 creación de archivo, máximo 8 llamadas totales.
7. Al terminar de redactar el archivo: DETENERSE inmediatamente sin reportes largos.

---

## 📌 CONTEXTO DE INTERFAZ Y SELECTORES
- **Ruta:** `/catalog/supplies`
- **Modal:** Trigger botón `+ Nuevo Insumo`
- **Campos:** 
  - Inputs: `nombre`, `marca`, `contenido` (o `contenidoReferencial`), `stockMinimo`, `densidad`, `costoBase` (o `costoReferencial`), `observaciones`
  - Selects: `categoria`, `subcategoria`, `empaque`, `unidadBase`
  - Checkbox: `activo`
- **Helper de Cadena:** `apps/web/e2e/helpers/chain-state.js` (usar método existente para persistir)

---

## 🛠️ TAREAS:

### T1. Lectura Quirúrgica del Patrón (Solo imports y helpers)
- Leer **únicamente las primeras 40 líneas** de:
  1. `apps/web/e2e/presentations-validations.spec.js`
  2. `apps/web/e2e/helpers/chain-state.js`

### T2. Creación del Archivo de Pruebas
Crear directamente: `apps/web/e2e/supplies-validations.spec.js` conteniendo:

1. **Bloque 1: Validaciones de Campo (Tests 1 al 36):**
   - Inputs obligatorios vacíos (nombre, categoría, marca, stockMinimo, unidadBase).
   - Invariantes numéricos (stockMinimo < 0, costoBase < 0, densidad fuera del rango 0.5 - 2.5).
   - Longitud y caracteres especiales en observaciones.
   *(Implementar mediante array de casos y loop `for` para minimizar código generado)*.

2. **Bloque 2: Poka-Yoke contra Duplicidad (Tests 37 al 43):**
   - **T37 (Base):** Registrar `Azúcar E2E [TIMESTAMP]`. Esperar creación exitosa (200/201).
   - **T38 (Duplicado exacto):** Intentar registrar de nuevo `Azúcar E2E [TIMESTAMP]`. Debe rechazar y mostrar toast o error inline.
   - **T39 (Case Insensitive):** Intentar registrar `azúcar e2e [TIMESTAMP]`. Evaluar rechazo; si permite, marcar test como hallazgo/aserto descriptivo.
   - **T40 (Sin tildes):** Intentar registrar `Azucar E2E [TIMESTAMP]`. Evaluar rechazo.
   - **T41 (Espacios múltiples/trim):** Intentar registrar `  Azúcar   E2E [TIMESTAMP]  `. Evaluar rechazo si normaliza espacios.
   - **T42 (Nombre compuesto legítimo):** Registrar `Azúcar Morena E2E [TIMESTAMP]`. Debe permitir (200/201).
   - **T43 (Sufijo distinto):** Registrar `Azúcar E2E Test [TIMESTAMP]`. Debe permitir (200/201).

3. **Bloque 3: Insumo Maestro para la Cadena de Valor (Test 44):**
   - Registrar insumo maestro:
     * Nombre: `E2E_CHAIN_SUPPLY_LECHE_ENTERA_[TIMESTAMP]`
     * Categoría: `BASE LÁCTEA` (o primera disponible)
     * Marca: `Colanta`
     * Empaque: `BULTO` / `BOLSA`
     * Contenido: `1000`
     * Unidad Base: `l` (o `ml`)
     * Stock Mínimo: `10`
     * Densidad: `1.03`
     * Costo Base: `3200`
   - Interceptar respuesta de la API, extraer `id` y persistir en `supplies.json` mediante `chainState.saveSupply('MASTER_LECHE_LITROS', { id, ... })`.

---

## 🛑 ENTREGABLE Y DETENCIÓN:
- Generar única y exclusivamente el archivo `apps/web/e2e/supplies-validations.spec.js`.
- Imprimir en consola únicamente:
  1. Confirmación de creación del archivo.
  2. Comando Playwright para ejecución manual.
- DETENERSE inmediatamente.