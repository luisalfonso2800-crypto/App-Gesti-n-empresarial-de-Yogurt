/**
 * @file production.repository.js
 * @module Production/Repository
 * @description Repositorio de persistencia transaccional para órdenes de manufactura, explosión de materiales (BOM) y liquidación de costos.
 * @responsibility Administrar la creación de órdenes de producción con snapshots inmutables de receta, trazabilidad de lotes y redondeo de consumo discreto de empaques.
 * @usedBy apps/api/src/production/production.service.js
 * @dependencies @nestjs/common, apps/api/src/database/prisma.service.js
 */

import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

/**
 * Familias de unidades de medida discretas e indivisibles en planta.
 * Requieren redondeo estricto hacia arriba (Math.ceil) para evitar fraccionamiento físico en kardex.
 */
const UNIDADES_DISCRETAS = ['UNIDAD', 'UNIDADES', 'UND', 'PZA', 'PIEZA', 'VASO', 'BOTELLA', 'TAPA', 'ETIQUETA'];

const includeProduction = {
  detalles: {
    include: {
      insumo: true,
      productoIntermedio: {
        include: {
          presentacion: true,
          inventario: true
        }
      }
    }
  },
  lotes: {
    include: {
      lotePadre: true,
      lotesHijos: true
    }
  },
  producto: {
    include: {
      presentacion: true,
      inventario: true
    }
  }
};

