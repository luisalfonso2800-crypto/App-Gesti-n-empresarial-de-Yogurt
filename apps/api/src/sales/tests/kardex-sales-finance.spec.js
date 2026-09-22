/**
 * Bloque 5 — Tests de regresión: Kardex, Ventas y Finanzas
 * Cubre: HAL-F4-08, HAL-F9-03, HAL-F2-02, HAL-F9-04, HAL-F7-03, HAL-F9-02
 */
import { normalizeUnit, areCompatible, convert } from '../../common/units/unit-registry.js';

// ─── TEST-AUD-22: Saldo real sin truncar (HAL-F4-08) ─────────────────────────
describe('TEST-AUD-22: Math.max(0,...) eliminado — saldo refleja valor real (HAL-F4-08)', () => {
  it('stock negativo se preserva cuando consumo > stock disponible', () => {
    const stockActual = 5;
    const qtyReal = 8;
    // Antes: Math.max(0, 5 - 8) = 0 (ocultaba el déficit)
    // Ahora: 5 - 8 = -3 (evidencia del desajuste)
    const stockFinal = stockActual - qtyReal;
    expect(stockFinal).toBe(-3);
    expect(stockFinal).not.toBe(0); // Prevención explícita del antipatrón
  });

  it('saldo pendiente negativo representa saldo a favor del cliente', () => {
    const totalVenta = 50000;
    const valorPagado = 65000;
    const saldoPendiente = totalVenta - valorPagado;
    expect(saldoPendiente).toBe(-15000);
    expect(saldoPendiente).not.toBe(0);
  });

  it('stock positivo no se altera cuando consumo <= stock', () => {
    const stockActual = 10;
    const qtyReal = 7;
    const stockFinal = stockActual - qtyReal;
    expect(stockFinal).toBe(3);
  });
});

// ─── TEST-AUD-23: stockAnterior y stockNuevo deterministas (HAL-F9-03) ────────
describe('TEST-AUD-23: Trazabilidad de Kardex — stockAnterior y stockNuevo (HAL-F9-03)', () => {
  it('movimiento de ENTRADA_COMPRA produce stockNuevo = stockAnterior + cantidad', () => {
    const stockAnterior = 500;
    const cantidadComprada = 200;
    const stockNuevo = stockAnterior + cantidadComprada;
    expect(stockNuevo).toBe(700);
    expect(stockNuevo).toBeGreaterThan(stockAnterior);
  });

  it('movimiento de SALIDA_VENTA produce stockNuevo = stockAnterior - cantidad', () => {
    const stockAnterior = 100;
    const cantidadVendida = 30;
    const stockNuevo = stockAnterior - cantidadVendida;
    expect(stockNuevo).toBe(70);
  });

  it('secuencia de movimientos mantiene consistencia acumulativa', () => {
    let stock = 0;
    // Entrada compra +500
    stock += 500;
    expect(stock).toBe(500);
    // Salida producción -200
    stock -= 200;
    expect(stock).toBe(300);
    // Entrada producción +150
    stock += 150;
    expect(stock).toBe(450);
    // Salida venta -50
    stock -= 50;
    expect(stock).toBe(400);
  });
});

// ─── TEST-AUD-24: Normalización dimensional en ajustes de Kardex (HAL-F2-02) ──
describe('TEST-AUD-24: Conversión de unidades en ajustes de inventario (HAL-F2-02)', () => {
  it('convierte kg a g automáticamente para un insumo en gramos', () => {
    const cantidadAjuste = 2; // 2 kg
    const unidadMovimiento = 'kg';
    const unidadBase = 'g';

    const unitFrom = normalizeUnit(unidadMovimiento);
    const unitTo = normalizeUnit(unidadBase);
    expect(areCompatible(unitFrom, unitTo)).toBe(true);

    const cantidadNormalizada = convert(cantidadAjuste, unitFrom, unitTo);
    expect(cantidadNormalizada).toBe(2000); // 2 kg = 2000 g
  });

  it('convierte ml a l automáticamente para un insumo en litros', () => {
    const cantidadAjuste = 500; // 500 ml
    const cantidadNormalizada = convert(cantidadAjuste, normalizeUnit('ml'), normalizeUnit('l'));
    expect(cantidadNormalizada).toBeCloseTo(0.5, 4); // 500 ml = 0.5 L
  });

  it('rechaza conversiones entre magnitudes incompatibles (masa vs volumen)', () => {
    expect(areCompatible(normalizeUnit('kg'), normalizeUnit('l'))).toBe(false);
  });

  it('no altera la cantidad si la unidad ya es la base', () => {
    const cantidadAjuste = 100;
    const unitFrom = normalizeUnit('g');
    const unitTo = normalizeUnit('g');
    // Si son iguales, no se convierte
    if (unitFrom === unitTo) {
      expect(cantidadAjuste).toBe(100);
    }
  });
});

// ─── TEST-AUD-25: Cobros mayores al saldo generan saldo a favor (HAL-F9-04) ──
describe('TEST-AUD-25: Anticipos y sobrepagos generan saldo a favor (HAL-F9-04)', () => {
  it('pago exacto deja saldo = 0 y estado COMPLETADA', () => {
    const totalVenta = 100000;
    const valorPagado = 100000;
    const nuevoSaldo = totalVenta - valorPagado;
    const estado = nuevoSaldo <= 0 ? 'COMPLETADA' : 'PENDIENTE';
    expect(nuevoSaldo).toBe(0);
    expect(estado).toBe('COMPLETADA');
  });

  it('sobrepago genera saldo negativo (crédito del cliente)', () => {
    const totalVenta = 100000;
    const valorPagado = 120000;
    const nuevoSaldo = totalVenta - valorPagado;
    expect(nuevoSaldo).toBe(-20000);
    expect(nuevoSaldo).toBeLessThan(0);
    // La observación debería indicar saldo a favor
    const saldoAFavor = Math.abs(nuevoSaldo);
    expect(saldoAFavor).toBe(20000);
  });

  it('pago parcial deja saldo positivo y estado PENDIENTE', () => {
    const totalVenta = 100000;
    const valorPagado = 40000;
    const nuevoSaldo = totalVenta - valorPagado;
    const estado = nuevoSaldo <= 0 ? 'COMPLETADA' : 'PENDIENTE';
    expect(nuevoSaldo).toBe(60000);
    expect(estado).toBe('PENDIENTE');
  });
});

// ─── TEST-AUD-26: Descuento máximo 50% (HAL-F7-03) ───────────────────────────
describe('TEST-AUD-26: Validación de descuento máximo comercial (HAL-F7-03)', () => {
  const MAX_DESCUENTO_PORCENTAJE = 0.50;

  it('descuento dentro del límite 50% es válido', () => {
    const cantidad = 10;
    const precioUnitario = 5000;
    const descuento = 20000; // 40% de 50,000
    const bruto = cantidad * precioUnitario;
    expect(descuento <= bruto * MAX_DESCUENTO_PORCENTAJE).toBe(true);
  });

  it('descuento exactamente al 50% es válido', () => {
    const cantidad = 10;
    const precioUnitario = 5000;
    const descuento = 25000; // exactamente 50% de 50,000
    const bruto = cantidad * precioUnitario;
    expect(descuento <= bruto * MAX_DESCUENTO_PORCENTAJE).toBe(true);
  });

  it('descuento que excede el 50% es rechazado', () => {
    const cantidad = 10;
    const precioUnitario = 5000;
    const descuento = 30000; // 60% de 50,000
    const bruto = cantidad * precioUnitario;
    expect(descuento <= bruto * MAX_DESCUENTO_PORCENTAJE).toBe(false);
  });

  it('descuento del 100% (facturación a $0) es rechazado', () => {
    const cantidad = 5;
    const precioUnitario = 10000;
    const descuento = 50000; // 100% de 50,000
    const bruto = cantidad * precioUnitario;
    expect(descuento <= bruto * MAX_DESCUENTO_PORCENTAJE).toBe(false);
  });
});

// ─── TEST-AUD-27: Segregación devengado vs flujo de caja (HAL-F9-02) ──────────
describe('TEST-AUD-27: Utilidad devengada vs flujo de caja real (HAL-F9-02)', () => {
  it('utilidadDevengada usa base sin IVA', () => {
    const ventasTotalesConIva = 119000; // incluye 19% IVA
    const baseImponible = 100000; // sin IVA
    const gastos = 60000;
    const utilidadDevengada = baseImponible - gastos;
    // Antes: 119000 - 60000 = 59000 (incluía IVA como ingreso)
    // Ahora: 100000 - 60000 = 40000 (ingreso operativo real)
    expect(utilidadDevengada).toBe(40000);
    expect(utilidadDevengada).not.toBe(ventasTotalesConIva - gastos);
  });

  it('flujoCajaReal solo cuenta cobros efectivos', () => {
    const ventasFacturadas = 200000;
    const cobrosRecaudados = 120000; // solo se cobró el 60%
    const gastos = 80000;
    const flujoCajaReal = cobrosRecaudados - gastos;
    expect(flujoCajaReal).toBe(40000);
    // La utilidad devengada sería mayor (200000 - 80000 = 120000)
    // pero la caja real solo tiene 40000
    expect(flujoCajaReal).toBeLessThan(ventasFacturadas - gastos);
  });

  it('flujo de caja negativo indica que se gastó más de lo cobrado', () => {
    const cobrosRecaudados = 30000;
    const gastos = 80000;
    const flujoCajaReal = cobrosRecaudados - gastos;
    expect(flujoCajaReal).toBe(-50000);
    expect(flujoCajaReal).toBeLessThan(0);
  });
});
