TAREA:
Corrección UX en Catálogo de Insumos: Subcategorías, Datalist de Marcas, Columna en Tabla y Validación Diferida

OBJETIVO:
1. Reparar el selector dependiente de Subcategorías en el modal de insumos para permitir seleccionar libremente cualquier opción sin que se resetee a la primera.
2. Eliminar la validación prematura (los bordes rojos y textos "Este campo es requerido" solo deben aparecer al hacer clic en "Guardar / Registrar").
3. Integrar datalist de autocompletado en el campo "Marca" con las marcas ya existentes en la BD.
4. Mostrar la columna "Subcategoría" en la tabla principal de insumos (/catalog/supplies).

ARCHIVOS A MODIFICAR:
- `apps/api/src/supplies/supplies.controller.js`
- `apps/api/src/supplies/supplies.service.js`
- `apps/api/src/supplies/supplies.repository.js`
- `apps/web/src/app/catalog/supplies/` (Modal de creación, tabla y hook correspondientes)

REGLAS ESTRICTAS:
- SRP: Archivos < 130 líneas. Si un componente crece, extraer subcomponentes.
- Cero estilos en línea (`style={{`). Usar CSS Modules.
- No alterar esquemas Prisma ni borrar datos existentes.

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`
2. `pnpm --filter api build`
3. `pnpm --filter web build`

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.