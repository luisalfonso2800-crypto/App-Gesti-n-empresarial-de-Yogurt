# Estado de Auditoría Frontend Delta

## Fases completadas
- [x] F0 — Ingesta y reconciliación — COMPLETADA — 2026-09-22
- [x] F1 — Mapa actualizado — COMPLETADA — 2026-09-22
- [x] F2 — Cálculos locales — COMPLETADA — 2026-09-22
- [x] F3 — Manejo de errores — COMPLETADA — 2026-09-22
- [x] F4 — Validaciones preventivas — COMPLETADA — 2026-09-22
- [x] F5 — Unidades de medida — COMPLETADA — 2026-09-22
- [ ] F6 — Campos nuevos — PENDIENTE
- [ ] F7 — Dashboard — PENDIENTE
- [ ] F8 — Formato números — PENDIENTE
- [ ] F9 — Contratos API — PENDIENTE
- [ ] F10 — Feedback/Estados — PENDIENTE
- [ ] F11 — Tests E2E + Cierre — PENDIENTE

## Última fase ejecutada
F5 — Unidades de medida en frontend — finalizada 2026-09-22 20:13

## Próxima fase
F6 — Campos nuevos del backend (densidad, unidadCantidadProducida, etc.)

## Informe parcial de la fase actual (si aplica)
Fase F5 completada y documentada en INFORME-AUD-F5.md.
unitNormalizer.js está sincronizado con unit-registry de backend (mg, oz=29.5735 ml, paq).
Detectados usos ad-hoc en RecipeStageBomTable.jsx y ProductionOrderCompleteModal.jsx con String.includes('und') ignorando familias discretas de planta (tapa, botella, vaso). En compras (useFormPhaseData.js) persiste fallback hardcodeado a 'kg'.
