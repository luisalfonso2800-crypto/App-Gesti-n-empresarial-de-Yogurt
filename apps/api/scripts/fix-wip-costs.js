import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Iniciando fix-wip-costs.js ---');

  // 1. Buscar producto "YOGURT BASE" o categoría 'BASES_LACTEAS'
  const productosBase = await prisma.producto.findMany({
    where: {
      OR: [
        { nombre: { contains: 'BASE', mode: 'insensitive' } },
        { categoria: 'BASES_LACTEAS' },
        { categoria: 'INTERMEDIO_WIP' },
      ],
    },
    include: { inventario: true },
  });

  console.log(`Encontrados ${productosBase.length} productos base potenciales:`);
  for (const p of productosBase) {
    console.log(`- ID: ${p.id} | Nombre: ${p.nombre} | Cat: ${p.categoria} | InvCosto: ${p.inventario?.costoPromedio}`);
    if (p.inventario) {
      await prisma.inventarioProducto.update({
        where: { id: p.inventario.id },
        data: { costoPromedio: 3869 },
      });
      console.log(`  -> Actualizado inventario de ${p.nombre} con costoPromedio = 3869`);
    } else {
      await prisma.inventarioProducto.create({
        data: {
          idProducto: p.id,
          cantidadActual: 0,
          costoPromedio: 3869,
        },
      });
      console.log(`  -> Creado inventario para ${p.nombre} con costoPromedio = 3869`);
    }
  }

  // 2. Buscar lote WIP (fad038d5 o tipoLote SEMIELABORADO_WIP)
  const lotesWip = await prisma.lote.findMany({
    where: {
      OR: [
        { id: 'fad038d5-fff1-4dfb-9ddc-4cfe9757e658' },
        { tipoLote: 'SEMIELABORADO_WIP' },
        { idProducto: { in: productosBase.map((p) => p.id) } },
      ],
    },
  });

  console.log(`Encontrados ${lotesWip.length} lotes WIP:`);
  for (const l of lotesWip) {
    console.log(`- ID: ${l.id} | Tipo: ${l.tipoLote} | CostoUnit: ${l.costoUnitario}`);
    await prisma.lote.update({
      where: { id: l.id },
      data: {
        costoUnitario: 4390,
      },
    });
    console.log(`  -> Actualizado lote ${l.id} con costoUnitario: 4390`);
  }

  console.log('--- Script completado con éxito ---');
}

main()
  .catch((e) => {
    console.error('Error ejecutando script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
