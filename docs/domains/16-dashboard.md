# 16 — DASHBOARD

## 1. Propósito del módulo

El módulo **Dashboard** proporciona una visión consolidada del estado del negocio.

Su función es transformar la información generada por los diferentes módulos operativos y de consulta en indicadores, resúmenes, alertas y visualizaciones que permitan conocer rápidamente la situación general de la empresa.

El Dashboard no es una fuente primaria de datos.

Su función es:

```text
DATOS DEL NEGOCIO
        ↓
CONSULTA Y CONSOLIDACIÓN
        ↓
CÁLCULO DE INDICADORES
        ↓
ALERTAS Y RESÚMENES
        ↓
VISUALIZACIÓN DEL ESTADO DEL NEGOCIO
```

El sistema anterior ya definía el Dashboard como una sección independiente orientada a:

* Indicadores clave.
* Gráficos.
* Resumen general.
* Alertas.
* Reportes rápidos.

También se definía como el punto desde el cual el usuario puede consultar el estado real del negocio.

Por tanto, este módulo conserva esa responsabilidad en la nueva aplicación.

---

# 2. Responsabilidad principal

El Dashboard es responsable de:

* Consolidar información proveniente de otros módulos.
* Mostrar indicadores clave del negocio.
* Mostrar resúmenes operativos.
* Mostrar resúmenes financieros.
* Identificar situaciones que requieren atención.
* Generar alertas basadas en el estado actual del sistema.
* Mostrar tendencias mediante gráficos.
* Facilitar acceso rápido a información relevante.
* Permitir consultar el estado general del negocio desde un único punto.

El Dashboard debe responder preguntas como:

```text
¿Cómo está el negocio actualmente?

¿Cuánto se ha vendido?

¿Cuánto se ha producido?

¿Cuánto dinero se ha comprado en insumos?

¿Cuánto dinero se ha gastado?

¿Cuál es el inventario disponible?

¿Qué productos o insumos requieren atención?

¿Existen lotes próximos a vencer?

¿Cuál es el resultado financiero del período?

¿Qué áreas del negocio requieren atención inmediata?
```

---

# 3. Principio fundamental

El Dashboard no administra operaciones del negocio.

No debe crear directamente:

* Compras.
* Producciones.
* Ventas.
* Pagos.
* Gastos.
* Movimientos de inventario.
* Lotes.
* Productos.
* Clientes.
* Insumos.

Su responsabilidad es consultar y consolidar información.

La arquitectura conceptual será:

```text
COMPRAS ──────────────┐
                      │
PRODUCCIÓN ───────────┤
                      │
VENTAS ───────────────┤
                      │
PAGOS ────────────────┤
                      │
GASTOS ───────────────┤
                      ▼
                DASHBOARD
                      ▲
                      │
INVENTARIO ───────────┤
                      │
LOTES ────────────────┤
                      │
COSTOS ───────────────┤
                      │
RENTABILIDAD ─────────┘
```

El Dashboard consulta información.

No modifica la lógica interna de los módulos consultados.

---

# 4. Posición dentro del mapa del negocio

El Dashboard pertenece a la capa de:

```text
CONSULTA Y ANÁLISIS
```

Su relación con el sistema es:

```text
MAESTROS
    │
    ├── Presentaciones
    ├── Insumos
    ├── Proveedores
    ├── Productos
    └── Clientes
          │
          ▼
OPERACIONES
    │
    ├── Compras
    ├── Producción
    ├── Ventas
    ├── Pagos
    └── Gastos
          │
          ▼
CONTROL
    │
    ├── Inventario
    ├── Lotes
    ├── Costos
    └── Rentabilidad
          │
          ▼
      DASHBOARD
```

El Dashboard se encuentra al final del flujo de información.

Su función es representar el resultado consolidado de la actividad del negocio.

---

# 5. Alcance funcional

El Dashboard deberá estar preparado para mostrar información en diferentes áreas.

## 5.1 Resumen general

