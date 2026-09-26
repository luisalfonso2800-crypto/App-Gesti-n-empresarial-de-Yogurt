TAREA:
1. Incorporar en AGENTS.md la regla obligatoria de Empty States Asistidos y el desglose de acrónimos técnicos en lenguaje natural.
2. Crear el componente reutilizable `AssistedEmptyState.jsx` con diseño MANNÁ.
3. Integrar el Empty State asistido en todos los módulos de Catálogos, Operaciones y Comercial (excepto Dashboard).
4. Normalizar términos técnicos (como BOM y WIP) para que incluyan siempre su significado entre paréntesis.

OBJETIVO:
Estandarizar la experiencia de bienvenida en todas las pantallas del ERP:
1. En `AGENTS.md`, formalizar que ninguna tabla o listado (salvo el Dashboard) puede mostrar "No hay registros" plano ni pantallas en blanco; deben renderizar un Empty State Asistido con estética MANNÁ (tarjeta lino `#FAF8F5`, borde discontinuo `#D6D3D1`, ícono representativo, texto de valor de planta, botón primario y guía espacial hacia arriba a la derecha ↗).
2. Formalizar en `AGENTS.md` que cualquier acrónimo industrial o técnico debe ir acompañado obligatoriamente de su significado entre paréntesis (ej. `BOM (Lista de Materiales y Fórmula)`, `WIP (Semielaborado en Proceso)`).
3. Implementar el componente desacoplado `apps/web/src/components/ui/AssistedEmptyState.jsx`.
4. Reemplazar los estados vacíos huérfanos en las vistas maestras de Catálogos, Operaciones y Comercial por `AssistedEmptyState`, adaptando el ícono, título, descripción pedagógica y botón al contexto de cada módulo.
5. Revisar etiquetas visibles en frontend y reemplazar cualquier uso solitario de "BOM" por "BOM (Lista de Materiales)".

FUENTES DE VERDAD:
- `AGENTS.md` (Reglas 13.1, 13.2, 35, 36)
- `apps/web/src/app/catalog/recipes/components/RecipesList.jsx` (Patrón de referencia visual)
- `docs/antigravity/MANUAL_DE_DISENO_UI_UX.md`

REGLA DE CONSULTA:
Lee exclusivamente `AGENTS.md`, `RecipesList.jsx` y las tablas/listados principales de cada módulo (`apps/web/src/app/`). No modifiques endpoints en `apps/api/` ni esquemas de base de datos.

ALCANCE:

LEER:
- `AGENTS.md`
- `apps/web/src/app/catalog/recipes/components/RecipesList.jsx`
- Vistas de listado en:
  * Catálogos: `presentations`, `supplies`, `suppliers`, `supplier-prices`, `products`, `recipes`
  * Operaciones: `purchases`, `inventory`, `production`, `lots`
  * Comercial: `customers`, `sales`, `payments`, `expenses`

CREAR:
- `apps/web/src/components/ui/AssistedEmptyState.jsx`
- `apps/web/src/components/ui/AssistedEmptyState.module.css`

MODIFICAR:
- `AGENTS.md`
- Componentes de lista o páginas de los módulos indicados para consumir `AssistedEmptyState`.

NO MODIFICAR:
- `apps/web/src/app/dashboard/` (El Dashboard es centro de comando SCADA, excluido de esta regla).
- Archivos en `apps/api/`.

INSTRUCCIONES:

1. ACTUALIZACIÓN NORMATIVA EN `AGENTS.md`:
   - Incorporar tras la regla 36:
     `### 37. ESTADOS VACÍOS ASISTIDOS OBLIGATORIOS (EXCEPTO DASHBOARD)`
     - Queda prohibido mostrar textos fríos como "No hay registros", spinners infinitos o tablas desiertas sin guía cuando una entidad no tenga datos (`length === 0`).
     - Todo módulo (a excepción del Dashboard SCADA) DEBE renderizar el componente `AssistedEmptyState` con:
       * Contenedor centrado: `max-width: 620px`, fondo lino `#FAF8F5`, borde discontinuo `1px dashed #D6D3D1`, `border-radius: 12px`, `padding: 3rem 2rem`.
       * Ícono temático de dominio.
       * Título orientado a la acción: "Comienza registrando tu primer [Recurso]".
       * Microcopy pedagógico de planta: qué es y para qué sirve en la operativa diaria.
       * Botón de acción primario con estilo Verde Bosque MANNÁ (`#182622`).
       * Guía espacial con flecha al botón fijo superior: "o pulsa el botón [Nombre Botón] situado arriba a la derecha ↗".

     `### 38. DESGLOSE OBLIGATORIO DE ACRÓNIMOS Y JERGA INDUSTRIAL (LENGUAJE DE PLANTA)`
     - Toda sigla técnica o acrónimo visible en interfaz debe incluir obligatoriamente su definición en español entre paréntesis para que cualquier operario lo entienda de inmediato:
       * `BOM` -> `BOM (Lista de Materiales y Fórmula)`
       * `WIP` -> `WIP (Semielaborado en Proceso)`
       * `FEFO` -> `FEFO (Primero en Vencer, Primero en Salir)`
       * `FIFO` -> `FIFO (Primero en Entrar, Primero en Salir)`
       * `CIP` -> `CIP (Limpieza y Sanitización en Sitio)`
       * `SKU` -> `SKU (Código Comercial de Producto)`
     - Queda vetado el uso de siglas aisladas en encabezados, botones, tarjetas o tablas.

