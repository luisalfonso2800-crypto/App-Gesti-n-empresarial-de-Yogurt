# TEST E2E — INSUMOS: VALIDACIÓN, POKA-YOKE DUPLICIDAD Y CLEANUP IDEMPOTENTE (LOW QUOTA)

## ⚠️ REGLAS ANTI-QUEMA DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes.
3. PROHIBIDO ejecutar Playwright, builds, dev servers o git commands.
4. PROHIBIDO modificar código de producción (`apps/web/src`, `apps/api/src`).
5. PROHIBIDO alterar `presentations-validations.spec.js`.
6. LÍMITES DUROS: Máximo 4 lecturas, exactamente 2 ediciones (helper + spec), máximo 10 llamadas a herramientas.
7. Al terminar de escribir los archivos, DETENERSE inmediatamente sin reportes extensos.

---

## 📌 CONTEXTO DEL MÓDULO Y CAMPOS
- **Ruta UI:** `/catalog/supplies`
- **Modal:** Trigger botón `+ Nuevo Insumo`
- **Campos del formulario:**
  - `Nombre del Insumo` (input text, requerido)
  - `Categoría` (select dinámico) / `Subcategoría` (select condicional)
  - `Marca` (input text, requerido)
  - `Empaque` (select: UNIDAD, ENVASE, BOLSA, CAJA, BULTO, BOTELLA, BIDÓN, CANASTILLA, OTRO)
  - `Contenido por empaque` (input number, `contenidoReferencial`)
  - `Unidad Base` (select: kg, g, L, ml, oz, und)
  - `Stock Mínimo` (input number, default 0)
  - `Densidad` (input number, default 1.0)
  - `Costo base referencial` (input number, default 0)
  - `Observaciones` (input text)
  - `Insumo Activo` (checkbox, default true)

---

## 🛠️ TAREAS

### T1. Lectura del Helper
Leer **únicamente** `apps/web/e2e/helpers/chain-state.js`.

### T2. Ampliar Helper `chain-state.js` con Cleanup Idempotente
En `apps/web/e2e/helpers/chain-state.js`, exportar la función:

```javascript
/**
 * Limpieza preventiva de entidades E2E_ antes de cada corrida.
 */
export async function cleanupByPrefix(request, resource, prefix = 'E2E_') {
  try {
    const res = await request.get(`/api/v1/${resource}`).catch(() => null);
    if (!res || !res.ok()) return { deleted: 0, failed: 0 };
    
    const body = await res.json();
    const list = Array.isArray(body) ? body : (body.data || []);
    let deleted = 0;
    let failed = 0;

    for (const item of list) {
      const name = item.nombre || item.nombreInsumo || item.nombrePresentacion || item.name || '';
      if (name.startsWith(prefix)) {
        const id = item.id || item.idInsumo || item.idPresentacion;
        const delRes = await request.delete(`/api/v1/${resource}/${id}`).catch(() => null);
        if (delRes && delRes.ok()) deleted++;
        else failed++;
      }
    }
    return { deleted, failed };
  } catch {
    return { deleted: 0, failed: 0 };
  }
}