# DIAGNÓSTICO E2E — T34 (purchases-chain.spec.js)

**Fecha:** 2026-09-23  
**Objetivo:** Determinar por qué `purchaseId` resulta `null` y el fallback por GET devuelve `0 items`.

---

## 1. Análisis del Test (`purchases-chain.spec.js`)

- **Llenado de Fila (`fillRowItem`):**
  - Hace clic en `input[class*="provInput"]` y espera el dropdown `div[class*="dropdownItem"]`.
  - Hace clic en el primer item del dropdown de proveedores.
  - Llena empaques con `fill('10')`, unidades por empaque con `fill('5')` y costo unitario con `fill('2500')`.
- **Llenado de Campos Base:**
  - No requiere `fillBaseFields` porque el formulario de compras es un wizard dinámico basado en filas y barra pegajosa (`FormPhaseStickyBar`).
- **Submit y Clics:**
  - Hace clic en `button:has-text("CONFIRMAR Y REGISTRAR COMPRA")` con `force: true`.
  - Paralelamente espera:
    ```javascript
    page.waitForResponse(r => r.url().includes('/purchases') && r.request().method() === 'POST', { timeout: 10000 })
    ```
- **Falla Observada:**
  - El response de POST arroja timeout (retorna `null`).
  - El fallback `GET http://localhost:3001/api/v1/purchases` reporta `0 items`.
  - El modal/formulario no navega ni cierra.

---

## 2. Análisis del Hook `useFormPhaseData.js` (`handleConfirmar`)

En `apps/web/src/app/operations/purchases/new/hooks/useFormPhaseData.js`, antes de ejecutar `apiClient.post('/purchases')`:

```javascript
// Validación 1: Filas incompletas
const filasIncompletas = detalles.filter(d => 
  !d.insumo?.id || 
  parseInt(d.empaques, 10) <= 0 || 
  parseFloat(d.unidadesPorEmpaque) <= 0 || 
  parseFloat(d.costoUnitario) <= 0
);
if (filasIncompletas.length > 0) {
  toast.error('Corrija las filas antes de confirmar.');
  return; // Aborta silenciosamente sin disparar POST
}

// Validación 2: Proveedor obligatorio en compra directa
if (isDirectPurchase) {
  const rowsWithoutProv = detalles.filter(d => !d.proveedor?.id);
  if (rowsWithoutProv.length > 0) {
    toast.error('Para una compra directa, todas las filas deben tener un proveedor seleccionado.');
    return; // Aborta silenciosamente sin disparar POST
  }
}
```

Además, el botón de confirmar en `FormPhaseStickyBar.jsx` tiene:
```jsx
disabled={isSubmitting || detallesCount === 0}
```
Si `detallesCount === 0` o las filas no tienen `insumo.id` o `proveedor.id` fijados en el state de React, el submit se aborta en el cliente antes de emitir cualquier petición HTTP.

---

## 3. Análisis de `purchases.controller.js`

En `apps/api/src/purchases/purchases.controller.js`:
- **POST `/api/v1/purchases`:**
  - Recibe el DTO, llama a `service.create(...)` y retorna directamente el registro creado:
    ```json
    { "id": 15, "idProveedor": 1, "fechaCompra": "...", "total": 125000, "detalles": [...] }
    ```
  - La propiedad del identificador es `body.id`.
- **GET `/api/v1/purchases`:**
  - Llama a `service.findAll()` y retorna directamente un array `Compra[]` (no está envuelto en `{ data: [...] }`).
- **Conclusión de API:** El backend responde correctamente con un array directo en GET y `{ id: ... }` en POST. El hecho de que el GET devuelva `0 items` confirma fehacientemente que **el POST jamás fue emitido ni procesado en la base de datos**.

---

## 4. Hipótesis Principal

La causa raíz es que **el formulario aborta en el cliente antes de llamar a la API**:
1. **Falta de selección de insumo / proveedor en el state de React:** En `purchases-chain.spec.js`, al seleccionar el dropdown de insumo o proveedor, React no alcanzó a despachar el evento `onChange` / `onClick` o la lista de insumos/proveedores aún estaba cargando vía `apiClient.get('/suppliers')` y `apiClient.get('/supplies')`.
2. Al estar incompleto el objeto (`d.insumo?.id` o `d.proveedor?.id` vacíos), `handleConfirmar` dispara un toast de validación y hace un `return` temprano, cancelando la llamada a `apiClient.post('/purchases')`.
3. Por eso `page.waitForResponse` expira y la base de datos permanece con 0 compras registradas.

---

## 5. Recomendación Quirúrgica para `purchases-chain.spec.js`

1. **Asegurar hidratación previa:** Esperar que los catálogos carguen antes de interactuar:
   ```javascript
   await page.waitForResponse(r => r.url().includes('/suppliers') && r.status() === 200, { timeout: 5000 }).catch(() => {});
   ```
2. **Seleccionar explícitamente Insumo y Proveedor:** Asegurar que los dropdowns abran y seleccionen una opción existente que actualice `insumo.id` y `proveedor.id`.
3. **Verificar que el botón no esté disabled:** Esperar `toBeEnabled()` en `CONFIRMAR Y REGISTRAR COMPRA` antes de hacer clic.
