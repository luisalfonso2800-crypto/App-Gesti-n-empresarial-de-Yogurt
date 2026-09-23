# INFORME DE AUDITORÍA FRONTEND DELTA — FASE F10: ESTADOS DE CARGA Y FEEDBACK DE USUARIO

> **Fecha:** 2026-09-22  
> **Ámbito:** Frontend (`apps/web/src`) — Evaluación de spinners, retroalimentación asíncrona, timeouts y cobertura de `AssistedEmptyState`.  
> **Estado:** ✅ FASE F10 COMPLETADA

---

## 1. Cobertura de `AssistedEmptyState` (100% de Adopción)

La auditoría confirmó que el componente canónico `AssistedEmptyState` (`@/components/ui/AssistedEmptyState`) está integrado en **todas las tablas principales y vistas de lista** del sistema:
- `/catalog/presentations` (`PresentationsTable.jsx`)
- `/catalog/products` (`ProductsTable.jsx`)
- `/catalog/recipes` (`RecipesList.jsx`)
- `/catalog/supplier-prices` (`PricesComparisonTable.jsx`)
- `/catalog/suppliers` (`SuppliersTable.jsx`)
- `/catalog/supplies` (`SuppliesTable.jsx`)
- `/commercial/clients` (`clients/page.jsx`)
- `/commercial/expenses` (`expenses/page.jsx`)
- `/commercial/payments` (`payments/page.jsx`)
- `/commercial/sales` (`SalesTable.jsx`)
- `/operations/inventory` (`inventory/page.jsx`)
- `/operations/lots` (`lots/page.jsx`)
- `/operations/production` (`ProductionOrdersGrid.jsx`, `ProductionTable.jsx`)
- `/operations/purchases` (`purchases/page.jsx`)

**Veredicto:** **EXCELENTE.** No existen tablas que queden en blanco cuando no hay datos; todas orientan al usuario con título, ícono temático y botón de acción asistida.

---

## 2. Diagnóstico de Spinners y Estados de Carga

- **Estados de Carga de Página (`LoadingState`):**  
  Implementado uniformemente en todas las páginas y tablas antes de desplegar el árbol de componentes.
- **Contenedor `SmartModal` (`apps/web/src/components/ui/SmartModal.jsx`):**  
  - Cuenta con `isSubmitting` para deshabilitar el botón de cierre (X).
  - Incluye prevención de cierre accidental (`confirmOverlay`) si `isDirty === true` evitando que un operario pierda datos digitados.
  - **Falta menor:** En el cuerpo del modal, no muestra un spinner overlay translúcido cuando `isSubmitting === true`, delegando la animación de carga exclusivamente al botón submit individual del formulario.

---

## 3. Resiliencia de Red y Manejo Offline

- **`apiClient.fetch` y `ServerOfflineCanvas`:**  
  Si el servidor no responde o hay fallo de red (`ECONNREFUSED` / `Failed to fetch`), `apiClient` emite el evento `'manna:network-offline'` y las vistas renderizan el componente interactivo `ServerOfflineCanvas` con botón de reintento (`onRetry`), en lugar de una pantalla rota.

---

## 4. Conclusiones y Recomendaciones de la Fase F10

1. **Estado General del Feedback:** El sistema presenta una excelente madurez en estados vacíos (`AssistedEmptyState`) y manejo offline (`ServerOfflineCanvas`).
2. **Recomendación Menor:** Enriquecer `SmartModal` para que, cuando `isSubmitting === true`, renderice un overlay semi-transparente con spinner centrado, impidiendo clics repetidos en cualquier input del modal durante transacciones de backend lentas.
