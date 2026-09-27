/**
 * @file supplyTraceability.js
 * @module catalog/supplies/utils
 * @description Evalúa la trazabilidad operativa y contable de un insumo para control de borrado seguro.
 * @responsibility Calcular dependencias en compras, inventario, recetas, lotes y órdenes de compra.
 */

export function checkSupplyTraceability(item) {
  if (!item) {
    return { hasTraceability: false, count: 0, stock: 0, reasons: [] };
  }

  const counts = item._count || {};
  const compras = counts.detallesCompra || 0;
  const movimientos = counts.movimientos || 0;
  const recetas = counts.detallesReceta || 0;
  const produccion = counts.detallesProduccion || 0;
  const lotes = counts.lotes || 0;
  const ordenes = counts.ordenCompraItems || 0;

  const stockActual = Number(
    item.stockActual !== undefined
      ? item.stockActual
      : (item.inventario?.cantidadActual ?? item.stock ?? 0)
  );

  const totalMoves = compras + movimientos + recetas + produccion + lotes + ordenes;
  const hasTraceability = totalMoves > 0 || stockActual > 0;

  const reasons = [];
  if (stockActual > 0) reasons.push(`Stock en bodega: ${stockActual} ${item.unidadBase || ''}`);
  if (compras > 0) reasons.push(`${compras} compras registradas`);
  if (movimientos > 0) reasons.push(`${movimientos} movimientos de kardex`);
  if (recetas > 0) reasons.push(`Usado en ${recetas} recetas`);
  if (produccion > 0) reasons.push(`Consumido en ${produccion} baches de producción`);
  if (lotes > 0) reasons.push(`Asociado a ${lotes} lotes`);
  if (ordenes > 0) reasons.push(`${ordenes} órdenes de compra`);

  return {
    hasTraceability,
    totalMoves,
    stockActual,
    reasons,
    canDelete: !item.activo && !hasTraceability
  };
}
