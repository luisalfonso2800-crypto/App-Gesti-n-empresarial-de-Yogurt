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

- [ ] **Bloque Front-2: Validación Preventiva y Ergonomía de Planta** — PENDIENTE
- [ ] **Bloque Front-3: Limpieza Integral y Verificación E2E** — PENDIENTE

---

## Último Bloque Ejecutado
- **Bloque Front-1** — Finalizado el 2026-09-22 con verificación SRP exitosa (`node .agents/scripts/verify-srp.js`).
