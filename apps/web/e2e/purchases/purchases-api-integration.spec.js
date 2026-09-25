const { test, expect } = require('@playwright/test');

/**
 * @file purchases-api-integration.spec.js
 * @description Suite de integración API para el Módulo de Compras y Abastecimiento (sin navegador).
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

test.describe('Integración API: Módulo de Compras y Abastecimiento', () => {
  let createdOrderId = null;
  const testOrderName = `ORDEN PRUEBA API - ${Date.now()}`;

  test('PUR-API-01: GET /purchases retorna status 200 OK y un array de compras históricas', async ({ request }) => {
    const res = await request.get(`${API_BASE}/purchases`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data;
    expect(Array.isArray(list)).toBe(true);
  });

  test('PUR-API-02: GET /purchases/orders/active retorna status 200 OK y array de órdenes activas', async ({ request }) => {
    const res = await request.get(`${API_BASE}/purchases/orders/active`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data;
    expect(Array.isArray(list)).toBe(true);
  });

  test('PUR-API-03: POST /purchases rechaza con 400 Bad Request si carece de proveedor o cantidad <= 0', async ({ request }) => {
    const resEmpty = await request.post(`${API_BASE}/purchases`, { data: {} });
    expect(resEmpty.status()).toBe(400);

    const resZeroQty = await request.post(`${API_BASE}/purchases`, {
      data: {
        idProveedor: '00000000-0000-0000-0000-000000000000',
        fechaCompra: new Date().toISOString(),
        numeroFactura: 'FAC-ERR-01',
        detalles: [{ idInsumo: '00000000-0000-0000-0000-000000000000', cantidad: 0, precioUnitario: 1000 }]
      }
    });
    expect(resZeroQty.status()).toBe(400);
  });

  test('PUR-API-04: POST /purchases/orders crea exitosamente (201 Created) una orden de compra preparatoria', async ({ request }) => {
    const res = await request.post(`${API_BASE}/purchases/orders`, {
      data: {
        nombre: testOrderName,
        items: []
      }
    });
    expect(res.status()).toBe(201);
    const order = await res.json();
    expect(order).toHaveProperty('id');
    expect(order.nombre).toBe(testOrderName);
    expect(order.estado).toBe('PENDIENTE');

    createdOrderId = order.id;
  });

  test('PUR-API-05: GET /purchases/orders/:id recupera la orden recién creada confirmando consistencia', async ({ request }) => {
    test.skip(!createdOrderId, 'Falta createdOrderId del test previo');
    const res = await request.get(`${API_BASE}/purchases/orders/${createdOrderId}`);
    expect(res.status()).toBe(200);
    const order = await res.json();
    expect(order.id).toBe(createdOrderId);
    expect(order.nombre).toBe(testOrderName);
    expect(order.estado).toBe('PENDIENTE');
  });
});
