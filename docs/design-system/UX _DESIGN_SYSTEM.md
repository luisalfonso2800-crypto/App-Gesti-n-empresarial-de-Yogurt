# MANUAL DE DISEÑO UI/UX Y DESIGN SYSTEM

## YOGURT ERP

### Centro de Comando SCADA Industrial Vintage

**Versión 1.0 — Documento maestro para implementación en Antigravity**

---

# 0. PROPÓSITO DEL DOCUMENTO

Este documento define exclusivamente la identidad visual, el sistema de diseño UI/UX y las reglas de construcción visual de **Yogurt ERP**.

Su objetivo es que cualquier diseñador o agente de IA pueda construir nuevas pantallas del sistema sin romper la identidad visual existente.

La interfaz debe representar una combinación deliberada entre:

**Tradición artesanal + precisión industrial + tecnología moderna.**

El concepto rector es:

> **Centro de Comando SCADA Industrial Vintage**

No se busca construir una aplicación que parezca una fábrica antigua ni una aplicación tecnológica genérica.

La intención es crear una interfaz empresarial moderna que parezca el sistema de control de una planta artesanal de alimentos: precisa, ordenada, técnica y funcional, pero con materiales visuales inspirados en etiquetas antiguas, papel, metal, grabados botánicos y documentación industrial.

---

# 1. CONCEPTO VISUAL

## 1.1. Concepto rector

**Heritage Futurism aplicado a un ERP industrial.**

La interfaz combina dos épocas:

### HERENCIA

Representa:

* elaboración artesanal
* leche
* frutas reales
* recetas
* tradición
* tiempo
* producción manual
* calidad
* trazabilidad
* papel
* etiquetas antiguas
* grabados botánicos
* metal
* documentación industrial

### FUTURO

Representa:

* datos
* trazabilidad digital
* automatización
* indicadores
* control de procesos
* inventario
* producción en tiempo real
* estados
* métricas
* precisión
* operaciones digitales

La regla fundamental es:

> **Lo artesanal construye la identidad. Lo tecnológico organiza la operación.**

---

# 2. PERSONALIDAD VISUAL

La interfaz debe transmitir:

* precisión
* confianza
* orden
* estabilidad
* tradición
* calidad
* profesionalismo
* trazabilidad
* control
* naturalidad

Debe sentirse como una herramienta utilizada diariamente por una empresa real.

No debe parecer:

* una landing page
* una aplicación infantil
* una aplicación de restaurante
* una aplicación de e-commerce genérica
* una aplicación fintech
* una aplicación futurista de ciencia ficción
* una interfaz industrial oscura tipo película
* un dashboard lleno de gráficos sin propósito

---

# 3. PRINCIPIOS FUNDAMENTALES

## 3.1. Principio de precisión

Cada elemento debe tener una función.

No agregar decoración solamente porque "se ve bonita".

---

## 3.2. Principio de jerarquía

La información importante debe destacar visualmente.

La interfaz debe permitir identificar rápidamente:

1. qué está pasando
2. qué necesita atención
3. qué está funcionando
4. qué requiere una acción
5. qué información es secundaria

---

## 3.3. Principio de aire

Nunca llenar completamente una pantalla.

El espacio vacío forma parte de la identidad.

Los componentes deben respirar.

---

## 3.4. Principio de contraste histórico

El sistema debe utilizar:

**Vintage para identidad.**

**Teal para operación.**

**Inter para datos.**

**Playfair para narrativa y jerarquía.**

---

## 3.5. Principio de sobriedad

No abusar de:

* sombras
* bordes
* colores
* iconos
* texturas
* ilustraciones
* animaciones

La interfaz debe sentirse sofisticada, no decorada.

---

# 4. PALETA DE COLOR

## 4.1. Color principal de fondo

### Pergamino Natural

`#F4EFE6`

Uso:

* fondo general
* páginas
* áreas principales
* superficies de baja jerarquía

Es el color que establece la identidad vintage.

---

## 4.2. Superficie elevada

### Blanco

`#FFFFFF`

Uso:

* cards
* modales
* formularios
* tablas
* paneles
* dropdowns
* elementos elevados

Nunca utilizar blanco puro como fondo global.

---

## 4.3. Teal Tecnológico

`#1C454C`

Es el color operacional principal.

Uso:

