# Estado de Auditoría Frontend Delta

## Fases completadas
- [x] F0 — Ingesta y reconciliación — COMPLETADA — 2026-09-22
- [x] F1 — Mapa actualizado — COMPLETADA — 2026-09-22
- [x] F2 — Cálculos locales — COMPLETADA — 2026-09-22
- [x] F3 — Manejo de errores — COMPLETADA — 2026-09-22
- [x] F4 — Validaciones preventivas — COMPLETADA — 2026-09-22
- [ ] F5 — Unidades de medida — PENDIENTE
- [ ] F6 — Campos nuevos — PENDIENTE
- [ ] F7 — Dashboard — PENDIENTE
- [ ] F8 — Formato números — PENDIENTE
- [ ] F9 — Contratos API — PENDIENTE
- [ ] F10 — Feedback/Estados — PENDIENTE
- [ ] F11 — Tests E2E + Cierre — PENDIENTE

## Última fase ejecutada
F4 — Validaciones preventivas — finalizada 2026-09-22 20:13

## Próxima fase
F5 — Unidades de medida en frontend

## Informe parcial de la fase actual (si aplica)
Fase F4 completada y documentada en INFORME-AUD-F4.md.
Brechas Poka-Yoke críticas identificadas:
1. RecipeStageBomTable.jsx permite ingresar merma max=100 (backend rechaza >= 100 con BadRequestException).
2. PresentationModal.jsx no exige obligatoriedad en cantidadMl para envases a granel (BALDE/TANQUE_GRANEL), detonando error 400 de HAL-F3-03.
3. Falta de indicador visual cuando un producto intermedio WIP tiene costo $0.
