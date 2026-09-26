TAREA:
Modularizar los modales globales de catálogo (SupplyModal.jsx y SupplierModal.jsx) aplicando SRP (< 150 líneas) y migración total a CSS Modules.

OBJETIVO:
En `apps/web/src/components/catalog/`:
1. Refactorizar `SupplyModal.jsx` (354 líneas) para reducirlo a < 120 líneas, migrando el 100% de sus estilos inline a `supply-modal.module.css` y extrayendo sus secciones a subcomponentes co-locados.
2. Refactorizar `SupplierModal.jsx` (299 líneas) para reducirlo a < 120 líneas, migrando sus estilos inline a `supplier-modal.module.css` y desacoplando sus campos.
3. Asegurar que ambos consuman `SmartModal`, respeten las reglas de AGENTS.md (UPPERCASE, CurrencySmartInput, Cero estilos inline) y mantengan intactos sus contratos con los formularios padres.

FUENTES DE VERDAD:
- `AGENTS.md` (Reglas 6.1, 6.2, 8.1, 34)
- `apps/web/src/components/catalog/SupplyModal.jsx`
- `apps/web/src/components/catalog/SupplierModal.jsx`

REGLA DE CONSULTA:
Lee exclusivamente `SupplyModal.jsx`, `SupplierModal.jsx` y `AGENTS.md`. Prohibido inspeccionar backend (`apps/api/`) o rutas ajenas a estos dos componentes.

ALCANCE:

LEER:
- `apps/web/src/components/catalog/SupplyModal.jsx`
- `apps/web/src/components/catalog/SupplierModal.jsx`

CREAR:
- `apps/web/src/components/catalog/supply-modal.module.css`
- `apps/web/src/components/catalog/supplier-modal.module.css`
- Subcomponentes atómicos co-locados en `apps/web/src/components/catalog/parts/` si se requiere para mantener cada archivo bajo 150 líneas.

MODIFICAR:
- `apps/web/src/components/catalog/SupplyModal.jsx`
- `apps/web/src/components/catalog/SupplierModal.jsx`

NO MODIFICAR:
- ningún archivo en `apps/api/`.

INSTRUCCIONES:
1. DESACOPLAMIENTO DE SUPPLYMODAL:
   - Extraer todos los estilos inline hacia `supply-modal.module.css`.
   - Mantener el componente como orquestador limpio (< 120 líneas).
   - Validar que los campos de unidad base, categoría y stock mínimo preserven sus manejadores `onChange` y validaciones Poka-Yoke.

2. DESACOPLAMIENTO DE SUPPLIERMODAL:
   - Extraer todos los estilos inline hacia `supplier-modal.module.css`.
   - Mantener el componente como orquestador limpio (< 120 líneas).
   - Validar que campos opcionales (`contacto`, `email`) y obligatorios (`nombre`, `nit`) sigan funcionando con el backend.

3. VERIFICACIÓN:
   - Comprobar ausencia de estilos inline:
     `git grep "style={{" apps/web/src/components/catalog/`
   - Comprobar que ningún archivo exceda 150 líneas.
   - `node --check apps/web/src/components/catalog/SupplyModal.jsx`
   - `node --check apps/web/src/components/catalog/SupplierModal.jsx`
   - `pnpm --filter web exec next lint --file src/components/catalog/SupplyModal.jsx --file src/components/catalog/SupplierModal.jsx`

CRITERIO DE FINALIZACIÓN:
- Ambos modales quedan por debajo de 120 líneas.
- Cero estilos en línea (`style={{}}`).
- Linter y sintaxis en código 0.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
- Líneas finales de SupplyModal.jsx y SupplierModal.jsx:
- Archivos creados:
- Verificación git grep libre de inline styles:
- Estado: