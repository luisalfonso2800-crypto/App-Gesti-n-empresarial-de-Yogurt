TAREA:
Retirar la etiqueta '(V2)' del título, implementar un Empty State asistido y conectar la apertura automática del modal de recetas desde el widget de Onboarding.

OBJETIVO:
En el frontend (`apps/web`):
1. Limpiar el título en `RecipesHeader.jsx`: cambiar "Recetas Técnicas (V2)" por "Recetas Técnicas", retirando cualquier referencia a versiones internas de desarrollo.
2. Rediseñar el Empty State en `RecipesList.jsx` (o `page.jsx`): sustituir el texto frío "No hay registros - Crea la primera receta para comenzar" por una tarjeta visual guiada con estética MANNÁ (fondo lino `#FAF8F5`, borde suave, ícono representativo, explicación del rol de una receta en planta, indicación hacia la esquina superior derecha y un botón primario directo "+ Crear Primera Receta").
3. Solucionar la apertura del modal desde el Onboarding: cuando el usuario pulse [Completar ➔] en el Paso 4 del widget `OnboardingWizardWidget.jsx`, si ya está en `/catalog/recipes`, abrir inmediatamente el modal de creación (`RecipeModal.jsx`), sincronizando query params (`?crear=receta`) y eventos de ventana.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/page.jsx`
- `apps/web/src/app/catalog/recipes/components/RecipesHeader.jsx`
- `apps/web/src/app/catalog/recipes/components/RecipesList.jsx`
- `apps/web/src/components/shell/OnboardingWizardWidget.jsx`
- `AGENTS.md` (Reglas 13.1, 13.2, 35 de Flujo Mental y 36 de Estilo MANNÁ)

REGLA DE CONSULTA:
Modifica exclusivamente los archivos indicados en `apps/web/`. Prohibido tocar backend o base de datos.

ALCANCE:

LEER:
- `apps/web/src/app/catalog/recipes/page.jsx`
- `apps/web/src/app/catalog/recipes/components/RecipesHeader.jsx`
- `apps/web/src/app/catalog/recipes/components/RecipesList.jsx`
- `apps/web/src/components/shell/OnboardingWizardWidget.jsx`

MODIFICAR:
- `apps/web/src/app/catalog/recipes/page.jsx`
- `apps/web/src/app/catalog/recipes/components/RecipesHeader.jsx`
- `apps/web/src/app/catalog/recipes/components/RecipesList.jsx`
- `apps/web/src/components/shell/OnboardingWizardWidget.jsx`

NO MODIFICAR:
- ningún archivo en `apps/api/`.

INSTRUCCIONES:

1. LIMPIEZA DE TÍTULO Y BOTONERA (`RecipesHeader.jsx`):
   - Reemplazar "Recetas Técnicas (V2)" por "Recetas Técnicas".
   - Mantener el subtítulo descriptivo de planta.
   - Asegurar que el botón "+ Nueva Receta" adopte la paleta oficial MANNÁ (fondo Verde Bosque `#182622`, hover `#2C3E38`, esquinas suaves, texto `#FFFFFF`).

2. EMPTY STATE ASISTIDO Y ELEGANTE (`RecipesList.jsx` o contenedor de estado vacío):
   - Si la lista de recetas está vacía (`recipes.length === 0`), renderizar una tarjeta central asistida:
     ```jsx
     <div style={{
       backgroundColor: '#FAF8F5',
       border: '1px dashed #D6D3D1',
       borderRadius: '12px',
       padding: '3rem 2rem',
       textAlign: 'center',
       maxWidth: '620px',
       margin: '2.5rem auto'
     }}>
       <div style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>📋</div>
       <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#182622', marginBottom: '0.5rem' }}>
         Comienza formulando tu primera Receta Técnica
       </h3>
       <p style={{ fontSize: '0.84rem', color: '#57534E', lineHeight: '1.5', marginBottom: '1.5rem' }}>
         Las recetas vinculan tus productos con los insumos de bodega y las bases en tanque, definiendo ingredientes, empaques, tiempos y temperaturas de elaboración.
       </p>
       <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
         <button
           type="button"
           onClick={onNewRecipe}
           style={{
             backgroundColor: '#182622',
             color: '#FFFFFF',
             padding: '0.65rem 1.4rem',
             borderRadius: '8px',
             fontWeight: '700',
             fontSize: '0.875rem',
             cursor: 'pointer',
             border: 'none',
             boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
           }}
         >
           + Formular Nueva Receta
         </button>
         <span style={{ fontSize: '0.74rem', color: '#78716C' }}>
           o pulsa el botón <strong>Nueva Receta</strong> situado arriba a la derecha ↗
         </span>
       </div>
     </div>
     ```

3. SINCRONIZACIÓN ONBOARDING -> APERTURA DE MODAL (`page.jsx` & `OnboardingWizardWidget.jsx`):
   - En `OnboardingWizardWidget.jsx`:
     * En el botón `[Completar ➔]` del Paso 4 (Recetas), asegurar que la ruta sea `/catalog/recipes?crear=receta`.
     * Al hacer clic, despachar también el evento global:
       `window.dispatchEvent(new CustomEvent('open-recipe-modal'));`
   - En `apps/web/src/app/catalog/recipes/page.jsx`:
     * Leer `searchParams.get('crear') === 'receta'`.
     * Suscribirse mediante `useEffect` al evento `'open-recipe-modal'`.
     * Cuando se detecte el parámetro o el evento:
       - Abrir el modal: invocar `handleOpenCreate()` o la función correspondiente de apertura.
       - Limpiar de forma silenciosa la URL con `window.history.replaceState({}, '', '/catalog/recipes')` para que el botón del widget pueda activarse repetidas veces sin recargar la página.

VERIFICACIÓN:
1. `pnpm --filter web exec next lint --file src/app/catalog/recipes/page.jsx --file src/app/catalog/recipes/components/RecipesHeader.jsx --file src/app/catalog/recipes/components/RecipesList.jsx --file src/components/shell/OnboardingWizardWidget.jsx`
2. `node --check apps/web/src/app/catalog/recipes/page.jsx`

CRITERIO DE FINALIZACIÓN:
- El título dice únicamente "Recetas Técnicas" (sin V2).
- La pantalla vacía presenta una tarjeta estructurada, estética y con botón de acción directo.
- Al pulsar [Completar ➔] desde el Onboarding estando en `/catalog/recipes`, se abre el modal de creación de inmediato.
- Lint y validación sintáctica finalizan con código 0.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Entrega únicamente:
- Archivos modificados:
- Resumen de la solución aplicada:
- Comprobación lint:
- Estado: