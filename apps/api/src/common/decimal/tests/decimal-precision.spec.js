import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { Decimal, toDecimal } from '../decimal-utils.js';

describe('HAL-F10-03: Escala Decimal(14, 4) en Costos Unitarios (TEST-AUD-EMERG-04)', () => {
  let prisma;
  let pool;
  let testInsumoId = null;

  beforeAll(() => {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      prisma = new PrismaClient({ adapter });
    }
  });

  afterAll(async () => {
    if (prisma) {
      if (testInsumoId) {
        await prisma.insumo.deleteMany({ where: { id: testInsumoId } });
      }
      await prisma.$disconnect();
    }
    if (pool) {
      await pool.end();
    }
  });

  it('TEST-AUD-EMERG-04: persiste y recupera costoBase con 4 decimales exactos (18.4523) sin truncar', async () => {
    // 1. Crear insumo de prueba con micro-costo de 4 decimales
    const microCosto = 18.4523;
    const insumo = await prisma.insumo.create({
      data: {
        nombre: `TEST_MICRO_INGREDIENTE_${Date.now()}`,
        categoria: 'CULTIVOS',
        subcategoria: 'PROBIOTICOS',
        marca: 'BIO-TEST',
        unidadBase: 'g',
        stockMinimo: 10,
        costoBase: microCosto,
        densidad: 1.0
      }
    });
    testInsumoId = insumo.id;

    // 2. Leer desde la base de datos
    const insumoLeido = await prisma.insumo.findUnique({
      where: { id: testInsumoId }
    });

    expect(insumoLeido).toBeDefined();
    // 3. Validar que la precisión de 4 decimales se mantiene intacta en BD
    expect(Number(insumoLeido.costoBase)).toBe(18.4523);
    expect(insumoLeido.costoBase.toString()).toBe('18.4523');
    // Verificar que NO fue truncado a 2 decimales (18.45)
    expect(insumoLeido.costoBase.toString()).not.toBe('18.45');
  });
});
