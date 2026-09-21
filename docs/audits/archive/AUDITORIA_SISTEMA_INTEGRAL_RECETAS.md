# AUDITORÍA TÉCNICA FULLSTACK INTEGRAL: MÓDULO DE RECETAS TÉCNICAS

> **Documento:** `docs/diagnosticos/AUDITORIA_SISTEMA_INTEGRAL_RECETAS.md`  
> **Fecha:** 13 de Septiembre de 2026  
> **Ámbito:** Backend (`apps/api`), Frontend (`apps/web`), Base de Datos (`schema.prisma`), Flujos Transversales (`Producción`, `Inventario/Kardex`, `Lotes`)  
> **Estado del Módulo:** Nivel de Madurez Medio-Avanzado (Operativo con Brechas Críticas de Poka-Yoke y Resiliencia Financiera)  
> **Modo:** Diagnóstico Técnico Exhaustivo (Read-Only)

---

## 1. RESUMEN EJECUTIVO

El módulo de Recetas Técnicas constituye el corazón operativo de la planta procesadora de derivados lácteos. Su responsabilidad es transformar requerimientos comerciales en instrucciones estandarizadas de manufactura y listas de materiales (BOM).

### Dictamen General
El sistema cuenta hoy con una base arquitectónica notablemente sólida:
* El modelo de persistencia en PostgreSQL (`schema.prisma`) ya contempla la estructura jerárquica de 3 niveles: **Receta $\rightarrow$ Etapas $\rightarrow$ Detalles (BOM)**.
* Admite formulación multinivel: soporte dual para consumir tanto materias primas compradas a proveedores (`Insumo`) como bases semielaboradas elaboradas en planta (`Producto` WIP a granel), enlazadas por relaciones foráneas opcionales indexadas.
* El pipeline transaccional de creación y actualización en `RecipesRepository` ya opera bajo bloques atómicos `prisma.$transaction`.
* La producción ya es capaz de descontar inventario de insumos y de productos intermedios, calculando costos promedio ponderados y asociando genealogía de lotes (`idLotePadre`).

### Brechas y Vulnerabilidades Críticas Encontradas
A pesar de sus fortalezas, existen **puntos ciegos técnicos y de experiencia de usuario (UX)** que impiden catalogarlo como un sistema *a prueba de fallos* (Poka-Yoke):
1. **Ausencia de Snapshots Inmutables de Receta en Producción:** Al crear una orden de producción (`Produccion`), se copian los detalles de insumos (`DetalleProduccion`), pero no se preserva la estructura de etapas, temperaturas, tiempos ni la versión de la receta viva. Si un usuario edita o borra etapas de una receta posteriormente, las órdenes pasadas o en curso pierden su trazabilidad técnica original.
2. **DTOs Permisivos y Validación Débil en Backend:** El DTO `CreateRecipeDetailDto` acepta `cantidadRequerida: 0` (`@Min(0)` en lugar de `@Min(0.0001)`). No valida la coherencia dimensional entre la unidad requerida en la receta y la unidad base del insumo (`Insumo.unidadBase`), permitiendo registrar "Litros" en un insumo cuya unidad base sea "Gramos".
3. **Omisión de Empaques en Productos Comerciales:** No existe una regla de negocio en el backend ni en la UI que obligue a que un producto envasado comercial (ej. Botella 1L, Vaso 200g) contenga al menos un insumo clasificado como `EMPAQUE_BASE`. Una receta comercial puede guardarse sin envase ni tapa, provocando que la producción no descuente botellas ni vasos del inventario.
4. **Desconexión con el Costeo Objetivo del Producto:** En el frontend, el editor de recetas calcula el costo batch y unitario, pero **no lo contrasta en tiempo real contra el `costoMaximoPermitido` ni el `precioVenta` del producto maestro**. El usuario puede formular una receta que cuesta $8.000/unidad para un producto que se vende en $6.000 sin recibir ninguna alerta financiera visible.
5. **Quemado de Unidades y Valores en Frontend:** En `useRecipeForm.js`, la `unidadRendimiento` inicia fija en `"Litros"` y el `rendimientoBase` en `0`. Para productos comerciales envasados, la unidad requerida suele ser `"Unidades"` o `"Botellas"`, obligando al operario a corregir manualmente textos libres.

---

## 2. CAPACIDADES REALES ACTUALES (ESTADO VIVO DEL SISTEMA)

A partir de la inspección directa del código fuente, estas son las funcionalidades efectivamente operativas hoy:

### 2.1. Base de Datos y Persistencia (`schema.prisma`)
* **Modelo Jerárquico Completo:**
  * `Receta`: id, idProducto, nombre, rendimientoBase (`Decimal`), unidadRendimiento (`String`), activo (`Boolean`), observaciones.
  * `EtapaReceta`: id, idReceta, nombre, orden (`Int`), tiempos (mínimo, estándar, máximo en minutos), temperaturas (mínima y máxima en °C), instrucciones, activo.
  * `DetalleReceta`: id, idEtapaReceta, idInsumo (`String?`), idProductoIntermedio (`String?`), cantidadRequerida (`Decimal`), unidad (`String`), mermaPorcentaje (`Decimal`), esOpcional (`Boolean`), grupoVariante (`String?`), tipoInsumo (`String`), activo.
* **Soporte Dual Nativo:**
  * Relación `insumo`: foránea opcional a tabla `Insumos`.
  * Relación `productoIntermedio`: foránea opcional a tabla `Productos` con relación `"ProductoConsumidoReceta"`.
  * Índices creados en `[idEtapaReceta]`, `[idInsumo]`, `[idProductoIntermedio]`.
* **Genealogía de Lotes:** La tabla `Lotes` cuenta con autorreferencia `idLotePadre` (`lotePadre` / `lotesHijos`) para enlazar lotes de producto final con el lote del tanque de yogur base del que provinieron.

### 2.2. Backend (`apps/api/src/recipes/` y `apps/api/src/production/`)
* **Transaccionalidad Atómica:** `RecipesRepository.create` y `RecipesRepository.update` encapsulan todas las operaciones de cabecera, etapas y detalles dentro de un `prisma.$transaction`. Si falla un detalle, la base de datos revierte completamente.
* **Control de Duplicados en Etapa:** En la inserción y actualización de detalles, el backend valida con un `Set` que no se ingrese el mismo insumo o producto intermedio dos veces en la misma etapa (`Ítem duplicado en la misma etapa`).
* **Borrado Lógico Sincronizado:** En `update`, si se eliminan etapas o detalles en la UI, el backend marca `activo: false` en cascada sobre los registros hijos en lugar de borrarlos físicamente, protegiendo llaves foráneas históricas.
* **Explosión de Materiales (BOM) y Escala en Producción:** `ProductionRepository.getRecipeBom` escala las cantidades requeridas según la fórmula:
  $$\text{factorEscala} = \frac{\text{cantidadProduccion}}{\text{rendimientoBase}}$$
  $$\text{reqTeorico} = \text{cantidadRequerida} \times \text{factorEscala} \times \left(1 + \frac{\text{merma}}{100}\right)$$
  Aplicando `Math.ceil` si la unidad es `"Unidades"`.
* **Liquidación de Costos en Producción:** `ProductionRepository.completeProduction` calcula el costo real consumido sumando insumos (desde `costoPromedio` de inventario o último precio de proveedor) y bases semielaboradas (desde `costoUnitario` del lote padre o inventario de producto intermedio), generando el costo unitario de fabricación del lote y actualizando el costo promedio ponderado de inventario.

### 2.3. Frontend (`apps/web/src/app/catalog/recipes/`)
* **Selector Agrupado Poka-Yoke:** `IngredientsFormSection.jsx` utiliza un único `<select>` con dos `<optgroup>`:
  * *Materias Primas y Empaques (Insumos)* (prefijo `INS:`)
  * *Bases y Semielaborados en Planta (WIP)* (prefijo `PROD:`)
* **Protección Anti-Recursión Local:** `availableWipProducts = products.filter(p => p.id !== currentRecipeProductId)`. Impide que el usuario seleccione el mismo producto que está formulando como ingrediente de sí mismo.
* **Cápsula Resumen Poka-Yoke:** Tarjeta visual verde (`styles.summaryCardPokaYoke`) que totaliza:
  * Rendimiento formulado.
  * Conteo de materias primas & empaques.
  * Conteo de bases semielaboradas en planta.
  * Número de etapas activas.
  * Costo unitario proyectado y costo teórico total del batch.
* **Bloqueo Secuencial de Planta:** Si el usuario intenta formular un producto comercial envasado sin que exista al menos un producto a granel registrado en el catálogo, el botón *Guardar Receta* se deshabilita y se muestra un banner azul con enlace directo para registrar el producto a granel primero.

---

## 3. BRECHAS Y VULNERABILIDADES CRÍTICAS

### 3.1. Puntos Ciegos en Base de Datos y Backend

| Componente | Vulnerabilidad / Brecha Técnica | Impacto en Producción / Finanzas |
| :--- | :--- | :--- |
| **DTOs (`create-recipe.dto.js`)** | Permite `cantidadRequerida: 0` (`@Min(0)`). No exige obligatoriedad mutuamente excluyente estricta entre `idInsumo` e `idProductoIntermedio`. | Se pueden crear ingredientes fantasmas sin cantidad ni costo real en la base de datos. |
| **Validación de Unidades** | No existe validación cruzada entre la `unidad` del detalle y la `unidadBase` del insumo en el backend. | Un usuario puede escribir "Kilos" para un insumo registrado en "Litros" sin que el backend lo impida. |
| **Recursión Indirecta** | La protección anti-recursión solo está en el frontend y solo para recursión directa ($A \rightarrow A$). El backend no valida ciclos de grafo ($A \rightarrow B \rightarrow A$). | Un atacante o payload malicioso vía API podría generar un bucle infinito en la explosión de materiales (BOM). |
| **Snapshots en Producción** | `Produccion` guarda `DetalleProduccion` (cantidades e insumos), pero **no almacena una copia inmutable de las etapas, temperaturas ni instrucciones técnicas**. | Si un ingeniero de alimentos modifica la receta después de fabricar un lote, se pierde la receta técnica con la que dicho lote fue realmente producido. |
| **Regla de Empaque Obligatorio** | El backend no exige que un producto con presentación comercial (vaso, botella, garrafa) incluya al menos un insumo con `tipoInsumo === 'EMPAQUE_BASE'`. | Se fabrican productos envasados sin descontar envases ni tapas del kardex, descuadrando el stock físico de empaques. |

### 3.2. Brechas de UX y Poka-Yoke en Frontend

| Vista / Componente | Deficiencia Detectada | Riesgo Operativo para el Usuario |
| :--- | :--- | :--- |
| **`RecipeModal.jsx`** | **Ausencia de Semáforo Financiero contra Ficha Técnica:** No se compara el `costPerUnit` contra el costo máximo admisible de la ficha de producto (`precioVenta * (1 - margenObjetivo / 100)`). | El usuario diseña una receta a ciegas sin saber si supera el costo presupuestado o si genera pérdidas operativas. |
| **`useRecipeForm.js`** | **Valores fijos no reactivos al producto:** `rendimientoBase` inicia en `0` y `unidadRendimiento` en `"Litros"`. Al seleccionar un producto en botella de 1.000 ml o vaso de 200 g, estos campos no se auto-ajustan. | El usuario debe adivinar la unidad y rendimiento coherente con la presentación comercial elegida. |
| **`IngredientsFormSection.jsx`** | **Entrada de texto libre en unidad:** La unidad del ingrediente se fija automáticamente al seleccionar el insumo, pero se almacena como texto plano y no muestra badge de solo-lectura claro. | Si el usuario edita o manipula el estado, puede desalinear la unidad de medida. |
| **`RecipeModal.jsx`** | **Sin plantillas de etapas asistidas:** El usuario debe escribir manualmente desde cero cada etapa ("Pasteurización", "Inoculación", "Enfriamiento", "Envasado"). | Alto tiempo de digitación y riesgo de errores tipográficos en nombres de etapas estándar de planta láctea. |
| **Formateo de Moneda** | En la cápsula resumen de `RecipeModal.jsx`, los costos se muestran con decimales (`$ 12.345,67`), violando la regla de moneda colombiana sin decimales redundantes (`$ 12.346`). | Inconsistencia con el resto de la plataforma y sobrecarga visual. |

### 3.3. Riesgos de Descuadre Transversal (Producción e Inventario)

1. **Desfase en Mermas de Producción:** El porcentaje de merma (`mermaPorcentaje`) se calcula en el BOM teórico de producción, pero si en la planta real la merma es menor o mayor, la diferencia física no alimenta una estadística de ajuste dinámico de receta.
2. **Conversiones Discretas en Empaques:** Si una receta de 100 litros de yogur requiere vasos de 200 ml, se necesitan 500 vasos. Si la orden se programa por 10,5 litros, se requerirían 52,5 vasos. En `ProductionRepository` se aplica `Math.ceil(reqTeorico)` solo si la unidad es `"Unidades"`. Si el empaque fue registrado con unidad `"UND"`, `"PZA"` o `"VASO"`, el sistema no redondea hacia arriba y genera decimales de vasos rotos en el kardex.
3. **Selección Manual del Lote de Tanque Padre:** En `completeProduction`, si el operario no indica explícitamente `idLotePadre`, el sistema toma el primer lote por FIFO (`findFirst`). En plantas lácteas con varios tanques simultáneos en cava, esto puede atribuir el consumo al lote de tanque equivocado.

---

