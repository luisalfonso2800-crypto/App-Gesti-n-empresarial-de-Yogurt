const fs = require('fs');
const file = 'C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/apps/api/prisma/schema.prisma';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '  movimientos    MovimientoInventario[]',
  '  movimientos    MovimientoInventario[]\n  detallesReceta DetalleReceta[]\n  detallesProduccion DetalleProduccion[]'
);

content = content.replace(
  '  observaciones  String?      @map("Observaciones")',
  '  observaciones  String?      @map("Observaciones")\n  recetas        Receta[]\n  producciones   Produccion[]'
);

const newModels = `

model Receta {
  id                String          @id @default(uuid()) @map("ID_Receta")
  idProducto        String          @map("ID_Producto")
  producto          Producto        @relation(fields: [idProducto], references: [id])
  nombre            String          @map("Nombre_Receta")
  rendimientoBase   Decimal         @map("Rendimiento_Base")
  unidadRendimiento String          @map("Unidad_Rendimiento")
  activo            Boolean         @default(true) @map("Activo")
  observaciones     String?         @map("Observaciones")
  detalles          DetalleReceta[]

  @@map("Recetas")
}

model DetalleReceta {
  id                String  @id @default(uuid()) @map("ID_Detalle_Receta")
  idReceta          String  @map("ID_Receta")
  receta            Receta  @relation(fields: [idReceta], references: [id])
  idInsumo          String  @map("ID_Insumo")
  insumo            Insumo  @relation(fields: [idInsumo], references: [id])
  cantidadRequerida Decimal @map("Cantidad_Requerida")
  unidad            String  @map("Unidad")
  mermaPorcentaje   Decimal @map("Merma_Porcentaje")
  activo            Boolean @default(true) @map("Activo")
  observaciones     String? @map("Observaciones")

  @@unique([idReceta, idInsumo])
  @@map("Detalle_Recetas")
}

model Produccion {
  id                    String              @id @default(uuid()) @map("ID_Produccion")
  fechaPlanificada      DateTime?           @map("Fecha_Planificada")
  fechaProduccion       DateTime            @map("Fecha_Produccion")
  idProducto            String              @map("ID_Producto")
  producto              Producto            @relation(fields: [idProducto], references: [id])
  cantidadPlanificada   Decimal             @map("Cantidad_Planificada")
  cantidadProducidaReal Decimal?            @map("Cantidad_Producida_Real")
  estado                String              @map("Estado")
  fechaVencimiento      DateTime?           @map("Fecha_Vencimiento")
  idLote                String?             @map("ID_Lote")
  observaciones         String?             @map("Observaciones")
  detalles              DetalleProduccion[]

  @@map("Producciones")
}

model DetalleProduccion {
  id                    String     @id @default(uuid()) @map("ID_Detalle_Produccion")
  idProduccion          String     @map("ID_Produccion")
  produccion            Produccion @relation(fields: [idProduccion], references: [id])
  idInsumo              String     @map("ID_Insumo")
  insumo                Insumo     @relation(fields: [idInsumo], references: [id])
  cantidadTeorica       Decimal    @map("Cantidad_Teorica")
  cantidadRealUtilizada Decimal?   @map("Cantidad_Real_Utilizada")
  diferencia            Decimal?   @map("Diferencia")
  unidad                String     @map("Unidad")
  costoTeorico          Decimal?   @map("Costo_Teorico") @db.Decimal(12, 2)
  costoReal             Decimal?   @map("Costo_Real") @db.Decimal(12, 2)
  observaciones         String?    @map("Observaciones")

  @@map("Detalle_Producciones")
}
`;

fs.writeFileSync(file, content + newModels);
