import { z } from 'zod';

export const createPaymentSchema = z.object({
  idVenta: z.string().min(1, 'idVenta es requerido'),
  idCliente: z.string().min(1, 'idCliente es requerido'),
  valorPagado: z.number().positive('valorPagado debe ser mayor a 0'),
  fechaPago: z.string().or(z.date()).optional().default(() => new Date()),
  metodoPago: z.string().optional().default('EFECTIVO'),
  referencia: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),
  nuevaFechaLimite: z.string().or(z.date()).optional().nullable()
}).strict();
