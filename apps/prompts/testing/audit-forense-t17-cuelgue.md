# AUDITORÍA FORENSE DE TEST E2E — CAUSA RAÍZ DE CUELGUE EN T17 Y SIMILARES

## ⚠️ REGLAS ESTRICTAS DE CONSUMO DE QUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. MODO SOLO LECTURA: PROHIBIDO modificar, crear o alterar archivos de código (`.js`, `.jsx`, `.ts`).
3. PROHIBIDO ejecutar Playwright, builds, dev servers o comandos git.
4. PROHIBIDO lanzar subagentes o búsquedas recursivas (`find`, `dir /s`, `grep -r`).
5. LÍMITES DUROS: Máximo 3 lecturas de archivo, exactamente 1 archivo creado (el reporte Markdown), máximo 6 llamadas a herramientas.
6. Al generar el informe Markdown, DETENERSE inmediatamente sin texto redundante en consola.

---

## 📌 OBJETIVO TÉCNICO:
Identificar con evidencia dura del código por qué los casos `T17, T20, T24, T25, T26, T28, T31, T32, T35, T44` se cuelgan hasta el timeout global de 20s en `apps/web/e2e/supplies-validations.spec.js`, mientras que el resto de los 34 tests pasan de manera consistente.

---

## 🛠️ TAREAS DE INSPECCIÓN:

### T1. Lectura del Archivo de Pruebas
Leer `apps/web/e2e/supplies-validations.spec.js`:
- Extraer las rutinas de soporte: `openSupplyModal`, `ensureCategorySelected`, `closeModal` y `getFormLocators`.
- Extraer el bloque del loop ejecutor donde se iteran los casos de `validationCases`.
- Comparar los objetos de definición: casos que pasan (ej. `T01-T16`, `T18`) versus los que se cuelgan (`T17, T20, T24, T25, T26, T28, T31, T32, T35, T44`).

### T2. Análisis Forense Diferencial
Determinar:
1. **Diferencias en `fill` y flags:** ¿Qué propiedades específicas de `fill` activan ramas de ejecución distintas en el formulario?
2. **Comportamiento ante `selectOption`:** Si `fill.empaque` o `fill.unidadBase` reciben valores vacíos `''`, ¿Playwright intenta seleccionar una opción inexistente y espera pasivamente?
3. **Flujo de `expectError`:** ¿Qué aserciones o esperas (`waitFor*`, `waitForTimeout`, `expect`) se ejecutan exclusivamente cuando `expectError === true` versus cuando es `false`?
4. **Estado residual del Modal (`closeModal`):** Si un test falla o termina, ¿el modal permanece en pantalla bloqueando al siguiente test con superposición de clicks?

---

## 🛑 ENTREGABLE:
Generar el reporte técnico en:  
`apps/prompts/testing/AUDITORIA-T17-CUELGUE.md`

### Estructura obligatoria del informe:
1. **Tabla Comparativa de Casos:** Matriz con `ID`, `Resultado (Pasa/Cuelga)`, `Payload (fill)`, `expectError` y rama de código ejecutada.
2. **Evidencia Literal del Cuelgue:** Fragmentos exactos de código donde la promesa queda suspendida.
3. **Hipótesis Validadas con el Código:**
   - Causa raíz demostrable #1 (la más probable con base en la API de Playwright).
   - Causa raíz demostrable #2.
4. **Plan de Corrección Definitivo (Sin aplicar):** Solución quirúrgica propuesta en código para destrabar el runner sin alterar la cobertura.

DETENCIÓN:
Al redactar y guardar el archivo Markdown, DETENTE inmediatamente.