TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Resolver el error 404 en la ruta `/commercial/payments` sincronizando la carpeta de Next.js App Router con el menú de navegación lateral:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Identifica la estructura de rutas en `apps/web/src/app/commercial/` y el enlace en `Sidebar.jsx`.
- Modificar o crear EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/commercial/payments/page.jsx` (o renombrar si existía como `pagos/page.jsx`)
2. `apps/web/src/components/layout/Sidebar.jsx` (o componente de navegación lateral)

INSTRUCCIONES TÉCNICAS:

1. Validar y Asegurar la Ruta en Next.js (`apps/web/src/app/commercial/payments/page.jsx`):
   - Verificar si existe la carpeta `commercial/payments` o `commercial/pagos`.
   - Si la ruta estándar del ERP es `/commercial/payments`, garantizar que exista `apps/web/src/app/commercial/payments/page.jsx` como Server o Client Component exportando por defecto:
     ```jsx
     export default function PaymentsPage() { ... }
     ```
   - Si la vista ya estaba implementada bajo otro subdirectorio (ej. `pagos`), unificar la ruta o redirigir / exportar el componente existente en `commercial/payments/page.jsx`.

2. Enlace en Navegación Lateral (`Sidebar.jsx`):
   - Confirmar que el ítem "Pagos/Cobros" tenga `href="/commercial/payments"` coincidiendo exactamente con la ruta física de la carpeta.
   - Respetar el límite de líneas SRP (< 135 líneas por archivo).

VERIFICACIÓN:
1. `node --check apps/web/src/app/commercial/payments/page.jsx`
2. `pnpm --filter web build`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La navegación hacia `http://localhost:3000/commercial/payments` responde con código 200 y renderiza el módulo de Pagos y Cobros sin pantalla de error 404.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