2. CREACIÓN DEL COMPONENTE REUTILIZABLE (`apps/web/src/components/ui/AssistedEmptyState.jsx`):
   - Props obligatorias:
     * `icon`: String (emoji) o Componente de ícono Lucide.
     * `title`: String con encabezado claro.
     * `description`: String explicando el rol de la entidad en planta.
     * `actionLabel`: Texto del botón (ej. "+ Registrar Nuevo Insumo").
     * `onAction`: Callback a ejecutar (abre el modal correspondiente).
     * `topButtonLabel`: Texto del botón de cabecera referenciado (ej. "Nuevo Insumo").
   - Estilos en `AssistedEmptyState.module.css`:
     * Paleta MANNÁ: fondo `#FAF8F5`, borde `#D6D3D1`, botón `#182622` (hover `#2C3E38`, texto `#FFFFFF`), texto sutil `#78716C`.

3. INTEGRACIÓN EN CADA MÓDULO (CUANDO `items.length === 0`):
   - **Presentaciones:** "Define los envases y moldes físicos (botellas, vasos) donde se empacan los productos" (Botón: "+ Nueva Presentación ↗").
   - **Insumos:** "Registra las materias primas, cultivos y empaques necesarios para elaborar productos" (Botón: "+ Nuevo Insumo ↗").
   - **Proveedores:** "Registra los fabricantes y distribuidores de materia prima y empaques" (Botón: "+ Nuevo Proveedor ↗").
   - **Precios de Proveedores:** "Cotiza tarifas de compra para calcular costos base de materia prima" (Botón: "+ Nueva Tarifa ↗").
   - **Productos:** "Registra los artículos comerciales terminados vinculados a su receta y envase" (Botón: "+ Nuevo Producto ↗").
   - **Compras:** "Registra entradas de insumos a bodega para abastecer la planta y actualizar Kardex" (Botón: "+ Nueva Compra ↗").
   - **Inventario:** "Controla el stock disponible en bodega valorizado al costo promedio" (Botón de acción hacia compras o ajuste).
   - **Producción:** "Programa órdenes de transformación por lote a partir de las recetas activas" (Botón: "+ Programar Producción ↗").
   - **Lotes:** "Rastrea la trazabilidad sanitaria, fechas de elaboración y vencimiento por lote" (Texto informativo).
   - **Clientes:** "Directorio de compradores comerciales y puntos de venta" (Botón: "+ Nuevo Cliente ↗").
   - **Ventas:** "Facturación y pedidos de despacho a clientes" (Botón: "+ Nueva Venta ↗").
   - **Pagos y Cobros:** "Seguimiento a recaudos de cartera y pagos a proveedores" (Botón: "+ Registrar Pago/Cobro ↗").
   - **Gastos:** "Registro de servicios, nómina y costos operativos de la planta" (Botón: "+ Nuevo Gasto ↗").

4. REVISIÓN Y REEMPLAZO DE SIGLAS EN UI:
   - En `RecipeModal.jsx`, `IngredientsFormSection.jsx` y tablas:
     Reemplazar cualquier texto `BOM` o `Lista de Materiales (BOM)` por `BOM (Lista de Materiales)` o `BOM (Fórmula de Materiales)`.

VERIFICACIÓN:
1. `node --check apps/web/src/components/ui/AssistedEmptyState.jsx`
2. `pnpm --filter web exec next lint --file src/components/ui/AssistedEmptyState.jsx`

CRITERIO DE FINALIZACIÓN:
- `AGENTS.md` incluye formalmente las reglas 37 (Empty States Asistidos) y 38 (Acrónimos con Significado).
- El componente `AssistedEmptyState.jsx` está creado y conectado en las vistas cuando la lista está vacía.
- Todas las menciones de "BOM" en pantalla muestran su significado entre paréntesis.
- Cero errores sintácticos o de ESLint.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Entrega únicamente:
- Archivos creados y modificados:
- Resumen de reglas incorporadas a AGENTS.md:
- Módulos donde se integró el Empty State asistido:
- Comprobación sintáctica:
- Estado: