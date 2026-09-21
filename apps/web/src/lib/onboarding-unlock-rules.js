/**
 * @file onboarding-unlock-rules.js
 * @module lib/onboarding-unlock-rules
 * @description Utilidad centralizada de permisos de navegación según el avance en la puesta en marcha (Onboarding).
 * Evalúa si una ruta está activa o bloqueada según los pasos completados (0 a 6).
 *
 * Cadena de valor MANNÁ:
 * - Rutas libres (Paso 0-1): /dashboard, /alarms, /catalog/presentations, /catalog/supplies, /catalog/suppliers, /commercial/clients
 * - Requiere Insumos/Proveedores (Paso 2): /catalog/supplier-prices, /operations/purchases
 * - Requiere Insumos + Presentaciones (Paso 3): /operations/inventory, /catalog/products, /catalog/recipes
 * - Requiere Receta (Paso 4): /operations/production, /operations/lots
 * - Requiere Producción/Lotes (Paso 5): /commercial/sales, /commercial/payments, /commercial/expenses
 */

/**
 * Matriz de reglas de desbloqueo progresivo
 */
const ROUTE_REQUIREMENTS = [
  // Paso 2: Requiere que Paso 1 (Presentaciones + Insumos + Proveedores base) esté listo
  {
    path: '/catalog/supplier-prices',
    requiredStep: 2,
    requiredStepText: 'Insumos y Proveedores (Paso 2)'
  },
  {
    path: '/operations/purchases',
    requiredStep: 2,
    requiredStepText: 'Insumos y Proveedores (Paso 2)'
  },

  // Paso 3: Requiere Insumos + Presentaciones registradas
  {
    path: '/operations/inventory',
    requiredStep: 3,
    requiredStepText: 'Insumos y Presentaciones (Paso 3)'
  },
  {
    path: '/catalog/products',
    requiredStep: 3,
    requiredStepText: 'Insumos y Presentaciones (Paso 3)'
  },
  {
    path: '/catalog/recipes',
    requiredStep: 3,
    requiredStepText: 'Insumos y Presentaciones (Paso 3)'
  },

  // Paso 4: Requiere Receta formulada
  {
    path: '/operations/production',
    requiredStep: 4,
    requiredStepText: 'Receta y Formulación (Paso 4)'
  },
  {
    path: '/operations/lots',
    requiredStep: 4,
    requiredStepText: 'Receta y Formulación (Paso 4)'
  },

  // Paso 5: Requiere Producción / Lotes
  {
    path: '/commercial/sales',
    requiredStep: 5,
    requiredStepText: 'Producción y Lotes de Producto (Paso 5)'
  },
  {
    path: '/commercial/payments',
    requiredStep: 5,
    requiredStepText: 'Producción y Lotes de Producto (Paso 5)'
  },
  {
    path: '/commercial/expenses',
    requiredStep: 5,
    requiredStepText: 'Producción y Lotes de Producto (Paso 5)'
  },
  {
    path: '/commercial/goals',
    requiredStep: 5,
    requiredStepText: 'Producción y Lotes de Producto (Paso 5)'
  }
];

/**
 * Evalúa si una ruta está activa o bloqueada en función del estado de onboarding.
 *
 * @param {string} routePath - Ruta solicitada (e.g. '/operations/purchases')
 * @param {object|null} onboardingStatus - Objeto retornado por useOnboardingStatus (data)
 * @returns {{ isUnlocked: boolean, requiredStepText: string }}
 */
export function isRouteUnlocked(routePath, onboardingStatus) {
  // Si no hay información de onboarding o la planta ya completó el 100%, todo está desbloqueado
  if (!onboardingStatus || onboardingStatus.isCompleted) {
    return { isUnlocked: true, requiredStepText: '' };
  }

  // Normalizar ruta sin query params ni slash final
  const cleanPath = (routePath || '').split('?')[0].replace(/\/$/, '') || '/';

  // Buscar si la ruta o prefijo tiene requerimientos específicos
  const rule = ROUTE_REQUIREMENTS.find(
    (r) => cleanPath === r.path || cleanPath.startsWith(`${r.path}/`)
  );

  // Si no tiene regla explícita, se considera ruta libre
  if (!rule) {
    return { isUnlocked: true, requiredStepText: '' };
  }

  // currentStep indica el paso en el que se encuentra la planta actualmente (1-indexed).
  // Si el usuario ya completó o superó el requiredStep, o si completedStepsCount >= requiredStep, está desbloqueado.
  const currentStep = Number(onboardingStatus.currentStep) || 1;
  const completedStepsCount = Number(onboardingStatus.completedStepsCount) || 0;

  // Un paso X está habilitado si la planta se encuentra en el paso X o posterior (currentStep >= requiredStep),
  // o si los pasos completados cubren el prerrequisito anterior (completedStepsCount >= requiredStep - 1).
  const isUnlocked = currentStep >= rule.requiredStep || completedStepsCount >= (rule.requiredStep - 1);

  return {
    isUnlocked: Boolean(isUnlocked),
    requiredStepText: rule.requiredStepText
  };
}
