OBJETIVO: Implementar la carga de saldo inicial y ajuste global de inventario en frío en `/operations/inventory`, permitiendo seleccionar cualquier insumo del catálogo y registrar existencias con costo unitario real para no descalibrar la valoración de producción ni de ventas.

ALCANCE:
- Backend: `apps/api/src/inventory/` (`inventory.controller.js`, `inventory.service.js`, `inventory.repository.js`)
- Frontend: `apps/web/src/app/operations/inventory/page.jsx` (y componentes/hooks co-locados de inventario)
- Referencia normativa: AGENTS.md (Reglas 1, 2, 9.1, 13.1, 31, 34, 35, 38, 39)

INSTRUCCIONES:

1. BACKEND (`apps/api/src/inventory/`):
   - En `inventory.repository.js` (`adjustInventory`):
     - Recibir en el payload `costoUnitario` (numérico opcional/requerido según el tipo).
     - En la operación transaccional sobre `Inventario`:
       * Si el registro de inventario para el insumo no existe (caso en frío): crearlo con `cantidadActual: stockNuevo` y `costoPromedio: Number(costoUnitario) || Number(insumo.costoBase) || 0`.
       * Si el registro ya existe y el tipo es `CARGA_INICIAL` o `AJUSTE_POSITIVO` con `costoUnitario > 0`: actualizar `costoPromedio` ponderado o reasignarlo si el stock previo era 0.
       * Registrar el `costoUnitario` en el detalle del `MovimientoInventario` creado.

2. FRONTEND (`apps/web/src/app/operations/inventory/`):
   - En la cabecera de la página (`page.jsx`):
     - Agregar botón de acción principal `[+ Saldo Inicial / Ajuste Global]`.
   - Crear / Conectar Modal de Ajuste Global basado estrictamente en `SmartModal`:
     - **Selector de Insumo:** Consultar `/supplies` para permitir buscar y seleccionar cualquier insumo registrado, independientemente de si tiene stock 0 o no figura en la tabla activa.
     - **Tipo de Ajuste:** Opciones: `CARGA_INICIAL` (por defecto), `AJUSTE_POSITIVO`, `AJUSTE_NEGATIVO`, `MERMA_DESPERDICIO`.
     - **Cantidad:** Input numérico (`min="0"`, placeholder="0") que refleje dinámicamente la `unidadBase` del insumo seleccionado (ej. Gramos, Mililitros, Unidades).
     - **Costo Unitario:** Obligatorio para `CARGA_INICIAL` y `AJUSTE_POSITIVO`. Formato visual en moneda (`$ 25.000` con puntos de miles, sin centavos) y cápsula inline con `montoATextoPesos`. Limpiar formato a número puro al enviar.
     - **Motivo / Observaciones:** Input de texto en `UPPERCASE` con `style={{ textTransform: 'uppercase' }}`.
   - **UX y Poka-Yoke (Reglas 38 y 39):**
     - Cápsula resumen previa al botón (#F0FDF4, borde #BBF7D0, texto #166534):
       "Resumen: Se registrarán {cantidad} {unidadBase} de {insumo} con costo unitario de ${costo} como {tipoAjuste}".
     - Botón Submit: Deshabilitado (`opacity: 0.5`, `cursor: 'not-allowed'`) con atributo `title` indicando los campos faltantes si no hay insumo seleccionado, si la cantidad es <= 0 o si falta el costo unitario en carga inicial.
     - Banner de error dinámico (#FEF2F2, borde #F87171, texto #B91C1C) capturando `err.response?.data?.message || err.message`.
   - **Reactivación:**
     - Al completar exitosamente el ajuste, refrescar la lista de inventario sin recargar la página.

VERIFICACIÓN:
1. `node --check apps/api/src/inventory/inventory.repository.js`
2. `pnpm --filter web exec next lint --file src/app/operations/inventory/page.jsx`

SALIDA: Exclusivamente reporte conciso indicando: archivos modificados, campos incorporados en el payload transaccional, nuevos elementos de interfaz y resultado de sintaxis/lint. Sin texto introductorio ni de cierre.