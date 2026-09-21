OBJETIVO: Auditar exhaustivamente la cadena de valor, dependencias relacionales de datos y flujo operativo real del sistema a partir de `apps/api/prisma/schema.prisma` y los formularios en `apps/web/src/app/`. Prohibido modificar código, crear scripts o alterar el estado del repositorio (modo estricto de solo lectura).

FUENTES DE INSPECCIÓN:
- `apps/api/prisma/schema.prisma` (modelo relacional, campos obligatorios y llaves foráneas).
- Formularios y selectores en:
  - `apps/web/src/app/catalog/` (`suppliers`, `supplies`, `presentations`, `products`, `recipes`, `supplier-prices`).
  - `apps/web/src/app/operations/` (`purchases`, `production`, `lots`).
  - `apps/web/src/app/commercial/` (`sales`, `clients`, `expenses`, `payments`).

INSTRUCCIONES DE AUDITORÍA:

1. MAPEO DE DEPENDENCIAS RELACIONALES DURAS (Prisma):
   - Identificar el nivel de precedencia estricto según campos `NOT NULL` con `@relation`:
     - Nivel 0 (Entidades Maestras Autónomas): Pueden crearse en frío sin requerir ningún dato previo.
     - Nivel 1 (Entidades Vinculadas): Exigen la preexistencia de al menos una entidad Nivel 0.
     - Nivel 2 (Estructuras de Transformación/Composición): Requieren múltiples entidades de Nivel 0 y 1 para formularse.
     - Nivel 3 (Operaciones Transaccionales): Exigen stock, relaciones compuestas, clientes o recetas previas.

2. DETECCIÓN DE PUNTOS CIEGOS Y CUELLOS DE BOTELLA (UI vs Código):
   - Mapear qué sucede si el usuario intenta operar pantallas avanzadas con catálogos vacíos (ej. crear Receta sin insumos o sin costos base asignados; crear Producto sin Presentación; crear Producción sin Receta aprobada o sin stock).
   - Identificar si existen o faltan atajos operativos (ej. posibilidad de crear Proveedor/Insumo al vuelo dentro de una Compra, o si el sistema obliga a abandonar el flujo para ir a catálogos).

3. SECUENCIA CRONOLÓGICA REAL (Paso a Paso del Negocio):
   - Reconstruir el orden lógico exacto que un usuario nuevo debe seguir desde una base de datos vacía hasta registrar su primera venta exitosa sin toparse con bloqueos.

4. PROPUESTA PARA ASISTENTE / ONBOARDING EN HEADER:
   - Lineamientos concretos para implementar un checklist o barra de progreso interactiva en el `Header` que guíe al operador en la carga inicial y deshabilite o alerte sobre accesos a pantallas cuyas dependencias previas aún no existen.

VERIFICACIÓN:
Asegurar que el repositorio permanezca intacto ejecutando:
`git status --short`

SALIDA REQUERIDA (Informe estructurado en Markdown):
1. Matriz Técnica de Dependencias (Tabla: Entidad | Nivel | Llaves Foráneas Requeridas | Dependencias Previas Obligatorias).
2. Puntos Ciegos y Fricciones Detectadas en Frontend (Listado de validaciones que bloquean pantallas si no hay datos previos).
3. Secuencia Cronológica Definitiva de Puesta en Marcha (Paso 1 al N con justificación técnica).
4. Especificaciones para el Asistente Onboarding del Header.