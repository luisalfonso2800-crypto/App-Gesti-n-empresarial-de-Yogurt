/**
 * @file recipeHelpers.js
 * @module catalog/recipes/utils
 * @description Utilidades puras para formulación y lectura de planta en recetas técnicas.
 * @responsibility Generar narrativa en lenguaje de planta y formateo de horas digitales tipo reloj.
 * @usedBy apps/web/src/app/catalog/recipes/components/*
 */

/**
 * Genera dinámicamente un párrafo descriptivo en lenguaje natural de planta para una etapa.
 */
export function generateStageSummaryText(etapa, supplies = [], products = []) {
  if (!etapa) return '';
  const activeDetails = etapa.detalles?.filter(d => d.activo !== false) || [];
  let insumosPart = '';
  if (activeDetails.length === 0) {
    insumosPart = 'Fase de proceso térmico/espera sin adición de materiales físicos';
  } else {
    const itemsList = activeDetails.map(det => {
      let nombreItem = '';
      if (det.idProductoIntermedio) {
        const prod = products.find(p => String(p.id) === String(det.idProductoIntermedio));
        nombreItem = prod ? prod.nombre : 'BASE INTERMEDIA (WIP)';
      } else if (det.idInsumo) {
        const ins = supplies.find(s => String(s.id) === String(det.idInsumo));
        nombreItem = ins ? ins.nombre : 'INSUMO';
      } else {
        nombreItem = 'MATERIAL';
      }
      const cantNum = Number(det.cantidadRequerida) || 0;
      const cantFormateada = cantNum.toLocaleString('es-CO', { maximumFractionDigits: 4 });
      return `${cantFormateada} ${det.unidad || ''} de ${nombreItem}`.trim();
    });
    insumosPart = `Adición de: ${itemsList.join(', ')}`;
  }

  let tempPart = '';
  const tempMin = etapa.tempMinimaGrados !== '' && etapa.tempMinimaGrados !== null && etapa.tempMinimaGrados !== undefined ? Number(etapa.tempMinimaGrados) : null;
  const tempMax = etapa.tempMaximaGrados !== '' && etapa.tempMaximaGrados !== null && etapa.tempMaximaGrados !== undefined ? Number(etapa.tempMaximaGrados) : null;
  if (tempMin !== null && tempMax !== null && (tempMin > 0 || tempMax > 0)) {
    tempPart = tempMin === tempMax ? `a temperatura de ${tempMin}°C` : `manteniendo temperatura entre ${tempMin}°C y ${tempMax}°C`;
  } else if (tempMin !== null && tempMin > 0) {
    tempPart = `a temperatura de ${tempMin}°C`;
  } else if (tempMax !== null && tempMax > 0) {
    tempPart = `a temperatura máxima de ${tempMax}°C`;
  }

  let tiempoPart = '';
  const tiempoEst = Number(etapa.tiempoEstandarMin) || 0;
  const tMin = Number(etapa.tiempoMinimoMin) || 0;
  const tMax = Number(etapa.tiempoMaximoMin) || 0;
  if (tiempoEst > 0) {
    const horas = tiempoEst / 60;
    const horasFormatted = Number.isInteger(horas) ? horas : horas.toFixed(1);
    const sufijoHora = horas === 1 ? 'hora' : 'horas';
    const conversion = tiempoEst >= 60 ? ` (${horasFormatted} ${sufijoHora})` : '';
    tiempoPart = `durante ${tiempoEst} min${conversion}`;
  }
  if (tMin > 0 || tMax > 0) {
    const rangoStr = `rango admisible: ${tMin} a ${tMax} min`;
    tiempoPart = tiempoPart ? `${tiempoPart} (${rangoStr})` : `en ${rangoStr}`;
  }

  const clauses = [insumosPart];
  if (tempPart) clauses.push(tempPart);
  if (tiempoPart) clauses.push(tiempoPart);
  if (etapa.instrucciones && etapa.instrucciones.trim()) clauses.push(`para: ${etapa.instrucciones.trim()}`);
  let sentence = clauses.join(', ');
  return sentence.endsWith('.') ? sentence : `${sentence}.`;
}

/**
 * Convierte minutos numéricos en formato digital tipo reloj 00:00 h con desglose contextual.
 */
export function formatMinutesToDigitalClock(val) {
  const totalMins = Math.max(0, Math.floor(Number(val) || 0));
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const hh = hours.toString().padStart(2, '0');
  const mm = mins.toString().padStart(2, '0');
  if (totalMins === 0) return `${hh}:${mm} h`;
  if (hours === 0) return `${hh}:${mm} h (${mins} min)`;
  if (mins === 0) return `${hh}:${mm} h (${hours} h)`;
  return `${hh}:${mm} h (${hours} h ${mins} min)`;
}
