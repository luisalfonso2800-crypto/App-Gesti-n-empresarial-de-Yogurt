TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Rediseñar la cabecera y barra de acciones del Checklist de Compras (`ShoppingChecklistHeader.jsx` o componente de cabecera en `apps/web/src/app/purchases/new/` y su CSS) alineándolo con la identidad visual MANNÁ, agregando iconografía SVG en botones y estructurando la tarjeta de metadatos de la orden.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/purchases/new/components/ShoppingChecklistHeader.jsx` (o donde reside el bloque de la cabecera)
2. `apps/web/src/app/purchases/new/new-purchase.module.css`

INSTRUCCIONES TÉCNICAS:

1. En el componente de cabecera:
   - Agrupar la navegación superior con enlace limpio:
     * Icono `<ArrowLeft size={16} />` + "Volver a Compras".
   - Encabezado principal:
     * Título institucional: `Checklist de Adquisición y Abastecimiento`.
     * Subtítulo: `Gestión física de compras en planta, verificación de unidades por empaque y control de recepción en bodega.`
   - Barra de metadatos del lote/orden (`.orderMetaBar`):
     * Código: `<span className={styles.codeBadge}><Tag size={13} /> {orderCode}</span>`
     * Origen: `Abastecimiento por Faltante de Producción`
     * Fecha: `📅 {fecha}`
     * Estado: Badge estilizado (`.statusPending`).
   - Botones de acción con iconos integrados:
     * Botón 1: `<Printer size={15} /> Imprimir Checklist` (estilo outline/neutral institucional).
     * Botón 2: `<PlusCircle size={15} /> Añadir Pendiente` (estilo ámbar/crema sutil).
     * Botón 3: `<Receipt size={15} /> Registrar Compras / Imprevistos` (estilo verde bosque oscuro `#1B4332`).
   - Mantener el componente bajo 125 líneas (SRP).

2. En `new-purchase.module.css`:
   - Definir estilos de la cabecera y barra de metadatos:
     ```css
     .headerContainer {
       margin-bottom: 24px;
       display: flex;
       flex-direction: column;
       gap: 12px;
     }
     .orderMetaBar {
       display: flex;
       align-items: center;
       gap: 12px;
       flex-wrap: wrap;
       padding: 8px 14px;
       background: #FAF9F6;
       border: 1px solid #EFECE6;
       border-radius: 8px;
     }
     .codeBadge {
       font-weight: 700;
       font-family: monospace;
       color: #1F2937;
       display: inline-flex;
       align-items: center;
       gap: 6px;
     }
     .actionsRow {
       display: flex;
       gap: 10px;
       flex-wrap: wrap;
       margin-top: 8px;
     }
     .btnAction {
       display: inline-flex;
       align-items: center;
       gap: 8px;
       font-size: 13px;
       font-weight: 600;
       padding: 8px 16px;
       border-radius: 8px;
       cursor: pointer;
       transition: all 0.2s ease;
     }
     ```

VERIFICACIÓN:
1. `node --check apps/web/src/app/purchases/new/components/ShoppingChecklistHeader.jsx` (o archivo intervenido)
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La cabecera adquiere orden estructural con título, descripción y barra de metadatos legible.
- Los tres botones de acción muestran sus iconos correspondientes con la paleta MANNÁ.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.