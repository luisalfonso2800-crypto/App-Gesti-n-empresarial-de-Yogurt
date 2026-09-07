import { Injectable, Dependencies, NotFoundException, BadRequestException } from '@nestjs/common';
import { SuppliersRepository } from './suppliers.repository';

@Injectable()
@Dependencies(SuppliersRepository)
export class SuppliersService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findActive() {
    return this.repository.findActive();
  }

  async findOne(id) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  async create(createDto) {
    const { nombre, nitCedula } = createDto;
    const existing = await this.repository.findByNombreOrNit(nombre, nitCedula);
    if (existing) {
      if (existing.nitCedula === nitCedula) {
        throw new BadRequestException(`El NIT/Cédula ${nitCedula} ya se encuentra registrado.`);
      }
      throw new BadRequestException(`El proveedor con razón social ${nombre} ya se encuentra registrado.`);
    }
    return this.repository.create(createDto);
  }

  async update(id, updateDto) {
    await this.findOne(id);
    return this.repository.update(id, updateDto);
  }

  async remove(id) {
    await this.findOne(id);
    return this.repository.remove(id);
  }
}
