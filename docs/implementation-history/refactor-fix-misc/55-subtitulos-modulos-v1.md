TAREA CONTROLADA — SUBTÍTULOS Y DESCRIPCIONES EN ENCABEZADOS DE PÁGINAS V1

OBJETIVO
Incorporar de forma estandarizada un subtítulo descriptivo debajo del título principal en cada una de las vistas del sistema, estableciendo una jerarquía visual clara, concisa y elegante mediante CSS Modules.

FUENTES DE VERDAD
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- apps/web/src/app/

REGLAS TÉCNICAS OBLIGATORIAS
1. Código fuente exclusivamente en JavaScript / JSX (.js, .jsx). PROHIBIDO TypeScript (.ts, .tsx).
2. Mantener CSS Modules. PROHIBIDO introducir Tailwind, styled-components o librerías externas de UI.
3. NO instalar dependencias adicionales.
4. NO alterar lógica de API, servicios, controladores ni llamadas a PostgreSQL.
5. NO tocar el seed ni modificar datos existentes en la base de datos.
6. Aplicar un diseño tipográfico homogéneo (color atenuado, peso balanceado y separación proporcional respecto a tablas o filtros).

DICCIONARIO DE TÍTULOS Y SUBTÍTULOS POR MÓDULO

1. GENERAL
- Dashboard:
  Título: Dashboard
  Subtítulo: Panel de control central con indicadores clave de rendimiento (KPIs), métricas operativas y balance financiero en tiempo real.

2. CATÁLOGOS
- Presentaciones:
  Título: Presentaciones
  Subtítulo: Formatos comerciales y tamaños de empaque final en los que se distribuyen los productos terminados.
- Insumos:
  Título: Insumos
  Subtítulo: Catálogo maestro de materias primas, envases y suministros requeridos para la formulación y empaque de productos.
- Proveedores:
  Título: Proveedores
  Subtítulo: Directorio de fabricantes y distribuidores autorizados de insumos, empaques y servicios.
- Precios de Proveedores:
  Título: Precios de Proveedores
  Subtítulo: Histórico y lista de tarifas vigentes cotizadas por cada proveedor para los diferentes insumos.
- Productos:
  Título: Productos
  Subtítulo: Catálogo de productos terminados listos para distribución comercial, enlazados a sus recetas y presentaciones.
- Recetas:
  Título: Recetas
  Subtítulo: Fórmulas estándar de elaboración que definen los insumos y cantidades exactas requeridas por lote de producción.

3. OPERACIONES
- Compras:
  Título: Compras
  Subtítulo: Registro y control de órdenes de adquisición de insumos a proveedores externos.
- Inventario:
  Título: Inventario
  Subtítulo: Control de existencias físicas disponibles en bodega, movimientos y alertas de reabastecimiento.
- Producción:
  Título: Producción
  Subtítulo: Planificación y registro de órdenes de fabricación ejecutadas a partir de las recetas maestras.
- Lotes:
  Título: Lotes
  Subtítulo: Trazabilidad de producción con fechas de fabricación, vencimiento y control de calidad.

4. COMERCIAL
- Clientes:
  Título: Clientes
  Subtítulo: Directorio de compradores comerciales (supermercados, tiendas, cafeterías) y personas naturales.
- Ventas:
  Título: Ventas
  Subtítulo: Facturación, pedidos y despachos de productos terminados a clientes.
- Pagos y Cobros:
  Título: Pagos y Cobros
  Subtítulo: Control de ingresos por cartera de clientes, recaudos efectivos y saldos pendientes por cobrar.
- Gastos:
  Título: Gastos
  Subtítulo: Registro de erogaciones operativas, servicios públicos, nómina y costos indirectos de fabricación.

PROCEDIMIENTO DE EJECUCIÓN
1. Ubicar la página principal (`page.jsx`) de cada una de las rutas mencionadas.
2. Añadir el párrafo del subtítulo debajo del encabezado principal sin alterar botones de acción (como "Nuevo Registro") ni filtros.
3. Asegurar los estilos en los respectivos archivos `.module.css` para mantener coherencia visual en toda la aplicación.
4. Ejecutar la validación de compilación: `pnpm --filter web build`.

CIERRE OBLIGATORIO
Entregar únicamente este reporte:

SUBTÍTULOS DE MÓDULOS — CIERRE
• Estado: COMPLETADO / ERROR
• Módulos actualizados: [Total y lista resumida]
• JavaScript nativo: OK
• TypeScript introducido: NO
• CSS Modules: OK
• Build: OK / ERROR
• Archivos modificados: [lista]
• Bloqueos: NINGUNO / [Detalle]