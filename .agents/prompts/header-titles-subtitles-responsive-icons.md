# PROMPT: HEADER DINÁMICO CON TÍTULO, SUBTÍTULO DESCRIPTIVO, RESPONSIVE A SOLO ÍCONOS Y MIGRACIÓN DE ENCABEZADOS DE PÁGINAS

## OBJETIVO TÉCNICO
1. **Header Enriquecido (Título + Descripción):**
   - Actualizar el Header transversal para proyectar tanto el **título** como el **subtítulo descriptivo** formal de cada módulo según la ruta activa (`pathname`).
   - El título y subtítulo se resuelven exclusivamente desde el `pathname` base, manteniendo **aislamiento hermético de modales** (ningún modal altera el encabezado).

2. **Header Responsive (Colapso Inteligente a Sólo Íconos):**
   - Cuando el ancho de pantalla disminuya o no haya espacio suficiente:
     - Los botones de acción rápida del Header (ej. "Nueva Venta", "Lista Activa", "SISTEMA EN LÍNEA") colapsan a **sólo íconos** con tooltip/aria-label.
     - **EXCEPCIÓN ESTRICTA:** El botón de **Paso a Paso / Puesta en marcha (`OnboardingWizardWidget`)** NUNCA colapsa a sólo ícono; conserva siempre su texto de progreso y estado ("Paso X/Y" o "Planta Operativa").

3. **Migración y Limpieza de Encabezados Locales en Páginas:**
   - Como los títulos y subtítulos ahora se muestran de forma limpia, formal y permanente en la barra superior (Header), se deben retirar los `h1` y `p.subtitle` duplicados de las vistas de página (`SuppliesHeader`, `ProductsHeader`, etc.), reorganizando las barras de herramientas (filtros, botones de acción) para aprovechar al máximo el espacio vertical del ERP.
   - Preservar selectores E2E y compatibilidad con pruebas.

---

## ARCHIVOS Y ALCANCE
- **Header y utilidades:**
  - `apps/web/src/components/shell/Header.jsx`
  - `apps/web/src/components/shell/parts/headerModuleTitles.js`
  - `apps/web/src/components/shell/header.module.css`
  - `apps/web/src/components/shell/shell.module.css`
  - `apps/web/src/components/shell/OnboardingWizardWidget.jsx`
- **Páginas a limpiar encabezados duplicados:**
  - Catálogos (`supplies`, `products`, `presentations`, `recipes`, `providers`, `supplier-prices`)
  - Operaciones (`purchases`, `inventory`, `production`, `lots`)
  - Comercial (`sales`, `clients`, `payments`, `expenses`)

---

## ESPECIFICACIONES DE TU PROMPT / AJUSTES ADICIONALES:
<!-- Agrega a continuación indicaciones específicas antes de ejecutar -->
