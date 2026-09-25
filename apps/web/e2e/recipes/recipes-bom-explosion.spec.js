import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

test.describe('Integración API: Explosión de Materiales BOM y Costeo (GET /recipes/:id/bom)', () => {
  let commercialRecipeId = null;

  test.beforeAll(async ({ request }) => {
    // 1. Obtener ID de receta comercial sembrada desde .test-data o consultar activas
    const chainFile = path.join(__dirname, '..', '.test-data', 'chain-recipes.json');
    if (fs.existsSync(chainFile)) {
      const data = JSON.parse(fs.readFileSync(chainFile, 'utf8'));
      commercialRecipeId = data['YOGUR NATURAL 1L']?.id || Object.values(data)[0]?.id;
    }

    if (!commercialRecipeId) {
      const res = await request.get(`${API_BASE}/recipes/active`);
      const list = (await res.json()).data || (await res.json());
      const commercial = list.find(r => r.etapas?.some(e => e.detalles?.some(d => d.idProductoIntermedio)));
      commercialRecipeId = commercial?.id || list[0]?.id;
    }
  });

  test('R-BOM-01: Endpoint /recipes/:id/bom responde 200 OK y entrega ficha técnica íntegra', async ({ request }) => {
    expect(commercialRecipeId).toBeDefined();
    const res = await request.get(`${API_BASE}/recipes/${commercialRecipeId}/bom`);
    expect(res.status()).toBe(200);

    const recipe = (await res.json()).data || (await res.json());
    expect(recipe.id).toBe(commercialRecipeId);
    expect(recipe.nombre).toBeDefined();
    expect(recipe.producto).toBeDefined();
    expect(recipe.rendimientoBase).toBeDefined();
    expect(recipe.etapas).toBeInstanceOf(Array);
    expect(recipe.etapas.length).toBeGreaterThan(0);
  });

  test('R-BOM-02: Explosión multinivel resuelve detalles con Base WIP y Empaque Primario', async ({ request }) => {
    const res = await request.get(`${API_BASE}/recipes/${commercialRecipeId}/bom`);
    const recipe = (await res.json()).data || (await res.json());

    const allDetalles = recipe.etapas.flatMap(e => e.detalles || []);
    expect(allDetalles.length).toBeGreaterThanOrEqual(2);

    // Detalle 1: Debe resolver la base intermedia (WIP) vinculada
    const wipDetail = allDetalles.find(d => d.idProductoIntermedio || d.tipoInsumo === 'INTERMEDIO_WIP');
    expect(wipDetail).toBeDefined();
    expect(Number(wipDetail.cantidadRequerida)).toBeGreaterThan(0);
    expect(wipDetail.productoIntermedio).toBeDefined();
    expect(wipDetail.productoIntermedio.nombre).toBeDefined();

    // Detalle 2: Debe resolver el insumo de empaque primario
    const packagingDetail = allDetalles.find(d => d.idInsumo || d.tipoInsumo === 'EMPAQUE_BASE');
    expect(packagingDetail).toBeDefined();
    expect(Number(packagingDetail.cantidadRequerida)).toBeGreaterThan(0);
    expect(packagingDetail.insumo).toBeDefined();
    expect(packagingDetail.insumo.nombre).toBeDefined();
  });

  test('R-BOM-03: Consulta con ID inexistente retorna 404 Not Found', async ({ request }) => {
    const dummyId = '00000000-0000-0000-0000-000000000000';
    const res = await request.get(`${API_BASE}/recipes/${dummyId}/bom`);
    expect(res.status()).toBe(404);
  });
});
