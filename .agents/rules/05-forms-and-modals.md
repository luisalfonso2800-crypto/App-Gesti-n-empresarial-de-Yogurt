# 05. FORMULARIOS, MODALES Y POKA-YOKE (FORMS & MODALS)

> **NOTA:** Este módulo define los estándares de interacción, máscaras visuales, validaciones preventivas en tiempo real, prevención de errores (Poka-Yoke) y arquitectura desacoplada para formularios y ventanas emergentes.

---

## 1. REGLAS ARQUITECTÓNICAS Y DE CICLO DE VIDA

### ARQUITECTURA ATÓMICA DE MODALES Y LÍMITE DE LÍNEAS (SRP)
* **Límite de Líneas:** Todo modal (`*Modal.jsx`) actúa exclusivamente como orquestador declarativo y debe tener **menos de 120 líneas**.
* **Separación de Lógica:** La lógica de estado, llamadas HTTP/API, efectos y validaciones deben encapsularse de forma obligatoria en un custom hook co-locado (ej. `use[Nombre]Form.js`).
* **Subcomponentes Atómicos:** Las secciones o grupos de campos deben fragmentarse en subcomponentes atómicos co-locados en subcarpetas `modal-parts/` o `parts/`, manteniendo cada parte en **menos de 150 líneas**.
* **CSS Modules Puro:** Prohibición absoluta de `style={{ ... }}` o estilos en línea. Todo estilo visual debe residir en su correspondiente hoja de estilos `.module.css`.
* **Reutilización Obligatoria de Componentes UI Base:** Queda estrictamente prohibido reimplementar inputs o máscaras artesanales. Se DEBEN importar y utilizar los componentes centralizados:
  - `@/components/ui/SmartModal`
  - `@/components/ui/inputs/CurrencySmartInput`
  - `@/components/ui/inputs/StrictNumberInput`
  - `@/components/ui/inputs/SmartSelect`
  - `@/components/ui/PokaYokeTooltip`

### PROTECCIÓN CONTRA SALIDA ACCIDENTAL (`isDirty`) Y ANTI-DOBLE ENVÍO (`isSubmitting`)
* **Protección de Salida (`isDirty`):** Si el formulario tiene cambios sin guardar (`isDirty === true`), presionar `Escape` o hacer clic en el backdrop/fondo oscuro no debe cerrar la ventana directamente, sino solicitar confirmación explícita para evitar la pérdida accidental de datos.
* **Anti-Doble Envío (`isSubmitting`):** Durante el proceso de guardado o mutación (`isSubmitting === true`):
  - Inhabilitar todos los botones de acción (`disabled`, `opacity: 0.5`, `cursor: not-allowed`).
  - Mostrar texto de progreso como "Procesando..." acompañado de un spinner indicador para impedir la duplicación de registros por doble clic o latencia de red.

### ERRADICACIÓN TOTAL DE DIÁLOGOS NATIVOS
* **Veto Absoluto:** Prohibido el uso de `window.alert()`, `window.confirm()` o `window.prompt()`.
* **Mecanismos Estilizados:** Toda confirmación destructiva, advertencia o retroalimentación debe ejecutarse mediante componentes de modales estilizados (Design System MANNÁ) o Toasts interactivos integrados en la aplicación.

### BLINDAJE CONTRA INPUTS NO CONTROLADOS EN REACT
* **Evitar Advertencias de React:** Ningún `<input>`, `<textarea>` o `<select>` debe recibir `undefined` en su prop `value`.
* **Fallback Obligatorio:** Utilizar siempre fallback de cadena vacía (`value={formData.campo ?? ''}`) para blindar el componente contra la transición no controlada a controlada (*uncontrolled to controlled input warning*).

---

## 2. VALIDACIONES DE ENTRADA, TIPOS DE DATOS Y POKA-YOKE

### REGLA 13. RELACIONES ENTRE ENTIDADES Y SELECTORES RELACIONALES
* **Prohibición de UUIDs/IDs Crudos:** Prohibido pedir o mostrar identificadores técnicos, UUIDs o IDs crudos en pantalla para el usuario final.
* **Selectores Amigables:** Usar siempre selectores con etiquetas humanas y descriptivas (ej. `Producto - Presentación` en lugar de `idProducto: 8f42...`).
* **Manejo de Estados Vacíos (*Empty States* en Selectores):** Si un selector relacional no tiene opciones disponibles (ej. un cliente sin facturas pendientes o catálogo sin insumos), no debe mostrarse un selector inerte o deshabilitado sin explicación; debe proyectar un mensaje asistido con botón o enlace de acción rápida (ej: *"No hay registros disponibles. [+ Crear nuevo]"* o *"Cliente al día"* y bloquear el botón de cobro).

