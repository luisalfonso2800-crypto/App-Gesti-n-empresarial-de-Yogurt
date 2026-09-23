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
- [ ] F8 — Formato números — PENDIENTE
- [ ] F9 — Contratos API — PENDIENTE
- [ ] F10 — Feedback/Estados — PENDIENTE
- [ ] F11 — Tests E2E + Cierre — PENDIENTE

## Última fase ejecutada
F7 — Dashboard y métricas analíticas — finalizada 2026-09-22 20:16

## Próxima fase
F8 — Formato de números, fechas y unidades

## Informe parcial de la fase actual (si aplica)
Fase F7 completada y documentada en INFORME-AUD-F7.md.
Hallazgos en Dashboard:
1. flujoCajaReal (liquidez de caja) no está expuesto en las tarjetas del frontend, ocultando los recaudos efectivos frente a la facturación a crédito.
2. utilidadDevengada está etiquetada ambiguamente como "UTILIDAD NETA".
3. Heurística quemada en ficha técnica de producto: margen Venta Directa = margenPorcentaje + 15%.
