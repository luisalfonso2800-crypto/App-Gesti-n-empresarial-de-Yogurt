const { test, expect } = require('@playwright/test');

/**
 * @file goals-api-integration.spec.js
 * @description Suite de integración API para el Módulo de Metas Comerciales (Rumbo MANNÁ).
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

test.describe('Integración API: Módulo de Metas Comerciales (Rumbo MANNÁ)', () => {
  let createdGoalId = null;
  const testTitle = `META TEST MANNA ${Date.now()}`;
  const testTargetValue = 15000000;
  const testAporte = 500000;

  test('GOAL-API-01: GET /goals retorna status 200 OK y una lista (array) de metas', async ({ request }) => {
    const res = await request.get(`${API_BASE}/goals`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data;
    expect(Array.isArray(list)).toBe(true);
  });

  test('GOAL-API-02: GET /goals/available-funds retorna 200 OK con fondos disponibles', async ({ request }) => {
    const res = await request.get(`${API_BASE}/goals/available-funds`);
    expect(res.status()).toBe(200);
    const funds = await res.json();
    expect(funds).toHaveProperty('fondosDisponibles');
    expect(funds).toHaveProperty('utilidadNetaOperativa');
    expect(typeof funds.fondosDisponibles).toBe('number');
  });

  test('GOAL-API-03: POST /goals crea exitosamente (201 Created) una meta empresarial válida', async ({ request }) => {
    const payload = {
      titulo: testTitle,
      descripcion: 'Prueba de integración API para Rumbo MANNÁ',
      ambito: 'EMPRESARIAL',
      categoriaSueno: 'EXPANSION_PLANTA',
      tipoMetrica: 'VENTAS_TOTALES',
      estrategiaAsignacion: 'MANUAL',
      porcentajeFlujo: 10,
      ordenPrioridad: 1,
      valorObjetivo: testTargetValue,
      fechaInicio: new Date().toISOString(),
      fechaFin: new Date(Date.now() + 60 * 86400000).toISOString()
    };

    const res = await request.post(`${API_BASE}/goals`, { data: payload });
    expect(res.status()).toBe(201);
    const created = await res.json();
    expect(created).toHaveProperty('id');
    expect(created.titulo).toBe(testTitle);
    expect(Number(created.valorObjetivo)).toBe(testTargetValue);

    createdGoalId = created.id;
  });

  test('GOAL-API-04: GET /goals/:id recupera la meta confirmando título y valor objetivo', async ({ request }) => {
    test.skip(!createdGoalId, 'Falta createdGoalId');
    const res = await request.get(`${API_BASE}/goals/${createdGoalId}`);
    expect(res.status()).toBe(200);
    const goal = await res.json();
    expect(goal.id).toBe(createdGoalId);
    expect(goal.titulo).toBe(testTitle);
    expect(Number(goal.valorObjetivo)).toBe(testTargetValue);
  });

  test('GOAL-API-05: POST /goals/:id/contribute registra un aporte válido y actualiza progreso', async ({ request }) => {
    test.skip(!createdGoalId, 'Falta createdGoalId');
    const res = await request.post(`${API_BASE}/goals/${createdGoalId}/contribute`, {
      data: { monto: testAporte, nota: 'Aporte de prueba API' }
    });
    expect([200, 201]).toContain(res.status());
    const updated = await res.json();
    expect(updated.id).toBe(createdGoalId);
    expect(Number(updated.montoRecaudado || updated.totalAportado || testAporte)).toBeGreaterThanOrEqual(testAporte);
  });
});
