TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Eliminar la colisión de claves duplicadas de React (`f4a36a2d-a62d-41df-8e82-d11bf8a50268`) en el `<select>` de `RecipeStageBomTable.jsx`:
Garantizar que cada `<option>` de los grupos "Iniciadores y Cepas", "Bases Lácteas a Granel" y "Materias Primas" tenga una key garantizadamente única concatenando el tipo de item o prefijo.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el archivo y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo indicado abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `RecipeStageBomTable.jsx`:
   - En el mapeo de `<optgroup label="🧫 Iniciadores y Cepas (Inóculo WIP)">`:
     * Usar:
       ```jsx
       <option 
         key={`inoculo-${p.idItem || p.id}`} 
         value={p.idItem || `PROD:${p.id}:INOCULO`}
       >
         {p.displayLabel || p.nombre}
       </option>
       ```
   - En el mapeo de `<optgroup label="🥛 Bases Lácteas a Granel (WIP)">`:
     * Usar:
       ```jsx
       <option 
         key={`base-${p.idItem || p.id}`} 
         value={p.idItem || `PROD:${p.id}:BASE`}
       >
         {p.displayLabel || p.nombre}
       </option>
       ```
   - En el mapeo de insumos/materias primas:
     * Usar: `key={`insumo-${item.id}`}`.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La consola del navegador no emite advertencias de `Encountered two children with the same key`.
- Ambas opciones se muestran de forma nítida en sus respectivos grupos.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.