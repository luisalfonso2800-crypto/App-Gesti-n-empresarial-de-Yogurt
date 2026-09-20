TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir la experiencia de usuario (UX) del campo "Cantidad (Litros)" en el modal de lanzamiento de orden de producción para que soporte borrado limpio con placeholder '0' y no permita números negativos ni menores o iguales a cero:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el componente del modal de producción (`ProductionPlanningModal.jsx` o `ProductionCreateModal.jsx`) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/components/ProductionPlanningModal.jsx` (o modal de lanzamiento equivalente)

INSTRUCCIONES TÉCNICAS:

1. En el input de "Cantidad (Litros)":
   - Configurar atributos:
     * `placeholder="0"`
     * `min="0.01"` (o el mínimo técnico admisible)
     * `value={cantidad === '' || cantidad === 0 ? '' : cantidad}` para permitir borrado completo sin dejar ceros molestos a la izquierda.
   - En el evento `onChange`:
     * Si `e.target.value === ''`, setear el estado temporal como `''` (así se muestra el placeholder '0').
     * Si `Number(e.target.value) < 0`, ignorar la entrada (no permitir negativos).
     * Si es positivo, parsear y actualizar el cálculo de proporción del batch.
   - En el evento `onBlur`:
     * Si el usuario deja el input vacío `''` o con valor `<= 0`, restaurar al rendimiento base de la receta (`receta.rendimientoCantidad` o `1`).
   - Poka-Yoke de botón:
     * Mantener el botón "Iniciar Fabricación" / "Guardar Planificada" deshabilitado si `!cantidad || Number(cantidad) <= 0`.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionPlanningModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El usuario puede borrar completamente el número en "Cantidad (Litros)" viendo el placeholder '0'.
- No se pueden ingresar valores negativos ni menores o iguales a 0.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.