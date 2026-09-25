# 13-audit-modal-nuevo-producto-casero.md

Modelo: Gemini 3.8 Flash
Effort: low

TAREA CONTROLADA — AUDITORÍA FORENSE DEL MODAL "NUEVO PRODUCTO" Y SU BACKEND (CONTEXTO CASERO)

OBJETIVO TÉCNICO:
1. Auditar el modal "Nuevo Producto" y su backend para determinar qué campos ya existen en frontend y BD, y cuáles requieren migración de schema Prisma.
2. Validar específicamente la viabilidad de las 10 mejoras propuestas para el contexto casero (no industrial):
   - M1: Código corto auto-generado (ej: YOG-FRE-500)
   - M2: Unidad de Venta simple (und/libra/kilo/litro/docena)
   - M3: Costo Estimado manual + cálculo reactivo de margen real
   - M4: Precio sugerido automático
   - M5: Stock Mínimo simple
   - M6: Cascada Poka-Yoke laxa (solo Nombre obligatorio para borrador)
   - M7: Validación simple de imagen (2MB, PNG/JPG, preview, quitar)
   - M8: Semáforo simple (3 estados: LISTO / INCOMPLETO / DESACTIVADO)
   - M9: Uppercase automático en Observaciones
   - M10: Plantilla de descripción con ejemplo
3. Reportar por cada mejora: `Existe ya en frontend | Existe ya en BD | Requiere migración | Requiere API nueva | Riesgo`.
4. CERO modificaciones. SOLO lectura y reporte.

FUENTES DE VERDAD A INSPECCIONAR (PRESUPUESTO: MÁXIMO 8 LECTURAS / 0 EDICIONES):
- apps/web/src/app/catalog/products/** (page + componentes del modal)
- apps/web/src/components/** (solo los referenciados por la página de productos)
- apps/api/prisma/schema.prisma (modelo Producto + enums relacionados)
- apps/api/src/products/** (o equivalente: controller, service, repository, DTO)
- apps/api/prisma/seed*.js (solo bloque de productos)
- apps/web/e2e/products/** (si existe)
- apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx (patrón de referencia de cascada Poka-Yoke)
- .agents/rules/03-frontend-architecture.md + 04-design-system-manna.md + 05-forms-and-modals.md (reglas aplicables)

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 8 LECTURAS, MÁXIMO 0 EDICIONES):
- CERO búsquedas recursivas ciegas. Usa `Get-ChildItem` + `Select-String` con patrones específicos.
- CERO modificaciones. SOLO LECTURA.
- Agrupa lecturas por carpeta cuando sea posible.
- Si tras 8 lecturas falta información, REPORTA lo obtenido y marca `BLOQUEADO PARCIAL`.
