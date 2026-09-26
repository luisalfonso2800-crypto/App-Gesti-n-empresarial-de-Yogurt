TAREA:
Realizar una auditoría técnica e inventario exhaustivo de TODOS los modales y formularios del proyecto MANNÁ ERP, documentando su estado de estandarización (SmartModal), campos, obligatoriedad, tipo de validación y comportamiento de errores en un documento técnico centralizado dentro de `docs/`.

REGLAS DE EFICIENCIA DE TOKEN (LECTURA ÚNICA Y DEFINITIVA):
- Leer cada archivo de modal/hook de formulario exactamente 1 vez.
- Mientras se lee cada archivo, extraer toda la información requerida directamente al reporte.
- Queda prohibido volver a leer los mismos archivos posteriormente; el reporte resultante será la única Fuente de Verdad para las siguientes tareas de estandarización.

OBJETIVO:
Crear el archivo `docs/auditoria-modales-y-validaciones-poka-yoke.md` con la siguiente estructura y detalle:

1. **Catálogo Completo de Modales del ERP:**
   Recorrer las carpetas `apps/web/src/app/` y `apps/web/src/components/` identificando todos los modales (Presentaciones, Insumos, Proveedores, Productos, Recetas, Lotes/Producción, Clientes, Ventas, etc.).

2. **Ficha Técnica Detallada por Cada Modal:**
   Para cada modal encontrado, documentar:
   - **Ruta exacta del componente y hook:** (Ej. `apps/web/src/app/catalog/presentations/components/PresentationModal.jsx`).
   - **Cumplimiento de Shell UI:** ¿Usa el estándar `SmartModal`/`ModalShell` botánico o un contenedor genérico plano?
   - **Tabla de Campos del Formulario:**
     * Nombre del campo y etiqueta visible.
     * Tipo de control (Input texto, numérico, select, textarea, file).
     * ¿Es obligatorio (*)?
     * Regla de validación (Regex, longitud fija, valor mínimo > 0, etc.).
     * Valor por defecto / inicial (`""`, `0`, `true`).
   - **Diagnóstico del Comportamiento de Errores (UX / Poka-Yoke):**
     * ¿Cuándo se valida? (*Eager/Ansiosa al cargar*, *On-Blur al salir del campo*, o *On-Submit al presionar guardar*).
     * ¿Dónde se renderiza el mensaje de error? (¿Debajo de cada input individual, en un banner rojo global superior, o en un toast?).
     * ¿Resalta el borde en rojo (`#EF4444`) del input afectado?
     * Si hay múltiples errores simultáneos, ¿marca todos los campos defectuosos a la vez o solo el primero?
   - **Manejo de Estados de Envío y Mutación:**
     * ¿Distingue correctamente Creación (`POST`) de Edición (`PUT/PATCH`) con ID válido?
     * ¿Muestra indicador de carga (`isSubmitting`) en el botón primario para evitar envíos dobles?
     * ¿Dispara notificación de éxito (`toast`) al terminar?

3. **Matriz Comparativa de Cumplimiento:**
   Tabla resumen con todos los modales evaluando:
   `[Modal] | [¿SmartModal Oficial?] | [Validación On-Submit Limpia] | [Bordes Rojos Específicos] | [Diff/Toast de Éxito] | [Estado Actual]`

4. **Guía de Estandarización Propuesta:**
   Definición del estándar único que se aplicará en la siguiente fase para que todos los modales funcionen de forma idéntica bajo la filosofía Poka-Yoke.

FUENTE DE VERDAD A AUDITAR:
- `apps/web/src/app/`
- `apps/web/src/components/`
- `.agents/rules/04-design-system-manna.md`
- `.agents/rules/05-forms-and-modals.md`

SALIDA ESPERADA:
- Archivo creado: `docs/auditoria-modales-y-validaciones-poka-yoke.md`
- Resumen sintético en terminal del número total de modales auditados y principales discrepancias halladas.

CRITERIO DE FINALIZACIÓN:
- Documento generado completamente en `docs/` con referencias directas de rutas y líneas de código.
- DETENERSE inmediatamente sin modificar código de aplicación.