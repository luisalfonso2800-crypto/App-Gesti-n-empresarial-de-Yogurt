TAREA CONTROLADA — AJUSTE FINAL AL DISEÑO DE ARQUITECTURA: RECETAS V2

OBJETIVO
Actualizar el documento de diseño de Recetas V2 incorporando las 3 correcciones críticas de base de datos, consultas relacionales y consistencia de UI antes de pasar a la fase de implementación.

REGLAS TÉCNICAS
1. Tarea estrictamente DOCUMENTAL.
2. NO modificar código fuente (.js, .jsx) de la aplicación.
3. NO ejecutar migraciones ni alterar PostgreSQL todavía.

AJUSTES OBLIGATORIOS A INCORPORAR EN EL DISEÑO

1. Corrección del índice en Prisma (schema.prisma):
   - En el modelo `DetalleReceta`, ELIMINAR la restricción `@@unique([idEtapaReceta, idInsumo, activo])`.
   - Motivo: Evitar fallos de colisión de unicidad (P2002) en PostgreSQL al desactivar (`activo: false`) y reactivar el mismo insumo en una etapa.
   - Reemplazar por índices de rendimiento:
     @@index([idEtapaReceta])
     @@index([idInsumo])
   - La regla de evitar insumos activos duplicados por etapa se delega a la validación en el servicio/repositorio backend.

2. Estructura de consulta relacional anidada:
   - Especificar en el diseño de API/Repositorio que `DetalleReceta` ya no cuelga de `Receta` sino de `EtapaReceta`.
   - La consulta estándar Prisma para cargar la receta completa debe documentarse explícitamente como:
     include: {
       etapas: {
         where: { activo: true },
         orderBy: { orden: 'asc' },
         include: {
           detalles: {
             where: { activo: true },
             include: { insumo: true }
           }
         }
       },
       producto: true
     }

3. Control de consistencia en UI para Variantes:
   - En el diseño de interfaz de usuario, especificar que `grupoVariante` no será texto libre arbitrario.
   - Debe diseñarse como un selector con opciones estándar ("CEREAL", "FRUTA", "JALEA", "OTRO") o un input que fuerce mayúsculas sin espacios para evitar rupturas de agrupación lógica.

FORMATO DE ENTREGA
Actualizar y entregar el documento de diseño completo reflejando estos 3 puntos integrados en las secciones 3 (Esquema de Base de Datos), 8 (Diseño de API) y 9 (Diseño de Interfaz de Usuario).