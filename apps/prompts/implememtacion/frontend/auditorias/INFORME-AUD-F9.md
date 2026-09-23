# INFORME DE AUDITORÍA FRONTEND DELTA — FASE F9: CONTRATOS API FRONTEND ↔ ESQUEMAS ZOD

> **Fecha:** 2026-09-22  
> **Ámbito:** Comparativa estricta de payloads emitidos por formularios frontend vs esquemas `Zod` (`.strict()`) del backend.  
> **Estado:** ✅ FASE F9 COMPLETADA

---

## 1. Mapeo de Contratos de Payload vs Esquemas Zod

Durante la remediación (Bloques 1 y 6B), el backend implementó validación estricta con `.strict()` en 4 módulos clave: Ventas, Compras, Pagos y Recetas. La directiva `.strict()` de Zod rechaza cualquier petición HTTP que contenga campos extra o no declarados.

| Módulo / Endpoint | Hook / Formulario Emisor | Esquema Zod en Backend | Compatibilidad de Payload | Diagnóstico y Riesgo |
| :--- | :--- | :--- | :---: | :--- |
| **`POST /sales`** | `useSaleForm.js` (L198) | `createSaleSchema.strict()` | ⚠️ **RIESGO DE RECHAZO** | `useSaleForm.js` desestructura `...formData` en la raíz. Si `formData` incluye propiedades internas de UI como `isModalOpen`, `isSubmitting` o campos no listados, Zod lanzará `BadRequestException: unrecognized_keys`. En `detalles`, los campos opcionales están cubiertos (`baseGravable`, `montoIva`, `totalLinea`). |
| **`POST /purchases`** | `useFormPhaseData.js` | `createPurchaseSchema.strict()` | ⚠️ **RIESGO DE RECHAZO** | Si las filas de detalle envían propiedades de interfaz (`provSearch`, `insumoSearch`, `isUnconfigured`, `empaqueTipo`), Zod con `.strict()` rechazará la orden. Es imperativo mapear a un DTO limpio antes de invocar `apiClient.post`. |
| **`POST /payments`** | `useReceivablesData.js` | `createPaymentSchema.strict()` | ✅ **CONFORME** | Envía únicamente `idCliente`, `idVenta`, `valorPagado`, `metodoPago`, `referencia`, `observaciones` y `nuevaFechaLimite`. Todos coinciden con el esquema Zod. |
| **`POST /recipes`** | `useRecipeForm.js` | `createRecipeDto` (NestJS Class Validator) | ✅ **CONFORME** | El DTO de recetas valida con decoradores `@IsNumber()`, `@IsString()` y `@ValidateNested()`. El mapper `useRecipeForm.js` filtra los datos antes de enviar. |
| **`POST /goals`** | `GoalsPage.jsx` | `createGoalDto` | ✅ **CONFORME** | Envía payload plano (`nombre`, `categoria`, `montoObjetivo`, etc.). |

---

## 2. Incompatibilidades y Restricciones Específicas Detectadas

### 1. Refinamiento de Descuento Máximo en Ventas (`MAX_DESCUENTO_PORCENTAJE = 0.50`):
- En `apps/api/src/sales/schemas/create-sale.schema.js`:
  ```javascript
  const bruto = data.cantidad * data.precioUnitario;
  return bruto === 0 || data.descuento <= bruto * MAX_DESCUENTO_PORCENTAJE;
  ```
- **Problema:** Si en `useSaleForm.js` el vendedor otorga un descuento mayor al 50% del precio bruto, el backend rechaza la transacción con:  
  `"El descuento no puede exceder el 50% del valor bruto de la línea (HAL-F7-03)"`.
- **Falta en Frontend:** El formulario de ventas no avisa visualmente sobre este límite del 50%, permitiendo digitar descuentos de hasta el 100% que fallan al momento de guardar.

### 2. Contaminación de Keys en `useSaleForm.js`:
- El formulario usa:
  ```javascript
  const response = await apiClient.post('/sales', {
    ...formData,
    fechaVenta: new Date(formData.fechaVenta).toISOString(),
    ...
  });
  ```
- Al hacer `...formData`, cualquier campo agregado por extensiones de estado contamina el payload contra un validador `.strict()`.

---

## 3. Conclusiones y Recomendaciones de la Fase F9

1. **Construir DTOs de salida limpios en Frontend (Whitelisting):** En lugar de hacer spread del estado local (`...formData`), los hooks deben instanciar objetos payload conteniendo explícitamente solo los campos aceptados por el backend.
2. **Guarda visual para el límite de descuento comercial (50%):** Mostrar advertencia o limitar el input en el modal de ventas cuando `descuento > (cantidad * precioUnitario * 0.5)`.
