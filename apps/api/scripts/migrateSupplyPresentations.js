const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config({ path: __dirname + '/../../.env' }); // Adjust if needed

async function main() {
  console.log('Iniciando migración de contenidoReferencial...');
  
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/yogurt_dev?schema=public';
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  await prisma.$connect();

  try {
    const insumos = await prisma.insumo.findMany();

    for (const insumo of insumos) {
      let contenido = 1;
      const unidadBase = (insumo.unidadBase || '').toLowerCase();

      if (unidadBase === 'g' || unidadBase === 'ml') {
        contenido = 1000;
      } else if (unidadBase === 'und') {
        contenido = 1;
      } else {
        contenido = 1;
      }

      await prisma.insumo.update({
        where: { id: insumo.id },
        data: { contenidoReferencial: contenido }
      });
      console.log(`Insumo actualizado: ${insumo.nombre} -> contenidoReferencial: ${contenido}`);
    }

    console.log('Migración completada exitosamente.');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
