TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Eliminar la duplicación visual de iconos de advertencia ("⚠ ⚠") en los botones de tarjetas de productos formulados y órdenes de producción:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el componente de tarjetas de producción (`FormulatedProductsList.jsx`, `ProductionOrderCard.jsx` o componente equivalente donde se renderizan los botones) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/components/FormulatedProductsList.jsx` (y/o `ProductionOrderCard.jsx`)

INSTRUCCIONES TÉCNICAS:

1. En los botones con advertencia de insumos/inóculo:
   - Revisar el texto renderizado en el botón bloqueado:
     * Si el componente ya renderiza un icono `<AlertTriangle />` o `<WarningIcon />`, cambiar el label a `"Sin Inóculo en Cava"` (sin el emoji `⚠` en el string).
     * Si no usa icono componente y solo usa texto, asegurar que haya exactamente un único icono: `"⚠ Sin Inóculo en Cava"`.
2. En el botón de "Reportar Incidencia":
   - Asegurar que solo muestre un único icono de alerta: `"⚠ Reportar Incidencia"`.
3. Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/...`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Los botones muestran un solo icono de advertencia alineado con su texto.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.