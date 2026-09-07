TAREA CONTROLADA — CONEXIÓN EFECTIVA DEL BOTÓN "+ NUEVO PROVEEDOR" Y VISIBILIDAD DEL MODAL

OBJETIVO TÉCNICO EXACTO
Corregir en `apps/web/src/app/operations/purchases/new/page.jsx` y su CSS module la apertura del modal al hacer clic en "+ Nuevo Proveedor". Actualmente el botón no dispara ninguna acción visible.

FUENTES DE VERDAD OBLIGATORIAS
- apps/web/src/app/operations/purchases/new/page.jsx
- apps/web/src/app/operations/purchases/new/new-purchase.module.css
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo (.module.css).
3. El modal debe renderizarse en la raíz del componente (nivel superior del JSX, fuera de las tarjetas) con `position: fixed` y `z-index` elevado para evitar recortes de overflow.

ESPECIFICACIÓN PUNTUAL DE CORRECCIÓN

1. ESTADO Y VINCULACIÓN DEL BOTÓN (+ Nuevo Proveedor):
   - Crear o verificar el estado en la raíz del componente:
     `const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);`
     `const [activeItemIndexForSupplier, setActiveItemIndexForSupplier] = useState(null);`
   - En el botón "+ Nuevo Proveedor" de cada tarjeta:
     `<button type="button" onClick={() => { setActiveItemIndexForSupplier(index); setIsSupplierModalOpen(true); }} className={styles.btnNewSupplier}>+ Nuevo Proveedor</button>`
   - Asegurar que `type="button"` evite envíos accidentales de formulario.

2. POSICIONAMIENTO Y ESTILOS DEL MODAL (CSS MODULE):
   - Mover el JSX del modal `<div className={styles.modalOverlay}>` al final del return del componente principal (antes del cierre del `</div>` contenedor).
   - En `new-purchase.module.css`, garantizar:
     * `.modalOverlay`: `position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;`
     * `.modalContent`: `background: #ffffff; border-radius: 8px; padding: 24px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto; z-index: 10000;`

3. GUARDADO Y AUTO-SELECCIÓN:
   - Al enviar el formulario del modal:
     * `POST /suppliers` (vía `apiClient`).
     * Al recibir HTTP 201 con el nuevo proveedor creado:
       1. Añadirlo a la lista local de proveedores (`setProveedores(prev => [...prev, newSupplier])`).
       2. Si `activeItemIndexForSupplier !== null`, actualizar inmediatamente el proveedor de esa tarjeta específica con el ID del nuevo proveedor creado.
       3. Limpiar los campos del formulario del modal.
       4. Cerrar el modal (`setIsSupplierModalOpen(false)`).

VALIDACIÓN OBLIGATORIA
- `pnpm --filter web build` debe finalizar con código de salida 0.
- Al hacer clic en "+ Nuevo Proveedor", el modal debe abrirse en pantalla completa de inmediato.
- Al guardar un proveedor de prueba, debe cerrarse el modal y quedar seleccionado en el dropdown de esa tarjeta.

FORMATO DE REPORTE
Entregar únicamente el reporte estándar indicando estado, corrección del evento onClick y estilos, y confirmación de build limpio.