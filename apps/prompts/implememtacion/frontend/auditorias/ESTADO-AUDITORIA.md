# Estado de Auditoría Frontend Delta

## Fases completadas
- [x] F0 — Ingesta y reconciliación — COMPLETADA — 2026-09-22
- [x] F1 — Mapa actualizado — COMPLETADA — 2026-09-22
- [x] F2 — Cálculos locales — COMPLETADA — 2026-09-22
- [x] F3 — Manejo de errores — COMPLETADA — 2026-09-22
- [x] F4 — Validaciones preventivas — COMPLETADA — 2026-09-22
- [x] F5 — Unidades de medida — COMPLETADA — 2026-09-22
- [x] F6 — Campos nuevos — COMPLETADA — 2026-09-22
- [ ] F7 — Dashboard — PENDIENTE
- [ ] F8 — Formato números — PENDIENTE
- [ ] F9 — Contratos API — PENDIENTE
- [ ] F10 — Feedback/Estados — PENDIENTE
- [ ] F11 — Tests E2E + Cierre — PENDIENTE

## Última fase ejecutada
F6 — Campos nuevos del backend — finalizada 2026-09-22 20:15

## Próxima fase
F7 — Dashboard y métricas analíticas

## Informe parcial de la fase actual (si aplica)
Fase F6 completada y documentada en INFORME-AUD-F6.md.
costoBaseSinIva está completamente expuesto y editable en Precios Proveedor.
Campos nuevos no expuestos en frontend:
1. densidad en Insumos/Productos (no editable en UI).
2. unidadCantidadProducida en liquidación de producción (no se envía en payload).
3. stockAnterior y stockNuevo no visibles en la tabla de movimientos de inventario.
4. Saldo negativo en cartera carece de badge explícito de "ANTICIPO / SALDO A FAVOR".