* navegación activa
* botones primarios
* indicadores importantes
* métricas
* gráficos
* estados operativos
* títulos técnicos
* elementos de control
* encabezados de módulos importantes

Este color representa el futuro.

---

## 4.4. Oro Viejo

### `#D9A05B`

Uso:

* detalles vintage
* líneas decorativas
* bordes destacados
* iconos especiales
* títulos destacados
* indicadores históricos
* elementos de identidad

No utilizar para textos pequeños.

---

## 4.5. Granate Terroso

### `#8C2E25`

Uso:

* alertas importantes
* productos especiales
* frutos rojos
* ediciones limitadas
* indicadores de atención

No debe convertirse en el color principal de la interfaz.

---

## 4.6. Plata Lunar

### `#E2E4E1`

Uso:

* divisores
* bordes
* superficies deshabilitadas
* elementos metálicos
* líneas de tablas

---

## 4.7. Carbón Profundo

### `#1A1A1A`

Uso:

* títulos
* textos principales
* información crítica
* números importantes

---

## 4.8. Texto secundario

### `#5A5A5A`

Uso:

* descripciones
* fechas
* información secundaria
* ayuda
* metadata

---

## 4.9. Estados

### Success

`#4A7C59`

### Error

`#C4282B`

Los estados deben utilizar también iconografía y texto.

Nunca depender exclusivamente del color.

---

# 5. VARIABLES CSS

El sistema debe implementarse utilizando variables CSS.

```css
:root {
  --color-bg-primary: #F4EFE6;
  --color-bg-elevated: #FFFFFF;

  --color-brand-vintage: #D9A05B;
  --color-brand-future: #1C454C;
  --color-brand-passion: #8C2E25;

  --color-metal: #E2E4E1;

  --color-text-primary: #1A1A1A;
  --color-text-secondary: #5A5A5A;
  --color-text-inverse: #FFFFFF;

  --color-success: #4A7C59;
  --color-error: #C4282B;

  --font-family-title: "Playfair Display", serif;
  --font-family-body: "Inter", sans-serif;

  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 28px;
  --font-size-2xl: 36px;
  --font-size-4xl: 52px;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  --line-height-tight: 1.2;
  --line-height-normal: 1.6;

  --space-2: 4px;
  --space-4: 8px;
  --space-6: 12px;
  --space-8: 16px;
  --space-12: 24px;
  --space-16: 32px;
  --space-24: 48px;
  --space-32: 64px;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  --shadow-soft:
    0 8px 24px rgba(26, 26, 26, 0.08);

  --shadow-hover:
    0 12px 32px rgba(26, 26, 26, 0.15);

  --border-thin:
    1px solid var(--color-metal);

  --border-vintage:
    2px solid var(--color-brand-vintage);
}
```

Estas variables constituyen la fuente de verdad visual.

No utilizar valores arbitrarios cuando exista un token equivalente.

---

# 6. TIPOGRAFÍA

## 6.1. Playfair Display

Representa:

* tradición
* historia
* producto
* narrativa
* identidad

Uso:

* H1
* H2
* H3
* nombres de productos
* títulos de dashboard
* nombres de procesos
* frases institucionales
* elementos editoriales

---

# 7. INTER

Representa:

* precisión
* tecnología
* datos
* operación

Uso:

* navegación
* botones
* tablas
* formularios
* indicadores
* números
* estados
* filtros
* acciones
* mensajes
* información técnica

Regla:

> **Playfair cuenta la historia. Inter controla la operación.**

---

# 8. ESCALA TIPOGRÁFICA

| Token | Tamaño | Uso                        |
| ----- | -----: | -------------------------- |
| XS    |   12px | badges, metadata           |
| SM    |   14px | ayudas, navegación         |
| BASE  |   16px | texto                      |
| LG    |   20px | subtítulos                 |
| XL    |   28px | títulos de sección         |
| 2XL   |   36px | títulos principales        |
| 4XL   |   52px | Hero / dashboard principal |

Los títulos grandes pueden utilizar Playfair.

Los datos siempre deben priorizar Inter.

---

# 9. RETÍCULA

Desktop:

**12 columnas**

Tablet:

**8 columnas**

Mobile:

**4 columnas**

Container máximo:

**1280px**

Gutter:

**32px**

Márgenes:

**64px** en escritorio cuando el espacio lo permita.

---

# 10. ESTRUCTURA GLOBAL DE LA APLICACIÓN