Debe presentar una visión rápida del estado actual del negocio.

Ejemplos de información:

* Ventas del período.
* Compras del período.
* Producción realizada.
* Gastos registrados.
* Utilidad o resultado calculado.
* Inventario disponible.
* Cuentas pendientes.
* Alertas activas.

El conjunto definitivo de indicadores podrá evolucionar, pero cualquier indicador debe tener una fuente de datos claramente definida.

---

# 6. Indicadores de ventas

El Dashboard podrá consultar información del módulo de Ventas para mostrar indicadores como:

* Total vendido en el período.
* Número de ventas realizadas.
* Cantidad total de productos vendidos.
* Valor promedio por venta.
* Ventas por producto.
* Ventas por cliente.
* Ventas por período.
* Ventas pendientes de pago.
* Ventas pagadas.
* Saldo pendiente por cobrar.

La información debe provenir del módulo correspondiente.

El Dashboard no recalcula ni modifica una venta.

Conceptualmente:

```text
VENTAS
    │
    ├── Total vendido
    ├── Número de ventas
    ├── Cantidad vendida
    ├── Estado de ventas
    └── Saldos pendientes
            │
            ▼
        DASHBOARD
```

---

# 7. Indicadores de compras

El Dashboard podrá mostrar información relacionada con las compras realizadas.

Ejemplos:

* Total comprado en el período.
* Número de compras.
* Compras por proveedor.
* Compras por insumo.
* Evolución de compras por período.

Conceptualmente:

```text
COMPRAS
    │
    ├── Compras realizadas
    ├── Valor comprado
    ├── Proveedores utilizados
    └── Insumos adquiridos
            │
            ▼
        DASHBOARD
```

---

# 8. Indicadores de producción

El Dashboard podrá mostrar información proveniente del módulo de Producción.

Ejemplos:

* Número de producciones realizadas.
* Cantidad producida.
* Producción por producto.
* Producción por período.
* Producción planificada.
* Producción ejecutada.
* Diferencias entre producción planificada y ejecutada cuando esa información exista.

Conceptualmente:

```text
PRODUCCIÓN
      │
      ├── Producciones realizadas
      ├── Cantidades producidas
      ├── Productos producidos
      └── Estado de producción
              │
              ▼
          DASHBOARD
```

---

# 9. Indicadores de inventario

El Dashboard podrá consultar el estado actual del inventario.

Ejemplos:

* Cantidad de insumos disponibles.
* Cantidad de productos terminados disponibles.
* Productos con inventario bajo.
* Insumos con inventario bajo.
* Valor estimado del inventario cuando esta información esté disponible desde el módulo correspondiente.
* Productos sin disponibilidad.
* Insumos sin disponibilidad.

El Dashboard no modifica inventario.

La fuente oficial sigue siendo:

```text
INVENTARIO
```

y sus movimientos asociados.

La relación será:

```text
MOVIMIENTOS
      │
      ▼
INVENTARIO
      │
      ▼
DASHBOARD
```

---

# 10. Indicadores de lotes

El Dashboard podrá mostrar información relacionada con la trazabilidad y disponibilidad de los lotes.

Ejemplos:

* Lotes activos.
* Lotes disponibles.
* Lotes próximos a vencer.
* Lotes vencidos.
* Productos afectados por vencimiento.
* Cantidades disponibles por lote cuando sea relevante.

La fecha de vencimiento debe provenir del módulo de Lotes.

El Dashboard no debe determinar arbitrariamente la fecha de vencimiento.

Conceptualmente:

```text
LOTES
    │
    ├── Fecha de creación
    ├── Fecha de vencimiento
    ├── Estado
    └── Disponibilidad
            │
            ▼
        DASHBOARD
```

---

# 11. Indicadores financieros

El Dashboard podrá consolidar información proveniente de:

* Ventas.
* Pagos.
* Compras.
* Gastos.
* Costos.
* Rentabilidad.

Ejemplos:

* Ingresos del período.
* Pagos recibidos.
* Saldo pendiente por cobrar.
* Valor de compras.
* Gastos registrados.
* Costos asociados.
* Utilidad calculada.
* Rentabilidad del período.

La regla fundamental es:

> El Dashboard presenta indicadores financieros, pero la lógica de cálculo financiera pertenece a los módulos responsables.

Por ejemplo:

```text
RENTABILIDAD
        │
        └── Resultado calculado
                │
                ▼
            DASHBOARD
```

El Dashboard no debe duplicar fórmulas o reglas de Rentabilidad.

---

# 12. Alertas

El Dashboard debe poder mostrar situaciones relevantes que requieren atención.

Las alertas pueden provenir de diferentes módulos.

## 12.1 Alertas de inventario

Ejemplos:

* Inventario bajo.
* Inventario agotado.
* Insumos sin disponibilidad.
* Productos terminados sin disponibilidad.

Fuente:

```text
INVENTARIO
```

---

## 12.2 Alertas de lotes

Ejemplos:

* Lotes próximos a vencer.
* Lotes vencidos.
* Lotes que requieren revisión.

Fuente:

```text
LOTES
```

---

## 12.3 Alertas financieras

Ejemplos:

* Ventas con saldo pendiente.
* Cuentas vencidas cuando exista una fecha límite de pago.
* Situaciones relevantes de rentabilidad.

Fuentes:

```text
VENTAS
PAGOS
RENTABILIDAD
```

---

## 12.4 Regla de las alertas

El Dashboard puede consolidar una alerta, pero debe existir una fuente y una regla definida para determinarla.

Incorrecto:

```text
Dashboard
    ↓
Decide arbitrariamente
que algo es crítico
```

Correcto:

```text
MÓDULO RESPONSABLE
        ↓
DATOS Y REGLA
        ↓
DASHBOARD
        ↓
PRESENTACIÓN DE ALERTA
```

---

# 13. Gráficos y tendencias

El Dashboard podrá utilizar gráficos para representar tendencias del negocio.

Algunos ejemplos posibles:

* Ventas por período.
* Compras por período.
* Gastos por período.
* Producción por período.
* Distribución de ventas por producto.
* Distribución de ventas por cliente.
* Evolución de ingresos.
* Evolución de rentabilidad.
* Estado general del inventario.

Los gráficos no constituyen una fuente independiente de información.

Cada gráfico debe estar asociado a una consulta o indicador definido.

Conceptualmente:

```text
DATOS
  ↓
CONSULTA
  ↓
AGREGACIÓN
  ↓
SERIE DE DATOS
  ↓
GRÁFICO
```

---

# 14. Filtros temporales

El Dashboard deberá poder trabajar con períodos de consulta.

Como mínimo, la arquitectura debe permitir consultar información por:

* Día.
* Semana.
* Mes.
* Año.
* Rango personalizado.

No todos los indicadores tienen que implementarse inmediatamente para todos los períodos.

Pero la arquitectura del módulo debe evitar indicadores rígidos como:

```text
Ventas del mes actual
```

sin posibilidad de cambiar el período.

La consulta debe conceptualmente recibir un contexto temporal:

```text
INDICADOR
        +
PERÍODO
        ↓
RESULTADO
```

Ejemplo:

```text
Ventas
+
01/08/2026 - 31/08/2026
=
Total de ventas del período
```

---

# 15. Estado actual versus información histórica

El Dashboard debe diferenciar entre:

```text
ESTADO ACTUAL
```

e:

```text
INFORMACIÓN DEL PERÍODO
```

Por ejemplo:

### Estado actual

```text
Inventario disponible hoy.
Lotes activos hoy.
Lotes próximos a vencer.
Saldo pendiente actual.
```

### Información histórica

```text
Ventas durante un período.
Compras durante un período.
Producción durante un período.
Gastos durante un período.
Rentabilidad durante un período.
```

No deben mezclarse ambos conceptos sin indicar claramente qué representa cada indicador.

---

# 16. Fuentes de información

El Dashboard depende principalmente de consultas a los siguientes módulos:

```text
VENTAS
PAGOS
COMPRAS
PRODUCCIÓN
INVENTARIO
LOTES
GASTOS
COSTOS
RENTABILIDAD
```

Dependencias secundarias pueden existir indirectamente mediante los datos producidos por:

```text
PRODUCTOS
INSUMOS
PROVEEDORES
CLIENTES
```

La dependencia conceptual será:

```text
Dashboard
    │
    ├── consulta → Ventas
    ├── consulta → Pagos
    ├── consulta → Compras
    ├── consulta → Producción
    ├── consulta → Inventario
    ├── consulta → Lotes
    ├── consulta → Gastos
    ├── consulta → Costos
    └── consulta → Rentabilidad
```

---

# 17. Responsabilidades del Dashboard

El módulo debe ser responsable de:

1. Consultar información consolidada.
2. Aplicar filtros de consulta.
3. Preparar indicadores para visualización.
4. Consolidar resúmenes.
5. Organizar alertas.
6. Preparar datos para gráficos.
7. Mostrar el estado general del negocio.
8. Permitir navegación hacia las áreas relacionadas cuando corresponda.
9. Evitar duplicar la lógica de negocio de otros módulos.

---

# 18. No responsabilidades

El Dashboard no debe:

* Crear presentaciones.
* Crear insumos.
* Crear proveedores.
* Crear productos.
* Crear recetas.
* Registrar compras.
* Registrar movimientos de inventario.
* Modificar inventario directamente.
* Registrar producción.
* Crear lotes.
* Modificar fechas de vencimiento.
* Registrar clientes.
* Registrar ventas.
* Registrar pagos.
* Registrar gastos.
* Calcular reglas de costo que pertenecen al módulo Costos.
* Calcular reglas de rentabilidad que pertenecen al módulo Rentabilidad.
* Convertirse en un módulo paralelo que replique información de otros módulos.
* Mantener una segunda fuente de verdad de los datos operativos.

---

# 19. Fuente de verdad

El Dashboard no posee la fuente de verdad de las operaciones.

Cada módulo conserva la propiedad de su información.

Ejemplo:

```text
VENTAS
    → fuente oficial de ventas

PAGOS
    → fuente oficial de pagos

COMPRAS
    → fuente oficial de compras

INVENTARIO
    → fuente oficial del inventario actual

LOTES
    → fuente oficial de trazabilidad y vencimiento

GASTOS
    → fuente oficial de gastos

COSTOS
    → fuente oficial de información de costos

RENTABILIDAD
    → fuente oficial de los resultados de rentabilidad
```

El Dashboard únicamente consume, organiza y presenta información.

---

# 20. Navegación desde el Dashboard

El Dashboard podrá funcionar como punto de acceso hacia áreas del sistema.

Ejemplos:

```text
ALERTA:
Inventario bajo
        ↓
Abrir Inventario
```

```text
ALERTA:
Lote próximo a vencer
        ↓
Abrir Lotes
```

```text
INDICADOR:
Ventas pendientes de pago
        ↓
Abrir Ventas o Pagos
```

La navegación no significa que el Dashboard asuma la responsabilidad del módulo de destino.

Su función es facilitar el acceso.

---

# 21. Acceso rápido

El sistema anterior ya contemplaba accesos rápidos a:

* Compras.
* Producción.
* Ventas.
* Inventario.

Esta idea se conserva como parte del comportamiento general de la aplicación.

El Dashboard podrá incluir accesos directos a operaciones frecuentes o áreas relevantes.

Los accesos rápidos son navegación.

No contienen lógica de negocio.

---

# 22. Arquitectura conceptual del módulo

La evolución inicial del módulo será simple.

Conceptualmente:

```text
DASHBOARD
│
├── Consultas
│
├── Indicadores
│
├── Alertas
│
├── Resúmenes
│
└── Visualizaciones
```

No significa que todas estas carpetas deban existir inmediatamente.

