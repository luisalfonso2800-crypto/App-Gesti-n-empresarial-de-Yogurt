/**
 * @file purchaseCalculations.js
 * @module operations/purchases/new/utils
 * @description Funciones puras de cálculo matemático de subtotales, IVA y totales para órdenes y compras directas.
 * @responsibility Calcular montos sin IVA, discriminación de impuestos y totales consolidados por línea y orden.
 * @usedBy apps/web/src/app/operations/purchases/new/hooks/useFormPhaseData.js
 * @dependencies none
 */

/**
 * Calcula los importes financieros (subtotal sin IVA, IVA y total con IVA) de una fila individual de compra.
 * @param {Object} row - Fila con empaques, precioUnitario, tieneIva, porcentajeIva, precioIncluyeIva
 * @returns {Object} Desglose financiero normalizado
 */
export function calculateRowFinancials(row) {
  const empaquesNum = parseInt(row.empaques, 10) || 0;
  const precioUnitarioNum = parseInt(row.precioUnitario, 10) || 0;
  const tieneIva = row.tieneIva !== undefined ? Boolean(row.tieneIva) : true;
  const pctIva = tieneIva ? (Number(row.porcentajeIva !== undefined ? row.porcentajeIva : 19) || 0) : 0;
  const precioIncluyeIva = row.precioIncluyeIva !== undefined ? Boolean(row.precioIncluyeIva) : true;

  let subtotalSinIva = 0;
  let montoIva = 0;
  let subtotalConIva = 0;

  if (!tieneIva) {
    subtotalSinIva = precioUnitarioNum * empaquesNum;
    montoIva = 0;
    subtotalConIva = subtotalSinIva;
  } else if (tieneIva && precioIncluyeIva) {
    subtotalConIva = precioUnitarioNum * empaquesNum;
    subtotalSinIva = pctIva > 0 ? (subtotalConIva / (1 + (pctIva / 100))) : subtotalConIva;
    montoIva = subtotalConIva - subtotalSinIva;
  } else {
    subtotalSinIva = precioUnitarioNum * empaquesNum;
    montoIva = subtotalSinIva * (pctIva / 100);
    subtotalConIva = subtotalSinIva + montoIva;
  }

  return {
    subtotalSinIva,
    montoIva,
    subtotalConIva,
    subtotal: Math.round(subtotalConIva),
    tieneIva,
    porcentajeIva: pctIva,
    precioIncluyeIva
  };
}

/**
 * Calcula los totales consolidados de una lista de detalles de compra y flete.
 * @param {Array} items - Lista de detalles
 * @param {string|number} flete - Valor del flete
 * @returns {Object} Totales consolidados redondeados
 */
export function calculatePurchaseTotals(items = [], flete = 0) {
  const totals = items.reduce((acc, d) => {
    const fin = calculateRowFinancials(d);
    return {
      totalSinIva: acc.totalSinIva + fin.subtotalSinIva,
      totalIva: acc.totalIva + fin.montoIva,
      totalCompra: acc.totalCompra + fin.subtotalConIva
    };
  }, { totalSinIva: 0, totalIva: 0, totalCompra: 0 });

  const rawFlete = String(flete || '').replace(/\D/g, '');
  const fleteNum = parseInt(rawFlete, 10) || 0;
  const totalCompraRound = Math.round(totals.totalCompra);

  return {
    totalSinIvaCompra: Math.round(totals.totalSinIva),
    totalIvaCompra: Math.round(totals.totalIva),
    totalCompra: totalCompraRound,
    fleteNum,
    totalConFlete: totalCompraRound + fleteNum
  };
}
