/**
 * @file productionCosting.js
 * @module operations/production/utils
 * @description Utilidades de costeo, estimación de tiempo y sugerencia de lote para producción.
 * @responsibility Calcular costo total, unitario, faltante financiero, tiempo de proceso y código de lote sugerido.
 * @usedBy apps/web/src/app/operations/production/components/*
 */

/**
 * Calcula los totales de costeo y faltantes financieros a partir del BOM de la receta.
 * @param {Array} bom - Lista de insumos y materiales simulados del BOM.
 * @param {number} qty - Cantidad a producir planificada.
 * @returns {Object} Resumen financiero calculado.
 */
export function calculateProductionFinances(bom = [], qty = 1) {
  let costoTotalLote = 0;
  let costoFaltanteTotal = 0;

  const enrichedBom = (bom || []).map((item) => {
    const costoUnit = Number(
      item.costoUnitario ??
      item.ultimoPrecio ??
      item.costoPromedio ??
      (item.requeridoTeorico > 0 && item.costoTeorico ? item.costoTeorico / item.requeridoTeorico : 0) ??
      0
    );
    const reqTeorico = Number(item.requeridoTeorico) || 0;
    const subtotal = reqTeorico * costoUnit;
    const faltante = Number(item.faltante) || 0;
    const subtotalFaltante = faltante * costoUnit;

    costoTotalLote += subtotal;
    if (faltante > 0) {
      costoFaltanteTotal += subtotalFaltante;
    }

    return {
      ...item,
      costoUnitarioCalculado: costoUnit,
      subtotalCalculado: subtotal,
      subtotalFaltante: subtotalFaltante
    };
  });

  const cantidadNum = Number(qty) || 0;
  const costoUnitarioPorLitro = cantidadNum > 0 ? costoTotalLote / cantidadNum : 0;

  return {
    costoTotalLote,
    costoUnitarioPorLitro,
    costoFaltanteTotal,
    enrichedBom
  };
}

/**
 * Suma los tiempos estándar de las etapas activas de una receta técnica.
 * @param {Object} recipe - Objeto de receta con sus etapas.
 * @returns {string} Tiempo formateado ej. "⏱ 8h 30m" o "⏱ Sin estimar".
 */
export function calculateRecipeProcessTime(recipe) {
  if (!recipe || !recipe.etapas || recipe.etapas.length === 0) {
    return '⏱ Sin estimar';
  }

  const totalMinutos = recipe.etapas.reduce((acc, etapa) => {
    if (etapa.activo === false) return acc;
    return acc + (Number(etapa.tiempoEstandarMin) || 0);
  }, 0);

  if (totalMinutos === 0) {
    return '⏱ Inmediato';
  }

  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  if (horas === 0) {
    return `⏱ ${minutos}m`;
  }
  if (minutos === 0) {
    return `⏱ ${horas}h`;
  }
  return `⏱ ${horas}h ${minutos}m`;
}

/**
 * Genera el código de lote sugerido según estándar LOT-[YYYYMMDD]-[SEQ].
 * @param {Date|string} [date] - Fecha de producción.
 * @param {number|string} [sequence=1] - Número de secuencia del lote del día.
 * @returns {string} Código sugerido de lote (ej: "LOT-20260914-001").
 */
export function generateSuggestedLotCode(date = new Date(), sequence = 1) {
  const d = date instanceof Date ? date : new Date(date);
  const validDate = isNaN(d.getTime()) ? new Date() : d;

  const yyyy = validDate.getFullYear();
  const mm = String(validDate.getMonth() + 1).padStart(2, '0');
  const dd = String(validDate.getDate()).padStart(2, '0');

  const seqStr = String(sequence).padStart(3, '0');
  return `LOT-${yyyy}${mm}${dd}-${seqStr}`;
}
