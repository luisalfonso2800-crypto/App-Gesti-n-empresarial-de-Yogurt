TAREA CONTROLADA — INTEGRACIÓN COMPLETA DE DATOS EN EL CHECKLIST DE COMPRAS

OBJETIVO TÉCNICO EXACTO
Resolver las llamadas API (evitar 404) y enriquecer el Checklist en `apps/web/src/app/operations/purchases/new/page.jsx` para que no solo muestre nombres, sino todos los datos operativos y técnicos requeridos para la compra en campo.

FUENTES DE VERDAD
- apps/web/src/app/operations/purchases/new/page.jsx
- apps/web/src/app/catalog/supplier-prices/page.jsx
- apps/web/src/app/catalog/supplies/page.jsx
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo con soporte `@media print`. PROHIBIDO Tailwind.
3. Consumir la API usando la URL base configurada para NestJS (no usar rutas relativas `/api/...` que devuelven 404 en el puerto de Next.js).
4. NO alterar aún el formulario de Fase 2 ni el backend; dejar el Checklist 100% operativo con todos sus datos.

ALCANCE PUNTUAL

1. Resolución Cruzada de Datos (Storage + API):
   - Al leer `sessionStorage.getItem('selectedForPurchase')`:
     * Consultar los catálogos correspondientes (Proveedores, Insumos y Precios de Proveedores) usando el cliente/helper HTTP del proyecto.
     * Cruzar por IDs para obtener la ficha completa de cada insumo.
   - En `supplier-prices/page.jsx`: al momento de hacer clic en "Comprar" o "Continuar a Orden de Compra", enriquecer el payload guardado en el storage con el objeto completo:
     `{ id, idInsumo, idProveedor, insumoNombre, proveedorNombre, marca, categoria, presentacionCompra, contenidoBase, unidadMedida, stockMinimo, precioCompra }`.

2. Renderizado del Checklist por Proveedor:
   - Agrupar la lista por Proveedor. Cada sección muestra un encabezado claro con el nombre del proveedor.
   - Cada fila del checklist debe mostrar de forma visible y ordenada:
     * Checkbox de verificación ("Conseguido").
     * Nombre del Insumo (en negrita) y Categoría (ej. Materia Prima / Empaque).
     * Marca del producto suministrado.
     * Presentación y Desglose: Empaque comercial (ej. Bulto, Paca), Contenido neto (ej. 50) y Unidad de medida (`kg`, `g`, `L`, `ml`, `Unidades`).
     * Stock Mínimo del insumo (texto informativo tenue de solo lectura).
     * Cantidad Solicitada (input numérico editable, inicializado en 1 o la cantidad cotizada).
     * Precio de Compra por empaque ($ editable).
     * Costo Base Unitario calculado en tiempo real ($/kg, $/L, $/und).
     * Selector de Estado operativo: "Conseguido", "Agotado en Tienda", "Proveedor ya no suministra".

3. Formato de Impresión (`window.print()`):
   - Estilos `@media print` para generar una planilla limpia:
     * Ocultar barras de navegación, botones y avisos.
     * Mostrar tabla formal con casillas para marcar a lápiz, insumo, marca, presentación, cantidad y notas de compra.

VALIDACIÓN
- Compilación limpia con `pnpm --filter web build` (Código 0).
- La consola del navegador no debe registrar errores 404 al cargar la página.
- El Checklist debe mostrar todos los datos (nombre, marca, presentación desglosada, stock mínimo, precio y costo base) para los 4 insumos de la captura.

FORMATO DE CIERRE
Entregar únicamente el reporte estándar indicando estado, campos vinculados y confirmación de build limpio.