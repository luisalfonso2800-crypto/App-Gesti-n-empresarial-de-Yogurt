# DISEÑO DE ARQUITECTURA Y MODELO DE NEGOCIO: RECETAS V2 (CON TOLERANCIA OPERATIVA Y VARIANTES)

## 1. OBJETIVO Y VISIÓN FUNCIONAL
El objetivo del rediseño es transformar la receta de una cabecera plana a una fórmula técnica de manufactura completa. Esto permitirá separar el proceso de producción en etapas lógicas, gestionar tolerancias (tiempos y temperaturas), vincular directamente con insumos (BOM real) y calcular los costos teóricos. De igual manera, se habilitará la inclusión de componentes opcionales (frutas, cereales) sin tener que duplicar innecesariamente las recetas base, soportando lógicas de exclusión mutua.

## 2. MODELO CONCEPTUAL (Cabecera, BOM, Procesos, Variantes)
- **Cabecera (Receta):** Representa el modelo maestro asociado a un Producto específico, definiendo el rendimiento esperado y el nombre de la fórmula.
- **Procesos (EtapaReceta):** Fases secuenciales (ej. Formulación/Base Blanca, Fermentación, Saborización, Empaque). Cada fase contendrá tiempos estimados (mínimo, estándar, máximo), temperaturas y parámetros de ejecución.
- **BOM (DetalleReceta):** Se reubica; en lugar de depender directamente de la Receta, ahora dependerá de una EtapaReceta. Esto garantiza saber en qué momento exacto se consume el insumo.
- **Variantes/Opcionales:** Categorización de insumos (BASE, COMPLEMENTO, EMPAQUE_BASE, EMPAQUE_COMPLEMENTO) permitiendo variantes mutuamente excluyentes (ej. Cereal Choco vs. Zucaritas) a través de un grupo de variantes.

## 3. ESQUEMA DE BASE DE DATOS PROPUESTO
Se introducirá el modelo `EtapaReceta` y se ajustará `DetalleReceta` en el archivo `schema.prisma`:

```prisma
model Receta {
  id                String         @id @default(uuid()) @map("ID_Receta")
  idProducto        String         @map("ID_Producto")
  producto          Producto       @relation(fields: [idProducto], references: [id])
  nombre            String         @map("Nombre_Receta")
  rendimientoBase   Decimal        @map("Rendimiento_Base")
  unidadRendimiento String         @map("Unidad_Rendimiento")
  activo            Boolean        @default(true) @map("Activo")
  observaciones     String?        @map("Observaciones")
  etapas            EtapaReceta[]

  @@map("Recetas")
}

model EtapaReceta {
  id                String          @id @default(uuid()) @map("ID_Etapa_Receta")
  idReceta          String          @map("ID_Receta")
  receta            Receta          @relation(fields: [idReceta], references: [id])
  nombre            String          @map("Nombre_Etapa") 
  orden             Int             @map("Orden")
  tiempoMinimoMin   Int?            @map("Tiempo_Minimo_Min")
  tiempoEstandarMin Int?            @map("Tiempo_Estandar_Min")
  tiempoMaximoMin   Int?            @map("Tiempo_Maximo_Min")
  tempMinimaGrados  Decimal?        @map("Temp_Minima_Grados")
  tempMaximaGrados  Decimal?        @map("Temp_Maxima_Grados")
  instrucciones     String?         @map("Instrucciones")
  detalles          DetalleReceta[]
  activo            Boolean         @default(true) @map("Activo")

  @@map("Etapas_Receta")
}

model DetalleReceta {
  id                String       @id @default(uuid()) @map("ID_Detalle_Receta")
  idEtapaReceta     String       @map("ID_Etapa_Receta")
  etapa             EtapaReceta  @relation(fields: [idEtapaReceta], references: [id])
  idInsumo          String       @map("ID_Insumo")
  insumo            Insumo       @relation(fields: [idInsumo], references: [id])
  cantidadRequerida Decimal      @map("Cantidad_Requerida")
  unidad            String       @map("Unidad")
  mermaPorcentaje   Decimal      @map("Merma_Porcentaje")
  esOpcional        Boolean      @default(false) @map("Es_Opcional")
  grupoVariante     String?      @map("Grupo_Variante") // Ej: "CEREAL", "FRUTA" para exclusión mutua
  tipoInsumo        String       @default("BASE") @map("Tipo_Insumo") // BASE, COMPLEMENTO, EMPAQUE_BASE, EMPAQUE_COMPLEMENTO
  activo            Boolean      @default(true) @map("Activo")
  observaciones     String?      @map("Observaciones")

  @@index([idEtapaReceta])
  @@index([idInsumo])
  // Nota: La regla de evitar insumos activos duplicados por etapa se delega a la validación en el servicio/repositorio backend.
  @@map("Detalle_Recetas")
}
```

