TAREA:
Unificar la botonera en el pie de página de ProductionOrderCreator.jsx e implementar la auditoría de incidentes/cancelaciones de lotes en proceso en ProductionOrderCard.jsx bajo estándares Poka-Yoke y trazabilidad total.

OBJETIVO:
1. En `apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx`:
   - Remover el botón "Cerrar" huérfano de la esquina superior derecha.
   - Centralizar todas las acciones en la botonera inferior derecha (Footer):
     * `[ Cancelar Formulario ]` (estilo neutral `#F7F4EE`, texto `#182622`, borde `#D6D3D1`).
     * `[ Guardar Planificada ]` (estilo secundario).
     * `[ Iniciar Fabricación Inmediata ]` (estilo primario corporativo `#182622`).
2. En `apps/web/src/app/operations/production/components/ProductionOrderCard.jsx` y modal asociado:
   - Prohibir terminantemente la eliminación física o silenciosa de órdenes en estado `EN_PROCESO`.
   - Incorporar el botón de acción excepcional: `[ ⚠ Reportar Incidencia / Paro de Lote ]`.
   - Crear modal atómico co-locado `ProductionIncidentModal.jsx` (< 120 líneas) que capture obligatoriamente:
     * Motivo de la incidencia (selector: DERRAME_ACCIDENTAL, FALLA_TERMICA_ELECTRICA, CONTAMINACION_CULTIVO, ERROR_DOSIFICACION, OTRO).
     * Volumen rescatado (L/ml) que ingresa a stock seguro vs volumen perdido/merma que se amortiza contablemente.
     * Insumos adicionales consumidos durante el intento de rescate (si aplica).
     * Observaciones detalladas del operario.
   - Enviar la justificación al endpoint de liquidación o paro de orden para persistir la pérdida en PostgreSQL sin dejar registros huérfanos.
3. Arquitectura limpia: componentes < 150 líneas, CSS Modules puro y validación con `verify-srp.js` en código 0.

FUENTES DE VERDAD:
- `apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx`
- `apps/web/src/app/operations/production/components/ProductionOrderCard.jsx`
- `.agents/rules/03-frontend-architecture.md`
- `.agents/rules/05-forms-and-modals.md` (Regla 13.6, 38, 39: Trazabilidad y Poka-Yoke)
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA:
Lee y modifica exclusivamente los componentes de producción en `apps/web/src/app/operations/production/components/`. Prohibido alterar backend (`apps/api/`).

ALCANCE:

LEER Y MODIFICAR:
- `apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx`
- `apps/web/src/app/operations/production/components/ProductionOrderCard.jsx`
- `apps/web/src/app/operations/production/production.module.css` (o CSS module co-locado)

CREAR:
- `apps/web/src/app/operations/production/components/ProductionIncidentModal.jsx` (< 120 líneas)

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

INSTRUCCIONES:

1. BOTONERA EN `ProductionOrderCreator.jsx`:
   - Agrupar en `.formFooterActions`:
     ```jsx
     <div className={styles.formFooterActions}>
       <button type="button" onClick={onClose} className={styles.btnSecondaryNeutral}>
         Cancelar Formulario
       </button>
       <button type="button" onClick={() => handleSave('PLANIFICADA')} className={styles.btnSecondary}>
         Guardar como Planificada
       </button>
       <button type="button" onClick={() => handleSave('EN_PROCESO')} className={styles.btnPrimaryCorp}>
         Iniciar Fabricación Inmediata
       </button>
     </div>
     ```

2. GESTIÓN DE INCIDENCIAS EN `ProductionOrderCard.jsx`:
   - Para tarjetas en `EN_PROCESO`, proyectar junto al botón de finalizar:
     ```jsx
     <button type="button" onClick={() => setShowIncidentModal(true)} className={styles.btnIncident}>
       Reportar Incidencia
     </button>
     ```

3. MODAL `ProductionIncidentModal.jsx`:
   - Usar `SmartModal` de `@/components/ui/SmartModal`.
   - Capturar motivo, cantidad rescatada y notas técnicas.
   - Poka-Yoke: deshabilitar el botón "Registrar Paro de Lote" si no se ha seleccionado un motivo válido y digitado una justificación.

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx`
2. `node --check apps/web/src/app/operations/production/components/ProductionIncidentModal.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Botón "Cerrar" superior erradicado; todas las acciones agrupadas en el footer inferior derecho.
- Flujo de paro e incidencias con rescate de volumen operativo y justificación obligatoria.
- `verify-srp.js` finaliza con código 0 y 0 infracciones de líneas o estilos.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Componentes modificados / creados:
- Líneas de código resultantes:
- Resultado de verify-srp.js:
- Estado: