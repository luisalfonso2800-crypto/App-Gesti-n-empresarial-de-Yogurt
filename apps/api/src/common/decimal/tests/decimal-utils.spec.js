import { Decimal, toDecimal, toNumber, add, sub, mul, div } from '../decimal-utils.js';

describe('HAL-F4-07: Migración a Decimal.js (TEST-AUD-07)', () => {
  it('TEST-AUD-07: sumar 100 veces 0.10 + 0.20 usando Decimal da 30.00 exacto vs distorsión Number', () => {
    let acumuladorDecimal = new Decimal(0);
    let acumuladorNumber = 0;

    for (let i = 0; i < 100; i++) {
      acumuladorDecimal = acumuladorDecimal.plus(new Decimal('0.10')).plus(new Decimal('0.20'));
      acumuladorNumber += 0.10 + 0.20;
    }

    // Number sufre distorsión de coma flotante IEEE-754: 30.000000000000004
    expect(acumuladorNumber).not.toBe(30.0);
    expect(acumuladorNumber.toString()).toContain('30.000000000000');

    // Decimal.js entrega 30.00 exacto
    expect(acumuladorDecimal.toString()).toBe('30');
    expect(toNumber(acumuladorDecimal)).toBe(30.0);
    expect(acumuladorDecimal.toFixed(2)).toBe('30.00');
  });

  it('debe manejar operaciones básicas add, sub, mul, div con toDecimal correctamente', () => {
    expect(toNumber(add('10.25', '5.75'))).toBe(16.0);
    expect(toNumber(sub('10.00', '3.33'))).toBe(6.67);
    expect(toNumber(mul('2.5', '4'))).toBe(10.0);
    expect(toNumber(div('10', '4'))).toBe(2.5);
    expect(toNumber(toDecimal(null))).toBe(0);
    expect(toNumber(toDecimal(undefined))).toBe(0);
  });

  // ─── TEST-AUD-EMERG-14: HAL-F4-07 (CPP con 20 iteraciones sin drift float64) ───
  it('TEST-AUD-EMERG-14 (HAL-F4-07): cálculo de CPP en 20 compras sucesivas no acumula drift float64', () => {
    let stockDec = toDecimal(0);
    let costoPromedioDec = toDecimal(0);

    let stockNum = 0;
    let costoPromedioNum = 0;

    for (let i = 1; i <= 20; i++) {
      const cantCompra = 10;
      const costoCompra = 1500.3333; // Decimal periódico propenso a drift

      // Simulación con float64 Number()
      const nuevoStockNum = stockNum + cantCompra;
      costoPromedioNum = ((stockNum * costoPromedioNum) + (cantCompra * costoCompra)) / nuevoStockNum;
      stockNum = nuevoStockNum;

      // Simulación con Decimal.js
      const cantCompraDec = toDecimal(cantCompra);
      const costoCompraDec = toDecimal(costoCompra);
      const nuevoStockDec = add(stockDec, cantCompraDec);
      const valorTotalDec = add(mul(stockDec, costoPromedioDec), mul(cantCompraDec, costoCompraDec));
      costoPromedioDec = div(valorTotalDec, nuevoStockDec);
      stockDec = nuevoStockDec;
    }

    // El cálculo con Decimal es idéntico a 1500.3333 al comprar siempre al mismo precio
    expect(toNumber(costoPromedioDec.toDecimalPlaces(4))).toBe(1500.3333);
    expect(costoPromedioDec.toFixed(4)).toBe('1500.3333');
    expect(toNumber(stockDec)).toBe(200);
  });

  // ─── TEST-AUD-EMERG-15: HAL-F4-07 (Cálculo de costo WIP con Decimal sin drift) ───
  it('TEST-AUD-EMERG-15 (HAL-F4-07): cálculo de explosión de costo WIP con rendimientos fraccionarios mantiene exactitud', () => {
    const rendimientoBase = toDecimal('33.3333');
    const cantidadProduccion = toDecimal('100');
    const factorEscala = div(cantidadProduccion, rendimientoBase);

    const cantidadInsumo = toDecimal('0.15');
    const costoInsumo = toDecimal('25430.50');
    const mermaPorcentaje = toDecimal('2.5');

    // reqTeorico = cantidadInsumo * factorEscala * (1 + merma/100)
    const factorMerma = add(1, div(mermaPorcentaje, 100));
    const reqTeoricoDec = mul(mul(cantidadInsumo, factorEscala), factorMerma);
    const costoDetalleDec = mul(reqTeoricoDec, costoInsumo);

    // Debe ser un cálculo reproducible y determinista
    expect(costoDetalleDec.isFinite()).toBe(true);
    expect(costoDetalleDec.gt(0)).toBe(true);
    expect(costoDetalleDec.toFixed(2)).toBe('11729.83');
  });
});
