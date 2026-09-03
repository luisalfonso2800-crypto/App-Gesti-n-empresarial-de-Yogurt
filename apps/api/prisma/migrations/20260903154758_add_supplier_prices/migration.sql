-- CreateTable
CREATE TABLE "Precios_Proveedores" (
    "ID_Precio" TEXT NOT NULL,
    "ID_Insumo" TEXT NOT NULL,
    "ID_Proveedor" TEXT NOT NULL,
    "Presentacion_Compra" TEXT NOT NULL,
    "Cantidad_Presentacion" DECIMAL(65,30) NOT NULL,
    "Unidad_Presentacion" TEXT NOT NULL,
    "Cantidad_Equivalente_Base" DECIMAL(65,30) NOT NULL,
    "Precio_Compra" DECIMAL(12,2) NOT NULL,
    "Costo_Unidad_Base" DECIMAL(12,2) NOT NULL,
    "Fecha_Registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Fecha_Ultima_Compra" TIMESTAMP(3),
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "Observaciones" TEXT,

    CONSTRAINT "Precios_Proveedores_pkey" PRIMARY KEY ("ID_Precio")
);

-- AddForeignKey
ALTER TABLE "Precios_Proveedores" ADD CONSTRAINT "Precios_Proveedores_ID_Insumo_fkey" FOREIGN KEY ("ID_Insumo") REFERENCES "Insumos"("ID_Insumo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Precios_Proveedores" ADD CONSTRAINT "Precios_Proveedores_ID_Proveedor_fkey" FOREIGN KEY ("ID_Proveedor") REFERENCES "Proveedores"("ID_Proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;
