/**
 * @file system.service.js
 * @module system
 * @description Servicio de lógica de negocio para diagnóstico del sistema y estado de onboarding.
 * @responsibility Calcular paso actual del onboarding cronológico de la cadena de valor y porcentaje de completitud.
 * @usedBy apps/api/src/system/system.controller.js
 * @dependencies apps/api/src/system/system.repository.js
 */
import { Injectable, Dependencies } from '@nestjs/common';
import { SystemRepository } from './system.repository';

@Injectable()
@Dependencies(SystemRepository)
export class SystemService {
  /**
   * @param {SystemRepository} repository
   */
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Determina el estado del onboarding según la secuencia cronológica de 6 pasos.
   * Paso 1: Configurar Formatos y Envases (Presentaciones > 0)
   * Paso 2: Registrar Insumos y Proveedores (Insumos > 0 && Proveedores > 0)
   * Paso 3: Ingresar Stock Inicial / Compras (suppliesWithStock > 0)
   * Paso 4: Ficha Comercial y Receta Técnica (products > 0 && recipes > 0)
   * Paso 5: Fabricar Primer Lote (finishedLotsWithStock > 0)
   * Paso 6: Emitir Primera Venta (sales > 0)
   * 
   * @returns {Promise<Object>} Estado de onboarding estructurado
   */
  async getOnboardingStatus() {
    const counts = await this.repository.getOnboardingCounts();

    // Evaluación de cada paso cronológico
    const step1Done = counts.presentations > 0;
    const step2Done = counts.supplies > 0 && counts.suppliers > 0;
    const step3Done = counts.suppliesWithStock > 0;
    const step4Done = counts.products > 0 && counts.recipes > 0;
    const step5Done = (counts.finishedLotsWithStock > 0 || (counts.cavaStock || 0) > 0 || counts.sales > 0);
    const step6Done = counts.sales > 0;

    const steps = [
      {
        step: 1,
        id: 'presentations',
        title: 'Configurar Formatos y Envases',
        route: '/catalog/presentations',
        completed: step1Done,
        detail: `${counts.presentations} envase(s) registrados`
      },
      {
        step: 2,
        id: 'supplies_suppliers',
        title: 'Registrar Insumos y Proveedores',
        route: (counts.supplies > 0 && counts.suppliers === 0) ? '/catalog/suppliers' : '/catalog/supplies',
        completed: step2Done,
        detail: (counts.supplies > 0 && counts.suppliers === 0)
          ? `${counts.supplies} insumo(s). Falta registrar al menos 1 proveedor`
          : `${counts.supplies} insumo(s), ${counts.suppliers} proveedor(es)`
      },
      {
        step: 3,
        id: 'inventory_purchases',
        title: 'Ingresar Stock Inicial / Compras',
        route: '/operations/inventory',
        completed: step3Done,
        detail: `${counts.suppliesWithStock} insumo(s) con inventario disponible`
      },
      {
        step: 4,
        id: 'products_recipes',
        title: 'Ficha Comercial y Receta Técnica',
        route: '/catalog/recipes',
        completed: step4Done,
        detail: `${counts.products} producto(s), ${counts.recipes} receta(s)`
      },
      {
        step: 5,
        id: 'production_lots',
        title: 'Fabricar Primer Lote (Producción)',
        route: '/operations/production',
        completed: step5Done,
        detail: `${counts.finishedLotsWithStock} lote(s) o saldo en cava`
      },
      {
        step: 6,
        id: 'sales',
        title: 'Emitir Primera Venta',
        route: '/commercial/sales',
        completed: step6Done,
        detail: `${counts.sales} venta(s) registradas`
      }
    ];

    // Determinar paso activo (el primer paso no completado, del 1 al 6)
    let currentStep = 6;
    if (!step1Done) currentStep = 1;
    else if (!step2Done) currentStep = 2;
    else if (!step3Done) currentStep = 3;
    else if (!step4Done) currentStep = 4;
    else if (!step5Done) currentStep = 5;
    else if (!step6Done) currentStep = 6;

    const completedStepsCount = steps.filter((s) => s.completed).length;
    const isCompleted = completedStepsCount === 6;
    const progressPercentage = Math.round((completedStepsCount / 6) * 100);

    return {
      counts,
      currentStep,
      isCompleted,
      progressPercentage,
      completedStepsCount,
      totalSteps: 6,
      steps
    };
  }
}