## 4. ESTRATEGIA DE VARIANTES / COMPONENTES OPCIONALES
- Además del campo `esOpcional`, se integra `grupoVariante` (ej: "CEREAL", "FRUTA", "JALEA") para permitir selectores mutuamente excluyentes en producción.
- Los insumos se categorizan lógicamente mediante `tipoInsumo`:
  * `BASE`: Obligatorios de la fórmula.
  * `COMPLEMENTO`: Opcionales excluyentes o multiselección según su grupo (sabor, aditivo especial).
  * `EMPAQUE_BASE`: Empaque por defecto.
  * `EMPAQUE_COMPLEMENTO`: Empaque derivado del uso de una variante (ej. cuchara especial o cúpula al seleccionar "CEREAL").

## 5. ESCALAMIENTO DE RENDIMIENTO Y CONVERSIÓN DE UNIDADES
El rendimiento se escala de forma lineal mediante la siguiente fórmula:
* `FactorMultiplicador = Cantidad a Producir / Rendimiento Base de la Receta`
* `Cantidad Neta Proyectada = CantidadRequerida * FactorMultiplicador`

**Regla Estricta de Redondeo para Empaques Físicos:**
Si la `unidad` del insumo es "Unidades" (ej. tapas, frascos, vasos), el valor de `Cantidad Neta Proyectada` debe ser redondeado siempre hacia arriba (`Math.ceil()`), ya que no es viable despachar o consumir fracciones de empaques físicos en la línea de envasado.

## 6. FLUJO DE COSTOS Y PROYECCIÓN TEÓRICA
- **Costo Insumo:** Se obtendrá consultando el último `PrecioProveedor` activo y asignado a dicho Insumo.
- **Costo Teórico de la Receta:** Es la sumatoria de `(Cantidad Neta Proyectada * CostoUnidadBase)`.
- Se expondrá a través de un nuevo endpoint analítico `GET /recipes/:id/cost-projection` capaz de resolver el cálculo en tiempo real.

## 7. ARTICULACIÓN CON PRODUCCIÓN E INVENTARIO Y MANEJO DE MERMAS
- **Merma Teórica vs Inventario:** Es crucial separar el "Consumo Neto Teórico" del "Requerimiento con Merma".
  * La **merma teórica** (`mermaPorcentaje`) de la receta sirve para proyecciones de compras, cotizaciones de costos, o requerimiento sugerido de retiro de bodega (ej. para preparar 100L de leche se solicitan 102L por la merma del 2%).
  * El **inventario NO se descuenta** ciegamente usando la merma teórica. El descuento de inventario ocurrirá en el cierre de Producción basándose en el **consumo real reportado** por el operario, contrastado contra el neto proyectado.
- **Producción (Snapshots):** Al ejecutar la orden, Producción creará una copia o *snapshot* de la receta en ese momento (y resolverá los `grupoVariante` elegidos), de modo que cambios futuros a la receta maestra no alteren la historia de los lotes ya procesados.

