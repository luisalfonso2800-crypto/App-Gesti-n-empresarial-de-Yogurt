TAREA CONTROLADA — DIAGNÓSTICO TÉCNICO Y AUDITORÍA INTEGRAL: MÓDULO DE RECETAS

OBJETIVO
Inspeccionar exhaustivamente el backend, modelos de Prisma, endpoints y frontend del módulo de Recetas y sus conexiones operativas (Insumos, Productos, Inventario, Producción, Lotes y Costos). El fin es obtener la radiografía técnica real del sistema para diseñar la fase Recetas V2 (fórmula técnica con etapas, variantes y consumos reales) sin asumir supuestos de documentos antiguos.

REGLAS DE SEGURIDAD ESTRICTAS (SOLO DIAGNÓSTICO)
1. Tarea de SOLO LECTURA. 
2. PROHIBIDO crear, modificar o eliminar archivos del proyecto.
3. PROHIBIDO ejecutar migraciones en Prisma o mutaciones en PostgreSQL.
4. PROHIBIDO refactorizar código o alterar endpoints existentes.
5. La fuente de verdad absoluta es el código fuente actual en disco y la base de datos viva.

FUENTES DE INSPECCIÓN OBLIGATORIAS
- `apps/api/prisma/schema.prisma`
- `apps/api/src/recipes/` (controladores, servicios, repositorios)
- `apps/api/src/production/`, `apps/api/src/inventory/`, `apps/api/src/supplies/`
- `apps/web/src/app/catalog/recipes/`
- `apps/api/prisma/seed-test-data.js`

ASPECTOS OBLIGATORIOS A INSPECCIONAR

1. MODELO DE DATOS (Prisma):
   - Modelos exactos para Recetas y Detalle de Recetas (nombres de campos, tipos, claves foráneas y relaciones con Insumos y Productos).
   - Determinar si existen entidades para etapas/fases de producción, tiempos de proceso o variantes de producto.

2. CAPA BACKEND (NestJS / Express):
   - Endpoints vigentes para Recetas (rutas GET, POST, PATCH, DELETE).
   - Comprobar si el backend soporta la creación/edición de múltiples insumos en una receta o si solo persiste la cabecera básica.
   - Analizar si existe cálculo de costos o consumo automático de stock vinculado a la receta.

3. CAPA FRONTEND (React / Next.js):
   - Flujo de creación y edición en `apps/web/src/app/catalog/recipes/page.jsx`.
   - Identificar por qué se solicita un campo de texto libre para el ID del Producto y por qué no existe selector interactivo de Insumos.
   - Evaluar cómo se visualiza el rendimiento base y si se exponen los detalles.

4. MATRIZ DE NEGOCIO (Fórmulas, Variantes y Etapas):
   - Analizar la viabilidad de separar materiales/insumos (leche, tapas, azúcar, cucharas) de parámetros de proceso (tiempo de fermentación, refrigeración).
   - Evaluar cómo modelar complementos variables (cereal, frutas, jaleas) sin duplicar recetas maestras.

ESTRUCTURA OBLIGATORIA DEL REPORTE DE CIERRE
Entregar el diagnóstico respondiendo exactamente a los siguientes puntos:

1. ESTADO ACTUAL DE RECETAS
2. MODELOS DE BASE DE DATOS INVOLUCRADOS (Nombres y campos exactos en schema.prisma)
3. BACKEND ACTUAL (Endpoints, validaciones y soporte de detalles)
4. FRONTEND ACTUAL (Componentes, entradas de usuario y carencias de UX)
5. RELACIÓN RECETA → PRODUCTO
6. RELACIÓN RECETA → INSUMOS
7. RELACIÓN RECETA → INVENTARIO
8. RELACIÓN RECETA → PRODUCCIÓN
9. RELACIÓN RECETA → LOTES
10. RELACIÓN RECETA → COSTOS
11. QUÉ FUNCIONA ACTUALMENTE
12. QUÉ NO FUNCIONA O NO EXISTE
13. LIMITACIONES DE LA ESTRUCTURA ACTUAL
14. QUÉ DEBERÍA SOPORTAR LA NUEVA RECETA (Materiales vs. Procesos)
15. INFORMACIÓN QUE YA TENEMOS
16. INFORMACIÓN QUE FALTA
17. DEPENDENCIAS CON OTROS MÓDULOS
18. RIESGOS DE IMPLEMENTACIÓN
19. PROPUESTA DE ARQUITECTURA TÉCNICA PARA LA NUEVA FASE
20. PREGUNTAS CLAVE ANTES DEL DISEÑO FINAL