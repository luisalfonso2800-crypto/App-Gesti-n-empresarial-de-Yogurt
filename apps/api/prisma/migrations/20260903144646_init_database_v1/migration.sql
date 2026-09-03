-- CreateTable
CREATE TABLE "Presentaciones" (
    "ID_Presentacion" TEXT NOT NULL,
    "Nombre_Presentacion" TEXT NOT NULL,
    "Cantidad_Oz" DECIMAL(65,30) NOT NULL,
    "Cantidad_ml" DECIMAL(65,30) NOT NULL,
    "Tipo_Envase" TEXT NOT NULL,
    "Tapilla" TEXT,
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "Observaciones" TEXT,

    CONSTRAINT "Presentaciones_pkey" PRIMARY KEY ("ID_Presentacion")
);

-- CreateTable
CREATE TABLE "Insumos" (
    "ID_Insumo" TEXT NOT NULL,
    "Nombre_Insumo" TEXT NOT NULL,
    "Categoria" TEXT NOT NULL,
    "Subcategoria" TEXT NOT NULL,
    "Marca" TEXT NOT NULL,
    "Unidad_Base" TEXT NOT NULL,
    "Stock_Minimo" DECIMAL(65,30) NOT NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "Observaciones" TEXT,

    CONSTRAINT "Insumos_pkey" PRIMARY KEY ("ID_Insumo")
);

-- CreateTable
CREATE TABLE "Proveedores" (
    "ID_Proveedor" TEXT NOT NULL,
    "Nombre_Proveedor" TEXT NOT NULL,
    "NIT_Cedula" TEXT NOT NULL,
    "Nombre_Contacto" TEXT,
    "Telefono" TEXT,
    "Email" TEXT,
    "Direccion" TEXT,
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "Observaciones" TEXT,

    CONSTRAINT "Proveedores_pkey" PRIMARY KEY ("ID_Proveedor")
);

-- CreateTable
CREATE TABLE "Productos" (
    "ID_Producto" TEXT NOT NULL,
    "Nombre_Producto" TEXT NOT NULL,
    "ID_Presentacion" TEXT NOT NULL,
    "Categoria_Producto" TEXT NOT NULL,
    "Descripcion" TEXT,
    "Canal_Venta" TEXT NOT NULL,
    "Precio_Venta" DECIMAL(12,2) NOT NULL,
    "Margen_Objetivo" DECIMAL(5,2) NOT NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "Observaciones" TEXT,

    CONSTRAINT "Productos_pkey" PRIMARY KEY ("ID_Producto")
);

-- CreateTable
CREATE TABLE "Clientes" (
    "ID_Cliente" TEXT NOT NULL,
    "Nombre_Cliente" TEXT NOT NULL,
    "Tipo_Cliente" TEXT NOT NULL,
    "Canal" TEXT NOT NULL,
    "Contacto" TEXT,
    "Telefono" TEXT,
    "Direccion" TEXT,
    "Dias_Credito" INTEGER NOT NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "Observaciones" TEXT,

    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("ID_Cliente")
);

-- CreateTable
CREATE TABLE "Compras" (
    "ID_Compra" TEXT NOT NULL,
    "ID_Proveedor" TEXT NOT NULL,
    "Fecha_Compra" TIMESTAMP(3) NOT NULL,
    "Estado" TEXT NOT NULL,
    "Total" DECIMAL(12,2) NOT NULL,
    "Observaciones" TEXT,

    CONSTRAINT "Compras_pkey" PRIMARY KEY ("ID_Compra")
);

-- CreateTable
CREATE TABLE "Detalle_Compras" (
    "ID_Detalle_Compra" TEXT NOT NULL,
    "ID_Compra" TEXT NOT NULL,
    "ID_Insumo" TEXT NOT NULL,
    "Cantidad" DECIMAL(65,30) NOT NULL,
    "Precio_Unitario" DECIMAL(12,2) NOT NULL,
    "Subtotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "Detalle_Compras_pkey" PRIMARY KEY ("ID_Detalle_Compra")
);

