FASE 23 — BLOQUE MAESTROS FRONTEND V1
OBJETIVO
Implementar de forma completa el bloque de Maestros Fundamentales del frontend de Yogurt.
Esta fase continúa directamente después de:

FASE 22 — Infraestructura Frontend + Presentations
FASE 22-FIX — Migración completa a JavaScript
El frontend oficial utiliza:

Next.js
JavaScript
JSX
CSS Modules
NO utilizar TypeScript.
NO introducir Tailwind.
NO cambiar la arquitectura frontend existente.
La finalidad de esta fase es implementar, utilizando el patrón ya validado con Presentations, los siguientes módulos:

Supplies
Suppliers
Supplier Prices
Products
Recipes

1. FUENTES DE VERDAD
Antes de modificar código, leer:

docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
docs/implementation/03-module-implementation-order.md
docs/implementation/05-prisma-implementation-plan.md
docs/implementation/06-approved-module-pattern.md
docs/backend/
docs/domains/
docs/data-model/
apps/api/prisma/schema.prisma

También revisar la implementación frontend existente de:

apps/web/src/app/catalog/presentations/
apps/web/src/components/
apps/web/src/lib/
apps/web/package.json

La documentación existente y el backend ya implementado son el contrato.
No inventar campos.
No inventar endpoints.
No inventar reglas de negocio.

2. REGLA FUNDAMENTAL: JAVASCRIPT
Este proyecto NO utiliza TypeScript.
Todo el código frontend nuevo debe utilizar:

.js
.jsx
.css
.module.css
No crear:

.ts
.tsx
No crear:

tsconfig.json
No agregar dependencias relacionadas con TypeScript.
No volver a migrar ninguna parte del frontend hacia TypeScript.
Si encuentras archivos TypeScript existentes fuera del alcance:

NO convertirlos automáticamente
salvo que sea estrictamente necesario para completar esta fase.
La implementación oficial debe permanecer en JavaScript + JSX.

3. ESTILOS
El sistema utiliza:

CSS Modules
Mantener esta decisión.
No instalar ni introducir:

