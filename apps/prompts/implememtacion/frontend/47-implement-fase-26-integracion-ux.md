FASE 26 — DASHBOARD, NAVEGACIÓN E INTEGRACIÓN UX
OBJETIVO
Consolidar el frontend integrando el Dashboard principal (/dashboard o /), refinando la navegación global del Shell y asegurando la coherencia en estados (Loading/Empty/Error/Success) y enlaces en toda la plataforma de Yogurt.

Esta fase continúa directamente después de:
- FASE 25 — Bloque Comercial Frontend V1

REGLAS TÉCNICAS
1. JavaScript estricto (.js, .jsx). PROHIBIDO TypeScript (.ts, .tsx, tsconfig.json).
2. CSS Modules (*.module.css). PROHIBIDO Tailwind CSS.
3. CERO instalación automática de dependencias.
4. Backend intacto (apps/api/ en modo solo lectura).

ALCANCE
1. Dashboard (/):
   - Tarjetas de resumen métrico consumiendo endpoints reales o agregando datos de los módulos existentes (Stock crítico, Compras recientes, Ventas del día, Lotes activos).
   - Accesos directos a los flujos operativos clave (Registrar compra, Registrar producción, Nueva venta).
2. Refinamiento de Navegación (Shell):
   - Asegurar que todos los enlaces del Sidebar y Header conecten a las rutas reales creadas (Catálogo, Operación, Comercial, Dashboard).
   - Indicador visual claro de ruta activa.
3. Validación y Build:
   - Ejecutar: pnpm --filter web build

FORMATO DE CIERRE
Responder exclusivamente con la plantilla FASE 26 — CIERRE.