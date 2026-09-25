import { test, expect } from '@playwright/test';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

test.describe('Integración API: Poka-Yoke y Reglas de Planta en Recetas (validateRecipeIntegrity)', () => {
  let prodComercial = null;
  let prodWip = null;
  let insumoRegular = null;
  let insumoEmpaque = null;
  const createdRecipeIds = [];

  test.beforeAll(async ({ request }) => {
    const pRes = await request.get(`${API_BASE}/products`);
    if (!pRes.ok()) {
      throw new Error(`Error al obtener productos (${pRes.status()}): ${await pRes.text()}`);
    }
    const pData = await pRes.json();
    const products = Array.isArray(pData) ? pData : (pData.data || []);
    prodComercial = products.find(p => p.presentacion?.tipoEnvase !== 'TANQUE_GRANEL' && !p.nombre.includes('BASE'));
    prodWip = products.find(p => p.presentacion?.tipoEnvase === 'TANQUE_GRANEL' || p.nombre.includes('BASE'));

    const sRes = await request.get(`${API_BASE}/supplies`);
    if (!sRes.ok()) {
      throw new Error(`Error al obtener insumos (${sRes.status()}): ${await sRes.text()}`);
    }
    const sData = await sRes.json();
    const supplies = Array.isArray(sData) ? sData : (sData.data || []);
    insumoEmpaque = supplies.find(s => /BOTELLA|VASO|EMPAQUE|ENVASE|TAPA/i.test(`${s.nombre} ${s.categoria}`));
    insumoRegular = supplies.find(s => !/BOTELLA|VASO|EMPAQUE|ENVASE|TAPA/i.test(`${s.nombre} ${s.categoria}`));
  });

  test.afterAll(async ({ request }) => {
    for (const id of createdRecipeIds) {
      await request.delete(`${API_BASE}/recipes/${id}`).catch(() => {});
    }
  });

  const makePayload = (prodId, detalles) => ({
    idProducto: prodId,
    nombre: `E2E Test Receta ${Date.now()}`,
    rendimientoBase: 10,
    unidadRendimiento: 'Unidades',
    etapas: [{
      nombre: 'Etapa E2E', orden: 1, tiempoEstandarMin: 15,
      detalles: detalles.map(d => ({ ...d, mermaPorcentaje: 0, activo: true }))
    }]
  });

  test('R-API-01: Rechazo con 400 Bad Request si cantidadRequerida <= 0 o NaN', async ({ request }) => {
    const payload = makePayload(prodComercial.id, [{ idInsumo: insumoRegular.id, cantidadRequerida: 0, unidad: insumoRegular.unidadBase }]);
    const res = await request.post(`${API_BASE}/recipes`, { data: payload });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toContain('La cantidad requerida debe ser estrictamente mayor a 0');
  });

  test('R-API-02: Rechazo con 400 Bad Request si detalle contiene simultáneamente idInsumo e idProductoIntermedio', async ({ request }) => {
    const payload = makePayload(prodComercial.id, [{ idInsumo: insumoRegular.id, idProductoIntermedio: prodWip.id, cantidadRequerida: 5, unidad: 'L' }]);
    const res = await request.post(`${API_BASE}/recipes`, { data: payload });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toContain('no ambos');
  });

  test('R-API-03: Rechazo con 400 Bad Request si detalle no contiene ni idInsumo ni idProductoIntermedio', async ({ request }) => {
    const payload = makePayload(prodComercial.id, [{ cantidadRequerida: 5, unidad: 'L' }]);
    const res = await request.post(`${API_BASE}/recipes`, { data: payload });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toContain('no ambos');
  });

  test('R-API-04: Rechazo con 400 Bad Request si comercial carece de empaque primario obligatorio', async ({ request }) => {
    const payload = makePayload(prodComercial.id, [{ idInsumo: insumoRegular.id, cantidadRequerida: 5, unidad: insumoRegular.unidadBase, tipoInsumo: 'BASE' }]);
    const res = await request.post(`${API_BASE}/recipes`, { data: payload });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toContain('empaque primario');
  });

  test('R-API-05: Exoneración de empaque para producto intermedio WIP (acepta 201 Created sin envase)', async ({ request }) => {
    const payload = makePayload(prodWip.id, [{ idInsumo: insumoRegular.id, cantidadRequerida: 5, unidad: insumoRegular.unidadBase, tipoInsumo: 'BASE' }]);
    payload.unidadRendimiento = 'Litros';
    const res = await request.post(`${API_BASE}/recipes`, { data: payload });
    expect(res.status()).toBe(201);
    const data = await res.json();
    if (data.id) createdRecipeIds.push(data.id);
  });

  test('R-API-06: Rechazo con 400 Bad Request ante incompatibilidad dimensional de unidades', async ({ request }) => {
    const payload = makePayload(prodComercial.id, [
      { idInsumo: insumoRegular.id, cantidadRequerida: 5, unidad: 'IncompatibleUnitXYZ' },
      { idInsumo: insumoEmpaque.id, cantidadRequerida: 10, unidad: insumoEmpaque.unidadBase, tipoInsumo: 'EMPAQUE_BASE' }
    ]);
    const res = await request.post(`${API_BASE}/recipes`, { data: payload });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toContain('Inconcordancia de unidades dimensionales');
  });

  test('R-API-07: Persistencia válida: Payload íntegro retorna 201 Created y confirma transacción atómica', async ({ request }) => {
    const payload = makePayload(prodComercial.id, [
      { idInsumo: insumoRegular.id, cantidadRequerida: 5, unidad: insumoRegular.unidadBase, tipoInsumo: 'BASE' },
      { idInsumo: insumoEmpaque.id, cantidadRequerida: 10, unidad: insumoEmpaque.unidadBase, tipoInsumo: 'EMPAQUE_BASE' }
    ]);
    const res = await request.post(`${API_BASE}/recipes`, { data: payload });
    if (!res.ok()) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(`Fallo al persistir receta en R-API-07 (${res.status()}): ${JSON.stringify(errBody)}`);
    }
    expect(res.status()).toBe(201);
    const created = await res.json();
    expect(created.id).toBeDefined();
    createdRecipeIds.push(created.id);
    const getRes = await request.get(`${API_BASE}/recipes/${created.id}`);
    expect(getRes.status()).toBe(200);
  });
});
