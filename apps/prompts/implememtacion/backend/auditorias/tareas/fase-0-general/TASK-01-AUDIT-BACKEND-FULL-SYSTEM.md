TAREA:
Auditoría Técnica Forense Exhaustiva del Backend y Base de Datos por Módulos (Solo Lectura)

OBJETIVO:
Generar una documentación técnica profunda y modular sobre la arquitectura del backend (`apps/api`), evaluando para cada uno de los 6 módulos:
1. Definición y restricciones en Prisma Schema.
2. Controladores (Controllers) y Rutas/Endpoints (HTTP methods, status codes).
3. Servicios y Repositorios (Lógica de negocio, queries Prisma, transacciones).
4. Validaciones de Entrada (Middlewares, Zod/Joi, tipado de payloads).
5. Manejo de Errores y Excepciones (Códigos HTTP, sanitización de respuestas).

REGLAS ESTRICTAS DE CONSUMO DE QUOTA Y RENDIMIENTO:
- ESTRICTAMENTE PROHIBIDO MODIFICAR CÓDIGO FUENTE O LA BASE DE DATOS.
- PROHIBIDO USAR BÚSQUEDAS RECURSIVAS GLOBALES (`Get-ChildItem -Recurse`, `dir /s`, `find .`).
- Leer únicamente las rutas directas de cada módulo listadas a continuación.
- Generar un documento Markdown por cada módulo en la carpeta `docs/auditorias/backend/`.

MÓDULOS Y ARCHIVOS ESPECÍFICOS A INSPECCIONAR:

MÓDULO 1: Catálogos y Unidades (`01-catalogos-insumos-productos.md`)
- Tablas: Insumos, Presentaciones, Productos, Precios_Proveedores
- Rutas: `apps/api/src/supplies/`, `apps/api/src/products/`, `apps/api/src/presentations/`

MÓDULO 2: Recetas y Producción (`02-recetas-y-produccion.md`)
- Tablas: Recetas, Etapas_Receta, Detalle_Recetas, Producciones, Detalle_Producciones
- Rutas: `apps/api/src/recipes/`, `apps/api/src/productions/`

MÓDULO 3: Inventario y Trazabilidad (`03-inventario-kardex-lotes.md`)
- Tablas: Inventario, Inventario_Productos, Movimientos_Inventario, Lotes
- Rutas: `apps/api/src/inventory/`, `apps/api/src/lots/`

MÓDULO 4: Abastecimiento y Compras (`04-compras-proveedores-ordenes.md`)
- Tablas: Proveedores, Compras, Detalle_Compras, Ordenes_Compra, Orden_Compra_Items
- Rutas: `apps/api/src/purchases/`, `apps/api/src/suppliers/`

MÓDULO 5: Ventas, Clientes y Cartera (`05-ventas-clientes-pagos.md`)
- Tablas: Clientes, Ventas, Detalle_Ventas, Pagos
- Rutas: `apps/api/src/sales/`, `apps/api/src/customers/`, `apps/api/src/payments/`

MÓDULO 6: Finanzas y Metas Empresariales (`06-finanzas-gastos-metas.md`)
- Tablas: Configuracion_Empresa, Gastos, Metas_Empresariales, Aportes_Metas
- Rutas: `apps/api/src/expenses/`, `apps/api/src/goals/`, `apps/api/src/company/`

ESTRUCTURA OBLIGATORIA DE CADA REPORTE:
Cada archivo generado (`docs/auditorias/backend/<nombre-modulo>.md`) debe contener:
1. **Resumen de Base de Datos:** Campos clave, llaves foráneas, índices, restricciones `@unique` y consistencia de tipos numéricos (`Decimal` vs `Int`).
2. **Matriz de Endpoints:** Tabla con Método HTTP, Ruta, Parámetros recibidos y Status Codes retornados.
3. **Validaciones y DTOs:** Mecanismos de validación de entradas y cómo se previenen inyecciones o campos nulos.
4. **Lógica de Negocio y Transaccionalidad:** Evaluación de uso de `prisma.$transaction`, manejo de operaciones atómicas y bloqueos.
5. **Manejo de Errores:** Cómo captura errores el módulo (try/catch, capturadores globales) y si se exponen errores internos al cliente.
6. **Vulnerabilidades y Brechas Detectadas:** Listado de puntos débiles que requieren optimización técnica.

DETENCIÓN:
Al redactar y guardar los 6 documentos de auditoría en `docs/auditorias/backend/`, DETENTE inmediatamente.