## 4. PLAN DE MEJORA Y BLINDAJE PASO A PASO

Para elevar el módulo a un estándar empresarial e inviolable (Poka-Yoke), se estructura el siguiente plan de implementación en 3 fases:

### FASE 1: Blindaje Duro de Backend, Esquema y DTOs (Integridad Estructural)
1. **Endurecimiento de DTOs:**
   * Actualizar `CreateRecipeDetailDto`: cambiar `@Min(0)` por `@Min(0.0001)` en `cantidadRequerida`.
   * Validación estricta: asegurar que exactamente uno entre `idInsumo` e `idProductoIntermedio` esté presente.
2. **Validación Dimensional en Servicio (`recipes.service.js`):**
   * Validar en backend que la `unidad` del detalle sea idéntica a la `unidadBase` del insumo o producto intermedio relacionado.
3. **Regla de Negocio de Empaque Obligatorio:**
   * Si el producto destino de la receta tiene presentación comercial (no es `A GRANEL` / `TANQUE_GRANEL`), exigir que al menos un detalle de la receta tenga `tipoInsumo === 'EMPAQUE_BASE'`.
4. **Protección Anti-Ciclos en Backend:**
   * Implementar detección de grafos acíclicos dirigidos (DAG) en `recipes.service.js` para impedir que una base intermedia $A$ consuma $B$ y $B$ consuma $A$.

### FASE 2: Reingeniería Poka-Yoke en Frontend (Experiencia de Usuario Inteligente)
1. **Semáforo Financiero en Vivo:**
   * Comparar en tiempo real el costo unitario de la receta contra el `costoMaximoPermitido` del producto (`precioVenta * (1 - margenObjetivo / 100)`).
   * Renderizar badge interactivo:
     * 🟢 **Verde:** Costo dentro del presupuesto (margen garantizado).
     * 🟡 **Amarillo:** Margen en riesgo (< 5% de holgura).
     * 🔴 **Rojo:** Receta con sobrecosto (supera el costo máximo permitido).
2. **Plantillas Asistidas de 1 Clic:**
   * Botón *"Cargar Etapas Estándar de Base en Tanque"* (Pasteurización $\rightarrow$ Enfriamiento a Inoculación $\rightarrow$ Incubación $\rightarrow$ Corte y Homogeneización).
   * Botón *"Cargar Etapas Estándar de Envasado Comercial"* (Atemperado $\rightarrow$ Adición de Dulce/Fruta $\rightarrow$ Envasado y Sellado $\rightarrow$ Reposo en Cava).
3. **Auto-Detección de Rendimiento y Unidades:**
   * Al seleccionar el producto en cabecera:
     * Si es a granel, pre-llenar rendimiento sugerido según capacidad de tanque y unidad `"Litros"`.
     * Si es envase comercial, pre-llenar unidad `"Unidades"` o `"Botellas"` y sugerir rendimiento base entero (ej. 50 unidades).
4. **Formateo de Moneda Local Estricto:**
   * Aplicar redondeo a enteros en pesos colombianos (`Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 })`) en la tarjeta resumen y cotizaciones del formulario.

### FASE 3: Conexión Transversal y Trazabilidad Inmutable
1. **Snapshot de Receta en Orden de Producción:**
   * Al crear una `Produccion`, capturar un snapshot JSON completo de la receta activa (etapas, parámetros técnicos y BOM) en el registro de la orden, garantizando auditoría inmutable e independiente de cambios futuros en la receta maestra.
2. **Selector Mandatorio de Lote Padre en Envasado:**
   * Cuando la orden de producción consuma un producto semielaborado (`idProductoIntermedio`), la interfaz de finalización de producción debe exigir la selección explícita del lote de tanque padre con saldo positivo disponible.
3. **Estandarización de Unidades Discretas de Empaque:**
   * Unificar en backend la lista de unidades discretas (`['UNIDAD', 'UNIDADES', 'UND', 'PZA', 'VASO', 'BOTELLA', 'TAPA']`) para aplicar siempre `Math.ceil` en el cálculo de consumo físico en kardex.

---

## 5. CONCLUSIÓN Y RECOMENDACIÓN TÉCNICA

El módulo de Recetas Técnicas ya posee la arquitectura adecuada para soportar recetas multinivel complejas en planta láctea. No requiere una reescritura, sino una **estrategia de blindaje y orquestación contextual (Poka-Yoke)**.

La ejecución de las fases recomendadas garantizará que ningún operario pueda ingresar datos contradictorios, que los costos de producción no desvíen la rentabilidad planeada del negocio y que la trazabilidad de tanques a botellas sea 100% auditable y fidedigna.
