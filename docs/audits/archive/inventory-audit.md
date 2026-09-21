# Auditoría Técnica del Módulo de Inventario

**Fecha de Auditoría:** Septiembre 2026
**Objetivo:** Diagnóstico de la arquitectura de datos (`schema.prisma`) y definición de hoja de ruta técnica para un módulo de inventario de nivel empresarial ERP.

---

## A. DIAGNÓSTICO DEL ESTADO ACTUAL

### Resumen de Campos y Relaciones en Prisma
Tras la inspección profunda de `schema.prisma`, la estructura actual consta de los siguientes pilares:

1. **Modelo `Inventario`:**
   - **Limitación Estructural:** Tiene una relación `1:1` (`@unique`) exclusiva con `Insumo`. Esto significa que el sistema actual *solo puede llevar inventario de materia prima e insumos*, no de `Producto` terminado.
   - **Campos:** `cantidadActual`, `costoPromedio` (recién agregado) y `fechaActualizacion`. No cuenta con ubicación física en bodega.
2. **Modelo `Insumo`:**
   - Contiene metadatos clave: `categoria`, `unidadBase` y un excelente trigger para reposición: `stockMinimo`. 
   - Carece de factores de conversión internos; estos se delegan inteligentemente a `PrecioProveedor` (`cantidadEquivalenteBase`), lo cual es una buena práctica para compras, pero requerirá atención en despachos.
3. **Modelo `MovimientoInventario`:**
   - **Trazabilidad:** Cuenta con `tipoMovimiento` (actualmente un `String` abierto, sin validación Enum restrictiva), `cantidad`, `motivo` y `operacionOrigen` (referencia documental libre).
   - Recientemente se enriqueció con `stockAnterior`, `stockNuevo` y `costoUnitario`, lo que permite reconstruir el Kárdex financiero y no solo físico.
   - Carece de firma de autoría (quién/qué usuario registró el movimiento).
4. **Trazabilidad de Caducidad y Producción (`Lote` y `Produccion`):**
   - **Potencial latente:** Existe un modelo `Lote` que puede enlazar tanto con `Producto` como con `Insumo`. Registra `fechaVencimiento`, `cantidadInicial` y `cantidadDisponible`.
   - **Desconexión:** Sin embargo, `Inventario` maneja el stock de forma *agregada*. Es decir, el sistema sabe que hay 100L de leche, pero en la tabla `Inventario` no discrimina qué porción vence mañana y qué porción en una semana (esto recae en la tabla `Lote`, pero no está estrictamente enlazada a las salidas de inventario).
   - En `DetalleProduccion` existen `cantidadTeorica` y `cantidadRealUtilizada`, lo que indirectamente ya permite calcular mermas operativas (`diferencia`).

---

## B. CAPACIDADES INMEDIATAS (Factibles sin migraciones)

Con la base de datos actual y los DTOs que maneja el backend, se pueden (y se han empezado a) explotar las siguientes características en el Frontend:

- **Valorización en Tiempo Real (Dinero Inmovilizado):** Cruzando `Inventario.cantidadActual` con `Inventario.costoPromedio` o el fallback directo al último `PrecioProveedor`.
- **Semáforo y Alertas de Reposición:** Dashboard que contrasta en tiempo real la `cantidadActual` vs `Insumo.stockMinimo` para emitir órdenes de compra oportunas.
- **Kárdex Analítico de Trazabilidad:** Historial cronológico preciso que muestra la evolución matemática del stock (`stockAnterior` -> `cantidad` operada -> `stockNuevo`) con su respectivo costo unitario.
- **Reporte de Rendimiento/Mermas de Producción:** Endpoint que lea `DetalleProduccion` y agrupe la `diferencia` entre lo teórico y lo real consumido.

---

## C. FUNCIONALIDADES AVANZADAS SUGERIDAS (Roadmap para ERP Lácteo)

Para escalar este desarrollo hacia una planta de producción industrial de yogurt, sugiero priorizar las siguientes implementaciones:

1. **Gestión FEFO/PEPS Estricta (First Expired, First Out):**
   - **Por qué:** En lácteos y frutas, es crítico que el sistema obligue a descontar stock primero de los lotes más próximos a vencer.
   - **Cómo:** Modificar `MovimientoInventario` para que exija un `idLote`. El inventario debe dejar de ser una sumatoria plana y convertirse en una agregación de `Lote.cantidadDisponible`.
2. **Separación de Bodegas (Materia Prima vs. Producto Terminado):**
   - **Por qué:** Hoy `Inventario` excluye explícitamente los productos terminados (yogurt empacado listo para venta).
   - **Cómo:** Crear un modelo `InventarioProducto` o refactorizar `Inventario` a una estructura polimórfica que acepte `idProducto`, permitiendo que la tabla `Venta` descuente de la "Cava" y la tabla `Produccion` traslade valor de "Bodega de Insumos" a "Cava".
3. **Control de Mermas y Ajustes por Auditoría (Conteo Físico):**
   - **Por qué:** Las diferencias entre el stock teórico (sistema) y el real (bodega) ocurren por derrames, daño de empaques o vencimiento.
   - **Cómo:** Transformar `tipoMovimiento` en un `Enum` (`ENTRADA_COMPRA`, `SALIDA_PRODUCCION`, `AJUSTE_SOBRANTE`, `AJUSTE_FALTANTE`, `MERMA_VENCIMIENTO`). Exigir obligatoriamente justificación en `motivo` para todo ajuste manual.
4. **Alertas de Rotación Lenta o Sobrestock:**
   - Detectar capital inmovilizado en insumos (ej. conservantes o etiquetas) que no se han consumido en los últimos 90 días, advirtiendo sobre el riesgo de obsolescencia.

---

## D. RECOMENDACIONES DE ENDPOINTS / SERVICIOS A DISEÑAR

Para desacoplar esta lógica del cliente y asegurar la integridad de los datos, el módulo de backend (`apps/api/src/inventory`) debería escalar con los siguientes controladores:

| Método | Endpoint Sugerido | Propósito Técnico / Funcional |
| :--- | :--- | :--- |
| `GET` | `/inventory/alerts/expiration` | Retorna los `Lotes` de insumos que vencen en los próximos X días, crítico para evitar pérdidas de leche o fruta. |
| `POST` | `/inventory/adjustments` | Endpoint protegido y transaccional para ingresar conteos físicos ciegos. Calcula la diferencia y emite un `MovimientoInventario` de ajuste automático. |
| `GET` | `/inventory/finished-products` | Expondría el stock de los `Productos` listos para despachar (Ventas), independizando la vista comercial de la vista de manufactura. |
| `GET` | `/inventory/reports/valuation` | Retorna la sumatoria financiera a una fecha de corte, vital para el cruce contable de fin de mes. |
| `GET` | `/inventory/reports/shrinkage` | Consulta agregada sobre las diferencias (`mermas`) en las órdenes de producción finalizadas. |

*Nota: Este reporte se emite con fines de arquitectura y auditoría. No se ha modificado ningún modelo estructural ni se han ejecutado migraciones adicionales como resultado de este diagnóstico.*
