const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno desde apps/api/.env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:1083002350Luis1995@localhost:5432/yogurt_dev?schema=public';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('[seed-liquidate-cava] Iniciando liquidación transaccional a Cava comercial...');
  const dataDir = path.join(__dirname, '..', '..', 'web', 'e2e', '.test-data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const outputPath = path.join(dataDir, 'chain-cava.json');

  const productoComercial = await prisma.producto.findFirst({
    where: { nombre: { contains: 'YOGUR NATURAL 1L', mode: 'insensitive' }, activo: true }
  });
  if (!productoComercial) throw new Error('Producto comercial "YOGUR NATURAL 1L" no encontrado.');

  const lotePadre = await prisma.lote.findUnique({ where: { id: 'c69089c7-078b-4265-a024-20a0f10226f1' } });
  if (!lotePadre) throw new Error('Lote padre WIP c69089c7-078b-4265-a024-20a0f10226f1 no encontrado.');

  const existing = await prisma.lote.findFirst({
    where: { idProducto: productoComercial.id, tipoLote: 'PRODUCTO_TERMINADO', estado: 'DISPONIBLE', cantidadDisponible: { gte: 10 } }
  });
  if (existing) {
    console.log(`[seed-liquidate-cava] Lote comercial ya existe en Cava (ID: ${existing.id}). Reutilizando.`);
    const result = { idLote: existing.id, idProducto: productoComercial.id, nombreProducto: productoComercial.nombre, tipoLote: existing.tipoLote, cantidadDisponible: Number(existing.cantidadDisponible), unidad: existing.unidad, status: 'REUSED' };
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    return;
  }

  await prisma.$transaction(async (tx) => {
    const nuevoSaldoPadre = Math.max(0, Number(lotePadre.cantidadDisponible) - 10);
    await tx.lote.update({ where: { id: lotePadre.id }, data: { cantidadDisponible: nuevoSaldoPadre } });

    const produccion = await tx.produccion.create({
      data: {
        idProducto: productoComercial.id,
        cantidadPlanificada: 10,
        cantidadProducidaReal: 10,
        unidadCantidadProducida: 'UNIDAD',
        estado: 'COMPLETADA',
        fechaProduccion: new Date(),
        fechaVencimiento: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        observaciones: `Siembra Cava E2E vinculada a Lote Padre ${lotePadre.id}`
      }
    });

    const nuevoLote = await tx.lote.create({
      data: {
        tipoLote: 'PRODUCTO_TERMINADO',
        idProduccion: produccion.id,
        idProducto: productoComercial.id,
        idLotePadre: lotePadre.id,
        fechaProduccion: new Date(),
        fechaVencimiento: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        cantidadInicial: 10,
        cantidadDisponible: 10,
        unidad: 'UNIDAD',
        estado: 'DISPONIBLE'
      }
    });

    const inv = await tx.inventarioProducto.findUnique({ where: { idProducto: productoComercial.id } });
    const stockActual = inv ? Number(inv.cantidadActual) : 0;
    await tx.inventarioProducto.upsert({
      where: { idProducto: productoComercial.id },
      update: { cantidadActual: stockActual + 10, costoPromedio: 4500 },
      create: { idProducto: productoComercial.id, cantidadActual: 10, costoPromedio: 4500 }
    });

    await tx.movimientoInventario.create({
      data: { idProducto: lotePadre.idProducto, idLote: lotePadre.id, tipoMovimiento: 'SALIDA_PRODUCCION', cantidad: 10, motivo: `Consumo base WIP en orden ${produccion.id}` }
    });

    await tx.movimientoInventario.create({
      data: { idProducto: productoComercial.id, idLote: nuevoLote.id, tipoMovimiento: 'ENTRADA_PRODUCCION', cantidad: 10, costoUnitario: 4500, motivo: `Entrada a Cava desde orden ${produccion.id}` }
    });

    const result = { idLote: nuevoLote.id, idProduccion: produccion.id, idProducto: productoComercial.id, nombreProducto: productoComercial.nombre, tipoLote: nuevoLote.tipoLote, cantidadDisponible: 10, unidad: nuevoLote.unidad, status: 'CREATED' };
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`[seed-liquidate-cava] Lote comercial liquidado con éxito (ID: ${nuevoLote.id}).`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
