# ESTADO DE REMEDIACIÓN FRONTEND DELTA

> **Proyecto:** Sistema de Gestión Empresarial de Yogurt (MANNÁ)  
> **Inicio de Remediación:** 2026-09-22  
> **Seguimiento de Bloques:**

---

## Bloques de Remediación

- [x] **Bloque Front-1: Poka-Yoke y Errores Críticos** — COMPLETADO — 2026-09-22
  - HAL-F0-01 (CRÍTICO): Erradicar alert() nativo en `useProductionPageData.js`.
  - HAL-F2-01 (CRÍTICO): Eliminar fallback hardcodeado de WIP y bloquear submit si existe WIP sin costo configurado.
  - HAL-F4-01 (ALTO): Restringir merma a `< 100%` (`max="99.9"`, advertencia visual inline).
  - HAL-F4-02 (ALTO): Bloquear envases a granel (`BALDE`, `TANQUE_GRANEL`) sin volumen explícito (`cantidadMl > 0`).
  - HAL-F9-01 (ALTO): Guarda de descuento máximo comercial de 50% en líneas de venta.
  - HAL-F9-02 (ALTO): Whitelist estricta de payload en `POST /sales` conforme a DTO Zod `.strict()`.

- [x] **Bloque Front-2: Validación Preventiva, SRP, CSS Modules y Ergonomía** — COMPLETADO — 2026-09-22
  - Front-2A / 2A-1 / 2A-2 (ALTO): HAL-F1-01 erradicado al 100% (22 infracciones SRP e inline styles reducidas a 0).
  - HAL-F7-01 (MEDIO): Dashboard con Flujo de Caja Real y Utilidad Devengada.
  - HAL-F6-01 (MEDIO): Campo Densidad en catálogo de insumos con validación 0.5 - 2.5 g/ml.
  - HAL-F6-02 (MEDIO): Badge de Anticipo en cartera cuando `saldoPendiente < 0`.
  - HAL-F8-01 (BAJO): Helper `formatUnitCost` para micro-costos unitarios (< 100 con 4 decimales).
  - HAL-F5-01 (BAJO): Erradicado fallback hardcodeado `'kg'` en compras.

- [ ] **Bloque Front-3: Limpieza Integral y Verificación E2E** — PENDIENTE

---

## Último Bloque Ejecutado
- **Bloque Front-2 (Front-2A y Front-2B)** — Finalizado el 2026-09-22 con verificación global en 0 infracciones (`node .agents/scripts/verify-srp.js --all`).
