TAREA CONTROLADA — CIRCUITO INTEGRAL DE COMPRAS: BIBLIOTECA DE ICONOS (LUCIDE), BADGE GLOBAL, LISTA IMPRIMIBLE Y CONCILIACIÓN

OBJETIVO
1. Crear una biblioteca centralizada de iconos reutilizables basada en `lucide-react`.
2. Añadir el botón interactivo de "Lista de Compra" en el header global superior (al lado de "Bienvenido"), persistente en toda la aplicación.
3. Permitir imprimir la lista de compras agrupada por proveedor para gestión física en campo.
4. Implementar la conciliación de insumos conseguidos vs. no conseguidos al asentar la compra final en `/operations/purchases/new`.

FUENTES DE VERDAD
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- apps/web/src/app/catalog/supplier-prices/
- apps/web/src/app/operations/purchases/
- apps/web/src/components/ (Header / Layout principal)

REGLAS TÉCNICAS OBLIGATORIAS
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo con reglas `@media print`. PROHIBIDO Tailwind.
3. NO ejecutar comandos de instalación; `lucide-react` ya está disponible en las dependencias de `apps/web`.
4. El estado del carrito debe mantenerse reactivo y sincronizado en `sessionStorage`/`localStorage` disparando eventos personalizados para refrescar el header al instante.
5. Solo los insumos marcados como "Conseguidos" deben enviarse a `POST /purchases` y aumentar el stock físico en Inventario.

ALCANCE PUNTUAL

1. Biblioteca de Iconos Reutilizables (`apps/web/src/components/ui/icons.jsx`):
   - Crear un archivo central que exporte componentes estandarizados desde `lucide-react`:
     * `ShoppingCartIcon` (ShoppingCart)
     * `PrintIcon` (Printer)
     * `CheckIcon` (Check)
     * `XIcon` (X)
     * `TrashIcon` (Trash2)
     * `StoreIcon` (Store / Building2)
     * `AlertCircleIcon` (AlertCircle)
   - Permitir propiedades comunes (`size`, `className`, `strokeWidth`) con valores por defecto consistentes.

2. TopBar / Header Global:
   - Al lado del saludo "Bienvenido" en la barra superior, ubicar el botón interactivo de Lista de Compra usando `ShoppingCartIcon`.
   - Mostrar un badge numérico con la cantidad de insumos en lista.
   - Si N = 0: tono neutro. Si N > 0: color primario destacado.
   - Al hacer clic, abrir un menú desplegable o Drawer lateral con:
     * Lista de insumos seleccionados, proveedor y costo unitario.
     * Botón para remover ítems individuales (`TrashIcon`) y botón "Vaciar lista".
     * Botón principal "Preparar Orden de Compra" que redirija a `/operations/purchases/new`.

3. Pantalla de Creación de Compra (`/operations/purchases/new`):
   - Cargar automáticamente los insumos seleccionados desde la lista de compras temporal.
   - Agrupar visualmente la lista por Proveedor para facilitar cotizaciones separadas.
   - Botón "Imprimir Lista de Compra" con `PrintIcon` que active `window.print()`.
   - Reglas de impresión (`@media print`):
     * Ocultar barras de navegación, menú lateral y botones de acción.
     * Renderizar formato de hoja de campo limpia con casillas de verificación manual ([ ]), insumo, presentación, cantidad requerida y espacio para anotaciones.

4. Conciliación y Registro Final:
   - Cada fila de insumo debe tener un control de estado: "Conseguido / Recibido" (marcado por defecto en `true`).
   - El operario puede desmarcar los insumos que no se pudieron adquirir en campo.
   - Al guardar la compra:
     * Solo los insumos marcados como conseguidos se envían al backend para registrar la compra e ingresar a Inventario.
     * Los insumos conseguidos se eliminan de la lista temporal.
     * Los insumos no conseguidos permanecen en la lista con una advertencia o se limpian según elección del usuario.

VALIDACIÓN
- Ejecutar `pnpm --filter web build` y confirmar código 0 sin errores de compilación ni de imports de iconos.

FORMATO DE CIERRE
Entregar exclusivamente este reporte:

CIRCUITO DE COMPRAS Y BIBLIOTECA DE ICONOS — CIERRE
• Estado: COMPLETADO / ERROR
• Biblioteca de iconos creada: SÍ / NO
• Badge global en header integrado: SÍ / NO
• Vista de impresión de compras (@media print): SÍ / NO
• Conciliación de insumos conseguidos vs faltantes: SÍ / NO
• JavaScript nativo: OK
• TypeScript introducido: NO
• CSS Modules: OK
• Build web: OK / ERROR
• Archivos modificados: [lista]
• Bloqueos: NINGUNO / [Detalle]