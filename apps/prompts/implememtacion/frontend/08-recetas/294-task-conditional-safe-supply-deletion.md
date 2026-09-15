TAREA:
Implementar la eliminación condicional y segura de insumos desactivados (Hard Delete si no tiene vínculos, Soft Delete/Bloqueo si tiene historial de producción o compras).

OBJETIVO:
1. **Backend (`apps/api/src/supplies/`):**
   - En `supplies.service.js` y `supplies.repository.js`, crear el método de eliminación física condicional para `DELETE /supplies/:id`.
   - Realizar un chequeo previo (`_count`) de: `detallesCompra`, `movimientos`, `detallesReceta`, `detallesProduccion`, `lotes`, `ordenCompraItems`, `precios`.
   - Si la suma de dependencias operativas > 0: rechazar con `409 Conflict` ("El insumo cuenta con historial de compras, inventario o recetas y no puede ser eliminado. Manténgalo desactivado.").
   - Si la suma es 0: ejecutar una transacción (`prisma.$transaction`) eliminando el registro 1:1 en `Inventario` y posteriormente el `Insumo`. Retornar 200 OK.
   - Exponer el endpoint correspondiente en `supplies.controller.js`.

2. **Frontend (`apps/web/src/app/catalog/supplies/`):**
   - En `SuppliesTable.jsx` (o acciones de insumo): cuando un insumo esté desactivado (`activo === false`), habilitar el botón o ícono `[ Eliminar Definitivamente ]`.
   - Incluir modal o diálogo de confirmación antes de disparar la petición.
   - Manejar reactivamente el error 409 para mostrar una notificación toast/alerta clara en pantalla sin romper la UI.
   - Cumplir SRP (< 135 líneas por componente) y CSS Modules puro. Cero estilos en línea (`style={{}}`).

FUENTES DE VERDAD:
- Auditoría técnica: reporte previo de dependencias de `schema.prisma`.
- `apps/api/src/supplies/`
- `apps/web/src/app/catalog/supplies/components/SuppliesTable.jsx`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLAS DE OPERACIÓN:
- Máximo 2 intentos de ajuste por archivo.
- Respetar el límite de 135 líneas en frontend extrayendo componentes atómicos si es necesario.

VERIFICACIÓN:
1. `node --check apps/api/src/supplies/supplies.service.js`
2. `node --check apps/web/src/app/catalog/supplies/components/SuppliesTable.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Insumos sin dependencias (como la cereza duplicada) pueden purgarse por completo.
- Insumos con compras o lotes son retenidos con aviso explicativo.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos backend modificados:
- Archivos frontend modificados:
- Resultado de verify-srp.js:
- Estado: