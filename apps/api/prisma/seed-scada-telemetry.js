import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: 'apps/api/.env' });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/manna_db' });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('⚡ Iniciando inyección del Dataset Maestro SCADA MANNÁ...');

  // 0. Presentacion
  let presentacion = await prisma.presentacion.findFirst({ where: { nombre: '1 Litro' } });
  if (!presentacion) {
    presentacion = await prisma.presentacion.create({
      data: {
        nombre: '1 Litro',
        cantidadOz: 33.8,
        cantidadMl: 1000,
        tipoEnvase: 'PET'
      }
    });
  }

  // 1. Insumos Base y Silos
  const insumosData = [
    { nombre: 'Leche Cruda Entera', unidadBase: 'LITRO', stockMinimo: 500, stockActual: 1200, costo: 1850 },
    { nombre: 'Cultivo Probiótico Activo', unidadBase: 'GRAMO', stockMinimo: 200, stockActual: 80, costo: 120 },
    { nombre: 'Pulpa Natural de Fresa', unidadBase: 'KILOGRAMO', stockMinimo: 50, stockActual: 180, costo: 8500 },
    { nombre: 'Pulpa Natural de Melocotón', unidadBase: 'KILOGRAMO', stockMinimo: 50, stockActual: 120, costo: 8900 },
    { nombre: 'Envase PET 1000ml', unidadBase: 'UNIDAD', stockMinimo: 300, stockActual: 650, costo: 650 },
    { nombre: 'Azúcar Refinada', unidadBase: 'KILOGRAMO', stockMinimo: 100, stockActual: 350, costo: 3200 }
  ];

  const insumosMap = {};
  for (const item of insumosData) {
    let insumo = await prisma.insumo.findFirst({ where: { nombre: item.nombre } });
    if (insumo) {
      insumo = await prisma.insumo.update({ where: { id: insumo.id }, data: { stockMinimo: item.stockMinimo } });
    } else {
      insumo = await prisma.insumo.create({
        data: {
          nombre: item.nombre,
          unidadBase: item.unidadBase,
          stockMinimo: item.stockMinimo,
          categoria: 'MATERIA_PRIMA',
          subcategoria: 'GENERAL',
          marca: 'GENERICA'
        }
      });
    }
    insumosMap[item.nombre] = insumo;

    let inventario = await prisma.inventario.findFirst({ where: { idInsumo: insumo.id } });
    if (inventario) {
      await prisma.inventario.update({ where: { id: inventario.id }, data: { cantidadActual: item.stockActual, costoPromedio: item.costo } });
    } else {
      await prisma.inventario.create({ data: { idInsumo: insumo.id, cantidadActual: item.stockActual, costoPromedio: item.costo } });
    }
  }

  // 2. Productos Terminados
  const productosData = [
    { codigo: 'YOG-FRE-1L', nombre: 'Yogur Tradicional Fresa 1L', precioVenta: 12500, costo: 6200, stockCava: 180 },
    { codigo: 'YOG-MEL-1L', nombre: 'Yogur Tradicional Melocotón 1L', precioVenta: 12800, costo: 6400, stockCava: 95 },
    { codigo: 'YOG-GRI-500', nombre: 'Yogur Griego Natural 500g', precioVenta: 15500, costo: 7100, stockCava: 40 }
  ];

  const productosMap = {};
  for (const item of productosData) {
    let prod = await prisma.producto.findFirst({ where: { nombre: item.nombre } });
    if (prod) {
      prod = await prisma.producto.update({ where: { id: prod.id }, data: { precioVenta: item.precioVenta, activo: true } });
    } else {
      prod = await prisma.producto.create({
        data: {
          nombre: item.nombre,
          precioVenta: item.precioVenta,
          activo: true,
          idPresentacion: presentacion.id,
          categoria: 'YOGURT',
          canalVenta: 'MAYORISTA',
          margenObjetivo: 20
        }
      });
    }
    productosMap[item.codigo] = prod;

    let invProd = await prisma.inventarioProducto.findFirst({ where: { idProducto: prod.id } });
    if (invProd) {
      await prisma.inventarioProducto.update({ where: { id: invProd.id }, data: { cantidadActual: item.stockCava, costoPromedio: item.costo } });
    } else {
      await prisma.inventarioProducto.create({ data: { idProducto: prod.id, cantidadActual: item.stockCava, costoPromedio: item.costo } });
    }
  }

  // 3. Recetas y Detalles Vivos
  const fresaProd = productosMap['YOG-FRE-1L'];
  let recetaFresa = await prisma.receta.findFirst({ where: { idProducto: fresaProd.id } });
  if (recetaFresa) {
    recetaFresa = await prisma.receta.update({ where: { id: recetaFresa.id }, data: { rendimientoBase: 100 } });
  } else {
    recetaFresa = await prisma.receta.create({
      data: {
        idProducto: fresaProd.id,
        nombre: 'Receta Maestra Yogur Fresa 100L',
        rendimientoBase: 100,
        unidadRendimiento: 'Litros'
      }
    });
  }

    let etapa = await prisma.etapaReceta.findFirst({ where: { idReceta: recetaFresa.id } });
  if (!etapa) {
    etapa = await prisma.etapaReceta.create({
      data: { idReceta: recetaFresa.id, nombre: 'Preparación', orden: 1, tiempoEstandarMin: 60 }
    });
  }

  await prisma.detalleReceta.deleteMany({ where: { idEtapaReceta: etapa.id } });
  await prisma.detalleReceta.createMany({
    data: [
      { idEtapaReceta: etapa.id, idInsumo: insumosMap['Leche Cruda Entera'].id, cantidadRequerida: 95, mermaPorcentaje: 2, unidad: 'LITRO', tipoInsumo: 'MATERIA_PRIMA' },
      { idEtapaReceta: etapa.id, idInsumo: insumosMap['Cultivo Probiótico Activo'].id, cantidadRequerida: 15, mermaPorcentaje: 0, unidad: 'GRAMO', tipoInsumo: 'MATERIA_PRIMA' },
      { idEtapaReceta: etapa.id, idInsumo: insumosMap['Pulpa Natural de Fresa'].id, cantidadRequerida: 12, mermaPorcentaje: 1, unidad: 'KILOGRAMO', tipoInsumo: 'MATERIA_PRIMA' },
      { idEtapaReceta: etapa.id, idInsumo: insumosMap['Envase PET 1000ml'].id, cantidadRequerida: 100, mermaPorcentaje: 1, unidad: 'UNIDAD', tipoInsumo: 'EMPAQUE' }
    ]
  });

  // 4. Lotes Tácticos en Cava (Sonar Radar FEFO)
  await prisma.lote.deleteMany({ where: { idProducto: fresaProd.id } });
  const now = new Date();
  
    let produccionDummy = await prisma.produccion.findFirst({ where: { observaciones: 'Dummy SCADA' } });
  if (!produccionDummy) {
    produccionDummy = await prisma.produccion.create({
      data: {
        
        idProducto: fresaProd.id,
        cantidadPlanificada: 100,
        fechaProduccion: new Date(),
        estado: 'FINALIZADA',
        observaciones: 'Dummy SCADA'
      }
    });
  }

  const lotesFefo = [
    { codigo: 'LOT-CRIT-01', cant: 28, dias: 2 },
    { codigo: 'LOT-ALER-02', cant: 45, dias: 7 },
    { codigo: 'LOT-ALER-03', cant: 35, dias: 12 },
    { codigo: 'LOT-OPT-04', cant: 72, dias: 25 }
  ];

  for (const l of lotesFefo) {
    const fVenc = new Date(now.getTime() + l.dias * 24 * 60 * 60 * 1000);
    await prisma.lote.create({
      data: {
        idProduccion: produccionDummy.id,
        tipoLote: 'PRODUCTO_TERMINADO',
        fechaProduccion: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        unidad: 'UNIDADES',
        idProducto: fresaProd.id,
        cantidadInicial: l.cant,
        cantidadDisponible: l.cant,
        fechaVencimiento: fVenc,
        estado: 'DISPONIBLE'
      }
    });
  }

  // 5. Historial de Ventas para Forecast y 4-Box
  for (let i = 25; i >= 1; i -= 2) {
    const fecha = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    // Create Cliente first for the sale
    let cliente = await prisma.cliente.findFirst({ where: { nombre: 'Cliente General' } });
    if (!cliente) {
        cliente = await prisma.cliente.create({ data: { nombre: 'Cliente General', tipoCliente: 'MAYORISTA', canal: 'MAYORISTA', diasCredito: 30 }});
    }

    const v = await prisma.venta.create({
      data: {
        fechaVenta: fecha,
        totalVenta: 125000,
        estado: 'COMPLETADO',
                saldoPendiente: 0,
        idCliente: cliente.id,
        canalVenta: 'MAYORISTA', tipoPago: 'EFECTIVO', valorPagado: 125000
      }
    });
    await prisma.detalleVenta.create({
      data: {
        idVenta: v.id,
        idProducto: fresaProd.id,
        cantidad: 10,
        precioUnitario: 12500,
                descuento: 0,
        totalLinea: 125000,
        costoUnitario: 6200,
        utilidadUnitaria: 6300,
        utilidadTotal: 63000
      }
    });
  }

  console.log('✅ Dataset Maestro SCADA inyectado con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error al ejecutar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
