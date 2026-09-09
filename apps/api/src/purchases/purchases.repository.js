import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class PurchasesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.compra.findMany({
      include: { detalles: true }
    });
  }

  async findById(id) {
    return this.prisma.compra.findUnique({
      where: { id },
      include: { detalles: true }
    });
  }

  async createWithTransaction(data) {
    return this.prisma.$transaction(async (prisma) => {
      // 1. Manejar Proveedor nuevo si viene
      let idProveedorFinal = data.idProveedor;
      if (data.esNuevoProveedor) {
        const prov = await prisma.proveedor.create({
          data: {
            nombre: data.nuevoProveedor.nombre,
            nitCedula: data.nuevoProveedor.nitCedula,
            telefono: data.nuevoProveedor.telefono || null,
            nombreContacto: data.nuevoProveedor.personaContacto || null,
            activo: true,
          }
        });
        idProveedorFinal = prov.id;
      }

      // 2. Generar Consecutivo
      const count = await prisma.compra.count();
      const year = new Date().getFullYear();
      const consecutive = `CMP-${year}-${String(count + 1).padStart(4, '0')}`;

      const paymentConditionStr = data.condicion || 'CONTADO';

      const obsFinal = data.observaciones
        ? `${consecutive} - Condición: ${paymentConditionStr} - ${data.observaciones}`
        : `${consecutive} - Condición: ${paymentConditionStr}`;

      // 3. Crear Compra con Detalles
      const newCompra = await prisma.compra.create({
        data: {
          idProveedor: idProveedorFinal,
          fechaCompra: data.fechaCompra ? new Date(data.fechaCompra) : new Date(),
          total: data.total,
          observaciones: obsFinal,
          estado: 'COMPLETADO',
          detalles: {
            create: data.detalles.map(d => ({
              idInsumo: d.idInsumo,
              cantidad: d.cantidad,
              precioUnitario: d.precioUnitario,
              subtotal: d.subtotal,
              presentacion: d.presentacion || 'N/A',
              empaques: d.empaques || d.cantidad,
              contenidoBase: d.contenidoBase || 1,
              unidadEmpaque: d.unidadEmpaque || 'Unidad',
              cantidadBaseTotal: d.cantidadBaseTotal || d.cantidad,
              costoBase: d.costoBase || d.precioUnitario,
              marca: d.marca || ''
            }))
          }
        },
        include: {
          detalles: true
        }
      });

      // 4. Actualizar Precios (Histórico e Insumo) e Inventarios
      for (const detalle of data.detalles) {
        const currentInsumo = await prisma.insumo.findUnique({
          where: { id: detalle.idInsumo }
        });

        // 4.1 Update Insumo Stock and Cost
        if (currentInsumo) {
          const isLtsOrKgs = ['Lt', 'Lts', 'Kg', 'Kgs'].includes(currentInsumo.unidadBase);
          const costoUnidadBaseNumber = Number(detalle.costoBase);

          let updatedCost = Number(currentInsumo.costoUnidadBase);
          if (costoUnidadBaseNumber > 0) {
            updatedCost = costoUnidadBaseNumber;
          }

          const incrementStock = isLtsOrKgs
            ? Number(detalle.cantidadBaseTotal) * 1000
            : Number(detalle.cantidadBaseTotal);

          await prisma.insumo.update({
            where: { id: detalle.idInsumo },
            data: {
              stockActual: { increment: incrementStock },
              costoUnidadBase: updatedCost,
              ultimaCompra: new Date()
            }
          });
        }

        // 4.2 Record Precio Histórico
        await prisma.precioHistorico.create({
          data: {
            idInsumo: detalle.idInsumo,
            idProveedor: idProveedorFinal,
            idCompra: newCompra.id,
            fechaRegistro: new Date(),
            precioCompra: detalle.precioUnitario,
            presentacionCompra: detalle.presentacion || 'N/A',
            cantidadEquivalenteBase: detalle.contenidoBase || 1,
            costoUnidadBase: detalle.costoBase || detalle.precioUnitario,
            unidadBase: detalle.unidadEmpaque || 'Unidad',
            marca: detalle.marca || ''
          }
        });

        // 4.3 Upsert Supplier Link (PrecioProveedor)
        const provLink = await prisma.precioProveedor.findFirst({
          where: { idInsumo: detalle.idInsumo, idProveedor: idProveedorFinal }
        });

        if (provLink) {
          await prisma.precioProveedor.update({
            where: { id: provLink.id },
            data: {
              precioCompra: detalle.precioUnitario,
              presentacionCompra: detalle.presentacion || 'N/A',
              cantidadEquivalenteBase: detalle.contenidoBase || 1,
              ultimaActualizacion: new Date()
            }
          });
        } else {
          await prisma.precioProveedor.create({
            data: {
              idInsumo: detalle.idInsumo,
              idProveedor: idProveedorFinal,
              precioCompra: detalle.precioUnitario,
              presentacionCompra: detalle.presentacion || 'N/A',
              cantidadEquivalenteBase: detalle.contenidoBase || 1
            }
          });
        }
      }

      return newCompra;
    });
  }

  async simulate(data) {
    const itemsLiquidados = [];
    let subtotalGlobal = 0;

    for (const item of data.items) {
      let factorReal = item.factorReal ? parseFloat(item.factorReal) : 1;
      let unidadBase = item.unidadBase || 'Unidades';

      if (item.idPrecioProveedor && !item.factorReal) {
        const precioProv = await this.prisma.precioProveedor.findUnique({
          where: { id: item.idPrecioProveedor },
          include: { insumo: true }
        });

        if (precioProv) {
          factorReal = parseFloat(precioProv.cantidadEquivalenteBase || 1);
          unidadBase = precioProv.insumo?.unidadBase || unidadBase;
        }
      }

      const ingresoNetoBodega = item.cantidadEmpaques * factorReal;
      const subtotal = item.cantidadEmpaques * item.precioEmpaque;
      const costoBaseUnitario = item.precioEmpaque / factorReal;

      subtotalGlobal += subtotal;

      itemsLiquidados.push({
        idPrecioProveedor: item.idPrecioProveedor,
        subtotal,
        ingresoNetoBodega,
        costoBaseUnitario,
        unidadBase
      });
    }

    return {
      subtotalGlobal,
      itemsLiquidados
    };
  }

  async findActiveOrders() {
    try {
      const orders = await this.prisma.ordenCompra.findMany({
        where: {
          estado: { in: ['PENDIENTE', 'EN_PROCESO'] }
        },
        include: {
          items: {
            include: {
              insumo: true,
              proveedor: true,
              presentacion: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return orders || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  /**
   * Persiste un único ítem en una orden existente y retorna el registro OrdenCompraItem
   * con su UUID real asignado por Prisma.
   * Si ya existe un ítem idéntico (misma tripla insumo/proveedor/presentación),
   * acumula la cantidad en lugar de duplicar.
   *
   * @param {string} orderId - UUID real de la OrdenCompra destino
   * @param {Object} itemData - Datos del ítem: { idInsumo, idProveedor, idPresentacion, cantidad, precioEstimado }
   * @returns {Object} - OrdenCompraItem creado o actualizado con su id real
   */
  async addItemToOrder(orderId, itemData) {
    const order = await this.prisma.ordenCompra.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Orden no encontrada');
    if (order.estado !== 'PENDIENTE' && order.estado !== 'EN_PROCESO') {
      throw new Error('Solo se pueden añadir ítems a órdenes PENDIENTE o EN_PROCESO');
    }

    const { idInsumo, idProveedor, idPresentacion, cantidad, precioEstimado } = itemData;

    // Buscar duplicado exacto por tripla de relación
    const existing = await this.prisma.ordenCompraItem.findFirst({
      where: {
        idOrden: orderId,
        idInsumo: idInsumo || null,
        idProveedor: idProveedor || null,
        idPresentacion: idPresentacion || null,
      }
    });

    if (existing) {
      // Acumular cantidad si ya existe el mismo ítem
      return this.prisma.ordenCompraItem.update({
        where: { id: existing.id },
        data: { cantidad: { increment: parseFloat(cantidad || 1) } }
      });
    }

    // Crear nuevo registro y retornar con id real de Prisma
    return this.prisma.ordenCompraItem.create({
      data: {
        idOrden: orderId,
        idInsumo: idInsumo || null,
        idProveedor: idProveedor || null,
        idPresentacion: idPresentacion || null,
        cantidad: parseFloat(cantidad || 1),
        precioEstimado: parseFloat(precioEstimado || 0),
        estadoItem: 'PENDIENTE',
      }
    });
  }

  async moveItem(data) {
    const { itemId, fromOrderId, toOrderId } = data;
    return this.prisma.$transaction(async (prisma) => {
      // Verificar que ambas órdenes existan y estén en estado PENDIENTE
      const fromOrder = await prisma.ordenCompra.findUnique({ where: { id: fromOrderId } });
      const toOrder = await prisma.ordenCompra.findUnique({ where: { id: toOrderId } });

      if (!fromOrder || fromOrder.estado !== 'PENDIENTE') throw new Error('Orden de origen no existe o no está PENDIENTE');
      if (!toOrder || toOrder.estado !== 'PENDIENTE') throw new Error('Orden de destino no existe o no está PENDIENTE');

      // Verificar que el ítem exista en la orden origen
      const item = await prisma.ordenCompraItem.findUnique({ where: { id: itemId } });
      if (!item || item.idOrden !== fromOrderId) throw new Error('Item no existe en la orden de origen');

      // Buscar si ya existe un ítem idéntico (misma tupla) en la orden destino
      const existingItem = await prisma.ordenCompraItem.findFirst({
        where: {
          idOrden: toOrderId,
          idInsumo: item.idInsumo,
          idPresentacion: item.idPresentacion,
          idProveedor: item.idProveedor
        }
      });

      if (existingItem) {
        // Acumular cantidad en el ítem destino y eliminar el ítem origen
        const updatedItem = await prisma.ordenCompraItem.update({
          where: { id: existingItem.id },
          data: { cantidad: { increment: item.cantidad } }
        });
        await prisma.ordenCompraItem.delete({ where: { id: itemId } });
        return updatedItem;
      } else {
        // Reasignar el ítem a la orden destino directamente
        const updatedItem = await prisma.ordenCompraItem.update({
          where: { id: itemId },
          data: { idOrden: toOrderId }
        });
        return updatedItem;
      }
    });
  }

  async mergeOrders(data) {
    const { sourceOrderIds, targetName } = data;
    return this.prisma.$transaction(async (prisma) => {
      const orders = await prisma.ordenCompra.findMany({
        where: { id: { in: sourceOrderIds } },
        include: { items: true }
      });

      if (orders.length !== sourceOrderIds.length) {
        throw new Error('Algunas órdenes no fueron encontradas');
      }

      const groupedItems = new Map();
      for (const order of orders) {
        for (const item of order.items) {
          const key = `${item.idInsumo}_${item.idPresentacion || 'null'}_${item.idProveedor}`;
          const itemCantidad = parseFloat(item.cantidad || 0);

          if (groupedItems.has(key)) {
            const existing = groupedItems.get(key);
            existing.cantidad += itemCantidad;
            if (parseFloat(item.precioEstimado) > parseFloat(existing.precioEstimado)) {
              existing.precioEstimado = parseFloat(item.precioEstimado);
            }
          } else {
            groupedItems.set(key, {
              idInsumo: item.idInsumo,
              idPresentacion: item.idPresentacion,
              idProveedor: item.idProveedor,
              cantidad: itemCantidad,
              precioEstimado: parseFloat(item.precioEstimado || 0),
              estadoItem: 'PENDIENTE'
            });
          }
        }
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
      }
      const nuevoCodigo = `ORD-${year}-${nextNumber.toString().padStart(4, '0')}`;
      const nombreFinal = targetName || `Lista de Compra Fusionada - ${new Date().toLocaleDateString()}`;

      const newOrder = await prisma.ordenCompra.create({
        data: {
          codigo: nuevoCodigo,
          nombre: nombreFinal,
          estado: 'PENDIENTE',
          items: {
            create: Array.from(groupedItems.values())
          }
        },
        include: { items: true }
      });

      await prisma.ordenCompraItem.deleteMany({
        where: { idOrden: { in: sourceOrderIds } }
      });

      await prisma.ordenCompra.deleteMany({
        where: { id: { in: sourceOrderIds } }
      });

      return {
        newOrder,
        deletedIds: sourceOrderIds
      };
    });
  }

  async createOrder(data) {
    return this.prisma.$transaction(async (prisma) => {
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

      const itemsData = (data.items || []).map(item => {
        const cantidad = parseFloat(item.cantidad || item.cantidadSolicitada || 1);
        const precioEstimado = parseFloat(item.precioEstimado || item.precioEmpaque || item.precio || 0);

        const rawInsumoId = item.insumoId || item.idInsumo || item.id;
        const rawProveedorId = item.proveedorId || item.idProveedor;
        const rawPresentacionId = item.presentacionId || item.idPresentacion;

        return {
          idInsumo: (rawInsumoId === 'undefined' || rawInsumoId === '') ? null : (rawInsumoId || null),
          idProveedor: (rawProveedorId === 'undefined' || rawProveedorId === '') ? null : (rawProveedorId || null),
          idPresentacion: (rawPresentacionId === 'undefined' || rawPresentacionId === '') ? null : (rawPresentacionId || null),
          cantidad: isNaN(cantidad) ? 1 : cantidad,
          precioEstimado: isNaN(precioEstimado) ? 0 : precioEstimado,
          estadoItem: 'PENDIENTE'
        };
      });

      return prisma.ordenCompra.create({
        data: {
          codigo,
          nombre: data.nombre || `Lista de Compras #${nextNumber}`,
          estado: 'PENDIENTE',
          items: {
            create: itemsData
          }
        },
        include: { items: true }
      });
    });
  }

  async findOneOrder(id) {
    try {
      return await this.prisma.ordenCompra.findUnique({
        where: { id },
        include: { items: true }
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async updateOrder(id, data) {
    return this.prisma.ordenCompra.update({
      where: { id },
      data: {
        nombre: data.nombre,
        estado: data.estado
      }
    });
  }

  async updateOrderItem(id, itemId, data) {
    return this.prisma.$transaction(async (prisma) => {
      const updatedItem = await prisma.ordenCompraItem.update({
        where: { id: itemId },
        data: { estadoItem: data.estadoItem }
      });

      // Verificar si todos los ítems de la orden han sido procesados
      const allItems = await prisma.ordenCompraItem.findMany({
        where: { idOrden: id }
      });

      const allProcessed = allItems.every(i => i.estadoItem !== 'PENDIENTE');
      if (allProcessed) {
        await prisma.ordenCompra.update({
          where: { id },
          data: { estado: 'COMPLETADA' }
        });
      }

      return updatedItem;
    });
  }

  async deleteOrder(id) {
    return this.prisma.$transaction(async (prisma) => {
      // Eliminar primero los ítems hijos para no violar FK constraint
      await prisma.ordenCompraItem.deleteMany({
        where: { idOrden: id }
      });
      // Luego eliminar la orden padre
      return prisma.ordenCompra.delete({
        where: { id }
      });
    });
  }
}