### REGLA 13.1. UX DE ENTRADAS NUMÉRICAS Y MÁSCARAS
* **Manejo de Cero y Vacío:** Prohibido fijar `value={0}` forzado o usar `value || 0` en el `onChange`. Se debe permitir la cadena vacía `""` mientras el usuario escribe y utilizar `placeholder="0"`.
* **Valores Positivos:** Atributo `min="0"` obligatorio; descartar explícitamente el signo menos (`-`) en el evento `onChange`.
* **Parseo Numérico Diferido:** El parseo a número (`Number()`, `parseFloat()`) se realiza de forma diferida únicamente al calcular totales reactivos o al preparar el payload para su envío.

### REGLA 13.2. MÁSCARAS DE MONEDA (COP / PESOS EN TIEMPO REAL)
* **Formato Visual:** Prefijo visual fijo `$ ` y separadores de miles con punto (ej. `$ 10.000`, `$ 1.000.000`).
* **Sin Decimales:** Cero decimales en pantalla para moneda corriente nacional colombiana (COP).
* **Estado Limpio:** El dato almacenado para enviar a la API debe ser un número primitivo desinfectado (`raw.replace(/\D/g, '')`), evitando almacenar caracteres de máscara en la persistencia.

### REGLA 13.3. REGLA TEXTUAL OBLIGATORIA (NÚMERO A LETRAS)
* **Proyección Reactiva:** Todo input de dinero relevante debe proyectar reactivamente su valor en palabras (ej. `✦ Veinticinco mil pesos`).
* **Consumo Centralizado:** Utilizar la utilidad centralizada `montoATextoPesos` importada desde `@/utils/numberToWords` o `@/lib/formatters`.

### REGLA 13.4. VALIDACIÓN PREVENTIVA POR TIPO DE CAMPO Y EXCEPCIONES
* **Teléfonos:** Solo dígitos numéricos (`0-9`), con formateo en vivo estructurado `XXX XXX XXXX` (ej. `300 123 4567`).
* **Cédulas y NIT:**
  - Cédula: Solo números con formato de puntos de miles (ej. `1.020.345.678`).
  - NIT: Permite números, puntos, guion `-` y dígito de verificación (DV) final estructurado (ej. `900.123.456-7`).
* **Excepciones de Puntuación (Sin Formato de Miles):**
  - **Lotes, SKUs y Códigos de Barras:** Se deben mantener estrictamente como secuencias alfanuméricas continuas sin puntos de miles ni formateadores numéricos para no alterar las consultas de inventario.
* **Nombres y Razón Social:**
  - Nombres de personas: Solo letras, acentos y espacios.
  - Razón social: Alfanumérico permitido (ej. `Lácteos Las 2 Esquinas S.A.S.`).
* **Correos Electrónicos:** `type="email"`, validación de estructura estándar y bloqueo estricto de espacios en blanco.
* **Sanitización Global:** Aplicar `.trim()` a todos los campos textuales antes del despacho del payload.

### REGLA 13.5. SELECTORES EN CASCADA Y DEPENDENCIAS (POKA-YOKE)
* **Reseteo en Cascada:** Reset automático de valores en campos dependientes si el campo maestro cambia (ej. al cambiar de categoría o almacén, limpiar el selector de producto o lote dependiente).
* **Campos Relevantes:** Ocultar o deshabilitar campos irrelevantes o no aplicables según el contexto seleccionado.
* **Validación de Stock en Tiempo Real:** Bloqueo reactivo y advertencia inmediata si la cantidad ingresada excede el stock físico disponible en cava o bodega.

### REGLA 13.6. CAMPOS DERIVADOS Y CÁLCULO INVERSO REACTIVO (POKA-YOKE)
* **Cero Trabajo Manual Redundante:** Si una cifra puede derivarse matemáticamente de otros campos ya ingresados (ej. Costo Unitario = Precio / Contenido, o Margen Estimado = Precio - Costo), queda estrictamente prohibido pedirle al usuario que la digite.
* **Presentación en Solo Lectura:** El campo resultante debe calcularse automáticamente en el estado reactivo y proyectarse en modo solo lectura (`readOnly`), con tipografía técnica o cápsula informativa (`#F7F4EE`, borde `#CAD5B5`), indicando su unidad respectiva.

### REGLA 13.7. SANITIZACIÓN DE PAYLOADS (STRINGS VACÍOS VS NULL)
* **Contratos Limpios para Prisma:** Antes de enviar el formulario a la API, todo campo opcional numérico, de relación foránea o fecha que contenga cadena vacía `""` debe transformarse a `null` (o removerse del payload).
* **Prohibición de Envíos Corruptos:** Ningún string vacío `""` debe despacharse hacia columnas de tipo `Int`, `Float` o claves foráneas relacionales en el backend.

