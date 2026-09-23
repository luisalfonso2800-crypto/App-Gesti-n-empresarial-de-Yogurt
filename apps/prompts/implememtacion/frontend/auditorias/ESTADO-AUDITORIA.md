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
- [x] F9 — Contratos API — COMPLETADA — 2026-09-22
- [ ] F10 — Feedback/Estados — PENDIENTE
- [ ] F11 — Tests E2E + Cierre — PENDIENTE

## Última fase ejecutada
F9 — Contratos API frontend ↔ Zod backend — finalizada 2026-09-22 20:18

## Próxima fase
F10 — Estados de carga y feedback de usuario

## Informe parcial de la fase actual (si aplica)
Fase F9 completada y documentada en INFORME-AUD-F9.md.
Riesgos identificados con esquemas Zod .strict():
1. useSaleForm.js envía ...formData en la raíz pudiendo contaminar con keys extra que Zod .strict() rechaza.
2. Zod impone límite de descuento comercial máx 50% de la línea (HAL-F7-03); el frontend no tiene guarda preventiva UI para este tope.
3. useFormPhaseData.js (compras) debe sanitizar propiedades de estado UI antes de enviar a POST /purchases.
