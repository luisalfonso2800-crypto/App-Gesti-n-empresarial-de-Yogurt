# INFORME DE AUDITORÍA FRONTEND DELTA — FASE F3: MANEJO DE ERRORES (NUEVOS BadRequestException)

> **Fecha:** 2026-09-22  
> **Ámbito:** Frontend (`apps/web/src`) frente a las nuevas validaciones `BadRequestException` introducidas en el backend durante la remediación (Bloques 1 a 8B).  
> **Estado:** ✅ FASE F3 COMPLETADA

---

## 1. Inventario de Nuevas Excepciones `BadRequestException` del Backend

Durante la remediación integral se formalizaron ~25 excepciones server-side para blindar el negocio de datos corruptos, mermas anómalas y fallbacks silenciosos:

| Módulo Backend | Archivo / Línea | Causa de Excepción `BadRequestException` | Mensaje Emitido por Backend |
| :--- | :--- | :--- | :--- |
| **Producción** | `production.repository.js:176` | `rendimientoBase <= 0` (`HAL-F4-03`) | `"El rendimientoBase de la receta debe ser estrictamente mayor a 0"` |
| **Producción** | `production.repository.js:193` | `merma < 0` o `merma >= 100` (`HAL-F8-02`) | `"Porcentaje de merma inválido (X%). Debe estar entre 0% y menos de 100%"` |
| **Producción** | `production.repository.js:293` | Costo WIP inválido (`HAL-F4-02`) | `"Costo unitario inválido ($X) para el producto intermedio Y. Configure un costo válido en el lote o inventario."` |
| **Presentaciones**| `presentations.service.js:35` | Granel sin volumen (`HAL-F3-03`) | `"Debe especificar el volumen real (cantidadMl) para presentaciones a granel (BALDE o TANQUE_GRANEL)"` |
| **Recetas** | `recipes.service.js:136` | `cantidadRequerida <= 0` | `"La cantidad requerida debe ser estrictamente mayor a 0"` |
| **Recetas** | `recipes.service.js:140` | Unidad vacía | `"La unidad de medida no puede estar vacía"` |
| **Recetas** | `recipes.service.js:148` | Insumo y WIP simultáneos | `"Cada detalle de receta debe especificar un insumo comprado o un producto intermedio de planta, no ambos"` |
| **Recetas** | `recipes.service.js:225` | Empaque primario faltante | `"Productos comerciales requieren al menos un insumo de empaque primario"` |
| **Recetas** | `recipes.service.js:241` | Límite físico de envase | `"El volumen total de líquidos supera la capacidad geométrica del contenedor"` |
| **Ventas** | `sales.service.js:27` | Zod schema validation fallida | `"Validación de venta fallida: [detalles del esquema]"` |
| **Compras** | `purchases.service.js:27` | Zod schema validation fallida | `"Validación de compra fallida: [detalles del esquema]"` |
| **Pagos** | `payments.service.js:27` | Zod schema validation fallida | `"Validación de pago fallida: [detalles del esquema]"` |
| **Metas** | `goals.service.js:51` | Aporte <= 0 | `"El monto del aporte debe ser mayor a cero"` |

---

## 2. Diagnóstico del Tratamiento de Errores en Frontend

### A. Cliente HTTP Base (`apps/web/src/lib/api-client.js`)
- **Comportamiento:** Si `!response.ok`, parsea `errorData = await response.json()` y arroja `new ApiError(response.status, errorData.message || 'Error en la petición', errorData)`.
- **Evaluación:** **Conforme a nivel de transporte:** El texto descriptivo del backend viaja correctamente en `e.message`.

### B. Captura y Presentación en la Capa UI (Vulnerabilidades Detectadas)

1. **Uso de `alert(e.message)` Crudo en Producción:**
   - En `apps/web/src/app/operations/production/hooks/useProductionPageData.js`:
     - L129: `alert(e.message);` al fallar `handleCreateOrder`.
     - L144: `alert(e.message);` al fallar `handlePurchaseShortage`.
   - **Diagnóstico:** **INFRACCIÓN DE UX / DESIGN SYSTEM MANNÁ:**
     La Regla 16.2 / 37 prohíbe terminantemente `window.alert()`. Si una receta falla por merma o rendimiento, el usuario recibe un diálogo modal nativo del navegador bloqueante y tosco en vez de un banner o Toast del Design System.
2. **Mensaje de Error Genérico en Ventas (`useSaleForm.js`):**
   - En `useSaleForm.js` L224: `setErrorMsg(err.message || 'Error al procesar la venta')`.
   - **Evaluación:** Renderiza el mensaje en un `div` de error del modal. Si Zod falla en backend con un JSON anidado (`Validación de venta fallida: ...`), el texto puede resultar confuso para el cajero/vendedor.
3. **Ausencia de Prevención UI en Recetas:**
   - Si en el modal de recetas el usuario ingresa merma = 150%, el frontend no avisa en tiempo real; permite hacer click en "Guardar", viaja al backend y explota con la nueva excepción de `HAL-F8-02`.

---

## 3. Matriz de Severidad de Captura de Excepciones

| Excepción Backend | Manejo Actual en Frontend | Calidad del Feedback UI | Acción de Remediación Necesaria |
| :--- | :--- | :---: | :--- |
| **Rendimiento <= 0** | Catch con `alert(e.message)` en producción | ❌ Pésimo (Bloqueante nativo) | Migrar a `NotificationContext` / Toast y validar `rendimientoBase > 0` en formulario. |
| **Merma fuera de rango** | Catch con `alert(e.message)` | ❌ Pésimo | Agregar Poka-Yoke visual `[0% - 99.9%]` en `RecipeStageBomTable.jsx`. |
| **Costo WIP inválido** | Catch con `alert(e.message)` | ⚠️ Comprensible pero alerta fea | Reemplazar `alert` por notificación de planta asistida. |
| **Granel sin volumen** | Toast o form error | ⚠️ Mejorable | Validación obligatoria en `PresentationModal.jsx`. |
| **Zod Schema Rejections** | `setErrorMsg(err.message)` | ⚠️ Texto técnico crudo | Interceptar errores de esquema y traducirlos a mensaje humano legible. |

---

## 4. Conclusiones y Recomendaciones de la Fase F3

1. **Erradicar de inmediato los `alert(e.message)` en `useProductionPageData.js`:** Es una violación flagrante de la experiencia operativa de planta. Sustituir por `useNotification` / `NotificationContext`.
2. **Validación Preventiva en Origen (Fase F4):** Impedir que los datos lleguen al backend si no cumplen las invariantes ya conocidas (merma `< 100`, rendimiento `> 0`, volumen granel requerido).
