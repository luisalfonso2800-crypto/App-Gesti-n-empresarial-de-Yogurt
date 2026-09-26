TAREA:
Implementar cápsula reactiva de retroalimentación textual en lenguaje de planta al pie de cada Etapa de Producción en el módulo de Recetas.

OBJETIVO:
En `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx` (y sus subcomponentes de etapa/ingredientes):
1. Generar dinámicamente un párrafo descriptivo en lenguaje natural al final de cada tarjeta de etapa que sintetice:
   - Los insumos y cantidades agregados en esa etapa específica (litros, gramos, unidades de empaque).
   - Las condiciones térmicas configuradas (temperaturas mín/máx en °C).
   - Los tiempos de proceso (minutos y su conversión a horas si supera los 60 min, ej. "480 min [8 horas]").
   - El propósito u orden de trabajo ("Instrucciones").
2. Si la etapa no tiene insumos agregados aún, indicarlo claramente: "Fase de proceso térmico/espera sin adición de materiales".
3. Renderizar esta lectura en una cápsula estilizada con la identidad MANNÁ (fondo lino `#F7F4EE`, borde `#E5DFD5`, texto `#182622`) para que el operario valide lo configurado antes de pasar a la siguiente etapa.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
- `apps/web/src/app/catalog/recipes/components/IngredientsFormSection.jsx`
- `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
- `AGENTS.md` (Reglas 13.1, 13.2, 35 de Flujo Mental y Lenguaje de Planta)

REGLA DE CONSULTA:
Modifica exclusivamente los componentes del editor de recetas en frontend. Prohibido tocar backend o base de datos.

ALCANCE:

LEER:
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
- `apps/web/src/app/catalog/recipes/components/IngredientsFormSection.jsx`

MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx` (o componente que itere `etapas`)

NO MODIFICAR:
- ningún archivo en `apps/api/`.
- esquemas de base de datos ni migraciones.

INSTRUCCIONES:

1. HELPER GENERADOR DE LECTURA NATURAL POR ETAPA:
   Crear una función utilitaria pura (ej. `generateStageSummaryText(etapa, catalogSupplies, catalogProducts)`):
   - **Insumos:**
     * Extraer y listar los ítems activos de `etapa.detalles`.
     * Formatear cantidades: ej. "3.000 ml de LECHE ENTERA" o "50 Unidades de VASO 16 OZ".
     * Si no hay insumos: "sin adición de materiales físicos".
   - **Tiempos y Conversión Horaria:**
     * Si `etapa.tiempoEstandarMin`:
       - Si `>= 60 min`: calcular horas exactas o fraccionarias, ej. "480 min (8 horas)" o "90 min (1.5 horas)".
       - Si `< 60 min`: "30 min".
     * Si cuenta con rango `tiempoMinimoMin` / `tiempoMaximoMin`: añadir "(rango admisible: X a Y min)".
   - **Temperaturas:**
     * Si tiene `tempMinimaGrados` y `tempMaximaGrados`: "manteniendo temperatura entre X°C y Y°C".
     * Si solo tiene una: "a temperatura de X°C".
   - **Instrucción:**
     * Si hay texto en `etapa.instrucciones`: "para: [instrucciones]".

2. CÁPSULA VISUAL EN EL PIE DE CADA TARJETA DE ETAPA:
   - Al final del contenedor de cada etapa (justo después del bloque BOM / Lista de Materiales y antes de la siguiente etapa), renderizar:
     ```jsx
     <div style={{
       marginTop: '1rem',
       padding: '0.65rem 0.95rem',
       backgroundColor: '#F7F4EE',
       border: '1px solid #E5DFD5',
       borderRadius: '6px',
       display: 'flex',
       alignItems: 'flex-start',
       gap: '0.6rem',
       boxSizing: 'border-box'
     }}>
       <span style={{ fontSize: '1rem', lineHeight: '1.2' }}>📋</span>
       <div style={{ fontSize: '0.76rem', color: '#182622', lineHeight: '1.45' }}>
         <strong style={{ color: '#182622', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.04em' }}>
           Lectura de Operación en Planta:
         </strong>
         <div style={{ marginTop: '0.15rem' }}>
           {summarySentence}
         </div>
       </div>
     </div>
     ```

3. REACTIVIDAD EN TIEMPO REAL:
   - La frase debe actualizarse instantáneamente a medida que el usuario tipea o cambia insumos, cantidades, temperaturas o tiempos en esa etapa.

VERIFICACIÓN:
1. `pnpm --filter web exec next lint --file src/app/catalog/recipes/components/RecipeModal.jsx`
2. `node --check apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`

CRITERIO DE FINALIZACIÓN:
- Cada tarjeta de etapa muestra al pie su resumen textual en español llano.
- Los tiempos superiores a 60 minutos muestran su equivalencia en horas entre paréntesis.
- Si se agregan o quitan insumos del BOM, la lectura los suma o descarta en tiempo real.
- Next lint y verificación de sintaxis concluyen con código 0.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Entrega únicamente:
- Archivos modificados:
- Vista previa de la frase generada para una etapa térmica y una de envasado:
- Resultado de comprobación lint:
- Estado:
