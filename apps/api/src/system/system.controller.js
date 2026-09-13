/**
 * @file system.controller.js
 * @module system
 * @description Controlador REST para endpoints generales de sistema y diagnóstico ligero.
 * @responsibility Exponer endpoint GET /system/onboarding-status para el onboarding wizard.
 * @usedBy apps/api/src/system/system.module.js
 * @dependencies apps/api/src/system/system.service.js
 */
import { Controller, Dependencies, Get } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller('system')
@Dependencies(SystemService)
export class SystemController {
  /**
   * @param {SystemService} systemService
   */
  constructor(systemService) {
    this.systemService = systemService;
  }

  /**
   * Endpoint de diagnóstico rápido que retorna los conteos clave y el estado del onboarding.
   * GET /api/v1/system/onboarding-status
   * @returns {Promise<Object>}
   */
  @Get('onboarding-status')
  async getOnboardingStatus() {
    return this.systemService.getOnboardingStatus();
  }
}
