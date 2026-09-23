# Estado de Auditoría Frontend Delta

## Fases completadas
- [x] F0 — Ingesta y reconciliación — COMPLETADA — 2026-09-22
- [x] F1 — Mapa actualizado — COMPLETADA — 2026-09-22
- [x] F2 — Cálculos locales — COMPLETADA — 2026-09-22
- [x] F3 — Manejo de errores — COMPLETADA — 2026-09-22
- [ ] F4 — Validaciones preventivas — PENDIENTE
- [ ] F5 — Unidades de medida — PENDIENTE
- [ ] F6 — Campos nuevos — PENDIENTE
- [ ] F7 — Dashboard — PENDIENTE
- [ ] F8 — Formato números — PENDIENTE
- [ ] F9 — Contratos API — PENDIENTE
- [ ] F10 — Feedback/Estados — PENDIENTE
- [ ] F11 — Tests E2E + Cierre — PENDIENTE

## Última fase ejecutada
F3 — Manejo de errores — finalizada 2026-09-22 20:12

## Próxima fase
F4 — Validaciones preventivas (Poka-Yoke)

## Informe parcial de la fase actual (si aplica)
Fase F3 completada y documentada en INFORME-AUD-F3.md.
Identificados ~25 BadRequestException en backend.
Vulnerabilidad de UX detectada: useProductionPageData.js captura errores con window.alert(e.message) crudo violando las reglas del Design System MANNÁ (no alerts). Los errores de esquemas Zod en ventas/compras muestran mensajes técnicos sin formatear.
