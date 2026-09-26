TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 5 TOOL CALLS):
Estandarizar los modales del Catálogo (`SupplyModal`, `PresentationModal` y `ProductModal`) con el patrón Poka-Yoke implementado en `SupplierModal`: validación únicamente tras presionar guardar (`hasSubmitted`), bordes rojos (`#EF4444`) en inputs defectuosos y microtextos explicativos individuales debajo de cada campo.

FUENTES DE VERDAD Y REFERENCIA:
- Documento de auditoría: `docs/auditoria-modales-y-validaciones-poka-yoke.md`
- Componente de referencia: `apps/web/src/components/catalog/SupplierModal.jsx` y `SupplierFormFields.jsx`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`

REGLAS DE CONSUMO MÍNIMO (ANTI-QUOTA EXHAUSTION):
- PROHIBIDO búsquedas globales (`Search`, `Find`).
- Usar las rutas exactas documentadas en la auditoría.
- Máximo 1 lectura por archivo a modificar.
- Límite SRP estricto (< 135 líneas por archivo).

OBJETIVO:
1. En `SupplyModal.jsx` / `SupplyFormFields.jsx`:
   - Conectar la bandera `hasSubmitted` desde su hook.
   - Si `hasSubmitted` es true y el campo requerido (`nombre`, `categoria`, `marca`, `unidadBase`, `stockMinimo`) está vacío:
     * Aplicar la clase de borde rojo (`border: 1px solid #EF4444`).
     * Renderizar el microtexto de error debajo del campo en rojo: "Este campo es requerido".

2. En `PresentationModal.jsx`:
   - Aplicar el mismo comportamiento reactivo con bordes rojos a `nombre`, `cantidadOz`, `cantidadMl` y `tipoEnvase` solo tras intentar enviar.

3. En `ProductModal.jsx` / `ProductBasicFields.jsx`:
   - Aplicar borde rojo a `nombre`, `idPresentacion` y `precioVenta` (si es comercial) tras `hasSubmitted`.

4. Restricciones Técnicas:
   - Mantener componentes por debajo de 135 líneas (modularizar si es necesario).
   - Estilos 100% en CSS Modules (sin inline styles).
   - Validar sintaxis con `node --check`.
   - Ejecutar únicamente: `node .agents/scripts/verify-srp.js`.

VERIFICACIÓN:
1. `node --check apps/web/src/components/catalog/SupplyModal.jsx`
2. `node --check apps/web/src/app/catalog/presentations/components/PresentationModal.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Los tres modales abren limpios y neutros. Al pulsar guardar sin datos, se marcan en rojo simultáneamente los campos faltantes con su explicación individual.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Tras verificar el guardián de código, DETENTE inmediatamente.