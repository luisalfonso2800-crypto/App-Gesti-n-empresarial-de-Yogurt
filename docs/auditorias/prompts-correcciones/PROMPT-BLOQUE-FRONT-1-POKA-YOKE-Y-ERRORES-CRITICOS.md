TAREA:
Remediación Frontend — Bloque Front-1: Poka-Yoke y Errores Críticos

OBJETIVO:
Corregir quirúrgicamente los 6 hallazgos críticos/altos identificados en la auditoría frontend para alinear las validaciones de interfaz con las reglas estrictas y DTOs del backend.

REGLAS ESTRICTAS DE BAJO CONSUMO DE CUOTA Y SEGURIDAD:
1. PROHIBIDO ejecutar búsquedas recursivas (`Get-ChildItem -Recurse`, `dir /s`, `find .`).
2. PROHIBIDO ejecutar compilaciones de Next.js (`pnpm build`, `pnpm --filter web build`).
3. PROHIBIDO invocar subagentes o cambiar a modelos pesados.
4. Ir ÚNICAMENTE a los archivos y líneas declarados en cada hallazgo.
5. Mantener SRP: ningún componente modificado puede superar las 130 líneas (verificar con `node .agents/scripts/verify-srp.js`).
6. Cero estilos en línea (`style={{`).

---

### HALLAZGOS Y ARCHIVOS EXACTOS A MODIFICAR:

#### 1. HAL-F0-01 (CRÍTICO) — Erradicar alert() nativo
- **Archivo:** `apps/web/src/app/operations/production/hooks/useProductionPageData.js`
- **Líneas aproximadas:** L129, L144
- **Acción:**
  - Reemplazar las llamadas `alert(e.message)` importando el hook de notificaciones del Design System (`useNotification` o equivalente contextual del proyecto).
  - Disparar notificación estructurada:
    `showError({ title: 'Orden rechazada', message: e.message || 'Error en la operación' });`

#### 2. HAL-F2-01 (CRÍTICO) — Eliminar fallback hardcodeado de WIP
- **Archivo:** `apps/web/src/app/catalog/recipes/components/recipeHelpers.js`
- **Línea aproximada:** L564
- **Acción:**
  - Eliminar por completo el valor por defecto arbitrario `unitCostWip = 4390`.
  - Si el insumo intermedio (WIP) tiene costo 0, nulo o inválido:
    * Asignar costo en 0.
    * Retornar un indicador de bloqueo: `{ costoInvalido: true, motivo: 'WIP sin costo configurado' }`.
  - En la interfaz consumidora del modal, desplegar un badge visual de advertencia y deshabilitar el botón de submit mientras exista un WIP sin costear.

#### 3. HAL-F4-01 (ALTO) — Restringir Merma a < 100%
- **Archivo:** `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx` (o subcomponente de tabla de BOM)
- **Línea aproximada:** L109
- **Acción:**
  - Ajustar el `<input type="number">` de merma cambiando `max="100"` a `max="99.9"`.
  - En el handler de cambio, asegurar que si el valor ingresado es `>= 100`, se restrinja a 99.9 o muestre la advertencia inline: "La merma debe ser menor a 100%".

#### 4. HAL-F4-02 (ALTO) — Bloquear Envases a Granel sin Volumen
- **Archivo:** `apps/web/src/app/catalog/presentations/components/PresentationModal.jsx`
- **Acción:**
  - Detectar si el tipo de envase seleccionado es `BALDE` o `TANQUE_GRANEL`.
  - Si es a granel, exigir obligatoriamente que `cantidadMl > 0`.
  - Bloquear el envío del formulario y mostrar advertencia descriptiva: "Debe especificar el volumen real para presentaciones a granel".

#### 5. HAL-F9-01 (ALTO) — Guarda de Descuento Máximo 50%
- **Archivo:** `apps/web/src/app/commercial/sales/hooks/useSaleForm.js`
- **Acción:**
  - En la validación y cálculo del descuento por línea de venta, asegurar que `descuento <= (subtotalLinea * 0.50)`.
  - Si el operario intenta ingresar un valor superior al 50%, limitar el valor o alertar inline: "Descuento máximo comercial permitido: 50%".

#### 6. HAL-F9-02 (ALTO) — Whitelist Estricta de Payload en POST /sales
- **Archivo:** `apps/web/src/app/commercial/sales/hooks/useSaleForm.js`
- **Línea aproximada:** L198
- **Acción:**
  - Eliminar el operador spread `{ ...formData }` en la llamada a la API.
  - Construir un objeto limpio (whitelist) que cumpla con el DTO Zod `.strict()`:
    ```javascript
    const payload = {
      idCliente: formData.idCliente,
      fechaVenta: new Date(formData.fechaVenta).toISOString(),
      tipoPago: formData.tipoPago,
      valorPagado: Number(formData.valorPagado || 0),
      detalles: formData.detalles.map((d) => ({
        idProducto: d.idProducto,
        cantidad: Number(d.cantidad),
        precioUnitario: Number(d.precioUnitario),
        descuento: Number(d.descuento || 0),
        tipoDescuento: d.tipoDescuento || 'PORCENTAJE',
      })),
    };
    await apiClient.post('/sales', payload);
    ```

---

### ENTREGABLES Y CIERRE:
1. Validar reglas de arquitectura ejecutando:
   `node .agents/scripts/verify-srp.js`
2. Generar el reporte resumido en:
   `apps/prompts/implememtacion/frontend/remediacion/INFORME-REMED-FRONT-1.md`
3. Actualizar el checklist en:
   `apps/prompts/implememtacion/frontend/remediacion/ESTADO-REMED-FRONT.md` marcando el Bloque Front-1 como completado.
4. Generar el commit local correspondiente:
   `git commit -m "fix(frontend): bloque 1 poka-yoke y errores criticos (HAL-F0-01, F2-01, F4-01, F4-02, F9-01, F9-02)"`
5. NO HACER GIT PUSH.

DETENCIÓN:
Al completar los archivos y el commit local, DETENTE inmediatamente.