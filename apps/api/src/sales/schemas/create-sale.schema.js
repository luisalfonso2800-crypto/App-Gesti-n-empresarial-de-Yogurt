import { z } from 'zod';

export const createSaleDetailSchema = z.object({
  idProducto: z.string().min(1, 'idProducto es requerido'),
  idLote: z.string().optional().nullable(),
  cantidad: z.number().positive('cantidad debe ser mayor a 0'),
  precioUnitario: z.number().nonnegative('precioUnitario debe ser mayor o igual a 0'),
  descuento: z.number().nonnegative().optional().default(0),
  tipoDescuento: z.enum(['COMERCIAL', 'FINANCIERO']).optional().default('COMERCIAL'),
  tarifaIva: z.number().nonnegative().optional().default(0),
  precioIncluyeIva: z.boolean().optional(),
  // Campos calculados por el cliente que se descartan o validan opcionalmente
  baseGravable: z.number().optional(),
  montoIva: z.number().optional(),
  totalLinea: z.number().optional()
}).strict();

export const createSaleSchema = z.object({
  idCliente: z.string().min(1, 'idCliente es requerido'),
  fechaVenta: z.string().or(z.date()).optional().default(() => new Date()),
  canalVenta: z.string().optional().default('DIRECTA'),
  tipoPago: z.string().optional().default('CONTADO'),
  fechaLimitePago: z.string().or(z.date()).optional().nullable(),
  aplicaIva: z.boolean().optional().default(false),
  estado: z.string().optional().default('COMPLETADA'),
  observaciones: z.string().optional().nullable(),
  valorPagado: z.number().nonnegative().optional().default(0),
  metodoPago: z.string().optional().default('EFECTIVO'),
  referenciaPago: z.string().optional().nullable(),
  observacionesPago: z.string().optional().nullable(),
  detalles: z.array(createSaleDetailSchema).min(1, 'detalles debe contener al menos un producto'),
  // Campos calculados que el cliente podría enviar pero que el servidor ignora y recalcula
  subtotal: z.number().optional(),
  descuentoTotal: z.number().optional(),
  baseImponible: z.number().optional(),
  ivaTotal: z.number().optional(),
  totalVenta: z.number().optional(),
  saldoPendiente: z.number().optional()
}).strict();
