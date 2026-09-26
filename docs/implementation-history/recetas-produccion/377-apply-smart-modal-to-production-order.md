TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Alinear el modal de "Planificar Nueva Orden" con el estándar institucional SmartModal de MANNÁ (cabecera verde bosque #1B4332, icono en badge, subtítulo operativo y botón de cierre estándar), reemplazando la cabecera blanca genérica actual.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos listados abajo.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/production/components/ProductionOrderModal.jsx` (o donde se monta la estructura del modal en `page.jsx`)
2. `apps/web/src/app/production/production.module.css` (o el CSS del modal de producción)

INSTRUCCIONES TÉCNICAS:
1. Reemplazar la barra superior blanca actual (`<h3>Planificar Nueva Orden</h3>`) por la cabecera canónica SmartModal:
   ```jsx
   <div className={styles.smartModalHeader}>
     <div className={styles.headerTitleGroup}>
       <div className={styles.headerIconBadge}>
         {/* Icono de planta/orden (ej: ClipboardList, Cog o Leaf de Lucide) */}
         <ClipboardList color="#4ADE80" size="{20}"/>
       </div>
       <div>
         <h3 className={styles.smartModalTitle}>Planificar Orden de Fabricación</h3>
         <p className={styles.smartModalSubtitle}>
           Configura el bache a producir, verifica el BOM en bodega y genera la trazabilidad del lote.
         </p>
       </div>
     </div>
     <button className={styles.smartModalCloseBtn} onClick={onClose} aria-label="Cerrar">
       <X size="{18}"/>
     </button>
   </div>