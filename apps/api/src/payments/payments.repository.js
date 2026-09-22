import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class PaymentsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.pago.findMany({
      include: { cliente: true, venta: true }
    });
  }

  async findById(id) {
    return this.prisma.pago.findUnique({
      where: { id },
      include: { cliente: true, venta: true }
    });
  }

  async create(data) {
    return this.prisma.$transaction(async (tx) => {
      const venta = await tx.venta.findUnique({
        where: { id: data.idVenta }
      });

      if (!venta) {
        throw new Error(`Venta con ID ${data.idVenta} no encontrada`);
      }

      const pagoMonto = Number(data.valorPagado);
      const saldoActual = Number(venta.saldoPendiente);

      // HAL-F9-04: Permitir pagos que excedan el saldo — generan saldo a favor del cliente
      // (Antes se bloqueaba con throw Error, impidiendo anticipos y pagos excedentes)

      const pago = await tx.pago.create({
        data: {
          fechaPago: new Date(data.fechaPago),
          idCliente: data.idCliente,
          idVenta: data.idVenta,
          valorPagado: data.valorPagado,
          metodoPago: data.metodoPago,
          referencia: data.referencia,
          observaciones: pagoMonto > saldoActual
            ? `${data.observaciones || ''} [SALDO A FAVOR: $${(pagoMonto - saldoActual).toFixed(2)}]`.trim()
            : (data.observaciones || null)
        },
        include: { cliente: true, venta: true }
      });

      const nuevoValorPagado = Number(venta.valorPagado) + pagoMonto;
      // HAL-F4-08 + HAL-F9-04: NO truncar a 0 — saldo negativo = crédito/saldo a favor del cliente
      const nuevoSaldo = Number(venta.totalVenta) - nuevoValorPagado;

      const updateData = {
        valorPagado: nuevoValorPagado,
        saldoPendiente: nuevoSaldo,
        estado: nuevoSaldo <= 0 ? 'COMPLETADA' : (venta.estado === 'COMPLETADA' ? 'PENDIENTE' : venta.estado)
      };

      if (data.nuevaFechaLimite) {
        updateData.fechaLimitePago = new Date(data.nuevaFechaLimite);
      }

      await tx.venta.update({
        where: { id: data.idVenta },
        data: updateData
      });

      return pago;
    });
  }

  async getReceivables(filters = {}) {
    const where = {
      saldoPendiente: { gt: 0 },
      estado: { not: 'ANULADA' }
    };

    if (filters.clienteId) {
      where.idCliente = filters.clienteId;
    }

    if (filters.montoMin || filters.montoMax) {
      where.saldoPendiente = {
        ...(where.saldoPendiente || {}),
        ...(filters.montoMin ? { gte: Number(filters.montoMin) } : {}),
        ...(filters.montoMax ? { lte: Number(filters.montoMax) } : {})
      };
    }

    const ventas = await this.prisma.venta.findMany({
      where,
      include: {
        cliente: {
          select: { id: true, nombre: true, tipoCliente: true, canal: true, telefono: true, contacto: true, diasCredito: true }
        },
        pagos: {
          orderBy: { fechaPago: 'desc' }
        }
      },
      orderBy: { fechaVenta: 'asc' }
    });

    const now = new Date();

    const formattedVentas = ventas.map((v) => {
      const fechaLimite = v.fechaLimitePago ? new Date(v.fechaLimitePago) : null;
      let diasVencido = 0;
      let diasPorVencer = 0;
      let estadoVencimiento = 'AL_DIA';

      if (fechaLimite) {
        const diffTime = now.getTime() - fechaLimite.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
          diasVencido = diffDays;
          estadoVencimiento = 'VENCIDO';
        } else {
          diasPorVencer = Math.abs(diffDays);
          estadoVencimiento = 'POR_VENCER';
        }
      }

      return {
        id: v.id,
        fechaVenta: v.fechaVenta,
        idCliente: v.idCliente,
        cliente: v.cliente,
        totalVenta: Number(v.totalVenta),
        valorPagado: Number(v.valorPagado),
        saldoPendiente: Number(v.saldoPendiente),
        fechaLimitePago: v.fechaLimitePago,
        canalVenta: v.canalVenta,
        estado: v.estado,
        diasVencido,
        diasPorVencer,
        estadoVencimiento,
        pagos: v.pagos.map(p => ({
          id: p.id,
          fechaPago: p.fechaPago,
          valorPagado: Number(p.valorPagado),
          metodoPago: p.metodoPago,
          referencia: p.referencia
        }))
      };
    });

    // Filtro por estado de vencimiento si aplica
    let filteredList = formattedVentas;
    if (filters.estado === 'VENCIDO') {
      filteredList = formattedVentas.filter(v => v.estadoVencimiento === 'VENCIDO');
    } else if (filters.estado === 'POR_VENCER') {
      filteredList = formattedVentas.filter(v => v.estadoVencimiento === 'POR_VENCER');
    } else if (filters.estado === 'CON_ABONOS') {
      filteredList = formattedVentas.filter(v => v.valorPagado > 0);
    }

    // KPIs consolidados
    const carteraTotal = formattedVentas.reduce((sum, v) => sum + v.saldoPendiente, 0);
    const carteraVencida = formattedVentas.filter(v => v.estadoVencimiento === 'VENCIDO').reduce((sum, v) => sum + v.saldoPendiente, 0);
    const carteraPorVencer = formattedVentas.filter(v => v.estadoVencimiento !== 'VENCIDO').reduce((sum, v) => sum + v.saldoPendiente, 0);
    const clientesDeudores = new Set(formattedVentas.map(v => v.idCliente)).size;

    // Total histórico de cobros recaudados
    const pagosSum = await this.prisma.pago.aggregate({
      _sum: { valorPagado: true }
    });
    const totalCobrado = Number(pagosSum._sum.valorPagado || 0);

    return {
      kpis: {
        carteraTotal,
        totalCobrado,
        clientesDeudores,
        carteraVencida,
        carteraPorVencer
      },
      ventas: filteredList
    };
  }
}
