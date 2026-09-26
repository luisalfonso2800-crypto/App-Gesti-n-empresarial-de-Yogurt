[Objetivo]: Aplicar las reglas globales de validación, formateo de números a texto, bloqueo de caracteres y mayúsculas en la fila de compra e inputs del formulario.

[Contexto]: Fila de adición de compras (campos: Proveedor, Insumo, Empaque, Contenido x Empaque, Marca, Cant. Empaques, Precio Unitario, Subtotal).

[Reglas y Correcciones Requeridas]:
1. Campo "Marca":
   - Permitir caracteres alfanuméricos (letras y números permitidos).
   - Forzar mayúsculas automáticas (UPPERCASE) en la entrada y en el estado (ej: "ksklklk" -> "KSKLKLK").

2. Campos Numéricos y Cantidades ("Cant. Empaques", "Contenido x Empaque"):
   - Prohibir estrictamente el ingreso de letras o caracteres especiales. Solo dígitos numéricos válidos.
   - Formateo de puntuación automático en vivo: insertar separador de miles visual (puntos o espacios según el estándar del sistema) a medida que el usuario escribe, manteniendo el valor numérico puro en el estado.

3. Campos de Dinero ("Precio Unitario ($)"):
   - Prohibir letras. Permitir solo números y separadores monetarios válidos.
   - Conversión de Número a Texto: Implementar la etiqueta/badge flotante o adyacente que convierta el monto en vivo a letras (ej: "$ 3.500" -> "✦ Tres mil quinientos pesos") reutilizando el helper global `montoATextoPesos`.
   - Aplicar el mismo formateo monetario con separador de miles en tiempo real al escribir.

4. Cálculos Reactivos ("Ingreso" y "Subtotal"):
   - Asegurar que el Subtotal y Total se recalculen instantáneamente considerando los valores numéricos limpios.

[Formato de Respuesta Requerido]:
- NO devuelvas el código en el chat.
- Aplica los cambios directamente sobre los archivos correspondientes.
- Al finalizar, entrega únicamente un reporte ultracorto en viñetas (bullets) resumiendo los archivos modificados y las acciones aplicadas.