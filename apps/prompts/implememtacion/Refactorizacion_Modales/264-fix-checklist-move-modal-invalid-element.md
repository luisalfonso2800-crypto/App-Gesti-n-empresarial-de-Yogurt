TAREA:
Corregir la importación indefinida de componente JSX y la ejecución indebida de setState en ChecklistItemRowMoveModal.jsx.

OBJETIVO:
En `apps/web/src/app/operations/purchases/new/components/parts/ChecklistItemRowMoveModal.jsx`:
1. Inspeccionar todas las declaraciones de importación:
   - Verificar si importa `SmartModal` y contrastar su exportación real en `@/components/ui/SmartModal.jsx` (default vs named import).
   - Verificar todas las importaciones de iconos (`lucide-react` o `@/components/ui/icons`), comprobando que los nombres existan exactamente y no resuelvan `undefined`.
2. Revisar la línea ~153 y todas las etiquetas JSX renderizadas para asegurar que todos los componentes referenciados estén debidamente definidos y en el scope.
3. Auditar el cuerpo de la función para erradicar cualquier invocación directa a un setter de estado (`setX(...)`) durante el ciclo de render; todo cambio de estado debe residir exclusivamente dentro de manejadores de eventos (`onClick`, `onChange`) o hooks `useEffect`.

FUENTES DE VERDAD:
- `apps/web/src/app/operations/purchases/new/components/parts/ChecklistItemRowMoveModal.jsx`
- `apps/web/src/components/ui/SmartModal.jsx`
- `AGENTS.md` (Reglas 4, 5, 16.4)

REGLA DE CONSULTA:
Inspecciona exclusivamente `ChecklistItemRowMoveModal.jsx` y los archivos de donde importa componentes/iconos. Prohibido tocar backend ni otros módulos.

ALCANCE:

LEER:
- `apps/web/src/app/operations/purchases/new/components/parts/ChecklistItemRowMoveModal.jsx`
- `apps/web/src/components/ui/SmartModal.jsx`

MODIFICAR:
- `apps/web/src/app/operations/purchases/new/components/parts/ChecklistItemRowMoveModal.jsx`

NO MODIFICAR:
- ningún archivo de backend ni esquemas de datos.

INSTRUCCIONES:
1. Abrir `ChecklistItemRowMoveModal.jsx` y revisar los `import`:
   - Si usa `SmartModal`, verificar cómo exporta `@/components/ui/SmartModal`: si es `export default function SmartModal`, usar `import SmartModal from '@/components/ui/SmartModal'`; si es `export function SmartModal`, usar llaves.
   - Revisar los iconos importados de `lucide-react`: validar que existan (ej. `ArrowRight`, `ArrowLeftRight`, `X`, `AlertCircle`, etc.). Reemplazar cualquier nombre inexistente por su equivalente oficial.
2. Identificar el elemento JSX que evalúa a `undefined` alrededor de la línea 153 y corregir su import/referencia.
3. Asegurar que ningún setter de estado o callback de cierre (`onClose`, `set...`) se ejecute directamente en el cuerpo del render.
4. Validar sintaxis con `node --check`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/purchases/new/components/parts/ChecklistItemRowMoveModal.jsx`
2. `pnpm --filter web exec next lint --file src/app/operations/purchases/new/components/parts/ChecklistItemRowMoveModal.jsx`

CRITERIO DE FINALIZACIÓN:
- Ninguna etiqueta o componente JSX evalúa a `undefined`.
- Desaparece la advertencia de `Cannot update a component while rendering`.
- Next lint y sintaxis finalizan con código 0.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
- Causa identificada del componente undefined:
- Corrección aplicada:
- Estado: