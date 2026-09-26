# FIX E2E — INSUMOS: SELECTOR DE BOTÓN "NUEVO REGISTRO" Y CLEANUP CLIENT-SIDE

## ⚠️ REGLAS ESTRICTAS ANTI-CONSUMO DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes.
3. PROHIBIDO ejecutar Playwright, dev servers, builds o git commands.
4. PROHIBIDO modificar código fuente de producción (`apps/web/src`, `apps/api/src`).
5. LÍMITES DUROS: Máximo 2 lecturas, exactamente 2 ediciones, máximo 6 llamadas a herramientas.
6. Al finalizar las dos ediciones, DETENERSE inmediatamente sin reportes extensos.

---

## 🛠️ TAREAS EXACTAS:

### T1. Corregir Selector del Botón Disparador
- **Archivo:** `apps/web/e2e/supplies-validations.spec.js`
- En la función `openSupplyModal` (o donde se localiza el botón de apertura):
  - Reemplazar la búsqueda por:
    ```javascript
    const newBtn = page.getByRole('button', { name: /nuevo registro/i });
    ```
  - Mantener la verificación del título del modal:
    ```javascript
    await expect(page.getByRole('heading', { name: /nuevo insumo/i })).toBeVisible({ timeout: 5000 });
    ```

### T2. Corregir `cleanupByPrefix` para Filtrado en Memoria
- **Archivo:** `apps/web/e2e/helpers/chain-state.js`
- Actualizar `cleanupByPrefix` para no depender del query param `?search=` (que la API ignora), obteniendo el listado general y filtrando localmente:
  ```javascript
  export async function cleanupByPrefix(request, resource, prefix = 'E2E_') {
    try {
      const res = await request.get(`/api/v1/${resource}`).catch(() => null);
      if (!res || !res.ok()) return { deleted: 0, failed: 0 };
      
      const body = await res.json();
      const allItems = Array.isArray(body) ? body : (body.data || []);
      const items = allItems.filter(item => {
        const name = item.nombre || item.nombreInsumo || item.name || '';
        return name.startsWith(prefix);
      });

      let deleted = 0;
      let failed = 0;
      for (const item of items) {
        const id = item.id || item.idInsumo;
        if (!id) continue;
        const delRes = await request.delete(`/api/v1/${resource}/${id}`).catch(() => null);
        if (delRes && delRes.ok()) deleted++;
        else failed++;
      }
      return { deleted, failed };
    } catch {
      return { deleted: 0, failed: 0 };
    }
  }