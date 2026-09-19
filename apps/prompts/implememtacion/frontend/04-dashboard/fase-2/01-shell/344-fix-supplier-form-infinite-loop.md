TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 2 TOOL CALLS):
Corregir el bucle infinito de re-renderizado (`Maximum update depth exceeded`) en `useSupplierForm.js` (alrededor de la línea 67) agregando una condición de guardia y estabilizando el arreglo de dependencias del `useEffect`.

REGLAS ANTI-CONSUMO DE CUOTA (REGLA 07):
- PROHIBIDO ejecutar búsquedas globales (`Search`, `Find`).
- PROHIBIDO leer más de 1 archivo.
- Modificación directa y exclusiva en `useSupplierForm.js`.

OBJETIVO:
1. En `apps/web/src/components/catalog/parts/useSupplierForm.js`:
   - Localizar el `useEffect` en la línea 67 que invoca `setState`.
   - Si sincroniza `initialData` o el estado abierto del modal:
     * Asegurar que no se ejecute si los datos ya están sincronizados.
     * Cambiar la dependencia del efecto a propiedades primitivas (ej. `initialData?.id` o `isOpen`) en lugar del objeto completo `initialData`.
     * Si no hay condición de salida, envolver el `setState` con un condicional (`if`).

2. Restricciones Técnicas:
   - Mantener el archivo por debajo de 135 líneas (SRP).
   - Validar sintaxis con `node --check apps/web/src/components/catalog/parts/useSupplierForm.js`.
   - Ejecutar: `node .agents/scripts/verify-srp.js`.

VERIFICACIÓN:
1. `node --check apps/web/src/components/catalog/parts/useSupplierForm.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El modal "Nuevo Proveedor" abre limpiamente al primer clic sin colapsar React ni emitir `Maximum update depth exceeded`.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE de inmediato.