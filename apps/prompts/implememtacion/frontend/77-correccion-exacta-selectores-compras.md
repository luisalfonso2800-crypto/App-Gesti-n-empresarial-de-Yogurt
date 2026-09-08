TAREA CONTROLADA — CORRECCIÓN EXACTA DE UI: CHECKLIST Y SELECTORES EN CASCADA (COMPRAS)

OBJETIVO TÉCNICO EXACTO
El formulario actual de compras (`/operations/purchases/new`) construyó inputs de texto plano y no lee bien el carrito. Debes refactorizar la UI estrictamente para:
1. Checklist: Leer correctamente el JSON de `sessionStorage.getItem('selectedForPurchase')` y renderizar los nombres de proveedores e insumos reales.
2. Selectores Interactivos (Buscadores): Reemplazar los inputs de texto de "Proveedor" e "Insumo" por componentes de búsqueda desplegable (Combobox / Datalist custom).
3. Filtrado en Cascada: El desplegable de Insumos SOLO debe mostrar productos asociados al proveedor seleccionado.
4. Altas en caliente: Botones de "+ Añadir" dentro de los desplegables que abran modales reales para registrar en base de datos.
5. Desglose de Presentación: Separar "Bulto 50kg" en: Empaque ("Bulto"), Contenido ("50") y Unidad (Dropdown: "kg", "g", "L", "ml"). Añadir campo Marca y visualización de Stock Mínimo.

FUENTES DE VERDAD OBLIGATORIAS
- apps/web/src/app/operations/purchases/new/page.jsx
- apps/web/src/app/operations/purchases/new/new-purchase.module.css

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo. PROHIBIDO Tailwind.
3. Para los desplegables de búsqueda, construye un componente custom o usa `<datalist>` conectado reactivamente al estado para permitir filtrado mientras se escribe.

ESPECIFICACIÓN PUNTUAL (CERO SUPOSICIONES)

1. REPARACIÓN DEL CHECKLIST (Fase 1)
   - El `sessionStorage` guarda un array de objetos desde `/catalog/supplier-prices`. Asegúrate de parsearlo con `JSON.parse()`.
   - Mapea correctamente las propiedades de ese objeto (ej. `item.insumo.nombre`, `item.proveedor.nombre`, `item.precioCompra`).
   - Si no hay datos, mostrar un aviso claro. Si los hay, agrupar por proveedor y renderizar el nombre del insumo, cantidad a pedir y checkboxes de estado.

2. SELECTOR DE PROVEEDOR (Buscador Interactivo)
   - UI: Un input de texto que, al escribir, despliega una lista (`<ul>` posicionado de forma absoluta o un `<datalist>`) con los proveedores filtrados desde la DB.
   - Si el proveedor existe: Al hacer clic, se guarda su ID en el estado `selectedProveedor`.
   - Si no existe: Mostrar en la lista un botón `+ Añadir nuevo proveedor`.
   - Modal de Nuevo Proveedor: Formulario superpuesto para capturar Razón Social, NIT, Teléfono. Al guardar (POST a API), seleccionar automáticamente este proveedor.

3. SELECTOR DE INSUMOS EN CASCADA (Buscador por Fila)
   - Condición: Este desplegable de búsqueda se alimenta de un array de insumos filtrado. SOLO muestra insumos que el `selectedProveedor` ha suministrado antes.
   - UI: Al escribir, filtra los insumos de ese proveedor.
   - Si el insumo no está en la lista: Mostrar botón `+ Registrar nuevo insumo`.
   - Modal de Nuevo Insumo: Captura Nombre, Categoría, Unidad Base de inventario y Stock Mínimo. Al guardar, se asocia a la fila.

4. DESGLOSE DE PRESENTACIÓN, MARCA Y PRECIO (Por Fila)
   - Marca: Input con `<datalist>` de marcas existentes.
   - Empaque (Texto): ej. "Bulto", "Paca", "Unidad".
   - Contenido Neto (Número): ej. "50", "12".
   - Unidad de Medida (Select `<option>`): Opciones fijas: `kg`, `g`, `L`, `ml`, `Unidades`.
   - Precio: Input numérico. Precarga el último precio del `sessionStorage` o DB, pero DEBE ser 100% editable por si el proveedor cambió la tarifa.
   - Stock Mínimo: Un simple `<span>` o texto de solo lectura mostrando el stock mínimo del insumo seleccionado (ej. "Stock Mínimo: 20 kg").

5. CÁLCULOS Y TOTALES EN VIVO
   - Subtotal por fila = `(Cantidad de empaques * Precio)`.
   - Total Neto a Bodega = `(Cantidad de empaques * Contenido Neto) + Unidad`.
   - El Total general debe actualizarse instantáneamente al modificar cantidades o precios.

VALIDACIÓN OBLIGATORIA
- `pnpm --filter web build` debe compilar sin errores (Código 0).
- Los inputs deben permitir escritura manual Y selección de opciones existentes.

FORMATO DE SALIDA
Reporte estándar de estado, archivos modificados y confirmación de build.