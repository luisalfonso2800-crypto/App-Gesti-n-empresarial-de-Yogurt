import { normalizeQtyToUnitCost } from '../production.repository';

describe('ProductionRepository & WIP Cost (Bloque 2 Remediación)', () => {
  describe('TEST-AUD-10: Costo de WIP consumido en ml (HAL-F8-01)', () => {
    it('debe escalar correctamente 150 ml de base con costo unitario de $3,400/L a $510, no a $510,000', () => {
      const qtyRealMl = 150;
      const unidad = 'ml';
      const costoUnitarioLts = 3400; // $3,400 COP por Litro

      const qtyNormalizada = normalizeQtyToUnitCost(qtyRealMl, unidad);
      const costoReal = qtyNormalizada * costoUnitarioLts;

      expect(qtyNormalizada).toBe(0.15); // 0.15 Litros
      expect(costoReal).toBe(510);        // $510 COP exactos
      expect(costoReal).not.toBe(510000); // Prevención explícita del error 1000x
    });

    it('debe escalar correctamente 250 g de base sólida con costo unitario de $12,000/kg a $3,000', () => {
      const qtyRealGramos = 250;
      const unidad = 'g';
      const costoUnitarioKg = 12000;

      const qtyNormalizada = normalizeQtyToUnitCost(qtyRealGramos, unidad);
      const costoReal = qtyNormalizada * costoUnitarioKg;

      expect(qtyNormalizada).toBe(0.25);
      expect(costoReal).toBe(3000);
    });

    it('debe mantener la cantidad intacta si la unidad ya es Litros o kg', () => {
      expect(normalizeQtyToUnitCost(2, 'Litros')).toBe(2);
      expect(normalizeQtyToUnitCost(5, 'kg')).toBe(5);
    });
  });
});
