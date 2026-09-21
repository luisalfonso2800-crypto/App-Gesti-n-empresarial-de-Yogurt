import { Injectable, Dependencies, NotFoundException, BadRequestException } from '@nestjs/common';
import { GoalsRepository } from './goals.repository';

@Injectable()
@Dependencies(GoalsRepository)
export class GoalsService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    const goals = await this.repository.findAll();
    return this.computeAllGoalsMetrics(goals);
  }

  async findOne(id) {
    const item = await this.repository.findById(id);
    if (!item || !item.activo) throw new NotFoundException('Goal not found');
    const all = await this.repository.findAll();
    const computed = await this.computeAllGoalsMetrics(all);
    const found = computed.find(g => g.id === id);
    return found || this.computeSingleGoalMetrics(item, 0);
  }

  async create(createDto) {
    if (!createDto.titulo || !createDto.valorObjetivo || !createDto.fechaInicio || !createDto.fechaFin) {
      throw new BadRequestException('Faltan campos obligatorios para la meta');
    }
    const created = await this.repository.create(createDto);
    return this.findOne(created.id);
  }

  async update(id, updateDto) {
    const item = await this.repository.findById(id);
    if (!item || !item.activo) throw new NotFoundException('Goal not found');
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async delete(id) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundException('Goal not found');
    return this.repository.delete(id);
  }

  async contribute(id, contributeDto) {
    const item = await this.repository.findById(id);
    if (!item || !item.activo) throw new NotFoundException('Goal not found');
    const monto = Number(contributeDto.monto);
    if (isNaN(monto) || monto <= 0) {
      throw new BadRequestException('El monto del aporte debe ser mayor a cero');
    }
    await this.repository.createAporte(id, monto, contributeDto.nota || null);
    return this.findOne(id);
  }

  async getAvailableFunds() {
    const recaudos = await this.repository.getAllTimeRecaudos();
    const gastos = await this.repository.getAllTimeGastos();
    const aportesReservados = await this.repository.getTotalAportesAllMetas();

    const utilidadNetaOperativa = Math.max(0, recaudos - gastos);
    const fondosDisponibles = Math.max(0, utilidadNetaOperativa - aportesReservados);

    return {
      recaudosTotales: recaudos,
      gastosTotales: gastos,
      utilidadNetaOperativa,
      aportesReservados,
      fondosDisponibles
    };
  }

  async computeAllGoalsMetrics(goals) {
    let fondosCascadaRemanentes = 0;
    const { fondosDisponibles } = await this.getAvailableFunds();
    fondosCascadaRemanentes = fondosDisponibles;

    const enriched = [];
    for (const goal of goals) {
      const { metricData, remanenteUpdated } = await this.evaluateGoalValue(goal, fondosCascadaRemanentes);
      fondosCascadaRemanentes = remanenteUpdated;
      enriched.push(this.formatGoalOutput(goal, metricData));
    }
    return enriched;
  }

  async evaluateGoalValue(goal, remanenteCascada) {
    const inicio = new Date(goal.fechaInicio);
    const fin = new Date(goal.fechaFin);
    const valorObjetivo = Number(goal.valorObjetivo) || 1;
    let valorActual = 0;
    let newRemanente = remanenteCascada;

    if (goal.ambito === 'PERSONAL_FAMILIAR') {
      const estrategia = goal.estrategiaAsignacion || 'MANUAL';
      if (estrategia === 'MANUAL') {
        valorActual = await this.repository.getTotalAportesByMeta(goal.id);
      } else if (estrategia === 'PORCENTAJE') {
        const recaudoRango = await this.repository.getSumRecaudos(inicio, fin);
        const pct = Number(goal.porcentajeFlujo || 0);
        valorActual = (recaudoRango * pct) / 100;
      } else if (estrategia === 'CASCADA') {
        const cupo = Math.min(valorObjetivo, Math.max(0, remanenteCascada));
        valorActual = cupo;
        newRemanente = Math.max(0, remanenteCascada - cupo);
      } else {
        valorActual = await this.repository.getTotalAportesByMeta(goal.id);
      }
    } else {
      switch (goal.tipoMetrica) {
        case 'VENTAS_TOTALES':
          valorActual = await this.repository.getSumVentas(inicio, fin);
          break;
        case 'RECAUDO_CARTERA':
          valorActual = await this.repository.getSumRecaudos(inicio, fin);
          break;
        case 'PRODUCCION_LITROS':
          valorActual = await this.repository.getSumProduccionLts(inicio, fin);
          break;
        case 'CONTROL_GASTOS':
          valorActual = await this.repository.getSumGastos(inicio, fin);
          break;
        default:
          valorActual = await this.repository.getSumVentas(inicio, fin);
          break;
      }
    }

    return {
      metricData: { valorActual, valorObjetivo },
      remanenteUpdated: newRemanente
    };
  }

  formatGoalOutput(goal, { valorActual, valorObjetivo }) {
    const now = new Date();
    const inicio = new Date(goal.fechaInicio);
    const fin = new Date(goal.fechaFin);

    const rawProgress = (valorActual / valorObjetivo) * 100;
    const progresoPorcentaje = Math.min(100, Math.max(0, Math.round(rawProgress * 100) / 100));

    const totalDuration = fin.getTime() - inicio.getTime();
    let tiempoTranscurridoPorcentaje = 0;
    if (totalDuration > 0) {
      const elapsed = now.getTime() - inicio.getTime();
      const rawElapsed = (elapsed / totalDuration) * 100;
      tiempoTranscurridoPorcentaje = Math.min(100, Math.max(0, Math.round(rawElapsed * 100) / 100));
    }

    let estadoBotanico = 'SEMILLA';
    if (progresoPorcentaje >= 100) estadoBotanico = 'COSECHADA';
    else if (progresoPorcentaje >= 71) estadoBotanico = 'FLORACION';
    else if (progresoPorcentaje >= 26) estadoBotanico = 'EN_CRECIMIENTO';
    else estadoBotanico = 'SEMILLA';

    let estadoRitmo = 'EN_RITMO';
    if (progresoPorcentaje >= 100) {
      estadoRitmo = 'CUMPLIDA';
    } else if (tiempoTranscurridoPorcentaje <= 5 && progresoPorcentaje === 0) {
      estadoRitmo = 'EN_RITMO';
    } else {
      const diferencia = progresoPorcentaje - tiempoTranscurridoPorcentaje;
      if (diferencia >= 10) estadoRitmo = 'ADELANTADA';
      else if (diferencia >= -10) estadoRitmo = 'EN_RITMO';
      else if (diferencia >= -25) estadoRitmo = 'EN_RIESGO';
      else estadoRitmo = 'ATRASADA';
    }

    return {
      ...goal,
      valorActual,
      valorObjetivo,
      progresoPorcentaje,
      tiempoTranscurridoPorcentaje,
      estadoRitmo,
      estadoBotanico
    };
  }
}
