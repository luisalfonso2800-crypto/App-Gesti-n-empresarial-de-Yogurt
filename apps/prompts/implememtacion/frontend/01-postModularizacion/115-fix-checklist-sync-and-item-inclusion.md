> Corrige la sincronización y renderizado en Checklist, y mejora la UX de inputs numéricos vacíos:

1. UX EN INPUTS NUMÉRICOS (FormPhase.jsx):
   - Elimina la conversión forzada a 0 mientras el usuario escribe en inputs como `precioUnitario`, `cantEmpaques`, `stockMinimo`, etc.
   - En el estado local, permite que el valor sea una cadena vacía `""` cuando el usuario borre el contenido.
   - Utiliza `placeholder="0"` o `placeholder="0.00"` en lugar de fijar `value={0}`, evitando que al escribir un número se anteponga un cero incómodo que deba ser borrado manualmente.
   - Solo al calcular subtotales o al enviar el formulario (submit/confirmar), convierte con `parseFloat(val) || 0`.

2. SINCRONIZACIÓN Y RENDERIZADO EN CHECKLIST (apps/web/src/app/operations/purchases/new/):
   - En `FormPhase.jsx`:
     * Tras completar con éxito la adición a la orden (`POST /purchases/orders/${activeOrder.id}/items`), invoca el refresco explícito de la orden (ej. `refreshOrder()` o `onSuccess()` pasado por props) antes de volver al checklist.
   - En `ChecklistPhase.jsx` / `page.jsx` / `useChecklistManager.js`:
     * Asegura que el hook exponga una función de recarga reactiva y se ejecute al cambiar de fase.
     * En la lógica de agrupación por proveedor, valida que los ítems añadidos sin presentación estricta o con datos dinámicos se agrupen correctamente bajo su proveedor (o una sección visible) y no se descarten en la renderización.

3. VALIDACIÓN:
   - Valida la sintaxis con:
     node --check apps/web/src/app/operations/purchases/new/components/FormPhase.jsx
     node --check apps/web/src/app/operations/purchases/new/page.jsx
   - Prueba en navegador:
     1) Borra el precio en una fila y comprueba que quede en blanco con placeholder sin forzar un "0" inicial al escribir.
     2) Incorpora un ítem y verifica que aparezca de inmediato listado en el Checklist bajo su proveedor.