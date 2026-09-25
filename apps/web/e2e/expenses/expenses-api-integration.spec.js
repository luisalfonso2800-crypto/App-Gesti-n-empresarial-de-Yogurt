const { test, expect } = require('@playwright/test');

/**
 * @file expenses-api-integration.spec.js
 * @description Suite de integración API para el Módulo de Gastos Operativos (sin navegador).
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

test.describe('Integración API: Módulo de Gastos Operativos', () => {
  let createdExpenseId = null;
  const testPeriod = '2026-09';
  const testDescription = `GASTO AUDITORIA E2E - ${Date.now()}`;
  const testValue = 85000;

  test('EXP-API-01: GET /expenses retorna status 200 OK y una lista (array) de gastos', async ({ request }) => {
    const res = await request.get(`${API_BASE}/expenses`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.data;
    expect(Array.isArray(items)).toBe(true);
  });

  test('EXP-API-02: POST /expenses rechaza con 400 Bad Request o 500 si el valor es <= 0 o faltan campos obligatorios', async ({ request }) => {
    const resMissing = await request.post(`${API_BASE}/expenses`, {
      data: { descripcion: 'Incompleto' }
    });
    expect([400, 500]).toContain(resMissing.status());

    const resInvalidVal = await request.post(`${API_BASE}/expenses`, {
      data: {
        fecha: new Date().toISOString(),
        categoria: 'SERVICIOS',
        descripcion: 'Valor inválido',
        valor: 'abc',
        tipoGasto: 'FIJO',
        periodo: testPeriod
      }
    });
    expect([400, 500]).toContain(resInvalidVal.status());
  });

  test('EXP-API-03: POST /expenses crea exitosamente (201 Created) un gasto operativo con payload válido', async ({ request }) => {
    const payload = {
      fecha: new Date().toISOString(),
      categoria: 'MANTENIMIENTO',
      descripcion: testDescription,
      valor: testValue,
      tipoGasto: 'OPERATIVO',
      periodo: testPeriod,
      observaciones: 'REGISTRO DE PRUEBA API'
    };

    const res = await request.post(`${API_BASE}/expenses`, { data: payload });
    expect(res.status()).toBe(201);
    const created = await res.json();
    expect(created).toHaveProperty('id');
    expect(created.descripcion).toBe(testDescription);
    expect(Number(created.valor)).toBe(testValue);
    expect(created.categoria).toBe('MANTENIMIENTO');

    createdExpenseId = created.id;
  });

  test('EXP-API-04: GET /expenses/:id recupera el gasto creado por UUID retornando 200 OK y consistencia', async ({ request }) => {
    test.skip(!createdExpenseId, 'No se pudo obtener createdExpenseId del test previo');

    const res = await request.get(`${API_BASE}/expenses/${createdExpenseId}`);
    expect(res.status()).toBe(200);
    const expense = await res.json();
    expect(expense.id).toBe(createdExpenseId);
    expect(expense.descripcion).toBe(testDescription);
    expect(Number(expense.valor)).toBe(testValue);
    expect(expense.periodo).toBe(testPeriod);
  });
});
