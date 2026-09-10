TAREA CONTROLADA — ACCIONES OPERATIVAS REALES EN CHECKLIST DE COMPRAS Y TABLA DE RESUMEN

OBJETIVO TÉCNICO EXACTO
Refactorizar el componente `apps/web/src/app/operations/purchases/new/page.jsx` y su API para resolver la flexibilidad operativa de compras en campo:
1. "No Conseguido": Sustituir la lógica actual por dos acciones explícitas:
   - [Registrar Motivo y Mantener en Lista] (para buscar con otro proveedor más tarde).
   - [Registrar Motivo y Quitar de Lista] (novedad definitiva).
2. Flexibilidad Comercial: Permitir cambiar de Proveedor (con alta rápida en caliente), Marca o Presentación comercial si el producto se consiguió en condiciones distintas a la cotización inicial.
3. Acción Real "Conseguido": Al pulsar [✓ Conseguido], enviar la transacción al backend (`POST /api/v1/purchases`), asentar en Inventario y mover el insumo a una tabla inferior de "Resumen de Compras Registradas" para rectificación del usuario.

FUENTES DE VERDAD OBLIGATORIAS
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- docs/diagnosticos/DIAGNOSTICO_MODULO_COMPRAS_BACKEND.md
- apps/web/src/app/operations/purchases/new/page.jsx
- apps/web/src/app/operations/purchases/new/new-purchase.module.css
- apps/api/src/purchases/purchases.repository.js
- apps/api/src/purchases/purchases.service.js

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript/React (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo. PROHIBIDO Tailwind.
3. Toda mutación física de inventario debe realizarse dentro de `prisma.$transaction` en el backend.

ESPECIFICACIÓN PUNTUAL

1. ZONA "NO CONSEGUIDO":
   - Al activar el panel rojo de motivos (desplegable + input si es "Otro"):
     * Botón secundario: "Registrar motivo y mantener en lista".
       Marca el ítem visualmente como "Pendiente otro proveedor", guarda la bitácora y no lo borra del checklist.
     * Botón secundario: "Registrar motivo y descartar".
       Registra el faltante en base de datos/auditoría y elimina la tarjeta del checklist.

2. EDICIÓN EN CALIENTE DE CRITERIOS COMERCIALES (Al marcar Conseguido):
   - Enlace o botón "¿Comprado con otros datos? (Cambiar proveedor / marca / empaque)":
     * Selector de Proveedor alternativo con opción "+ Registrar Proveedor Rápido".
     * Input de Marca modificable.
     * Empaque comercial (texto), Contenido neto (número) y Unidad (`kg`, `g`, `L`, `ml`, `und`).
   - Al modificar estos valores, invocar `/purchases/simulate` para recalcular el ingreso neto y costo unitario oficial.

3. ACCIÓN "✓ CONSEGUIDO" Y TABLA DE RESUMEN:
   - El botón verde "✓ Conseguido" ejecuta el guardado en base de datos vía API.
   - Al recibir HTTP 201:
     * Retira el insumo del checklist activo y lo elimina del `sessionStorage`.
     * Agrega el registro a la sección "Resumen de Compras Asentadas en Sesión":
       Tabla con: Insumo | Proveedor | Marca | Cantidad Empaques | Neto a Bodega | Costo Base | Subtotal Pagado.
     * Muestra un botón "Limpiar Resumen" o "Finalizar Jornada de Compras".

VALIDACIÓN OBLIGATORIA
- `pnpm --filter api build` y `pnpm --filter web build` deben compilar sin errores (Código 0).
- Confirmar que al presionar "✓ Conseguido" se cree el registro en la base de datos y aparezca la fila en el Resumen.

FORMATO DE REPORTE
Entregar exclusivamente el reporte estándar con estado, componentes actualizados y confirmación de build limpio.