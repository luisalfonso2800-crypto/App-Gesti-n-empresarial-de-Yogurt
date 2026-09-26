FASE 25 — BLOQUE COMERCIAL FRONTEND V1
OBJETIVO
Implementar el bloque Comercial del frontend de Yogurt consumiendo el backend existente y respetando la arquitectura:
- Clients (/commercial/clients)
- Sales (/commercial/sales)
- Payments (/commercial/payments)
- Expenses (/commercial/expenses)

Esta fase continúa directamente después de:
- FASE 24 — Bloque Operación Frontend V1

REGLAS TÉCNICAS ESTRICTAS
1. JavaScript nativo (.js, .jsx). PROHIBIDO TypeScript (.ts, .tsx, tsconfig.json).
2. CSS Modules (*.module.css). PROHIBIDO Tailwind CSS, @tailwindcss o librerías externas de estilo.
3. CERO instalación automática de dependencias (NO ejecutar pnpm add / npm install). Si falta alguna, emitir "ESPERANDO INSTALACIÓN MANUAL" y detenerse.
4. Reutilizar componentes UI existentes (Button, Input, Table, Badge, Modal, States) y Shell (Header, Sidebar).
5. Consumir backend mediante apps/web/src/lib/api-client.js extendiéndolo según los endpoints de apps/api/src/.
6. NO modificar apps/api/ (backend solo lectura).

ALCANCE DE PÁGINAS Y OPERACIONES
1. Clients: Listado de clientes, formulario de creación y edición.
2. Sales: Listado de órdenes de venta con estados de entrega/pago y creación de venta con productos y cantidades.
3. Payments: Registro y listado de cobros/pagos vinculados a ventas.
4. Expenses: Registro y clasificación de gastos operativos con importes y fechas.

VALIDACIÓN
- Actualizar Sidebar.jsx con los accesos de la sección Comercial.
- Ejecutar compilación: pnpm --filter web build

FORMATO DE CIERRE
Responder exclusivamente con:

FASE 25 — CIERRE

• Estado: COMPLETADA / PARCIAL / BLOQUEADA
• Clients: OK / ERROR
• Sales: OK / ERROR
• Payments: OK / ERROR
• Expenses: OK / ERROR
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
• Siguiente fase: Fase 26 — Dashboard, Navegación e Integración UX