TAREA CONTROLADA — EVOLUCIÓN MULTI-LISTAS DE COMPRAS, HISTORIAL CONSOLIDADO Y RECONEXIÓN FASE 2

OBJETIVO TÉCNICO
Evolucionar el módulo de compras hacia un modelo multi-lista con selector de destino, fusión inteligente de órdenes, historial de compras consolidado por lista con detalle discriminado desplegable, y reconectar el flujo de navegación roto hacia el Formulario de Compra (Fase 2). Todas las acciones interactivas deben usar iconografía estandarizada de `lucide-react`, respetando estrictamente `docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md`.

ICONOGRAFÍA OBLIGATORIA (LUCIDE REACT)
- Importar exclusivamente desde `lucide-react` o `@/components/ui/icons`. Cero SVGs inline crudos.
- Mapeo iconográfico:
  * Retorno a compras: `ArrowLeft`
  * Fusión de listas: `GitMerge`
  * Editar nombre de lista: `Pencil` o `Edit3`
  * Eliminar lista / quitar ítem de orden: `Trash2`
  * Cambiar / transferir lista: `ArrowRightLeft`
  * Crear / gestionar lista: `ListPlus`
  * Nueva compra directa / Fase 2: `ShoppingCart` o `PlusCircle`
  * Acordeón historial de listas: `ChevronDown` / `ChevronUp`
  * Indicador de lista activa: `Layers` o `BookmarkCheck`

ALCANCE DE IMPLEMENTACIÓN

1. CartContext (`apps/web/src/context/CartContext.jsx`):
   - Migrar el estado a estructura multi-lista:
     `{ activeListId: string, lists: { [id]: { id, name, customName, createdAt, items: [] } } }`
   - Formato nominal: `Lista de Compra - [customName] - [DD/MM/YYYY]`.
   - Métodos expuestos: `createList(customName)`, `renameList(id, newCustomName)`, `deleteList(id)`, `setActiveList(id)`, `mergeLists(sourceIds, targetId)`, `moveItem(fromListId, toListId, itemKey)`.
   - Lógica de Fusión Inteligente:
     * Agrupar por clave única `item.insumoId + '_' + item.presentacionId + '_' + item.proveedorId`.
     * Si coincide la clave, sumar `cantidadSolicitada`. Si difiere la presentación o el proveedor, preservar como ítems separados.

2. Precios de Proveedores (`apps/web/src/app/catalog/supplier-prices/`):
   - En `PricesComparisonTable.jsx` y `useCartManager.js`:
     * Al presionar "Comprar", si existen múltiples listas y no se ha definido una activa en la sesión, abrir selector para definir la lista destino (una sola vez por sesión).
     * Disparar toast informativo con botón interactivo "Cambiar de lista" (`ArrowRightLeft`) para reasignar ese producto puntual.
   - En cabecera/filtros: Chip visual `Lista Activa: [Nombre]` con icono `Layers` y botón para alternar.
   - En `CartSidebar.jsx` y `Header.jsx`:
     * Listener `mousedown` sobre `ref` para cerrar automáticamente el dropdown al hacer clic fuera (`click-outside`).
     * Selector de pestañas para inspeccionar insumos de cada lista por separado.

3. Módulo de Compras Principal (`apps/web/src/app/operations/purchases/`):
   - En tarjetas de "Listas Preparadas / En Ruta":
     * Botón para editar nombre personalizado (`Pencil`).
     * Botón para eliminar lista (`Trash2`) con modal de confirmación.
     * Botón de acción masiva "Fusionar Listas" (`GitMerge`) con soporte de selección múltiple.
   - Botones de Acción Superior:
     * Botón "Crear / Gestionar Lista" (`ListPlus`): Permite elegir insumos del catálogo o registrar nuevos y asignarlos a una lista nueva o existente.
     * Botón "Nueva Compra" (`ShoppingCart`): RECONEXIÓN CRÍTICA. Debe redirigir de forma correcta y limpia hacia el formulario de compra (Fase 2), pasando el contexto o identificador necesario sin pantallas en blanco ni desconexiones.
   - Tabla Inferior — Historial Consolidado de Listas Compradas:
     * Corregir el enfoque: la tabla NO muestra IDs de proveedores crudos; muestra las **Listas de Compra Finalizadas/Compradas**.
     * Columnas principales: Nombre de la Lista (`Lista de Compra - [customName] - [Fecha]`), Fecha de Registro/Finalización, Cantidad Total de Productos Comprados, Valor Final Acumulado ($) y Badge de Estado ("Comprada" / "Finalizada").
     * Acordeón interactivo (`ChevronDown` / `ChevronUp`): Al hacer clic en la fila de la lista, desplegar el detalle discriminado de todos los productos comprados en esa orden (Insumo, Proveedor, Presentación, Cantidad Recibida, Costo Unitario y Subtotal).

4. Checklist Operativo (`apps/web/src/app/operations/purchases/new/`):
   - Botón superior "← Volver a Compras" con icono `ArrowLeft` redirigiendo a `/operations/purchases`.
   - Reconexión de "Continuar a Formulario (Fase 2)": Validar que el botón navegue fluidamente hacia el formulario de recepción/confirmación pasando los datos procesados en el checklist sin estados huérfanos ni errores de enrutamiento.
   - Título superior: Mostrar el nombre canónico completo de la lista activa.
   - En cada tarjeta de insumo (`ChecklistItemRow.jsx`):
     * Selector "Mover a otra lista" (`ArrowRightLeft`).
     * Alerta de duplicados multi-lista: Si el insumo está en más de una orden, mostrar la cantidad de listas donde coincide, listar cada una y disponer un botón independiente `Trash2` ("Quitar de esta orden") por cada lista detectada.

REGLAS DE ARQUITECTURA Y VALIDACIÓN (STRICT)
1. Exclusivamente JavaScript nativo puro (.js, .jsx). PROHIBIDO TypeScript.
2. Uso de alias canónicos `@/*` para imports (`@/lib/api-client`, `@/context/CartContext`, etc.). Prohibidas rutas relativas profundas (`../../../../`).
3. Preservar clases de CSS Modules existentes; agregar únicamente estilos indispensables para acordeones, badges y selectores.
4. JSDoc obligatorio en la cabecera de cada archivo intervenido.
5. MODO RÁPIDO: PROHIBIDO ejecutar `pnpm build` o purgar `.next`. Validar sintaxis ligera con `node --check`.

REPORTE DE CIERRE
Entregar resumen detallando archivos editados, estado de la reconexión hacia Fase 2, iconografía implementada y validación sintáctica limpia.