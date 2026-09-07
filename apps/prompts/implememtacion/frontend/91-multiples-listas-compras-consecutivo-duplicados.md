TAREA CONTROLADA — ENTIDAD LISTAS/ÓRDENES DE COMPRA CON CÓDIGO CONSECUTIVO Y CONTROL DE DUPLICADOS CRUZADOS

OBJETIVO TÉCNICO EXACTO
Implementar la persistencia y gestión de múltiples listas de compra preparadas:
1. En Backend / Base de Datos:
   - Crear el modelo o entidad `OrdenCompra` / `ListaCompraPreparada`:
     * `id` (UUID, primary key)
     * `codigo` (string único, consecutivo autogenerado `ORD-2026-XXXX`)
     * `nombre` (string editable, valor por defecto ej: "Lista de Compras #1", "Ruta Abastos", etc.)
     * `estado` (enum o string: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA')
     * `createdAt` (DateTime)
     * Relación con ítems detallados: `insumoId`, `proveedorId`, `presentacionId`, `cantidad`, `precioEstimado`, `estadoItem` ('PENDIENTE' | 'COMPRADO' | 'DESCARTADO').
   - Endpoints REST en `/purchases/orders`:
     * `POST /purchases/orders`: Crear orden a partir de los ítems del carrito.
     * `GET /purchases/orders/active`: Obtener todas las órdenes activas (PENDIENTE o EN_PROCESO) con sus ítems.
     * `GET /purchases/orders/:id`: Obtener el detalle de una orden puntual para su Checklist.
     * `PATCH /purchases/orders/:id`: Permitir cambiar el nombre o estado de la orden.
     * `PATCH /purchases/orders/:id/items/:itemId`: Actualizar el estado de un ítem ('COMPRADO' o 'DESCARTADO').

2. En Frontend (`/operations/purchases` - Vista Principal de Compras):
   - Integrar un panel superior: "Listas de Compra Preparadas / En Ruta".
   - Cada lista se muestra como una tarjeta interactiva con:
     * Código (`ORD-2026-XXXX`), Nombre editable in situ (con icono `Pencil` o `Edit3`).
     * Contador de ítems pendientes vs conseguidos.
     * Botón: "Abrir Checklist Operativo" que redirige a `/operations/purchases/new?orderId=UUID`.

3. En Frontend (`/operations/purchases/new` - Checklist Operativo):
   - Si recibe `orderId` por query param, consumir `GET /purchases/orders/:id` y cargar los ítems correspondientes.
   - **Control de Duplicados Cruzados:** Comparar los insumos de esta lista con los ítems de las demás órdenes activas. Si un insumo coincide en otra orden pendiente:
     * Renderizar en la tarjeta una alerta visible de advertencia:
       `[Aviso: Este insumo también se encuentra asignado en ORD-XXXX - (Nombre de la otra lista)]`
       evitando que dos compradores en diferentes zonas compren lo mismo por descuido.
   - Al dar "Conseguido" o "Descartar", marcar el ítem en la base de datos de esa orden. Cuando todos estén procesados, actualizar la orden a 'COMPLETADA'.

4. Conversión desde el Carrito:
   - Al hacer clic en "Preparar Orden" (en la barra inferior o modal del carrito), en lugar de guardar solo en sessionStorage, enviar el payload a `POST /purchases/orders`, limpiar el carrito global y redirigir al listado o al nuevo Checklist.

5. MODO RÁPIDO: PROHIBIDO compilar con `pnpm build` o purgar `.next`. Validar con `node --check`.

FUENTES DE VERDAD OBLIGATORIAS
- apps/api/prisma/schema.prisma
- apps/api/src/purchases/ (servicios, controladores, repositorios)
- apps/web/src/app/operations/purchases/page.jsx
- apps/web/src/app/operations/purchases/new/page.jsx
- apps/web/src/components/ui/icons.jsx
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo (.module.css). PROHIBIDO Tailwind.
3. Consumo estricto de iconos desde `apps/web/src/components/ui/icons.jsx` (utilizar iconos como `ClipboardList`, `AlertTriangle`, `Pencil`, `CheckCircle2`, `Clock`).
4. Persistencia en PostgreSQL mediante Prisma. Aplicar migraciones o push sin alterar datos existentes.

VALIDACIÓN LIGERA (SIN BUILD PESADO)
- Verificar sintaxis con `node --check` en los archivos modificados.
- Comprobar que al preparar una orden se genere el código `ORD-2026-XXXX`, aparezca en el hub de compras y al abrirla muestre el checklist con la advertencia si hay duplicados con otra lista activa.
- NO ejecutar `pnpm build`.

FORMATO DE REPORTE
Entregar reporte estándar indicando modelo Prisma creado, endpoints implementados en el servicio de compras, soporte de duplicados en UI y confirmación de sintaxis limpia.