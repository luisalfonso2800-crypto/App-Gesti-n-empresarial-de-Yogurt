TAREA CONTROLADA — UNIFICACIÓN TOTAL DE IMPORTS CON ALIAS (@/*) EN PURCHASES/NEW

EVIDENCIA CONFIRMADA
Fallo en tiempo de compilación Next.js Turbo:
`Module not found: Can't resolve '../../../../components/ui/icons'` en `ChecklistItemRow.jsx:3`.
Causa: Uso de rutas relativas manuales (`../../../../`) en componentes y hooks ubicados en subcarpetas profundas.

OBJETIVO TÉCNICO EXACTO
Eliminar de raíz todos los imports relativos profundos en el módulo `purchases/new` y reemplazarlos por los alias de proyecto `@/*` soportados por `jsconfig.json`:

1. Barrido y Normalización de Imports:
   Inspeccionar todos los archivos dentro de:
   - `apps/web/src/app/operations/purchases/new/components/*.jsx`
   - `apps/web/src/app/operations/purchases/new/hooks/*.js`
   - `apps/web/src/app/operations/purchases/new/page.jsx`

2. Reglas de Reemplazo Canónico:
   - Cualquier import de iconos:
     Usar: `import { ... } from '@/components/ui/icons';`
   - Cualquier import de cliente API:
     Usar: `import { apiClient } from '@/lib/api-client';` (o `@/lib/api` según el export real).
   - Componentes UI compartidos (modales, badges, botones globales):
     Usar: `import { ... } from '@/components/ui/...';`
   - Los únicos imports que deben mantenerse relativos (`./` o `../`) son los estrictamente co-locados:
     * `import styles from '../new-purchase.module.css';` (estilos locales)
     * `import { usePurchaseData } from './hooks/usePurchaseData';` (hooks locales en `page.jsx`)
     * `import { ChecklistPhase } from './components/ChecklistPhase';` (componentes locales en `page.jsx`)

3. MODO RÁPIDO: PROHIBIDO compilar con `pnpm build` o borrar `.next`.

FUENTES DE VERDAD OBLIGATORIAS
- apps/web/src/app/operations/purchases/new/components/
- apps/web/src/app/operations/purchases/new/hooks/
- apps/web/src/components/ui/icons.jsx
- apps/web/jsconfig.json
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md

VALIDACIÓN LIGERA (SIN BUILD PESADO)
- Comprobar que no queden cadenas `../../../../components` en ningún archivo de la carpeta.
- Confirmar que Next.js compile `http://localhost:3000/operations/purchases/new` sin lanzar ningún error `Module not found`.

FORMATO DE REPORTE
Entregar reporte técnico puntual listando los archivos normalizados y confirmando compilación limpia en Turbo.