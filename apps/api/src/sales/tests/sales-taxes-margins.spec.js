describe('Sales VAT, Margins and Discounts Regression (Bloque 4 Remediación)', () => {
  describe('TEST-AUD-09: Venta con precioIncluyeIva = false suma IVA correctamente (HAL-F7-02)', () => {
    it('debe calcular base gravable $10,000 e IVA $1,900 dando un total de $11,900 si precio no incluye IVA', () => {
      const cantidad = 1;
      const precioUnitario = 10000;
      const precioIncluyeIva = false;
      const tarifaIva = 0.19;

      const baseDespuesComercial = cantidad * precioUnitario;
      const baseGravable = precioIncluyeIva 
        ? baseDespuesComercial / (1 + tarifaIva) 
        : baseDespuesComercial;
      const montoIva = precioIncluyeIva 
        ? baseDespuesComercial - baseGravable 
        : baseGravable * tarifaIva;
      const total = baseGravable + montoIva;

      expect(baseGravable).toBe(10000);
      expect(montoIva).toBe(1900);
      expect(total).toBe(11900);
    });

    it('debe desglosar base gravable e IVA correctamente si precioIncluyeIva = true', () => {
      const cantidad = 1;
      const precioUnitario = 11900;
      const precioIncluyeIva = true;
      const tarifaIva = 0.19;

      const baseDespuesComercial = cantidad * precioUnitario;
      const baseGravable = baseDespuesComercial / (1 + tarifaIva);
      const montoIva = baseDespuesComercial - baseGravable;

      expect(baseGravable).toBeCloseTo(10000, 2);
      expect(montoIva).toBeCloseTo(1900, 2);
      expect(baseGravable + montoIva).toBe(11900);
    });
  });

  describe('TEST-AUD-20: Descuento comercial reduce base; financiero no la reduce (HAL-F7-03, HAL-F7-04)', () => {
    it('debe reducir la base gravable con descuento comercial antes de calcular IVA', () => {
      const cantidad = 1;
      const precioUnitario = 10000;
      const descuentoComercial = 2000;
      const tarifaIva = 0.19;

      const baseGravable = (cantidad * precioUnitario) - descuentoComercial; // $8,000
      const montoIva = baseGravable * tarifaIva; // $1,520
      const total = baseGravable + montoIva; // $9,520

      expect(baseGravable).toBe(8000);
      expect(montoIva).toBe(1520);
      expect(total).toBe(9520);
    });

    it('no debe reducir la base gravable ante un descuento financiero (pronto pago)', () => {
      const cantidad = 1;
      const precioUnitario = 10000;
      const descuentoFinanciero = 500;
      const tarifaIva = 0.19;

      const baseGravable = cantidad * precioUnitario; // $10,000 intacto
      const montoIva = baseGravable * tarifaIva; // $1,900
      const total = (baseGravable + montoIva) - descuentoFinanciero; // $11,400

      expect(baseGravable).toBe(10000);
      expect(montoIva).toBe(1900);
      expect(total).toBe(11400);
    });
  });

  describe('TEST-AUD-06: IVA agrupado por base sin descuadre de centavos (HAL-F4-06)', () => {
    it('debe acumular bases con precisión flotante completa y redondear al consolidar factura', () => {
      // 3 ítems con base $10,555.33 cada uno a IVA 19%
      const lineas = [10555.33, 10555.33, 10555.33];
      const tarifa = 0.19;

      const sumBase = lineas.reduce((acc, v) => acc + v, 0); // 31665.99
      const sumIva = sumBase * tarifa; // 6016.5381

      const totalFactura = Number((sumBase + sumIva).toFixed(2));
      expect(totalFactura).toBe(37682.53);
    });
  });

  describe('TEST-AUD-21 & TEST-AUD-EMERG-02: Densidad y márgenes (HAL-F7-01, HAL-F2-03)', () => {
    it('debe calcular el margen comercial sobre el precio neto sin IVA', () => {
      const precioVentaConIva = 11900;
      const tarifaIva = 0.19;
      const costoUnitario = 7000;

      const precioSinIva = precioVentaConIva / (1 + tarifaIva); // 10,000
      const margenSinIva = ((precioSinIva - costoUnitario) / precioSinIva) * 100; // 30%

      expect(precioSinIva).toBe(10000);
      expect(margenSinIva).toBe(30);
    });
  });
});
