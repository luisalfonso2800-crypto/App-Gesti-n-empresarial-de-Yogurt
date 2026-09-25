const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/manna_db';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('[seed-production-wip] Iniciando siembra directa de orden de producción WIP...');

  // 1. Localizar la base intermedia WIP "YOGUR BASE NATURAL"
  const productoWip = await prisma.producto.findFirst({
    where: {
      nombre: { contains: 'BASE NATURAL', mode: 'insensitive' },
      activo: true
    },
    include: {
      recetas: {
        where: { activo: true },
        include: { etapas: { include: { detalles: true } } }
      }
    }
  });

  if (!productoWip) {
    throw new Error('Producto intermedio "YOGUR BASE NATURAL" no encontrado en la base de datos.');
  }

  // 2. Verificar existencia previa de lote WIP con saldo disponible (Idempotencia)
  const existingLote = await prisma.lote.findFirst({
    where: {
      idProducto: productoWip.id,
      tipoLote: 'SEMIELABORADO_WIP',
      cantidadDisponible: { gte: 100 }
    },
    include: { produccion: true }
  });

  const dataDir = path.join(__dirname, '..', '..', 'web', 'e2e', '.test-data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const outputPath = path.join(dataDir, 'chain-production.json');

  if (existingLote) {
    console.log(`[seed-production-wip] Lote WIP ya existe con saldo suficiente (ID: ${existingLote.id}). Reutilizando.`);
    const result = {
      idLote: existingLote.id,
      idProduccion: existingLote.idProduccion,
      idProducto: productoWip.id,
      nombreProducto: productoWip.nombre,
      tipoLote: existingLote.tipoLote,
      cantidadDisponible: Number(existingLote.cantidadDisponible),
      unidad: existingLote.unidad,
      status: 'REUSED'
    };
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`[seed-production-wip] Trazabilidad guardada en: ${outputPath}`);
    return;
  }

  // 3. Crear Producción y Lote transaccionalmente
  const cantidadBatch = 100;
  const fechaNow = new Date();
  const fechaVence = new Date();
  fechaVence.setDate(fechaNow.getDate() + 21); // 21 días de vida útil para base en tanque

  const createdData = await prisma.$transaction(async (tx) => {
    // A. Registrar Producción
    const produccion = await tx.produccion.create({
      data: {
        idProducto: productoWip.id,
        fechaProduccion: fechaNow,
        fechaPlanificada: fechaNow,
        cantidadPlanificada: cantidadBatch,
        cantidadProducidaReal: cantidadBatch,
        unidadCantidadProducida: 'Litros',
        estado: 'COMPLETADA',
        fechaVencimiento: fechaVence,
        observaciones: 'Siembra automatizada de lote padre WIP para envasado comercial.'
      }
    });

    // B. Registrar Lote Padre WIP
    const lote = await tx.lote.create({
      data: {
        idProduccion: produccion.id,
        idProducto: productoWip.id,
        tipoLote: 'SEMIELABORADO_WIP',
        fechaProduccion: fechaNow,
        fechaVencimiento: fechaVence,
        cantidadInicial: cantidadBatch,
        cantidadDisponible: cantidadBatch,
        unidad: 'L',
        estado: 'DISPONIBLE',
        costoUnitario: 3500,
        observaciones: 'Lote padre en tanque para formulación de comerciales envasados.'
      }
    });

    // C. Actualizar referencia de lote en la producción
    await tx.produccion.update({
      where: { id: produccion.id },
      data: { idLote: lote.id }
    });

    // D. Registrar Movimiento de Entrada en Inventario
    await tx.movimientoInventario.create({
      data: {
        idProducto: productoWip.id,
        idLote: lote.id,
        tipoMovimiento: 'ENTRADA_PRODUCCION',
        cantidad: cantidadBatch,
        stockAnterior: 0,
        stockNuevo: cantidadBatch,
        costoUnitario: 3500,
        motivo: 'Producción de base intermedia en tanque',
        operacionOrigen: `PROD-${produccion.id.slice(0, 8)}`
      }
    });

    return { produccion, lote };
  });

  console.log(`[seed-production-wip] Producción y Lote WIP creados con éxito: Lote ID: ${createdData.lote.id}`);

  const finalOutput = {
    idLote: createdData.lote.id,
    idProduccion: createdData.produccion.id,
    idProducto: productoWip.id,
    nombreProducto: productoWip.nombre,
    tipoLote: createdData.lote.tipoLote,
    cantidadDisponible: cantidadBatch,
    unidad: 'L',
    status: 'CREATED'
  };

  fs.writeFileSync(outputPath, JSON.stringify(finalOutput, null, 2), 'utf-8');
  console.log(`[seed-production-wip] Trazabilidad guardada en: ${outputPath}`);
}

main()
  .catch(err => {
    console.error('[seed-production-wip] Error en siembra de producción WIP:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