## 8. DISEÑO DE API Y ENDPOINTS (Transacciones Prisma en backend)
Se rediseñará el `RecipesRepository` operando transaccionalmente, y evitando borrados en cascada que pueden causar corrupción histórica.
- **POST /recipes:** Aceptará un JSON profundo (`Receta` -> `etapas` -> `detalles`).
- **GET /recipes/:id/bom:** Resolverá y devolverá la receta consolidada (con cálculo de etapa, grupos de variante). La consulta relacional anidada obligatoria en Prisma debe ser estructurada de la siguiente manera:
  ```javascript
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
  ```
- **PATCH /recipes/:id:** Actualización basada en *Sincronización Transaccional*. No se utilizará DELETE CASCADE para no romper la integridad de órdenes históricas (si alguna FK existiera en el futuro) ni perder historial. En su lugar:
  1. Se actualizan (Upsert) los registros que se mantienen por su ID.
  2. Se crean los nuevos.
  3. Se efectúa desactivación lógica (`activo: false`) para las Etapas o Detalles que fueron retirados del payload enviado.

## 9. DISEÑO DE INTERFAZ DE USUARIO (UX/UI)
- **Cabecera (Page):** `/recipes/new` o `/recipes/[id]/edit`. Implementará selectores asíncronos (`<Select>`) para Productos.
- **Fases/Etapas:** Lista interactiva visual (tipo acordeón). Cada tarjeta representará una fase de producción con controles para Tiempos y Temperaturas.
- **BOM en Etapas:** Sub-tabla con selector de `Insumo`, cantidad, tipo de insumo, y campo dinámico para `grupoVariante` si se marca como opcional. **Control de consistencia:** `grupoVariante` no será texto libre arbitrario; deberá diseñarse como un selector con opciones estándar (ej. "CEREAL", "FRUTA", "JALEA", "OTRO") o un input que fuerce mayúsculas sin espacios para evitar rupturas lógicas en la agrupación.
- **Resumen Analítico:** Previsualización del "Costo Estimado" y requerimientos teóricos.

## 10. IMPACTO Y COMPATIBILIDAD CON V1
- Modificar el esquema Prisma requerirá un PR único para ajustar base de datos y backend al unísono.
- **Estrategia de Migración:** Se proveerá un script de migración que, para cada Receta existente, creará una etapa "Etapa Única (Migración)" asignándole los `DetalleReceta` actuales, preservando su funcionalidad y datos.

## 11. PLAN DE IMPLEMENTACIÓN EN SUB-FASES
- **Fase A (Modelado):** Modificar `schema.prisma`. Generar migración SQL y actualizar `seed-test-data.js`.
- **Fase B (API Core):** Actualizar `RecipesController` y `RecipesRepository` (upsert y desactivación lógica).
- **Fase C (Frontend UI):** Desarrollo del formulario de 3 niveles en `/catalog/recipes`.
- **Fase D (Producción):** Conectar el módulo de producción para consumir las recetas por etapas e implementar el snapshotting de orden.

## 12. RESOLUCIÓN DE DECISIONES DE ARQUITECTURA
De acuerdo a las directrices de negocio revisadas, se establece la siguiente configuración definitiva de arquitectura:

1. **Modal vs. Pantalla Completa:** **Aprobado**. Se utilizará una pantalla completa dedicada (rutas `/catalog/recipes/new` y `/catalog/recipes/[id]`) por ser la UX óptima.
2. **Estrategia destructiva en PATCH:** **Rechazada**. Se implementará sincronización y desactivación lógica (`activo: false`) en el repositorio backend, evitando problemas de integridad histórica.
3. **Variantes:** **Aprobada la versión ligera**, potenciada con el uso de los campos `grupoVariante` (String) y `tipoInsumo` (Enum/String: BASE, COMPLEMENTO, EMPAQUE_BASE, EMPAQUE_COMPLEMENTO) para resolver exclusiones mutuas y dependencias de empaque.
