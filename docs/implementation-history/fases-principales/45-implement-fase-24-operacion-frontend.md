FASE 24 — BLOQUE OPERACIÓN FRONTEND V1
OBJETIVO
Implementar el bloque completo de Operación del frontend consumiendo el backend existente y respetando la arquitectura:
- Purchases (/operations/purchases)
- Inventory (/operations/inventory)
- Production (/operations/production)
- Lots (/operations/lots)

Esta fase continúa directamente después de:
- FASE 23 — Bloque Maestros Frontend V1

1. FUENTES DE VERDAD Y LENGUAJE
- Leer docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md y revisar apps/api/src/ para contratos.
- JAVASCRIPT OBLIGATORIO: Usar únicamente .js, .jsx, .module.css. Prohibido TypeScript (.ts, .tsx, tsconfig.json).
- ESTILOS: CSS Modules exclusivamente. Cero Tailwind.
- DEPENDENCIAS: Prohibido instalar paquetes automáticamente. Si falta una, emitir ficha "ESPERANDO INSTALACIÓN MANUAL" y detenerse.
- Reutilizar Button, Input, Table, Badge, Modal, States y Shell existentes.

2. ALCANCE FUNCIONAL
- Purchases: Listado de compras con estados y modal/formulario de creación con detalles (proveedor, insumos, precios, cantidades).
- Inventory: Vista de niveles de stock actual por insumo y producto terminado con badges de estado.
- Production: Listado de órdenes de producción y creación de orden asociando receta y cantidad a producir.
- Lots: Listado de lotes generados, estados de vencimiento y trazabilidad.

3. NAVEGACIÓN Y BUILD
- Actualizar apps/web/src/components/shell/Sidebar.jsx con los accesos del bloque Operación.
- Extender apps/web/src/lib/api-client.js para los endpoints requeridos.
- Ejecutar validación de compilación: pnpm --filter web build

4. FORMATO DE CIERRE
Responder exclusivamente con:

FASE 24 — CIERRE

• Estado: COMPLETADA / PARCIAL / BLOQUEADA
• Purchases: OK / ERROR
• Inventory: OK / ERROR
• Production: OK / ERROR
• Lots: OK / ERROR
• JavaScript: OK / ERROR
• TypeScript introducido: NO / SÍ
• CSS Modules: OK / ERROR
• API Client: OK / ERROR
• Navegación: OK / ERROR
• Build: OK / ERROR
• Dependencias nuevas: NINGUNA / [lista]
• Instalación requerida manualmente: NO / SÍ
• Archivos creados: [lista]
• Archivos modificados: [lista]
• Archivos eliminados: [lista]
• Backend modificado: NO / SÍ
• Bloqueos: NINGUNO / [detalle]
• Siguiente fase: Bloque Comercial Frontend