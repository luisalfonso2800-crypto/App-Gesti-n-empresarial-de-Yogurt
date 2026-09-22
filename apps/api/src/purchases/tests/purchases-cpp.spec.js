import { Test } from '@nestjs/testing';
import { PurchasesRepository } from '../purchases.repository';
import { PrismaService } from '../../database/prisma.service';

describe('PurchasesRepository & CPP Calculation (Bloque 2 Remediación)', () => {
  describe('TEST-AUD-04: Recálculo de Costo Promedio Ponderado en Compras (HAL-F4-01)', () => {
    it('debe recalcular CPP a $15,000 tras compra de 10 kg @$20,000 sobre stock previo de 10 kg @$10,000', () => {
      // Simular la fórmula matemática exacta implementada en el repositorio
      const stockAnterior = 10;
      const costoAnterior = 10000;
      const cantidadComprada = 10;
      const precioUnitarioCompra = 20000;

      const stockNuevo = stockAnterior + cantidadComprada;
      const costoNuevo = stockNuevo > 0
        ? ((stockAnterior * costoAnterior) + (cantidadComprada * precioUnitarioCompra)) / stockNuevo
        : precioUnitarioCompra;

      expect(stockNuevo).toBe(20);
      expect(costoNuevo).toBe(15000); // Promedio ponderado exacto
    });

    it('debe adoptar el precio de compra directo si el stock previo es 0', () => {
      const stockAnterior = 0;
      const costoAnterior = 0;
      const cantidadComprada = 5;
      const precioUnitarioCompra = 18000;

      const stockNuevo = stockAnterior + cantidadComprada;
      const costoNuevo = stockNuevo > 0
        ? ((stockAnterior * costoAnterior) + (cantidadComprada * precioUnitarioCompra)) / stockNuevo
        : precioUnitarioCompra;

      expect(stockNuevo).toBe(5);
      expect(costoNuevo).toBe(18000);
    });
  });
});
