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
});
