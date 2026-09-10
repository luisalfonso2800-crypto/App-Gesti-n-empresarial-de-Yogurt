FASE 27 — INTEGRACIÓN FINAL BACKEND + FRONTEND V1
Lee primero:
@[docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md]
Después revisa:
@[docs/implementation/05-prisma-implementation-plan.md]
Y ejecuta la integración final de la V1.

OBJETIVO
No crear nuevos módulos funcionales.
El objetivo de esta fase es comprobar que todo lo construido hasta ahora funciona correctamente como un único sistema integrado.
IMPORTANTE:

El proyecto utiliza JavaScript, NO TypeScript.
No introducir TypeScript bajo ninguna circunstancia.
El frontend utiliza Next.js + JavaScript + CSS Modules.
No introducir Tailwind.
No instalar dependencias nuevas automáticamente.
Si detectas que una dependencia es necesaria, DETENTE y reporta exactamente:
nombre
versión recomendada
motivo
comando para instalarla manualmente
No ejecutes instalaciones de dependencias por iniciativa propia.
No modificar arquitectura si no es necesario.
No realizar refactors grandes.
No crear funcionalidades V2/V3.
Corregir únicamente problemas necesarios para que la V1 funcione.
ALCANCE
Verificar la integración completa:

BACKEND
Comprobar que continúan funcionando:

Presentations
Supplies
Suppliers
Supplier Prices
Products
Recipes
Purchases
Inventory
Production
Lots
Clients
Sales
Payments
Expenses
Verificar:

Controllers
Services
Repositories
DTOs
Validaciones
Prisma
PostgreSQL
Relaciones
Transacciones
Manejo de errores
Persistencia
FRONTEND
Comprobar:

Dashboard
Shell
Sidebar
Header
Navegación
Presentations
Supplies
Suppliers
Supplier Prices
Products
Recipes
Purchases
Inventory
Production
Lots
Clients
Sales
Payments
Expenses
Verificar:

JavaScript
JSX
CSS Modules
API Client
Estados de carga
Estados vacíos
Estados de error
Formularios
Validaciones
Mensajes de éxito/error
Navegación
Integración con API
FLUJOS DE NEGOCIO
Comprobar como mínimo estos flujos:

Presentación → Producto → Receta.
Proveedor → Precio de proveedor → Compra.
Compra → Inventario.
Producción → Inventario → Lote.
Cliente → Venta → Inventario → Lote.
Venta → Pago.
Gastos.
Flujo transversal completo:
Compra de insumos
→ entrada a inventario
→ producción
→ generación de lote
→ salida de inventario
→ venta
→ pago.
Verificar especialmente que las operaciones que modifican inventario mantengan consistencia transaccional.

RESTRICCIÓN IMPORTANTE
No hagas una auditoría profunda del proyecto.
Esta fase es una integración final V1.
No conviertas la tarea en una revisión arquitectónica interminable.
Si algo funciona, déjalo funcionando.
Si algo está roto, corrígelo únicamente si la corrección pertenece claramente a V1.
Si encuentras algo que corresponde a V2/V3, NO lo implementes.
Regístralo como pendiente.

VALIDACIONES
Ejecutar las validaciones disponibles del proyecto.
Como mínimo intentar:

Prisma format
Prisma validate
Prisma generate
Tests backend
Tests de integración
Build frontend
Verificar además que:

no existan archivos .ts o .tsx dentro de apps/web
no exista tsconfig.json del frontend
no se haya introducido TypeScript
no se haya introducido Tailwind
no se hayan agregado dependencias innecesarias
DEPENDENCIAS
NO instalar dependencias automáticamente.
Si falta alguna dependencia:
DETENTE respecto a esa instalación y reporta:
DEPENDENCIA REQUERIDA

Nombre:
Versión:
Motivo:
Comando manual:
Continúa con las demás verificaciones que no dependan de ella.

CAMBIOS
Solo modificar archivos cuando exista un problema real comprobado.
No modificar:

lógica funcional que ya funciona
arquitectura
modelos de negocio
contratos API
estructura de módulos
sin una justificación técnica concreta.

DOCUMENTACIÓN
Actualizar:
docs/implementation/05-prisma-implementation-plan.md
Solo si corresponde registrar el cierre de esta fase.
No crear documentación adicional salvo que sea estrictamente necesaria.

CRITERIO DE FINALIZACIÓN
La fase solo puede declararse COMPLETADA si:

Backend integrado: OK
Frontend integrado: OK
Navegación: OK
API Client: OK
Persistencia: OK
Flujos principales: OK
Inventario: OK
Producción: OK
Lotes: OK
Ventas: OK
Pagos: OK
Errores básicos: OK
JavaScript: OK
TypeScript introducido: NO
CSS Modules: OK
Tailwind: NO
Tests: OK o documentar exactamente qué no pudo ejecutarse
Build: OK o documentar exactamente el bloqueo
CIERRE OBLIGATORIO
Al finalizar entrega exactamente este reporte:
FASE 27 — CIERRE
• Estado:
• Backend integrado:
• Frontend integrado:
• Dashboard:
• Navegación:
• API Client:
• Presentations:
• Supplies:
• Suppliers:
• Supplier Prices:
• Products:
• Recipes:
• Purchases:
• Inventory:
• Production:
• Lots:
• Clients:
• Sales:
• Payments:
• Expenses:
• Flujo Compra → Inventario:
• Flujo Producción → Inventario → Lotes:
• Flujo Venta → Inventario → Lotes:
• Flujo Venta → Pago:
• Flujo transversal completo:
• Persistencia PostgreSQL:
• Transacciones:
• Manejo de errores:
• JavaScript:
• TypeScript introducido:
• CSS Modules:
• Tailwind:
• Tests:
• Prisma format:
• Prisma validate:
• Prisma generate:
• Build:
• Dependencias nuevas:
• Instalación manual requerida:
• Archivos creados:
• Archivos modificados:
• Archivos eliminados:
• Cambios fuera de alcance:
• Problemas encontrados:
• Problemas corregidos:
• Pendientes V1:
• Pendientes V2/V3:
• Bloqueos:
• Estado del Backend:
• Estado del Frontend:
• Estado general del proyecto:
• Siguiente fase: