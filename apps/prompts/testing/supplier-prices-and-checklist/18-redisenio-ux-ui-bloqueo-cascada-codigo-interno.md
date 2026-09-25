# CORRECCIÓN Y MEJORA UX/UI — MODAL NUEVO PRODUCTO
# FLUJO LÓGICO + BLOQUEO CASCADA + CÓDIGO INTERNO + ERGONOMÍA VISUAL

## OBJETIVO GENERAL

Mejorar y corregir el flujo del modal "Nuevo Producto" para que sea:

- funcionalmente correcto;
- visualmente ergonómico;
- fácil de entender;
- lógico para el usuario;
- consistente con la información que realmente se necesita;
- progresivo;
- seguro frente a datos incompletos;
- coherente con el Design System existente.

La tarea tiene CUATRO objetivos principales:

1. Eliminar completamente "Cambiar de modo".
2. Implementar bloqueo en cascada según las dependencias reales de la información.
3. Mantener el Código Interno generado automáticamente, con edición excepcional protegida por advertencia.
4. Mejorar la organización visual y el flujo lógico de trabajo dentro de ambos formularios para que la captura de información siga un orden natural y eficiente.

---

# 1. PRINCIPIO GENERAL DE LA TAREA

El modal debe guiar al usuario.
No debe simplemente presentar una gran cantidad de campos y esperar que el usuario descubra qué debe diligenciar primero.

---

# 2. ELIMINAR "CAMBIAR DE MODO"

Actualmente, después de seleccionar Comercial o WIP, aparece "↺ Cambiar de modo".
Este control debe desaparecer completamente.
La única forma de salir del modal es mediante la X o Cancelar.

---

# 3. DOS FLUJOS INDEPENDIENTES
- Flujo A: Producto Comercial Envasado.
- Flujo B: Base Intermedia / Tanque (WIP).

---

# 9-12. BLOQUEO EN CASCADA Y REGLAS FUNCIONALES
- Dependencias claras y funcionales (disabled real).
- Bloqueo retroactivo al invalidar una dependencia anterior.

---

# 17-23. CÓDIGO INTERNO: PROTEGIDO + EDICIÓN EXCEPCIONAL CON ADVERTENCIA
- Generado automáticamente por el sistema.
- Solo lectura inicial con visualizador: `[ PRD-XXXXXX | ✎ ]`.
- Al pulsar el lápiz: advertencia/confirmación modal o inline explicando riesgos.
- Si confirma: pasa a editable (sanitizado y validado).

---

# 27-31. DESIGN SYSTEM Y ALCANCE
- Respetar paleta MANNÁ (`#182622`, Pergamino `#F4F1EA`, Oro `#a16207`, Verde `#166534`).
- Cero modificaciones a backend ni Prisma.
- SRP < 150 líneas por componente.
