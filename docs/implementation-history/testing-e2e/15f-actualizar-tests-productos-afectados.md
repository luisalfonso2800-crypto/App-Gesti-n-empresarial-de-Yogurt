# TAREA CONTROLADA — FASE 4: AUDITAR Y ACTUALIZAR TESTS EXISTENTES AFECTADOS POR LAS MEJORAS AL MODAL PRODUCTO

Modelo: Gemini 3.8 Flash
Effort: low

OBJETIVO TÉCNICO:
1. Auditar todos los specs E2E existentes que toquen el modal o el listado de productos.
2. Detectar tests que puedan fallar por los cambios introducidos en Fases 1-3:
   - Nuevos campos en el modal (Código, Unidad de Venta, Stock Mínimo, Costo Estimado, Margen Real, Precio Sugerido).
   - Cambio en la cascada Poka-Yoke (M6: solo Nombre + Presentación obligatorios).
   - Nuevo semáforo de estado en la columna "Estado" del listado.
   - Cambios en el payload de POST /api/v1/products (4 campos nuevos).
3. Actualizar los tests afectados con los selectores nuevos.
4. CERO modificaciones a código de producción (frontend ni backend).

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 5 LECTURAS):
- apps/web/e2e/products/** (si existe)
- apps/web/e2e/exhaustive/catalog-*.spec.js (los 3 specs de catálogo)
- apps/web/e2e/exhaustive/**/products-*.spec.js (si existen)
- apps/web/e2e/value-chain-complete.spec.js (que ya fue ajustado en Fase 3B)
- apps/web/e2e/helpers/** (para ver si hay helpers de productos)

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 5 LECTURAS, MÁXIMO 3 EDICIONES):
- CERO modificaciones a `apps/web/src/**`.
- CERO modificaciones a `apps/api/**`.
- CERO modificaciones al schema Prisma.
- Tests deben mantener su rango `T##`/`C##`/`E##`/`V##`.
- Cada spec ≤ 140 líneas.
- Prohibido `waitForTimeout` fijo.
- Prohibido `window.confirm` / `window.alert`.

ACCIONES A EJECUTAR:

1. **Inventariar specs existentes que toquen productos:**

   Ejecutar:
   ```powershell
   Get-ChildItem -Recurse -Path apps/web/e2e -Include *.spec.js | Select-String -Pattern "products|Producto" -List | Select-Object Path
   ```
