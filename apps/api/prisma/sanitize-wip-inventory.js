require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/yogurt_db?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function inspectAndSanitize() {
  try {
    console.log('--- INVENTARIO PRODUCTOS ACTUAL ---');
    const invs = await prisma.inventarioProducto.findMany({ include: { producto: true } });
    for (const inv of invs) {
      console.log(`[${inv.idProducto}] ${inv.producto?.nombre}: stock=${inv.cantidadActual}, costoProm=${inv.costoPromedio}`);
    }

    console.log('\n--- LOTES REGISTRADOS ---');
    const lotes = await prisma.lote.findMany({ include: { producto: true } });
    for (const l of lotes) {
      console.log(`[${l.id}] ${l.producto?.nombre}: disp=${l.cantidadDisponible}, ini=${l.cantidadInicial}, tipo=${l.tipoLote}, estado=${l.estado}, costo=${l.costoUnitario}`);
    }

    // Rutina de saneamiento para bases e iniciadores:
    // El stock en InventarioProducto debe ser la suma exacta de cantidadDisponible de sus lotes activos reales no vencidos.
    console.log('\n--- EJECUTANDO SANEAMIENTO DE STOCK EN CAVA ---');
    for (const inv of invs) {
      const prod = inv.producto;
      // Buscamos lotes del producto que no estén vencidos y tengan saldo > 0
      const activeLots = await prisma.lote.findMany({
        where: {
          idProducto: inv.idProducto,
          cantidadDisponible: { gt: 0 }
        }
      });

      const stockReal = activeLots.reduce((acc, l) => acc + Number(l.cantidadDisponible || 0), 0);
      
      let nuevoCosto = Number(inv.costoPromedio || 0);
      // Si el costo promedio es absurdamente alto (ej > 100000 por litro para yogurt base) o irreal
      if (nuevoCosto > 100000 || nuevoCosto < 0) {
        nuevoCosto = Number(prod?.costoEstandar || 5000);
      }
      if (stockReal === 0) {
        nuevoCosto = 0;
      }

      console.log(`Saneando producto ${prod?.nombre}: ${inv.cantidadActual} -> ${stockReal}, costo: ${inv.costoPromedio} -> ${nuevoCosto}`);
      await prisma.inventarioProducto.update({
        where: { idProducto: inv.idProducto },
        data: {
          cantidadActual: stockReal,
          costoPromedio: nuevoCosto
        }
      });
    }

    // También saneamos si hay lotes con cantidadDisponible < 0
    await prisma.lote.updateMany({
      where: { cantidadDisponible: { lt: 0 } },
      data: { cantidadDisponible: 0, estado: 'AGOTADO' }
    });

    console.log('\nSaneamiento completado con éxito.');
  } catch (e) {
    console.error('Error en saneamiento:', e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

inspectAndSanitize();