Se crearán según las reglas definidas en:

```text
docs/architecture/architecture-evolution.md
```

---

# 23. Modelo conceptual de un indicador

Todo indicador del Dashboard debe poder responder:

```text
¿Qué mide?

¿De dónde provienen los datos?

¿Qué período utiliza?

¿Cómo se calcula?

¿Qué significa el resultado?
```

Conceptualmente:

```text
INDICADOR
│
├── Nombre
├── Descripción
├── Fuente de datos
├── Período
├── Regla de cálculo
└── Resultado
```

No se debe agregar un indicador únicamente porque resulte visualmente atractivo.

Debe existir una necesidad de negocio y una definición clara.

---

# 24. Modelo conceptual de una alerta

Toda alerta debe tener:

```text
ALERTA
│
├── Tipo
├── Fuente
├── Condición
├── Nivel
├── Mensaje
└── Referencia al elemento relacionado
```

Ejemplo conceptual:

```text
Tipo:
Inventario bajo

Fuente:
Inventario

Condición:
Cantidad disponible menor al nivel definido

Nivel:
Advertencia

Referencia:
Insumo o producto afectado
```

La implementación concreta se definirá posteriormente.

---

# 25. Relación con Configuración

El módulo de Configuración podrá proporcionar parámetros necesarios para determinados indicadores o alertas.

Ejemplos futuros:

* Número de días considerados para advertir un vencimiento.
* Valores mínimos de inventario.
* Períodos predeterminados.
* Parámetros generales del Dashboard.

La regla será:

```text
CONFIGURACIÓN
        ↓
PARÁMETROS
        ↓
MÓDULO RESPONSABLE
        ↓
DASHBOARD
```

El Dashboard no debe almacenar parámetros de negocio duplicados si estos pertenecen a Configuración.

---

# 26. Evolución prevista

La primera versión del Dashboard no debe intentar mostrar todos los indicadores posibles.

La evolución recomendada será progresiva.

## Etapa inicial

Implementar:

```text
- Resumen general.
- Indicadores básicos.
- Estado de inventario.
- Alertas principales.
- Accesos rápidos.
```

---

## Segunda etapa

Agregar:

```text
- Filtros por período.
- Tendencias.
- Gráficos.
- Indicadores comparativos.
- Resúmenes financieros más detallados.
```

---

## Etapa posterior

Evaluar:

```text
- Comparaciones entre períodos.
- Tendencias históricas.
- Indicadores configurables.
- Reportes rápidos.
- Personalización de indicadores.
```

Estas capacidades no deben implementarse anticipadamente sin una necesidad definida.

---

# 27. Regla de cálculo

El Dashboard no debe convertirse en un lugar donde se dupliquen cálculos.

Incorrecto:

```text
Rentabilidad calcula utilidad
        │
        └── fórmula A

Dashboard calcula utilidad
        │
        └── fórmula B
```

Correcto:

```text
Rentabilidad
        │
        └── resultado oficial
                │
                ▼
            Dashboard
```

La misma regla aplica para:

* Costos.
* Inventario.
* Saldos.
* Ventas.
* Pagos.
* Producción.

---

# 28. Regla de consistencia

Dos pantallas que muestran el mismo concepto deben obtener el mismo resultado.

Ejemplo:

```text
Inventario disponible
```

debe ser consistente entre:

```text
Módulo Inventario
```

y:

```text
Dashboard
```

El Dashboard no debe mantener un cálculo alternativo que produzca resultados diferentes.

---

# 29. Relación con el resto del sistema

El Dashboard representa una vista consolidada del negocio:

