import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { toCanonicalUnit } from '../src/utils/unitNormalizer.js';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/yogurt_db?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  console.log('Iniciando migración de normalización de unidades...');
  let totalUpdates = 0;

  // 1. Presentacion -> unidadMedida
  const presentaciones = await prisma.presentacion.findMany();
  for (const item of presentaciones) {
    if (item.unidadMedida) {
      const canonical = toCanonicalUnit(item.unidadMedida);
      if (canonical !== item.unidadMedida) {
        await prisma.presentacion.update({ where: { id: item.id }, data: { unidadMedida: canonical } });
        console.log(`Presentacion ${item.id}: ${item.unidadMedida} -> ${canonical}`);
        totalUpdates++;
      }
    }
  }

  // 2. Insumo -> unidadBase
  const insumos = await prisma.insumo.findMany();
  for (const item of insumos) {
    if (item.unidadBase) {
      const canonical = toCanonicalUnit(item.unidadBase);
      if (canonical !== item.unidadBase) {
        await prisma.insumo.update({ where: { id: item.id }, data: { unidadBase: canonical } });
        console.log(`Insumo ${item.id}: ${item.unidadBase} -> ${canonical}`);
        totalUpdates++;
      }
    }
  }

  // 3. PrecioProveedor -> unidadPresentacion
  const precios = await prisma.precioProveedor.findMany();
  for (const item of precios) {
    if (item.unidadPresentacion) {
      const canonical = toCanonicalUnit(item.unidadPresentacion);
      if (canonical !== item.unidadPresentacion) {
        await prisma.precioProveedor.update({ where: { id: item.id }, data: { unidadPresentacion: canonical } });
        console.log(`PrecioProveedor ${item.id}: ${item.unidadPresentacion} -> ${canonical}`);
        totalUpdates++;
      }
    }
  }

  // 4. Receta -> unidadRendimiento
  const recetas = await prisma.receta.findMany();
  for (const item of recetas) {
    if (item.unidadRendimiento) {
      const canonical = toCanonicalUnit(item.unidadRendimiento);
      if (canonical !== item.unidadRendimiento) {
        await prisma.receta.update({ where: { id: item.id }, data: { unidadRendimiento: canonical } });
        console.log(`Receta ${item.id}: ${item.unidadRendimiento} -> ${canonical}`);
        totalUpdates++;
      }
    }
  }

  // 5. DetalleReceta -> unidad
  const detallesReceta = await prisma.detalleReceta.findMany();
  for (const item of detallesReceta) {
    if (item.unidad) {
      const canonical = toCanonicalUnit(item.unidad);
      if (canonical !== item.unidad) {
        await prisma.detalleReceta.update({ where: { id: item.id }, data: { unidad: canonical } });
        console.log(`DetalleReceta ${item.id}: ${item.unidad} -> ${canonical}`);
        totalUpdates++;
      }
    }
  }

  // 6. DetalleProduccion -> unidad
  const detallesProduccion = await prisma.detalleProduccion.findMany();
  for (const item of detallesProduccion) {
    if (item.unidad) {
      const canonical = toCanonicalUnit(item.unidad);
      if (canonical !== item.unidad) {
        await prisma.detalleProduccion.update({ where: { id: item.id }, data: { unidad: canonical } });
        console.log(`DetalleProduccion ${item.id}: ${item.unidad} -> ${canonical}`);
        totalUpdates++;
      }
    }
  }

  // 7. Lote -> unidad
  const lotes = await prisma.lote.findMany();
  for (const item of lotes) {
    if (item.unidad) {
      const canonical = toCanonicalUnit(item.unidad);
      if (canonical !== item.unidad) {
        await prisma.lote.update({ where: { id: item.id }, data: { unidad: canonical } });
        console.log(`Lote ${item.id}: ${item.unidad} -> ${canonical}`);
        totalUpdates++;
      }
    }
  }

  console.log(`Migración finalizada. Total de actualizaciones: ${totalUpdates}`);
  await prisma.$disconnect();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
