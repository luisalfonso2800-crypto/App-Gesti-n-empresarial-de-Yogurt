# 14 - COSTS

## Propósito

El módulo **Costs** es responsable de calcular, consultar y analizar los costos asociados a los productos y a los procesos del negocio.

Su función es responder preguntas como:

* ¿Cuánto cuesta producir realmente un producto?
* ¿Cuál es el costo de los insumos utilizados?
* ¿Cuál fue el costo real de una producción?
* ¿Cuál es el costo unitario de un lote?
* ¿Cuál es el costo unitario de cada producto vendido?
* ¿Qué diferencia existe entre el costo esperado y el costo real?
* ¿Qué información de costos debe conservarse para mantener trazabilidad histórica?

El módulo de costos es un módulo de **cálculo y consulta**.

No representa una operación independiente del negocio como una compra, una producción o una venta. Su información se deriva principalmente de otros dominios.

---

# 1. RESPONSABILIDAD DEL MÓDULO

El módulo Costs debe:

1. Calcular el costo de los insumos utilizados en una producción.
2. Calcular costos teóricos a partir de recetas.
3. Consultar costos reales registrados durante la producción.
4. Comparar costos teóricos contra costos reales.
5. Calcular el costo total de una producción.
6. Calcular el costo unitario resultante.
7. Proporcionar el costo correspondiente a los lotes producidos.
8. Proporcionar información de costos a Sales.
9. Proporcionar información de costos a Profitability.
10. Mantener consistencia entre los costos calculados y la información histórica utilizada para calcularlos.

El módulo no debe convertirse en propietario de las compras, recetas, producciones, lotes o ventas.

---

# 2. POSICIÓN DEL MÓDULO EN EL NEGOCIO

El flujo conceptual es:

```text
COMPRAS
    │
    ▼
Costo de adquisición de insumos
    │
    ▼
INVENTARIO
    │
    ▼
RECETAS ────────────────┐
    │                   │
    ▼                   ▼
Costo teórico      PRODUCCIÓN
                       │
                       ▼
                 Costo real
                       │
                       ▼
                    COSTS
                       │
                       ▼
                     LOTS
                       │
                       ▼
                    SALES
                       │
                       ▼
                PROFITABILITY
```

Costs centraliza la lógica necesaria para interpretar la información económica generada por las operaciones.

---

# 3. COSTO TEÓRICO

El costo teórico representa el costo esperado de fabricar un producto según la receta definida.

Conceptualmente:

```text
RECETA
    │
    ├── Insumo A × cantidad requerida
    ├── Insumo B × cantidad requerida
    ├── Insumo C × cantidad requerida
    └── ...
```

Para cada insumo:

```text
Costo del insumo utilizado
=
Cantidad requerida
×
Costo unitario aplicable
```

El costo teórico total de la receta será:

```text
Costo teórico total
=
Σ costo de cada insumo requerido
```

Este valor representa una estimación basada en la receta y en los costos disponibles de los insumos.

No representa necesariamente el costo real de una producción específica.

---

# 4. COSTO REAL DE PRODUCCIÓN

Durante Production pueden existir diferencias entre lo planificado y lo realmente utilizado.

La estructura anterior del sistema ya contemplaba:

```text
Cantidad_Teorica
Cantidad_Real_Utilizada
Diferencia
Costo_Teorico
Costo_Real
```

Por tanto:

```text
RECETA
        ↓
Cantidad teórica
        ↓
Costo teórico

PRODUCCIÓN REAL
        ↓
Cantidad real utilizada
        ↓
Costo real
```

El costo real de una producción debe basarse en los recursos efectivamente utilizados durante esa producción.

Conceptualmente:

```text
Costo real de producción
=
Σ costo real de cada insumo utilizado
```

---

# 5. COMPARACIÓN ENTRE COSTO TEÓRICO Y COSTO REAL

El sistema debe permitir comparar:

```text
Costo teórico
vs
Costo real
```

La diferencia puede expresarse como:

```text
Variación de costo
=
Costo real
-
Costo teórico
```

Esto permite identificar situaciones como:

* mayor consumo de insumos;
* menor consumo de insumos;
* diferencias por merma;
* diferencias entre la receta esperada y la ejecución real;
* variaciones en los costos utilizados.

El módulo Costs debe proporcionar esta información.

No debe modificar directamente la producción para corregir diferencias.

---

# 6. COSTO TOTAL DE PRODUCCIÓN

Cada producción debe poder determinar su costo total.

Conceptualmente:

```text
Costo total de producción
=
Σ costos reales de los insumos utilizados
```

La información utilizada debe provenir de Production y de la información de costos correspondiente a los insumos involucrados.

El costo total pertenece al resultado económico de esa producción específica.

---

# 7. COSTO UNITARIO

Una vez conocido el costo total de producción y la cantidad realmente obtenida, se puede calcular el costo unitario.

```text
Costo unitario
=
Costo total de producción
÷
Cantidad real producida
```

Ejemplo conceptual:

```text
Costo total:
$100.000

Cantidad producida:
200 unidades

Costo unitario:
$500
```

Este costo unitario puede utilizarse posteriormente para valorar:

* productos terminados;
* lotes;
* unidades vendidas;
* utilidad de una venta;
* rentabilidad.

---

# 8. RELACIÓN CON LOTS

Cuando una producción genera un lote, el costo correspondiente debe poder relacionarse con ese resultado.

El objetivo es conservar trazabilidad.

Conceptualmente:

```text
Producción
    │
    ├── Insumos utilizados
    ├── Costo total
    ├── Cantidad producida
    └── Costo unitario
            │
            ▼
          Lote
```

Un lote debe conservar la información necesaria para que posteriormente sea posible determinar el costo de los productos provenientes de esa producción.

Esto es importante porque el costo de un producto puede cambiar con el tiempo.

No debe asumirse que el costo actual de un insumo representa necesariamente el costo histórico de un lote producido anteriormente.

---

# 9. COSTO HISTÓRICO

El sistema debe conservar la información económica necesaria para reconstruir el costo correspondiente a una operación histórica.

Ejemplo:

```text
Enero

Insumo:
Costo unitario = $1.000

        ↓

Se produce LOTE-001
```

Posteriormente:

```text
Febrero

Costo actual del mismo insumo = $1.300
```

El cambio de costo no debe modificar artificialmente el costo histórico asociado a:

```text
LOTE-001
```

Por tanto, los cálculos históricos deben conservar o poder reconstruir el costo utilizado en el momento de la operación.

Esta regla es fundamental para:

* trazabilidad;
* análisis histórico;
* utilidad real;
* rentabilidad;
* comparación entre períodos.

---

# 10. RELACIÓN CON SALES

La estructura histórica de detalle de ventas ya contemplaba:

```text
ID_Detalle_Venta
ID_Venta
ID_Producto
ID_Lote
Cantidad
Precio_Unitario
Descuento
Total_Linea
Costo_Unitario
Utilidad_Unitaria
Utilidad_Total
```

Por tanto, el costo de una venta no debe depender exclusivamente del costo actual del producto.

La venta debe conservar el costo unitario correspondiente a la operación.

Conceptualmente:

```text
Venta
    │
    ├── Precio unitario
    ├── Costo unitario
    │
    └── Utilidad unitaria
```

La fórmula conceptual es:

```text
Utilidad unitaria
=
Precio unitario efectivo
-
Costo unitario
```

Y:

```text
Utilidad total
=
Utilidad unitaria
×
Cantidad vendida
```

Sales es responsable de registrar la venta.

Costs proporciona la lógica o la información necesaria para determinar el costo correspondiente.

---

# 11. RELACIÓN CON RECIPES

Recipes define qué se necesita para producir un producto.

Costs interpreta esa información económicamente.

```text
RECIPES
    │
    ├── Insumo
    ├── Cantidad requerida
    ├── Unidad
    └── Merma
            │
            ▼
          COSTS
            │
            ▼
      Costo teórico
```

Recipes no debe convertirse en el módulo responsable de calcular toda la rentabilidad del producto.

Su responsabilidad principal es definir la composición de la receta.

---

# 12. RELACIÓN CON PURCHASES

Purchases registra las adquisiciones de insumos.

La información de compras constituye una fuente importante para determinar los costos de los insumos.

Conceptualmente:

```text
Compra
    │
    ├── Insumo
    ├── Cantidad
    └── Precio
            │
            ▼
     Información de costo
            │
            ▼
          COSTS
```

Costs puede utilizar la información disponible para realizar sus cálculos.

Purchases no debe asumir la responsabilidad de calcular el costo completo de producción.

---

# 13. RELACIÓN CON INVENTORY

Inventory controla las existencias y sus movimientos.

Costs no debe duplicar esa responsabilidad.

La relación conceptual es:

```text
PURCHASES
    │
    ▼
INVENTORY
    │
    ├── Existencias
    ├── Entradas
    └── Salidas
            │
            ▼
          COSTS
```

Cuando un insumo es utilizado durante Production, Inventory controla el movimiento físico.

Costs interpreta económicamente la información necesaria para determinar el costo de ese consumo.

---

# 14. RELACIÓN CON PRODUCTION

Production es uno de los principales consumidores del módulo Costs.

Production debe poder conocer:

```text
Costo teórico
Costo real
Variación
Costo total
Costo unitario
```

Sin embargo, Production continúa siendo responsable de:

* planificar la producción;
* registrar la producción;
* registrar cantidades utilizadas;
* registrar cantidades obtenidas;
* gestionar su estado operativo.

Costs debe concentrarse en la interpretación económica de esos datos.

---

# 15. RELACIÓN CON EXPENSES

Expenses registra gastos del negocio.

La estructura original contempla:

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

Los gastos pueden ser utilizados posteriormente por análisis financieros.

Sin embargo, no todos los gastos deben incorporarse automáticamente al costo unitario de un producto.

La incorporación de gastos indirectos al costo de producción debe tratarse como una regla explícita cuando se defina el modelo de costeo correspondiente.

Por ahora:

```text
EXPENSES
    │
    ▼
Registro de gastos
```

y:

```text
COSTS
    │
    ▼
Cálculo de costos de producción
```

son responsabilidades separadas.

Cualquier mecanismo de distribución de gastos indirectos deberá definirse explícitamente antes de implementarse.

---

# 16. RELACIÓN CON PROFITABILITY

Costs proporciona una parte fundamental de la información utilizada por Profitability.

```text
COSTS
    │
    ├── Costos de producción
    ├── Costos unitarios
    └── Costos históricos
            │
            ▼
      PROFITABILITY
```

Profitability analiza la relación entre:

```text
Ingresos
-
Costos
-
Gastos
=
Resultados y rentabilidad
```

Costs no debe asumir la responsabilidad de generar todos los indicadores de rentabilidad.

---

# 17. RESPONSABILIDADES DEL MÓDULO

El módulo Costs es responsable de:

```text
✓ Calcular costos teóricos.
✓ Calcular costos reales.
✓ Comparar costo teórico y costo real.
✓ Calcular variaciones de costo.
✓ Calcular costo total de producción.
✓ Calcular costo unitario.
✓ Proporcionar costos a lotes.
✓ Proporcionar costos históricos a ventas.
✓ Proporcionar información a Profitability.
✓ Consultar y analizar información de costos.
```

---

# 18. NO RESPONSABILIDADES

Costs no debe:

```text
✗ Registrar compras.
✗ Crear insumos.
✗ Modificar recetas.
✗ Descontar inventario.
✗ Registrar movimientos físicos de inventario.
✗ Registrar producciones.
✗ Crear lotes.
✗ Registrar ventas.
✗ Registrar pagos.
✗ Registrar gastos.
✗ Modificar precios de venta automáticamente.
✗ Calcular toda la rentabilidad del negocio.
```

Cada una de estas responsabilidades pertenece a su módulo correspondiente.

---

# 19. FUENTES DE INFORMACIÓN

Costs obtiene información principalmente de:

```text
SUPPLIES
    │
    └── Información del insumo

PURCHASES
    │
    └── Información de adquisición

RECIPES
    │
    └── Cantidades requeridas

INVENTORY
    │
    └── Existencias y movimientos

PRODUCTION
    │
    └── Consumo teórico y real

LOTS
    │
    └── Resultado trazable de producción

EXPENSES
    │
    └── Información de gastos cuando corresponda
```

El módulo no debe duplicar innecesariamente la información que pertenece a otros dominios.

---

# 20. MODELO CONCEPTUAL

La estructura conceptual del módulo es:

```text
INSUMO
    │
    ▼
Costo unitario aplicable
    │
    ▼
RECETA
    │
    ▼
Costo teórico
    │
    ▼
PRODUCCIÓN
    │
    ├── Cantidad teórica
    └── Cantidad real utilizada
            │
            ▼
        Costo real
            │
            ▼
      Costo total
            │
            ▼
      Costo unitario
            │
            ▼
           LOTE
            │
            ▼
          VENTA
            │
            ▼
       RENTABILIDAD
```

---

# 21. DATOS HISTÓRICOS DE PRODUCCIÓN

La estructura anterior del sistema ya contemplaba en el detalle de producción:

```text
ID_Detalle_Produccion
ID_Produccion
ID_Insumo
Cantidad_Teorica
Cantidad_Real_Utilizada
Diferencia
Unidad
Costo_Teorico
Costo_Real
Observaciones
```

Esta información constituye una base importante para el análisis de costos.

Especialmente:

```text
Cantidad_Teorica
Cantidad_Real_Utilizada
Costo_Teorico
Costo_Real
```

La migración a PostgreSQL debe conservar la capacidad de representar esta información histórica.

---

# 22. REGLAS PRINCIPALES

## Regla 1 — Un costo debe estar asociado a información verificable

Todo cálculo debe poder relacionarse con la información que lo originó.

Por ejemplo:

```text
Costo de producción
        ↓
Producción específica
        ↓
Detalle de insumos utilizados
```

---

## Regla 2 — El costo histórico no debe cambiar por una actualización posterior

Si cambian:

* precios de insumos;
* precios de proveedores;
* recetas;
* configuraciones futuras;

esto no debe alterar automáticamente el costo histórico de operaciones ya realizadas.

---

## Regla 3 — El costo teórico y el costo real son conceptos diferentes

No deben confundirse.

```text
Costo teórico
=
Lo esperado según la planificación.

Costo real
=
Lo utilizado o registrado durante la operación.
```

---

## Regla 4 — El costo unitario requiere una cantidad válida

No puede calcularse:

```text
Costo unitario
=
Costo total
÷
0
```

Si la cantidad producida es cero, el sistema debe tratar la situación explícitamente y no generar un valor inválido.

---

## Regla 5 — Los costos deben conservar trazabilidad

Debe ser posible determinar:

```text
¿De dónde proviene este costo?
```

La respuesta debe poder relacionarse con:

* compra;
* insumo;
* receta;
* producción;
* lote;
* venta;

según corresponda.

---

# 23. DECISIONES PENDIENTES

Existen decisiones que no deben inventarse durante la implementación.

Deben definirse explícitamente antes de construir la lógica definitiva.

## 23.1 Método de valoración del inventario

Debe definirse cómo se determinará el costo aplicable a las existencias.

Por ejemplo:

```text
Costo promedio
FIFO
Otro método definido
```

El sistema actual de VBA no establece de forma definitiva el método de valoración que debe utilizar PostgreSQL.

Por tanto, esta decisión permanece pendiente.

---

## 23.2 Distribución de gastos indirectos

Debe definirse si gastos como:

```text
Energía
Transporte
Servicios
Mano de obra
Otros gastos indirectos
```

formarán parte del costo de producción y, si es así, bajo qué criterio serán distribuidos.

Esta regla no debe implementarse automáticamente.

---

## 23.3 Componentes del costo

Debe definirse formalmente qué elementos forman parte de:

```text
Costo de producción
```

Inicialmente, la base documentada permite trabajar principalmente con el costo de los insumos utilizados.

La incorporación de otros componentes deberá ser una decisión explícita.

---

# 24. ESTRUCTURA FUTURA DEL DOMINIO

La implementación física no debe crearse todavía por anticipación.

Inicialmente, el módulo puede comenzar con las responsabilidades estrictamente necesarias.

Su evolución deberá seguir las reglas definidas en:

```text
docs/architecture/architecture-evolution.md
```

Cuando aparezcan responsabilidades reales, el módulo podrá evolucionar para incluir componentes específicos de cálculo, consulta o análisis.

No deben crearse:

```text
calculators/
strategies/
mappers/
factories/
services/
repositories/
```

únicamente por anticipación.

Cada extracción debe responder a una necesidad concreta.

---

# 25. DEPENDENCIAS CON OTROS DOMINIOS

```text
Costs
│
├── Supplies
│       └── Identificación y características de insumos
│
├── Purchases
│       └── Información de adquisición
│
├── Recipes
│       └── Cantidades y composición
│
├── Inventory
│       └── Existencias y movimientos
│
├── Production
│       └── Consumo y resultado real
│
├── Lots
│       └── Trazabilidad del resultado producido
│
├── Sales
│       └── Costo histórico de unidades vendidas
│
├── Expenses
│       └── Información de gastos cuando corresponda
│
└── Profitability
        └── Consume información de costos
```

---

# 26. RESULTADO ESPERADO

El módulo Costs debe permitir que el sistema pueda responder, con información trazable:

```text
¿Cuánto costó producir este producto?

¿Cuánto costó producir este lote?

¿Cuál era el costo esperado?

¿Cuál fue el costo real?

¿Cuál fue la diferencia?

¿Cuál fue el costo unitario resultante?

¿Cuál era el costo de las unidades cuando fueron vendidas?
```

Costs constituye el puente entre la operación física del negocio y el análisis económico.

Su responsabilidad es convertir la información generada por compras, recetas, inventario y producción en información de costos consistente, trazable e históricamente preservada.