@Injectable()
@Dependencies(PrismaService)
export class ProductionRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.produccion.findMany({
      include: includeProduction,
      orderBy: { fechaProduccion: 'desc' }
    });
  }

  async findById(id) {
    return this.prisma.produccion.findUnique({
      where: { id },
      include: includeProduction
    });
  }

  async getRecipeBom(idReceta, cantidadProduccion, variantesQuery) {
    const receta = await this.prisma.receta.findUnique({
      where: { id: idReceta },
      include: {
        etapas: {
          where: { activo: true },
          include: {
            detalles: {
              where: { activo: true },
              include: {
                insumo: true,
                productoIntermedio: {
                  include: {
                    presentacion: true,
                    inventario: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!receta) throw new Error("Receta no encontrada");

    const variantes = variantesQuery ? variantesQuery.split(',') : [];
    const factorEscala = cantidadProduccion / (Number(receta.rendimientoBase) || 1);

    const bom = [];

    for (const etapa of receta.etapas) {
      for (const det of etapa.detalles) {
        if (det.esOpcional && !variantes.includes(det.grupoVariante)) {
          continue; // Skip optional items not in active variants
        }

        let reqTeorico = Number(det.cantidadRequerida) * factorEscala;
        const merma = Number(det.mermaPorcentaje) || 0;
        reqTeorico = reqTeorico * (1 + (merma / 100));

        const esUnidadDiscreta = UNIDADES_DISCRETAS.includes((det.unidad || '').toUpperCase().trim());
        const cantidadFinal = esUnidadDiscreta ? Math.ceil(reqTeorico) : Number(reqTeorico.toFixed(4));
        reqTeorico = cantidadFinal;

        if (det.idProductoIntermedio) {
          // Consultar inventario de producto intermedio / semielaborado WIP
          const invProd = await this.prisma.inventarioProducto.findUnique({
            where: { idProducto: det.idProductoIntermedio }
          });

          // Buscar TODOS los lotes semielaborados activos para agregación FEFO
          const activeWipLots = await this.prisma.lote.findMany({
            where: {
              OR: [
                { idProducto: det.idProductoIntermedio, cantidadDisponible: { gt: 0 } },
                { tipoLote: 'SEMIELABORADO_WIP', cantidadDisponible: { gt: 0 } }
              ]
            },
            orderBy: [
              { fechaVencimiento: 'asc' },
              { fechaProduccion: 'asc' }
            ]
          });

          const detUnidad = (det.unidad || '').toLowerCase().trim();
          const isReqSmallUnit = detUnidad === 'g' || detUnidad === 'ml' || detUnidad === 'gramos';

          let totalStockCalculado = 0;
          const lotesDisponibles = [];

          for (const lw of activeWipLots) {
            const rawLoteQty = Number(lw.cantidadDisponible) || 0;
            const loteUnidad = (lw.unidad || '').toLowerCase().trim();
            const isLoteInLiters = loteUnidad === 'litros' || loteUnidad === 'l' || (!loteUnidad && rawLoteQty <= 100);

            let qtyConvertida = rawLoteQty;
            if (isReqSmallUnit && isLoteInLiters) {
              qtyConvertida = rawLoteQty * 1000;
            } else if (!isReqSmallUnit && (loteUnidad === 'g' || loteUnidad === 'ml')) {
              qtyConvertida = rawLoteQty / 1000;
            }

            totalStockCalculado += qtyConvertida;
            lotesDisponibles.push({
              id: lw.id,
              codigoLote: lw.codigoLote || lw.id.slice(0, 8),
              cantidadDisponible: rawLoteQty,
              cantidadConvertida: qtyConvertida,
              unidad: lw.unidad,
              costoUnitario: Number(lw.costoUnitario) || 0,
              fechaVencimiento: lw.fechaVencimiento
            });
          }

          if (totalStockCalculado === 0 && invProd) {
            const rawInv = Number(invProd.cantidadActual) || 0;
            totalStockCalculado = isReqSmallUnit ? rawInv * 1000 : rawInv;
          }

          // Calcular stock comprometido en órdenes activas
          const stockComprometido = await this.getCommittedStock({
            idProductoIntermedio: det.idProductoIntermedio,
            isReqSmallUnit
          });

          const stockFisico = totalStockCalculado;
          const stockActual = Math.max(0, stockFisico - stockComprometido);
          const faltante = Math.max(0, reqTeorico - stockActual);

          const loteWip = lotesDisponibles[0] || null;
          let costoUnitario = loteWip && Number(loteWip.costoUnitario) > 0
            ? Number(loteWip.costoUnitario)
            : (invProd && Number(invProd.costoPromedio) > 0 ? Number(invProd.costoPromedio) : 0);

          if (isReqSmallUnit && costoUnitario > 100) {
            costoUnitario = costoUnitario / 1000;
          }

          const costoTeorico = reqTeorico * costoUnitario;

          bom.push({
            idInsumo: null,
            idProductoIntermedio: det.idProductoIntermedio,
            nombreInsumo: det.productoIntermedio ? `${det.productoIntermedio.nombre} (Base / WIP)` : 'Producto Semielaborado',
            etapa: etapa.nombre,
            tipoInsumo: det.tipoInsumo || 'INOCULO_WIP',
            requeridoTeorico: reqTeorico,
            unidad: det.unidad || 'Litros',
            stockFisico: stockFisico,
            stockComprometido: stockComprometido,
            stockActual: stockActual,
            stockDisponible: stockActual,
            faltante: faltante,
            ok: faltante === 0,
            costoTeorico: costoTeorico,
            costoUnitario: costoUnitario,
            esProductoIntermedio: true,
            idLoteSugerido: loteWip ? loteWip.id : null,
            codigoLoteSugerido: loteWip ? loteWip.codigoLote : null,
            lotesDisponibles: lotesDisponibles
          });
        } else {
          // Consultar inventario de insumo tradicional
          const inv = await this.prisma.inventario.findUnique({ where: { idInsumo: det.idInsumo } });
          const stockFisico = inv ? Number(inv.cantidadActual) : 0;

          // Calcular stock comprometido en órdenes activas
          const stockComprometido = await this.getCommittedStock({
            idInsumo: det.idInsumo
          });

          const stockActual = Math.max(0, stockFisico - stockComprometido);
          const faltante = Math.max(0, reqTeorico - stockActual);

          // Find cost from latest provider prices or inventory average
          const price = await this.prisma.precioProveedor.findFirst({
            where: { idInsumo: det.idInsumo, activo: true },
            orderBy: { fechaRegistro: 'desc' }
          });
          const costoUnitario = price
            ? Number(price.costoUnidadBase)
            : (inv && Number(inv.costoPromedio) > 0 ? Number(inv.costoPromedio) : 0);
          const costoTeorico = reqTeorico * costoUnitario;

          bom.push({
            idInsumo: det.idInsumo,
            idProductoIntermedio: null,
            nombreInsumo: det.insumo ? det.insumo.nombre : 'Insumo',
            etapa: etapa.nombre,
            tipoInsumo: det.tipoInsumo || 'BASE',
            requeridoTeorico: reqTeorico,
            unidad: det.unidad,
            stockFisico: stockFisico,
            stockComprometido: stockComprometido,
            stockActual: stockActual,
            stockDisponible: stockActual,
            faltante: faltante,
            ok: faltante === 0,
            costoTeorico: costoTeorico,
            costoUnitario: costoUnitario,
            esProductoIntermedio: false
          });
        }
      }
    }

    return bom;
  }

  async getCommittedStock({ idInsumo, idProductoIntermedio, isReqSmallUnit = false, excludeProduccionId = null }) {
    const activeStates = ['EN_PROCESO', 'PLANIFICADA', 'EN_FERMENTACION'];
    const whereClause = {
      produccion: {
        estado: { in: activeStates }
      }
    };

    if (excludeProduccionId) {
      whereClause.produccion.id = { not: excludeProduccionId };
    }

    if (idInsumo) {
      whereClause.idInsumo = idInsumo;
    } else if (idProductoIntermedio) {
      whereClause.idProductoIntermedio = idProductoIntermedio;
    } else {
      return 0;
    }

    const activeDetails = await this.prisma.detalleProduccion.findMany({
      where: whereClause,
      select: {
        cantidadTeorica: true,
        unidad: true
      }
    });

    let committed = 0;
    for (const d of activeDetails) {
      const qty = Number(d.cantidadTeorica) || 0;
      if (idProductoIntermedio) {
        const u = (d.unidad || '').toLowerCase().trim();
        const detailIsSmall = u === 'g' || u === 'ml' || u === 'gramos';
        if (isReqSmallUnit && !detailIsSmall) {
          committed += qty * 1000;
        } else if (!isReqSmallUnit && detailIsSmall) {
          committed += qty / 1000;
        } else {
          committed += qty;
        }
      } else {
        committed += qty;
      }
    }

    return committed;
  }

  async getNetInsumoAvailability(idInsumo, excludeProduccionId = null) {
    const inv = await this.prisma.inventario.findUnique({ where: { idInsumo } });
    const stockFisico = inv ? Number(inv.cantidadActual) : 0;
    const stockComprometido = await this.getCommittedStock({ idInsumo, excludeProduccionId });
    const stockDisponible = Math.max(0, stockFisico - stockComprometido);
    return { stockFisico, stockComprometido, stockDisponible };
  }

  async getNetIntermediateAvailability(idProductoIntermedio, unidad, excludeProduccionId = null) {
    const detUnidad = (unidad || '').toLowerCase().trim();
    const isReqSmallUnit = detUnidad === 'g' || detUnidad === 'ml' || detUnidad === 'gramos';

    const invProd = await this.prisma.inventarioProducto.findUnique({
      where: { idProducto: idProductoIntermedio }
    });

    const activeWipLots = await this.prisma.lote.findMany({
      where: {
        OR: [
          { idProducto: idProductoIntermedio, cantidadDisponible: { gt: 0 } },
          { tipoLote: 'SEMIELABORADO_WIP', cantidadDisponible: { gt: 0 } }
        ]
      }
    });

    let totalStock = 0;
    for (const lw of activeWipLots) {
      const rawLoteQty = Number(lw.cantidadDisponible) || 0;
      const loteUnidad = (lw.unidad || '').toLowerCase().trim();
      const isLoteInLiters = loteUnidad === 'litros' || loteUnidad === 'l' || (!loteUnidad && rawLoteQty <= 100);

      if (isReqSmallUnit && isLoteInLiters) {
        totalStock += rawLoteQty * 1000;
      } else if (!isReqSmallUnit && (loteUnidad === 'g' || loteUnidad === 'ml')) {
        totalStock += rawLoteQty / 1000;
      } else {
        totalStock += rawLoteQty;
      }
    }

    if (totalStock === 0 && invProd) {
      const rawInv = Number(invProd.cantidadActual) || 0;
      totalStock = isReqSmallUnit ? rawInv * 1000 : rawInv;
    }

    const stockComprometido = await this.getCommittedStock({
      idProductoIntermedio,
      isReqSmallUnit,
      excludeProduccionId
    });

    const stockDisponible = Math.max(0, totalStock - stockComprometido);
    return { stockFisico: totalStock, stockComprometido, stockDisponible };
  }

  async createWithTransaction(data) {
    return this.prisma.$transaction(async (prisma) => {
      // 1. Consultar receta técnica activa para congelar snapshot inmutable de fabricación
      const recetaActiva = await prisma.receta.findFirst({
        where: data.idReceta
          ? { id: data.idReceta }
          : { idProducto: data.idProducto, activo: true },
        include: {
          etapas: {
            where: { activo: true },
            orderBy: { orden: 'asc' },
            include: {
              detalles: {
                where: { activo: true },
                include: {
                  insumo: true,
                  productoIntermedio: true
                }
              }
            }
          }
        }
      });

      // 2. Estructurar snapshot técnico inmutable con tiempos, temperaturas e instrucciones de planta
      const snapshotReceta = recetaActiva ? {
        idRecetaOriginal: recetaActiva.id,
        nombreReceta: recetaActiva.nombre,
        rendimientoBase: Number(recetaActiva.rendimientoBase),
        unidadRendimiento: recetaActiva.unidadRendimiento,
        fechaSnapshot: new Date().toISOString(),
        etapas: recetaActiva.etapas.map(e => ({
          nombre: e.nombre,
          orden: e.orden,
          tiempoMinimoMin: e.tiempoMinimoMin,
          tiempoEstandarMin: e.tiempoEstandarMin,
          tiempoMaximoMin: e.tiempoMaximoMin,
          tempMinimaGrados: e.tempMinimaGrados ? Number(e.tempMinimaGrados) : null,
          tempMaximaGrados: e.tempMaximaGrados ? Number(e.tempMaximaGrados) : null,
          instrucciones: e.instrucciones,
          detalles: e.detalles.map(d => ({
            idInsumo: d.idInsumo,
            nombreInsumo: d.insumo?.nombre || null,
            idProductoIntermedio: d.idProductoIntermedio,
            nombreProductoIntermedio: d.productoIntermedio?.nombre || null,
            cantidadRequerida: Number(d.cantidadRequerida),
            unidad: d.unidad,
            mermaPorcentaje: Number(d.mermaPorcentaje),
            tipoInsumo: d.tipoInsumo,
            grupoVariante: d.grupoVariante,
            esOpcional: d.esOpcional
          }))
        }))
      } : null;

      // 3. Serializar metadatos y observaciones conservando cualquier nota manual previa
      let observacionesPayload = data.observaciones || '';
      if (snapshotReceta) {
        observacionesPayload = JSON.stringify({
          userNotes: data.observaciones || null,
          recipeSnapshot: snapshotReceta
        });
      }

      // 4. Crear orden de producción con cantidades discretas redondeadas y snapshot inmutable
      const produccion = await prisma.produccion.create({
        data: {
          fechaPlanificada: data.fechaPlanificada ? new Date(data.fechaPlanificada) : null,
          fechaProduccion: new Date(data.fechaProduccion),
          idProducto: data.idProducto,
          cantidadPlanificada: data.cantidadPlanificada,
          cantidadProducidaReal: data.cantidadProducidaReal || 0,
          estado: data.estado || 'PLANIFICADA',
          fechaVencimiento: data.fechaVencimiento ? new Date(data.fechaVencimiento) : null,
          observaciones: observacionesPayload,
          detalles: {
            create: data.detalles.map(d => {
              const esUnidadDiscreta = UNIDADES_DISCRETAS.includes((d.unidad || '').toUpperCase().trim());
              const cantTeorica = esUnidadDiscreta ? Math.ceil(Number(d.cantidadTeorica)) : Number(Number(d.cantidadTeorica).toFixed(4));
              return {
                idInsumo: d.idInsumo || null,
                idProductoIntermedio: d.idProductoIntermedio || null,
                cantidadTeorica: cantTeorica,
                unidad: d.unidad,
                costoTeorico: d.costoTeorico,
                cantidadRealUtilizada: null,
                costoReal: null,
                diferencia: null
              };
            })
          }
        },
        include: includeProduction
      });

      return produccion;
    });
  }

  async create(data) {
    return this.createWithTransaction(data);
  }

  async startProduction(id) {
    return this.prisma.$transaction(async (prisma) => {
      const produccion = await prisma.produccion.findUnique({
        where: { id },
        include: { detalles: true }
      });
      if (!produccion) throw new Error("Producción no encontrada");
      if (produccion.estado !== 'PLANIFICADA') throw new Error("Solo órdenes planificadas pueden iniciarse");

      for (const det of produccion.detalles) {
        if (det.idInsumo) {
          const inv = await prisma.inventario.findUnique({ where: { idInsumo: det.idInsumo } });
          const stock = inv ? Number(inv.cantidadActual) : 0;
          if (stock < Number(det.cantidadTeorica)) {
            throw new Error(`Stock insuficiente para el insumo ${det.idInsumo}`);
          }
        } else if (det.idProductoIntermedio) {
          const invProd = await prisma.inventarioProducto.findUnique({ where: { idProducto: det.idProductoIntermedio } });
          const loteWip = (await prisma.lote.findFirst({
            where: { idProducto: det.idProductoIntermedio, tipoLote: 'SEMIELABORADO_WIP', estado: 'DISPONIBLE', cantidadDisponible: { gt: 0 } },
            orderBy: { fechaProduccion: 'asc' }
          })) || (await prisma.lote.findFirst({
            where: { idProducto: det.idProductoIntermedio, estado: 'DISPONIBLE', cantidadDisponible: { gt: 0 } },
            orderBy: { fechaProduccion: 'asc' }
          }));

          const rawStock = loteWip && Number(loteWip.cantidadDisponible) > 0
            ? Number(loteWip.cantidadDisponible)
            : (invProd ? Number(invProd.cantidadActual) : 0);

          const detUnidad = (det.unidad || '').toLowerCase().trim();
          const loteUnidad = (loteWip?.unidad || '').toLowerCase().trim();

          let stock = rawStock;
          const isReqSmallUnit = detUnidad === 'g' || detUnidad === 'ml' || detUnidad === 'gramos';
          const isStockInLiters = loteUnidad === 'litros' || loteUnidad === 'l' || (!loteUnidad && rawStock <= 100);

          if (isReqSmallUnit && isStockInLiters) {
            stock = rawStock * 1000;
          } else if (!isReqSmallUnit && (loteUnidad === 'g' || loteUnidad === 'ml')) {
            stock = rawStock / 1000;
          }

          if (stock < Number(det.cantidadTeorica)) {
            throw new Error(`Stock insuficiente para el producto intermedio/base ${det.idProductoIntermedio}`);
          }
        }
      }

      return prisma.produccion.update({
        where: { id },
        data: { estado: 'EN_PROCESO' },
        include: includeProduction
      });
    });
  }

  async createPurchaseOrderFromShortage(data) {
    const { itemsFaltantes } = data; // Array of { idInsumo, faltante }
    if (!itemsFaltantes || itemsFaltantes.length === 0) throw new Error("No hay items faltantes especificados");

    // Filtrar solo insumos comprables (no productos intermedios producidos internamente)
    const insumosFaltantes = itemsFaltantes.filter(f => f.idInsumo);
    if (insumosFaltantes.length === 0) {
      throw new Error("Los faltantes corresponden a bases intermedias fabricadas en planta; deben programarse en una orden de producción previa");
    }

    return this.prisma.$transaction(async (prisma) => {
      const itemsParaCrear = [];

      for (const item of insumosFaltantes) {
        const faltante = Number(item.faltante) || 0;
        if (faltante <= 0) continue;

        // Consultar tarifa activa preferente o última cotizada
        const tarifa = await prisma.precioProveedor.findFirst({
          where: { idInsumo: item.idInsumo, activo: true },
          orderBy: { fechaRegistro: 'desc' },
          include: { proveedor: true }
        });

        const capacidadEmpaque = Number(tarifa?.cantidadEquivalenteBase || tarifa?.cantidadPresentacion || 0);
        const precioEmpaque = Number(tarifa?.precioCompra || 0);

        let unidadesAComprar = 1;
        let precioTotalEstimado = 0;

        if (capacidadEmpaque > 0) {
          unidadesAComprar = Math.ceil(faltante / capacidadEmpaque);
          precioTotalEstimado = unidadesAComprar * precioEmpaque;
        } else {
          unidadesAComprar = Math.ceil(faltante);
          precioTotalEstimado = unidadesAComprar * (precioEmpaque || Number(tarifa?.costoUnidadBase || 0));
        }

        itemsParaCrear.push({
          idInsumo: item.idInsumo,
          idProveedor: tarifa?.idProveedor || null,
          cantidad: unidadesAComprar,
          precioEstimado: precioEmpaque > 0 ? precioEmpaque : precioTotalEstimado,
          estadoItem: 'PENDIENTE'
        });
      }

      const year = new Date().getFullYear();
      const lastOrder = await prisma.ordenCompra.findFirst({
        where: { codigo: { startsWith: `ORD-${year}-` } },
        orderBy: { createdAt: 'desc' }
      });

      let nextNumber = 1;
      if (lastOrder && lastOrder.codigo) {
        const parts = lastOrder.codigo.split('-');
        if (parts.length === 3) {
          nextNumber = parseInt(parts[2], 10) + 1;
        }
      } else {
        const count = await prisma.ordenCompra.count();
        nextNumber = count + 1;
      }
      const codigo = `ORD-${year}-${String(nextNumber).padStart(4, '0')}`;

      const oc = await prisma.ordenCompra.create({
        data: {
          codigo,
          nombre: `Abastecimiento por Faltante de Producción (${new Date().toLocaleDateString()})`,
          estado: 'PENDIENTE',
          items: {
            create: itemsParaCrear
          }
        },
        include: { items: true }
      });
      return oc;
    });
  }

  async completeProduction(id, data) {
    return this.prisma.$transaction(async (prisma) => {
      const targetId = id || data?.id || data?.idProduccion || data?.ordenId;
      if (!targetId) {
        throw new Error('Identificador de orden de producción no proporcionado o inválido');
      }

      const produccion = await prisma.produccion.findUnique({
        where: { id: targetId },
        include: {
          detalles: true,
          producto: {
            include: { presentacion: true }
          },
          lotes: true
        }
      });

      if (!produccion) throw new Error("Producción no encontrada");
      if (produccion.estado === 'COMPLETADA') throw new Error("Producción ya completada");

      let costoTotalLote = 0;
      let idLotePadreDetectado = null;

      // Update production details and discount items (Insumos or Intermediate Products)
      for (const updateDet of data.detalles) {
        const det = produccion.detalles.find(d => d.id === updateDet.id);
        if (det) {
          const rawQty = Number(updateDet.cantidadRealUtilizada);
          const esUnidadDiscreta = UNIDADES_DISCRETAS.includes((det.unidad || '').toUpperCase().trim());
          const qtyReal = esUnidadDiscreta ? Math.ceil(rawQty) : Number(rawQty.toFixed(4));
          const diferencia = qtyReal - Number(det.cantidadTeorica);

          if (det.idInsumo) {
            // 1. Manejo de Insumo Tradicional
            const inv = await prisma.inventario.findUnique({ where: { idInsumo: det.idInsumo } });
            const stockAnterior = inv ? Number(inv.cantidadActual) : 0;
            const stockNuevo = stockAnterior - qtyReal;

            // Deducir inventario
            await prisma.inventario.update({
              where: { idInsumo: det.idInsumo },
              data: { cantidadActual: stockNuevo }
            });

            // Registrar movimiento de inventario de salida
            await prisma.movimientoInventario.create({
              data: {
                idInsumo: det.idInsumo,
                tipoMovimiento: 'SALIDA_PRODUCCION',
                cantidad: qtyReal,
                stockAnterior: stockAnterior,
                stockNuevo: stockNuevo,
                costoUnitario: Number(inv?.costoPromedio || 0),
                motivo: `Consumo en producción ${produccion.id}`,
                operacionOrigen: produccion.id
              }
            });

            const costoUnitarioInsumo = Number(inv?.costoPromedio || 0);
            costoTotalLote += qtyReal * costoUnitarioInsumo;

            await prisma.detalleProduccion.update({
              where: { id: det.id },
              data: {
                cantidadRealUtilizada: Number(qtyReal),
                diferencia: Number(diferencia),
                costoReal: Number(qtyReal * costoUnitarioInsumo)
              }
            });
          } else if (det.idProductoIntermedio) {
            // 2. Manejo de Insumo Semielaborado (Producto Intermedio / Inóculo / Base)
            const invProd = await prisma.inventarioProducto.findUnique({
              where: { idProducto: det.idProductoIntermedio }
            });

            const stockAnterior = invProd ? Number(invProd.cantidadActual) : 0;
            const costoUnitarioIntermedio = Number(invProd?.costoPromedio || 0);

            // Blindaje Poka-Yoke: Conversión dimensional y no-negatividad
            const detUnidad = (det.unidad || '').toLowerCase().trim();
            let decrementoLts = qtyReal;
            if (detUnidad === 'g' || detUnidad === 'ml' || detUnidad === 'gramos') {
              decrementoLts = decrementoLts / 1000;
            }
            const stockNuevo = Math.max(0, stockAnterior - decrementoLts);

            // Descontar inventario de producto intermedio
            await prisma.inventarioProducto.upsert({
              where: { idProducto: det.idProductoIntermedio },
              update: { cantidadActual: stockNuevo },
              create: { idProducto: det.idProductoIntermedio, cantidadActual: stockNuevo, costoPromedio: costoUnitarioIntermedio }
            });

            // Registrar movimiento de inventario de salida para el semielaborado
            await prisma.movimientoInventario.create({
              data: {
                idProducto: det.idProductoIntermedio,
                tipoMovimiento: 'SALIDA_PRODUCCION_WIP',
                cantidad: decrementoLts,
                stockAnterior: stockAnterior,
                stockNuevo: stockNuevo,
                costoUnitario: costoUnitarioIntermedio,
                motivo: `Consumo de base semielaborada en producción ${produccion.id}`,
                operacionOrigen: produccion.id
              }
            });

            // Trazabilidad de Lote Padre y Deducción: Respetar data.desgloseLotes o asignacionInoculo si fue especificada
            const alloc = updateDet.asignacionInoculo || data.asignacionInoculo;
            const desglose = (Array.isArray(data.desgloseLotes) && data.desgloseLotes.length > 0)
              ? data.desgloseLotes
              : (alloc?.modo === 'MEZCLA' && Array.isArray(alloc?.lotes))
                ? alloc.lotes.map(l => ({ idLote: l.idLote, litrosADescontar: l.cantidad }))
                : (alloc?.modo === 'LOTE_UNICO' && alloc?.idLote)
                  ? [{ idLote: alloc.idLote, litrosADescontar: decrementoLts }]
                  : null;

            if (desglose && desglose.length > 0) {
              for (const asignacion of desglose) {
                let cantLitros = Number(asignacion.litrosADescontar || asignacion.cantidad);
                if (detUnidad === 'g' || detUnidad === 'ml' || detUnidad === 'gramos') {
                  if (cantLitros > 100) cantLitros = cantLitros / 1000;
                }
                if (cantLitros > 0 && asignacion.idLote) {
                  const targetLote = await prisma.lote.findUnique({ where: { id: asignacion.idLote } });
                  if (targetLote) {
                    if (!idLotePadreDetectado) idLotePadreDetectado = targetLote.id;
                    const nuevaCant = Math.max(0, Number(targetLote.cantidadDisponible) - cantLitros);
                    await prisma.lote.update({
                      where: { id: asignacion.idLote },
                      data: {
                        cantidadDisponible: nuevaCant,
                        estado: nuevaCant === 0 ? 'AGOTADO' : targetLote.estado
                      }
                    });
                  }
                }
              }
            } else {
              // Descuento FEFO automático sobre los lotes con saldo de ese semielaborado hasta agotar decrementoLts
              let remQty = decrementoLts;
              const lotesFefo = await prisma.lote.findMany({
                where: {
                  OR: [
                    { idProducto: det.idProductoIntermedio, cantidadDisponible: { gt: 0 } },
                    { tipoLote: 'SEMIELABORADO_WIP', cantidadDisponible: { gt: 0 } }
                  ]
                },
                orderBy: [
                  { fechaVencimiento: 'asc' },
                  { fechaProduccion: 'asc' }
                ]
              });

              for (const lote of lotesFefo) {
                if (remQty <= 0) break;
                if (!idLotePadreDetectado) idLotePadreDetectado = lote.id;
                const cantDisponible = Number(lote.cantidadDisponible);
                const aDescontar = Math.min(cantDisponible, remQty);
                const nuevaCant = Math.max(0, cantDisponible - aDescontar);
                remQty -= aDescontar;

                await prisma.lote.update({
                  where: { id: lote.id },
                  data: {
                    cantidadDisponible: nuevaCant,
                    estado: nuevaCant === 0 ? 'AGOTADO' : lote.estado
                  }
                });
              }
            }

            costoTotalLote += qtyReal * costoUnitarioIntermedio;

            await prisma.detalleProduccion.update({
              where: { id: det.id },
              data: {
                cantidadRealUtilizada: Number(qtyReal),
                diferencia: Number(diferencia),
                costoReal: Number(qtyReal * costoUnitarioIntermedio)
              }
            });
          }
        }
      }

      const qtyProducida = Number(data.cantidadProducidaReal) || Number(produccion.cantidadPlanificada);
      const costoUnitarioFabricacion = qtyProducida > 0 ? costoTotalLote / qtyProducida : 0;

      // Cálculo dinámico de fecha de vencimiento según vida útil
      const diasVencimientoProd = produccion.producto?.diasVidaUtil || produccion.receta?.diasVidaUtil || 21;
      const diasVencimientoInoculo = 14;

      const fechaVencPrincipal = data.fechaVencimiento
        ? new Date(data.fechaVencimiento)
        : (produccion.fechaVencimiento
            ? new Date(produccion.fechaVencimiento)
            : new Date(Date.now() + diasVencimientoProd * 24 * 60 * 60 * 1000));

      const fechaVencInoculo = data.reservaInoculo?.fechaVencimiento
        ? new Date(data.reservaInoculo.fechaVencimiento)
        : new Date(Date.now() + diasVencimientoInoculo * 24 * 60 * 60 * 1000);

      await prisma.produccion.update({
        where: { id: targetId },
        data: {
          estado: 'COMPLETADA',
          cantidadProducidaReal: qtyProducida,
          fechaProduccion: new Date(),
          fechaVencimiento: fechaVencPrincipal
        }
      });

      // Determinar si es producto intermedio o producto terminado
      const esIntermedio = produccion.producto?.categoria === 'INTERMEDIO_WIP';
      const tipoLoteGenerado = esIntermedio ? 'SEMIELABORADO_WIP' : 'PRODUCTO_TERMINADO';
      const unidadLote = esIntermedio ? 'Litros' : 'UNIDAD';

      // Gestión de Reserva de Inóculo (Split Batch o 100% Inóculo)
      const reserva = data.reservaInoculo;
      const cantInoculoSolicitada = Number(reserva?.cantidad ?? data.cantidadInoculo ?? 0);
      const tieneReserva = Boolean(
        (data.reservarInoculo || reserva?.activo) &&
        cantInoculoSolicitada > 0 &&
        cantInoculoSolicitada <= qtyProducida
      );
      const cantInoculo = tieneReserva ? cantInoculoSolicitada : 0;
      const cantPrincipal = Math.max(0, qtyProducida - cantInoculo);

      let lotePrincipalId = null;

      // Generar Lote Comercial / Principal únicamente si queda saldo > 0
      if (cantPrincipal > 0) {
        const lote = await prisma.lote.create({
          data: {
            tipoLote: tipoLoteGenerado,
            idProduccion: produccion.id,
            idProducto: produccion.idProducto,
            idLotePadre: idLotePadreDetectado || null,
            fechaProduccion: new Date(),
            fechaVencimiento: fechaVencPrincipal,
            cantidadInicial: cantPrincipal,
            cantidadDisponible: cantPrincipal,
            unidad: unidadLote,
            estado: 'DISPONIBLE',
            costoUnitario: costoUnitarioFabricacion
          }
        });
        lotePrincipalId = lote.id;
      }

      // Si existe reserva de inóculo, crear sub-lote de inóculo derivado
      if (tieneReserva) {
        const subLoteInoculo = await prisma.lote.create({
          data: {
            tipoLote: 'SEMIELABORADO_WIP',
            idProduccion: produccion.id,
            idProducto: produccion.idProducto,
            idLotePadre: lotePrincipalId || idLotePadreDetectado || null,
            fechaProduccion: new Date(),
            fechaVencimiento: fechaVencInoculo,
            cantidadInicial: cantInoculo,
            cantidadDisponible: cantInoculo,
            unidad: 'Litros',
            estado: 'DISPONIBLE',
            costoUnitario: costoUnitarioFabricacion,
            observaciones: `Reserva interna inóculo / cultivo madre (${reserva?.codigoLoteHijo || 'INOCULO'})`
          }
        });

        if (!lotePrincipalId) {
          lotePrincipalId = subLoteInoculo.id;
        }

        await prisma.movimientoInventario.create({
          data: {
            idProducto: produccion.idProducto,
            tipoMovimiento: 'ENTRADA_RECIRCULACION_INOCULO',
            cantidad: cantInoculo,
            costoUnitario: costoUnitarioFabricacion,
            motivo: `Reserva interna de inóculo de producción ${produccion.id}`,
            operacionOrigen: produccion.id
          }
        });
      }

      if (lotePrincipalId) {
        await prisma.produccion.update({
          where: { id: targetId },
          data: { idLote: lotePrincipalId }
        });
      }

      // Upsert Finished or Intermediate Product Inventory (solo si hay volumen comercial real > 0)
      if (cantPrincipal > 0) {
        const invProd = await prisma.inventarioProducto.findUnique({ where: { idProducto: produccion.idProducto } });
        const stockAnteriorProd = invProd ? Number(invProd.cantidadActual) : 0;
        const stockNuevoProd = stockAnteriorProd + cantPrincipal;

        let nuevoCostoPromedio = costoUnitarioFabricacion;
        if (invProd && stockAnteriorProd > 0) {
          const valorAnterior = stockAnteriorProd * Number(invProd.costoPromedio || 0);
          const valorNuevo = cantPrincipal * costoUnitarioFabricacion;
          nuevoCostoPromedio = (valorAnterior + valorNuevo) / stockNuevoProd;
        }

        await prisma.inventarioProducto.upsert({
          where: { idProducto: produccion.idProducto },
          update: { cantidadActual: stockNuevoProd, costoPromedio: nuevoCostoPromedio },
          create: { idProducto: produccion.idProducto, cantidadActual: stockNuevoProd, costoPromedio: nuevoCostoPromedio }
        });

        await prisma.movimientoInventario.create({
          data: {
            idProducto: produccion.idProducto,
            tipoMovimiento: 'ENTRADA_PRODUCCION',
            cantidad: cantPrincipal,
            stockAnterior: stockAnteriorProd,
            stockNuevo: stockNuevoProd,
            costoUnitario: costoUnitarioFabricacion,
            motivo: esIntermedio ? 'Ingreso a tanque de base semielaborada' : 'Ingreso a cava de producto terminado',
            operacionOrigen: produccion.id
          }
        });
      }

      return prisma.produccion.findUnique({
        where: { id: targetId },
        include: includeProduction
      });
    });
  }
}
