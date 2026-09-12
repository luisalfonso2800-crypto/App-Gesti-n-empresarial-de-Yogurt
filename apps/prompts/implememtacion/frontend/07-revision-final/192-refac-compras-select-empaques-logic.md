[Objetivo]: Convertir el campo de texto "Empaque" en un menú desplegable (select) con comportamiento dinámico y dependencias en la fila de compra.

[Contexto]: Fila de registro de compra/insumo en el formulario de "Nueva Compra Directa" (campos visibles: Proveedor, Insumo, Empaque, Contenido x Empaque, Marca, Cant. Empaques, Precio Unitario, Cálculos).

[Cambios Requeridos]:
1. Transformar Campo "Empaque" a Select:
   - Reemplazar el input de texto por un `<select>`.
   - Opciones estándar:
     * UNIDAD (valor por defecto)
     * BOLSA / PAQUETE
     * CAJA
     * BULTO / SACO
     * BOTELLA / FRASCO
     * BIDÓN / GARRAFA
     * CANASTILLA
     * OTRO
   - Si se selecciona "OTRO", habilitar o desplegar un input de texto corto adyacente para ingresar el nombre manual (forzar mayúsculas automáticas).

2. Comportamiento y Dependencias en Formulario:
   - Si "Empaque" es "UNIDAD":
     * El campo "Contenido x Empaque" debe autocompletarse en `1` (o deshabilitarse si aplica) para que "Cant. Empaques" sea directamente la cantidad ingresada.
   - Si se selecciona cualquier otro empaque compuesto (ej: CAJA, BULTO, BIDÓN, BOLSA):
     * El campo "Contenido x Empaque" permanece habilitado y editable para que el usuario indique cuántas unidades/ml/g vienen por contenedor.
   - Unidad de Medida:
     * El selector de unidad junto a "Contenido x Empaque" debe sincronizarse por defecto con la unidad base del insumo seleccionado (en el ejemplo: `ml`).

3. Recálculo Automático:
   - Mantener reactivo el cálculo de "Ingreso" y "Subtotal":
     * Total Ingreso = (Cant. Empaques) * (Contenido x Empaque) [en la unidad base del insumo].
     * Subtotal = (Cant. Empaques) * (Precio Unitario).

[Formato de Respuesta Requerido]:
- NO devuelvas el código en el chat.
- Aplica los cambios directamente sobre los archivos correspondientes.
- Al finalizar, entrega únicamente un reporte ultracorto en viñetas (bullets) resumiendo los archivos modificados y las acciones aplicadas.