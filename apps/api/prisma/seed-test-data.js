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
    const presVaso35 = await prisma.presentacion.create({ data: { nombre: 'Vaso 3.5 oz', cantidadOz: 3.5, cantidadMl: 105, tipoEnvase: 'Plástico', activo: true } });
    const pres500g = await prisma.presentacion.create({ data: { nombre: 'Vaso 500g', cantidadOz: 16.9, cantidadMl: 500, tipoEnvase: 'Plástico', activo: true } });
    const pres1L = await prisma.presentacion.create({ data: { nombre: '1 Litro', cantidadOz: 33.8, cantidadMl: 1000, tipoEnvase: 'Plástico', activo: true } });

    console.log('Insertando Insumos...');
    const inLeche = await prisma.insumo.create({ data: { nombre: 'Leche cruda', categoria: 'Materia Prima', subcategoria: 'Lácteos', marca: 'Local', unidadBase: 'Litros', stockMinimo: 100, activo: true } });
    const inCultivo = await prisma.insumo.create({ data: { nombre: 'Cultivo láctico', categoria: 'Materia Prima', subcategoria: 'Aditivos', marca: 'Danisco', unidadBase: 'Gramos', stockMinimo: 500, activo: true } });
    const inAzucar = await prisma.insumo.create({ data: { nombre: 'Azúcar', categoria: 'Materia Prima', subcategoria: 'Endulzantes', marca: 'Manuelita', unidadBase: 'Kilogramos', stockMinimo: 50, activo: true } });
    const inEstabilizante = await prisma.insumo.create({ data: { nombre: 'Estabilizante', categoria: 'Materia Prima', subcategoria: 'Aditivos', marca: 'Genérico', unidadBase: 'Gramos', stockMinimo: 1000, activo: true } });
    
    // Frutas y Complementos
    const inFresa = await prisma.insumo.create({ data: { nombre: 'Pulpa de Fresa', categoria: 'Materia Prima', subcategoria: 'Frutas', marca: 'Fruver', unidadBase: 'Kilogramos', stockMinimo: 20, activo: true } });
    const inMora = await prisma.insumo.create({ data: { nombre: 'Pulpa de Mora', categoria: 'Materia Prima', subcategoria: 'Frutas', marca: 'Fruver', unidadBase: 'Kilogramos', stockMinimo: 20, activo: true } });
    const inChocoRice = await prisma.insumo.create({ data: { nombre: 'Cereal Choco Rice', categoria: 'Materia Prima', subcategoria: 'Cereales', marca: 'Kelloggs', unidadBase: 'Gramos', stockMinimo: 2000, activo: true } });
    const inMaizCrispy = await prisma.insumo.create({ data: { nombre: 'Cereal Maíz Crispy', categoria: 'Materia Prima', subcategoria: 'Cereales', marca: 'Kelloggs', unidadBase: 'Gramos', stockMinimo: 2000, activo: true } });
    const inJaleaFrutos = await prisma.insumo.create({ data: { nombre: 'Jalea de Frutos Rojos', categoria: 'Materia Prima', subcategoria: 'Salsas', marca: 'Dulcinea', unidadBase: 'Kilogramos', stockMinimo: 10, activo: true } });

    // Empaques
    const inVaso35 = await prisma.insumo.create({ data: { nombre: 'Vaso 3.5 oz', categoria: 'Empaque', subcategoria: 'Envases', marca: 'Plásticos SA', unidadBase: 'Unidades', stockMinimo: 1000, activo: true } });
    const inCupula2oz = await prisma.insumo.create({ data: { nombre: 'Cono/Cúpula 2 oz', categoria: 'Empaque', subcategoria: 'Envases', marca: 'Plásticos SA', unidadBase: 'Unidades', stockMinimo: 1000, activo: true } });
    const inTapaPlastica = await prisma.insumo.create({ data: { nombre: 'Tapa Plástica', categoria: 'Empaque', subcategoria: 'Tapas', marca: 'Plásticos SA', unidadBase: 'Unidades', stockMinimo: 1000, activo: true } });
    const inCucharaPeque = await prisma.insumo.create({ data: { nombre: 'Cuchara Pequeña', categoria: 'Empaque', subcategoria: 'Utensilios', marca: 'Plásticos SA', unidadBase: 'Unidades', stockMinimo: 1000, activo: true } });
    const inEtiquetaEscolar = await prisma.insumo.create({ data: { nombre: 'Etiqueta Escolar', categoria: 'Empaque', subcategoria: 'Etiquetas', marca: 'Impresos SA', unidadBase: 'Unidades', stockMinimo: 1000, activo: true } });
    const inCintaSeguridad = await prisma.insumo.create({ data: { nombre: 'Cinta de Seguridad', categoria: 'Empaque', subcategoria: 'Tapas', marca: 'Plásticos SA', unidadBase: 'Unidades', stockMinimo: 1000, activo: true } });
    const inBotella1L = await prisma.insumo.create({ data: { nombre: 'Botella 1L', categoria: 'Empaque', subcategoria: 'Envases', marca: 'Plásticos SA', unidadBase: 'Unidades', stockMinimo: 500, activo: true } });
    const inTapaBotella = await prisma.insumo.create({ data: { nombre: 'Tapa Botella', categoria: 'Empaque', subcategoria: 'Tapas', marca: 'Plásticos SA', unidadBase: 'Unidades', stockMinimo: 500, activo: true } });
    const inEtiqueta1L = await prisma.insumo.create({ data: { nombre: 'Etiqueta 1L', categoria: 'Empaque', subcategoria: 'Etiquetas', marca: 'Impresos SA', unidadBase: 'Unidades', stockMinimo: 500, activo: true } });

    console.log('Insertando Proveedores...');
    const provLacteos = await prisma.proveedor.create({ data: { nombre: 'Lácteos El Campo', nitCedula: '900123456-1', telefono: '3001234567', email: 'ventas@elcampo.com', direccion: 'Finca El Campo', activo: true } });
    const provFruver = await prisma.proveedor.create({ data: { nombre: 'Distribuidora Fruver', nitCedula: '900234567-2', telefono: '3002345678', email: 'ventas@fruver.com', direccion: 'Calle 10 # 20-30', activo: true } });
    const provEmpaques = await prisma.proveedor.create({ data: { nombre: 'Plásticos y Empaques', nitCedula: '900345678-3', telefono: '3003456789', email: 'contacto@plasticos.com', direccion: 'Av 15 # 40-50', activo: true } });
    const provInsumos = await prisma.proveedor.create({ data: { nombre: 'Insumos Alimenticios', nitCedula: '900456789-4', telefono: '3004567890', email: 'info@insumos.com', direccion: 'Cra 50 # 10-20', activo: true } });

    console.log('Insertando Precios Proveedor...');
    await prisma.precioProveedor.create({ data: { idInsumo: inLeche.id, idProveedor: provLacteos.id, presentacionCompra: 'Cantina 40L', cantidadPresentacion: 40, unidadPresentacion: 'Litros', cantidadEquivalenteBase: 40, precioCompra: 60000, costoUnidadBase: 1500 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inCultivo.id, idProveedor: provInsumos.id, presentacionCompra: 'Sobre 500g', cantidadPresentacion: 500, unidadPresentacion: 'Gramos', cantidadEquivalenteBase: 500, precioCompra: 50000, costoUnidadBase: 100 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inAzucar.id, idProveedor: provInsumos.id, presentacionCompra: 'Bulto 50Kg', cantidadPresentacion: 50, unidadPresentacion: 'Kilogramos', cantidadEquivalenteBase: 50, precioCompra: 150000, costoUnidadBase: 3000 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inEstabilizante.id, idProveedor: provInsumos.id, presentacionCompra: 'Bolsa 1Kg', cantidadPresentacion: 1, unidadPresentacion: 'Kilogramos', cantidadEquivalenteBase: 1000, precioCompra: 20000, costoUnidadBase: 20 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inFresa.id, idProveedor: provFruver.id, presentacionCompra: 'Caneca 20Kg', cantidadPresentacion: 20, unidadPresentacion: 'Kilogramos', cantidadEquivalenteBase: 20, precioCompra: 100000, costoUnidadBase: 5000 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inChocoRice.id, idProveedor: provInsumos.id, presentacionCompra: 'Caja 5Kg', cantidadPresentacion: 5, unidadPresentacion: 'Kilogramos', cantidadEquivalenteBase: 5000, precioCompra: 40000, costoUnidadBase: 8 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inMaizCrispy.id, idProveedor: provInsumos.id, presentacionCompra: 'Caja 5Kg', cantidadPresentacion: 5, unidadPresentacion: 'Kilogramos', cantidadEquivalenteBase: 5000, precioCompra: 35000, costoUnidadBase: 7 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inJaleaFrutos.id, idProveedor: provFruver.id, presentacionCompra: 'Balde 10Kg', cantidadPresentacion: 10, unidadPresentacion: 'Kilogramos', cantidadEquivalenteBase: 10, precioCompra: 80000, costoUnidadBase: 8000 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inVaso35.id, idProveedor: provEmpaques.id, presentacionCompra: 'Paca x1000', cantidadPresentacion: 1000, unidadPresentacion: 'Unidades', cantidadEquivalenteBase: 1000, precioCompra: 50000, costoUnidadBase: 50 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inCupula2oz.id, idProveedor: provEmpaques.id, presentacionCompra: 'Paca x1000', cantidadPresentacion: 1000, unidadPresentacion: 'Unidades', cantidadEquivalenteBase: 1000, precioCompra: 40000, costoUnidadBase: 40 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inTapaPlastica.id, idProveedor: provEmpaques.id, presentacionCompra: 'Paca x1000', cantidadPresentacion: 1000, unidadPresentacion: 'Unidades', cantidadEquivalenteBase: 1000, precioCompra: 20000, costoUnidadBase: 20 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inCucharaPeque.id, idProveedor: provEmpaques.id, presentacionCompra: 'Caja x5000', cantidadPresentacion: 5000, unidadPresentacion: 'Unidades', cantidadEquivalenteBase: 5000, precioCompra: 50000, costoUnidadBase: 10 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inEtiquetaEscolar.id, idProveedor: provEmpaques.id, presentacionCompra: 'Rollo x5000', cantidadPresentacion: 5000, unidadPresentacion: 'Unidades', cantidadEquivalenteBase: 5000, precioCompra: 75000, costoUnidadBase: 15 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inCintaSeguridad.id, idProveedor: provEmpaques.id, presentacionCompra: 'Rollo x1000', cantidadPresentacion: 1000, unidadPresentacion: 'Unidades', cantidadEquivalenteBase: 1000, precioCompra: 15000, costoUnidadBase: 15 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inBotella1L.id, idProveedor: provEmpaques.id, presentacionCompra: 'Paca x100', cantidadPresentacion: 100, unidadPresentacion: 'Unidades', cantidadEquivalenteBase: 100, precioCompra: 30000, costoUnidadBase: 300 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inTapaBotella.id, idProveedor: provEmpaques.id, presentacionCompra: 'Paca x1000', cantidadPresentacion: 1000, unidadPresentacion: 'Unidades', cantidadEquivalenteBase: 1000, precioCompra: 50000, costoUnidadBase: 50 } });
    await prisma.precioProveedor.create({ data: { idInsumo: inEtiqueta1L.id, idProveedor: provEmpaques.id, presentacionCompra: 'Rollo x2000', cantidadPresentacion: 2000, unidadPresentacion: 'Unidades', cantidadEquivalenteBase: 2000, precioCompra: 80000, costoUnidadBase: 40 } });

    console.log('Insertando Productos...');
    const prodEscolar = await prisma.producto.create({ data: { nombre: 'Yogur Escolar 3.5 oz', idPresentacion: presVaso35.id, categoria: 'Yogurt Escolar', canalVenta: 'Institucional', precioVenta: 1000, margenObjetivo: 20, activo: true } });
    const prodTradFresa1L = await prisma.producto.create({ data: { nombre: 'Yogur Tradicional Fresa 1L', idPresentacion: pres1L.id, categoria: 'Yogurt', canalVenta: 'Mayorista', precioVenta: 7000, margenObjetivo: 30, activo: true } });
    const prodGriego500 = await prisma.producto.create({ data: { nombre: 'Yogur Griego Natural 500g', idPresentacion: pres500g.id, categoria: 'Yogurt Griego', canalVenta: 'Minorista', precioVenta: 6000, margenObjetivo: 40, activo: true } });

    console.log('Insertando Recetas V2...');
    // Receta A: Fórmula Yogur Escolar 3.5 oz Multivariante
    await prisma.receta.create({
      data: {
        idProducto: prodEscolar.id,
        nombre: 'Fórmula Yogur Escolar 3.5 oz Multivariante',
        rendimientoBase: 100,
        unidadRendimiento: 'Unidades',
        activo: true,
        etapas: {
          create: [
            {
              nombre: 'Preparación de Base Blanca',
              orden: 1,
              tiempoEstandarMin: 45,
              tempMinimaGrados: 43,
              tempMaximaGrados: 85,
              detalles: {
                create: [
                  { idInsumo: inLeche.id, cantidadRequerida: 12, unidad: 'Litros', tipoInsumo: 'BASE', mermaPorcentaje: 0 },
                  { idInsumo: inCultivo.id, cantidadRequerida: 30, unidad: 'Gramos', tipoInsumo: 'BASE', mermaPorcentaje: 0 },
                  { idInsumo: inAzucar.id, cantidadRequerida: 1.2, unidad: 'Kilogramos', tipoInsumo: 'BASE', mermaPorcentaje: 0 }
                ]
              }
            },
            {
              nombre: 'Fermentación Controlada',
              orden: 2,
              tiempoMinimoMin: 480,
              tiempoEstandarMin: 540,
              tiempoMaximoMin: 600,
              tempMinimaGrados: 42,
              tempMaximaGrados: 44
            },
            {
              nombre: 'Refrigeración y Estabilización',
              orden: 3,
              tiempoEstandarMin: 180,
              tempMinimaGrados: 4,
              tempMaximaGrados: 4
            },
            {
              nombre: 'Dosificación de Complementos',
              orden: 4,
              tiempoEstandarMin: 30,
              detalles: {
                create: [
                  { idInsumo: inChocoRice.id, cantidadRequerida: 1500, unidad: 'Gramos', tipoInsumo: 'COMPLEMENTO', esOpcional: true, grupoVariante: 'CEREAL', mermaPorcentaje: 0 },
                  { idInsumo: inMaizCrispy.id, cantidadRequerida: 1500, unidad: 'Gramos', tipoInsumo: 'COMPLEMENTO', esOpcional: true, grupoVariante: 'CEREAL', mermaPorcentaje: 0 },
                  { idInsumo: inJaleaFrutos.id, cantidadRequerida: 1000, unidad: 'Kilogramos', tipoInsumo: 'COMPLEMENTO', esOpcional: true, grupoVariante: 'JALEA', mermaPorcentaje: 0 }
                ]
              }
            },
            {
              nombre: 'Envasado, Sellado y Empaque',
              orden: 5,
              tiempoEstandarMin: 60,
              detalles: {
                create: [
                  { idInsumo: inVaso35.id, cantidadRequerida: 100, unidad: 'Unidades', tipoInsumo: 'EMPAQUE_BASE', mermaPorcentaje: 2 },
                  { idInsumo: inTapaPlastica.id, cantidadRequerida: 100, unidad: 'Unidades', tipoInsumo: 'EMPAQUE_BASE', mermaPorcentaje: 2 },
                  { idInsumo: inEtiquetaEscolar.id, cantidadRequerida: 100, unidad: 'Unidades', tipoInsumo: 'EMPAQUE_BASE', mermaPorcentaje: 1 },
                  { idInsumo: inCintaSeguridad.id, cantidadRequerida: 100, unidad: 'Unidades', tipoInsumo: 'EMPAQUE_BASE', mermaPorcentaje: 0 },
                  { idInsumo: inCupula2oz.id, cantidadRequerida: 100, unidad: 'Unidades', tipoInsumo: 'EMPAQUE_COMPLEMENTO', esOpcional: true, grupoVariante: 'CEREAL', mermaPorcentaje: 0 },
                  { idInsumo: inCucharaPeque.id, cantidadRequerida: 100, unidad: 'Unidades', tipoInsumo: 'EMPAQUE_COMPLEMENTO', esOpcional: true, grupoVariante: 'CEREAL', mermaPorcentaje: 0 }
                ]
              }
            }
          ]
        }
      }
    });

    // Receta B: Fórmula Yogur Batido Fresa 1L
    await prisma.receta.create({
      data: {
        idProducto: prodTradFresa1L.id,
        nombre: 'Fórmula Yogur Batido Fresa 1L',
        rendimientoBase: 50,
        unidadRendimiento: 'Unidades',
        activo: true,
        etapas: {
          create: [
            {
              nombre: 'Pasteurización e Inoculación',
              orden: 1,
              tiempoEstandarMin: 60,
              detalles: {
                create: [
                  { idInsumo: inLeche.id, cantidadRequerida: 48, unidad: 'Litros', tipoInsumo: 'BASE', mermaPorcentaje: 0 },
                  { idInsumo: inCultivo.id, cantidadRequerida: 100, unidad: 'Gramos', tipoInsumo: 'BASE', mermaPorcentaje: 0 },
                  { idInsumo: inAzucar.id, cantidadRequerida: 4, unidad: 'Kilogramos', tipoInsumo: 'BASE', mermaPorcentaje: 0 }
                ]
              }
            },
            {
              nombre: 'Incubación',
              orden: 2,
              tiempoEstandarMin: 500,
              tempMinimaGrados: 43,
              tempMaximaGrados: 43
            },
            {
              nombre: 'Saborización y Enfriamiento',
              orden: 3,
              tiempoEstandarMin: 40,
              detalles: {
                create: [
                  { idInsumo: inFresa.id, cantidadRequerida: 5, unidad: 'Kilogramos', tipoInsumo: 'BASE', mermaPorcentaje: 1 },
                  { idInsumo: inEstabilizante.id, cantidadRequerida: 200, unidad: 'Gramos', tipoInsumo: 'BASE', mermaPorcentaje: 0 }
                ]
              }
            },
            {
              nombre: 'Embotellado y Etiquetado',
              orden: 4,
              tiempoEstandarMin: 45,
              detalles: {
                create: [
                  { idInsumo: inBotella1L.id, cantidadRequerida: 50, unidad: 'Unidades', tipoInsumo: 'EMPAQUE_BASE', mermaPorcentaje: 1 },
                  { idInsumo: inTapaBotella.id, cantidadRequerida: 50, unidad: 'Unidades', tipoInsumo: 'EMPAQUE_BASE', mermaPorcentaje: 1 },
                  { idInsumo: inEtiqueta1L.id, cantidadRequerida: 50, unidad: 'Unidades', tipoInsumo: 'EMPAQUE_BASE', mermaPorcentaje: 2 }
                ]
              }
            }
          ]
        }
      }
    });

    console.log('Carga masiva completada exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos masivos:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