```text
                    ┌──────────────┐
                    │ PRESENTACIONES│
                    └──────┬───────┘
                           │
┌───────────┐        ┌─────▼─────┐        ┌───────────┐
│  INSUMOS  ├───────►│ COMPRAS   │◄───────┤PROVEEDORES│
└───────────┘        └─────┬─────┘        └───────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  INVENTARIO  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  PRODUCCIÓN  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    LOTES     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    VENTAS    │
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        ┌─────────┐   ┌─────────┐   ┌───────────┐
        │ PAGOS   │   │ GASTOS  │   │  COSTOS   │
        └────┬────┘   └────┬────┘   └─────┬─────┘
             │             │              │
             └─────────────┼──────────────┘
                           ▼
                    ┌──────────────┐
                    │ RENTABILIDAD │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  DASHBOARD   │
                    └──────────────┘
```

Este diagrama representa una relación conceptual de información.

No implica que todos los módulos dependan directamente unos de otros en código.

---

# 30. Reglas del dominio

1. El Dashboard no es una fuente primaria de datos.
2. El Dashboard no modifica operaciones del negocio.
3. Cada indicador debe tener una fuente definida.
4. Cada indicador debe tener una regla de cálculo identificable.
5. El Dashboard no debe duplicar cálculos oficiales de otros módulos.
6. Las alertas deben basarse en datos y condiciones definidas.
7. El estado actual y la información histórica deben diferenciarse.
8. Los filtros temporales deben aplicarse de forma consistente.
9. Dos módulos que muestren el mismo concepto deben producir información consistente.
10. El Dashboard puede facilitar navegación, pero no asumir responsabilidades de otros módulos.
11. La complejidad del Dashboard debe crecer únicamente cuando existan datos y necesidades reales que justificar.
12. Los gráficos no deben existir sin una consulta o indicador claramente definido.
13. El Dashboard debe representar el estado del negocio, no crear una segunda fuente de verdad.

---

# 31. Dependencias conceptuales

El Dashboard depende conceptualmente de:

```text
Compras
Producción
Ventas
Pagos
Gastos
Inventario
Lotes
Costos
Rentabilidad
Configuración
```

La forma concreta de acceso a estos datos se definirá durante la implementación de la arquitectura.

No debe asumirse todavía que todos los módulos se comunicarán directamente entre sí.

---

# 32. Datos que el Dashboard no posee

El Dashboard no será propietario de:

```text
Clientes
Productos
Insumos
Compras
Detalle de compras
Movimientos de inventario
Producciones
Detalle de producción
Lotes
Ventas
Detalle de ventas
Pagos
Gastos
Costos
Resultados de rentabilidad
```

Puede consultar y representar estos datos.

La propiedad y lógica principal permanecen en los módulos correspondientes.

---

# 33. Estado del documento

```text
MÓDULO:
    Dashboard

ESTADO:
    Definición funcional inicial

RESPONSABILIDAD:
    Consolidar y presentar información relevante del negocio.

FUENTE:
    Reconstrucción del sistema anterior en Excel/VBA y
    definición arquitectónica actual del proyecto.

IMPLEMENTACIÓN:
    Pendiente.

MODELO DE DATOS:
    Pendiente de diseño.

INDICADORES DEFINITIVOS:
    Pendientes de priorización durante el desarrollo.

GRÁFICOS:
    Pendientes de definición según los datos e indicadores
    que realmente se implementen.

ALERTAS:
    Pendientes de definición técnica individual según cada
    módulo responsable.
```

---

# 34. Decisión arquitectónica actual

La decisión oficial para este módulo es:

> **Dashboard será un módulo de consulta, consolidación y visualización. No será propietario de los datos operativos ni duplicará la lógica de cálculo perteneciente a otros módulos.**

Su evolución será:

```text
DATOS IMPLEMENTADOS
        ↓
NECESIDAD DE CONSULTA
        ↓
INDICADOR DEFINIDO
        ↓
FUENTE IDENTIFICADA
        ↓
REGLA DE CÁLCULO CONFIRMADA
        ↓
IMPLEMENTACIÓN
        ↓
VISUALIZACIÓN EN DASHBOARD
```

No se crearán indicadores, gráficos, servicios o estructuras internas únicamente por anticipación.

Cada incorporación deberá responder a información real generada por el sistema y a una necesidad concreta del negocio.
