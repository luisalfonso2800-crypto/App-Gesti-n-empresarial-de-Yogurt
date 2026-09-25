const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * @file production-api-integration.spec.js
 * @description Suite de integración API para el Módulo de Producción y Poka-Yoke de Lotes.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

test.describe('Integración API: Módulo de Producción y Poka-Yoke de Lote Padre', () => {
  let chainProduction = null;
  let chainRecipes = null;
  let recipeIdNatural1L = null;
  let idProduccionCreada = null;

  test.beforeAll(async () => {
    const prodFile = path.resolve(__dirname, '../.test-data/chain-production.json');
    if (fs.existsSync(prodFile)) {
      chainProduction = JSON.parse(fs.readFileSync(prodFile, 'utf8'));
    }
    const recipesFile = path.resolve(__dirname, '../.test-data/chain-recipes.json');
    if (fs.existsSync(recipesFile)) {
      chainRecipes = JSON.parse(fs.readFileSync(recipesFile, 'utf8'));
      recipeIdNatural1L = chainRecipes['YOGUR NATURAL 1L']?.id;
    }
  });

  test.afterAll(async ({ request }) => {
    if (idProduccionCreada) {
      try {
        await request.delete(`${API_BASE}/production/${idProduccionCreada}`);
      } catch (_) {}
    }
  });

  test('P-API-01: GET /production/recipe-bom/:idReceta retorna BOM escalado con query param', async ({ request }) => {
    test.skip(!recipeIdNatural1L, 'No se encontró id de receta para YOGUR NATURAL 1L');
    const res = await request.get(`${API_BASE}/production/recipe-bom/${recipeIdNatural1L}?cantidad=10`);
    expect(res.status()).toBe(200);

    const bom = await res.json();
    expect(Array.isArray(bom)).toBe(true);
    expect(bom.length).toBeGreaterThan(0);

    const primerItem = bom[0];
    const qtyVal = primerItem.cantidadCalculada ?? primerItem.cantidadRequerida ?? primerItem.requeridoTeorico;
    expect(qtyVal).toBeDefined();
    expect(Number(qtyVal)).toBeGreaterThan(0);
  });

  test('P-API-02: Rechazo con 400 Bad Request por stock insuficiente o payload inválido', async ({ request }) => {
    // El backend valida disponibilidad neta en ProductionService y emite BadRequestException (400)
    const resStockInf = await request.post(`${API_BASE}/production`, {
      data: {
        idProducto: chainProduction?.idProducto || '17068f3e-c2ef-4ae2-b6b0-df9dddf9c70d',
        cantidadPlanificada: 10,
        fechaProduccion: new Date().toISOString(),
        detalles: [
          {
            idProductoIntermedio: chainProduction?.idProducto || '17068f3e-c2ef-4ae2-b6b0-df9dddf9c70d',
            cantidadTeorica: 99999999,
            unidad: 'L'
          }
        ]
      }
    });
    expect(resStockInf.status()).toBe(400);
  });

  test('P-API-03: Rechazo al intentar iniciar orden inexistente o con insumos insuficientes', async ({ request }) => {
    const resFake = await request.post(`${API_BASE}/production/00000000-0000-0000-0000-000000000000/start`);
    expect([400, 404, 500]).toContain(resFake.status());
  });

  test('P-API-04: Rechazo con 400 Bad Request si receta demanda WIP y no hay saldo neto', async ({ request }) => {
    const res = await request.post(`${API_BASE}/production`, {
      data: {
        idProducto: chainProduction?.idProducto || '17068f3e-c2ef-4ae2-b6b0-df9dddf9c70d',
        cantidadPlanificada: 999999,
        fechaProduccion: new Date().toISOString(),
        detalles: [
          {
            idProductoIntermedio: chainProduction?.idProducto || '17068f3e-c2ef-4ae2-b6b0-df9dddf9c70d',
            cantidadTeorica: 999999,
            unidad: 'L'
          }
        ]
      }
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    const msg = Array.isArray(body.message) ? body.message.join(' ') : (body.message || '');
    expect(msg.toLowerCase()).toContain('insuficiente');
  });

  test('P-API-05: Creación exitosa (201) de orden planificada respaldada por Lote WIP', async ({ request }) => {
    test.skip(!chainProduction?.idProducto, 'Falta idProducto en chain-production.json');
    const res = await request.post(`${API_BASE}/production`, {
      data: {
        idProducto: chainProduction.idProducto,
        cantidadPlanificada: 5,
        fechaProduccion: new Date().toISOString(),
        estado: 'PLANIFICADA',
        observaciones: `E2E Test: Lote Padre ${chainProduction.idLote}`,
        detalles: [
          {
            idProductoIntermedio: chainProduction.idProducto,
            cantidadTeorica: 5,
            unidad: 'L',
            costoTeorico: 4500
          }
        ]
      }
    });

    expect(res.status()).toBe(201);
    const orden = await res.json();
    expect(orden).toHaveProperty('id');
    expect(orden.estado).toBe('PLANIFICADA');
    expect(Number(orden.cantidadPlanificada)).toBe(5);
    idProduccionCreada = orden.id;
  });
});
