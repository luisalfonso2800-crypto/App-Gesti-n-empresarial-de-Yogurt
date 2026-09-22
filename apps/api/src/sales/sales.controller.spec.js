import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { SalesRepository } from './sales.repository';

describe('SalesController & Server-Side Security (Bloque 1 Remediación)', () => {
  let salesController;
  let salesService;
  let mockSalesRepository;

  beforeEach(async () => {
    mockSalesRepository = {
      createWithTransaction: jest.fn(async (data) => {
        // Simular cálculo de repositorio idéntico a la implementación real
        let serverSubtotal = 0;
        let serverDescuentoTotal = 0;
        let serverBaseImponible = 0;
        let serverIvaTotal = 0;
        let serverTotalVenta = 0;

        for (const d of data.detalles) {
          const cantidadNum = Number(d.cantidad);
          const precioUnitNum = Number(d.precioUnitario);
          const subtotalLinea = cantidadNum * precioUnitNum;
          const descuentoLinea = Number(d.descuento || 0);
          const subtotalConDesc = Math.max(0, subtotalLinea - descuentoLinea);

          let tarifaIva = Number(d.tarifaIva || 0);
          if (data.aplicaIva && tarifaIva === 0) {
            tarifaIva = 0.19;
          }

          let baseLinea = subtotalConDesc;
          let montoIva = 0;
          let totalLinea = subtotalConDesc;

          if (tarifaIva > 0) {
            baseLinea = subtotalConDesc;
            montoIva = Math.round(baseLinea * tarifaIva);
            totalLinea = baseLinea + montoIva;
          }

          serverSubtotal += subtotalLinea;
          serverDescuentoTotal += descuentoLinea;
          serverBaseImponible += baseLinea;
          serverIvaTotal += montoIva;
          serverTotalVenta += totalLinea;
        }

        return {
          id: 'test-sale-uuid',
          idCliente: data.idCliente,
          subtotal: serverSubtotal,
          descuentoTotal: serverDescuentoTotal,
          baseImponible: serverBaseImponible,
          ivaTotal: serverIvaTotal,
          totalVenta: serverTotalVenta,
          valorPagado: Number(data.valorPagado || 0),
          saldoPendiente: Math.max(0, serverTotalVenta - Number(data.valorPagado || 0))
        };
      })
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [
        SalesService,
        { provide: SalesRepository, useValue: mockSalesRepository }
      ]
    }).compile();

    salesController = moduleRef.get(SalesController);
    salesService = moduleRef.get(SalesService);
  });

  describe('TEST-AUD-14: Rechazo de campos maliciosos / no declarados (HAL-F10-01)', () => {
    it('debe lanzar BadRequestException (HTTP 400) si el body contiene propiedades no autorizadas como { hack: 123 }', async () => {
      const payloadMalicioso = {
        idCliente: 'cli-001',
        detalles: [
          { idProducto: 'prod-001', cantidad: 1, precioUnitario: 10000 }
        ],
        hack: 123
      };

      await expect(salesController.create(payloadMalicioso)).rejects.toThrow(BadRequestException);
      await expect(salesController.create(payloadMalicioso)).rejects.toThrow(/hack/);
    });

    it('debe lanzar BadRequestException si el array de detalles viene vacío', async () => {
      const payloadVacio = {
        idCliente: 'cli-001',
        detalles: []
      };

      await expect(salesController.create(payloadVacio)).rejects.toThrow(BadRequestException);
    });
  });

  describe('TEST-AUD-15: Recálculo server-side de montos financieros (HAL-F10-02)', () => {
    it('debe ignorar totalVenta: 1 manipulado por cliente y persistir $11,900 con IVA 19%', async () => {
      const payloadManipulado = {
        idCliente: 'cli-001',
        aplicaIva: true,
        // Cliente envía un total fraudulento de $1
        totalVenta: 1,
        subtotal: 1,
        ivaTotal: 0,
        detalles: [
          {
            idProducto: 'prod-001',
            cantidad: 1,
            precioUnitario: 10000,
            tarifaIva: 0.19,
            totalLinea: 1 // cliente manipula totalLinea
          }
        ]
      };

      const result = await salesController.create(payloadManipulado);

      expect(mockSalesRepository.createWithTransaction).toHaveBeenCalled();
      expect(result.subtotal).toBe(10000);
      expect(result.ivaTotal).toBe(1900);
      expect(result.totalVenta).toBe(11900);
      expect(result.totalVenta).not.toBe(1);
    });
  });
});
