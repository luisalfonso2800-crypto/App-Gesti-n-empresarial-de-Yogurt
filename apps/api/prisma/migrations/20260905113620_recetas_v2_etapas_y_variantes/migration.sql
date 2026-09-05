/*
  Warnings:

  - You are about to drop the column `ID_Receta` on the `Detalle_Recetas` table. All the data in the column will be lost.
  - Added the required column `ID_Etapa_Receta` to the `Detalle_Recetas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Detalle_Recetas" DROP CONSTRAINT "Detalle_Recetas_ID_Receta_fkey";

-- DropIndex
DROP INDEX "Detalle_Recetas_ID_Receta_ID_Insumo_key";

-- AlterTable
ALTER TABLE "Detalle_Recetas" DROP COLUMN "ID_Receta",
ADD COLUMN     "Es_Opcional" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "Grupo_Variante" TEXT,
ADD COLUMN     "ID_Etapa_Receta" TEXT NOT NULL,
ADD COLUMN     "Tipo_Insumo" TEXT NOT NULL DEFAULT 'BASE';

-- CreateTable
CREATE TABLE "Etapas_Receta" (
    "ID_Etapa_Receta" TEXT NOT NULL,
    "ID_Receta" TEXT NOT NULL,
    "Nombre_Etapa" TEXT NOT NULL,
    "Orden" INTEGER NOT NULL,
    "Tiempo_Minimo_Min" INTEGER,
    "Tiempo_Estandar_Min" INTEGER,
    "Tiempo_Maximo_Min" INTEGER,
    "Temp_Minima_Grados" DECIMAL(65,30),
    "Temp_Maxima_Grados" DECIMAL(65,30),
    "Instrucciones" TEXT,
    "Activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Etapas_Receta_pkey" PRIMARY KEY ("ID_Etapa_Receta")
);

-- CreateIndex
CREATE INDEX "Detalle_Recetas_ID_Etapa_Receta_idx" ON "Detalle_Recetas"("ID_Etapa_Receta");

-- CreateIndex
CREATE INDEX "Detalle_Recetas_ID_Insumo_idx" ON "Detalle_Recetas"("ID_Insumo");

-- AddForeignKey
ALTER TABLE "Etapas_Receta" ADD CONSTRAINT "Etapas_Receta_ID_Receta_fkey" FOREIGN KEY ("ID_Receta") REFERENCES "Recetas"("ID_Receta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Recetas" ADD CONSTRAINT "Detalle_Recetas_ID_Etapa_Receta_fkey" FOREIGN KEY ("ID_Etapa_Receta") REFERENCES "Etapas_Receta"("ID_Etapa_Receta") ON DELETE RESTRICT ON UPDATE CASCADE;
