/**
 * @file supplyConstants.js
 * @module components/catalog/parts
 * @description Constantes de categorías, subcategorías, unidades y empaques para el catálogo de insumos.
 * @responsibility Centralizar taxonomía oficial de insumos de planta para evitar repetición en vistas.
 * @usedBy apps/web/src/components/catalog/SupplyModal.jsx
 */

export const CATEGORIAS_INSUMOS = {
  MATERIA_PRIMA: {
    label: 'Materia Prima',
    subcategorias: [
      'Base Láctea',
      'Cultivos y Fermentos',
      'Endulzantes',
      'Frutas y Preparados',
      'Estabilizantes y Espesantes',
      'Aromas y Colorantes'
    ]
  },
  MATERIAL_EMPAQUE: {
    label: 'Material de Empaque',
    subcategorias: [
      'Envases Primarios',
      'Cierres y Sellos',
      'Identificación',
      'Empaque Secundario'
    ]
  },
  INOCUIDAD_SANITIZACION: {
    label: 'Inocuidad y Sanitización',
    subcategorias: [
      'Detergentes CIP',
      'Ácidos de Neutralización',
      'Desinfectantes Terminales',
      'Aseo General'
    ]
  },
  DOTACION_EPP: {
    label: 'Dotación y EPP',
    subcategorias: [
      'Protección Sanitaria'
    ]
  },
  MANTENIMIENTO_OPERATIVO: {
    label: 'Mantenimiento Operativo',
    subcategorias: [
      'Grado Alimenticio'
    ]
  }
};

export const EMPAQUE_OPTIONS = [
  { id: 'UNIDAD', label: 'UNIDAD' },
  { id: 'ENVASE', label: 'ENVASE' },
  { id: 'BOLSA', label: 'BOLSA' },
  { id: 'CAJA', label: 'CAJA' },
  { id: 'BULTO', label: 'BULTO' },
  { id: 'BOTELLA', label: 'BOTELLA' },
  { id: 'BIDÓN', label: 'BIDÓN' },
  { id: 'CANASTILLA', label: 'CANASTILLA' },
  { id: 'OTRO', label: 'OTRO' }
];

export const UNIDAD_BASE_OPTIONS = [
  { id: 'kg', label: 'Kilogramo (kg)' },
  { id: 'g', label: 'Gramo (g)' },
  { id: 'L', label: 'Litro (L)' },
  { id: 'ml', label: 'Mililitro (ml)' },
  { id: 'oz', label: 'Onza (oz)' },
  { id: 'und', label: 'Unidad / Pieza (und)' }
];

export const UNIT_NAMES = {
  'kg': 'kilogramos',
  'g': 'gramos',
  'L': 'litros',
  'ml': 'mililitros',
  'oz': 'onzas',
  'und': 'unidades'
};
