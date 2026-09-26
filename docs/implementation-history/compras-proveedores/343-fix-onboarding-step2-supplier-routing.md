TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 3 TOOL CALLS):
Hacer que el botón de acción del Paso 2 ("Registrar Insumos y Proveedores") detecte inteligentemente si ya existen insumos creados para redirigir directamente al catálogo de Proveedores (`/catalog/suppliers`), y mostrar un aviso claro de lo que falta para completar el paso.

REGLAS ANTI-EXHAUSTION (REGLA 07):
- PROHIBIDO búsquedas globales (`Search`, `Find`).
- PROHIBIDO leer un archivo más de 1 vez.
- Modificación directa en el componente del widget/tarjeta de onboarding.
- Límite SRP estricto (< 135 líneas por archivo).

OBJETIVO:
1. En el componente de pasos de onboarding (ej. `OnboardingStepItem.jsx` o donde se maneja el botón "Completar" / "Iniciar Ahora"):
   - Evaluar los contadores del Paso 2:
     * Si `suppliesCount > 0` y `suppliersCount === 0`:
       - Texto del botón: `"Registrar Proveedor →"`
       - Ruta de navegación: `router.push('/catalog/suppliers')`
       - Si el usuario pulsa "Completar" desde Insumos, redirigirlo a Proveedores en vez de recargar la misma página.
     * Si `suppliesCount === 0`:
       - Ruta: `/catalog/supplies`
     * Si ambos son mayores a 0:
       - Habilitar el check verde de completado y avanzar automáticamente al Paso 3.
   - Si se intenta forzar "Completar" faltando proveedores:
     * Disparar aviso accesible: `"Registra al menos 1 proveedor para finalizar el Paso 2."`

2. Replicar esta misma ruta dinámica en la tarjeta del Dashboard (`OnboardingHeroState.jsx` / `OnboardingHeroCard.jsx`) para que el botón "Paso 2: Iniciar Ahora" lleve directamente a `/catalog/suppliers` si ya hay insumos registrados.

3. Restricciones Técnicas:
   - Mantener archivos bajo 135 líneas (SRP).
   - Ejecutar únicamente: `node .agents/scripts/verify-srp.js`.

VERIFICACIÓN:
`node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Estando en Insumos con 6 insumos creados, el botón del asistente indica "Registrar Proveedor" y navega a `/catalog/suppliers`.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Tras validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.