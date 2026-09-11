import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AnalyticsEngineService } from './analytics.engine.service';
import { ForecastEngineService } from './forecast.engine.service.js';
import { LearningEngineService } from './learning.engine.service.js';
import { SimulationEngineService } from './simulation.engine.service.js';
import { ProductionOptimizerService } from './production.optimizer.service.js';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DashboardController],
  providers: [DashboardService, AnalyticsEngineService, SimulationEngineService, ProductionOptimizerService, ForecastEngineService, LearningEngineService],
})
export class DashboardModule {}
