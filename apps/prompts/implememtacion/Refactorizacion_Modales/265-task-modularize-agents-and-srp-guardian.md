TAREA:
Modularizar AGENTS.md en submódulos especializados bajo .agents/rules/ y crear el script automatizado verify-srp.js.

OBJETIVO:
1. Crear la carpeta `.agents/rules/` y extraer las 39 reglas de `AGENTS.md` en archivos temáticos independientes con responsabilidad única.
2. Reducir `AGENTS.md` en la raíz a un enrutador de contexto limpio (< 70 líneas) con su tabla de derivación.
3. Implementar `.agents/scripts/verify-srp.js` y registrar el comando `"verify:srp"` en el `package.json` raíz.

FUENTES DE VERDAD:
- `AGENTS.md`
- `package.json`

ALCANCE:
CREAR:
- `.agents/rules/01-core-execution.md`
- `.agents/rules/02-backend-database.md`
- `.agents/rules/03-frontend-architecture.md`
- `.agents/rules/04-design-system-manna.md`
- `.agents/rules/05-forms-and-modals.md`
- `.agents/scripts/verify-srp.js`

MODIFICAR:
- `AGENTS.md`
- `package.json`

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`
2. Validar que `AGENTS.md` quede con menos de 70 líneas.

CRITERIO DE FINALIZACIÓN:
`verify:srp` retorna código 0 y `AGENTS.md` queda convertido en índice enrutador.