-- CreateTable
CREATE TABLE "Inventario" (
    "ID_Inventario" TEXT NOT NULL,
    "ID_Insumo" TEXT NOT NULL,
    "Cantidad_Actual" DECIMAL(65,30) NOT NULL,
    "Fecha_Actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventario_pkey" PRIMARY KEY ("ID_Inventario")
);

-- CreateTable
CREATE TABLE "Movimientos_Inventario" (
    "ID_Movimiento" TEXT NOT NULL,
    "ID_Insumo" TEXT NOT NULL,
    "Tipo_Movimiento" TEXT NOT NULL,
    "Cantidad" DECIMAL(65,30) NOT NULL,
    "Fecha_Movimiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Motivo" TEXT NOT NULL,
    "Operacion_Origen" TEXT,

    CONSTRAINT "Movimientos_Inventario_pkey" PRIMARY KEY ("ID_Movimiento")
);

-- CreateTable
CREATE TABLE "Recetas" (
    "ID_Receta" TEXT NOT NULL,
    "ID_Producto" TEXT NOT NULL,
    "Nombre_Receta" TEXT NOT NULL,
    "Rendimiento_Base" DECIMAL(65,30) NOT NULL,
    "Unidad_Rendimiento" TEXT NOT NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "Observaciones" TEXT,

    CONSTRAINT "Recetas_pkey" PRIMARY KEY ("ID_Receta")
);

-- CreateTable
CREATE TABLE "Detalle_Recetas" (
    "ID_Detalle_Receta" TEXT NOT NULL,
    "ID_Receta" TEXT NOT NULL,
    "ID_Insumo" TEXT NOT NULL,
    "Cantidad_Requerida" DECIMAL(65,30) NOT NULL,
    "Unidad" TEXT NOT NULL,
    "Merma_Porcentaje" DECIMAL(65,30) NOT NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "Observaciones" TEXT,

    CONSTRAINT "Detalle_Recetas_pkey" PRIMARY KEY ("ID_Detalle_Receta")
);

-- CreateTable
CREATE TABLE "Producciones" (
    "ID_Produccion" TEXT NOT NULL,
    "Fecha_Planificada" TIMESTAMP(3),
    "Fecha_Produccion" TIMESTAMP(3) NOT NULL,
    "ID_Producto" TEXT NOT NULL,
    "Cantidad_Planificada" DECIMAL(65,30) NOT NULL,
    "Cantidad_Producida_Real" DECIMAL(65,30),
    "Estado" TEXT NOT NULL,
    "Fecha_Vencimiento" TIMESTAMP(3),
    "ID_Lote" TEXT,
    "Observaciones" TEXT,

    CONSTRAINT "Producciones_pkey" PRIMARY KEY ("ID_Produccion")
);

-- CreateTable
CREATE TABLE "Detalle_Producciones" (
    "ID_Detalle_Produccion" TEXT NOT NULL,
    "ID_Produccion" TEXT NOT NULL,
    "ID_Insumo" TEXT NOT NULL,
    "Cantidad_Teorica" DECIMAL(65,30) NOT NULL,
    "Cantidad_Real_Utilizada" DECIMAL(65,30),
    "Diferencia" DECIMAL(65,30),
    "Unidad" TEXT NOT NULL,
    "Costo_Teorico" DECIMAL(12,2),
    "Costo_Real" DECIMAL(12,2),
    "Observaciones" TEXT,

    CONSTRAINT "Detalle_Producciones_pkey" PRIMARY KEY ("ID_Detalle_Produccion")
);

