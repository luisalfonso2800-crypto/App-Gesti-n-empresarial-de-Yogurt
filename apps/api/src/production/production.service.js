import { Injectable, Dependencies, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductionRepository } from './production.repository';

@Injectable()
@Dependencies(ProductionRepository)
export class ProductionService {
  constructor(repository) {
    this.repository = repository;
  }

  async getRecipeBom(idReceta, cantidad, variantes) {
    return this.repository.getRecipeBom(idReceta, cantidad, variantes);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundException('Production not found');
    return item;
  }

  async create(createDto) {
    // Validar disponibilidad neta (físico - comprometido) antes de crear la orden
    if (createDto.detalles && Array.isArray(createDto.detalles)) {
      for (const det of createDto.detalles) {
        const reqTeorico = Number(det.cantidadTeorica) || 0;
        if (reqTeorico <= 0) continue;

        if (det.idInsumo) {
          const { stockDisponible, stockFisico, stockComprometido } =
            await this.repository.getNetInsumoAvailability(det.idInsumo);
          if (stockDisponible < reqTeorico) {
            throw new BadRequestException(
              `Stock neto insuficiente para insumo. Requerido: ${reqTeorico}, Físico: ${stockFisico}, Comprometido: ${stockComprometido}, Disponible: ${stockDisponible}`
            );
          }
        } else if (det.idProductoIntermedio) {
          const { stockDisponible, stockFisico, stockComprometido } =
            await this.repository.getNetIntermediateAvailability(det.idProductoIntermedio, det.unidad);
          if (stockDisponible < reqTeorico) {
            throw new BadRequestException(
              `Stock neto insuficiente para producto intermedio/WIP. Requerido: ${reqTeorico}, Físico: ${stockFisico}, Comprometido: ${stockComprometido}, Disponible: ${stockDisponible}`
            );
          }
        }
      }
    }
    return this.repository.createWithTransaction(createDto);
  }

  async complete(id, data) {
    return this.repository.completeProduction(id, data);
  }

  async start(id) {
    return this.repository.startProduction(id);
  }

  async createPurchaseOrderFromShortage(data) {
    return this.repository.createPurchaseOrderFromShortage(data);
  }
}

