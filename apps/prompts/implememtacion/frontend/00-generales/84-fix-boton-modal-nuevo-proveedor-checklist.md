TAREA CONTROLADA — BOTÓN EXTERNO Y MODAL COMPLETO DE ALTA DE PROVEEDOR EN CHECKLIST

OBJETIVO TÉCNICO EXACTO
Corregir la experiencia de cambio de proveedor en `apps/web/src/app/operations/purchases/new/page.jsx`:
1. Retirar la opción "+ Registrar Proveedor Rápido" de adentro del `<select>`.
2. Colocar un botón interactivo contiguo al select: "+ Nuevo Proveedor".
3. Al pulsar este botón, abrir un modal flotante con los campos exactos del modelo `Proveedor` (idéntico al modal de `/catalog/suppliers`).
4. Al guardar el nuevo proveedor mediante `POST /api/v1/suppliers`:
   - Persistir en base de datos.
   - Refrescar la lista de proveedores disponibles en la vista.
   - Seleccionar automáticamente el proveedor recién creado en la tarjeta activa.
   - Cerrar el modal limpiamente sin recargar la página ni perder el estado del checklist.

FUENTES DE VERDAD OBLIGATORIAS
- apps/web/src/app/operations/purchases/new/page.jsx
- apps/web/src/app/operations/purchases/new/new-purchase.module.css
- apps/web/src/app/catalog/suppliers/page.jsx (modelo de referencia del modal funcional)
- docs/diagnosticos/DIAGNOSTICO_MODULO_COMPRAS_BACKEND.md
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo (.module.css). PROHIBIDO Tailwind.
3. Usar el cliente HTTP unificado del proyecto apuntando a `/api/v1/suppliers`.

ESPECIFICACIÓN PUNTUAL DE IMPLEMENTACIÓN

1. ESTRUCTURA VISUAL EN "NUEVAS CONDICIONES COMERCIALES":
   - En el bloque "Proveedor":
     * Un contenedor horizontal (`display: flex; gap: 8px; align-items: center;`).
     * El `<select>` que contiene únicamente los proveedores existentes de la BD.
     * Un botón contiguo tipo botón de acción (`type="button"`): `+ Nuevo Proveedor` o `+ Registrar`.
   - Al hacer clic en este botón, setear el estado `isSupplierModalOpen: true`.

2. MODAL FORMAL DE ALTA EN CALIENTE (Campos requeridos de la entidad Proveedor):
   El modal debe replicar los campos de `apps/web/src/app/catalog/suppliers/page.jsx`:
   - Nombre / Razón Social * (Requerido, `<input type="text">`)
   - NIT/Cédula * (Requerido, `<input type="text">`)
   - Nombre Contacto (`<input type="text">`)
   - Teléfono (`<input type="text">`)
   - Email (`<input type="email">`)
   - Dirección (`<input type="text">`)
   - Observaciones (`<textarea>` o `<input type="text">`)
   - Checkbox "Activo" (marcado por defecto en `true`)
   - Botones de pie: [Cancelar] (cierra modal) y [Guardar] (envía petición).

3. FLUJO ASÍNCRONO DE GUARDADO:
   - Al enviar el formulario del modal:
     * Validar campos obligatorios (`nombre`, `nitCedula`).
     * Enviar petición `POST /suppliers` (o `/api/v1/suppliers` según apiClient).
     * Tras recibir HTTP 201:
       - Añadir el nuevo objeto proveedor a la lista local `proveedores`.
       - Asignar el ID de este nuevo proveedor a la tarjeta del insumo en edición (`customProveedorId`).
       - Limpiar el formulario del modal y cerrarlo.
       - Mostrar notificación de éxito / feedback visual rápido.

VALIDACIÓN OBLIGATORIA
- `pnpm --filter web build` debe compilar sin errores (Código de salida 0).
- Probar que al pulsar "+ Nuevo Proveedor" se abra el modal, permita diligenciar los datos, los guarde en la BD y quede seleccionado inmediatamente en el desplegable.

FORMATO DE REPORTE
Entregar únicamente el reporte estándar indicando estado, componentes intervenidos y confirmación de compilación limpia.