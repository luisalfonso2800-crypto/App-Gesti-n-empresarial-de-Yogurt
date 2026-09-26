# CORRECCIÓN QUIRÚRGICA — ELIMINAR "CAMBIAR DE OPCIÓN"
## Modal Nuevo Producto

El diagnóstico E2E de validación de requisitos confirmó que 17/20 requisitos
están cumplidos.

NO modificar los requisitos que ya están pasando.

Los únicos pendientes identificados son los relacionados con el cambio de modo.

## PROBLEMA CONFIRMADO

El componente:

ProductModal.jsx

mantiene un botón dentro de:

activeModeBanner

que permite:

"⇄ Cambiar de Opción"

Actualmente ese control permite alternar entre:

- Producto Comercial Envasado
- Base Intermedia / Tanque (WIP)

sin cerrar el modal.

Esto contradice el requerimiento.

---

# OBJETIVO

Eliminar completamente la posibilidad de cambiar de modo una vez que el
usuario ha seleccionado el modo inicial.

El modo seleccionado debe permanecer fijo durante toda esa instancia del modal.

La única forma de abandonar ese modo debe ser cerrar el modal mediante la X.

---

# COMPORTAMIENTO OBLIGATORIO

## Caso Comercial

Flujo correcto:

Abrir Nuevo Producto
↓
Seleccionar Producto Comercial Envasado
↓
Formulario Comercial
↓
Modo FIJO
↓
Completar formulario
↓
Cerrar mediante X o guardar

NO debe existir:

"⇄ Cambiar de Opción"

NO debe existir ningún mecanismo equivalente.

---

## Caso WIP

Flujo correcto:

Abrir Nuevo Producto
↓
Seleccionar Base Intermedia / Tanque (WIP)
↓
Formulario WIP
↓
Modo FIJO
↓
Completar formulario
↓
Cerrar mediante X o guardar

NO debe existir:

"⇄ Cambiar de Opción"

NO debe existir ningún mecanismo equivalente.

---

# INVESTIGACIÓN OBLIGATORIA

Antes de modificar:

1. Abrir ProductModal.jsx.
2. Revisar específicamente las líneas asociadas a activeModeBanner.
3. Identificar el botón "Cambiar de Opción".
4. Identificar la función/event handler que ejecuta.
5. Identificar el estado utilizado para cambiar entre Comercial y WIP.
6. Verificar si ese estado tiene otros usos legítimos.
7. Eliminar únicamente la capacidad de cambiar de modo desde el formulario.

NO eliminar estados a ciegas.

Si el estado tiene otros usos, conservarlo.

---

# REGLA IMPORTANTE

NO ocultar simplemente el botón mediante CSS.

Debe eliminarse el renderizado del control y la interacción correspondiente.

NO dejar:

- botón invisible;
- botón disabled innecesario;
- enlace oculto;
- handler accesible desde otro control;
- mecanismo alternativo equivalente.

La funcionalidad debe desaparecer del flujo.

---

# NO MODIFICAR LO QUE YA FUNCIONA

NO tocar innecesariamente:

- bloqueo cascada;
- validaciones;
- Código Interno;
- generación automática del Código Interno;
- readOnly;
- icono de edición;
- divisor;
- advertencia de edición;
- cálculos;
- precios;
- IVA;
- unidades;
- inventario;
- recetas;
- backend;
- API;
- base de datos;
- Design System global;
- otros modales.

El diagnóstico ya confirmó que varios de estos requisitos están funcionando.

La corrección debe ser quirúrgica.

---

# PRUEBAS OBLIGATORIAS

Después de modificar:

## TEST 1 — COMERCIAL

1. Abrir Nuevo Producto.
2. Seleccionar Producto Comercial Envasado.
3. Confirmar que el formulario Comercial aparece.
4. Confirmar que NO existe "Cambiar de Opción".
5. Buscar cualquier control equivalente.
6. Confirmar que no existe.
7. Confirmar que el modo permanece Comercial.
8. Confirmar que la X cierra el modal.

## TEST 2 — WIP

1. Abrir Nuevo Producto.
2. Seleccionar Base Intermedia / Tanque (WIP).
3. Confirmar que el formulario WIP aparece.
4. Confirmar que NO existe "Cambiar de Opción".
5. Buscar cualquier control equivalente.
6. Confirmar que no existe.
7. Confirmar que el modo permanece WIP.
8. Confirmar que la X cierra el modal.

## TEST 3 — REGRESIÓN

Ejecutar nuevamente:

products-requirements-battery.spec.js

Resultado esperado:

20/20 requisitos PASS.

También ejecutar los 14 tests existentes de regresión.

Resultado esperado:

14/14 PASS.

---

# REGLA DE FINALIZACIÓN

NO considerar terminada la tarea hasta obtener:

20/20 PASS

y:

14/14 PASS

No realizar ninguna otra modificación funcional si ambos conjuntos de pruebas
pasan.

Al finalizar informar únicamente:

1. Archivos modificados.
2. Qué se eliminó.
3. Tests ejecutados.
4. Resultado 20/20.
5. Resultado 14/14.
