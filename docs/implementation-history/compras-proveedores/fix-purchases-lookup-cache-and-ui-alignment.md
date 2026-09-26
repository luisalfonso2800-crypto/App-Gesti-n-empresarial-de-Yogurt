# FIX CRÍTICO — AUTOCOMPLETADO DE COTIZACIONES (ANTI-304), ALINEACIÓN VISUAL Y LIMPIEZA E2E

## ⚠️ REGLAS ESTRICTAS DE ULTRA-AHORRO DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes.
3. PROHIBIDO ejecutar builds completos de Next.js (`pnpm build`). Validar únicamente con `node --check` y `verify-srp.js`.
4. LÍMITES DUROS: Máximo 8 lecturas directas (`Read`), máximo 5 ediciones (`Edit`), máximo 15 llamadas a herramientas en total.
5. PROHIBIDO hacer búsquedas recursivas ciegas (`grep`, `find`, `listDir`). Usa las rutas exactas provistas.
6. Edición directa y atómica con `Edit`. CERO scripts temporales (`fix.js`, `patch.js`).
7. Al concluir las verificaciones, DETENERSE de inmediato.

---

## 📌 DIAGNÓSTICO Y CAUSAS RAÍZ
1. **Problema 1 (Capa 1 Poka-Yoke Rota por HTTP 304):**
   El navegador cachea `GET /api/v1/supplier-prices/lookup?idProveedor=...&idInsumo=...` devolviendo `304 Not Modified` sin cuerpo de respuesta (`body: undefined`). El frontend no procesa cotizaciones repetidas, los inputs (precio, contenido, unidad) quedan en blanco/cero y el badge "Cargado desde cotización" nunca aparece.
2. **Problema 2 (Alineación de botones '✕'):**
   Los botones de reseteo rápido en los autocompletes flotan fuera del contenedor del input debido a un posicionamiento relativo ausente en el contenedor padre.
3. **Problema 3 (Ubicación de Alertas Poka-Yoke):**
   El bloque de advertencias (`FormPhaseRowPokaYokeAlerts.jsx`) se proyecta a la derecha rompiendo la cuadrícula, en lugar de renderizarse como fila inferior de ancho completo bajo los campos.
4. **Problema 4 (Polución de datos E2E):**
   Nombres con timestamps largos residuales (`AZUCAR E2E 1790184824252`) ensucian los dropdowns de catálogo.

---

## 🛠️ ACCIONES QUIRÚRGICAS A IMPLEMENTAR

### T1. Anulación de Caché en Frontend y Backend (Solución Definitiva Anti-304)
1. **Frontend (`apps/web/src/lib/api-client.js`):**
   * En el método `get()`, asegurar que las peticiones a endpoints de consulta sensible como `lookup` o catálogos no usen versión cacheada:
     ```javascript
     headers: {
       'Cache-Control': 'no-cache, no-store, must-revalidate',
       'Pragma': 'no-cache',
       ...headers,
     },
     cache: 'no-store',
     ```
2. **Backend (`apps/api/src/supplier-prices/supplier-prices.controller.js`):**
   * En el método `@Get('lookup')` (o su equivalente), asegurar cabeceras de respuesta que fuercen `200 OK` con payload completo:
     ```javascript
     res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
     res.setHeader('Pragma', 'no-cache');
     res.setHeader('Expires', '0');
     ```
3. **Hook de Formulario (`apps/web/src/app/operations/purchases/new/hooks/useFormPhaseData.js`):**
   * Verificar que al recibir la cotización se actualicen de forma síncrona en el estado de la fila: `empaque`, `contenidoUnitario`, `unidadMedida`, `precioUnitario`, y el flag/badge `fromCotizacion: true`.

---

### T2. Corrección CSS de Botones '✕' (Clear Buttons)
En `apps/web/src/app/operations/purchases/new/new-purchase.module.css`:
* Asegurar que el contenedor del input/autocomplete (`.inputWrapper`, `.selectWrapper` o clase equivalente) tenga `position: relative; display: flex; align-items: center;`.
* Ajustar el botón de limpiar (`.clearButton`):
  ```css
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 2;