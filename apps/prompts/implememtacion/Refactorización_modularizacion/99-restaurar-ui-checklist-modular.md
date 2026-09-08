TAREA DE RESTAURACIÓN Y RECONEXIÓN — RECUPERAR UI COMPLETA DEL CHECKLIST EN COMPONENTES MODULARES

EVIDENCIA CONFIRMADA
En `operations/purchases/new`, la vista del checklist se redujo a una lista HTML cruda (`Checklist Activo` con `<button>Remover</button>`) sin estilos ni componentes visuales.
Causa: Durante la extracción con scripts Node en el refactor de Fase 1, `ChecklistPhase.jsx`, `ChecklistSection.jsx` y `ChecklistItemRow.jsx` se poblaron con un stub/esqueleto provisional en lugar de portar el JSX original completo y sus clases CSS de `new-purchase.module.css`.

OBJETIVO TÉCNICO EXACTO
Restaurar la UI completa y enriquecida del checklist portando el código original desde `apps/web/src/app/operations/purchases/new/page.backup.jsx` (o del historial de git si no existe) hacia los nuevos componentes modulares:

1. Fuente de Verdad para Restauración:
   - Inspeccionar `apps/web/src/app/operations/purchases/new/page.backup.jsx` (bloque de render de Fase 1 / Checklist).
   - Localizar el markup visual completo:
     * Banner de resumen con total estimado y progreso (X de Y conseguidos).
     * Tarjeta/fila interactiva de cada insumo con:
       - Nombre del insumo y presentación.
       - Selector/badge de proveedor sugerido.
       - Alerta visual de duplicados cruzados entre órdenes activas (`activeOrdersDuplicateWarning`).
       - Botón estilizado de "Conseguido / Marcar" (con icono de check).
       - Botón estilizado de "Descartar" o remover del checklist.
     * Botón de acción principal: "Continuar a Formulario / Fase 2" con estilos del módulo CSS.

2. Reconexión Modular sin Romper Arquitectura:
   - En `ChecklistItemRow.jsx`:
     Portar el render exacto de la tarjeta de insumo usando `styles.checkCard`, badges de duplicados y botones de acción con sus clases originales.
   - En `ChecklistSection.jsx`:
     Contener el encabezado de progreso y mapear los ítems invocando `<ChecklistItemRow />`.
   - En `ChecklistPhase.jsx`:
     Ensamblar la cabecera, la sección y los botones de transición a la Fase 2 manteniendo `styles.container` y layout general.
   - Conectar los eventos reales (`onToggleComplete`, `onRemoveItem`, `onProceedToPhase2`) provenientes de `useChecklistManager`.

3. Preservar Estilos CSS Modules:
   - Importar `import styles from '../new-purchase.module.css';` en cada uno de estos tres componentes.
   - PROHIBIDO alterar o renombrar clases en `new-purchase.module.css`.

4. MODO RÁPIDO: PROHIBIDO ejecutar `pnpm build` o borrar `.next`. Validar sintaxis con `node --check`.

FUENTES DE VERDAD OBLIGATORIAS
- apps/web/src/app/operations/purchases/new/page.backup.jsx (código fuente original)
- apps/web/src/app/operations/purchases/new/new-purchase.module.css
- apps/web/src/app/operations/purchases/new/components/ChecklistPhase.jsx
- apps/web/src/app/operations/purchases/new/components/ChecklistSection.jsx
- apps/web/src/app/operations/purchases/new/components/ChecklistItemRow.jsx
- apps/web/src/components/ui/icons.jsx
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md

VALIDACIÓN LIGERA (SIN BUILD)
- Comprobar sintaxis con `node --check` sobre los componentes modificados.
- Confirmar que al recargar `http://localhost:3000/operations/purchases/new` el checklist recupere su apariencia gráfica completa (tarjetas, badges, progreso y diseño idéntico al original).

FORMATO DE REPORTE
Entregar reporte técnico detallando el markup restaurado en cada subcomponente y confirmación de render visual en el navegador.