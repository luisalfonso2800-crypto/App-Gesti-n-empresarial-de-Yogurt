const fs = require('fs');
const file = 'C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/apps/api/prisma/schema.prisma';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '  ventas        Venta[]\n\n  @@map("Clientes")',
  '  ventas        Venta[]\n  pagos         Pago[]\n\n  @@map("Clientes")'
);

content = content.replace(
  '  detalles          DetalleVenta[]\n\n  @@map("Ventas")',
  '  detalles          DetalleVenta[]\n  pagos             Pago[]\n\n  @@map("Ventas")'
);

const newModels = `

model Pago {
  id            String    @id @default(uuid()) @map("ID_Pago")
  fechaPago     DateTime  @map("Fecha_Pago")
  idCliente     String    @map("ID_Cliente")
  cliente       Cliente   @relation(fields: [idCliente], references: [id])
  idVenta       String    @map("ID_Venta")
  venta         Venta     @relation(fields: [idVenta], references: [id])
  valorPagado   Decimal   @map("Valor_Pagado") @db.Decimal(12, 2)
  metodoPago    String    @map("Metodo_Pago")
  referencia    String?   @map("Referencia")
  observaciones String?   @map("Observaciones")

  @@map("Pagos")
}

model Gasto {
  id            String    @id @default(uuid()) @map("ID_Gasto")
  fecha         DateTime  @map("Fecha")
  categoria     String    @map("Categoria")
  descripcion   String    @map("Descripcion")
  valor         Decimal   @map("Valor") @db.Decimal(12, 2)
  tipoGasto     String    @map("Tipo_Gasto")
  periodo       String    @map("Periodo")
  observaciones String?   @map("Observaciones")

  @@map("Gastos")
}
`;

fs.writeFileSync(file, content + newModels);
