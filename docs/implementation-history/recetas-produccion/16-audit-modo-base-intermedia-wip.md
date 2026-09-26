# TAREA CONTROLADA — AUDITORÍA FORENSE DEL MODO "BASE INTERMEDIA / TANQUE WIP" EN EL MODAL PRODUCTO

Modelo: Gemini 3.8 Flash
Effort: low

OBJETIVO TÉCNICO:
1. Auditar el modo "Base Intermedia / Tanque (WIP)" del modal de Producto.
2. Documentar diferencias exactas vs. el modo "Producto Comercial Envasado" (que ya fue mejorado en prompts 15a-15j).
3. Validar viabilidad de las mejoras propuestas para el modo WIP:
   - M1-WIP: Pantalla de selección previa con solo 2 botones + descripciones claras para usuario no técnico.
   - M2-WIP: Cascada Poka-Yoke estricta (bloqueo en cadena si no se llena lo anterior).
   - M3-WIP: Ergonomía visual (jerarquía, espaciado, iconos).
   - M4-WIP: Selector de Receta asociada (¿existe?).
   - M5-WIP: Unidad de Tanque / Capacidad (¿existe?).
   - M6-WIP: Volumen mínimo de producción (¿existe?).
4. CERO modificaciones. SOLO lectura y reporte.

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 5 LECTURAS / 0 EDICIONES):
- apps/web/src/app/catalog/products/components/ProductModal.jsx (para ver la lógica de tabs WIP vs Comercial)
- apps/web/src/app/catalog/products/components/modal-parts/useProductFormState.js (o useProductForm.js)
- apps/web/src/app/catalog/products/components/modal-parts/ProductBasicFields.jsx (o el que renderiza Nombre/Presentación)
- apps/api/prisma/schema.prisma (solo modelo Producto, campos WIP)
- apps/web/src/app/catalog/products/components/modal-parts/** (solo componentes nuevos creados en Fase 3B)

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 5 LECTURAS / 0 EDICIONES):
- CERO modificaciones. SOLO LECTURA.
- CERO búsquedas recursivas ciegas.
- Si tras 5 lecturas falta información, reportar `BLOQUEADO PARCIAL`.

ACCIONES A EJECUTAR:

1. **Pantalla de selección de tipo:**
   - Reportar cómo se renderiza el selector de tipo (WIP vs Comercial).
   - ¿Es una tab/pestaña? ¿Un toggle? ¿Un modal previo?
   - ¿Tiene descripción para usuario no técnico? (Sí/No/Parcial)
   - ¿Hay tercer tipo u otros modos?

2. **Campos específicos del modo WIP:**
   - Reportar TODOS los campos que se renderizan en modo WIP.
   - Comparar con modo Comercial: qué campos difieren.
   - ¿Existen campos exclusivos WIP? (ej: unidadTanque, capacidadTanque, recetaAsociada)
   - ¿Falta algún campo crítico?

3. **Poka-Yoke del modo WIP:**
   - ¿Hay cascada estricta? ¿Cuál es el orden de desbloqueo?
   - ¿Qué validaciones reactivas existen?
   - ¿El botón Guardar está disabled hasta completar campos obligatorios?
   - ¿Hay tooltips educativos? Reportar los textos.

4. **Modelo Prisma — modo WIP:**
   - Extraer los campos del modelo `Producto` relacionados al modo WIP (tipoProducto, esWIP, unidadTanque, capacidad, etc.).
   - Reportar si falta algún campo.

5. **Componentes específicos WIP:**
   - Listar los componentes `.jsx` que se renderizan solo en modo WIP.
   - Reportar sus responsabilidades.

6. **Selectores reales en el DOM del modo WIP:**
   - `name` de cada input/select/textarea.
   - `data-testid` si los hay.
   - Estabilidad de selectores.

7. **Tests E2E existentes del modo WIP:**
   - Buscar specs que testeen el modo WIP.
   - Reportar cobertura.

8. **Huecos detectados:**
   - Lista de mejoras que faltan en el modo WIP comparado con el Comercial ya mejorado.

VERIFICACIÓN:
- No aplica (0 ediciones).

CRITERIO DE TERMINACIÓN:
- Reporte forense completo.
- DETENTE inmediatamente tras reportar.
