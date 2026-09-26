# Fase 11 Completada

## Título formal
feat(prisma): implementar y validar pagos-y-gastos fase 11

## Resumen detallado
- Modelos agregados: Pago, Gasto.
- Relaciones agregadas: Cliente -> Pago, Venta -> Pago.
- Modelos modificados: Cliente, Venta (agregadas colecciones `pagos Pago[]`).

## Estado de validación técnica
- `prisma format`: exitoso
- `prisma validate`: exitoso

## Constancia
- Cero migraciones físicas aplicadas.
- Cero cambios fuera de alcance.
