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

/**
 * Convierte minutos numéricos en formato compacto de horas (hh:mm h).
 * Retorna null si el valor no es un número válido o está vacío.
 */
export function formatMinutesToHours(min) {
  if (min === '' || min === null || min === undefined) return null;
  const num = parseInt(min, 10);
  if (isNaN(num) || num < 0) return null;
  const hours = Math.floor(num / 60);
  const mins = num % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} h`;
}

/**
 * Formatea el rango de tolerancia en horas para visualización inline.
 */
export function formatToleranceRangeHours(minVal, maxVal) {
  const minH = formatMinutesToHours(minVal);
  const maxH = formatMinutesToHours(maxVal);
  if (minH && maxH) return `✦ (${minH} - ${maxH})`;
  if (minH) return `✦ (${minH})`;
  if (maxH) return `✦ (${maxH})`;
  return null;
}

/**
 * Convierte grados Celsius a Fahrenheit redondeado.
 * Retorna null si el valor no es válido o está vacío.
 */
export function celsiusToFahrenheit(c) {
  if (c === '' || c === null || c === undefined) return null;
  const num = parseFloat(c);
  if (isNaN(num)) return null;
  return Math.round(num * 1.8 + 32);
}

/**
 * Formatea el rango de temperatura en Fahrenheit para visualización inline.
 */
export function formatTemperatureRangeF(minC, maxC) {
  const minF = celsiusToFahrenheit(minC);
  const maxF = celsiusToFahrenheit(maxC);
  if (minF !== null && maxF !== null) return `✦ (${minF}°F - ${maxF}°F)`;
  if (minF !== null) return `✦ (${minF}°F)`;
  if (maxF !== null) return `✦ (${maxF}°F)`;
  return null;
}

/**
 * Determina si un producto es comercial terminado (no granel / base de tanque).
 */
export function isCommercialProduct(product) {
  if (!product) return false;
  const isGranel = product.presentacion?.tipoEnvase === 'TANQUE_GRANEL' ||
    product.presentacion?.nombre?.toUpperCase().includes('GRANEL') ||
    ['BASES_LACTEAS', 'INSUMO_BASE_WIP', 'DULCES_JALEAS'].includes(product.categoria);
  return !isGranel;
}

/**
 * Crea la primera etapa predeterminada 'Recepción y Verificación de Yogurt Base'
 * para productos comerciales que derivan del Yogurt Base.
 */
export function createCommercialBaseStage(products = []) {
  const baseProduct = products.find(p => {
    const nom = (p.nombre || '').toUpperCase();
    const cat = (p.categoria || '').toUpperCase();
    return nom.includes('BASE') || cat.includes('BASE') || p.presentacion?.tipoEnvase === 'TANQUE_GRANEL';
  });

  return {
    nombre: 'Recepción y Verificación de Yogurt Base',
    orden: 1,
    tiempoEstandarMin: 15,
    tiempoMinimoMin: 10,
    tiempoMaximoMin: 20,
    tempMinimaGrados: 4,
    tempMaximaGrados: 8,
    instrucciones: 'Recepción, verificación y trasvase de Yogurt Base desde tanque refrigerado de origen',
    activo: true,
    detalles: baseProduct ? [{
      idInsumo: null,
      idProductoIntermedio: baseProduct.id,
      cantidadRequerida: 1,
      unidad: 'Litros',
      mermaPorcentaje: 0,
      esOpcional: false,
      grupoVariante: 'NINGUNO',
      tipoInsumo: 'INTERMEDIO_WIP',
      activo: true
    }] : []
  };
}

/**
 * Plantilla de 6 etapas industriales estandarizadas para Elaboración de Jalea / Dulce de Fruta.
 */
export const PLANTILLA_JALEA_FRUTA = [
  {
    nombre: 'Recepción y selección de fruta',
    orden: 1,
    tiempoEstandarMin: 15,
    tiempoMinimoMin: 10,
    tiempoMaximoMin: 25,
    tempMinimaGrados: 8,
    tempMaximaGrados: 25,
    instrucciones: 'Inspección organoléptica, descarte de fruta no apta y pesaje inicial (1.000 g fruta)',
    activo: true,
    detalles: [{
      idInsumo: null,
      idProductoIntermedio: null,
      cantidadRequerida: 1000,
      unidad: 'Gramos',
      mermaPorcentaje: 0,
      esOpcional: false,
      grupoVariante: 'NINGUNO',
      tipoInsumo: 'BASE',
      observaciones: 'Fruta fresca seleccionada',
      activo: true
    }]
  },
  {
    nombre: 'Lavado y preparación de fruta',
    orden: 2,
    tiempoEstandarMin: 15,
    tiempoMinimoMin: 10,
    tiempoMaximoMin: 25,
    tempMinimaGrados: 10,
    tempMaximaGrados: 25,
    instrucciones: 'Lavado con agua potable, desinfección, pelado/despalillado y troceado (1.000 g fruta preparada)',
    activo: true,
    detalles: [{
      idInsumo: null,
      idProductoIntermedio: null,
      cantidadRequerida: 1000,
      unidad: 'Gramos',
      mermaPorcentaje: 0,
      esOpcional: false,
      grupoVariante: 'NINGUNO',
      tipoInsumo: 'BASE',
      observaciones: 'Fruta desinfectada y troceada',
      activo: true
    }]
  },
  {
    nombre: 'Trituración y preparación de la mezcla',
    orden: 3,
    tiempoEstandarMin: 10,
    tiempoMinimoMin: 5,
    tiempoMaximoMin: 15,
    tempMinimaGrados: 10,
    tempMaximaGrados: 30,
    instrucciones: 'Molienda o triturado de pulpa y homogenización en frío con azúcar (1.000 g fruta + 300 g Azúcar)',
    activo: true,
    detalles: [
      {
        idInsumo: null,
        idProductoIntermedio: null,
        cantidadRequerida: 1000,
        unidad: 'Gramos',
        mermaPorcentaje: 0,
        esOpcional: false,
        grupoVariante: 'NINGUNO',
        tipoInsumo: 'BASE',
        observaciones: 'Pulpa de fruta triturada',
        activo: true
      },
      {
        idInsumo: null,
        idProductoIntermedio: null,
        cantidadRequerida: 300,
        unidad: 'Gramos',
        mermaPorcentaje: 0,
        esOpcional: false,
        grupoVariante: 'NINGUNO',
        tipoInsumo: 'COMPLEMENTO',
        observaciones: 'Azúcar blanca / refinada',
        activo: true
      }
    ]
  },
  {
    nombre: 'Cocción y ajuste de la jalea',
    orden: 4,
    tiempoEstandarMin: 25,
    tiempoMinimoMin: 20,
    tiempoMaximoMin: 35,
    tempMinimaGrados: 85,
    tempMaximaGrados: 95,
    instrucciones: 'Concentración térmica con agitación continua, adición de agua (50 ml) y ajuste con ácido cítrico (3 g) hasta punto de jalea',
    activo: true,
    detalles: [
      {
        idInsumo: null,
        idProductoIntermedio: null,
        cantidadRequerida: 50,
        unidad: 'Mililitros',
        mermaPorcentaje: 0,
        esOpcional: false,
        grupoVariante: 'NINGUNO',
        tipoInsumo: 'COMPLEMENTO',
        observaciones: 'Agua potable tratada',
        activo: true
      },
      {
        idInsumo: null,
        idProductoIntermedio: null,
        cantidadRequerida: 3,
        unidad: 'Gramos',
        mermaPorcentaje: 0,
        esOpcional: false,
        grupoVariante: 'NINGUNO',
        tipoInsumo: 'COMPLEMENTO',
        observaciones: 'Ácido Cítrico (estandarización y pectina)',
        activo: true
      }
    ]
  },
  {
    nombre: 'Reposo y enfriamiento a temperatura ambiente',
    orden: 5,
    tiempoEstandarMin: 40,
    tiempoMinimoMin: 30,
    tiempoMaximoMin: 50,
    tempMinimaGrados: 20,
    tempMaximaGrados: 30,
    instrucciones: 'Reposo en reposador cubierto para descenso térmico gradual a temperatura ambiente (nivel del mar) antes del envasado',
    activo: true,
    detalles: []
  },
  {
    nombre: 'Envasado y conservación de jalea',
    orden: 6,
    tiempoEstandarMin: 15,
    tiempoMinimoMin: 10,
    tiempoMaximoMin: 25,
    tempMinimaGrados: 20,
    tempMaximaGrados: 30,
    instrucciones: 'Envasado en recipientes limpios/esterilizados, sellado hermético y rotulado para conservación o integración a producción',
    activo: true,
    detalles: []
  }
];

/**
 * Genera etapas de envasado comercial dinámicamente basadas en la configuración del wizard completo.
 */
export function generatePackagingStagesFromWizard({
  presentation,
  hasFruitInBottom = false,
  fruitGrams = 30,
  hasSugar = false,
  sweetenerType = 'Azúcar',
  hasDomeOrSpoon = false,
  cerealRecipeId = null,
  hasManualLotLabelling = true
}) {
  const presDesc = presentation
    ? `${presentation.nombre || 'Envase'} (${presentation.cantidadOz ? `${presentation.cantidadOz} oz / ` : ''}${presentation.cantidadMl || 0} ml)`
    : 'Envase comercial';

  const stages = [];
  let currentOrder = 1;

  // Etapa 1: Alistamiento y pre-rotulado de envases (con instrucciones para pegar etiquetas y sellos)
  const etapa1Nombre = hasManualLotLabelling
    ? 'Alistamiento, Etiquetado y Sellos de Seguridad en Envases'
    : 'Alistamiento y preparación de envases';

  const etapa1Instrucciones = hasManualLotLabelling
    ? `Inspección física, sanitización, fijación de etiqueta frontal, sello y adhesivo con logo en recipientes ${presDesc}`
    : `Inspección física, sanitización y ordenamiento de recipientes ${presDesc} en mesa de envasado`;

  stages.push({
    nombre: etapa1Nombre,
    orden: currentOrder++,
    tiempoEstandarMin: 15,
    tiempoMinimoMin: 10,
    tiempoMaximoMin: 20,
    tempMinimaGrados: 15,
    tempMaximaGrados: 25,
    instrucciones: etapa1Instrucciones,
    activo: true,
    detalles: []
  });

  // Etapa 2 (Condicional): Dosificación de fruta/jalea pesada en fondo
  if (hasFruitInBottom) {
    const gramajeTxt = fruitGrams ? `${fruitGrams} g` : 'porción calculada';
    stages.push({
      nombre: 'Dosificación de jalea en fondo de envase',
      orden: currentOrder++,
      tiempoEstandarMin: 20,
      tiempoMinimoMin: 15,
      tiempoMaximoMin: 25,
      tempMinimaGrados: 4,
      tempMaximaGrados: 12,
      instrucciones: `Dosificación de jalea/dulce de fruta en el fondo de cada recipiente (${gramajeTxt} por unidad)`,
      activo: true,
      detalles: []
    });
  }

  // Etapa 3 (Condicional): Acondicionamiento y endulzado del yogurt base
  if (hasSugar) {
    stages.push({
      nombre: 'Acondicionamiento y endulzado del yogurt base',
      orden: currentOrder++,
      tiempoEstandarMin: 15,
      tiempoMinimoMin: 10,
      tiempoMaximoMin: 20,
      tempMinimaGrados: 4,
      tempMaximaGrados: 8,
      instrucciones: `Incorporación y homogenización homogénea en frío con endulzante: ${sweetenerType || 'Azúcar'}`,
      activo: true,
      detalles: []
    });
  }

  // Etapa 4: Dosificación y vertido del yogurt en los recipientes preparados
  stages.push({
    nombre: `Dosificación y vertido del yogurt en recipientes preparados (${presDesc})`,
    orden: currentOrder++,
    tiempoEstandarMin: 30,
    tiempoMinimoMin: 20,
    tiempoMaximoMin: 40,
    tempMinimaGrados: 4,
    tempMaximaGrados: 8,
    instrucciones: `Vertido volumétrico de yogurt en ${presDesc} previamente alistados hasta nivel de aforo`,
    activo: true,
    detalles: []
  });

  // Etapa 5 (Condicional o estándar con acople): Acople de copita de cereal porcionada (WIP) y tapas
  if (hasDomeOrSpoon) {
    const cerealDetalle = cerealRecipeId ? [{
      idInsumo: null,
      idProductoIntermedio: null,
      idRecetaIntermedia: cerealRecipeId,
      cantidadRequerida: 1,
      unidad: 'Unidad',
      mermaPorcentaje: 0,
      esOpcional: false,
      grupoVariante: 'NINGUNO',
      tipoInsumo: 'INTERMEDIO_WIP',
      observaciones: 'Copita de cereal porcionada (WIP)',
      activo: true
    }] : [];

    stages.push({
      nombre: 'Acople de copita de cereal porcionada (WIP) y tapas',
      orden: currentOrder++,
      tiempoEstandarMin: 20,
      tiempoMinimoMin: 15,
      tiempoMaximoMin: 30,
      tempMinimaGrados: 4,
      tempMaximaGrados: 8,
      instrucciones: 'Colocación de tapilla de seguridad, sellado y ensamble de copita de cereal porcionada (WIP) con cuchara',
      activo: true,
      detalles: cerealDetalle
    });
  } else {
    stages.push({
      nombre: 'Colocación de tapas y sellado hermético',
      orden: currentOrder++,
      tiempoEstandarMin: 15,
      tiempoMinimoMin: 10,
      tiempoMaximoMin: 25,
      tempMinimaGrados: 4,
      tempMaximaGrados: 8,
      instrucciones: 'Termosellado de foil/tapilla de seguridad y colocado de sobretapa hermética',
      activo: true,
      detalles: []
    });
  }

  // Etapa 6: Sellado final de seguridad y traslado a cava refrigerada (2–4 °C)
  stages.push({
    nombre: 'Sellado final de seguridad y traslado a cava refrigerada (2–4 °C)',
    orden: currentOrder++,
    tiempoEstandarMin: 10,
    tiempoMinimoMin: 5,
    tiempoMaximoMin: 15,
    tempMinimaGrados: 2,
    tempMaximaGrados: 4,
    instrucciones: 'Inspección de sello hermético, codificación de lote en frío, estibado en canastillas y traslado inmediato a cava refrigerada (2–4 °C)',
    activo: true,
    detalles: []
  });

  return stages;
}

/**
 * Computa recursivamente el Cost Roll-up de una receta técnica, integrando
 * insumos directos y costos transferidos de bases semielaboradas (WIP).
 *
 * @param {Object} formData Datos de la receta en edición
 * @param {Array} supplies Catálogo de insumos disponibles
 * @param {Array} products Catálogo de productos disponibles
 * @param {Array} prices Lista de precios activos de proveedores
 * @param {Array} recipes Catálogo de recetas técnicas existentes
 * @param {Set} visited Set para prevenir bucles de recursión circular
 * @returns {{ totalCost: number, costRawSupplies: number, costWipBases: number, costPerUnit: number, hasWipFallback: boolean }}
 */
export function calculateRecipeCosts(formData, supplies = [], products = [], prices = [], recipes = [], visited = new Set()) {
  if (!formData || !formData.etapas) {
    return { totalCost: 0, costRawSupplies: 0, costWipBases: 0, costPerUnit: 0, hasWipFallback: false };
  }

  // Prevenir recursión circular si una receta se referencia a sí misma indirectamente
  const currentRecipeKey = formData.id ? String(formData.id) : (formData.idProducto ? `prod_${formData.idProducto}` : null);
  if (currentRecipeKey && visited.has(currentRecipeKey)) {
    return { totalCost: 0, costRawSupplies: 0, costWipBases: 0, costPerUnit: 0, hasWipFallback: false };
  }
  const nextVisited = new Set(visited);
  if (currentRecipeKey) nextVisited.add(currentRecipeKey);

  const priceMap = Array.isArray(prices)
    ? prices.reduce((acc, p) => ({ ...acc, [p.idInsumo]: p.costoUnidadBase }), {})
    : {};

  let costRawSupplies = 0;
  let costWipBases = 0;
  let hasWipFallback = false;

  formData.etapas.forEach(etapa => {
    if (etapa.activo === false) return;
    etapa.detalles?.forEach(det => {
      if (det.esOpcional || det.activo === false) return;

      const req = parseFloat(det.cantidadRequerida) || 0;
      const merma = parseFloat(det.mermaPorcentaje) || 0;
      const totalReq = req * (1 + (merma / 100));

      if (det.idProductoIntermedio) {
        // Ítem es una Base WIP (producto semielaborado)
        let unitCostWip = 0;
        // 1. Buscar receta técnica activa para dicho producto intermedio
        const baseRecipe = Array.isArray(recipes)
          ? recipes.find(r => r.activo !== false && String(r.idProducto) === String(det.idProductoIntermedio))
          : null;

        if (baseRecipe && Number(baseRecipe.rendimientoBase) > 0) {
          // 2. Costo unitario proyectado de la receta base (Costo Total Receta Base / Rendimiento Base)
          const baseRollup = calculateRecipeCosts(baseRecipe, supplies, products, prices, recipes, nextVisited);
          unitCostWip = baseRollup.costPerUnit;
        }

        // 4. Fallback preventivo si la receta no existe o no tiene costo
        if (unitCostWip <= 0) {
          const prod = products.find(p => String(p.id) === String(det.idProductoIntermedio));
          const prodFallback = Number(prod?.costoBase ?? prod?.inventario?.costoPromedio ?? prod?.inventarioProducto?.costoPromedio ?? 0);
          if (prodFallback > 0) {
            unitCostWip = prodFallback;
          } else {
            unitCostWip = 0;
            hasWipFallback = true;
          }
        }

        // 3. Multiplicar cantidadRequerida * costoUnitarioWip * (1 + merma/100)
        costWipBases += (totalReq * unitCostWip);
      } else if (det.idInsumo) {
        // Ítem es un insumo directo de bodega
        const insumoRecord = supplies.find(s => String(s.id) === String(det.idInsumo));
        const priceFromMap = parseFloat(priceMap[det.idInsumo]);
        const unitCostRaw = !isNaN(priceFromMap) && priceFromMap > 0
          ? priceFromMap
          : Number(insumoRecord?.costoBase || 0);

        costRawSupplies += (totalReq * unitCostRaw);
      }
    });
  });

  const totalCost = costRawSupplies + costWipBases;
  const yieldNum = parseFloat(formData.rendimientoBase) || 0;
  const costPerUnit = yieldNum > 0 ? (totalCost / yieldNum) : 0;

  return {
    totalCost,
    costRawSupplies,
    costWipBases,
    costPerUnit,
    hasWipFallback
  };
}

/**
 * Valida los prerrequisitos Poka-Yoke antes de abrir el modal resumen o enviar la receta.
 */
export function validateRecipeSubmission(formData, isCommercialWithoutBulk, isMissingCommercialPackaging) {
  if (!formData.idProducto) return 'Debe seleccionar el producto a fabricar.';
  if (!formData.rendimientoBase || Number(formData.rendimientoBase) <= 0) return 'Debe ingresar un rendimiento base mayor a cero.';
  if (isCommercialWithoutBulk) return 'Debe existir al menos un producto base a granel en el catálogo.';
  if (isMissingCommercialPackaging) return 'Debe agregar al menos un insumo de empaque primario a la receta.';
  return null;
}


