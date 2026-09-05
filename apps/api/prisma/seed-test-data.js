require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/yogurt_db?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  try {
    console.log('Iniciando carga masiva de datos (seed)...');

    console.log('Limpiando base de datos previa...');
    const tables = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != '_prisma_migrations';`;
    for (const { tablename } of tables) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`);
    }

    // 1. Maestros y Catálogo
    console.log('Insertando Presentaciones...');
    const pres250 = await prisma.presentacion.create({ data: { nombre: '250ml', cantidadOz: 8.45, cantidadMl: 250, tipoEnvase: 'Plástico', activo: true } });
    const pres500 = await prisma.presentacion.create({ data: { nombre: '500ml', cantidadOz: 16.9, cantidadMl: 500, tipoEnvase: 'Plástico', activo: true } });
    const pres1L = await prisma.presentacion.create({ data: { nombre: '1 Litro', cantidadOz: 33.8, cantidadMl: 1000, tipoEnvase: 'Plástico', activo: true } });
    const presGalon = await prisma.presentacion.create({ data: { nombre: 'Galón', cantidadOz: 128, cantidadMl: 3785, tipoEnvase: 'Plástico', activo: true } });

    console.log('Insertando Insumos...');
    const inLeche = await prisma.insumo.create({ data: { nombre: 'Leche cruda', categoria: 'Materia Prima', subcategoria: 'Lácteos', marca: 'Local', unidadBase: 'Litros', stockMinimo: 100, activo: true } });
    const inCultivo = await prisma.insumo.create({ data: { nombre: 'Cultivo láctico', categoria: 'Materia Prima', subcategoria: 'Aditivos', marca: 'Danisco', unidadBase: 'Gramos', stockMinimo: 500, activo: true } });
    const inAzucar = await prisma.insumo.create({ data: { nombre: 'Azúcar', categoria: 'Materia Prima', subcategoria: 'Endulzantes', marca: 'Manuelita', unidadBase: 'Kilogramos', stockMinimo: 50, activo: true } });
    const inFresa = await prisma.insumo.create({ data: { nombre: 'Pulpa de Fresa', categoria: 'Materia Prima', subcategoria: 'Frutas', marca: 'Fruver', unidadBase: 'Kilogramos', stockMinimo: 20, activo: true } });
    const inMora = await prisma.insumo.create({ data: { nombre: 'Pulpa de Mora', categoria: 'Materia Prima', subcategoria: 'Frutas', marca: 'Fruver', unidadBase: 'Kilogramos', stockMinimo: 20, activo: true } });
    const inEstabilizante = await prisma.insumo.create({ data: { nombre: 'Estabilizante', categoria: 'Materia Prima', subcategoria: 'Aditivos', marca: 'Genérico', unidadBase: 'Gramos', stockMinimo: 1000, activo: true } });
    const inBotella1L = await prisma.insumo.create({ data: { nombre: 'Botella 1L', categoria: 'Empaque', subcategoria: 'Envases', marca: 'Plásticos SA', unidadBase: 'Unidades', stockMinimo: 500, activo: true } });
    const inEtiqueta1L = await prisma.insumo.create({ data: { nombre: 'Etiqueta 1L Fresa', categoria: 'Empaque', subcategoria: 'Etiquetas', marca: 'Impresos SA', unidadBase: 'Unidades', stockMinimo: 500, activo: true } });

    console.log('Insertando Proveedores...');
    const prov1 = await prisma.proveedor.create({ data: { nombre: 'Lácteos El Campo', nitCedula: '900123456-1', telefono: '3001234567', email: 'ventas@elcampo.com', direccion: 'Finca El Campo', activo: true } });
    const prov2 = await prisma.proveedor.create({ data: { nombre: 'Distribuidora Fruver', nitCedula: '900234567-2', telefono: '3002345678', email: 'ventas@fruver.com', direccion: 'Calle 10 # 20-30', activo: true } });
    const prov3 = await prisma.proveedor.create({ data: { nombre: 'Plásticos y Empaques', nitCedula: '900345678-3', telefono: '3003456789', email: 'contacto@plasticos.com', direccion: 'Av 15 # 40-50', activo: true } });
    const prov4 = await prisma.proveedor.create({ data: { nombre: 'Insumos Alimenticios', nitCedula: '900456789-4', telefono: '3004567890', email: 'info@insumos.com', direccion: 'Cra 50 # 10-20', activo: true } });

    console.log('Insertando Precios Proveedor...');
    await prisma.precioProveedor.create({ data: { idInsumo: inLeche.id, idProveedor: prov1.id, presentacionCompra: 'Cantina 40L', cantidadPresentacion: 40, unidadPresentacion: 'Litros', cantidadEquivalenteBase: 40, precioCompra: 60000, costoUnidadBase: 1500 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inFresa.id, idProveedor: prov2.id, presentacionCompra: 'Caneca 20Kg', cantidadPresentacion: 20, unidadPresentacion: 'Kilogramos', cantidadEquivalenteBase: 20, precioCompra: 100000, costoUnidadBase: 5000 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inBotella1L.id, idProveedor: prov3.id, presentacionCompra: 'Paca x100', cantidadPresentacion: 100, unidadPresentacion: 'Unidades', cantidadEquivalenteBase: 100, precioCompra: 30000, costoUnidadBase: 300 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inAzucar.id, idProveedor: prov4.id, presentacionCompra: 'Bulto 50Kg', cantidadPresentacion: 50, unidadPresentacion: 'Kilogramos', cantidadEquivalenteBase: 50, precioCompra: 150000, costoUnidadBase: 3000 } });

    console.log('Insertando Productos...');
    const prodFresa1L = await prisma.producto.create({ data: { nombre: 'Yogurt Fresa 1L', idPresentacion: pres1L.id, categoria: 'Yogurt', canalVenta: 'Mayorista', precioVenta: 7000, margenObjetivo: 30, activo: true } });
    const prodMora1L = await prisma.producto.create({ data: { nombre: 'Yogurt Mora 1L', idPresentacion: pres1L.id, categoria: 'Yogurt', canalVenta: 'Mayorista', precioVenta: 7000, margenObjetivo: 30, activo: true } });
    const prodMelocoton1L = await prisma.producto.create({ data: { nombre: 'Yogurt Melocotón 1L', idPresentacion: pres1L.id, categoria: 'Yogurt', canalVenta: 'Mayorista', precioVenta: 7000, margenObjetivo: 30, activo: true } });
    const prodNatural500 = await prisma.producto.create({ data: { nombre: 'Yogurt Natural 500ml', idPresentacion: pres500.id, categoria: 'Yogurt', canalVenta: 'Minorista', precioVenta: 4000, margenObjetivo: 35, activo: true } });
    const prodGriego250 = await prisma.producto.create({ data: { nombre: 'Yogurt Griego 250ml', idPresentacion: pres250.id, categoria: 'Yogurt Griego', canalVenta: 'Minorista', precioVenta: 5000, margenObjetivo: 40, activo: true } });
    const prodFresaGalon = await prisma.producto.create({ data: { nombre: 'Yogurt Fresa Galón', idPresentacion: presGalon.id, categoria: 'Yogurt', canalVenta: 'Institucional', precioVenta: 25000, margenObjetivo: 25, activo: true } });

    console.log('Insertando Recetas...');
    const recFresa1L = await prisma.receta.create({
      data: {
        idProducto: prodFresa1L.id,
        nombre: 'Receta Yogurt Fresa 1L',
        rendimientoBase: 1,
        unidadRendimiento: 'Litros',
        activo: true,
        etapas: {
          create: [
            {
              nombre: 'Preparación de Base',
              orden: 1,
              tiempoEstandarMin: 60,
              detalles: {
                create: [
                  { idInsumo: inLeche.id, cantidadRequerida: 0.8, unidad: 'Litros', mermaPorcentaje: 2, tipoInsumo: 'BASE' },
                  { idInsumo: inAzucar.id, cantidadRequerida: 0.08, unidad: 'Kilogramos', mermaPorcentaje: 1, tipoInsumo: 'BASE' },
                  { idInsumo: inCultivo.id, cantidadRequerida: 2, unidad: 'Gramos', mermaPorcentaje: 0, tipoInsumo: 'BASE' }
                ]
              }
            },
            {
              nombre: 'Saborización',
              orden: 2,
              tiempoEstandarMin: 30,
              detalles: {
                create: [
                  { idInsumo: inFresa.id, cantidadRequerida: 0.1, unidad: 'Kilogramos', mermaPorcentaje: 5, tipoInsumo: 'COMPLEMENTO', esOpcional: true, grupoVariante: 'SABOR' }
                ]
              }
            },
            {
              nombre: 'Empaque',
              orden: 3,
              tiempoEstandarMin: 120,
              detalles: {
                create: [
                  { idInsumo: inBotella1L.id, cantidadRequerida: 1, unidad: 'Unidades', mermaPorcentaje: 1, tipoInsumo: 'EMPAQUE_BASE' }
                ]
              }
            }
          ]
        }
      }
    });

    // 2. Operación
    console.log('Insertando Compras...');
    const compra1 = await prisma.compra.create({
      data: {
        idProveedor: prov1.id, fechaCompra: new Date(), estado: 'RECIBIDA', total: 60000,
        detalles: { create: [{ idInsumo: inLeche.id, cantidad: 40, precioUnitario: 1500, subtotal: 60000 }] }
      }
    });

    console.log('Insertando Inventario...');
    await prisma.inventario.create({ data: { idInsumo: inLeche.id, cantidadActual: 40 } });
    await prisma.movimientoInventario.create({ data: { idInsumo: inLeche.id, tipoMovimiento: 'ENTRADA', cantidad: 40, motivo: 'COMPRA', operacionOrigen: compra1.id } });

    console.log('Insertando Producción...');
    const prod1 = await prisma.produccion.create({
      data: {
        fechaPlanificada: new Date(), fechaProduccion: new Date(), idProducto: prodFresa1L.id, cantidadPlanificada: 10, cantidadProducidaReal: 10, estado: 'COMPLETADA',
        detalles: { create: [{ idInsumo: inLeche.id, cantidadTeorica: 8, cantidadRealUtilizada: 8.1, unidad: 'Litros' }] }
      }
    });

    console.log('Insertando Lotes...');
    const lote1 = await prisma.lote.create({
      data: {
        tipoLote: 'PRODUCTO_TERMINADO', idProduccion: prod1.id, idProducto: prodFresa1L.id, fechaProduccion: new Date(), fechaVencimiento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), cantidadInicial: 10, cantidadDisponible: 10, unidad: 'Unidades', estado: 'DISPONIBLE'
      }
    });

    // 3. Comercial
    console.log('Insertando Clientes...');
    const cli1 = await prisma.cliente.create({ data: { nombre: 'Tienda La Esquina', tipoCliente: 'Tienda', canal: 'Minorista', diasCredito: 0, activo: true } });
    const cli2 = await prisma.cliente.create({ data: { nombre: 'Cafetería Central', tipoCliente: 'Cafetería', canal: 'Minorista', diasCredito: 15, activo: true } });
    const cli3 = await prisma.cliente.create({ data: { nombre: 'Supermercado El Sol', tipoCliente: 'Supermercado', canal: 'Mayorista', diasCredito: 30, activo: true } });
    const cli4 = await prisma.cliente.create({ data: { nombre: 'Juan Pérez', tipoCliente: 'Particular', canal: 'Directo', diasCredito: 0, activo: true } });
    const cli5 = await prisma.cliente.create({ data: { nombre: 'Colegio San Jorge', tipoCliente: 'Institucional', canal: 'Institucional', diasCredito: 30, activo: true } });
    const cli6 = await prisma.cliente.create({ data: { nombre: 'Gimnasio Fit', tipoCliente: 'Gimnasio', canal: 'Minorista', diasCredito: 15, activo: true } });

    console.log('Insertando Ventas...');
    const venta1 = await prisma.venta.create({
      data: {
        fechaVenta: new Date(), idCliente: cli1.id, canalVenta: 'Minorista', tipoPago: 'CONTADO', totalVenta: 14000, valorPagado: 14000, saldoPendiente: 0, estado: 'PAGADA',
        detalles: { create: [{ idProducto: prodFresa1L.id, idLote: lote1.id, cantidad: 2, precioUnitario: 7000, descuento: 0, totalLinea: 14000, costoUnitario: 4000, utilidadUnitaria: 3000, utilidadTotal: 6000 }] },
        pagos: { create: [{ fechaPago: new Date(), idCliente: cli1.id, valorPagado: 14000, metodoPago: 'EFECTIVO' }] }
      }
    });

    console.log('Insertando Gastos...');
    await prisma.gasto.create({ data: { fecha: new Date(), categoria: 'Servicios', descripcion: 'Recibo de luz', valor: 150000, tipoGasto: 'Fijo', periodo: 'Mensual' } });
    await prisma.gasto.create({ data: { fecha: new Date(), categoria: 'Nómina', descripcion: 'Pago operario', valor: 600000, tipoGasto: 'Fijo', periodo: 'Quincenal' } });

    console.log('Carga masiva completada exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos masivos:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
