OBJETIVO: Cerrar al 100% la conformidad de modales migrando el último diálogo legacy y actualizando el informe de auditoría. Prohibido tocar backend o usar TypeScript.

CAMBIOS:
1. `apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx` (SelectTargetListModal):
   - Reemplazar `<Modal>` legacy por `<SmartModal>`.
   - Agregar cápsula Poka-Yoke de confirmación antes de la acción (`#F0FDF4`, borde `#BBF7D0`, texto `#166534`).
   - Botón de confirmación con estado `loading`, `disabled` y estilo contextual (`opacity: 0.5`, `cursor: not-allowed`).
   - Banner de error dinámico capturando `err.response?.data?.message || err.message`.
2. `AUDITORIA_MODALES_FRONTEND.md` (o ruta en `docs/` donde resida):
   - Actualizar la tabla de cumplimiento reflejando todos los modales al 100% Conforme.

VERIFICACIÓN:
1. `pnpm --filter web exec next lint --file src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx`
2. `git status --short`

SALIDA: Reporte conciso con líneas modificadas en `PricesComparisonTable.jsx` y confirmación de actualización documental. Sin introducciones ni conclusiones.
```[cite: 1, 2]