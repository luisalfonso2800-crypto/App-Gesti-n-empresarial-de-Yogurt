OBJETIVO: Eliminar la fecha de vencimiento hardcodeada a 15 días en `apps/api/src/production/` e implementar la captura y proyección dinámica de fecha de vencimiento en las órdenes de producción y lotes terminados (`/operations/production`).

ALCANCE:
- Backend: `apps/api/src/production/` (`production.repository.js`, `production.service.js`, DTOs de producción).
- Frontend: `apps/web/src/app/operations/production/` (`ProductionModal.jsx`, `useProductionForm.js`).
- Referencia normativa: AGENTS.md (Reglas 1, 2, 9.1, 13.1, 31, 38, 39).

INSTRUCCIONES:

1. BACKEND (`apps/api/src/production/`):
   - En `production.repository.js` (creación de lote / cierre de producción):
     * Reemplazar la asignación hardcodeada `new Date(Date.now() + 15 * 86400000)` por la fecha enviada desde la orden (`produccion.fechaVencimiento`).
     * Si no se envía fecha explícita, aplicar como fallback defensivo el cálculo derivado de la receta/producto o una fecha configurada, nunca un valor arbitrario silencioso.
   - En `create-production.dto.js` / `update-production.dto.js`:
     * Permitir recibir `fechaVencimiento` (`@IsOptional() @IsDateString()`).
   - Validar sintaxis con `node --check` y compilación Babel de los archivos backend modificados.

2. FRONTEND (`apps/web/src/app/operations/production/`):
   - En `useProductionForm.js`:
     * Incorporar `fechaVencimiento` en el estado inicial de la orden.
     * Al seleccionar una receta o producto, sugerir por defecto una fecha calculada (ej. fecha actual + días de vida útil si existen, o fecha de producción requerida) permitiendo al operador ajustarla en un selector de fecha accesible.
   - En `ProductionModal.jsx`:
     * Agregar campo visual para "FECHA DE VENCIMIENTO DEL LOTE" con validación preventiva: no puede ser anterior ni igual a la fecha de producción programada.
     * En la cápsula resumen Poka-Yoke (#F0FDF4, borde #BBF7D0):
       Proyectar el impacto: "Resumen: Se programará la producción de {cantidad} {unidad} de {producto} con lote proyectado a vencer el {fechaVencimientoFormateada}".
     * En el botón primario de confirmación:
       Bloquear (`opacity: 0.5`, `cursor: 'not-allowed'`) si la fecha de vencimiento es inválida o anterior a la fecha de fabricación.

VERIFICACIÓN:
1. `node --check apps/api/src/production/production.repository.js`
2. `pnpm --filter web exec next lint --file src/app/operations/production/components/ProductionModal.jsx --file src/app/operations/production/hooks/useProductionForm.js`

SALIDA: Exclusivamente reporte conciso indicando: archivos modificados, línea del backend donde se erradicó el valor hardcodeado, nuevos controles en frontend y estado de validación sintáctica/lint. Sin introducciones ni conclusiones.
```[cite: 2, 4]