La aplicación debe utilizar una estructura de ERP empresarial:

```text
┌────────────────────────────────────────────────────────────┐
│ TOPBAR                                                     │
├───────────────┬────────────────────────────────────────────┤
│               │                                            │
│ SIDEBAR       │              MAIN CONTENT                  │
│               │                                            │
│               │                                            │
│               │                                            │
│               │                                            │
└───────────────┴────────────────────────────────────────────┘
```

---

# 11. SIDEBAR

El Sidebar representa el área operacional.

Debe utilizar principalmente:

`#1C454C`

Puede utilizarse un tratamiento profundo del Teal para generar contraste con el Pergamino.

Elementos:

* logo
* navegación
* grupos de módulos
* estados activos
* iconos
* separadores

---

# 12. LOGOTIPO EN SIDEBAR

El logo debe utilizar:

* Playfair Display
* Oro Viejo
* Pergamino
* detalles botánicos discretos

Debe sentirse como una marca de producto artesanal, pero instalada dentro de un sistema empresarial.

No convertir el logo en una ilustración compleja.

---

# 13. NAVEGACIÓN

Los grupos principales pueden organizarse como:

GENERAL

CATÁLOGOS

OPERACIONES

INVENTARIO

CALIDAD

COMERCIAL

REPORTES

CONFIGURACIÓN

Cada grupo debe utilizar:

* título pequeño
* Inter
* mayúsculas discretas
* tracking ligeramente aumentado

---

# 14. ESTADO ACTIVO DE NAVEGACIÓN

El elemento activo debe utilizar:

* fondo Teal o una variante clara del Teal
* texto contrastante
* indicador lateral Oro Viejo
* icono visible

No utilizar azul genérico.

---

# 15. TOPBAR

El Topbar debe ser limpio.

Puede contener:

* buscador
* notificaciones
* fecha
* usuario
* estado del sistema

Fondo:

`#FFFFFF`

Borde inferior:

`#E2E4E1`

---

# 16. SEARCH

El buscador debe representar la función de centro de comando.

Placeholder:

> Buscar equipos, lotes, órdenes...

Debe permitir buscar conceptos relevantes del ERP.

Visualmente:

* fondo blanco
* borde Plata
* icono lineal
* radius 8px

Focus:

Teal.

---

# 17. HEADER DE PÁGINA

Cada página debe comenzar con:

Eyebrow opcional

Título

Descripción

Acción principal

Ejemplo:

```text
CATÁLOGOS

Proveedores

Directorio de fabricantes y distribuidores
autorizados de insumos y servicios.

                           + NUEVO PROVEEDOR
```

El título puede utilizar Playfair.

La descripción utiliza Inter.

---

# 18. DASHBOARD

El Dashboard es el componente más importante de la experiencia.

Debe funcionar como:

# CENTRO DE COMANDO DE PLANTA

No como dashboard financiero genérico.

Debe permitir entender rápidamente:

* producción
* inventario
* calidad
* lotes
* procesos
* alertas
* órdenes
* compras

---

# 19. ESTRUCTURA DEL DASHBOARD

La pantalla puede organizarse así:

```text
HEADER
│
├── Métricas principales
│
├── Centro de control de producción
│
├── Estado de tanques
│
├── Gráfico de parámetros
│
├── Inventario crítico
│
├── Calidad
│
└── Eventos recientes
```

---

# 20. MÉTRICAS PRINCIPALES

Las métricas deben ser compactas.

Ejemplos:

**Producción hoy**

1.248 unidades

**Lotes activos**

12

**Órdenes en proceso**

5

**Alertas**

1

Cada métrica debe incluir:

* título
* valor
* unidad
* tendencia
* indicador de estado

---

# 21. CARDS

Las cards utilizan:

* fondo blanco
* radius 8px
* borde Plata
* sombra suave
* padding 24px

No utilizar cards excesivamente redondeadas.

La forma debe recordar documentación industrial moderna.

---

# 22. SCADA VISUAL

El elemento diferenciador del Dashboard es el sistema de proceso.

Debe mostrar visualmente:

```text
RECEPCIÓN
   ↓
PASTEURIZACIÓN
   ↓
FERMENTACIÓN
   ↓
MEZCLA
   ↓
ENVASADO
   ↓
PRODUCTO FINAL
```

Cada etapa puede representarse mediante:

* icono técnico
* equipo
* estado
* temperatura
* capacidad
* lote
* indicador de actividad

---

# 23. ESTADOS SCADA

### Operativo

Teal + indicador verde.

### Advertencia

Oro.

### Atención

Granate.

### Fuera de servicio

Gris.

### Desconectado

Gris oscuro.

### Mantenimiento

Oro + icono técnico.

---

# 24. TANQUES

Los tanques deben mostrarse mediante indicadores circulares o verticales.

Ejemplo:

```text
T-03

FERMENTACIÓN

       70%

    42.0 °C

10.000 L
```

La información crítica debe estar inmediatamente visible.

---

# 25. GRÁFICOS

Los gráficos deben ser:

* simples
* técnicos
* limpios
* legibles

Color principal:

Teal.

Color secundario:

Oro.

Color de alerta:

Granate.

No utilizar paletas multicolor innecesarias.

---

# 26. TABLAS

Las tablas deben sentirse como registros industriales.

Header:

* fondo ligeramente gris/pergamino
* Inter Medium
* texto Carbón

Filas:

* fondo blanco
* divisores Plata
* hover suave

No utilizar bordes excesivos.

---

# 27. ESTADOS DE TABLAS

Debe contemplarse:

### Loading

Skeleton.

### Empty

Mensaje contextual.

### Error

Mensaje + acción.

### Populated

Datos.

### Filtered empty

"Sin resultados para los filtros seleccionados."

### Pagination

Control discreto.

---

# 28. BOTONES

## Primario

Teal:

`#1C454C`

Texto:

Blanco.

Ejemplos:

* Guardar
* Crear
* Confirmar
* Procesar
* Añadir
* Continuar

---

## Secundario

Fondo transparente.

Borde Oro Viejo.

Texto Oro Viejo.

Ejemplos:

* Cancelar
* Ver detalle
* Volver

---

## Terciario

Sin fondo.

Texto secundario.

Ejemplos:

* Ver todos
* Más información
* Detalles

---

## Peligro

Granate / rojo de error.

Ejemplos:

* Eliminar
* Desactivar
* Cancelar operación crítica

Debe utilizarse con moderación.

---

# 29. ESTADOS DE BOTONES

Todos los botones deben contemplar:

* default
* hover
* focus
* active
* disabled
* loading

Ejemplo:

```text
DEFAULT
GUARDAR

HOVER
GUARDAR

ACTIVE
GUARDAR

LOADING
GUARDANDO...

DISABLED
GUARDAR
```

El botón loading no debe permitir doble ejecución.

---

# 30. INPUTS

Los inputs:

* fondo blanco
* borde Plata
* radius 8px
* Inter
* altura consistente

Focus:

Teal.

Error:

Rojo.

Disabled:

fondo Plata clara.

---

# 31. SELECT

El selector debe mantener exactamente la misma lógica visual de los inputs.

Debe diferenciar:

* valor seleccionado
* placeholder
* disabled
* error
* focus

Los dropdowns no deben introducir colores externos al sistema.

---

# 32. CHECKBOX

Estado normal:

borde Plata.

Checked:

Teal.

Focus:

outline Teal.

Disabled:

gris.

---

# 33. BADGES

## Vintage

Borde Oro.

Texto Oro.

Uso:

`Edición 01`

---

## Future

Fondo Teal.

Texto blanco.

Uso:

`NUEVO`

---

## Natural

Verde.

Uso:

`SIN COLORANTES`

---

## Warning

Oro.

Uso:

`STOCK BAJO`

---

## Error

Granate.

Uso:

`ALERTA`

---

# 34. MODALES

El modal debe sentirse como una pieza elevada del sistema.

Características:

* fondo blanco
* radius 16px
* shadow-soft
* ancho controlado
* overlay oscuro/transparente
* título Playfair
* contenido Inter

Estructura:

```text
┌──────────────────────────────────────┐
│ Título                          X     │
│ Descripción                           │
├──────────────────────────────────────┤
│                                      │
│ FORMULARIO                            │
│                                      │
├──────────────────────────────────────┤
│             CANCELAR   GUARDAR       │
└──────────────────────────────────────┘
```

---

# 35. ALERTAS

Las alertas deben utilizar:

* icono
* título
* descripción
* acción cuando sea necesario

Ejemplo:

**Stock bajo**

La leche entera se encuentra por debajo del stock mínimo configurado.

---

# 36. TOASTS

Los Toast deben aparecer en esquina inferior derecha.

Success:

Teal / verde.

Error:

Granate.

Warning:

Oro.

Debe incluir:

* icono
* mensaje
* posibilidad de cerrar

Duración estándar:

4 segundos.

---

# 37. LOADING

No utilizar loaders genéricos excesivamente llamativos.

El sistema debe utilizar un spinner lineal inspirado en instrumentos técnicos.

Color:

Teal.

Mensaje contextual opcional:

> Cargando datos...

o

> Procesando lote...

o

> Sincronizando inventario...

---

# 38. SKELETON

El Skeleton debe utilizar:

`#E2E4E1`

No utilizar animaciones agresivas.

La animación debe ser suave.

---

# 39. EMPTY STATES

Nunca mostrar solamente:

> No hay datos.

Debe explicar:

1. qué está vacío
2. por qué
3. qué puede hacer el usuario

Ejemplo:

**No hay proveedores registrados**

Registra el primer proveedor para comenzar a gestionar tus compras.

`+ NUEVO PROVEEDOR`

---

# 40. ICONOGRAFÍA

La iconografía debe ser:

* lineal
* técnica
* sencilla
* consistente
* de grosor uniforme

Evitar:

* emojis
* iconos 3D
* iconos excesivamente ornamentados
* estilos mezclados

---

# 41. ILUSTRACIONES

Las ilustraciones deben utilizarse principalmente en:

* Dashboard
* estados vacíos especiales
* productos
* procesos
* identidad de marca

Estilo:

**grabado botánico / ilustración industrial vintage.**

Ejemplos:

* hojas
* frutas
* botellas
* tanques
* utensilios
* instrumentos de planta

Nunca deben competir con la información operacional.

---

# 42. TEXTURAS

La textura vintage debe ser muy sutil.

Puede utilizarse:

* grano de papel
* papel pergamino
* pequeñas imperfecciones
* textura de impresión

Pero nunca debe afectar:

* legibilidad
* contraste
* tablas
* formularios
* gráficos

La textura es ambiental, no estructural.

---

# 43. FOTOGRAFÍA

Las fotografías deben utilizar:

* luz natural
* tonos cálidos
* composición limpia
* grano sutil
* fondos naturales
* frutas reales
* producto real

Evitar fotografías excesivamente comerciales.

---

# 44. PRODUCTOS

Las tarjetas de producto deben seguir:

```text
IMAGEN
──────────────
BADGE

YOGURT FRUTOS ROJOS

Fresa · Mora · Cereza

Leche Entera
Fruta Real

$ XX.XXX

[AÑADIR]
```

La información operacional siempre debe tener prioridad.

---

# 45. SISTEMA DE EDICIONES

Los productos pueden utilizar:

```text
EDICIÓN 01
FRUTOS ROJOS
```

```text
EDICIÓN 02
FRUTOS AMARILLOS
```

La edición debe funcionar como elemento de identidad.

---

# 46. SELLO DE HERENCIA

El sistema puede utilizar el sello:

```text
TIEMPO
RESPETO
DEDICACIÓN
```

Debe utilizar:

* forma circular o escudo
* doble borde
* Oro Viejo
* estética de sello antiguo

Su función es principalmente identitaria.

---

# 47. SISTEMA DE CÁPSULAS

Las cápsulas representan ediciones o categorías.

Formato:

```text
┌───────────────────────┐
│ 01                    │
│ Frutos Rojos          │
└───────────────────────┘
```

Número:

Inter Bold.

Nombre:

Playfair Italic.

---

# 48. MICROINTERACCIONES

Las animaciones deben sentirse:

**suaves como el yogurt, precisas como una máquina.**

Duración estándar:

`0.3s`

Curva:

```css
cubic-bezier(0.25, 0.46, 0.45, 0.94)
```

---

# 49. ENTRADA DE COMPONENTES

Los componentes pueden aparecer mediante:

* fade
* desplazamiento vertical de aproximadamente 8px

Duración:

0.4s.

Nunca utilizar animaciones exageradas.

---

# 50. HOVER

El hover debe ser discreto.

Cards:

aumentar ligeramente la elevación.

Botones:

cambiar tono.

Filas:

cambio sutil de superficie.

Links:

cambio de color.

---

# 51. FOCUS

Todos los elementos interactivos deben tener focus visible.

```css
outline: 2px solid var(--color-brand-future);
outline-offset: 2px;
```

---

# 52. ACCESIBILIDAD

La interfaz debe mantener:

* contraste adecuado
* navegación por teclado
* focus visible
* labels
* mensajes de error accesibles
* ARIA cuando corresponda

El Oro Viejo no debe utilizarse como texto pequeño.

---

# 53. RESPONSIVE

Desktop:

experiencia completa.

Tablet:

reducción de columnas.

Mobile:

priorizar:

1. información
2. acciones
3. estados
4. navegación

El Sidebar puede transformarse en navegación móvil.

Las tablas complejas pueden convertirse en cards o desplazamiento horizontal cuando sea necesario.

---

# 54. DASHBOARD — JERARQUÍA VISUAL DEFINITIVA

El Dashboard debe seguir aproximadamente esta jerarquía:

```text
01 — ESTADO GENERAL

02 — PRODUCCIÓN EN TIEMPO REAL

03 — MÉTRICAS OPERACIONALES

04 — TANQUES / EQUIPOS

05 — PARÁMETROS

06 — INVENTARIO

07 — CALIDAD

08 — EVENTOS

09 — ÓRDENES
```

La información más crítica debe aparecer arriba.

---

# 55. CENTRO DE COMANDO

El Dashboard debe poder representar visualmente una planta.

Ejemplo conceptual:

```text
┌───────────────────────────────────────────────────────┐
│ CENTRO DE CONTROL DE PLANTA                           │
│ Producción en tiempo real                             │
├───────────────────────────────────────────────────────┤
│                                                       │
│ RECEPCIÓN → PASTEURIZACIÓN → FERMENTACIÓN → MEZCLA   │
│     ●              ●                 ●          ●      │
│                                                       │
├──────────────────────┬────────────────────────────────┤
│ TANQUES              │ TEMPERATURA                    │
│                      │                                │
│ T-01 80%             │       gráfico                  │
│ T-02 65%             │                                │
│ T-03 70%             │                                │
├──────────────────────┼────────────────────────────────┤
│ INVENTARIO           │ CALIDAD                        │
│                      │                                │
│ Leche       80%      │ 98.5%                          │
│ Fresa       45%      │                                │
│ Mango       60%      │                                │
├──────────────────────┴────────────────────────────────┤
│ ÚLTIMOS EVENTOS                                        │
└───────────────────────────────────────────────────────┘
```

---

# 56. REGLA DE DATOS

Los datos importantes deben utilizar Inter.

Ejemplo:

**42.0 °C**

**12.000 L**

**98.5%**

**1.248**

No utilizar Playfair para grandes cantidades de datos operacionales.

---

# 57. REGLA DE ESTADOS

Todo proceso importante debe tener estado.

Ejemplos:

`EN OPERACIÓN`

`DETENIDO`

`EN MANTENIMIENTO`

`ADVERTENCIA`

`CRÍTICO`

`COMPLETADO`

`PENDIENTE`

`CANCELADO`

---

# 58. REGLA DE ACCIONES

Las acciones principales siempre deben ser evidentes.

Ejemplos:

`+ NUEVO REGISTRO`

`GUARDAR`

`CONFIRMAR`

`PROCESAR`

`CONTINUAR`

Las acciones secundarias deben tener menor peso visual.

---

# 59. REGLA DE INFORMACIÓN TÉCNICA

La información técnica debe presentarse de manera estructurada.

Ejemplo:

```text
T-03
FERMENTACIÓN

Estado
EN OPERACIÓN

Temperatura
42.0 °C

Capacidad
10.000 L

Lote
L-20260910-01
```

No convertir estos datos en párrafos.

---

# 60. REGLA PARA FORMULARIOS

Los formularios deben sentirse como instrumentos de operación.

Cada campo debe tener:

* label
* input
* unidad cuando corresponda
* ayuda contextual
* estado

Evitar formularios visualmente saturados.

---

# 61. REGLA PARA COMPRAS

Las compras deben priorizar:

1. proveedor
2. insumo
3. condiciones comerciales
4. cantidad
5. precio
6. resultado
7. resumen

El diseño no debe ocultar los valores económicos.

---

# 62. REGLA PARA INVENTARIO

Inventario debe utilizar visualizaciones rápidas:

* stock actual
* stock mínimo
* unidad
* estado
* movimiento
* costo

Los niveles críticos deben destacarse.

---

# 63. REGLA PARA PRODUCCIÓN

Producción debe utilizar:

* lote
* producto
* cantidad
* línea
* etapa
* estado
* tiempos
* responsable

El usuario debe poder identificar rápidamente qué está sucediendo.

---

# 64. REGLA PARA CALIDAD

Calidad debe transmitir precisión.

Utilizar:

* indicadores
* rangos
* mediciones
* estados
* alertas
* trazabilidad

Evitar estética comercial.

---

# 65. REGLA PARA REPORTES

Los reportes deben ser más sobrios.

Priorizar:

* tablas
* métricas
* filtros
* exportación
* periodos
* gráficos

---

# 66. REGLA PARA CONFIGURACIÓN

Configuración debe utilizar una interfaz más técnica.

No utilizar decoración innecesaria.

---

# 67. PROHIBICIONES VISUALES

Queda prohibido:

* neón
* gradientes futuristas
* fondos negros tipo cyberpunk
* exceso de azul
* sombras exageradas
* glassmorphism
* elementos 3D
* interfaces infantiles
* tipografías manuscritas
* exceso de ornamentos
* colores fluorescentes
* iconos inconsistentes
* exceso de bordes
* exceso de redondeo
* animaciones llamativas

---

# 68. NO CONVERTIR EL ERP EN UNA ETIQUETA

La identidad vintage no significa colocar decoración vintage en todas partes.

No utilizar:

* marcos ornamentales alrededor de cada card
* flores en todos los componentes
* textura de papel en cada panel
* sellos en cada pantalla
* ilustraciones en cada módulo

La identidad debe estar presente principalmente mediante:

**color + tipografía + composición + materiales + detalles.**

---

# 69. REGLA DE PRIORIDAD

Cuando exista conflicto entre estética y funcionalidad:

**funcionalidad gana.**

Cuando exista conflicto entre decoración y legibilidad:

**legibilidad gana.**

Cuando exista conflicto entre tendencia y Design System:

**Design System gana.**

---

# 70. REGLA FINAL DE DISEÑO

Toda nueva pantalla de Yogurt ERP debe responder afirmativamente a estas preguntas:

```text
¿Se siente empresarial?

¿Se siente natural?

¿Se siente artesanal?

¿Se siente tecnológica?

¿La información importante se identifica rápidamente?

¿Los datos son fáciles de leer?

¿La interfaz tiene suficiente espacio?

¿Utiliza correctamente Teal, Pergamino y Oro?

¿Playfair está reservado para identidad y narrativa?

¿Inter está siendo utilizada para operación?

¿Los estados son claros?

¿La pantalla parece pertenecer al mismo sistema?
```

Si la respuesta es no, la pantalla debe rediseñarse.

---

# 71. DIRECTIVA MAESTRA PARA ANTIGRAVITY

Este documento debe considerarse la **fuente visual de verdad de Yogurt ERP**.

Al generar cualquier nueva interfaz:

> Construir una experiencia de ERP industrial moderna bajo el concepto **Centro de Comando SCADA Industrial Vintage**, combinando la estética artesanal y documental del patrimonio alimentario con la precisión visual de un sistema moderno de control industrial.

Utilizar obligatoriamente:

**Pergamino `#F4EFE6`** como fondo.

**Blanco `#FFFFFF`** para superficies elevadas.

**Teal `#1C454C`** como color operacional y tecnológico.

**Oro Viejo `#D9A05B`** como acento vintage.

**Granate `#8C2E25`** para atención y pasión.

**Plata `#E2E4E1`** para estructuras y divisores.

**Carbón `#1A1A1A`** para información principal.

**Playfair Display** para identidad, títulos y narrativa.

**Inter** para navegación, datos, formularios, botones y operación.

La interfaz debe parecer:

> **una planta artesanal de alimentos que ha evolucionado hacia un sistema de control digital moderno, sin perder su historia.**

No debe parecer una aplicación tecnológica genérica con decoración vintage añadida posteriormente.

La tecnología debe estar integrada en la identidad, no simplemente colocada encima de ella.

**Concepto definitivo:**

# YOGURT ERP

## CENTRO DE COMANDO SCADA INDUSTRIAL VINTAGE

**Tradición en el origen. Precisión en la operación. Trazabilidad en cada dato.**
