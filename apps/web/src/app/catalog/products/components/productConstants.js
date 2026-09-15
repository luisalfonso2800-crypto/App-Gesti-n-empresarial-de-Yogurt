/**
 * @file productConstants.js
 * @module catalog/products/constants
 * @description Constantes y guías didácticas de categorías y canales de venta para productos de planta y comerciales.
 * @responsibility Proveer las listas maestras de categorías WIP, comerciales y canales de distribución.
 * @usedBy apps/web/src/app/catalog/products/components/*
 */

export const CATEGORIAS_WIP = [
  { id: 'BASES_LACTEAS', label: 'Bases Lácteas (Yogur base blanco, leche cultivada en tanque)' },
  { id: 'DULCES_JALEAS', label: 'Dulces y Jaleas (Fruta cocida, jaleas en marmita)' },
  { id: 'TOPPING_CEREAL', label: 'Topping / Cereal Porcionado (WIP)' },
  { id: 'INSUMO_BASE_WIP', label: 'Otras Premezclas de Planta (Jarabes, estabilizantes, no lácteos)' }
];

export const HINTS_CATEGORIA_WIP = {
  BASES_LACTEAS: { icon: '🥛', text: 'Yogur natural base, leche fermentada o base para yogur griego antes de filtrar o saborizar. Se almacena por litros en tanques o cavas.' },
  DULCES_JALEAS: { icon: '🍓', text: 'Preparados artesanales de fruta (fresa, mora, melocotón, maracuyá) cocinados en paila o marmita para mezclar o fondear el yogur.' },
  TOPPING_CEREAL: { icon: '🥣', text: 'Copitas, domos o recipientes dosificados de cereal, granola o aditamentos porcionados para ensamble comercial en planta.' },
  INSUMO_BASE_WIP: { icon: '⚙️', text: 'Premezclas líquidas intermedias que no sean leche ni dulce (ej. jarabes invertidos, mezclas de féculas o neutros).' }
};

export const CATEGORIAS_COMERCIALES = [
  { id: 'LACTEOS', label: 'Lácteos Terminados (Comercial)' },
  { id: 'POSTRES', label: 'Postres y Otros' },
  { id: 'BEBIDAS', label: 'Bebidas' }
];

export const CANALES_VENTA = [
  { id: 'USO_INTERNO', label: 'Solo Planta / Transformación (Uso interno)' },
  { id: 'MIXTO', label: 'Mixto (Base de Planta + Venta Directa)' },
  { id: 'B2B', label: 'Tiendas y Mayoristas (B2B)' },
  { id: 'B2C', label: 'Mostrador y Cliente Final (B2C)' },
  { id: 'AMBOS', label: 'Comercial Completo (Mayoristas + Mostrador)' }
];

export const HINTS_CANAL_VENTA = {
  USO_INTERNO: { icon: '🏭', text: 'Exclusivo para consumo interno de planta. No genera precio al público y se utiliza como ingrediente en las recetas de producción.' },
  MIXTO: { icon: '🔄', text: 'Doble propósito: sirve como base para elaborar otros productos en planta y también permite despachos o venta directa a granel.' },
  B2B: { icon: '🏬', text: 'Orientado a despachos por volumen para tiendas, distribuidores o clientes mayoristas.' },
  B2C: { icon: '🛒', text: 'Orientado a venta unitaria directa al consumidor final en punto de venta o mostrador.' },
  AMBOS: { icon: '🌐', text: 'Habilitado tanto para pedidos mayoristas (B2B) como para venta directa en mostrador (B2C).' }
};
