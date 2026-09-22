/**
 * @file recipes.service.js
 * @module Recipes/Service
 * @description Capa de lógica de negocio para la gestión de recetas técnicas, listas de materiales (BOM) y validaciones de manufactura.
 * @responsibility Orquestar la creación, consulta, actualización y retiro de recetas aplicando guardas Poka-Yoke de planta (exclusividad de insumos, coherencia de unidades y empaque primario obligatorio).
 * @usedBy apps/api/src/recipes/recipes.controller.js
 * @dependencies @nestjs/common, apps/api/src/recipes/recipes.repository.js, apps/api/src/database/prisma.service.js
 */

import { Injectable, Dependencies, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { RecipesRepository } from './recipes.repository';
import { PrismaService } from '../database/prisma.service';

import { normalizeUnit, getMagnitude, areCompatible } from '../common/units/unit-registry';

/**
 * Normaliza y extrae la unidad canónica delegando en el registro canónico único (HAL-F1-05).
 * @param {string} str - Cadena de texto que representa una unidad de medida.
 * @returns {string} Clave canónica o cadena original en minúsculas.
 */
function extractCanonicalUnit(str) {
  if (!str || typeof str !== 'string') return '';
  return normalizeUnit(str) || str.trim().toLowerCase();
}

/**
 * Comprueba si dos unidades de medida son dimensionalmente compatibles entre sí (HAL-F1-06, HAL-F2-01, HAL-F2-04).
 * @param {string} unitA - Primera unidad de medida a comparar.
 * @param {string} unitB - Segunda unidad de medida a comparar.
 * @returns {boolean} Verdadero si ambas unidades representan la misma magnitud dimensional (MASA, VOLUMEN, CONTEO).
 */
function areUnitsCompatible(unitA, unitB) {
  return areCompatible(unitA, unitB);
}

@Injectable()
@Dependencies(RecipesRepository, PrismaService)
export class RecipesService {
  /**
   * Inicializa el servicio inyectando el repositorio de recetas y el cliente Prisma para validaciones directas.
   * @param {RecipesRepository} repository - Repositorio de persistencia transaccional de recetas.
   * @param {PrismaService} [prisma] - Instancia de PrismaService inyectada o resuelta desde el repositorio.
   */
  constructor(repository, prisma) {
    this.repository = repository;
    // Respaldo defensivo para obtener el cliente Prisma
    this.prisma = prisma || repository?.prisma;
  }

  /**
   * Consulta todas las recetas registradas en el sistema con su desglose de etapas y BOM.
   * @returns {Promise<Array>} Listado completo de recetas.
   */
  async findAll() {
    return this.repository.findAll();
  }

  /**
   * Consulta únicamente las recetas que se encuentran marcadas como activas en planta.
   * @returns {Promise<Array>} Listado de recetas activas.
   */
  async findActive() {
    return this.repository.findActive();
  }

  /**
   * Obtiene la ficha técnica y explosión de materiales de una receta por su identificador único.
   * @param {string} id - UUID de la receta.
   * @throws {NotFoundException} Si la receta no existe en el sistema.
   * @returns {Promise<Object>} Receta con etapas, detalles, insumos y productos asociados.
   */
  async findOne(id) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  /**
   * Consulta la estructura BOM (Bill of Materials) completa de una receta específica.
   * @param {string} id - UUID de la receta.
   * @returns {Promise<Object>} Estructura de materiales y etapas.
   */
  async findBom(id) {
    return this.findOne(id);
  }

  /**
   * Valida exhaustivamente las reglas de integridad estructural y de planta láctea para una receta:
   * 1. Cantidades requeridas estrictamente mayores a cero.
   * 2. Exclusividad obligatoria entre Insumo de proveedor vs Producto intermedio (WIP).
   * 3. Regla Poka-Yoke de empaque obligatorio para productos con presentación comercial.
   * 4. Coherencia dimensional entre unidades formuladas y unidades base de catálogo.
   *
   * @param {string} idProducto - UUID del producto terminado o semielaborado de la receta.
   * @param {Array} etapas - Listado de etapas con sus respectivos detalles de ingredientes.
   * @throws {BadRequestException} Si alguna regla de integridad o de planta es violada.
   * @throws {NotFoundException} Si el producto o insumos asociados no existen.
   */
  async validateRecipeIntegrity(idProducto, etapas) {
    // 1. Validar existencia y cargar ficha técnica del producto destino
    if (!idProducto) {
      throw new BadRequestException('El producto asociado a la receta es obligatorio');
    }

    const producto = await this.prisma.producto.findUnique({
      where: { id: idProducto },
      include: { presentacion: true }
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${idProducto} no encontrado`);
    }

    // 2. Extraer todos los detalles activos presentes en las etapas activas
    const activeDetalles = [];
    if (etapas && Array.isArray(etapas)) {
      for (const etapa of etapas) {
        // Solo considerar etapas activas o que no estén explícitamente marcadas como inactivas
        if (etapa && etapa.activo !== false && Array.isArray(etapa.detalles)) {
          for (const det of etapa.detalles) {
            // Solo considerar detalles activos o que no estén explícitamente desactivados
            if (det && det.activo !== false) {
              activeDetalles.push(det);
            }
          }
        }
      }
    }

    // 3. Validar para cada detalle: cantidad > 0, unidad no vacía y exclusividad Insumo vs WIP
    for (const det of activeDetalles) {
      const cant = Number(det.cantidadRequerida);
      if (isNaN(cant) || cant <= 0) {
        throw new BadRequestException('La cantidad requerida debe ser estrictamente mayor a 0');
      }

      if (!det.unidad || typeof det.unidad !== 'string' || det.unidad.trim() === '') {
        throw new BadRequestException('La unidad de medida no puede estar vacía');
      }

      const hasInsumo = Boolean(det.idInsumo);
      const hasWip = Boolean(det.idProductoIntermedio);

      // Regla de exclusividad estricta: exactamente uno debe estar presente
      if ((hasInsumo && hasWip) || (!hasInsumo && !hasWip)) {
        throw new BadRequestException(
          'Cada detalle de receta debe especificar un insumo comprado o un producto intermedio de planta, no ambos'
        );
      }
    }

    // 4. Cargar en lote los insumos y productos intermedios referenciados para validación cruzada
    const insumoIds = activeDetalles.filter(d => d.idInsumo).map(d => d.idInsumo);
    const wipIds = activeDetalles.filter(d => d.idProductoIntermedio).map(d => d.idProductoIntermedio);

    const [insumos, wipProducts] = await Promise.all([
      insumoIds.length > 0
        ? this.prisma.insumo.findMany({
            where: { id: { in: insumoIds } }
          })
        : [],
      wipIds.length > 0
        ? this.prisma.producto.findMany({
            where: { id: { in: wipIds } },
            include: {
              presentacion: true,
              recetas: {
                where: { activo: true },
                select: { unidadRendimiento: true }
              }
            }
          })
        : []
    ]);

    const insumoMap = new Map(insumos.map(i => [i.id, i]));
    const wipMap = new Map(wipProducts.map(p => [p.id, p]));

    // 5. Regla de negocio Poka-Yoke: Empaque obligatorio para productos con presentación comercial
    const presentacion = producto.presentacion;
    const tipoEnvase = (presentacion?.tipoEnvase || '').toUpperCase();
    const nombrePres = (presentacion?.nombre || '').toUpperCase();
    const categoriaProd = (producto.categoria || '').toUpperCase();
    const precioVentaNum = Number(producto.precioVenta) || 0;

    const isBulkOrWip = (
      tipoEnvase === 'TANQUE_GRANEL' ||
      nombrePres.includes('GRANEL') ||
      nombrePres.includes('WIP') ||
      categoriaProd === 'BASES_LACTEAS' ||
      categoriaProd === 'INSUMO_BASE_WIP' ||
      categoriaProd === 'INTERMEDIO_WIP' ||
      categoriaProd === 'DULCES_JALEAS' ||
      precioVentaNum === 0
    );

    const isComercial = Boolean(
      presentacion &&
      !isBulkOrWip
    );

    if (isComercial) {
      const hasEmpaque = activeDetalles.some(det => {
        // Criterio 1: Clasificado explícitamente como EMPAQUE_BASE
        if (det.tipoInsumo === 'EMPAQUE_BASE') {
          return true;
        }
        // Criterio 2: El insumo referenciado pertenece al catálogo de empaque o envases
        if (det.idInsumo) {
          const insumo = insumoMap.get(det.idInsumo);
          if (insumo) {
            const cat = (insumo.categoria || '').toUpperCase();
            const subcat = (insumo.subcategoria || '').toUpperCase();
            if (cat.includes('EMPAQUE') || subcat.includes('ENVASE') || subcat.includes('TAPA')) {
              return true;
            }
          }
        }
        return false;
      });

      if (!hasEmpaque) {
        throw new BadRequestException(
          'Toda receta de producto comercial requiere al menos un insumo de empaque primario (vaso, botella o tapa)'
        );
      }
    }

    // 6. Validación de concordancia de unidades dimensionales
    for (const det of activeDetalles) {
      if (det.idInsumo) {
        const insumo = insumoMap.get(det.idInsumo);
        if (!insumo) {
          throw new NotFoundException(`Insumo con ID ${det.idInsumo} no encontrado`);
        }

        // Comprobar coincidencia contra Insumo.unidadBase
        if (!areUnitsCompatible(det.unidad, insumo.unidadBase)) {
          throw new BadRequestException(
            `Inconcordancia de unidades dimensionales en planta: la unidad "${det.unidad}" requerida para el insumo "${insumo.nombre}" no coincide con su unidad base configurada ("${insumo.unidadBase}")`
          );
        }
      } else if (det.idProductoIntermedio) {
        const wip = wipMap.get(det.idProductoIntermedio);
        if (!wip) {
          throw new NotFoundException(`Producto intermedio con ID ${det.idProductoIntermedio} no encontrado`);
        }

        // Determinar las unidades de medida esperadas para el producto intermedio
        const expectedUnits = [];
        if (wip.recetas && wip.recetas.length > 0) {
          for (const r of wip.recetas) {
            if (r.unidadRendimiento) expectedUnits.push(r.unidadRendimiento);
          }
        }
        if (wip.presentacion?.nombre) {
          expectedUnits.push(wip.presentacion.nombre);
        }

        // Si es producto a granel o tanque, aceptar unidades de volumen y masa estándar (incluyendo siembra/inóculo en g/ml)
        const presTipo = (wip.presentacion?.tipoEnvase || '').toUpperCase();
        const presNom = (wip.presentacion?.nombre || '').toUpperCase();
        if (presTipo === 'TANQUE_GRANEL' || presNom.includes('GRANEL') || wip.categoria === 'INTERMEDIO_WIP' || wip.categoria === 'BASES_LACTEAS') {
          expectedUnits.push('Litros', 'Kilogramos', 'Gramos', 'Mililitros', 'g', 'ml', 'Unidades');
        }

        const isUnitValid = expectedUnits.length === 0 || expectedUnits.some(eu => areUnitsCompatible(det.unidad, eu));

        if (!isUnitValid) {
          const validOptions = [...new Set(expectedUnits.filter(Boolean))].join(', ');
          throw new BadRequestException(
            `Inconcordancia de unidades dimensionales en planta: la unidad "${det.unidad}" especificada para el producto intermedio "${wip.nombre}" no coincide con su unidad de medida configurada (${validOptions || 'Litros'})`
          );
        }
      }
    }
  }

  /**
   * Crea una nueva receta aplicando todas las guardas transaccionales de integridad de planta.
   * @param {Object} createDto - Datos de la receta, etapas y BOM.
   * @returns {Promise<Object>} Receta creada en persistencia.
   */
  async create(createDto) {
    // Validar integridad estructural y reglas de negocio antes de persistir
    await this.validateRecipeIntegrity(createDto.idProducto, createDto.etapas);
    return this.repository.create(createDto);
  }

  /**
   * Actualiza una receta existente verificando la integridad de las etapas modificadas y reglas Poka-Yoke.
   * @param {string} id - UUID de la receta a modificar.
   * @param {Object} updateDto - Cambios solicitados sobre la cabecera o etapas.
   * @returns {Promise<Object>} Receta actualizada.
   */
  async update(id, updateDto) {
    const existing = await this.findOne(id);
    const targetProductId = updateDto.idProducto || existing.idProducto;

    // Solo revalidar etapas si se envían nuevas etapas o si se altera el producto destino
    if (updateDto.etapas !== undefined) {
      await this.validateRecipeIntegrity(targetProductId, updateDto.etapas);
    } else if (updateDto.idProducto && updateDto.idProducto !== existing.idProducto) {
      await this.validateRecipeIntegrity(targetProductId, existing.etapas);
    }

    return this.repository.update(id, updateDto);
  }

  /**
   * Elimina físicamente una receta técnica si está desactivada y no cuenta con historial productivo.
   * @param {string} id - UUID de la receta.
   * @throws {ConflictException} Si la receta está activa, o si cuenta con órdenes de producción, lotes o uso como ingrediente.
   * @returns {Promise<Object>} Resultado de eliminación.
   */
  async remove(id) {
    const recipe = await this.findOne(id);

    if (recipe.activo) {
      throw new ConflictException(
        'La receta técnica debe estar desactivada antes de poder eliminarla. Desactívela primero.'
      );
    }

    const depCounts = await this.repository.countDependencies(id);
    if (depCounts && depCounts.total > 0) {
      throw new ConflictException(
        'No se puede eliminar la receta técnica porque cuenta con órdenes de producción, lotes fabricados o uso activo como ingrediente en otras fórmulas. Manténgala desactivada para preservar la trazabilidad.'
      );
    }

    await this.repository.hardDelete(id);
    return { success: true, message: 'Receta técnica eliminada exitosamente' };
  }
}
