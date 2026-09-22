import { z } from 'zod';

export const createPurchaseDetailSchema = z.object({
  idInsumo: z.string().min(1, 'idInsumo es requerido'),
  idProveedor: z.string().optional().nullable(),
  cantidad: z.number().positive('cantidad debe ser mayor a 0'),
  precioUnitario: z.number().nonnegative('precioUnitario debe ser mayor o igual a 0'),
  tieneIva: z.boolean().optional().default(true),
  porcentajeIva: z.number().nonnegative().optional().default(19.0),
  precioIncluyeIva: z.boolean().optional().default(true),
  // Campos calculados por cliente descartados o validados
  subtotal: z.number().optional(),
  montoIva: z.number().optional(),
  subtotalSinIva: z.number().optional()
}).strict();

export const createPurchaseSchema = z.object({
  idProveedor: z.string().optional().nullable(),
  idOrden: z.string().optional().nullable(),
  fechaCompra: z.string().or(z.date()).optional().default(() => new Date()),
  condicion: z.string().optional().default('CONTADO'),
  esDirecta: z.boolean().optional().default(false),
  fleteGlobal: z.number().nonnegative().optional().default(0),
  observaciones: z.string().optional().nullable(),
  esNuevoProveedor: z.boolean().optional().default(false),
  nuevoProveedor: z.object({
    nombre: z.string().min(1),
    nitCedula: z.string().min(1),
    telefono: z.string().optional().nullable(),
    personaContacto: z.string().optional().nullable()
  }).optional(),
  detalles: z.array(createPurchaseDetailSchema).min(1, 'detalles debe contener al menos un insumo'),
  // Campos monetarios globales que el cliente podría enviar pero que el servidor recalcula
  total: z.number().optional(),
  totalSinIva: z.number().optional(),
  totalIva: z.number().optional()
}).strict();
