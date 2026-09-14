# 04. DESIGN SYSTEM MANNÁ Y ERGONOMÍA VISUAL (DESIGN SYSTEM MANNA)

> **NOTA:** Este módulo define la identidad visual oficial MANNÁ, el veto a estilos genéricos (Anti-Blue), la ergonomía de planta, estados vacíos asistidos, jerga industrial y feedback de interacción.

---

### 16. UX Y ESTADOS DE INTERFAZ

* Toda pantalla funcional DEBE contemplar como mínimo:
* Estado de carga.
* Estado vacío.
* Estado con datos.
* Estado de error.
* Confirmación de operaciones destructivas.
* Feedback de guardado exitoso.
* Feedback de validación.
* Prevención de doble envío (`disabled` durante peticiones activas).

* Los formularios deben priorizar selección de entidades existentes sobre entrada manual de IDs.
* Las acciones principales deben ser visualmente claras.
* Los mensajes de error deben ser comprensibles para el usuario y no limitarse al mensaje técnico del backend.
* Las interfaces deben mantener coherencia visual, espacial y de interacción con el resto del sistema.

---

### 16.1. ERRADICACIÓN DE DIÁLOGOS NATIVOS Y FEEDBACK VISUAL OBLIGATORIO

* **PROHIBICIÓN ABSOLUTA:** Queda terminantemente prohibido el uso de diálogos nativos del navegador (`window.alert()`, `window.confirm()`, `window.prompt()`). Ninguna interacción debe utilizar estas ventanas emergentes por ser bloqueantes, obsoletas y degradar la experiencia de usuario.
* **Confirmación Previa:** Toda acción destructiva, irreversible o crítica (ej. eliminar lista, borrar ítem, fusionar órdenes, anular registros) DEBE desplegar un componente Modal estilizado (`<Modal/>`) con botones claros de "Cancelar" y "Confirmar acción".
* **Confirmación Posterior (Feedback Visual):** Toda acción ejecutada por el usuario (exitosa o fallida) DEBE mostrar confirmación visual explícita en pantalla:
* **Éxito:** Toast/Notificación visual estilizada en verde con el detalle de lo ocurrido (ej. `"Insumo transferido exitosamente a ORD-2026-0002"`).
* **Error:** Toast/Notificación estilizada en rojo o badge descriptivo indicando el motivo comprensible para humanos (ej. `"No fue posible fusionar las listas. Intente nuevamente"`).
* **Estado Activo:** Badges, chips o resaltes visuales que confirmen el estado actual del sistema (ej. `Lista Activa: [Nombre]`).

---

### 16.2. INTEGRIDAD FUNCIONAL EXTREMO A EXTREMO PARA ELEMENTOS INTERACTIVOS (BOTONES Y ACCIONES)

* **Prohibición de Botones Huérfanos o Cosméticos:** Queda terminantemente prohibido crear, renderizar o modificar botones, enlaces o disparadores de acción que no tengan una implementación funcional completa y verificada.
* **Prohibición de Stubs y Alertas Temporales:** Ningún botón puede limitarse a emitir `alert()`, `console.log()` o dejar un manejador de eventos vacío (`onClick={() => {}}`). Si el botón está visible en la interfaz, su flujo de interacción debe estar completamente operativo.
* **Circuito Completo Frontend ↔ Backend:**
1. Si el botón ejecuta una acción que muta o consulta datos (guardar, editar, eliminar, mover, fusionar, cambiar estado), **debe existir y estar conectado el endpoint real en `apps/api/**`.
2. Si el backend carece del controlador, ruta o método en Prisma para respaldar la acción del botón, **debes crearlo en el backend antes de dar por completada la tarea**.
3. El frontend debe manejar los tres momentos del ciclo de vida del botón:
* **Estado previo/espera:** Deshabilitado (`disabled`) o con indicador de carga durante la ejecución asíncrona para evitar envíos múltiples.
* **Respuesta exitosa:** Actualización reactiva del estado visual/DOM y notificación toast de confirmación en verde.
* **Manejo de error:** Bloque `try / catch` que capture fallos de red o validaciones de la API, manteniendo la aplicación estable y mostrando el feedback correspondiente en rojo.

* **Regla de Alcance:** Si una tarea no incluye el tiempo o la autorización para implementar la lógica backend y frontend de una acción puntual, **el botón no debe crearse ni agregarse a la UI**.

---

### 35. ERGONOMÍA OPERATIVA Y FLUJO MENTAL (CAUSA -> EFECTO)

