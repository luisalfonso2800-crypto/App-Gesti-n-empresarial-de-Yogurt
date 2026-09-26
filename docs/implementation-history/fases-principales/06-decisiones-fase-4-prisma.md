# FASE 4: DECISIONES RATIFICADAS Y CONTRATO DE DATOS (ENTIDADES MAESTRAS)

## DECISIONES BASE RATIFICADAS
1. **Nomenclatura**: Modelos en PascalCase, atributos Prisma en camelCase, tablas y columnas físicas mapeadas con `@@map` y `@map` a la nomenclatura documental existente.
2. **Identificadores**: `String @id @default(uuid())` para los 5 maestros. Sin autoincrementales.
3. **Activo**: `Boolean @default(true)` para baja lógica.
4. **Observaciones**: `String?` (opcional).
5. **Textos opcionales**: Mapear a `String?` según documentación sin forzar NOT NULL indiscriminado.
6. **Cantidades**: `Decimal` para Cantidad_Oz, Cantidad_ml y Stock_Minimo. Prohibido Float.
7. **Precio Venta**: `Decimal(12,2)` para valores monetarios. Prohibido Float.
8. **Margen Objetivo**: `Decimal(5,2)` representando porcentaje 0 a 100 (ej. 30.00 = 30%).
9. **Días Crédito**: `Int` (entero no negativo).
10. **Tapilla**: Atributo opcional consolidado dentro de Presentaciones. Prohibido crear entidad independiente.
11. **Restricción Producto-Presentación**: Restricción única compuesta (Nombre_Producto + ID_Presentacion). No implementar relación todavía.
12. **NIT/Cédula Proveedor**: NO marcar como unique en esta fase.

---

## CONTRATO DE DATOS

### 1. Presentaciones (@@map("Presentaciones"))
| Atributo Prisma | Tipo Prisma | Obligatorio | Default | Mapeo BD (@map) | Restricción |
|---|---|---|---|---|---|
| id | String | Sí | uuid() | ID_Presentacion | @id |
| nombre | String | Sí | - | Nombre_Presentacion | No vacío |
| cantidadOz | Decimal | Sí | - | Cantidad_Oz | > 0 |
| cantidadMl | Decimal | Sí | - | Cantidad_ml | > 0 |
| tipoEnvase | String | Sí | - | Tipo_Envase | No vacío |
| tapilla | String? | No | - | Tapilla | - |
| activo | Boolean | Sí | true | Activo | - |
| observaciones | String? | No | - | Observaciones | - |

### 2. Insumos (@@map("Insumos"))
| Atributo Prisma | Tipo Prisma | Obligatorio | Default | Mapeo BD (@map) | Restricción |
|---|---|---|---|---|---|
| id | String | Sí | uuid() | ID_Insumo | @id |
| nombre | String | Sí | - | Nombre_Insumo | No vacío |
| categoria | String | Sí | - | Categoria | No vacío |
| subcategoria | String | Sí | - | Subcategoria | No vacío |
| marca | String | Sí | - | Marca | No vacío |
| unidadBase | String | Sí | - | Unidad_Base | No vacío |
| stockMinimo | Decimal | Sí | - | Stock_Minimo | >= 0 |
| activo | Boolean | Sí | true | Activo | - |
| observaciones | String? | No | - | Observaciones | - |

### 3. Proveedores (@@map("Proveedores"))
| Atributo Prisma | Tipo Prisma | Obligatorio | Default | Mapeo BD (@map) | Restricción |
|---|---|---|---|---|---|
| id | String | Sí | uuid() | ID_Proveedor | @id |
| nombre | String | Sí | - | Nombre_Proveedor | No vacío |
| nitCedula | String | Sí | - | NIT_Cedula | No unique |
| nombreContacto | String? | No | - | Nombre_Contacto | - |
| telefono | String? | No | - | Telefono | - |
| email | String? | No | - | Email | - |
| direccion | String? | No | - | Direccion | - |
| activo | Boolean | Sí | true | Activo | - |
| observaciones | String? | No | - | Observaciones | - |

### 4. Productos (@@map("Productos"))
| Atributo Prisma | Tipo Prisma | Obligatorio | Default | Mapeo BD (@map) | Restricción |
|---|---|---|---|---|---|
| id | String | Sí | uuid() | ID_Producto | @id |
| nombre | String | Sí | - | Nombre_Producto | @@unique([nombre, idPresentacion]) |
| idPresentacion | String | Sí | - | ID_Presentacion | @@unique([nombre, idPresentacion]) |
| categoria | String | Sí | - | Categoria_Producto | No vacío |
| descripcion | String? | No | - | Descripcion | - |
| canalVenta | String | Sí | - | Canal_Venta | No vacío |
| precioVenta | Decimal | Sí | - | Precio_Venta | (12,2) > 0 |
| margenObjetivo | Decimal | Sí | - | Margen_Objetivo | (5,2) 0 a 100 |
| activo | Boolean | Sí | true | Activo | - |
| observaciones | String? | No | - | Observaciones | - |

### 5. Clientes (@@map("Clientes"))
| Atributo Prisma | Tipo Prisma | Obligatorio | Default | Mapeo BD (@map) | Restricción |
|---|---|---|---|---|---|
| id | String | Sí | uuid() | ID_Cliente | @id |
| nombre | String | Sí | - | Nombre_Cliente | No vacío |
| tipoCliente | String | Sí | - | Tipo_Cliente | No vacío |
| canal | String | Sí | - | Canal | No vacío |
| contacto | String? | No | - | Contacto | - |
| telefono | String? | No | - | Telefono | - |
| direccion | String? | No | - | Direccion | - |
| diasCredito | Int | Sí | - | Dias_Credito | >= 0 |
| activo | Boolean | Sí | true | Activo | - |
| observaciones | String? | No | - | Observaciones | - |

## DEPENDENCIAS DIFERIDAS A FASE 5
- Implementación de las relaciones físicas (`@relation`) entre entidades maestras y dependientes, tales como la relación entre Productos y Presentaciones, debido a la restricción explícita de la Fase 4 de construir modelos completamente aislados.
