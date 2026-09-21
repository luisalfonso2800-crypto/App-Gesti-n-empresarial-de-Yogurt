import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: 'apps/api/.env' });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Verificando datos para prueba E2E...');

  // 1. Asegurar producto y receta con YOGURT PURO
  let pres = await prisma.presentacion.findFirst();
  if (!pres) {
    pres = await prisma.presentacion.create({
      data: { nombre: 'Vaso 16 oz', cantidadOz: 16, cantidadMl: 500, tipoEnvase: 'Vaso' }
    });
  }

  let prod = await prisma.producto.findFirst({
    where: { nombre: { contains: 'YOGURT PURO', mode: 'insensitive' } }
  });

  if (!prod) {
    prod = await prisma.producto.create({
      data: {
        nombre: 'YOGURT PURO ARTESANAL',
        categoria: 'PRODUCTO_TERMINADO',
        canalVenta: 'MAYORISTA',
        precioVenta: 12000,
        idPresentacion: pres.id,
        activo: true
      }
    });
  }

  let receta = await prisma.receta.findFirst({
    where: { nombre: { contains: 'YOGURT PURO', mode: 'insensitive' } }
  });

  if (!receta) {
    receta = await prisma.receta.create({
      data: {
        idProducto: prod.id,
        nombre: 'Fórmula - YOGURT PURO ARTESANAL',
        rendimientoBase: 10,
        unidadRendimiento: 'Unidades',
        activo: true
      }
    });
  }

  // 2. Insumo de prueba y stock para permitir liquidación
  let insumo = await prisma.insumo.findFirst({ where: { activo: true } });
  if (!insumo) {
    insumo = await prisma.insumo.create({
      data: {
        nombre: 'Leche Pasteurizada E2E',
        unidadBase: 'Litros',
        categoria: 'MATERIA_PRIMA',
        stockMinimo: 10,
        activo: true
      }
    });
  }

  let invInsumo = await prisma.inventario.findUnique({ where: { idInsumo: insumo.id } });
  if (!invInsumo) {
    await prisma.inventario.create({
      data: { idInsumo: insumo.id, cantidadActual: 500, costoPromedio: 2000 }
    });
  } else if (Number(invInsumo.cantidadActual) < 100) {
    await prisma.inventario.update({
      where: { idInsumo: insumo.id },
      data: { cantidadActual: 500 }
    });
  }

  // 3. Crear o actualizar una orden en EN_PROCESO
  let orderEnProceso = await prisma.produccion.findFirst({
    where: { estado: 'EN_PROCESO' },
    include: { detalles: true }
  });

  if (!orderEnProceso) {
    orderEnProceso = await prisma.produccion.create({
      data: {
        idProducto: prod.id,
        idReceta: receta.id,
        cantidadPlanificada: 20,
        estado: 'EN_PROCESO',
        fechaProduccion: new Date(),
        observaciones: 'Lote E2E Automático',
        detalles: {
          create: [
            {
              idInsumo: insumo.id,
              cantidadTeorica: 20,
              unidad: 'Litros',
              costoTeorico: 40000
            }
          ]
        }
      },
      include: { detalles: true }
    });
    console.log('Creada orden en EN_PROCESO:', orderEnProceso.id);
  } else {
    console.log('Orden existente en EN_PROCESO:', orderEnProceso.id);
  }

  // 4. Asegurar que todos los productos en inventario tengan inventarioProducto y si alguno tiene 0, actualizar a saldo positivo para cava
  const allProds = await prisma.producto.findMany({
    where: { activo: true },
    include: { inventario: true, lotes: { where: { cantidadDisponible: { gt: 0 } } } }
  });

  for (const p of allProds) {
    if (!p.inventario) {
      await prisma.inventarioProducto.create({
        data: { idProducto: p.id, cantidadActual: 25, costoPromedio: 3500 }
      });
    } else if (p.lotes.length === 0 || Number(p.inventario.cantidadActual) % 10 === 0) {
      await prisma.inventarioProducto.update({
        where: { idProducto: p.id },
        data: { cantidadActual: 25, costoPromedio: 3500 }
      });
    }

    // Crear al menos un lote disponible para que aparezca en Cava
    const lotesDisp = await prisma.lote.findMany({
      where: { idProducto: p.id, estado: 'DISPONIBLE', cantidadDisponible: { gt: 0 } }
    });
    if (lotesDisp.length === 0) {
      await prisma.lote.create({
        data: {
          idProduccion: orderEnProceso.id,
          idProducto: p.id,
          tipoLote: 'PRODUCTO_TERMINADO',
          cantidadInicial: 25,
          cantidadDisponible: 25,
          unidad: 'UNIDAD',
          costoUnitario: 3500,
          fechaProduccion: new Date(),
          fechaVencimiento: new Date(Date.now() + 21 * 86400000),
          estado: 'DISPONIBLE'
        }
      });
    } else {
      for (const l of lotesDisp) {
        if (Number(l.cantidadDisponible) % 10 === 0) {
          await prisma.lote.update({
            where: { id: l.id },
            data: { cantidadDisponible: 25, cantidadInicial: 25 }
          });
        }
      }
    }
  }

  console.log('Setup E2E completado con éxito.');
}

main()
  .catch((e) => {
    console.error('Error en setup E2E:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