- **Orden Cognitivo Natural (Causa antes de Efecto):** El primer campo de cualquier vista o modal debe ser siempre el recurso maestro desencadenante (ej. en Recetas: primero el *Producto a fabricar*, luego el nombre de la fórmula; en Compras: primero el *Proveedor*, luego los insumos). Nunca obligar al usuario a adivinar nombres o detalles antes de elegir el elemento principal.
- **Prohibición de Vacíos Blancos (Empty States Asistidos Obligatorios):** Está terminantemente prohibido dejar secciones secundarias (como tablas de etapas, listas de insumos o desglose de pagos) vacías en un fondo blanco sin guía. Si un arreglo está vacío (`length === 0`), se DEBE mostrar una tarjeta orientadora con borde discontinuo (`2px dashed #D6D3D1`), fondo `#FAFAF9`, ícono temático, mensaje explicativo y botones de plantillas rápidas de 1 clic para arrancar.
- **Campos Derivados con Bloqueo Visual Explícito:** Todo campo cuyo valor provenga o sea forzado por otro (ej. unidad de rendimiento fija según el envase del producto, costos promedio de inventario) NO debe presentarse como input editable libre. Debe renderizarse con fondo tenue `#F7F4EE`, borde `#D6D3D1`, texto `#182622` y cursor bloqueado (`readOnly`/`disabled`), acompañado de un micro-texto en cursiva que explique su origen automático.
- **Inputs Limpios sin Cero Falso:** Ningún input numérico debe iniciar con el valor `0` clavado en su estado; deben iniciar en cadena vacía `''` con un placeholder contextual que indique un ejemplo realista (ej. `placeholder="Ej: 100"`).

---

### 36. IDENTIDAD VISUAL MANNÁ Y VETO A ESTILOS GENÉRICOS (ANTI-BLUE)

- **Prohibición del Azul Genérico:** Queda estrictamente vetado el uso del azul genérico de framework (`#2563EB`, `#3B82F6` o similares) en botones principales, modales o acentos de la plataforma.
- **Paleta Oficial Homologada:**
  * **Acción Primaria / Botón de Guardado:** Verde Bosque Profundo (`#182622`), texto `#FFFFFF`, hover `#2C3E38`, esquinas suaves (`6px` a `8px`) y tipografía en negrita (`font-weight: 700`).
  * **Superficies y Fondos Secundarios:** Lino Cálido / Pergamino (`#F7F4EE` o `#FAF8F5`), con bordes atenuados en `#E8E2D7` o `#D6D3D1`.
  * **Botones Secundarios y Plantillas de 1 Clic:** Fondo blanco o `#F7F4EE`, borde `1px solid #182622` o `#D6D3D1`, texto `#182622`, con feedback táctil al hover.
  * **Acentos e Indicadores:** Ámbar / Oro Viejo (`#C58A3E`) para preavisos y detalles visuales, Verde Esmeralda (`#166534` / fondo `#F0FDF4`) para rentabilidad asegurada y Rojo Óxido / Arcilla suave (`#991B1B` / fondo `#FEF2F2`) para alertas y sobrecostos.
- **Botones Deshabilitados (Disabled State):** Cuando una guarda Poka-Yoke impida guardar (por falta de empaque, stock insuficiente o campos obligatorios vacíos), el botón primario debe pasar a fondo `#A8A29E`, opacidad `0.5` y cursor `not-allowed`.

---

### 37. ESTADOS VACÍOS ASISTIDOS OBLIGATORIOS (EXCEPTO DASHBOARD)

- Queda prohibido mostrar textos fríos como "No hay registros", spinners infinitos o tablas desiertas sin guía cuando una entidad no tenga datos (`length === 0`).
- Todo módulo (a excepción del Dashboard SCADA) DEBE renderizar el componente `AssistedEmptyState` con:
  * Contenedor centrado: `max-width: 620px`, fondo lino `#FAF8F5`, borde discontinuo `1px dashed #D6D3D1`, `border-radius: 12px`, `padding: 3rem 2rem`.
  * Ícono temático de dominio.
  * Título orientado a la acción: "Comienza registrando tu primer [Recurso]".
  * Microcopy pedagógico de planta: qué es y para qué sirve en la operativa diaria.
  * Botón de acción primario con estilo Verde Bosque MANNÁ (`#182622`).
  * Guía espacial con flecha al botón fijo superior: "o pulsa el botón [Nombre Botón] situado arriba a la derecha ↗".

---

### 38. DESGLOSE OBLIGATORIO DE ACRÓNIMOS Y JERGA INDUSTRIAL (LENGUAJE DE PLANTA)

- Toda sigla técnica o acrónimo visible en interfaz debe incluir obligatoriamente su definición en español entre paréntesis para que cualquier operario lo entienda de inmediato:
  * `BOM` -> `BOM (Lista de Materiales y Fórmula)`
  * `WIP` -> `WIP (Semielaborado en Proceso)`
  * `FEFO` -> `FEFO (Primero en Vencer, Primero en Salir)`
  * `FIFO` -> `FIFO (Primero en Entrar, Primero en Salir)`
  * `CIP` -> `CIP (Limpieza y Sanitización en Sitio)`
  * `SKU` -> `SKU (Código Comercial de Producto)`
- Queda vetado el uso de siglas aisladas en encabezados, botones, tarjetas o tablas.
