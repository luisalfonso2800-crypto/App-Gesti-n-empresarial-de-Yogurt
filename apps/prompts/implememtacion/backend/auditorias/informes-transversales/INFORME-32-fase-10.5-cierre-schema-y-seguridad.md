# INFORME-32: FASE 10.5 — CIERRE DE SCHEMA Y SEGURIDAD SERVER-SIDE

## 1. Brecha de Seguridad Server-Side (`HAL-F10-01` + `HAL-F10-02`)
La combinación de DTOs vacíos (`sales.dto.js`, `purchases.dto.js`) y la persistencia ciega de totales provistos por el cliente (`sales.service.js`) genera una vulnerabilidad crítica:
- **Vector de riesgo:** Cualquier cliente API (o manipulación de red en navegador) puede enviar subtotales, IVAs y totales arbitrarios (ej. venta real de $1.190.000 enviada con total $100.000). El backend no recalcula con `precio * cantidad * (1 + iva - desc)` ni valida integridad en servidor.
- **Impacto:** Fraude financiero, descuadre patrimonial en reportes gerenciales e inconsistencia contable-tributaria irrecuperable.

## 2. Agravante de Escala Decimal (`HAL-F10-03`)
- **Evidencia:** `costoUnidadBase` en `@db.Decimal(12, 2)` (en `insumos` y `productos`).
- **Problema:** En ingredientes micro-dosificados (fermentos lácteos, colorantes, esencias) con costo unitario fraccionario (ej. $18.4523/g), el schema trunca a 2 decimales ($18.45/g).
- **Agravante:** En lotes de producción continuos (ej. 50.000 litros con 150 kg de cultivo fraccionario), el truncamiento genera distorsiones materiales de costo en órdenes de producción y valoración de inventario de materias primas. Requiere `@db.Decimal(14, 4)` o superior.

## 3. Conteo Oficial Acumulado

| Severidad | Fases 1–9 | Fase 10 | Total Consolidado |
| :--- | :---: | :---: | :---: |
| **CRÍTICO** | 17 | 2 (`HAL-F10-01`, `HAL-F10-02`) | **19** |
| **ALTO** | 16 | 1 (`HAL-F10-03`) | **17** |
| **MEDIO** | 3 | 0 | **3** |
| **TOTAL** | **36** | **3** | **39** |

---
**ESTADO:** FASE 10.5 COMPLETADA. CONTEO OFICIAL CERRADO EN 39 HALLAZGOS ÚNICOS. DETENIDO SEGÚN REGLA.
