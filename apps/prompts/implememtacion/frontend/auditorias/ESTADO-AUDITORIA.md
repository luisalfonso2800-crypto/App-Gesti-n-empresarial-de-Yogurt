# Estado de Auditoría Frontend Delta

## Fases completadas
- [x] F0 — Ingesta y reconciliación — COMPLETADA — 2026-09-22
- [x] F1 — Mapa actualizado — COMPLETADA — 2026-09-22
- [x] F2 — Cálculos locales — COMPLETADA — 2026-09-22
- [x] F3 — Manejo de errores — COMPLETADA — 2026-09-22
- [x] F4 — Validaciones preventivas — COMPLETADA — 2026-09-22
- [x] F5 — Unidades de medida — COMPLETADA — 2026-09-22
- [x] F6 — Campos nuevos — COMPLETADA — 2026-09-22
- [x] F7 — Dashboard — COMPLETADA — 2026-09-22
- [x] F8 — Formato números — COMPLETADA — 2026-09-22
- [ ] F9 — Contratos API — PENDIENTE
- [ ] F10 — Feedback/Estados — PENDIENTE
- [ ] F11 — Tests E2E + Cierre — PENDIENTE

## Última fase ejecutada
F8 — Formato de números, fechas y unidades — finalizada 2026-09-22 20:17

## Próxima fase
F9 — Contratos API frontend ↔ esquemas Zod backend

## Informe parcial de la fase actual (si aplica)
Fase F8 completada y documentada en INFORME-AUD-F8.md.
formatCurrency trunca deliberadamente a enteros (adecuado para moneda COP comercial), pero produce pérdida visual en micro-costos unitarios Decimal(14,4) como cultivos ($18.4523/g -> $18). cleanCurrency elimina todo no-dígito pudiendo multiplicar x100 montos pegados con coma decimal.
