import { z } from 'zod';

export const discardLotSchema = z.object({
  cantidad: z.number().positive('cantidad debe ser mayor a 0'),
  motivo: z.string().optional().default('Vencimiento')
}).strict();
