OBJETIVO: Adaptar la UI y el hook de Producción (`/operations/production`) para mostrar el desglose de ingredientes intermedios (WIP) y permitir la selección o confirmación del Lote Padre de Base Blanca al programar o completar lotes terminados. Prohibido tocar backend, ventas o compras.

FUENTES DE VERDAD:
- Arquitectura: `docs/diagnosticos/ARQUITECTURA_RECETAS_MULTINIVEL_WIP.md` (Sección 4.3)
- Frontend: `apps/web/src/app/operations/production/` (`ProductionModal.jsx`, `useProductionForm.js`, `page.jsx`)
- Reglas: AGENTS.md (Reglas 0, 13.1, 31, 38, 39)

ARCHIVOS A MODIFICAR:
- `apps/web/src/app/operations/production/hooks/useProductionForm.js`
- `apps/web/src/app/operations/production/components/ProductionModal.jsx`

INSTRUCCIONES:

1. DETECCIÓN DE DEPENDENCIAS WIP (`useProductionForm.js`):
   - Al seleccionar una receta en `ProductionModal`:
     * Inspeccionar los ingredientes del BOM (`recipe.detalles` o respuesta de `/recipes/bom`).
     * Identificar si la fórmula requiere bases semielaboradas (`idProductoIntermedio != null`).
     * Si requiere un producto intermedio, consultar los lotes disponibles en `/lots?idProducto={idProductoIntermedio}&estado=DISPONIBLE` (o endpoint equivalente) para precargar el lote padre con mayor frescura o según FIFO.
   - En el payload de completitud o inicio de orden:
     * Enviar `idLotePadre` vinculado al lote de base seleccionado para preservar la trazabilidad sanitaria.

2. CONTROLES Y POKA-YOKE EN UI (`ProductionModal.jsx`):
   - Si la receta contiene un producto intermedio:
     * Renderizar una subsección "ORIGEN DE MATERIA PRIMA INTERMEDIA (BASE EN TANQUE)".
     * Mostrar selector o badge del Lote Padre disponible con su saldo actual (ej. `Lote: LOT-BASE-01 (Disponible: 450 L)`).
     * Si no hay saldo suficiente en ningún lote de Base Blanca en cava/tanque, bloquear el botón de inicio de orden indicando: "Stock insuficiente de Base Blanca en planta. Debe fabricar primero un lote de base."
   - En la cápsula resumen Poka-Yoke (#F0FDF4):
     * Incluir el origen del lote: "Se consumirán {qty} {unidad} del lote padre {codigoLotePadre}".

VERIFICACIÓN:
`pnpm --filter web exec next lint --file src/app/operations/production/components/ProductionModal.jsx --file src/app/operations/production/hooks/useProductionForm.js`

SALIDA: Reporte exclusivo y breve: archivos modificados, nuevos controles visuales de lote padre en el modal y confirmación del lint con código 0. Sin texto adicional.