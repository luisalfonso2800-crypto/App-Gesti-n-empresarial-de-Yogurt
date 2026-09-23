# BACKLOG DE HALLAZGOS EMERGENTES Y DEUDA TÉCNICA (FASE DE REMEDIACIÓN)

> **PROPÓSITO:** Este documento aísla cualquier nuevo hallazgo o inconsistencia técnica descubierta **DURANTE** la implementación de fixes en la fase de remediación.  
> **REGLA DE GOBERNANZA:** Queda estrictamente prohibido alterar retroactivamente el informe final de auditoría (`INFORME-35` / `INFORME-36`). Todo descubrimiento nuevo y deuda técnica aceptada se documenta aquí.

---

## 1. HAL-F4-07 — Deuda Técnica Aceptada (No Bloqueante)

A raíz de la migración del 100% de los flujos analíticos, de valoración de inventarios (Kardex / CPP), explosión de materiales (BOM / WIP) y liquidación financiera server-side (Ventas, Compras, Pagos, Precios Proveedor) a `Decimal.js`:

- **Conversiones en Categoría B (Validaciones Zod, DTOs y guardas de tipo):** 195 ocurrencias.
  - **Riesgo:** Bajo.
  - **Naturaleza:** Se limitan a validar coercitividad y existencia de números en payloads HTTP entrantes (`@IsNumber()`, `z.coerce.number()`, `Number(x) > 0`).
- **Conversiones en Categoría C (Logging, formato de strings, fechas y comparadores de IDs):** 75 ocurrencias.
  - **Riesgo:** Nulo.
  - **Naturaleza:** Exclusivamente cosméticas y de presentación; ninguna interviene en cálculos aritméticos o acumulación de saldo.
- **Justificación técnica:** No introducen distorsión por coma flotante IEEE-754 ni drift en balances monetarios o cantidades de stock.
- **Recomendación:** Migración oportunista cuando se refactoricen o extiendan dichos módulos en ciclos de mantenimiento regulares (no forzar migración masiva innecesaria).

---

## 2. Formato de Registro para Nuevos Hallazgos Emergentes

| ID Emergente | Fecha Detección | Módulo / Archivo | Severidad | Problema Técnico Detectado | Impacto | Acción Propuesta |
| :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| **G-02** | 2026-09-22 | `dashboard.service.js` | MEDIO | Homologar política de suma cruda previa al redondeo implementada en `simulation.engine.service.js` (`HAL-F6-03`). | Agregados de reportería mensual. | Ajustar sumatorias de dashboard a nivel SQL / acumulador crudo. |
| **G-03** | 2026-09-22 | `production.repository.js` | MEDIO | Revisión de auditoría en anulación de órdenes de producción y restitución en Kardex de WIP. | Integridad de trazabilidad inversa. | Implementar pruebas de stress transaccional en rollback de lotes. |
| **G-04** | 2026-09-22 | `schema.prisma` / Seed | BAJO | Backfill de registros históricos sin `unidadCantidadProducida`. | Datos preexistentes en BD dev. | Script de migración de datos para asignar unidad según catálogo. |
| **G-05** | 2026-09-22 | `reports/dto` | BAJO | Endurecimiento de esquemas Zod en sub-rutas de reportes. | Robustez de validación HTTP. | Estandarizar validaciones DTO. |

---

## 3. Historial de Revisiones
- *2026-09-22: Apertura oficial del backlog para la fase de remediación.*
- *2026-09-22: Registro de deuda técnica aceptada de HAL-F4-07 (Categorías B y C) y cierre definitivo al 100% de flujos de cálculo.*
