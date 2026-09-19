TAREA CONTROLADA — VISUALIZACIÓN DE FORMATO A GRANEL Y ELIMINACIÓN CONDICIONAL SEGURA EN PRESENTACIONES

OBJETIVO TÉCNICO:
1. En la tabla de Presentaciones (`PresentationsTable.jsx`), si el registro es a granel (`tipoEnvase === 'BALDE'`, `'TANQUE_GRANEL'` o contiene "GRANEL"), reemplazar el texto "33.8 oz / 1000 ml" por la insignia o texto "A Granel / Tanque (WIP)".
2. Implementar la eliminación física condicional en Backend y Frontend: solo permitir eliminar si la presentación está DESACTIVADA (`activo === false`) Y NO tiene productos vinculados en la base de datos (0 dependencias).

FUENTES DE VERDAD:
- apps/api/src/presentations/ (controlador, servicio y repositorio)
- apps/api/prisma/schema.prisma
- apps/web/src/app/catalog/presentations/components/PresentationsTable.jsx
- apps/web/src/app/catalog/presentations/presentations.module.css
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido realizar búsquedas globales ciegas (`Find`, `Search`).
- Leer únicamente los archivos intervenidos de `presentations` (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), respetar CSS Modules puro.
- Mantener SRP estricto (< 145 líneas por archivo; desacoplar en subcomponentes si excede).
- JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. BACKEND (apps/api):
   - En `presentations.service.js` (o método DELETE `remove`):
     * Antes de eliminar, verificar con Prisma si existen productos asociados:
       ```javascript
       const count = await this.prisma.producto.count({
         where: { idPresentacion: id }
       });
       ```
     * Si `count > 0`: Bloquear y responder con `409 Conflict` ("No se puede eliminar la presentación porque está asociada a productos en el catálogo. Manténgala desactivada.").
     * Si `count === 0`: Ejecutar `prisma.presentacion.delete({ where: { id } })` y responder con éxito (200 OK o 204 No Content).

2. FRONTEND — TABLA (`PresentationsTable.jsx`):
   - Formato en la columna "Volumen (Oz/Ml)":
     * Si `item.tipoEnvase === 'BALDE'` o `item.tipoEnvase === 'TANQUE_GRANEL'` o `item.nombre?.toUpperCase().includes('GRANEL')`:
       Renderizar: `<span className={styles.granelBadge}>A Granel / Tanque (WIP)</span>`.
     * Si no:
       Renderizar normal: `${item.cantidadOz} oz / ${item.cantidadMl} ml`.
   - Lógica del botón Eliminar en la columna "Acciones":
     * Si `item.activo === true`:
       - Mostrar botones habituales: `[ Editar ]` y `[ Desactivar ]` (rojo). NUNCA mostrar botón eliminar si está activa.
     * Si `item.activo === false`:
       - Mostrar botones: `[ Editar ]`, `[ Activar ]` (verde) y `[ 🗑 Eliminar ]` (rojo secundario).
       - Al presionar `[ 🗑 Eliminar ]`, abrir el modal de confirmación Poka-Yoke ("¿Deseas eliminar definitivamente esta presentación?").
       - Si el backend devuelve 409 Conflict, mostrar notificación toast clara en pantalla explicando la restricción de integridad.

3. ESTILOS (`presentations.module.css`):
   - Añadir la clase `.granelBadge` con estética botánica neutra:
     ```css
     .granelBadge {
       display: inline-block;
       background-color: #F1F5F9;
       color: #475569;
       font-size: 0.75rem;
       font-weight: 600;
       padding: 0.2rem 0.6rem;
       border-radius: 9999px;
       border: 1px solid #CBD5E1;
     }
     ```

4. VERIFICACIONES DE CALIDAD:
   - `node --check apps/api/src/presentations/presentations.service.js`
   - `node --check apps/web/src/app/catalog/presentations/components/PresentationsTable.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- La presentación "YOGURT BASE" ya no muestra "33.8 oz / 1000 ml", sino "A Granel / Tanque (WIP)".
- Ninguna presentación activa muestra el botón Eliminar.
- Las presentaciones desactivadas pueden eliminarse solo si no tienen productos vinculados.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Badge de granel integrado en: PresentationsTable.jsx
- Endpoint DELETE protegido con conteo relacional: [Sí / No]
- Resultado verify-srp.js: