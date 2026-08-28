# 13-expenses.md

## Módulo: Gastos

### 1. Propósito del módulo

El módulo de Gastos registra los egresos operativos y administrativos del negocio que no corresponden directamente a una compra de insumos para inventario ni a un pago realizado a proveedores dentro del proceso de compras.

Su objetivo es permitir conocer y conservar el historial de los gastos necesarios para operar el negocio y proporcionar información para el análisis posterior de costos, rentabilidad y desempeño financiero.

En el sistema original, la información de gastos estaba representada mediante la tabla `tblGastos`, ubicada en la hoja `19 - GASTOS`. 

---

## 2. Responsabilidad del módulo

El módulo de Gastos es responsable de:

* registrar gastos del negocio;
* asignar una fecha al gasto;
* clasificar el gasto;
* registrar una descripción;
* registrar el valor monetario;
* identificar el tipo de gasto;
* asociar el gasto a un período cuando corresponda;
* conservar observaciones;
* consultar gastos registrados;
* filtrar gastos por fecha;
* filtrar gastos por categoría;
* filtrar gastos por tipo;
* proporcionar información para análisis financieros posteriores;
* conservar el historial de los egresos registrados.

---

## 3. Lo que este módulo no es responsable de hacer

El módulo de Gastos no es responsable de:

* registrar compras de insumos;
* registrar compras de inventario;
* administrar proveedores;
* registrar pagos a proveedores como parte de una compra;
* administrar clientes;
* registrar ventas;
* registrar pagos realizados por clientes;
* modificar inventario;
* producir lotes;
* definir recetas;
* administrar productos;
* calcular por sí solo toda la rentabilidad del negocio.

Estas responsabilidades pertenecen a otros módulos.

La diferencia principal debe mantenerse clara:

```text
COMPRA
    ↓
Adquisición de insumos o recursos
que ingresan al proceso del negocio.

GASTO
    ↓
Egreso asociado a la operación,
administración o funcionamiento del negocio.
```

---

# 4. Ubicación dentro del negocio

El módulo de Gastos forma parte de las operaciones financieras del sistema.

En el menú principal del sistema original, Gastos estaba definido como una operación independiente junto con:

```text
Compras
Producción
Ventas
Pagos
Gastos
```



Su relación general con el negocio es:

```text
OPERACIÓN DEL NEGOCIO
        │
        ├── Compras
        │
        ├── Producción
        │
        ├── Ventas
        │
        ├── Pagos
        │
        └── Gastos
                │
                ▼
        Información financiera
                │
                ▼
        Costos y rentabilidad
```

---

# 5. Entidad principal

La entidad principal del módulo es:

```text
Gasto
```

Cada gasto representa un registro individual dentro del historial financiero.

Ejemplo:

```text
GASTO-001
Fecha: 2026-08-27
Categoría: Servicios
Descripción: Pago de energía eléctrica
Valor: $250.000
Tipo: Fijo
```

Cada gasto tiene identidad propia y debe poder consultarse posteriormente.

---

# 6. Estructura histórica heredada

La tabla original `tblGastos` contiene los siguientes campos:

| Campo           | Propósito                         |
| --------------- | --------------------------------- |
| `ID_Gasto`      | Identificador único del gasto     |
| `Fecha`         | Fecha asociada al gasto           |
| `Categoria`     | Clasificación principal           |
| `Descripcion`   | Descripción del gasto             |
| `Valor`         | Valor monetario                   |
| `Tipo_Gasto`    | Tipo o naturaleza del gasto       |
| `Periodo`       | Período al que pertenece el gasto |
| `Observaciones` | Información adicional             |

Esta estructura proviene directamente de la definición física del sistema anterior. 

La nueva aplicación deberá tomar esta estructura como base conceptual.

La migración a PostgreSQL podrá agregar campos técnicos o mejorar la normalización cuando sea necesario, pero no debe perder la información funcional representada por estos campos sin una decisión explícita.

---

# 7. Identificador del gasto

Cada gasto debe tener un identificador único:

```text
ID_Gasto
```

El identificador debe ser generado por el sistema.

El usuario no debe asignarlo manualmente.

Su función es permitir:

* identificar un gasto específico;
* consultar el historial;
* mantener trazabilidad;
* relacionar el gasto con futuras funcionalidades;
* evitar depender de posiciones físicas o consecutivos visuales.

---

# 8. Fecha del gasto

Cada gasto debe registrar una fecha:

```text
Fecha
```

Esta fecha representa el momento al que se asocia económicamente el gasto.

La fecha permite posteriormente realizar análisis como:

```text
Gastos diarios
Gastos semanales
Gastos mensuales
Gastos por período
Comparación entre períodos
```

La fecha es obligatoria para conservar la secuencia histórica de la información financiera.

---

# 9. Categoría del gasto

Cada gasto debe clasificarse mediante:

```text
Categoria
```

La categoría permite agrupar gastos similares.

Ejemplos conceptuales:

```text
Servicios
Transporte
Arrendamiento
Administración
Mantenimiento
Marketing
Operación
Otros
```

La lista definitiva de categorías no debe quedar dispersa dentro del código.

Cuando se defina formalmente, deberá existir una fuente centralizada para administrarlas.

La categoría permite posteriormente consultar:

```text
¿Cuánto se gastó en transporte?

¿Cuánto se gastó en servicios?

¿Cuánto se gastó en mantenimiento?
```

---

# 10. Descripción del gasto

Cada gasto debe contener:

```text
Descripcion
```

La descripción permite explicar concretamente qué representa el gasto.

Ejemplo:

```text
Categoría:
Servicios

Descripción:
Pago mensual del servicio de energía eléctrica.
```

La categoría clasifica.

La descripción identifica el gasto específico.

---

# 11. Valor del gasto

Cada gasto debe registrar:

```text
Valor
```

El valor representa el monto monetario asociado al egreso.

Debe cumplir:

```text
Valor > 0
```

No se deben registrar gastos con:

```text
Valor = 0
```

ni valores negativos.

---

# 12. Tipo de gasto

El campo:

```text
Tipo_Gasto
```

permite clasificar la naturaleza del gasto.

Inicialmente, el sistema original no define dentro de la estructura consultada una lista cerrada de valores permitidos.

Por lo tanto, este documento conserva el concepto, pero la clasificación definitiva deberá formalizarse antes de implementar validaciones restrictivas.

Conceptualmente, el sistema puede necesitar distinguir situaciones como:

```text
Fijo
Variable
```

Sin embargo, estos valores no deben considerarse todavía una lista definitiva del sistema hasta que se formalicen.

---

# 13. Período

El campo:

```text
Periodo
```

permite asociar un gasto con un período de análisis.

Este concepto es diferente de la fecha.

Por ejemplo:

```text
Fecha:
2026-08-31

Período:
2026-08
```

La fecha representa el momento específico.

El período permite agrupar información para análisis financiero.

El modelo definitivo deberá decidir si el período:

* se almacena explícitamente;
* se calcula automáticamente a partir de la fecha;
* o se utiliza para representar un período contable diferente.

Esta decisión deberá tomarse durante el diseño del modelo de datos.

Hasta entonces, el concepto heredado se conserva como requisito funcional.

---

# 14. Observaciones

El campo:

```text
Observaciones
```

permite conservar información adicional sobre el gasto.

Puede utilizarse para registrar:

```text
Detalles adicionales
Notas administrativas
Información de contexto
Aclaraciones
```

No debe utilizarse como sustituto permanente de información estructurada.

Si un tipo de información comienza a ser necesario para consultas, filtros o reglas del sistema, deberá evaluarse su incorporación como un campo o entidad formal.

---

# 15. Diferencia entre gasto y compra

Esta separación es fundamental para la arquitectura del negocio.

Una compra pertenece al módulo:

```text
purchases
```

y representa la adquisición de recursos o insumos.

Ejemplo:

```text
Compra de:

Leche
Azúcar
Fruta
Envases
Tapas
```

Una compra puede generar:

```text
Entrada de inventario
Actualización de existencias
Relación con proveedor
Costo de adquisición
```

Un gasto pertenece al módulo:

```text
expenses
```

y representa un egreso que no debe tratarse automáticamente como una entrada de inventario.

Ejemplo:

```text
Pago de energía
Transporte
Arrendamiento
Publicidad
Mantenimiento
Servicios administrativos
```

La regla conceptual es:

```text
¿La operación adquiere un recurso
que debe ingresar al inventario?
        │
        ├── Sí
        │
        ▼
     PURCHASES
        │
        ▼
     INVENTORY
        │
        └── No
             │
             ▼
          EXPENSES
```

Esta separación evita que todos los egresos del negocio se registren como compras.

---

# 16. Relación con Costos

Los gastos pueden proporcionar información al módulo:

```text
costs
```

Sin embargo, el módulo de Gastos no debe asumir automáticamente que todo gasto se incorpora directamente al costo unitario de un producto.

Existen diferentes posibilidades:

```text
Gasto
    │
    ├── Puede afectar costos operativos
    │
    ├── Puede afectar análisis de rentabilidad
    │
    └── Puede requerir una regla de distribución
```

Por ejemplo:

```text
Energía eléctrica
```

podría requerir una decisión posterior sobre cómo se distribuye entre:

```text
Producción
Productos
Períodos
```

Esa lógica pertenece al diseño del módulo de Costos y no debe duplicarse dentro de Gastos.

Por tanto:

```text
EXPENSES
    │
    ▼
Registro histórico del gasto
    │
    ▼
COSTS
    │
    ▼
Analiza si el gasto debe incorporarse
a un cálculo específico
```

---

# 17. Relación con Rentabilidad

Los gastos también son relevantes para:

```text
profitability
```

Conceptualmente:

```text
Ingresos
      -
Costos
      -
Gastos
      =
Resultado
```

Sin embargo, la fórmula definitiva de rentabilidad todavía deberá definirse dentro de su propio módulo.

El módulo de Gastos solamente debe ser dueño de la información relacionada con los egresos registrados.

No debe calcular por sí solo:

```text
Utilidad neta
Margen neto
Rentabilidad por producto
Rentabilidad por período
```

---

# 18. Registro histórico

Los gastos deben conservarse como registros históricos.

Ejemplo:

```text
GASTO-001
Fecha: 01/08/2026
Valor: $100.000

GASTO-002
Fecha: 15/08/2026
Valor: $80.000

GASTO-003
Fecha: 28/08/2026
Valor: $120.000
```

No debe mantenerse únicamente un valor acumulado como:

```text
Gastos del mes: $300.000
```

sin conservar el detalle.

El valor acumulado puede calcularse:

```text
SUM(Gastos.Valor)
```

pero debe poder reconstruirse a partir de los registros individuales.

---

# 19. Reglas de negocio identificadas

El módulo debe respetar inicialmente las siguientes reglas:

1. Cada gasto debe tener un identificador único.

2. Cada gasto debe tener una fecha válida.

3. Cada gasto debe tener una categoría.

4. Cada gasto debe contener una descripción suficiente para identificarlo.

5. El valor del gasto debe ser mayor que cero.

6. Cada gasto debe registrar su tipo cuando este campo sea obligatorio según la definición final.

7. El período debe conservarse o derivarse según la decisión final del modelo de datos.

8. Los gastos deben conservarse individualmente como registros históricos.

9. El módulo de Gastos no debe generar entradas de inventario.

10. Un gasto no debe convertirse automáticamente en una compra.

11. El módulo de Gastos no debe calcular directamente la rentabilidad total.

12. Cualquier distribución de un gasto hacia costos o productos debe ser responsabilidad de una lógica específica del módulo de Costos.

13. La eliminación o corrección de un gasto debe preservar la trazabilidad financiera.

---

# 20. Eliminación y corrección de gastos

Los gastos afectan la información histórica y financiera del sistema.

Por esta razón, no debe asumirse que un gasto puede eliminarse físicamente sin consecuencias.

Incorrecto:

```text
Eliminar gasto
        ↓
Desaparece del historial
        ↓
Cambian reportes anteriores
```

La política definitiva deberá definir mecanismos como:

```text
Corrección
Anulación
Reversión
Estado del registro
Auditoría
```

Hasta que esa política exista, no se debe implementar eliminación física indiscriminada de gastos históricos.

---

# 21. Flujo básico de registro

El flujo conceptual inicial es:

```text
1. Iniciar registro de gasto
        ↓
2. Seleccionar o indicar fecha
        ↓
3. Seleccionar categoría
        ↓
4. Registrar descripción
        ↓
5. Indicar valor
        ↓
6. Seleccionar tipo de gasto
        ↓
7. Determinar período
        ↓
8. Agregar observaciones si existen
        ↓
9. Validar información
        ↓
10. Registrar gasto
        ↓
11. Conservar historial
        ↓
12. Disponible para análisis financiero
```

---

# 22. Consultas principales previstas

El módulo debe permitir posteriormente realizar consultas como:

```text
Todos los gastos
```

```text
Gastos por fecha
```

```text
Gastos por período
```

```text
Gastos por categoría
```

```text
Gastos por tipo
```

```text
Total de gastos en un período
```

```text
Historial de un gasto específico
```

---

# 23. Dependencias del módulo

Inicialmente, el módulo de Gastos puede funcionar como un módulo relativamente independiente.

Conceptualmente:

```text
expenses
```

no necesita depender directamente de:

```text
inventory
production
sales
clients
suppliers
```

para registrar un gasto básico.

Sin embargo, proporciona información a módulos posteriores:

```text
expenses
    │
    ├── costs
    │
    ├── profitability
    │
    └── dashboard
```

---

# 24. Módulos relacionados

| Módulo        | Relación                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------- |
| Purchases     | Debe mantenerse separado de los gastos                                                    |
| Costs         | Puede utilizar gastos para cálculos y distribuciones                                      |
| Profitability | Puede utilizar gastos para calcular resultados                                            |
| Dashboard     | Puede mostrar indicadores y tendencias de gastos                                          |
| Production    | Puede verse afectado por distribuciones de costos, pero no administra gastos directamente |
| Sales         | Genera ingresos, mientras Gastos registra egresos                                         |

---

# 25. Límites arquitectónicos

El módulo `expenses` es dueño de:

```text
Registro de gastos
Clasificación de gastos
Valor de gastos
Fecha de gastos
Historial de gastos
```

El módulo `purchases` es dueño de:

```text
Registro de compras
Relación con proveedores
Detalle de compra
Costos de adquisición
```

El módulo `costs` es dueño de:

```text
Cálculos y distribución de costos
```

El módulo `profitability` es dueño de:

```text
Análisis de resultados y rentabilidad
```

La relación conceptual debe mantenerse así:

```text
EXPENSES
    │
    ▼
Registra el hecho económico
    │
    ├──────────────► COSTS
    │                    │
    │                    ▼
    │              Cálculos y distribución
    │
    └──────────────► PROFITABILITY
                         │
                         ▼
                  Análisis del resultado
```

---

# 26. Modelo conceptual inicial

```text
┌──────────────────────────────┐
│            GASTO             │
├──────────────────────────────┤
│ ID_Gasto                     │
│ Fecha                        │
│ Categoria                    │
│ Descripcion                  │
│ Valor                        │
│ Tipo_Gasto                   │
│ Periodo                      │
│ Observaciones                │
└──────────────────────────────┘
```

---

# 27. Evolución prevista

El módulo podrá evolucionar cuando exista una necesidad real para incorporar:

* categorías administrables;
* subcategorías;
* comprobantes;
* archivos adjuntos;
* gastos recurrentes;
* gastos programados;
* centros de costo;
* asignación de gastos a productos;
* asignación de gastos a procesos;
* distribución automática de gastos;
* aprobación de gastos;
* anulación controlada;
* reversión;
* auditoría;
* presupuestos;
* comparación entre presupuesto y gasto real.

Estas capacidades no forman parte obligatoria de la implementación inicial.

Su incorporación deberá seguir las reglas definidas en:

```text
docs/architecture/architecture-evolution.md
```

---

# 28. Relación conceptual con el flujo financiero

El negocio genera movimientos económicos desde diferentes procesos:

```text
COMPRAS
    │
    ▼
Adquisición de recursos


VENTAS
    │
    ▼
Generación de ingresos


PAGOS
    │
    ▼
Registro de dinero recibido


GASTOS
    │
    ▼
Registro de egresos operativos
```

Posteriormente:

```text
COMPRAS ─────┐
             │
GASTOS ──────┼──► COSTOS
             │
VENTAS ──────┤
             │
PAGOS ───────┘
                    │
                    ▼
              RENTABILIDAD
                    │
                    ▼
                DASHBOARD
```

La implementación técnica de estas relaciones deberá respetar los límites de responsabilidad de cada módulo.

---

# 29. Fuente histórica

La estructura original del módulo proviene de la tabla:

```text
tblGastos
```

ubicada dentro de la hoja:

```text
19 - GASTOS
```

La estructura definida en el sistema anterior es:

```text
ID_Gasto
Fecha
Categoria
Descripcion
Valor
Tipo_Gasto
Periodo
Observaciones
```



Además, Gastos estaba identificado como una operación independiente dentro de la navegación principal del sistema. 

Este documento reconstruye el módulo `expenses` para la nueva aplicación, manteniendo la intención funcional del sistema original y definiendo sus responsabilidades, límites y relaciones con el resto del negocio.
