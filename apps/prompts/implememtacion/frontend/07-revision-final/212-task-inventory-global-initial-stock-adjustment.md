OBJETIVO: Implementar en `/operations/inventory` la carga de saldo inicial y ajuste global para insumos sin movimientos previos, permitiendo registrar stock en frío con valoración de costo unitario real.

ALCANCE Y FUENTE DE VERDAD:
- Backend: `apps/api/src/inventory/` (`inventory.controller.js`, `inventory.service.js`, `inventory.repository.js`).
- Frontend: `apps/web/src/app/operations/inventory/page.jsx` (y componentes/hooks co-locados de inventario).
- Reglas: AGENTS.md (Bloque VI: 31, 34, 35, 38, 39).

INSTRUCCIONES:

1. BACKEND (`apps/api/src/inventory/`):
   - En `inventory.repository.js` (`adjustInventory`):
     - Permitir recibir `costoUnitario` en el payload de ajuste.
     - En el `upsert` sobre `Inventario`: si el registro no existe (create), asignar `costoPromedio: costoUnitario || insumo.costoBase || 0`. Si ya existe y se especifica un costo nuevo positivo en un `AJUSTE_POSITIVO` o `CARGA_INICIAL`, recalcular o registrar el costo unitario de adquisición en `MovimientoInventario`.
   - Validar con `node --check` los archivos backend intervenidos.

2. FRONTEND (`apps/web/src/app/operations/inventory/`):
   - En la cabecera de la página (`page.jsx`):
     - Agregar el botón principal `[+ Saldo Inicial / Ajuste Global]` junto a los filtros/acciones existentes.
   - Modal de Ajuste Global (`SmartModal`):
     - Selector de Insumo: Cargar catálogo completo desde `/supplies` (permitiendo buscar y elegir cualquier insumo, incluso con stock 0).
     - Tipo de Ajuste: `CARGA_INICIAL` (por defecto en nuevos), `AJUSTE_POSITIVO`, `AJUSTE_NEGATIVO`, `MERMA_DESPERDICIO`.
     - Campo Cantidad: Numérico no negativo (`min="0"`), indicando visualmente la `unidadBase` del insumo seleccionado.
     - Campo Costo Unitario: Requerido para `CARGA_INICIAL` o ajustes positivos. Formateo con puntos de miles (`$ 25.000`), sin centavos y cápsula `montoATextoPesos`.
     - Campo Motivo/Observaciones: En `UPPERCASE` con `style={{ textTransform: 'uppercase' }}`.
   - Experiencia Poka-Yoke (Reglas 38 y 39):
     - Cápsula resumen verde antes de guardar: "Resumen: Se registrarán {cantidad} {unidadBase} de {insumo} con costo unitario de ${costo} como {tipoAjuste}".
     - Botón primario: Deshabilitado (`opacity: 0.5`, `cursor: 'not-allowed'`) con atributo `title` indicando campos faltantes si no hay insumo seleccionado o cantidad <= 0.
     - Banner de error dinámico `#FEF2F2` si la API rechaza el ajuste.

VERIFICACIÓN:
1. `node --check apps/api/src/inventory/inventory.repository.js`
2. `pnpm --filter web exec next lint --file src/app/operations/inventory/page.jsx`

SALIDA: Exclusivamente reporte conciso con: archivos modificados, endpoint/método adaptado en backend, nuevos controles en UI y validación sintáctica/lint.
```[cite: 2, 4]