Tailwind
@tailwindcss/*
PostCSS relacionado exclusivamente con Tailwind
styled-components
emotion
No reemplazar CSS Modules por otra solución.
Cada componente o módulo debe utilizar sus archivos .module.css cuando corresponda.

4. REGLA CRÍTICA SOBRE DEPENDENCIAS
NO instalar automáticamente nuevas dependencias.
NO ejecutar:

npm install
pnpm install
pnpm add
npm install paquete
para solucionar necesidades durante esta fase.
Primero analizar las dependencias actualmente instaladas.
Si alguna funcionalidad requiere una dependencia que no está instalada:

Identificarla.
Indicar exactamente:
nombre
versión recomendada
motivo
dónde se utilizaría
DETENER la implementación antes de modificar package.json o lockfiles.

Formato:

DEPENDENCIAS REQUERIDAS

1. paquete
   Versión:
   Motivo:

2. paquete
   Versión:
   Motivo:

ESTADO:
ESPERANDO INSTALACIÓN MANUAL
No continuar hasta que las dependencias estén disponibles.
Si no se necesitan dependencias nuevas:

DEPENDENCIAS NUEVAS:
NINGUNA
y continuar.

5. REUTILIZAR EL PATRÓN EXISTENTE
No crear una arquitectura frontend nueva para cada módulo.
Primero estudiar:

Presentations
y reutilizar su patrón.
Reutilizar cuando corresponda:

API Client
Shell
Header
Sidebar
Button
Input
Table
Badge
Modal
States
CSS Modules
La finalidad es que los nuevos módulos tengan una estructura consistente.
No duplicar componentes UI existentes.
Si un componente reutilizable existente necesita una pequeña mejora para soportar los nuevos módulos:

modificarlo de forma compatible
No crear una segunda versión del mismo componente.

6. ESTRUCTURA GENERAL
La estructura deberá seguir la arquitectura actual de:

apps/web/src/
Conceptualmente:

components/
    ui/
    shell/

lib/
    api-client.js

app/
    catalog/
        presentations/
        supplies/
        suppliers/
        supplier-prices/
        products/
        recipes/
Adaptar la estructura a la existente si la documentación define otra ubicación.
No crear carpetas innecesarias.

7. BLOQUE SUPPLIES
Implementar completamente la interfaz frontend de:

Supplies
Debe consumir el backend existente.
Implementar como mínimo las operaciones que el backend ya expone para el módulo:

listar
consultar
crear
actualizar
si dichas operaciones existen en el contrato backend.
La interfaz debe respetar los campos reales de:

Supply
según documentación y Prisma.
No inventar campos.
Debe incluir:

Listado
Formulario de creación
Formulario de edición
Estados de carga
Estado vacío
Errores
Validaciones básicas de entrada
Confirmación o feedback de operación

8. BLOQUE SUPPLIERS
Implementar:

Suppliers
utilizando el backend existente.
Incluir las operaciones soportadas oficialmente:

listar
consultar
crear
actualizar
según el contrato real.
Respetar exactamente los campos documentados.
Incluir:

Listado
Crear
Editar
Estados de carga
Estado vacío
Errores
Feedback de operación

9. BLOQUE SUPPLIER PRICES
Implementar:

Supplier Prices
como módulo frontend independiente si así está definido por la arquitectura.
Debe respetar la relación entre:

Supplier
Supply
Price
según el modelo real.
No duplicar entidades ni crear estructuras paralelas.
Los selectores o referencias deben consumir datos reales del backend cuando corresponda.
No introducir datos ficticios permanentes.

10. BLOQUE PRODUCTS
Implementar:

Products
respetando la definición existente del dominio.
Debe integrarse con las entidades que el backend ya permite relacionar.
No implementar nuevamente:

Recipes
Production
Inventory
Sales
dentro de Products.
Solo consumir las relaciones necesarias para la funcionalidad documentada.
Incluir:

Listado
Crear
Editar
Visualización
Estados
Errores
Validación
según las capacidades reales del backend.

11. BLOQUE RECIPES
Implementar:

Recipes
utilizando el contrato existente.
La interfaz debe permitir trabajar con la estructura real de recetas y sus detalles.
Respetar:

Product
Supply
cantidad
unidad
relaciones
únicamente cuando estén definidas en la documentación y backend.
No inventar cálculos de costos.
No implementar lógica de producción.
No implementar inventario.
La interfaz debe consumir la lógica que ya existe en backend.

12. API CLIENT
Utilizar:

apps/web/src/lib/api-client.js
como punto central de comunicación.
No hacer llamadas HTTP directamente desde múltiples componentes si el patrón existente establece un cliente centralizado.
Antes de agregar métodos:

revisar el api-client existente
Extenderlo de forma consistente.
No duplicar lógica HTTP.
No crear clientes independientes para cada módulo.

13. RUTAS
Crear las rutas necesarias siguiendo el patrón existente.
Conceptualmente:

/catalog/supplies
/catalog/suppliers
/catalog/supplier-prices
/catalog/products
/catalog/recipes
Utilizar la convención real de navegación del proyecto.
Actualizar el Sidebar únicamente para agregar las entradas correspondientes.
No modificar navegación existente innecesariamente.

14. FORMULARIOS
Los formularios deben utilizar los componentes UI existentes.
Priorizar:

Input
Button
Modal
States
y los componentes equivalentes ya existentes.
No crear formularios visualmente incompatibles con Presentations.
Los formularios deben distinguir claramente:

crear
editar
cuando corresponda.

15. VALIDACIÓN FRONTEND
La validación frontend debe mejorar la experiencia del usuario, pero NO reemplazar la validación backend.
Validar únicamente reglas que puedan determinarse con seguridad desde el contrato.
Ejemplos:

campo requerido
formato básico
valores claramente inválidos
Las reglas de negocio definitivas permanecen en backend.
No duplicar innecesariamente toda la lógica de negocio.

16. ESTADOS DE INTERFAZ
Todos los módulos deben manejar correctamente:

Loading
Empty
Error
Success
No dejar pantallas en blanco cuando una solicitud falla.
No utilizar datos ficticios para ocultar errores de API.
Si el backend responde error:

mostrar un estado comprensible
sin exponer información técnica innecesaria.

17. CONSISTENCIA VISUAL
Los cinco módulos deben parecer parte de la misma aplicación.
Mantener:

Shell
Sidebar
Header
tipografía
espaciado
botones
inputs
tablas
modales
badges
estados
ya establecidos.
No realizar un rediseño visual general.
No cambiar la identidad visual existente.

18. NO MODIFICAR BACKEND
Esta fase es exclusivamente frontend.
NO modificar:

apps/api/
apps/api/prisma/
schema.prisma
migraciones
salvo que exista una incompatibilidad real que impida consumir correctamente un endpoint ya documentado.
Si se detecta una incompatibilidad:

NO corregir silenciosamente el backend.
Documentarla y detener únicamente la parte afectada.

19. NO ADELANTAR FASES
No implementar todavía:

Purchases
Inventory
Production
Lots
Clients
Sales
Payments
Expenses
Dashboard final
Aunque técnicamente sea posible.
Esta fase termina con:

Supplies
Suppliers
Supplier Prices
Products
Recipes

20. VALIDACIÓN DURANTE LA IMPLEMENTACIÓN
Después de cada bloque comprobar:

ruta
renderizado
importaciones
API
estados
formularios
No esperar hasta el final para descubrir errores estructurales.

21. BUILD
Al finalizar ejecutar:

pnpm --filter web build
Si el proyecto tiene configurados otros comandos de validación, utilizarlos.
No instalar herramientas nuevas únicamente para satisfacer esta fase.
Si el build falla:

investigar
corregir
volver a ejecutar
siempre que el problema esté dentro del alcance.

22. VERIFICACIÓN BÁSICA FINAL
Esta fase NO requiere una auditoría profunda.
Realizar únicamente una comprobación básica de:

Supplies → existe y funciona
Suppliers → existe y funciona
Supplier Prices → existe y funciona
Products → existe y funciona
Recipes → existe y funciona
Comprobar también:

JavaScript: OK
JSX: OK
CSS Modules: OK
API Client: OK
Build: OK
No realizar una auditoría documental extensa.

23. CONTROL DE CAMBIOS
Antes de cerrar revisar:

git status
git diff
Confirmar que los cambios pertenecen al frontend y al alcance de esta fase.
No modificar archivos fuera de necesidad.
No modificar lockfiles por iniciativa propia.
No introducir dependencias no autorizadas.

24. CRITERIO DE FINALIZACIÓN
La fase puede declararse:

COMPLETADA
cuando:

Supplies: OK
Suppliers: OK
Supplier Prices: OK
Products: OK
Recipes: OK

JavaScript: OK
CSS Modules: OK
API Client: OK
Navegación: OK
Build: OK
y no existan bloqueos conocidos.
Si una parte no puede completarse debido a una dependencia externa:

PARCIAL
explicando exactamente qué falta.

25. FORMATO DE CIERRE
Responder exclusivamente con:

FASE 23 — CIERRE

• Estado: COMPLETADA / PARCIAL / BLOQUEADA

• Supplies: OK / ERROR
• Suppliers: OK / ERROR
• Supplier Prices: OK / ERROR
• Products: OK / ERROR
• Recipes: OK / ERROR

• JavaScript: OK / ERROR
• TypeScript introducido: NO / SÍ
• CSS Modules: OK / ERROR
• API Client: OK / ERROR
• Navegación: OK / ERROR
• Estados UI: OK / ERROR
• Formularios: OK / ERROR
• Integración API: OK / ERROR
• Build: OK / ERROR

• Dependencias nuevas: NINGUNA / [lista]
• Instalación requerida manualmente: NO / SÍ

• Archivos creados: [lista]
• Archivos modificados: [lista]
• Archivos eliminados: [lista]

• Backend modificado: NO / SÍ
• Lockfile modificado: NO / SÍ
• Cambios fuera de alcance: NINGUNO / [detalle]
• Bloqueos: NINGUNO / [detalle]

• Siguiente fase: Bloque Operación Frontend