import { Test } from '@nestjs/testing';
import { GoalsRepository } from '../goals.repository';
import { PrismaService } from '../../database/prisma.service';

describe('GoalsRepository & Production Aggregation (Bloque 2 Remediación)', () => {
  let goalsRepository;
  let mockPrismaService;

  beforeEach(async () => {
    mockPrismaService = {
      produccion: {
        aggregate: jest.fn(async ({ _sum }) => {
          // Validar que se consulta cantidadProducidaReal y no el campo inexistente cantidadProducida
          if (_sum && _sum.cantidadProducidaReal) {
            return {
              _sum: {
                cantidadProducidaReal: 1250.5
              }
            };
          }
          if (_sum && _sum.cantidadProducida) {
            throw new Error("Unknown field 'cantidadProducida' for select statement on model 'Produccion'");
          }
          return { _sum: {} };
        })
      }
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        GoalsRepository,
        { provide: PrismaService, useValue: mockPrismaService }
      ]
    }).compile();

    goalsRepository = moduleRef.get(GoalsRepository);
  });

  describe('TEST-AUD-12: Prevención de excepción runtime en metas de producción (HAL-F9-01)', () => {
    it('debe consultar con éxito la suma de litros usando cantidadProducidaReal sin lanzar error 500', async () => {
      const fechaInicio = new Date('2026-01-01');
      const fechaFin = new Date('2026-12-31');

      const sumLitros = await goalsRepository.getSumProduccionLts(fechaInicio, fechaFin);

      expect(mockPrismaService.produccion.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          _sum: { cantidadProducidaReal: true }
        })
      );
      expect(sumLitros).toBe(1250.5);
    });
  });
});
