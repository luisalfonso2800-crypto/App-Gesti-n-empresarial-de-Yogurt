TAREA:
Migrar y envolver el formulario de "Nueva Presentación" dentro del componente arquitectónico estándar `SmartModal` (o `ModalShell`), garantizando la estructura canónica en 3 zonas (Header botánico, Body con scroll nativo, Footer con botón verde táctico) y eliminando el cascarón de diálogo genérico actual.

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. Prohibido ejecutar searches globales sobre el proyecto.
- Edición focalizada en el modal de presentaciones y sus estilos.
- Cumplimiento estricto del límite SRP (< 135 líneas por archivo en frontend).

OBJETIVO:
1. Localizar el componente del diálogo de presentaciones en `apps/web/src/app/catalog/presentations/` (ej. `PresentationModal.jsx` o `NewPresentationModal.jsx`).
2. Reemplazar el contenedor `div` modal flotante plano por el componente estándar de modales del sistema (usado en los demás módulos, ej. `SmartModal.jsx` o `ModalShell.jsx` ubicado en `apps/web/src/components/ui/`):
   - **Zona 1: Header Botánico:**
     * Título técnico: "Nueva Presentación Comercial".
     * Subtítulo explicativo: "Define el recipiente físico y capacidad para el costeo y envasado en planta."
     * Botón de cierre (`X`) accesible vinculado al cierre del modal.
   - **Zona 2: Body:**
     * Contenedor con scroll vertical independiente (`overflow-y: auto`).
     * Conservar los inputs de nombre, sincronización de capacidades (Oz / Ml), el catálogo de envases y la tarjeta verde de resumen contextual.
   - **Zona 3: Footer Táctico:**
     * Alineación derecha con acciones claras:
     * Botón secundario/descarte: "Cancelar" (`onClick={onClose}`).
     * Botón primario verde botánico: "Crear Presentación" con indicador de carga durante el guardado.
3. En el CSS Module correspondiente:
   - Eliminar estilos propietarios de backdrop o cajas flotantes duplicadas, delegando el cascarón al CSS Module del `SmartModal`.
   - Limpiar clases obsoletas y asegurar coherencia con los tokens de color (`#1b4332`, `#f7f4ed`, bordes sutiles).

4. Restricciones Técnicas:
   - Dividir en subcomponentes si el archivo supera las 135 líneas (SRP).
   - Estilos 100% en CSS Modules (sin inline styles).
   - `node .agents/scripts/verify-srp.js` debe retornar código 0.

FUENTES DE VERDAD:
- Componente base `SmartModal` o `ModalShell` en `apps/web/src/components/ui/`
- Componentes de modal en `apps/web/src/app/catalog/presentations/`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente código frontend en `apps/web/src/app/catalog/presentations/`. Backend intacto.

ALCANCE:

MODIFICAR:
- Componente modal de presentaciones (`PresentationModal.jsx` o equivalente)
- Archivo CSS Module asociado

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check <ruta-del-modal-modificado>`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El modal adopta el diseño y estructura oficial de `SmartModal` alineado a la identidad de MANNÁ.
- Cabecera botánica, cuerpo y pie de botones integrados correctamente.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Componente base SmartModal enlazado:
- Resultado de verify-srp.js:
- Estado: