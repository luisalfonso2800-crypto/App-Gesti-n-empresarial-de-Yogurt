const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * @file payments-api-integration.spec.js
 * @description Suite de integración API para el Módulo de Pagos y Cartera (sin navegador).
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

test.describe('Integración API: Módulo de Pagos y Conciliación de Cartera', () => {
  let targetVenta = null;
  let targetClienteId = null;

  test.beforeAll(async ({ request }) => {
    // 1. Consultar si existen cuentas por cobrar pendientes
    const recRes = await request.get(`${API_BASE}/payments/receivables`);
    if (recRes.status() === 200) {
      const data = await recRes.json();
      const receivables = Array.isArray(data) ? data : (data.ventas || []);
      if (receivables.length > 0) {
        targetVenta = receivables[0];
        targetClienteId = targetVenta.idCliente || targetVenta.cliente?.id;
      }
    }

    // 2. Si no hay cartera pendiente, sembrar una venta a crédito usando el lote de Cava
    if (!targetVenta) {
      const cavaFile = path.resolve(__dirname, '../.test-data/chain-cava.json');
      let cavaData = null;
      if (fs.existsSync(cavaFile)) {
        cavaData = JSON.parse(fs.readFileSync(cavaFile, 'utf8'));
      }

      const clientsRes = await request.get(`${API_BASE}/clients`);
      const clients = (await clientsRes.json()).data || (await clientsRes.json());
      const client = Array.isArray(clients) ? clients[0] : clients?.data?.[0];

      if (client && cavaData?.idProducto) {
        const salePayload = {
          idCliente: client.id,
          tipoPago: 'CREDITO',
          canalVenta: 'DIRECTA',
          fechaVenta: new Date().toISOString(),
          fechaLimitePago: new Date(Date.now() + 15 * 86400000).toISOString(),
          estado: 'PENDIENTE',
          valorPagado: 0,
          detalles: [
            {
              idProducto: cavaData.idProducto,
              idLote: cavaData.idLote,
              cantidad: 1,
              precioUnitario: 5000,
              descuento: 0
            }
          ]
        };
        const createSaleRes = await request.post(`${API_BASE}/sales`, { data: salePayload });
        if (createSaleRes.status() === 201) {
          targetVenta = await createSaleRes.json();
          targetClienteId = client.id;
        }
      }
    }
  });

  test('PAY-API-01: GET /payments/receivables retorna objeto con kpis y ventas', async ({ request }) => {
    const res = await request.get(`${API_BASE}/payments/receivables`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('kpis');
    expect(data).toHaveProperty('ventas');
    expect(Array.isArray(data.ventas)).toBe(true);
  });

  test('PAY-API-02: POST /payments rechaza con 400 Bad Request si valorPagado <= 0 o NaN', async ({ request }) => {
    const vId = targetVenta?.id || '00000000-0000-0000-0000-000000000000';
    const cId = targetClienteId || '00000000-0000-0000-0000-000000000000';

    const resZero = await request.post(`${API_BASE}/payments`, { data: { idVenta: vId, idCliente: cId, valorPagado: 0 } });
    expect(resZero.status()).toBe(400);

    const resNeg = await request.post(`${API_BASE}/payments`, { data: { idVenta: vId, idCliente: cId, valorPagado: -5000 } });
    expect(resNeg.status()).toBe(400);
  });

  test('PAY-API-03: POST /payments rechaza con 400 Bad Request si carece de idVenta o idCliente', async ({ request }) => {
    const resMissing = await request.post(`${API_BASE}/payments`, { data: { valorPagado: 10000 } });
    expect(resMissing.status()).toBe(400);
    const body = await resMissing.json();
    const msg = Array.isArray(body.message) ? body.message.join(' ') : (body.message || '');
    expect(msg.toLowerCase()).toMatch(/fallida|requerido|invalid/i);
  });

  test('PAY-API-04: POST /payments registra abono parcial y mantiene venta en PENDIENTE', async ({ request }) => {
    test.skip(!targetVenta?.id, 'Falta venta con saldo');
    const saldoActual = Number(targetVenta.saldoPendiente || targetVenta.totalVenta || 5000);
    const abonoParcial = Math.max(100, Math.floor(saldoActual / 2));

    const res = await request.post(`${API_BASE}/payments`, {
      data: { idVenta: targetVenta.id, idCliente: targetClienteId, valorPagado: abonoParcial, metodoPago: 'EFECTIVO' }
    });
    expect(res.status()).toBe(201);
    const pago = await res.json();
    expect(Number(pago.valorPagado)).toBe(abonoParcial);

    const checkRes = await request.get(`${API_BASE}/sales/${targetVenta.id}`);
    const ventaActualizada = await checkRes.json();
    expect(Number(ventaActualizada.saldoPendiente)).toBeLessThan(saldoActual);
    expect(ventaActualizada.estado).toBe('PENDIENTE');
  });

  test('PAY-API-05: POST /payments liquida el saldo restante total y actualiza a COMPLETADA', async ({ request }) => {
    test.skip(!targetVenta?.id, 'Falta venta con saldo');
    const checkRes = await request.get(`${API_BASE}/sales/${targetVenta.id}`);
    const ventaPrevia = await checkRes.json();
    const saldoRestante = Number(ventaPrevia.saldoPendiente);

    const res = await request.post(`${API_BASE}/payments`, {
      data: { idVenta: targetVenta.id, idCliente: targetClienteId, valorPagado: saldoRestante, metodoPago: 'TRANSFERENCIA' }
    });
    expect(res.status()).toBe(201);

    const finalRes = await request.get(`${API_BASE}/sales/${targetVenta.id}`);
    const ventaFinal = await finalRes.json();
    expect(Number(ventaFinal.saldoPendiente)).toBe(0);
    expect(ventaFinal.estado).toBe('COMPLETADA');
  });
});
