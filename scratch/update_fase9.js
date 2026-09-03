const fs = require('fs');
const file = 'C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/apps/api/prisma/schema.prisma';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '  idLote                String?             @map("ID_Lote")\n',
  ''
);

content = content.replace(
  '  detalles              DetalleProduccion[]\n',
  '  detalles              DetalleProduccion[]\n  lotes                 Lote[]\n'
);

content = content.replace(
  '  producciones   Produccion[]\n',
  '  producciones   Produccion[]\n  lotes          Lote[]\n'
);

content = content.replace(
  '  detallesProduccion DetalleProduccion[]\n',
  '  detallesProduccion DetalleProduccion[]\n  lotes              Lote[]\n'
);

const newModel = `

model Lote {
  id                  String       @id @default(uuid()) @map("ID_Lote")
  tipoLote            String       @map("Tipo_Lote")
  idProduccion        String       @map("ID_Produccion")
  produccion          Produccion   @relation(fields: [idProduccion], references: [id])
  idProducto          String?      @map("ID_Producto")
  producto            Producto?    @relation(fields: [idProducto], references: [id])
  idInsumo            String?      @map("ID_Insumo")
  insumo              Insumo?      @relation(fields: [idInsumo], references: [id])
  fechaProduccion     DateTime     @map("Fecha_Produccion")
  fechaVencimiento    DateTime?    @map("Fecha_Vencimiento")
  cantidadInicial     Decimal      @map("Cantidad_Inicial")
  cantidadDisponible  Decimal      @map("Cantidad_Disponible")
  unidad              String       @map("Unidad")
  estado              String       @map("Estado")
  observaciones       String?      @map("Observaciones")

  @@map("Lotes")
}
`;

fs.writeFileSync(file, content + newModel);
