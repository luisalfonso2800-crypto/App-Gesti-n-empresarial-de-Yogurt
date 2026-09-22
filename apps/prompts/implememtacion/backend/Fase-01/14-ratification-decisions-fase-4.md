TAREA CONTROLADA — RATIFICACIÓN DE DECISIONES FASE 4 DE PRISMA (CONSUMO ULTRA BAJO)

OBJETIVO ÚNICO
Generar formalmente el documento de especificación técnica y contrato de datos para la Fase 4 en `docs/implementation/06-decisiones-fase-4-prisma.md` a partir de las 12 decisiones base ya definidas por el usuario, sin modificar código, sin tocar esquemas y sin gastar cuota en lecturas masivas.

REGLAS ESTRICTAS DE CONSUMO CERO TOKENS
- PROHIBIDO modificar, crear o tocar archivos en apps/api/ (schema.prisma, src/, package.json intactos).
- PROHIBIDO implementar código, modelos Prisma, migraciones o relaciones (@relation de Fase 5).
- PROHIBIDO usar herramientas de búsqueda recursiva en el codebase o leer carpetas enteras de documentación.
- Consulta EXCLUSIVAMENTE si requieres verificar una contradicción puntual:
  1. docs/data-model/01-entities.md
  2. docs/data-model/05-data-model-decisions.md

DECISIONES BASE RATIFICADAS (A CONSOLIDAR EN EL DOCUMENTO):
1. Nomenclatura: Modelos en PascalCase, atributos Prisma en camelCase, tablas y columnas físicas mapeadas con @@map y @map a la nomenclatura documental existente.
2. Identificadores: String @id @default(uuid()) para los 5 maestros. Sin autoincrementales.
3. Activo: Boolean @default(true) para baja lógica.
4. Observaciones: String? (opcional).
5. Textos opcionales: Mapear a String? según documentación sin forzar NOT NULL indiscriminado.
6. Cantidades: Decimal para Cantidad_Oz, Cantidad_ml y Stock_Minimo. Prohibido Float.
7. Precio Venta: Decimal(12,2) para valores monetarios. Prohibido Float.
8. Margen Objetivo: Decimal(5,2) representando porcentaje 0 a 100 (ej. 30.00 = 30%).
9. Días Crédito: Int (entero no negativo).
10. Tapilla: Atributo opcional consolidado dentro de Presentaciones. Prohibido crear entidad independiente.
11. Restricción Producto-Presentación: Restricción única compuesta (Nombre_Producto + ID_Presentacion). No implementar relación todavía.
12. NIT/Cédula Proveedor: NO marcar como unique en esta fase.

ENTIDADES A DETALLAR EN EL CONTRATO:
- Presentaciones: id, nombre, cantidadOz, cantidadMl, tipoEnvase, tapilla, activo, observaciones.
- Insumos: id, nombre, categoria, subcategoria, marca, unidadBase, stockMinimo, activo, observaciones.
- Proveedores: id, nombre, nitCedula, nombreContacto, telefono, email, direccion, activo, observaciones.
- Productos: id, nombre, idPresentacion, categoria, descripcion, canalVenta, precioVenta, margenObjetivo, activo, observaciones.
- Clientes: id, nombre, tipoCliente, canal, contacto, telefono, direccion, diasCredito, activo, observaciones.

PROCEDIMIENTO DE SALIDA
Crea o sobrescribe directamente: `docs/implementation/06-decisiones-fase-4-prisma.md` con las 12 decisiones, la estructura tabular completa de los 5 maestros y las dependencias diferidas a Fase 5.

FORMATO DEL REPORTE FINAL
Emite únicamente este bloque de texto y DETENTE:

FASE 4 — DECISIONES RATIFICADAS
- Estado: [COMPLETADA / BLOQUEADA]
- Documento generado/modificado: docs/implementation/06-decisiones-fase-4-prisma.md
- Entidades definidas: Presentaciones, Insumos, Proveedores, Productos, Clientes
- schema.prisma modificado: NO
- Código modificado: NO
- Migraciones ejecutadas: NO
- Relaciones Fase 5 implementadas: NO
- Decisiones pendientes: [NINGUNA / detalle breve]
- Bloqueos: [NINGUNO / detalle breve]

DETENTE inmediatamente tras el reporte.