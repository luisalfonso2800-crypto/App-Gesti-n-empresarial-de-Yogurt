# TEST E2E — INSUMOS: CASCADA POKA-YOKE, PREGUNTA DINÁMICA Y ASISTENTE DE DENSIDAD

## ⚠️ REGLAS ESTRICTAS DE ULTRA-AHORRO DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes.
3. NO ejecutar Playwright (la ejecución es exclusiva del operador humano).
4. NO modificar código de producción en `apps/web/src` ni en `apps/api/src`.
5. LÍMITES DUROS: Máximo 3 lecturas directas, exactamente 1 archivo `.spec.js` a crear, máximo 6 llamadas a herramientas.
6. LÍMITE DE TAMAÑO: El archivo no debe superar las 140 líneas (SRP de testing). Tests explícitos sin bucles dinámicos `for...of`.
7. Al terminar de escribir el archivo, DETENERSE de inmediato.

---

## 📌 CONTEXTO AUDITADO (FUENTES DE VERDAD)
- **Ruta UI:** `/catalog/supplies`
- **Apertura:** Botón `button:has-text("Nuevo Registro")`
- **Título Modal:** Heading `Nuevo Insumo`
- **Comportamiento en Cascada (Poka-Yoke):**
  * Al abrir: Solo `nombre` editable. `categoria`, `subcategoria`, `marca`, `empaque`, `unidadBase`, `contenido`, `stockMinimo` inician en `disabled`.
  * `Nombre` lleno -> Habilita `Categoría`.
  * `Categoría` seleccionada -> Habilita `Subcategoría`.
  * `Subcategoría` seleccionada -> Habilita `Marca` y `Empaque`.
  * `Empaque` seleccionado -> Habilita `Unidad Base`.
  * `Unidad Base` seleccionada -> Habilita `Contenido`.
  * `Contenido` lleno -> Habilita `Stock Mínimo`, `Costo Referencial`, `Observaciones`.
- **Pregunta Dinámica y Pleca:**
  * Al seleccionar `BULTO` y `kg`, la etiqueta cambia a: `¿Cuántos kilogramos tiene el BULTO? *`
  * Input de contenido tiene pleca divisoria con sufijo (`| kg`). Formatea miles en vivo (`25.000`).
- **Motor de Densidad:**
  * Preset rápido: Clic en chip "Leche (1.03)" -> Asigna `1.03` al input bloqueado (`readOnly`).
  * Calculadora con Balanza: Selector de volumen (`500 ml`) + peso balanza (`515 g`) -> Calcula `1.03` g/ml.
  * Desbloqueo manual: Clic en ✏️ -> Abre `DensityConfirmModal`. Cancelar mantiene bloqueo; confirmar permite edición manual.

---

## 🛠️ TAREA ÚNICA: CREAR EL SPEC

Crear `apps/web/e2e/supplies/supplies-flow-and-density.spec.js` con los siguientes tests declarativos (< 140 líneas en total):

### Bloque 1: Desbloqueo en Cascada Poka-Yoke
- **D01 [Bloqueo inicial]:** Al abrir el modal, verificar que `categoriaSelect`, `marcaInput`, `stockInput` tengan estado `toBeDisabled()`.
- **D02 [Desbloqueo progresivo 1 a 1]:** 
  * Escribir nombre -> verificar `categoriaSelect` habilitado.
  * Seleccionar categoría -> verificar `subcategoriaSelect` habilitado.
  * Seleccionar subcategoría -> verificar `marcaInput` y `empaqueSelect` habilitados.
  * Seleccionar empaque -> verificar `unitSelect` habilitado.

### Bloque 2: Pregunta Dinámica y Formateo de Contenido
- **D03 [Etiqueta adaptativa en lenguaje natural]:** Seleccionar Empaque "BULTO" y Unidad "kg" -> Validar que el label contenga `/¿cuántos kilogramos tiene el bulto\?/i`.
- **D04 [Pleca y separador de miles]:** Escribir `25000` en contenido -> Validar que el input conserve `25.000` y el contenedor adyacente exhiba `kg`.

### Bloque 3: Asistente y Presets de Densidad
- **D05 [Preset rápido de 1 clic]:** Clic en chip "Leche (1.03)" -> Validar que el input de densidad muestre `1,0` o `1.03` y permanezca con atributo `readOnly`.
- **D06 [Cálculo con Gramera/Balanza]:** Abrir asistente balanza -> Elegir `500 ml` -> Tipear `515` g -> Validar proyección automática a `1.03` g/ml en el input de resultado.
- **D07 [Modal de Confirmación de Desbloqueo]:** Clic en botón de edición manual de densidad -> Validar que abra diálogo de confirmación. Clic en "Cancelar" -> Input sigue bloqueado.

---

## 🛑 CONDICIÓN DE DETENCIÓN:
- Archivo `apps/web/e2e/supplies/supplies-flow-and-density.spec.js` generado.
- CERO ejecuciones automáticas de Playwright.
- DETENTE inmediatamente tras reportar.

## 📋 REPORTE DE SALIDA (ESTRICTO):
Entregar ÚNICAMENTE:
• Archivo creado y conteo de líneas.
• Resumen de tests implementados (D01 a D07).
• Comando PowerShell para ejecución por el operador humano:
  `pnpm --filter web exec playwright test supplies-flow-and-density --reporter=list --timeout=20000`
• Estado: [COMPLETADO / BLOQUEADO].