-- CreateTable
CREATE TABLE "Lotes" (
    "ID_Lote" TEXT NOT NULL,
    "Tipo_Lote" TEXT NOT NULL,
    "ID_Produccion" TEXT NOT NULL,
    "ID_Producto" TEXT,
    "ID_Insumo" TEXT,
    "Fecha_Produccion" TIMESTAMP(3) NOT NULL,
    "Fecha_Vencimiento" TIMESTAMP(3),
    "Cantidad_Inicial" DECIMAL(65,30) NOT NULL,
    "Cantidad_Disponible" DECIMAL(65,30) NOT NULL,
    "Unidad" TEXT NOT NULL,
    "Estado" TEXT NOT NULL,
    "Observaciones" TEXT,

    CONSTRAINT "Lotes_pkey" PRIMARY KEY ("ID_Lote")
);

-- CreateTable
CREATE TABLE "Ventas" (
    "ID_Venta" TEXT NOT NULL,
    "Fecha_Venta" TIMESTAMP(3) NOT NULL,
    "ID_Cliente" TEXT NOT NULL,
    "Canal_Venta" TEXT NOT NULL,
    "Tipo_Pago" TEXT NOT NULL,
    "Fecha_Limite_Pago" TIMESTAMP(3),
    "Total_Venta" DECIMAL(12,2) NOT NULL,
    "Valor_Pagado" DECIMAL(12,2) NOT NULL,
    "Saldo_Pendiente" DECIMAL(12,2) NOT NULL,
    "Estado" TEXT NOT NULL,
    "Observaciones" TEXT,

    CONSTRAINT "Ventas_pkey" PRIMARY KEY ("ID_Venta")
);

-- CreateTable
CREATE TABLE "Detalle_Ventas" (
    "ID_Detalle_Venta" TEXT NOT NULL,
    "ID_Venta" TEXT NOT NULL,
    "ID_Producto" TEXT NOT NULL,
    "ID_Lote" TEXT,
    "Cantidad" DECIMAL(65,30) NOT NULL,
    "Precio_Unitario" DECIMAL(12,2) NOT NULL,
    "Descuento" DECIMAL(12,2) NOT NULL,
    "Total_Linea" DECIMAL(12,2) NOT NULL,
    "Costo_Unitario" DECIMAL(12,2) NOT NULL,
    "Utilidad_Unitaria" DECIMAL(12,2) NOT NULL,
    "Utilidad_Total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "Detalle_Ventas_pkey" PRIMARY KEY ("ID_Detalle_Venta")
);

-- CreateTable
CREATE TABLE "Pagos" (
    "ID_Pago" TEXT NOT NULL,
    "Fecha_Pago" TIMESTAMP(3) NOT NULL,
    "ID_Cliente" TEXT NOT NULL,
    "ID_Venta" TEXT NOT NULL,
    "Valor_Pagado" DECIMAL(12,2) NOT NULL,
    "Metodo_Pago" TEXT NOT NULL,
    "Referencia" TEXT,
    "Observaciones" TEXT,

    CONSTRAINT "Pagos_pkey" PRIMARY KEY ("ID_Pago")
);

-- CreateTable
CREATE TABLE "Gastos" (
    "ID_Gasto" TEXT NOT NULL,
    "Fecha" TIMESTAMP(3) NOT NULL,
    "Categoria" TEXT NOT NULL,
    "Descripcion" TEXT NOT NULL,
    "Valor" DECIMAL(12,2) NOT NULL,
    "Tipo_Gasto" TEXT NOT NULL,
    "Periodo" TEXT NOT NULL,
    "Observaciones" TEXT,

    CONSTRAINT "Gastos_pkey" PRIMARY KEY ("ID_Gasto")
);

-- CreateIndex
CREATE UNIQUE INDEX "Productos_Nombre_Producto_ID_Presentacion_key" ON "Productos"("Nombre_Producto", "ID_Presentacion");

-- CreateIndex
CREATE UNIQUE INDEX "Inventario_ID_Insumo_key" ON "Inventario"("ID_Insumo");

-- CreateIndex
CREATE UNIQUE INDEX "Detalle_Recetas_ID_Receta_ID_Insumo_key" ON "Detalle_Recetas"("ID_Receta", "ID_Insumo");

