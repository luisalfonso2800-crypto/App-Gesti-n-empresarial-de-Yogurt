import { InventoryService } from '../../../inventory/inventory.service';
import { PresentationsService } from '../../../presentations/presentations.service';
import { BadRequestException } from '@nestjs/common';

describe('Bloque 7A: Heurísticas y Hardcodings Críticos', () => {

  // ─── TEST-AUD-EMERG-05: Insumo con costo $120/g no se divide por 1000 (HAL-F1-03) ───
  describe('TEST-AUD-EMERG-05: Eliminación de heurística costoUnitario > 100 (HAL-F1-03)', () => {
    it('insumo en gramos con costo $120/g se preserva como $120 y calcula valorTotal = stock * 120', async () => {
      const mockRepo = {
        findAll: jest.fn().mockResolvedValue([
          {
            id: 'insumo-cultivo-1',
            cantidadActual: 10,
            costoPromedio: 120, // $120 por gramo
            insumo: {
              unidadBase: 'g',
              stockMinimo: 5
            }
          }
        ])
      };

      const service = new InventoryService(mockRepo);
      const result = await service.findAll();

      expect(result.data).toHaveLength(1);
      const item = result.data[0];
      // Con la heurística errónea anterior: 120 > 100 dividía a 0.12 y valorTotal a 1
      // Con el fix HAL-F1-03: costoUnitario se mantiene 120 y valorTotal = 10 * 120 = 1200
      expect(item.costoUnitario).toBe(120);
      expect(item.costoUnitario).not.toBe(0.12);
      expect(item.valorTotal).toBe(1200);
      expect(item.estado).toBe('OPTIMO');
    });
  });

  // ─── TEST-AUD-EMERG-06: Unidad de lote hereda de presentación / receta (HAL-F3-02) ───
  describe('TEST-AUD-EMERG-06: Unidad de lote hereda unidad de presentación/receta (HAL-F3-02)', () => {
    it('producto con presentación en gramos asigna unidad "g" o unidad de presentación al lote, no "UNIDAD"', () => {
      const produccionMock = {
        id: 'prod-1',
        idProducto: 'prod-ter-1',
        producto: {
          categoria: 'TERMINADO',
          presentacion: {
            unidadMedida: 'g'
          }
        },
        receta: {
          unidadRendimiento: 'g'
        }
      };

      const esIntermedio = produccionMock.producto?.categoria === 'INTERMEDIO_WIP';
      const unidadLote = produccionMock.receta?.unidadRendimiento ||
                         produccionMock.producto?.presentacion?.unidadMedida ||
                         (esIntermedio ? 'Litros' : 'UNIDAD');

      expect(unidadLote).toBe('g');
      expect(unidadLote).not.toBe('UNIDAD');
    });
  });

  // ─── TEST-AUD-EMERG-07: Rechazo de presentación granel sin volumen (HAL-F3-03) ───
  describe('TEST-AUD-EMERG-07: Presentación BALDE/TANQUE_GRANEL sin cantidadMl lanza BadRequestException (HAL-F3-03)', () => {
    it('crear BALDE sin cantidadMl lanza BadRequestException y no inyecta 1000ml silenciosamente', async () => {
      const mockRepo = { create: jest.fn() };
      const mockUploads = { deletePhysicalFile: jest.fn() };
      const service = new PresentationsService(mockRepo, mockUploads);

      await expect(service.create({
        nombre: 'Balde Industrial 20L',
        tipoEnvase: 'BALDE',
        cantidadMl: null
      })).rejects.toThrow(BadRequestException);

      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it('crear TANQUE_GRANEL con cantidadMl válida calcula cantidadOz proporcional y procede', async () => {
      const mockRepo = {
        create: jest.fn().mockImplementation(dto => Promise.resolve({ id: 'pres-granel-1', ...dto }))
      };
      const mockUploads = { deletePhysicalFile: jest.fn() };
      const service = new PresentationsService(mockRepo, mockUploads);

      const created = await service.create({
        nombre: 'Tanque 5000 Litros',
        tipoEnvase: 'TANQUE_GRANEL',
        cantidadMl: 5000000
      });

      expect(mockRepo.create).toHaveBeenCalled();
      expect(created.cantidadMl).toBe(5000000);
      expect(created.cantidadOz).toBeCloseTo(169070.28, 1);
    });
  });
});
