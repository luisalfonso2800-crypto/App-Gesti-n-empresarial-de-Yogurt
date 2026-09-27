import { Injectable, Dependencies, NotFoundException, ConflictException } from '@nestjs/common';
import { SuppliesRepository } from './supplies.repository';

@Injectable()
@Dependencies(SuppliesRepository)
export class SuppliesService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findActive() {
    return this.repository.findActive();
  }

  async findBrands() {
    return this.repository.findBrands();
  }

  async findOne(id) {
    const supply = await this.repository.findById(id);
    if (!supply) {
      throw new NotFoundException(`Supply with ID ${id} not found`);
    }
    return supply;
  }

  async create(createDto) {
    return this.repository.create(createDto);
  }

  async update(id, updateDto) {
    await this.findOne(id);
    return this.repository.update(id, updateDto);
  }

  async remove(id) {
    const supply = await this.findOne(id);

    if (supply.activo) {
      throw new ConflictException(
        'El insumo se encuentra activo. Solo puede eliminar un insumo si primero lo desactiva y no cuenta con trazabilidad.'
      );
    }

    const relCounts = await this.repository.countDependencies(id);
    const counts = relCounts?._count || {};
    const totalDependencies =
      (counts.detallesCompra || 0) +
      (counts.movimientos || 0) +
      (counts.detallesReceta || 0) +
      (counts.detallesProduccion || 0) +
      (counts.lotes || 0) +
      (counts.ordenCompraItems || 0);

    if (totalDependencies > 0) {
      throw new ConflictException(
        'El insumo cuenta con historial de compras, inventario, recetas o producción (trazabilidad) y no puede ser eliminado. Debe mantenerse desactivado para preservar la integridad contable.'
      );
    }

    await this.repository.hardDelete(id);
    return { success: true, message: 'Insumo eliminado exitosamente' };
  }
}