### REGLA 13.8. ENTRADAS DE RANGO CON PREFIJO INTEGRADO (MÍN / MÁX)
* **Optimización de Espacio y Lectura Rápida:** En rangos numéricos bivalentes (ej. mínimo y máximo de tolerancia, rangos térmicos, tolerancias de peso), queda prohibido usar etiquetas individuales flotantes o duplicadas que fracturen la línea visual.
* **Patrón de Prefijo Integrado con Barra Separadora:**
  - El input debe conformarse en un contenedor único (`inputGroupPrefix`) que integra un badge lateral izquierdo (`inputPrefix`) con el texto en mayúscula compacta (`MÍN`, `MÁX`) sobre fondo pergamino institucional (`#F7F4EE`), seguido de una barra divisoria vertical (`border-right: 1px solid #D6D0C4`).
  - El campo de entrada numérico (`inputInner`) va transparente a la derecha, compartiendo el foco exterior del componente en verde MANNÁ (`#182622`).
* **Ergonomía de Tarjeta:** Siempre que coexistan parámetros métricos múltiples en una grilla de 3 columnas (`formRow3`), agrupar cada parámetro en una tarjeta delimitada (`parameterCard`) con etiquetas en una sola línea (`white-space: nowrap`) para asegurar alturas simétricas e intuitivas en planta.


### REGLA 17. FORMULARIOS COMPLEJOS (1:N)
* **Colecciones Dinámicas:** Manejo dinámico de colecciones (agregar, editar y eliminar filas) estructurado y organizado por fases lógicas o pestañas temáticas.

### REGLA 31. TRANSFORMACIÓN A MAYÚSCULAS
* **Persistencia en UPPERCASE:** Los campos textuales de entidades maestras (nombres, descripciones, categorías, códigos) deben persistirse y visualizarse transformados a mayúsculas (`UPPERCASE`), garantizando consistencia visual y de búsqueda.

### REGLA 37. UNIDADES TÉCNICAS Y CATÁLOGOS
* **Unidades de Medida Fijas:** Estandarizadas exclusivamente a: `kg`, `g`, `L`, `ml`, `oz`, `und`.
* **Empaques Homologados:** Catálogo fijo de empaques: `UNIDAD`, `ENVASE`, `BOLSA`, `CAJA`, `BULTO`, `BOTELLA`, `BIDÓN`, `CANASTILLA`, `OTRO`.
* **Visualización de Stock Mínimo:** Textos informativos de stock mínimo autocompuestos en cursiva acompañados de la unidad de medida debidamente pluralizada.

### REGLA 38. DISEÑO VISUAL HOMOLOGADO (DESIGN SYSTEM MANNÁ)
* **SmartModal Prioritario:** Uso prioritario del componente base `SmartModal`.
* **Paleta Corporativa:**
  - Fondo marfil / pergamino (`#FAF8F5`).
  - Botones primarios corporativos en verde selva profundo (`#182622`).
  - Botones de cancelación neutrales y discretos (`#F7F4EE` o gris suave `#E5DFD5`).

### REGLA 38.1. MANEJO DE SCROLL CONFINADO Y BODY LOCK
* **Aislamiento de Scroll:** Todo desplazamiento vertical debe ocurrir estrictamente dentro de la sección `.body` del modal (`overflow-y: auto`, `max-height: calc(90vh - 130px)`).
* **Bloqueo del Fondo:** El modal debe congelar el scroll del documento de fondo mientras permanezca abierto (`overflow: hidden` en el body/layout) para evitar desplazamientos accidentales de la página principal.

### REGLA 39. FLEXIBILIDAD EN PROVEEDORES, MANEJO DE ERRORES Y LENGUAJE DE PLANTA
* **Flexibilidad Operativa:** Campos como `nombreContacto` y `email` son estrictamente opcionales en proveedores, permitiendo registrar proveedores informales o rurales de leche.
* **Persistencia de Datos ante Errores de API:** Si el backend responde con un error (`400`, `409`, `500`), el modal **NUNCA debe cerrarse ni vaciar los campos completados**. Debe mantenerse abierto con los datos intactos.
* **Banners de Error Visibles:** Proyectar un banner de alerta visible en la parte superior o inferior del modal (`#FEF2F2`, borde `#F87171`, texto `#991B1B`) explicando en lenguaje claro la causa raíz devuelta por el servidor (ej. duplicidad de documento o saldo insuficiente).
* **Lenguaje de Planta:** Utilizar terminología operativa y de planta en lugar de abstracciones contables o técnicas complejas.
