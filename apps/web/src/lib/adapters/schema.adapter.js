/**
 * @file schema.adapter.js
 * @module lib/adapters/schema.adapter
 * @description Adaptador canónico central para normalizar entidades de Prisma al modelo consumido por el frontend.
 * @responsibility Transformar de forma pura campos de BD (cantidadActual, cantidadOz, cantidadMl, unidadBase) a aliases de UI (stock, capacidadLitros, volumenOzMl).
 * @usedBy apps/web/src/app/operations/inventory/hooks/useInventoryPageData.js
 * @dependencies none
 */

/**
 * Normaliza una entidad de Producto/InventarioProducto con valores por defecto consistentes.
 * @param {Object} product - Producto recibido desde la API
 * @returns {Object|null} Producto con campos normalizados
 */
export function normalizeProduct(product) {
  if (!product) return null;
  const rawProduct = product.producto || product;
  const stockReal = Number(
    product.inventario?.cantidadActual ??
    product.cantidadActual ??
    rawProduct.inventario?.cantidadActual ??
    product.stock ??
    0
  );
  const presentacion = rawProduct.presentacion || product.presentacion || {};
  const capacidadLitros = presentacion.cantidadMl
    ? Number(presentacion.cantidadMl) / 1000
    : (presentacion.cantidadOz ? (Number(presentacion.cantidadOz) * 29.5735) / 1000 : 0);

  return {
    ...product,
    producto: rawProduct,
    stock: stockReal,
    stockActual: stockReal,
    stockCava: stockReal,
    capacidadLitros,
    volumenOzMl: presentacion.nombre || (presentacion.cantidadOz ? `${presentacion.cantidadOz} oz` : `${presentacion.cantidadMl} ml`),
    costoUnitario: Number(product.costoPromedio ?? rawProduct.costoPromedio ?? product.costoUnitario ?? 0)
  };
}

/**
 * Normaliza una entidad de Insumo/Inventario con valores por defecto consistentes.
 * @param {Object} supply - Insumo recibido desde la API
 * @returns {Object|null} Insumo con campos normalizados
 */
export function normalizeSupply(supply) {
  if (!supply) return null;
  const stockReal = Number(supply.inventario?.cantidadActual ?? supply.cantidadActual ?? supply.stock ?? 0);
  return {
    ...supply,
    stock: stockReal,
    stockActual: stockReal,
    unidadMedida: supply.unidadBase || supply.unidadMedida || 'Unidad'
  };
}
