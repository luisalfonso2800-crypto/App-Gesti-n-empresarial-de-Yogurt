TAREA CONTROLADA — PURGA DE ALERTS, TOASTS UNIFICADOS Y SECCIÓN DE INSUMOS PENDIENTES CON MOTIVO

OBJETIVO TÉCNICO EXACTO
1. Eliminar definitivamente cualquier llamada a `alert()` o `confirm()` nativo del navegador en `apps/web/src/app/operations/purchases/new/page.jsx`.
2. Conectar las confirmaciones operativas al sistema de Toasts con iconos de Lucide React (`apps/web/src/components/ui/icons.jsx`).
3. Crear una nueva sección visual dedicada: **"Insumos Pendientes / No Conseguidos en Sesión"** (ubicada junto al resumen de compras asentadas).
4. Cuando el usuario elija un motivo y presione "Registrar motivo y mantener en lista":
   - Mover o marcar el insumo fuera del checklist activo.
   - Listarlo en la tabla de pendientes mostrando: Insumo, Presentación/Marca, Proveedor intentado, Estado (Badge amarillo "Pendiente"), y el Motivo registrado claramente al frente.
   - Brindar un botón rápido de "Reintentar" o "Devolver al Checklist" por si se consigue más tarde.
5. REGLA ESTRICTA DE RENDIMIENTO: PROHIBIDO ejecutar `pnpm build` o purgar `.next`. Validar únicamente con análisis estático (`node --check`).

FUENTES DE VERDAD OBLIGATORIAS
- apps/web/src/app/operations/purchases/new/page.jsx
- apps/web/src/app/operations/purchases/new/new-purchase.module.css
- apps/web/src/components/ui/icons.jsx
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo (.module.css). PROHIBIDO Tailwind.
3. Consumo estricto de iconografía mediante `apps/web/src/components/ui/icons.jsx` (importar o reexportar de `lucide-react` si falta alguno como `Clock`, `RotateCcw`, `AlertCircle`, `CheckCircle2`).
4. CERO alertas intrusivas nativas del sistema (`window.alert`, `alert`).

ESPECIFICACIÓN PUNTUAL DE IMPLEMENTACIÓN

1. Estado y Flujo de Insumos Pendientes (`page.jsx`):
   - Crear el estado:
     `const [pendingItems, setPendingItems] = useState([]);`
   - Al pulsar "Registrar motivo y mantener en lista" para un ítem:
     * Validar que se haya seleccionado un motivo.
     * Construir el objeto pendiente:
       `{ ...item, motivoNoConseguido: motivoSeleccionado, fechaRegistro: new Date().toLocaleTimeString() }`
     * Agregarlo a `pendingItems`: `setPendingItems(prev => [...prev, nuevoPendiente])`.
     * Remover la tarjeta del checklist activo o marcar su estado visual como transferido a pendientes.
     * Notificar vía Toast: `showNotification(`"${item.nombreInsumo}" movido a pendientes: ${motivoSeleccionado}`, 'info');`

2. Sección Visual: "Insumos Pendientes / No Conseguidos":
   - Renderizar este bloque abajo del checklist (o sobre el Resumen de Compras Asentadas) solo si `pendingItems.length > 0`:
     * Contenedor con borde ámbar/amarillo suave (`border: 1px solid #fde047; background: #fefce8;`).
     * Título: "Insumos Pendientes de Compra (No Conseguidos)" acompañado de un icono `Clock` o `AlertCircle`.
     * Tabla o listado compacto con columnas:
       - **Insumo**
       - **Proveedor / Presentación**
       - **Motivo Registrado** (Texto destacado al frente para no perder contexto)
       - **Estado** (Badge amarillo con texto "Pendiente")
       - **Acciones** (Botón con icono `RotateCcw` para devolverlo al Checklist activo si el operador decide reintentar).

3. Purga Exhaustiva de `alert()` y Conexión de Toasts:
   - Buscar y suprimir cualquier invocación a `alert(...)`.
   - "Registrar motivo y descartar":
     * Eliminar el ítem de la sesión.
     * Notificar con Toast: `showNotification('Insumo descartado de la orden.', 'warning')`.
   - "Conseguido":
     * Notificar con Toast de éxito: `showNotification('Compra registrada y asentada.', 'success')`.

4. Estilos en `new-purchase.module.css`:
   - Clases `.pendingSection`, `.tablePending`, `.badgePending`, `.btnReintentar`.
   - Mantener consistencia tipográfica y paleta corporativa.

VALIDACIÓN LIGERA (SIN BUILD PESADO)
- Verificar sintaxis con `node --check apps/web/src/app/operations/purchases/new/page.jsx`.
- Comprobar con búsqueda textual que no existan llamadas a `alert(`.
- NO ejecutar `pnpm build`.

FORMATO DE REPORTE
Entregar únicamente el reporte estándar indicando erradicación de alerts, estructura de la sección de pendientes implementada y confirmación de análisis sintáctico limpio.