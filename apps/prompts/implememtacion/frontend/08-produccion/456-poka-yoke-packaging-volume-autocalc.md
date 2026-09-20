TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Implementar la validación Poka-Yoke de límite físico máximo en recetas comerciales de envasado, permitiendo escritura libre pero bloqueando cualquier valor que exceda la capacidad geométrica total de los envases del batch:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el componente del formulario de etapas de receta (`RecipeStageCard.jsx` o donde se validan los insumos de la etapa) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/recipes/components/RecipeStageCard.jsx` (o componente del BOM de la etapa)

INSTRUCCIONES TÉCNICAS:

1. Cálculo del Techo Físico Máximo:
   - Identificar si la receta actual corresponde a un producto comercial con presentación definida (ej. `CONTENEDOR DE 16 OZ` = 500 ml o 0.50 L).
   - Extraer la capacidad unitaria máxima en litros:
     * Si es de 16 oz / 500 ml -> `capacidadUnitariaLts = 0.50`
     * O deducir del campo `capacidadMililitros / 1000` de la presentación asociada.
   - Calcular el volumen máximo físico absoluto para el lote:
     `const maxLitrosPermitidos = Number(rendimientoUnidades) * capacidadUnitariaLts;`
     *(Ejemplo: 6 unidades * 0.50 L = 3.0 Litros).*

2. Validación Poka-Yoke en el Input de Cantidad Requerida:
   - Permitir escritura libre en el campo de texto/número de `Cant. Requerida` (no forzar autocompletados rígidos, permitiendo valores menores si el envase comparte espacio con fruta/jaleas o ajustes del maestro yogurtero).
   - Validar en tiempo real (`onChange` y render):
     * Si el usuario ingresa un valor que supera `maxLitrosPermitidos` (ej. ingresa 29.04 L donde lo máximo son 3.0 L):
       - Marcar el borde del input en rojo intenso (`border-rose-500 ring-rose-200`).
       - Mostrar debajo un mensaje de error explícito:
         `"❌ Excede la capacidad física: El contenedor admite máx ${capacidadUnitariaLts * 1000} ml por envase (máx ${maxLitrosPermitidos.toFixed(2)} L para ${rendimientoUnidades} unds). Revisa si quisiste ingresar ${(Number(valorActual)/10).toFixed(1)} L."`
       - Bloquear / deshabilitar el botón "Finalizar y Resumir" o guardado de la receta mientras persista el exceso.
     * Si el valor es `<= maxLitrosPermitidos` y `> 0`, el estado es válido y se eliminan las alertas.

3. Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/recipes/components/...`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Para 6 envases de 16 oz, el operario puede teclear libremente 2.5 L, 2.8 L o 3.0 L sin impedimentos.
- Si por error de digitación se ingresa 29 L (o cualquier valor > 3.0 L), el sistema bloquea inmediatamente la acción indicando el tope físico máximo admitido.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.