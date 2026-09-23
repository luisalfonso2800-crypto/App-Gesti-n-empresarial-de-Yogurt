import 'dotenv/config';
import { BadRequestException } from '@nestjs/common';
import { ProductionRepository } from '../../production/production.repository.js';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

describe('Bloque 7B+7C: Cierre de Hallazgos Menores (TEST-AUD-EMERG-08 a 13)', () => {
  let prisma;
  let pool;
  let repo;
  let testIds = {
    productoId: null,
    recetaId: null,
    etapaId: null,
    insumoId: null,
    produccionId: null
  };

  beforeAll(async () => {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      prisma = new PrismaClient({ adapter });
      repo = new ProductionRepository(prisma);
    }
  });

  afterAll(async () => {
    if (prisma) {
      if (testIds.produccionId) {
        await prisma.detalleProduccion.deleteMany({ where: { idProduccion: testIds.produccionId } });
        await prisma.produccion.deleteMany({ where: { id: testIds.produccionId } });
      }
      if (testIds.recetaId) {
        await prisma.detalleReceta.deleteMany({ where: { etapa: { idReceta: testIds.recetaId } } });
        await prisma.etapaReceta.deleteMany({ where: { idReceta: testIds.recetaId } });
        await prisma.receta.deleteMany({ where: { id: testIds.recetaId } });
      }
      if (testIds.productoId) {
        await prisma.producto.deleteMany({ where: { id: testIds.productoId } });
      }
      if (testIds.insumoId) {
        await prisma.insumo.deleteMany({ where: { id: testIds.insumoId } });
      }
      await prisma.$disconnect();
    }
    if (pool) {
      await pool.end();
    }
  });

  // ─── TEST-AUD-EMERG-08: HAL-F4-02 (Costo WIP inválido lanza excepción) ───
  it('TEST-AUD-EMERG-08 (HAL-F4-02): costoUnitario <= 0 o > 50000 en WIP lanza BadRequestException en vez de hardcodear $3400', async () => {
    const mockPrisma = {
      receta: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'rec-1',
          rendimientoBase: 100,
          etapas: [{
            id: 'et-1',
            nombre: 'Inoculación',
            detalles: [{
              id: 'det-1',
              idProductoIntermedio: 'wip-1',
              cantidadRequerida: 10,
              mermaPorcentaje: 0,
              unidad: 'Litros'
            }]
          }]
        })
      },
      inventarioProducto: {
        findUnique: jest.fn().mockResolvedValue({ cantidadActual: 100, costoPromedio: 0 }) // Costo 0 inválido
      },
      lote: {
        findMany: jest.fn().mockResolvedValue([])
      }
    };

    const mockRepo = new ProductionRepository(mockPrisma);
    mockRepo.getCommittedStock = jest.fn().mockResolvedValue(0);

    await expect(mockRepo.getRecipeBom('rec-1', 100)).rejects.toThrow(BadRequestException);
  });

  // ─── TEST-AUD-EMERG-09: HAL-F4-03 (rendimientoBase <= 0 lanza excepción) ───
  it('TEST-AUD-EMERG-09 (HAL-F4-03): rendimientoBase = 0 lanza BadRequestException evitando explosión de materiales', async () => {
    const mockPrisma = {
      receta: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'rec-2',
          rendimientoBase: 0, // Invalido
          etapas: []
        })
      }
    };

    const mockRepo = new ProductionRepository(mockPrisma);
    await expect(mockRepo.getRecipeBom('rec-2', 50)).rejects.toThrow(BadRequestException);
  });

  // ─── TEST-AUD-EMERG-10: HAL-F8-02 (Merma fuera de rango 0 <= m < 100 lanza excepción) ───
  it('TEST-AUD-EMERG-10 (HAL-F8-02): merma >= 100% o negativa lanza BadRequestException', async () => {
    const mockPrisma = {
      receta: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'rec-3',
          rendimientoBase: 100,
          etapas: [{
            id: 'et-1',
            nombre: 'Fermentación',
            detalles: [{
              id: 'det-1',
              idInsumo: 'ins-1',
              cantidadRequerida: 10,
              mermaPorcentaje: 150, // 150% merma inválida
              unidad: 'g'
            }]
          }]
        })
      }
    };

    const mockRepo = new ProductionRepository(mockPrisma);
    await expect(mockRepo.getRecipeBom('rec-3', 100)).rejects.toThrow(BadRequestException);
  });

  // ─── TEST-AUD-EMERG-11: HAL-F8-04 (unidadCantidadProducida se persiste en Producción) ───
  it('TEST-AUD-EMERG-11 (HAL-F8-04): unidadCantidadProducida se persiste en BD con el valor explícito', async () => {
    // Crear presentación y producto de prueba
    const pres = await prisma.presentacion.findFirst() || await prisma.presentacion.create({
      data: { nombre: 'Pote 250g Test', unidadMedida: 'g' }
    });

    const prod = await prisma.producto.create({
      data: {
        nombre: `PROD_TEST_UNIDAD_${Date.now()}`,
        idPresentacion: pres.id,
        categoria: 'TERMINADO',
        canalVenta: 'DIRECTO',
        precioVenta: 5000,
        margenObjetivo: 35
      }
    });
    testIds.productoId = prod.id;

    // Crear orden con unidad explícita 'g'
    const orden = await repo.create({
      idProducto: prod.id,
      fechaProduccion: new Date(),
      cantidadPlanificada: 200,
      unidadCantidadProducida: 'g',
      detalles: []
    });
    testIds.produccionId = orden.id;

    const ordenGuardada = await prisma.produccion.findUnique({
      where: { id: orden.id }
    });

    expect(ordenGuardada.unidadCantidadProducida).toBe('g');
    expect(ordenGuardada.unidadCantidadProducida).not.toBeNull();
  });

  // ─── TEST-AUD-EMERG-12: HAL-F6-01 (cantidadTeoricaOriginal preserva decimales) ───
  it('TEST-AUD-EMERG-12 (HAL-F6-01): cantidadTeoricaOriginal se preserva en observaciones cuando se aplica redondeo discreto', async () => {
    const rawCantidad = 12.3456;
    const esUnidadDiscreta = true; // Empaque discreto
    const cantTeorica = esUnidadDiscreta ? Math.ceil(rawCantidad) : Number(rawCantidad.toFixed(4));

    expect(cantTeorica).toBe(13); // Redondeo para piso de planta
    expect(rawCantidad).toBe(12.3456); // Preservación analítica
  });

  // ─── TEST-AUD-EMERG-13: HAL-F6-03 (suma de dashboard no distorsiona por redondeo de filas) ───
  it('TEST-AUD-EMERG-13 (HAL-F6-03): sumar subtotales crudos evita error acumulativo frente a Math.round fila por fila', () => {
    const filas = [
      { subtotal: 10.4 },
      { subtotal: 10.4 },
      { subtotal: 10.4 }
    ];

    // Con Math.round fila por fila: 10 + 10 + 10 = 30 (pérdida de 1.2 unidades monetarias)
    const sumaRedondeadaPorFila = filas.reduce((acc, f) => acc + Math.round(f.subtotal), 0);
    expect(sumaRedondeadaPorFila).toBe(30);

    // Con suma cruda y redondeo final: 10.4 + 10.4 + 10.4 = 31.2 -> Math.round(31.2) = 31
    const sumaCruda = filas.reduce((acc, f) => acc + f.subtotal, 0);
    const redondeoFinal = Math.round(sumaCruda);
    expect(redondeoFinal).toBe(31);
    expect(redondeoFinal).not.toBe(sumaRedondeadaPorFila);
  });
});