-- AddForeignKey
ALTER TABLE "Productos" ADD CONSTRAINT "Productos_ID_Presentacion_fkey" FOREIGN KEY ("ID_Presentacion") REFERENCES "Presentaciones"("ID_Presentacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compras" ADD CONSTRAINT "Compras_ID_Proveedor_fkey" FOREIGN KEY ("ID_Proveedor") REFERENCES "Proveedores"("ID_Proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Compras" ADD CONSTRAINT "Detalle_Compras_ID_Compra_fkey" FOREIGN KEY ("ID_Compra") REFERENCES "Compras"("ID_Compra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Compras" ADD CONSTRAINT "Detalle_Compras_ID_Insumo_fkey" FOREIGN KEY ("ID_Insumo") REFERENCES "Insumos"("ID_Insumo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_ID_Insumo_fkey" FOREIGN KEY ("ID_Insumo") REFERENCES "Insumos"("ID_Insumo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimientos_Inventario" ADD CONSTRAINT "Movimientos_Inventario_ID_Insumo_fkey" FOREIGN KEY ("ID_Insumo") REFERENCES "Insumos"("ID_Insumo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recetas" ADD CONSTRAINT "Recetas_ID_Producto_fkey" FOREIGN KEY ("ID_Producto") REFERENCES "Productos"("ID_Producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Recetas" ADD CONSTRAINT "Detalle_Recetas_ID_Receta_fkey" FOREIGN KEY ("ID_Receta") REFERENCES "Recetas"("ID_Receta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Recetas" ADD CONSTRAINT "Detalle_Recetas_ID_Insumo_fkey" FOREIGN KEY ("ID_Insumo") REFERENCES "Insumos"("ID_Insumo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producciones" ADD CONSTRAINT "Producciones_ID_Producto_fkey" FOREIGN KEY ("ID_Producto") REFERENCES "Productos"("ID_Producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Producciones" ADD CONSTRAINT "Detalle_Producciones_ID_Produccion_fkey" FOREIGN KEY ("ID_Produccion") REFERENCES "Producciones"("ID_Produccion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Producciones" ADD CONSTRAINT "Detalle_Producciones_ID_Insumo_fkey" FOREIGN KEY ("ID_Insumo") REFERENCES "Insumos"("ID_Insumo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lotes" ADD CONSTRAINT "Lotes_ID_Produccion_fkey" FOREIGN KEY ("ID_Produccion") REFERENCES "Producciones"("ID_Produccion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lotes" ADD CONSTRAINT "Lotes_ID_Producto_fkey" FOREIGN KEY ("ID_Producto") REFERENCES "Productos"("ID_Producto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lotes" ADD CONSTRAINT "Lotes_ID_Insumo_fkey" FOREIGN KEY ("ID_Insumo") REFERENCES "Insumos"("ID_Insumo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ventas" ADD CONSTRAINT "Ventas_ID_Cliente_fkey" FOREIGN KEY ("ID_Cliente") REFERENCES "Clientes"("ID_Cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Ventas" ADD CONSTRAINT "Detalle_Ventas_ID_Venta_fkey" FOREIGN KEY ("ID_Venta") REFERENCES "Ventas"("ID_Venta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Ventas" ADD CONSTRAINT "Detalle_Ventas_ID_Producto_fkey" FOREIGN KEY ("ID_Producto") REFERENCES "Productos"("ID_Producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Ventas" ADD CONSTRAINT "Detalle_Ventas_ID_Lote_fkey" FOREIGN KEY ("ID_Lote") REFERENCES "Lotes"("ID_Lote") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagos" ADD CONSTRAINT "Pagos_ID_Cliente_fkey" FOREIGN KEY ("ID_Cliente") REFERENCES "Clientes"("ID_Cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagos" ADD CONSTRAINT "Pagos_ID_Venta_fkey" FOREIGN KEY ("ID_Venta") REFERENCES "Ventas"("ID_Venta") ON DELETE RESTRICT ON UPDATE CASCADE;
