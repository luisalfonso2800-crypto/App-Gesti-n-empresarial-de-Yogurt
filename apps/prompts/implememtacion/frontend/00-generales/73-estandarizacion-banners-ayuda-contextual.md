TAREA CONTROLADA — ESTANDARIZACIÓN GLOBAL DE BANNERS DE AYUDA CONCEPTUAL Y TÉCNICA

OBJETIVO
Crear e integrar un componente de banner contextual reutilizable en todas las vistas del ERP (Catálogos y Operaciones) para que cualquier operario entienda de inmediato el propósito técnico de cada módulo y cómo se articula con el resto del sistema.

FUENTES DE VERDAD
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- apps/web/src/components/ui/
- apps/web/src/app/catalog/
- apps/web/src/app/operations/

REGLAS TÉCNICAS OBLIGATORIAS
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo con diseño limpio y sobrio. PROHIBIDO Tailwind.
3. El componente debe ser ligero, accesible y colocarse directamente debajo del subtítulo de la página antes de la barra de filtros o tabla principal.

ALCANCE PUNTUAL

1. Componente Reutilizable (`apps/web/src/components/ui/ContextBanner.jsx` y `context-banner.module.css`):
   - Props: `title` (opcional), `description` (texto técnico descriptivo), `icon` (opcional o icono de ayuda predeterminado).
   - Estilo: Contenedor con borde suave, fondo tenue integrado a la paleta, tipografía legible y espaciado compacto para no desplazar excesivamente el contenido principal.

2. Integración en Pantallas de Catálogo (`apps/web/src/app/catalog/`):
   - `presentations/page.jsx`: Concepto de Formato / Molde físico sin precio ni sabor.
   - `supplies/page.jsx`: Concepto de Materia Prima y Empaque con unidades base estandarizadas.
   - `suppliers/page.jsx`: Terceros comerciales y canales de aprovisionamiento.
   - `supplier-prices/page.jsx`: Matriz de cotización comparativa y costo unitario base.
   - `products/page.jsx`: Artículo comercial vendible (SKU) con adición de la columna visual de "Presentación Asociada".
   - `recipes/page.jsx`: Fórmulas técnicas con ruta de etapas (BOM) y parámetros térmicos/temporales.

3. Integración en Pantallas de Operaciones (`apps/web/src/app/operations/`):
   - `purchases/page.jsx`: Registro y conciliación de insumos ingresados a planta.
   - `inventory/page.jsx`: Existencias físicas disponibles y valorización de bodega.
   - `production/page.jsx`: Órdenes de transformación, control de insumos y registro de mermas.
   - `lots/page.jsx`: Trazabilidad sanitaria y vencimientos por lote elaborado.

VALIDACIÓN
- Ejecutar `pnpm --filter web build` y confirmar compilación exitosa con código 0.

FORMATO DE CIERRE
Entregar exclusivamente el reporte estándar indicando estado, páginas intervenidas y confirmación de build limpio.