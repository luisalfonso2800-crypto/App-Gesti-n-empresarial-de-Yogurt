TAREA CONTROLADA — GARANTIZAR RENDERIZADO Y APERTURA DEL MODAL NUEVO PROVEEDOR EN CHECKLIST

OBJETIVO TÉCNICO EXACTO
En `apps/web/src/app/operations/purchases/new/page.jsx`:
1. Asegurar que el modal de Nuevo Proveedor se renderice SIEMPRE de forma incondicional en la raíz del componente, sin depender de si la vista está en el Checklist (Fase 1) o en el Formulario (Fase 2).
2. Conectar el evento onClick del botón "+ Nuevo Proveedor" del Checklist para que active `setShowProvModal(true)` y almacene el índice o ID del ítem de la lista (`item.idPrecioProveedor` o `item.idInsumo`).
3. Al guardar el proveedor:
   - Persistir en BD vía `POST /suppliers`.
   - Insertar el nuevo proveedor en el estado `proveedores`.
   - Asignar este proveedor al ítem del checklist que disparó el modal (`customProveedorId`).
   - Cerrar el modal.

FUENTES DE VERDAD OBLIGATORIAS
- apps/web/src/app/operations/purchases/new/page.jsx
- apps/web/src/app/operations/purchases/new/new-purchase.module.css

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo.
3. El modal debe montarse antes del último `</div>` del return principal, fuera de cualquier condición ternaria de cambio de fase (`step === 1` o `step === 2`).

ESPECIFICACIÓN PUNTUAL

1. Verificación de Renderizado en Raíz:
   - Revisar el JSX devuelto por `NewPurchasePage`.
   - Si `{showProvModal && (...)}` está dentro de un bloque condicional que solo se muestra en Fase 2, MOVERLO fuera, dejándolo al nivel global del componente para que pueda abrirse desde cualquier fase.

2. Manejador de Apertura en la Tarjeta de Checklist:
   - En el botón:
     ```jsx
     <button
       type="button"
       className={styles.btnNewSupplier}
       onClick={() => {
         setTargetChecklistItemId(item.idPrecioProveedor || item.id);
         setShowProvModal(true);
       }}
     >
       + Nuevo Proveedor
     </button>
     ```

3. Actualización Inmediata en Guardado:
   - En `handleCreateProv`:
     ```javascript
     const res = await apiClient.post('/suppliers', formData);
     const newProv = res.data;
     setProveedores(prev => [...prev, newProv]);
     if (targetChecklistItemId) {
       setChecklistData(prev => ({
         ...prev,
         [targetChecklistItemId]: {
           ...prev[targetChecklistItemId],
           customProveedorId: newProv.id
         }
       }));
     }
     setShowProvModal(false);
     ```

VALIDACIÓN
- `pnpm --filter web build` debe compilar sin errores (Código 0).
- En el navegador, al hacer clic en "+ Nuevo Proveedor" en la vista de Checklist, el modal debe aparecer en primer plano sobre la pantalla.

FORMATO DE REPORTE
Reporte estándar confirmando la ubicación del JSX del modal y el código de salida del build.