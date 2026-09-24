-- AlterTable
ALTER TABLE "Inventario_Productos" ADD COLUMN "Stock_Minimo" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Productos" ADD COLUMN "Codigo_Producto" TEXT,
ADD COLUMN "Costo_Estimado" DECIMAL(12,2),
ADD COLUMN "Unidad_Venta" TEXT NOT NULL DEFAULT 'UND';

-- CreateIndex
CREATE UNIQUE INDEX "Productos_Codigo_Producto_key" ON "Productos"("Codigo_Producto");
