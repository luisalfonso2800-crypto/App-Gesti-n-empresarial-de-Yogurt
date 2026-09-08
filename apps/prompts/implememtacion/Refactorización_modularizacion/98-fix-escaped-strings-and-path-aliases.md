TAREA CONTROLADA — CORRECCIÓN DE ESCAPES EN TEMPLATE STRINGS Y NORMALIZACIÓN DE ALIAS DE IMPORT

OBJETIVO TÉCNICO EXACTO
Resolver de raíz los errores de compilación reportados en Next.js Turbo:
1. Corregir sintaxis rota de Template Strings en Modales:
   - En `apps/web/src/app/operations/purchases/new/components/QuickSupplierModal.jsx`:
     Eliminar las barras invertidas en las llamadas a `showNotification`. Cambiar:
     `showNotification(\`Proveedor "\${payload.nombre}" registrado y asignado.\`);`
     por:
     `showNotification(`Proveedor "${payload.nombre}" registrado y asignado.`);`
   - En `apps/web/src/app/operations/purchases/new/components/QuickSupplyModal.jsx`:
     Eliminar las barras invertidas equivalentes en `showNotification`.
   - Asegurar que ambos archivos exporten sus componentes como named exports:
     `export function QuickSupplierModal(...)` y `export function QuickSupplyModal(...)`.

2. Corregir y Estandarizar Imports del Cliente API con Alias `@/*`:
   - Inspeccionar `apps/web/src/lib/` y verificar si el archivo base es `api.js` o `api-client.js`, y si exporta `apiClient` o `api`.
   - En `apps/web/src/app/operations/purchases/new/hooks/useChecklistManager.js`:
     Reemplazar la línea 10 por el import con alias canónico:
     `import { apiClient } from '@/lib/api-client';` (o `@/lib/api` según corresponda).
   - En `apps/web/src/app/operations/purchases/new/hooks/usePurchaseData.js`:
     Reemplazar la línea 10 por el mismo import con alias canónico.

3. MODO RÁPIDO: PROHIBIDO compilar con `pnpm build` o borrar `.next`. Validar sintaxis con `node --check`.

FUENTES DE VERDAD OBLIGATORIAS
- apps/web/src/lib/ (verificar nombre real del cliente HTTP)
- apps/web/src/app/operations/purchases/new/components/QuickSupplierModal.jsx
- apps/web/src/app/operations/purchases/new/components/QuickSupplyModal.jsx
- apps/web/src/app/operations/purchases/new/hooks/useChecklistManager.js
- apps/web/src/app/operations/purchases/new/hooks/usePurchaseData.js
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md

VALIDACIÓN LIGERA (SIN BUILD PESADO)
- Ejecutar: `node --check apps/web/src/app/operations/purchases/new/hooks/useChecklistManager.js`
- Ejecutar: `node --check apps/web/src/app/operations/purchases/new/hooks/usePurchaseData.js`
- Confirmar que Next.js Turbo compile `/operations/purchases/new` sin lanzar `Module not found` ni `Parsing ecmascript source code failed`.

FORMATO DE REPORTE
Entregar reporte técnico puntual detallando los reemplazos aplicados y el estado final de la compilación.