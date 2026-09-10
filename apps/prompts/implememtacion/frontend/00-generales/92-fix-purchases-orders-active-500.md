TAREA CONTROLADA — CORRECCIÓN DE ERROR 500 EN /purchases/orders/active Y BLINDAJE DE UI

OBJETIVO TÉCNICO EXACTO
Resolver el fallo HTTP 500 en `/api/v1/purchases/orders/active` y blindar la vista `/operations/purchases`:
1. Diagnosticar y corregir la consulta en `apps/api/src/purchases/purchases.repository.js` (método de recuperación de órdenes activas):
   - Verificar la propiedad exacta en el cliente de Prisma: comprobar si el delegado es `prisma.ordenCompra` o `prisma.ordenesCompra`.
   - Ejecutar `pnpm --filter api exec prisma generate` para sincronizar los tipos/métodos en el motor en tiempo de ejecución.
   - Si se usan relaciones en `include` (`insumo`, `proveedor`, `presentacion`), asegurar que los nombres coincidan estrictamente con las relaciones declaradas en `schema.prisma`.
2. En `apps/web/src/app/operations/purchases/page.jsx`:
   - Envolver la llamada a `orders/active` en un bloque `try/catch` independiente del listado histórico de compras.
   - Si no hay órdenes activas o la petición falla con 500/404, asignar `activeOrders = []` y continuar renderizando la tabla general de compras sin romper toda la pantalla.
3. MODO RÁPIDO: PROHIBIDO compilar con `pnpm build` o borrar `.next`.

FUENTES DE VERDAD OBLIGATORIAS
- apps/api/prisma/schema.prisma (modelos OrdenCompra y OrdenCompraItem)
- apps/api/src/purchases/purchases.repository.js
- apps/api/src/purchases/purchases.service.js
- apps/web/src/app/operations/purchases/page.jsx
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo.
3. Manejo resiliente de estados de red: los errores en paneles auxiliares nunca deben bloquear la vista principal.

ESPECIFICACIÓN PUNTUAL

1. Verificación en `purchases.repository.js`:
   - Corregir el método `findActiveOrders`:
     ```javascript
     async findActiveOrders() {
       return this.prisma.ordenCompra.findMany({
         where: {
           estado: { in: ['PENDIENTE', 'EN_PROCESO'] }
         },
         include: {
           items: true
         },
         orderBy: { createdAt: 'desc' }
       });
     }
     ```
   - Si el modelo en `schema.prisma` se definió en singular (`model OrdenCompra`), el acceso en Prisma Client es obligatorio en camelCase: `this.prisma.ordenCompra`.

2. Resiliencia en `operations/purchases/page.jsx`:
   - En la función que carga los datos iniciales (`Promise.all` o llamadas paralelas):
     Separar la carga de compras históricas (`/purchases`) de las órdenes activas (`/purchases/orders/active`).
   - Si `orders/active` arroja error, hacer fallback suave a `[]` y registrar la advertencia en consola sin lanzar excepción al árbol de React.

VALIDACIÓN LIGERA (SIN BUILD)
- Ejecutar `pnpm --filter api exec prisma generate`.
- Ejecutar `node --check apps/api/src/purchases/purchases.repository.js`.
- Ejecutar `node --check apps/web/src/app/operations/purchases/page.jsx`.
- Comprobar que `/api/v1/purchases/orders/active` devuelva HTTP 200 con un array `[]` (o con las órdenes existentes) en la pestaña Network de DevTools.

FORMATO DE REPORTE
Entregar reporte estándar indicando delegado de Prisma corregido, regeneración del cliente y blindaje de la vista frontend.