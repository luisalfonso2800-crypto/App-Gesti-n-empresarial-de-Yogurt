> Ajustes de UX en la vista de Checklist de Compras (apps/web/src/app/operations/purchases/new/):

1. BOTÓN VOLVER ATRÁS:
   - En la cabecera de la vista Checklist, agrega un botón/enlace "Volver a Compras" con el icono ArrowLeft (de lucide-react o @/components/ui/icons) que navegue a `/operations/purchases`.

2. IDENTIFICADOR CLARO DE LA LISTA EN REVISIÓN:
   - Debajo del título "Checklist de Compras", muestra claramente:
     * Código formal (ej. `ORD-2026-0011`).
     * Nombre descriptivo de la lista (ej. `Lista de Compra Fusionada - 9/9/2026`).
     * Badge con el estado actual (`PENDIENTE`).

3. RENOMBRAR BOTÓN Y MANTENER EL CONTEXTO:
   - Cambia el texto del botón azul a: `"+ Registrar Ítem en esta Lista"`.
   - Asegura que al hacer clic, preserve en los query params el identificador de la orden en curso (ej. `/operations/purchases/.../register?orderId=[ID_ACTUAL]`) para que el ítem se asocie directamente a esta lista sin desvincularla.

4. VALIDACIÓN:
   - Valida la sintaxis con:
     node --check apps/web/src/app/operations/purchases/new/page.jsx