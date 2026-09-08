TAREA CONTROLADA — DIAGNÓSTICO Y CORRECCIÓN: ERROR EN PRECIOS DE PROVEEDORES

OBJETIVO
Investigar y corregir de forma inmediata el fallo "Error en la petición" mostrado en la vista de Precios de Proveedores (`/catalog/supplier-prices`), asegurando que liste correctamente las tarifas registradas en PostgreSQL.

FUENTES DE VERDAD
- `docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md`
- `apps/web/src/app/catalog/supplier-prices/page.jsx`
- `apps/web/src/lib/api-client.js`
- `apps/api/src/` (Rutas y controladores de precios de proveedores)

REGLAS TÉCNICAS OBLIGATORIAS
1. Código frontend exclusivamente en JavaScript / JSX (.js, .jsx). PROHIBIDO TypeScript (.ts, .tsx).
2. Mantener CSS Modules. PROHIBIDO Tailwind.
3. NO instalar dependencias adicionales ni modificar el lockfile.
4. NO alterar modelos ni esquemas de Prisma.
5. NO ejecutar operaciones destructivas en PostgreSQL.

PROCEDIMIENTO DE DIAGNÓSTICO Y CORRECCIÓN
1. Inspeccionar `apps/web/src/app/catalog/supplier-prices/page.jsx`:
   - Identificar qué endpoint está consultando en el `useEffect` de carga inicial.
   - Revisar qué parámetros envía y cómo desempaqueta la respuesta del backend.
2. Comprobar el endpoint en el backend:
   - Verificar si la ruta solicitada existe en el backend de la API (ej. `/api/supplier-prices` o `/api/precios-proveedores`).
   - Comprobar si el controlador requiere autenticación, filtros obligatorios o falla al hacer el `include` de Insumos o Proveedores en Prisma.
3. Corrección:
   - Si el endpoint en el frontend estaba mal nombrado o los datos no coincidían con la respuesta del API Client, corregir la ruta o el mapeo.
   - Si faltaba manejo de respuesta en el backend para listar los registros existentes, ajustar el controlador/servicio de forma segura.
   - Incluir el subtítulo estandarizado del módulo si aún no lo tiene:
     "Histórico y lista de tarifas vigentes cotizadas por cada proveedor para los diferentes insumos."
4. Validación:
   - Ejecutar `pnpm --filter web build` para garantizar que la compilación termine con código de salida 0.

FORMATO DE CIERRE
Entregar exclusivamente este reporte:

CORRECCIÓN PRECIOS PROVEEDORES — CIERRE
• Estado: COMPLETADO / ERROR
• Causa del error: [Descripción puntual de por qué fallaba la petición]
• Endpoint corregido: [Ruta utilizada]
• Listado funcional: SÍ / NO
• JavaScript nativo: OK
• TypeScript introducido: NO
• CSS Modules: OK
• Build: OK / ERROR
• Archivos modificados: [lista]
• Bloqueos: NINGUNO / [Detalle]