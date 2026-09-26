OBJETIVO: Estandarizar la totalidad de los modales pendientes en `apps/web/src/` bajo las reglas del Bloque VI de AGENTS.md. Prohibido tocar backend, CSS globales o usar TypeScript.

REGLAS GENERALES APLICABLES A TODOS LOS MODALES:
1. Mayúsculas (Regla 31): Inputs de texto (`nombre`, `descripcion`, `direccion`, `contacto`, `periodo`) deben forzar `.toUpperCase()` en estado y llevar `style={{ textTransform: 'uppercase' }}`.
2. Botón Guardar (Reglas 34 y 38): Si el formulario es inválido o `loading`, aplicar `disabled`, `style={{ opacity: 0.5, cursor: 'not-allowed' }}` y atributo `title` listando los campos faltantes o erróneos.
3. Banner de Error API (Regla 39): En bloque `catch`, extraer `err.response?.data?.message || err.message || 'Error al guardar'` sobre contenedor `#FEF2F2`, borde `#F87171`, color `#B91C1C`.
4. Resumen Poka-Yoke (Regla 39): Contenedor previo a la botonera (`#F0FDF4`, borde `#BBF7D0`, texto `#166534`, tamaño `0.76rem`) detallando en lenguaje natural la acción a persistir.

ALCANCE ESPECÍFICO POR ARCHIVO:

1. `apps/web/src/components/catalog/SupplyModal.jsx`:
   - Uppercase visual en `nombre` y `marca`.
   - Texto de ayuda dinámico pluralizado debajo de `stockMinimo` (*El mínimo son X [unidad]...*).
   - Banner de error dinámico de API y botón con `title` contextual.
   - Cápsula resumen Poka-Yoke con nombre, categoría y costo base.

2. `apps/web/src/app/catalog/products/components/ProductModal.jsx`:
   - Uppercase visual en `nombre`.
   - Botón submit con cursor/opacity/title contextual y banner de error dinámico.

3. `apps/web/src/app/catalog/presentations/components/PresentationModal.jsx`:
   - Uppercase visual en `nombre`.
   - Botón submit con cursor/opacity/title contextual y banner de error dinámico.

4. `apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx`:
   - Uppercase visual en textos descriptivos.
   - Banner de error dinámico de API y botón contextual con title.

5. `apps/web/src/app/commercial/sales/components/SaleModal.jsx`:
   - Uppercase visual en observaciones/detalles.
   - Botón de guardado con feedback visual (`opacity: 0.5`, `cursor: not-allowed`) y title de campos faltantes.

6. `apps/web/src/app/commercial/clients/page.jsx` (ClientsModal):
   - Uppercase visual en `nombre`, `contacto`, `direccion`.
   - Máscara en vivo para teléfono `XXX XXX XXXX` (10 dígitos limpios al guardar).
   - Botón contextual con title y validación integral preventiva.

7. `apps/web/src/app/commercial/expenses/page.jsx` (ExpensesModal):
   - Uppercase visual en `descripcion` y `periodo`.
   - Botón contextual con title de campos faltantes.

8. `apps/web/src/app/commercial/payments/page.jsx` (PaymentsModal):
   - Integrar cápsula verde resumen Poka-Yoke indicando: cliente, venta imputada, monto abonado y nuevo saldo proyectado.
   - Botón submit con title de validación contextual.

9. `apps/web/src/app/operations/purchases/page.jsx` (EditListNameModal & DeleteListModal):
   - Migrar estructura al estándar `SmartModal`.
   - Banner de error dinámico y confirmación clara Poka-Yoke antes de ejecutar.

10. `apps/web/src/components/shell/Header.jsx` y `apps/web/src/app/operations/purchases/new/components/ChecklistItemRow.jsx`:
    - Reemplazar contenedor legacy `<Modal>` por `SmartModal` con estilos homologados.

VERIFICACIÓN: Ejecutar `pnpm --filter web exec next lint`.

SALIDA: Exclusivamente tabla resumen indicando: Archivo intervenido, cambios aplicados y resultado de verificación lint. Sin texto introductorio ni conclusiones.
```[cite: 1, 2]