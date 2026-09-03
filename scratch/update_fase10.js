const fs = require('fs');
const file = 'C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/apps/api/prisma/schema.prisma';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '  observaciones String? @map("Observaciones")\n\n  @@map("Clientes")',
  '  observaciones String? @map("Observaciones")\n  ventas        Venta[]\n\n  @@map("Clientes")'
);

content = content.replace(
  '  lotes          Lote[]\n\n  @@unique',
  '  lotes          Lote[]\n  detallesVenta  DetalleVenta[]\n\n  @@unique'
);

content = content.replace(
  '  observaciones       String?      @map("Observaciones")\n\n  @@map("Lotes")',
  '  observaciones       String?      @map("Observaciones")\n  detallesVenta       DetalleVenta[]\n\n  @@map("Lotes")'
);

const newModels = `

model Venta {
  id                String         @id @default(uuid()) @map("ID_Venta")
  fechaVenta        DateTime       @map("Fecha_Venta")
  idCliente         String         @map("ID_Cliente")
  cliente           Cliente        @relation(fields: [idCliente], references: [id])
  canalVenta        String         @map("Canal_Venta")
  tipoPago          String         @map("Tipo_Pago")
  fechaLimitePago   DateTime?      @map("Fecha_Limite_Pago")
  totalVenta        Decimal        @map("Total_Venta") @db.Decimal(12, 2)
  valorPagado       Decimal        @map("Valor_Pagado") @db.Decimal(12, 2)
  saldoPendiente    Decimal        @map("Saldo_Pendiente") @db.Decimal(12, 2)
  estado            String         @map("Estado")
  observaciones     String?        @map("Observaciones")
  detalles          DetalleVenta[]

  @@map("Ventas")
}

model DetalleVenta {
  id                String   @id @default(uuid()) @map("ID_Detalle_Venta")
  idVenta           String   @map("ID_Venta")
  venta             Venta    @relation(fields: [idVenta], references: [id])
  idProducto        String   @map("ID_Producto")
  producto          Producto @relation(fields: [idProducto], references: [id])
  idLote            String?  @map("ID_Lote")
  lote              Lote?    @relation(fields: [idLote], references: [id])
  cantidad          Decimal  @map("Cantidad")
  precioUnitario    Decimal  @map("Precio_Unitario") @db.Decimal(12, 2)
  descuento         Decimal  @map("Descuento") @db.Decimal(12, 2)
  totalLinea        Decimal  @map("Total_Linea") @db.Decimal(12, 2)
  costoUnitario     Decimal  @map("Costo_Unitario") @db.Decimal(12, 2)
  utilidadUnitaria  Decimal  @map("Utilidad_Unitaria") @db.Decimal(12, 2)
  utilidadTotal     Decimal  @map("Utilidad_Total") @db.Decimal(12, 2)

  @@map("Detalle_Ventas")
}
`;

fs.writeFileSync(file, content + newModels);
