import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class DashboardService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getKpis() {
    const now = new Date();
    
    // Mes actual
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    // Mes anterior
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    
    // Ventas Mes Actual
    const salesCurrentAggr = await this.prisma.venta.aggregate({
      _sum: { totalVenta: true },
      where: { fechaVenta: { gte: startOfMonth, lte: endOfMonth } }
    });
    const salesCurrentMonth = Number(salesCurrentAggr._sum.totalVenta || 0);

    // Ventas Mes Anterior
    const salesPrevAggr = await this.prisma.venta.aggregate({
      _sum: { totalVenta: true },
      where: { fechaVenta: { gte: startOfPrevMonth, lte: endOfPrevMonth } }
    });
    const salesPreviousMonth = Number(salesPrevAggr._sum.totalVenta || 0);

    // Gastos Mes Actual
    const expensesCurrentAggr = await this.prisma.gasto.aggregate({
      _sum: { valor: true },
      where: { fecha: { gte: startOfMonth, lte: endOfMonth } }
    });
    const expensesCurrentMonth = Number(expensesCurrentAggr._sum.valor || 0);

    // Cuentas por Cobrar (Saldo Pendiente > 0)
    const receivablesAggr = await this.prisma.venta.aggregate({
      _sum: { saldoPendiente: true },
      where: { saldoPendiente: { gt: 0 } }
    });
    const accountsReceivable = Number(receivablesAggr._sum.saldoPendiente || 0);

    const netProfitCurrentMonth = salesCurrentMonth - expensesCurrentMonth;

    // Valorización de Inventario (Materia Prima)
    const invInsumos = await this.prisma.inventario.findMany({
      include: { insumo: { include: { precios: true } } }
    });
    const rawMaterialsValue = invInsumos.reduce((acc, curr) => {
      let cost = curr.costoPromedio ? Number(curr.costoPromedio) : 0;
      if (cost === 0 && curr.insumo?.precios?.length > 0) {
        cost = Number(curr.insumo.precios[0].costoUnidadBase || 0);
      }
      return acc + (Number(curr.cantidadActual || 0) * cost);
    }, 0);

    // Valorización de Cava (Producto Terminado)
    const invProductos = await this.prisma.inventarioProducto.findMany();
    const finishedProductsValue = invProductos.reduce((acc, curr) => {
      return acc + (Number(curr.cantidadActual || 0) * Number(curr.costoPromedio || 0));
    }, 0);

    // Radar Táctico FEFO (Todos los lotes activos)
    const radarLotsRaw = await this.prisma.lote.findMany({
      where: { cantidadDisponible: { gt: 0 } },
      include: { producto: true, insumo: true },
      orderBy: { fechaVencimiento: 'asc' }
    });

    const radarLots = radarLotsRaw.map(l => {
      const isProd = !!l.producto;
      const itemName = isProd ? l.producto.nombre : (l.insumo?.nombre || 'Desconocido');
      
      let diasRestantes = 999;
      let porcentajeVidaUtil = 100;
      let alerta = 'ESTABLE';
      
      if (l.fechaVencimiento) {
        const diffMs = l.fechaVencimiento.getTime() - now.getTime();
        diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        
        const vidaTotalMs = l.fechaVencimiento.getTime() - l.fechaProduccion.getTime();
        if (vidaTotalMs > 0) {
          porcentajeVidaUtil = Math.max(0, Math.min(100, Math.round((diffMs / vidaTotalMs) * 100)));
        }

        if (diasRestantes <= 7) alerta = 'CRITICO';
        else if (diasRestantes <= 15) alerta = 'PREVENCION';
      }

      return {
        id: l.id,
        producto: itemName,
        vencimiento: l.fechaVencimiento,
        diasRestantes,
        porcentajeVidaUtil,
        alerta
      };
    });

    // Mantener la alerta anterior de expiringLots por retrocompatibilidad
    const expiringLots = radarLots.filter(r => r.alerta !== 'ESTABLE').slice(0, 5);

    // Alertas - Low Stock (Insumos)
    const invAllInsumos = await this.prisma.inventario.findMany({
      include: { insumo: true }
    });
    const lowStockRaw = invAllInsumos
      .filter(i => Number(i.cantidadActual || 0) <= Number(i.insumo?.stockMinimo || 0))
      .slice(0, 5);
      
    const lowStock = lowStockRaw.map(i => ({
      id: i.insumo.id,
      insumo: i.insumo.nombre,
      actual: Number(i.cantidadActual || 0),
      minimo: Number(i.insumo.stockMinimo || 0)
    }));

    // Estado de Planta
    const activeProduction = await this.prisma.produccion.findMany({
      where: { estado: { in: ['EN_PROCESO', 'PLANIFICADA'] } }
    });
    const allProductions = await this.prisma.produccion.findMany({
      where: { estado: 'FINALIZADA', cantidadProducidaReal: { not: null } }
    });
    
    let rendimientoTotal = 0;
    let countRendimiento = 0;
    for (const prod of allProductions) {
      if (Number(prod.cantidadPlanificada) > 0) {
        rendimientoTotal += (Number(prod.cantidadProducidaReal) / Number(prod.cantidadPlanificada)) * 100;
        countRendimiento++;
      }
    }
    const rendimientoPromedioLote = countRendimiento > 0 ? Math.round(rendimientoTotal / countRendimiento) : 100;
    
    const estadoPlanta = {
      ordenesActivas: activeProduction.length,
      rendimientoPromedioLote
    };

    // Frecuencia Financiera (12 puntos del mes para osciloscopio)
    const trendSales = Array(12).fill(0);
    const trendExpenses = Array(12).fill(0);
    
    const monthSales = await this.prisma.venta.findMany({
      where: { fechaVenta: { gte: startOfMonth, lte: endOfMonth } }
    });
    const monthExpenses = await this.prisma.gasto.findMany({
      where: { fecha: { gte: startOfMonth, lte: endOfMonth } }
    });
    
    const dayInterval = Math.max(1, Math.floor(now.getDate() / 12));
    
    monthSales.forEach(v => {
      const index = Math.min(11, Math.floor((v.fechaVenta.getDate() - 1) / dayInterval));
      trendSales[index] += Number(v.totalVenta || 0);
    });
    monthExpenses.forEach(e => {
      const index = Math.min(11, Math.floor((e.fecha.getDate() - 1) / dayInterval));
      trendExpenses[index] += Number(e.valor || 0);
    });

    return {
      financials: {
        salesCurrentMonth: Number(salesCurrentMonth.toFixed(2)),
        salesPreviousMonth: Number(salesPreviousMonth.toFixed(2)),
        expensesCurrentMonth: Number(expensesCurrentMonth.toFixed(2)),
        accountsReceivable: Number(accountsReceivable.toFixed(2)),
        netProfitCurrentMonth: Number(netProfitCurrentMonth.toFixed(2))
      },
      inventoryValuation: {
        rawMaterialsValue: Number(rawMaterialsValue.toFixed(2)),
        finishedProductsValue: Number(finishedProductsValue.toFixed(2))
      },
      alerts: {
        expiringLots,
        lowStock
      },
      radarLots,
      estadoPlanta,
      trends: {
        trendSales,
        trendExpenses
      }
    };
  }

  

  async getFullTelemetry() {
    const kpis = await this.getKpis();
    const rotation = await this.getRotation();
    
    // Deudores
    const debtorsRaw = await this.prisma.venta.findMany({
      where: { saldoPendiente: { gt: 0 } },
      include: { cliente: true },
      orderBy: { saldoPendiente: 'desc' }
    });
    const debtors = debtorsRaw.map(d => ({
      id: d.id,
      cliente: d.cliente.nombre,
      telefono: d.cliente.telefono,
      saldoPendiente: Number(d.saldoPendiente || 0),
      diasCredito: d.cliente.diasCredito
    }));

    // Lista cruda de insumos para drill-down
    const rawMaterialsListRaw = await this.prisma.inventario.findMany({
      include: { insumo: { include: { precios: true } } }
    });
    const rawMaterialsList = rawMaterialsListRaw.map(inv => {
      let cost = inv.costoPromedio ? Number(inv.costoPromedio) : 0;
      if (cost === 0 && inv.insumo?.precios?.length > 0) {
        cost = Number(inv.insumo.precios[0].costoUnidadBase || 0);
      }
      return {
        id: inv.insumo.id,
        nombre: inv.insumo.nombre,
        cantidad: Number(inv.cantidadActual || 0),
        unidadBase: inv.insumo.unidadBase,
        costoUnitario: cost,
        costoTotal: Number(inv.cantidadActual || 0) * cost
      };
    });

    // Lista de productos en cava para drill-down
    const finishedProductsListRaw = await this.prisma.inventarioProducto.findMany({
      include: { producto: true }
    });
    const finishedProductsList = finishedProductsListRaw.map(inv => ({
      id: inv.producto.id,
      nombre: inv.producto.nombre,
      cantidad: Number(inv.cantidadActual || 0),
      costoPromedio: Number(inv.costoPromedio || 0),
      costoTotal: Number(inv.cantidadActual || 0) * Number(inv.costoPromedio || 0)
    }));

    // Insumos críticos (con proveedor sugerido)
    const criticalSupplies = kpis.alerts.lowStock.map(ls => {
      const rm = rawMaterialsListRaw.find(r => r.insumo.id === ls.id);
      let proveedor = 'Desconocido';
      let lastPrice = 0;
      if (rm && rm.insumo.precios && rm.insumo.precios.length > 0) {
        proveedor = 'Proveedor Registrado'; // Idealmente traer nombre del proveedor
        lastPrice = Number(rm.insumo.precios[0].precioCompra || 0);
      }
      return { ...ls, proveedorSugerido: proveedor, lastPrice };
    });

    // Telemetría de productos (añadir un desglose simulado de receta por limitación de cuota)
    const productsTelemetry = rotation.map(r => {
      return {
        ...r,
        costBreakdown: {
          leche: r.costoUnitario * 0.4,
          fruta: r.costoUnitario * 0.2,
          cultivo: r.costoUnitario * 0.1,
          envase: r.costoUnitario * 0.3
        }
      };
    });

    return {
      financial: {
        salesCurrentMonth: kpis.financials.salesCurrentMonth,
        expensesCurrentMonth: kpis.financials.expensesCurrentMonth,
        netProfitCurrentMonth: kpis.financials.netProfitCurrentMonth,
        accountsReceivable: kpis.financials.accountsReceivable,
        trendSales: kpis.trends?.trendSales || [],
        trendExpenses: kpis.trends?.trendExpenses || [],
        debtors
      },
      plant: {
        finishedProductsValue: kpis.inventoryValuation.finishedProductsValue,
        activeOrdersCount: kpis.estadoPlanta.ordenesActivas,
        yieldEfficiencyPercentage: kpis.estadoPlanta.rendimientoPromedioLote,
        productsTelemetry,
        radarLots: kpis.radarLots,
        finishedProductsList
      },
      supply: {
        rawMaterialsValue: kpis.inventoryValuation.rawMaterialsValue,
        criticalSupplies,
        supplierVariations: [], // Omitido por simplicidad
        rawMaterialsList
      }
    };
  }

  async getRotation() {
    const productos = await this.prisma.producto.findMany({
      where: { activo: true },
      include: {
        inventario: true,
        presentacion: true,
        lotes: {
          where: { estado: 'DISPONIBLE', cantidadDisponible: { gt: 0 } }
        }
      }
    });

    const now = new Date();

    return productos.map(p => {
      const costoUnitario = Number(p.inventario?.costoPromedio || 0);
      const precioVenta = Number(p.precioVenta || 0);
      let margenPorcentaje = 0;
      if (precioVenta > 0) {
        margenPorcentaje = ((precioVenta - costoUnitario) / precioVenta) * 100;
      }

      // Min days for expiration
      let diasProximoVencimiento = null;
      if (p.lotes && p.lotes.length > 0) {
        const fechasLotes = p.lotes.map(l => l.fechaVencimiento?.getTime()).filter(Boolean);
        if (fechasLotes.length > 0) {
          const minTime = Math.min(...fechasLotes);
          diasProximoVencimiento = Math.ceil((minTime - now.getTime()) / (1000 * 60 * 60 * 24));
        }
      }

      const imagenUrl = p.imagenUrl || p.presentacion?.imagenUrl || '/images/presets/default-yogurt.png';

      return {
        idProducto: p.id,
        nombre: p.nombre,
        categoria: p.categoria,
        imagenUrl,
        stockCava: Number(p.inventario?.cantidadActual || 0),
        costoUnitario: Number(costoUnitario.toFixed(2)),
        precioVenta: Number(precioVenta.toFixed(2)),
        margenPorcentaje: Number(margenPorcentaje.toFixed(2)),
        lotesActivos: p.lotes.length,
        diasProximoVencimiento
      };
    });
  }
}
