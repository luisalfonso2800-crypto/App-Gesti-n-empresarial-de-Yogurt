OBJETIVO: Estandarizar `SelectTargetListModal` al 100% bajo AGENTS.md (Bloque VI) y actualizar el informe de auditoría. Prohibido tocar backend, CSS globales o usar TypeScript.

CAMBIOS:

1. `apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx` (SelectTargetListModal):
   - Reemplazar el contenedor `<Modal>` legacy y su CSS modular por `<SmartModal>` (@/components/ui/SmartModal).
   - Cápsula Resumen Poka-Yoke: Encima de la botonera de confirmación, renderizar bloque (`#F0FDF4`, borde `#BBF7D0`, texto `#166534`, fontSize `0.76rem`) detallando en lenguaje natural el insumo a vincular, el proveedor/precio seleccionado y el nombre de la lista u orden de destino.
   - Botón Primario: Aplicar `disabled`, `style={{ opacity: 0.5, cursor: 'not-allowed' }}` y atributo `title` contextual si no hay lista seleccionada o durante `loading`.
   - Banner de Error API: En bloque `catch`, capturar y renderizar error dinámico (`err.response?.data?.message || err.message`) en contenedor `#FEF2F2` con borde `#F87171`.

2. `AUDITORIA_MODALES_FRONTEND.md` (o ruta activa en `docs/`):
   - Actualizar el registro de `SelectTargetListModal` a **100% Conforme**.
   - Reflejar el cierre total de la auditoría de modales del frontend.

VERIFICACIÓN:
1. `pnpm --filter web exec next lint --file src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx`
2. `git status --short`

SALIDA: Reporte conciso con: líneas modificadas en `PricesComparisonTable.jsx`, estado del lint y confirmación de la actualización documental. Sin introducciones ni conclusiones.
```[cite: 1, 2]