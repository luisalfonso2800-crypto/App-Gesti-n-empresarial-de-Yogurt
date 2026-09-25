const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/manna_db';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const COMMERCIAL_PRODUCTS = [
  'CREMA DE FRESAS CON CREMA 250G',
  'KUMIS NATURAL 1L',
  'POSTRE LÁCTEO DE FRUTOS ROJOS 200G',
  'YOGUR DE FRUTOS ROJOS 1L',
  'YOGUR GRIEGO NATURAL 500G',
  'YOGUR NATURAL 1L'
];

async function main() {
  console.log('[seed-recipes-e2e] Iniciando siembra directa vía Prisma Client...');

  // 1. Obtener insumo de empaque primario (botella, vaso o tapa)
  const allSupplies = await prisma.insumo.findMany({ where: { activo: true } });
  const packagingSupply = allSupplies.find(s => {
    const text = `${s.nombre || ''} ${s.categoria || ''} ${s.subcategoria || ''}`.toUpperCase();
    return text.includes('BOTELLA') || text.includes('VASO') || text.includes('EMPAQUE') || text.includes('ENVASE');
  }) || allSupplies[0];

  if (!packagingSupply) {
    throw new Error('No se encontró ningún insumo de empaque en la base de datos.');
  }

  // 2. Obtener bases intermedias (WIP)
  const allProducts = await prisma.producto.findMany({ where: { activo: true } });
  const wipBases = allProducts.filter(p => {
    const text = `${p.nombre || ''} ${p.categoria || ''}`.toUpperCase();
    return text.includes('BASE') || text.includes('WIP') || text.includes('JALEA') || text.includes('CREMA');
  });

  const defaultBase = wipBases[0] || allProducts[0];
  const results = {};

  for (const prodName of COMMERCIAL_PRODUCTS) {
    const producto = allProducts.find(p => p.nombre.toUpperCase() === prodName.toUpperCase());
    if (!producto) {
      console.warn(`[seed-recipes-e2e] Producto comercial "${prodName}" no encontrado en catálogo.`);
      continue;
    }

    // Verificar si ya cuenta con receta
    let existingRecipe = await prisma.receta.findFirst({
      where: { idProducto: producto.id, activo: true }
    });

    if (existingRecipe) {
      console.log(`[seed-recipes-e2e] Receta ya existe para "${prodName}" (ID: ${existingRecipe.id}). Reutilizando.`);
      results[prodName] = { id: existingRecipe.id, status: 'REUSED' };
      continue;
    }

    // Seleccionar base WIP afín
    let matchedBase = defaultBase;
    if (prodName.includes('GRIEGO')) {
      matchedBase = wipBases.find(b => b.nombre.toUpperCase().includes('GRIEGO')) || defaultBase;
    } else if (prodName.includes('KUMIS')) {
      matchedBase = wipBases.find(b => b.nombre.toUpperCase().includes('NATURAL')) || defaultBase;
    } else if (prodName.includes('FRUTOS ROJOS')) {
      matchedBase = wipBases.find(b => b.nombre.toUpperCase().includes('JALEA') || b.nombre.toUpperCase().includes('BASE')) || defaultBase;
    }

    // Crear receta cumpliendo las reglas Poka-Yoke
    const newRecipe = await prisma.receta.create({
      data: {
        idProducto: producto.id,
        nombre: `Fórmula - ${producto.nombre}`,
        rendimientoBase: 10,
        unidadRendimiento: 'Unidades',
        activo: true,
        etapas: {
          create: [
            {
              nombre: 'Envasado y Acondicionamiento Comercial',
              orden: 1,
              tiempoMinimoMin: 15,
              tiempoEstandarMin: 20,
              tiempoMaximoMin: 30,
              tempMinimaGrados: 4,
              tempMaximaGrados: 8,
              instrucciones: 'Dosificación, envasado en recipiente final y sellado hermético.',
              activo: true,
              detalles: {
                create: [
                  {
                    idProductoIntermedio: matchedBase.id,
                    idInsumo: null,
                    cantidadRequerida: 8.5,
                    unidad: 'L',
                    mermaPorcentaje: 2,
                    tipoInsumo: 'INTERMEDIO_WIP',
                    activo: true
                  },
                  {
                    idInsumo: packagingSupply.id,
                    idProductoIntermedio: null,
                    cantidadRequerida: 10,
                    unidad: 'und',
                    mermaPorcentaje: 1,
                    tipoInsumo: 'EMPAQUE_BASE',
                    activo: true
                  }
                ]
              }
            }
          ]
        }
      }
    });

    console.log(`[seed-recipes-e2e] Receta creada con éxito para "${prodName}" (ID: ${newRecipe.id}).`);
    results[prodName] = { id: newRecipe.id, status: 'CREATED' };
  }

  // Persistir en .test-data
  const dataDir = path.join(__dirname, '..', '..', 'web', 'e2e', '.test-data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const outputPath = path.join(dataDir, 'chain-recipes.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`[seed-recipes-e2e] Trazabilidad guardada en: ${outputPath}`);
}

main()
  .catch(err => {
    console.error('[seed-recipes-e2e] Error en siembra directa:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
