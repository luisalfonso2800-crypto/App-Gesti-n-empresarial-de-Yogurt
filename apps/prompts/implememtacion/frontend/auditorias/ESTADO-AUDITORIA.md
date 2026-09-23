# Estado de Auditoría Frontend Delta

## Fases completadas
- [x] F0 — Ingesta y reconciliación — COMPLETADA — 2026-09-22
- [x] F1 — Mapa actualizado — COMPLETADA — 2026-09-22
- [x] F2 — Cálculos locales — COMPLETADA — 2026-09-22
- [ ] F3 — Manejo de errores — PENDIENTE
- [ ] F4 — Validaciones preventivas — PENDIENTE
- [ ] F5 — Unidades de medida — PENDIENTE
- [ ] F6 — Campos nuevos — PENDIENTE
- [ ] F7 — Dashboard — PENDIENTE
- [ ] F8 — Formato números — PENDIENTE
- [ ] F9 — Contratos API — PENDIENTE
- [ ] F10 — Feedback/Estados — PENDIENTE
- [ ] F11 — Tests E2E + Cierre — PENDIENTE

## Última fase ejecutada
F2 — Cálculos locales duplicados — finalizada 2026-09-22 20:11

## Próxima fase
F3 — Manejo de errores (Nuevos BadRequestException del backend)

## Informe parcial de la fase actual (si aplica)
Fase F2 completada y documentada en INFORME-AUD-F2.md.
Hallazgo crítico detectado: recipeHelpers.js L564 mantiene fallback hardcodeado unitCostWip = 4390 incompatible con la remediación HAL-F4-02 del backend (que rechaza costos <= 0 con BadRequestException). Redondeo de preview en compras/ventas sufre discrepancia de +/- 1 COP respecto al cálculo Decimal.js del backend.
