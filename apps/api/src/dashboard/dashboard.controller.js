import { Controller, Dependencies, Get, Post, Bind, Body } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ProductionOptimizerService } from './production.optimizer.service.js';
import { SimulationEngineService } from './simulation.engine.service.js';
import { LearningEngineService } from './learning.engine.service.js';

@Controller('dashboard')
@Dependencies(DashboardService, ProductionOptimizerService, SimulationEngineService, LearningEngineService)
export class DashboardController {
  constructor(dashboardService, productionOptimizer, simulationEngine, learningEngine) {
    this.dashboardService = dashboardService;
    this.productionOptimizer = productionOptimizer;
    this.simulationEngine = simulationEngine;
    this.learningEngine = learningEngine;
  }

  @Get('full-telemetry')
  async getFullTelemetry() {
    return await this.dashboardService.getFullTelemetry();
  }

  @Get('alarms')
  async getAlarms() {
    return await this.dashboardService.getAlarms();
  }

  @Get('production-recommendations')
  async getProductionRecommendations() {
    return await this.productionOptimizer.getDailyProductionPlan();
  }

  @Post('simulate-batch')
  @Bind(Body())
  async simulateBatch(body) {
    const { productoId, cantidadSimulada, precioSimulado } = body || {};
    return await this.simulationEngine.simulateBatch(
      productoId,
      Number(cantidadSimulada || 100),
      precioSimulado ? Number(precioSimulado) : null
    );
  }

  @Post('decisions/log')
  @Bind(Body())
  async logDecision(body) {
    return await this.learningEngine.logDecision(body);
  }

  @Get('decisions/history')
  async getDecisionsHistory() {
    return await this.learningEngine.getDecisionsHistory();
  }

  @Get('kpis')
  getKpis() {
    return this.dashboardService.getKpis();
  }

  @Get('rotation')
  getRotation() {
    return this.dashboardService.getRotation();
  }
}
