
# PROMPT DESIGN MANUAL

**Proyecto:** Yogurt Management System
**Propósito:** Diseñar prompts precisos, controlados y eficientes para Google Antigravity.

**Ámbito:** Diseño de instrucciones para tareas de análisis, documentación, decisiones, implementación, corrección, refactorización, pruebas y verificación.

**Principio central:**

> Diseñar cada prompt para que Antigravity realice exactamente el trabajo necesario, utilizando el conocimiento existente del proyecto y evitando exploración, razonamiento y trabajo duplicado.

---

# 1. Principio fundamental

Un buen prompt no busca que Antigravity haga la mayor cantidad de trabajo posible.

Busca que haga:

> **el menor trabajo necesario para producir exactamente el resultado solicitado.**

La optimización no consiste simplemente en reducir palabras.

Consiste en reducir:

* exploración innecesaria;
* lectura repetida;
* auditorías duplicadas;
* razonamiento fuera del alcance;
* modificaciones no solicitadas;
* verificaciones repetidas;
* documentación redundante;
* autonomía innecesaria.

---

# 2. Fórmula estándar

Antes de redactar un prompt, considerar:

```text
OBJETIVO
+
FUENTE DE VERDAD
+
REGLA DE CONSULTA
+
ALCANCE
+
ACCIONES
+
LÍMITES
+
CRITERIO DE TERMINACIÓN
+
VERIFICACIÓN
+
DETENERSE
```

No todos los prompts necesitan escribir literalmente todas las secciones.

La complejidad del prompt debe corresponder a la complejidad de la tarea.

> **No agregar estructura que no aporte control.**

---

# 3. OBJETIVO

El objetivo debe expresar un único resultado principal.

Debe responder:

> ¿Qué resultado concreto necesitamos obtener?

Preferir:

```text
Crear `docs/data-model/13-persistence-decisions.md`.
```

Evitar:

```text
Analiza todo lo relacionado con persistencia y haz lo necesario.
```

El objetivo debe ser observable y verificable.

Mal:

```text
Mejora la documentación.
```

Bien:

```text
Actualizar `docs/data-model/13-persistence-decisions.md`
para incorporar D-01 a D-10.
```

---

# 4. FUENTE DE VERDAD

Todo prompt que dependa de información existente debe identificar su fuente principal.

Ejemplo:

```text
FUENTE DE VERDAD:

`docs/data-model/12-persistence-decisions-review.md`
```

Cuando exista un resultado previo de una auditoría, análisis o decisión, debe utilizarse como fuente principal.

Principio:

> **Antigravity no debe volver a descubrir lo que el proyecto ya sabe.**

---

# 5. REUTILIZACIÓN DEL TRABAJO EXISTENTE

Antes de crear un prompt, determinar si ya existe:

* una auditoría;
* un análisis;
* una decisión;
* una matriz;
* un informe;
* una especificación;
* una implementación;
* una verificación.

Si existe, el nuevo prompt debe utilizar ese resultado.

Preferir:

```text
Utiliza `Persistence Decisions Review` como resultado de la auditoría anterior.
```

Evitar:

```text
Vuelve a analizar toda la documentación para determinar las decisiones.
```

Una auditoría debe convertirse en una **fuente reutilizable**, no en trabajo que se repite.

---

# 6. REGLA DE CONSULTA DE FUENTES SECUNDARIAS

Cuando existe una fuente principal, la documentación original pasa a ser secundaria.

Usar una condición objetiva:

```text
Consulta documentación original únicamente si la fuente principal
no contiene información suficiente para completar el resultado solicitado
o si existe una referencia concreta que deba comprobarse.
```

Evitar:

```text
Consulta los documentos cuando lo consideres necesario.
```

La segunda formulación entrega demasiado criterio al agente.

---

# 7. REGLA DE CONFLICTOS ENTRE FUENTES

Si la fuente principal contradice documentación anterior:

```text
No reconcilies ni resuelvas automáticamente la discrepancia.

Regístrala únicamente si afecta directamente al resultado solicitado.
```

El agente no debe convertir una tarea pequeña en una nueva auditoría.

Si resolver la discrepancia requiere una decisión arquitectónica, debe quedar pendiente.

---

# 8. ALCANCE

Todo prompt debe limitar el universo de trabajo.

Cuando sea útil, separar:

```text
LEER:
- archivo A
- archivo B

CREAR:
- archivo C

MODIFICAR:
- archivo C

NO MODIFICAR:
- archivos fuera del alcance
```

El objetivo es reducir el radio de acción del agente.

---

# 9. LIMITAR LA EXPLORACIÓN

Cuando no se necesite exploración general, indicarlo.

Preferir:

```text
Lee únicamente los archivos necesarios para completar esta tarea.
```

y, cuando corresponda:

```text
No realices búsquedas exploratorias del repositorio.
```

Evitar:

```text
Revisa el proyecto.
```

o:

```text
Busca cualquier problema relacionado.
```

Las instrucciones abiertas aumentan la autonomía del agente.

---

# 10. UNA TAREA = UN OBJETIVO PRINCIPAL

No combinar innecesariamente:

```text
investigar
+
diseñar
+
implementar
+
migrar
+
probar
+
documentar
+
refactorizar
```

Una misión como:

```text
Analiza la arquitectura, corrígela, implementa Prisma,
crea migraciones, configura PostgreSQL y documenta todo.
```

debe dividirse.

Preferir:

```text
FASE 1 — ANÁLISIS
FASE 2 — RATIFICACIÓN
FASE 3 — IMPLEMENTACIÓN
FASE 4 — VERIFICACIÓN
```

---

# 11. SEPARAR LAS FASES DEL TRABAJO

Flujo recomendado:

```text
INVESTIGAR
    ↓
DOCUMENTAR
    ↓
RATIFICAR
    ↓
IMPLEMENTAR
    ↓
VERIFICAR
    ↓
CERRAR
```

Cada fase debe consumir el resultado de la anterior.

No reiniciar el proceso salvo que exista una razón concreta.

---

# 12. NO RESOLVER LO QUE SOLO DEBE REGISTRARSE

Si una tarea consiste en registrar decisiones pendientes:

```text
No resolver las decisiones.
Registrar únicamente las decisiones existentes.
```

Especialmente importante para:

* arquitectura;
* modelo de datos;
* relaciones;
* persistencia;
* identificadores;
* contratos;
* seguridad.

Una decisión pendiente debe permanecer pendiente hasta su ratificación.

---

# 13. NO CONVERTIR RECOMENDACIONES EN DECISIONES

Una recomendación encontrada en documentación no equivale automáticamente a una decisión ratificada.

Cuando corresponda:

```text
No convertir recomendaciones en decisiones ratificadas.
```

Esto evita que Antigravity tome decisiones arquitectónicas por iniciativa propia.

---

# 14. ESTADOS CONTROLADOS

Utilizar estados consistentes:

```text
PENDIENTE
EN REVISIÓN
RATIFICADA
IMPLEMENTADA
VERIFICADA
BLOQUEADA
```

El estado debe reflejar la situación real de la información.

No inventar estados ni cambiar uno sin evidencia.

---

# 15. CONTROL DE MODIFICACIONES

Cuando una tarea pueda modificar archivos, establecer explícitamente los límites.

Ejemplo:

```text
CREAR:
- `docs/data-model/13-persistence-decisions.md`

MODIFICAR:
- ningún otro archivo.
```

Cuando exista riesgo de desviación:

```text
No modificar archivos fuera del alcance indicado.
```

---

# 16. RESTRICCIONES `NO HACER`

Utilizarlas únicamente para riesgos reales.

Ejemplo:

```text
NO HACER:

- No instalar dependencias.
- No crear migraciones.
- No modificar entidades.
- No resolver decisiones pendientes.
```

No convertir cada prompt en una lista interminable de prohibiciones.

Principio:

> **Las restricciones deben bloquear desviaciones plausibles.**

---

# 17. CRITERIO DE FINALIZACIÓN

Toda tarea compleja debe tener una definición objetiva de terminado.

Ejemplo:

```text
CRITERIO DE FINALIZACIÓN:

La tarea termina cuando:

- existe el archivo solicitado;
- contiene las decisiones requeridas;
- contiene la matriz requerida;
- no se modificaron otros archivos.
```

Evitar:

```text
Termina cuando consideres que el trabajo está completo.
```

---

# 18. VERIFICACIÓN

La verificación debe corresponder exactamente al objetivo.

Si se creó un documento:

```text
VERIFICACIÓN:

Comprueba únicamente:

- existencia del archivo;
- contenido requerido;
- estructura requerida;
- ausencia de modificaciones fuera del alcance.
```

No convertir la verificación en una nueva auditoría.

---

# 19. VERIFICACIÓN ≠ AUDITORÍA

Esta distinción es obligatoria.

### Verificación

Pregunta:

> ¿El resultado contiene lo que se solicitó?

### Auditoría

Pregunta:

> ¿La información, arquitectura o decisión es correcta?

Ejemplo:

```text
Verifica que D-01 a D-10 estén presentes.
```

no significa:

```text
Audita nuevamente D-01 a D-10.
```

Principio:

> **Verificar el resultado no significa repetir el análisis que produjo el resultado.**

---

# 20. VERIFICACIÓN ÚNICA

No solicitar ciclos innecesarios:

```text
Crear
→ revisar
→ auditar
→ volver a revisar
→ comparar
→ volver a auditar
```

Preferir:

```text
Crear
→ realizar una única verificación
→ DETENERSE
```

---

# 21. CRITERIOS DE SALIDA

Si se necesita una respuesta breve, definirla.

Ejemplo:

```text
SALIDA:

Entrega únicamente:

Archivo creado:
Estado:
Bloqueadores:
```

Evitar:

```text
Explícame todo lo que hiciste.
```

cuando esa información no sea necesaria.

---

# 22. DETENCIÓN

Cuando se cumpla el objetivo:

```text
DETENCIÓN:

Cuando el criterio de finalización se cumpla, DETENTE.
No continúes con ninguna otra tarea.
```

La ausencia de una condición de parada puede permitir que el agente encuentre trabajo adicional y continúe.

---

# 23. CONTROL DE AUTONOMÍA

Elegir la autonomía mínima necesaria.

### Baja

```text
Leer
↓
Extraer
↓
Crear
↓
Verificar
↓
DETENERSE
```

### Media

```text
Analizar
↓
Modificar archivos específicos
↓
Probar
↓
Corregir
↓
DETENERSE
```

### Alta

```text
Explorar
↓
Diseñar
↓
Modificar múltiples áreas
↓
Instalar
↓
Probar
↓
Resolver
↓
Refactorizar
↓
Volver a analizar
```

Preferir siempre el nivel más bajo que permita completar correctamente la tarea.

---

# 24. NO PEDIR DESCUBRIMIENTO DE UBICACIONES CONOCIDAS

Si sabemos dónde está un documento:

```text
Lee:
`docs/data-model/12-persistence-decisions-review.md`
```

No:

```text
Busca dónde están documentadas las decisiones de persistencia.
```

El agente no debe gastar trabajo descubriendo una ubicación que nosotros ya conocemos.

---

# 25. DOCUMENTACIÓN COMO MEMORIA DEL PROYECTO

La documentación debe conservar el conocimiento importante.

El patrón es:

```text
AUDITORÍA
    ↓
RESULTADO DOCUMENTADO
    ↓
RESUMEN / MATRIZ
    ↓
DECISIÓN RATIFICADA
    ↓
IMPLEMENTACIÓN
```

Los siguientes prompts deben consumir esos artefactos.

No reconstruir la historia desde cero.

---

# 26. CONVERTIR ANÁLISIS LARGOS EN ARTEFACTOS CORTOS

Cuando una investigación sea extensa, convertir su resultado en una representación más pequeña.

Ejemplo:

```text
Auditoría extensa
       ↓
Persistence Decisions Review
       ↓
Matriz D-01...D-10
       ↓
Decisiones ratificadas
       ↓
Prisma
```

Esto reduce el contexto necesario en las fases posteriores.

---

# 27. NO COPIAR INNECESARIAMENTE EL CONTEXTO

Si la información ya está documentada, referenciarla.

Preferir:

```text
Utiliza `Persistence Decisions Review`.
```

en lugar de copiar dentro del prompt todo su contenido.

El prompt debe decirle al agente **dónde está el conocimiento**, no reproducirlo innecesariamente.

---

# 28. MANEJO DE INFORMACIÓN FALTANTE

No rellenar silenciosamente información que la fuente no contiene.

Utilizar:

```text
Si la información no está respaldada por la fuente,
márcala como PENDIENTE.
No la inventes.
```

Esto es especialmente importante antes de implementar arquitectura o persistencia.

---

# 29. CAMBIO MÍNIMO

Cuando la tarea implique modificar algo existente:

```text
Realiza únicamente los cambios necesarios para cumplir el objetivo.
```

No aprovechar una corrección localizada para realizar mejoras no solicitadas.

---

# 30. NO ADELANTAR LA SIGUIENTE FASE

Ejemplo:

```text
Después de generar el análisis, no implementes las decisiones.
La implementación corresponde a una tarea posterior.
```

Cada fase debe respetar su límite.

---

# 31. ANTIGRAVITY NO DEBE USARSE PARA TODO

No toda operación requiere un agente.

Para cambios triviales y perfectamente definidos, utilizar herramientas directas cuando sea posible.

Antigravity aporta mayor valor cuando existe necesidad de:

* navegación;
* análisis;
* modificaciones coordinadas;
* ejecución de comandos;
* pruebas;
* correcciones controladas.

---

# 32. MINIMALIDAD

Antes de enviar un prompt preguntar:

> ¿Esta instrucción es necesaria para completar la tarea?

Si no:

**eliminarla.**

Pero no eliminar restricciones que protejan contra una desviación real.

La meta no es:

> **Prompt más corto.**

La meta es:

> **Prompt con la menor ambigüedad y el menor trabajo innecesario.**

---

# 33. PLANTILLA MAESTRA

```text
TAREA:
[Nombre breve]

OBJETIVO:
[Resultado concreto y único]

FUENTE DE VERDAD:
[Fuente principal]

REGLA DE CONSULTA:
[Cuándo puede consultar fuentes secundarias]

ALCANCE:

LEER:
- [...]

CREAR:
- [...]

MODIFICAR:
- [...]

NO MODIFICAR:
- [...]

INSTRUCCIONES:

1. [...]
2. [...]
3. [...]

NO HACER:
- [...]
- [...]

CRITERIO DE FINALIZACIÓN:

La tarea termina cuando:

- [...]
- [...]
- [...]

VERIFICACIÓN:

Comprueba únicamente:

- [...]
- [...]

DETENCIÓN:

Cuando el criterio de finalización se cumpla, DETENTE.
No continúes con ninguna otra tarea.

SALIDA:

Entrega únicamente:

- [...]
- [...]
```

---

# 34. CHECKLIST PARA NOSOTROS

Antes de entregarte un prompt para Antigravity, debemos comprobar:

```text
[ ] ¿Tiene un objetivo único?
[ ] ¿Está definida la fuente de verdad?
[ ] ¿Existe un resultado anterior reutilizable?
[ ] ¿Se está evitando repetir una auditoría?
[ ] ¿Está limitada la consulta de fuentes secundarias?
[ ] ¿Está definido el alcance?
[ ] ¿Sabemos qué archivos debe leer?
[ ] ¿Sabemos qué archivos puede crear/modificar?
[ ] ¿Se evita la exploración innecesaria?
[ ] ¿Se evita resolver decisiones pendientes?
[ ] ¿Se evitaron prohibiciones irrelevantes?
[ ] ¿Existe un criterio de finalización?
[ ] ¿La verificación está limitada?
[ ] ¿Existe una condición de detención?
[ ] ¿La autonomía es la mínima necesaria?
[ ] ¿La salida está limitada a lo necesario?
```

---

# 35. CÓMO ELEGIR EL TIPO DE PROMPT

Primero identificar qué necesitamos:

```text
¿Necesitamos descubrir algo?
        ↓
     ANÁLISIS

¿Necesitamos registrar lo descubierto?
        ↓
   DOCUMENTACIÓN

¿Necesitamos elegir entre alternativas?
        ↓
     DECISIÓN

¿La decisión ya fue ratificada?
        ↓
   IMPLEMENTACIÓN

¿Necesitamos comprobar el resultado?
        ↓
   VERIFICACIÓN

¿Existe un error concreto?
        ↓
    CORRECCIÓN

¿Necesitamos revisar sistemáticamente un área?
        ↓
     AUDITORÍA
```

Nunca utilizar una categoría más amplia de la necesaria.

---

# 36. PATRONES DE REFERENCIA

## Documentación

```text
FUENTE EXISTENTE
→ EXTRAER
→ ESTRUCTURAR
→ CREAR
→ VERIFICAR
→ DETENERSE
```

## Análisis

```text
FUENTES
→ ÁREA LIMITADA
→ ANALIZAR
→ DOCUMENTAR
→ NO IMPLEMENTAR
→ DETENERSE
```

## Decisión

```text
EVIDENCIA
→ OPCIONES
→ IMPACTOS
→ PENDIENTE
→ RATIFICACIÓN
```

## Implementación

```text
DECISIÓN RATIFICADA
→ ARCHIVOS OBJETIVO
→ CAMBIO MÍNIMO
→ PRUEBA
→ DETENERSE
```

## Verificación

```text
RESULTADO
→ CRITERIOS
→ PASS / FAIL
→ NO MODIFICAR
→ DETENERSE
```

## Corrección

```text
PROBLEMA CONCRETO
→ CAUSA
→ CORRECCIÓN MÍNIMA
→ PRUEBA
→ DETENERSE
```

## Auditoría

```text
ÁREA DEFINIDA
→ FUENTES
→ CRITERIOS
→ HALLAZGOS
→ DOCUMENTAR
→ NO CORREGIR
→ DETENERSE
```

---

# 37. EJEMPLO PRINCIPAL: DOCUMENTACIÓN DESDE UNA AUDITORÍA EXISTENTE

Este es el ejemplo de referencia para el proyecto actual:

```text
TAREA: Crear matriz compacta de decisiones de persistencia

OBJETIVO:

Crear `docs/data-model/13-persistence-decisions.md` como hoja breve
de decisiones pendientes para su posterior ratificación antes de
implementar Prisma.

FUENTE DE VERDAD:

Utiliza como fuente principal `Persistence Decisions Review`.

REGLA DE CONSULTA:

Consulta documentación original únicamente si la fuente principal
no contiene información suficiente para completar un campo requerido
o existe una referencia concreta que deba comprobarse.

Si existe una discrepancia entre la fuente principal y documentación
anterior, no la resuelvas ni la reconcilies.

ALCANCE:

LEER:
- `Persistence Decisions Review`
- documentación original solo cuando la regla de consulta lo requiera.

CREAR:
- `docs/data-model/13-persistence-decisions.md`

MODIFICAR:
- ningún otro archivo.

NO HACER:

- No realizar una nueva auditoría.
- No explorar el repositorio de forma general.
- No realizar búsquedas exploratorias.
- No resolver decisiones pendientes.
- No modificar entidades ni relaciones.
- No instalar Prisma.
- No crear `schema.prisma`.
- No crear migraciones.
- No instalar PostgreSQL.
- No modificar documentación anterior.
- No crear documentación duplicada.
- No convertir recomendaciones en decisiones ratificadas.

INSTRUCCIONES:

1. Extrae D-01 a D-10 del `Persistence Decisions Review`.
2. Resume cada decisión utilizando únicamente información respaldada
   por la fuente.
3. Para cada decisión registra:
   - Problema.
   - Opciones.
   - Evidencia.
   - Impacto.
   - Estado.
4. No agregues decisiones nuevas.
5. No resuelvas decisiones pendientes.
6. Agrega la matriz de dependencias.
7. Agrega únicamente los bloqueadores para Prisma respaldados por la fuente.

CRITERIO DE FINALIZACIÓN:

- existe el archivo solicitado;
- contiene D-01 a D-10;
- contiene la matriz;
- contiene los bloqueadores;
- no se modificaron otros archivos.

VERIFICACIÓN:

Realiza únicamente una verificación estructural.

No vuelvas a auditar las decisiones.

DETENCIÓN:

Al cumplir los criterios, DETENTE.

SALIDA:

Archivo creado:
Decisiones registradas:
Bloqueadores:
Estado:
```

Este ejemplo representa el patrón más importante:

```text
TRABAJO YA REALIZADO
        ↓
REUTILIZAR
        ↓
CONDENSAR
        ↓
CREAR ARTEFACTO
        ↓
VERIFICAR
        ↓
DETENERSE
```

---

# 38. EJEMPLO: ANÁLISIS SIN IMPLEMENTACIÓN

```text
TAREA: Analizar relación Production → Lot

OBJETIVO:

Identificar únicamente inconsistencias documentales relacionadas con
la relación entre `Production` y `Lot`.

FUENTE DE VERDAD:

Documentación existente de Production y Lot.

ALCANCE:

LEER:
- documentos directamente relacionados con Production;
- documentos directamente relacionados con Lot.

CREAR:
- `docs/data-model/production-lot-review.md`

MODIFICAR:
- ningún otro archivo.

NO HACER:

- No modificar código.
- No modificar entidades.
- No modificar relaciones.
- No implementar Prisma.
- No realizar auditoría general.
- No resolver las inconsistencias.

INSTRUCCIONES:

1. Identifica la representación actual de Production.
2. Identifica la representación actual de Lot.
3. Compara únicamente su relación.
4. Documenta inconsistencias y datos faltantes.
5. Marca los hallazgos como PENDIENTE.

CRITERIO DE FINALIZACIÓN:

El informe contiene los hallazgos relacionados exclusivamente
con Production → Lot.

DETENCIÓN:

Al completar el informe, DETENTE.

SALIDA:

Archivo:
Hallazgos:
Estado:
```

---

# 39. EJEMPLO: IMPLEMENTACIÓN DE DECISIÓN RATIFICADA

```text
TAREA: Implementar decisión ratificada

OBJETIVO:

Implementar únicamente la decisión D-07 previamente ratificada.

FUENTE DE VERDAD:

`docs/data-model/13-persistence-decisions.md`

ALCANCE:

LEER:
- documento de decisiones;
- `schema.prisma`.

MODIFICAR:
- `schema.prisma`.

NO HACER:

- No reconsiderar D-07.
- No analizar nuevamente las alternativas.
- No modificar decisiones diferentes.
- No realizar refactorizaciones no relacionadas.
- No crear migraciones.

INSTRUCCIONES:

1. Lee D-07 en estado RATIFICADA.
2. Comprueba su representación actual.
3. Realiza únicamente el cambio necesario.
4. Ejecuta la verificación correspondiente.

Si D-07 no está RATIFICADA, no implementes nada.

CRITERIO DE FINALIZACIÓN:

D-07 está implementada y no existen modificaciones fuera del alcance.

DETENCIÓN:

Al completar la verificación, DETENTE.

SALIDA:

Decisión:
Archivo:
Verificación:
Estado:
```

---

# 40. EJEMPLO: VERIFICACIÓN

```text
TAREA: Verificar implementación de persistencia

OBJETIVO:

Comprobar que `schema.prisma` representa las decisiones de persistencia
RATIFICADAS.

FUENTE DE VERDAD:

`docs/data-model/13-persistence-decisions.md`

ALCANCE:

LEER:
- `schema.prisma`;
- decisiones RATIFICADAS.

MODIFICAR:
- ninguno.

NO HACER:

- No corregir.
- No rediseñar.
- No resolver decisiones pendientes.
- No realizar una nueva auditoría.

VERIFICAR:

- identificadores;
- relaciones;
- tipos;
- campos obligatorios/opcionales;
- decisiones RATIFICADAS aplicables.

Clasificar cada elemento:

PASS
o
FAIL

Si existe FAIL, informar el problema.
No corregirlo.

DETENCIÓN:

Después de emitir el resultado, DETENTE.

SALIDA:

| Decisión | Resultado | Observación |
|---|---|---|
| D-01 | PASS/FAIL | ... |
| D-02 | PASS/FAIL | ... |

Estado general:
PASS / FAIL
```

---

# 41. REGLAS ABSOLUTAS

Si alguna regla debe prevalecer sobre las demás, son estas:

### 1. No redescubrir conocimiento existente

> Referenciar antes que investigar nuevamente.

### 2. No ampliar el alcance

> Lo que no es necesario para completar la tarea queda fuera.

### 3. No resolver decisiones prematuramente

> `PENDIENTE` significa pendiente.

### 4. No confundir verificación con auditoría

> Comprobar un resultado no implica repetir su análisis.

### 5. No otorgar autonomía innecesaria

> La autonomía debe ser proporcional a la tarea.

### 6. Convertir resultados en memoria documental

> Los artefactos del proyecto deben permitir continuar sin reconstruir la historia.

### 7. Cada fase consume el resultado de la anterior

> No volver al principio sin causa concreta.

### 8. Detenerse al terminar

> El trabajo adicional no solicitado es una desviación, no una mejora.

---

# 42. REGLA DE DECISIÓN PARA NOSOTROS

Antes de entregarte un prompt para Antigravity, el criterio será:

```text
¿Ya existe este conocimiento?
        │
       SÍ
        ↓
Referenciarlo.
        │
       NO
        ↓
¿Necesitamos descubrirlo?
        │
       SÍ
        ↓
Crear tarea de análisis.
        │
       NO
        ↓
¿Necesitamos implementarlo?
        │
       SÍ
        ↓
Comprobar que las decisiones estén ratificadas.
        │
       ↓
Implementar.
        │
       ↓
Verificar.
        │
       ↓
Cerrar.
```

---

# 43. PRINCIPIO FINAL

La regla que debemos tener presente al diseñar cada prompt es:

> **No diseñar prompts para que Antigravity haga más. Diseñarlos para que tenga menos cosas que decidir por sí mismo.**

Por eso la fórmula final queda:

```text
OBJETIVO
+
FUENTE
+
REGLA DE CONSULTA
+
ALCANCE
+
ACCIONES
+
LÍMITES
+
CRITERIO DE TERMINACIÓN
+
VERIFICACIÓN
+
DETENERSE
```

Y el flujo del proyecto:

```text
INVESTIGAR
    ↓
DOCUMENTAR
    ↓
RATIFICAR
    ↓
IMPLEMENTAR
    ↓
VERIFICAR
    ↓
CERRAR
```

# 33. DECIDIR SI REALMENTE SE NECESITA ANTIGRAVITY

Antes de diseñar un prompt, determinar si la tarea requiere realmente un agente.

Utilizar Antigravity cuando la tarea requiera una o varias de estas capacidades:

* analizar información distribuida;
* navegar entre archivos;
* modificar varios archivos de forma coordinada;
* ejecutar comandos o pruebas;
* diagnosticar problemas;
* realizar una implementación que requiera contexto;
* verificar una implementación mediante múltiples fuentes.

No utilizar Antigravity cuando la operación pueda realizarse de forma directa, determinista y localizada sin razonamiento adicional.

Principio:

> **No utilizar un agente para una tarea que una operación directa puede resolver.**

La optimización comienza antes del prompt.

---

# 34. CONTEXTO MÍNIMO NECESARIO

No todo el contexto disponible debe entregarse o solicitarse.

Clasificar el contexto en:

```text
NECESARIO
ÚTIL
INNECESARIO
```

Utilizar únicamente el contexto necesario para completar la tarea.

El contexto útil solamente debe incorporarse cuando reduzca una ambigüedad real o evite una exploración mayor.

No incorporar contexto únicamente porque esté disponible.

Principio:

> **Más contexto no significa mejor resultado. El objetivo es proporcionar el contexto mínimo suficiente.**

---

# 35. CONTINUIDAD SIN REDESCUBRIMIENTO

Cuando una tarea continúa un trabajo anterior, identificar explícitamente el artefacto que representa el resultado de la fase anterior.

Preferir:

```text
Utiliza el resultado de la fase anterior:
`ruta/al/resultado.md`
```

Evitar:

```text
Revisa nuevamente todo lo realizado anteriormente.
```

La continuidad debe producirse mediante artefactos del proyecto y no mediante reconstrucción de la conversación.

Principio:

> **El proyecto debe transportar su propio contexto.**

---

# 36. DECIDIR QUÉ HACER CON EL RESULTADO

Después de recibir un resultado de Antigravity, no generar automáticamente otro prompt.

Clasificar primero el resultado:

```text
RESULTADO
│
├── COMPLETO
│      ↓
│    CERRAR
│
├── PENDIENTE DE DECISIÓN
│      ↓
│    DECISIÓN HUMANA
│
├── BLOQUEADO
│      ↓
│    RESOLVER BLOQUEO
│
├── ERROR
│      ↓
│    PROMPT DE CORRECCIÓN
│
└── SIGUIENTE FASE
       ↓
     NUEVO PROMPT
```

Un resultado `PENDIENTE` no implica automáticamente que Antigravity deba continuar.

Puede requerir una decisión del responsable del proyecto.

---

# 37. NO CREAR PROMPTS DE CONTINUACIÓN AUTOMÁTICOS

No utilizar como patrón:

```text
Haz lo anterior.
Ahora revisa lo que hiciste.
Ahora corrígelo.
Ahora vuelve a revisar todo.
```

Cada nueva instrucción debe tener una razón concreta.

Antes de crear un nuevo prompt preguntar:

```text
¿Qué información nueva tenemos?
¿Qué resultado anterior no es suficiente?
¿Qué acción concreta falta?
```

Si ninguna respuesta justifica una nueva tarea, no crear otro prompt.

Principio:

> **Un nuevo prompt debe representar trabajo nuevo, no simplemente repetir trabajo anterior.**

---

# 38. CONGELACIÓN DE RESULTADOS ACEPTADOS

Cuando un resultado haya sido revisado y aceptado, considerarlo estable.

No volver a auditarlo automáticamente.

Flujo:

```text
RESULTADO
    ↓
REVISIÓN
    ↓
ACEPTADO
    ↓
CONGELADO
```

Solo volver a abrirlo cuando:

* aparezca nueva información;
* cambie un requisito;
* se detecte un error;
* una decisión posterior dependa de modificarlo.

Principio:

> **Aceptado significa cerrado hasta que exista una razón explícita para reabrirlo.**

---

# 39. EVITAR CICLOS INFINITOS DE REVISIÓN

No utilizar cadenas indefinidas como:

```text
analizar
→ revisar
→ corregir
→ revisar
→ auditar
→ revisar
→ volver a analizar
```

Toda cadena de trabajo debe tener un punto de cierre.

Ejemplo:

```text
ANÁLISIS
    ↓
DOCUMENTACIÓN
    ↓
REVISIÓN
    ↓
ACEPTACIÓN
    ↓
CIERRE
```

Si aparece una discrepancia posteriormente, iniciar una tarea nueva y específica.

No reiniciar automáticamente todo el proceso.

---

# 40. DECISIÓN HUMANA VS. DECISIÓN DEL AGENTE

No todas las decisiones deben ser delegadas.

El agente puede:

* identificar alternativas;
* comparar consecuencias;
* detectar inconsistencias;
* presentar evidencia;
* documentar una propuesta.

Pero cuando una decisión requiera criterio del responsable del proyecto, debe quedar explícitamente pendiente.

Ejemplo:

```text
Estado: PENDIENTE DE DECISIÓN

El agente no debe seleccionar una alternativa
hasta recibir una decisión explícita.
```

Principio:

> **El agente analiza y ejecuta decisiones ratificadas; no debe convertir automáticamente una recomendación en una decisión del proyecto.**

---

# 41. CAMBIO DE ESTADO COMO EVENTO

Los estados del proyecto deben cambiar por una acción o evidencia identificable.

Ejemplo:

```text
PENDIENTE
   ↓
DECISIÓN RATIFICADA
   ↓
RATIFICADA
   ↓
IMPLEMENTACIÓN
   ↓
IMPLEMENTADA
   ↓
VERIFICACIÓN
   ↓
VERIFICADA
```

No cambiar estados solamente porque Antigravity "considere" que el trabajo está completo.

Cuando corresponda, registrar qué produjo el cambio.

---

# 42. NO REABRIR DECISIONES SIN CAUSA

Una decisión `RATIFICADA` no debe volver automáticamente a `PENDIENTE`.

Solo puede reabrirse cuando exista una causa concreta, por ejemplo:

* nueva evidencia;
* contradicción detectada;
* cambio de requisito;
* error de implementación;
* dependencia que haga imposible mantenerla.

La reapertura debe ser explícita.

---

# 43. PROMPT NUEVO = NUEVA UNIDAD DE TRABAJO

Cada prompt debe poder identificarse como una unidad independiente.

Debe ser posible responder:

```text
¿Qué produce este prompt?
¿Qué archivos afecta?
¿Qué decisión ejecuta?
¿Qué criterio determina que terminó?
```

Si no es posible responder estas preguntas, el prompt probablemente está agrupando demasiadas tareas.

---

# 44. TRANSICIÓN ENTRE FASES

No pasar automáticamente a la siguiente fase.

Utilizar una condición explícita.

Ejemplo:

```text
FASE 1 — ANÁLISIS
        ↓
¿Resultado aceptado?
        │
       NO → corregir análisis
        │
       SÍ
        ↓
FASE 2 — RATIFICACIÓN
```

La siguiente fase comienza únicamente cuando su precondición se cumple.

Esto evita implementar sobre información incompleta.

---

# 45. PRECONDICIONES

Las tareas que dependan de decisiones o artefactos anteriores deben declarar sus precondiciones cuando sea necesario.

Ejemplo:

```text
PRECONDICIÓN:

D-07 debe estar en estado RATIFICADA.

Si no lo está:
- no implementar;
- informar el estado;
- DETENERSE.
```

Las precondiciones son preferibles a permitir que el agente decida qué hacer ante información incompleta.

---

# 46. FALLA CONTROLADA

Cuando el agente no pueda completar la tarea, no debe compensar inventando información ni ampliando el alcance.

Debe:

```text
1. Identificar el bloqueo.
2. Indicar qué información falta.
3. Mantener intactos los archivos fuera del alcance.
4. DETENERSE.
```

Principio:

> **Un bloqueo explícito es preferible a una solución inventada.**

---

# 47. DIFERENCIAR TAREA INCOMPLETA DE TAREA FALLIDA

No utilizar el mismo tratamiento para ambos casos.

```text
INCOMPLETA
→ falta una decisión o información.

FALLIDA
→ se intentó ejecutar y no se obtuvo el resultado esperado.

BLOQUEADA
→ no puede continuar debido a una dependencia externa.
```

La clasificación determina el siguiente paso.

---

# 48. REGLA DE REAPERTURA

Cuando sea necesario volver a trabajar sobre un artefacto cerrado, especificar por qué se reabre.

Ejemplo:

```text
REAPERTURA:

Motivo:
Nueva decisión D-14 afecta la relación previamente documentada.
```

No utilizar:

```text
Revisa nuevamente el documento por si acaso.
```

---

# 49. CONTROL DEL RADIO DE CAMBIO

El alcance no debe medirse únicamente por cantidad de archivos.

También debe medirse por concepto.

Ejemplo:

```text
Objetivo:
Corregir la relación Production → Lot.

Permitido:
Cambios directamente necesarios para esa relación.

No permitido:
Refactorizar otras relaciones aunque se encuentren durante el trabajo.
```

Encontrar una mejora potencial no autoriza automáticamente a implementarla.

---

# 50. HALLAZGOS FUERA DE ALCANCE

Si Antigravity encuentra un problema que no pertenece a la tarea:

```text
No corregirlo.

Si es relevante:
registrarlo como hallazgo fuera de alcance.

Continuar con la tarea original.
```

Esto evita que el agente convierta una tarea localizada en una auditoría general.

---

# 51. ACUMULACIÓN CONTROLADA DE HALLAZGOS

Los hallazgos fuera de alcance no deben generar inmediatamente nuevos prompts.

Pueden acumularse en un artefacto específico:

```text
Backlog de hallazgos
```

Posteriormente se decide cuáles justifican una tarea.

Principio:

> **Detectar un problema no significa que deba resolverse inmediatamente.**

---

# 52. CRITERIO PARA CREAR UNA NUEVA TAREA

Crear una nueva tarea únicamente cuando exista:

```text
PROBLEMA IDENTIFICADO
+
ALCANCE DEFINIBLE
+
RESULTADO ESPERADO
```

Si falta alguno de los tres, primero documentar o decidir.

---

# 53. PRESUPUESTO DE EXPLORACIÓN

Cuando una tarea requiera exploración, limitarla conceptualmente.

Ejemplo:

```text
Explora únicamente las dependencias directamente relacionadas
con `Production`.

No realices una exploración general del repositorio.
```

La exploración debe estar justificada por el objetivo.

Principio:

> **Toda exploración debe tener una razón relacionada con el resultado solicitado.**

---

# 54. ESCALAMIENTO CONTROLADO

Si una tarea inicialmente pequeña revela una dependencia mayor:

```text
Tarea original
     ↓
Dependencia mayor detectada
     ↓
DETENER
     ↓
Documentar bloqueo
     ↓
Evaluar nueva tarea
```

No ampliar automáticamente el alcance.

---

# 55. REGLA DE NO APROVECHAMIENTO

No utilizar una tarea como oportunidad para realizar mejoras adicionales.

Evitar:

```text
Ya que estamos aquí, también:
- refactorizar;
- renombrar;
- reorganizar;
- optimizar;
- actualizar documentación no relacionada.
```

Principio:

> **Una tarea no es una oportunidad para limpiar todo lo que aparezca durante el recorrido.**

---

# 56. MATRIZ DE DECISIÓN PARA DISEÑAR EL PROMPT

Antes de redactar el prompt:

```text
¿Existe conocimiento previo?
│
├── SÍ → reutilizarlo.
│
└── NO → determinar si hace falta investigar.

¿La tarea requiere agente?
│
├── NO → no crear prompt de Antigravity.
│
└── SÍ → continuar.

¿Existe una decisión pendiente?
│
├── SÍ → no implementar.
│
└── NO → continuar.

¿Existe una precondición?
│
├── NO → continuar.
│
└── SÍ → declararla.

¿El resultado tiene un criterio de cierre?
│
├── NO → definirlo.
│
└── SÍ → continuar.

¿La tarea tiene alcance definido?
│
├── NO → definirlo.
│
└── SÍ → redactar prompt.
```

---

# 57. MATRIZ DE DECISIÓN DESPUÉS DEL RESULTADO

Después de recibir la respuesta de Antigravity:

```text
¿Cumple el objetivo?
│
├── SÍ
│    ↓
│  ¿Requiere aceptación humana?
│    │
│    ├── SÍ → esperar aceptación.
│    └── NO → cerrar.
│
└── NO
     ↓
   ¿Es un error?
     │
     ├── SÍ → prompt de corrección.
     │
     └── NO
          ↓
        ¿Falta información?
          │
          ├── SÍ → resolver dependencia.
          │
          └── NO → analizar por qué el resultado
                    no cumplió antes de crear otro prompt.
```

Nunca asumir que la respuesta correcta ante un resultado insatisfactorio es:

> “Hazlo otra vez.”

---

# 58. REGLA FINAL DE ECONOMÍA

La cuota debe optimizarse en este orden:

```text
1. Evitar tareas innecesarias.
2. Evitar exploración innecesaria.
3. Reutilizar resultados existentes.
4. Limitar el contexto.
5. Limitar el alcance.
6. Limitar la autonomía.
7. Limitar la salida.
8. Evitar verificaciones duplicadas.
9. Evitar ciclos de revisión.
```

Reducir palabras del prompt es secundario.

El mayor ahorro proviene de **evitar trabajo innecesario**.

---

# 59. PRINCIPIO OPERATIVO FINAL

El objetivo del sistema de prompts no es producir una cadena interminable de instrucciones.

Debe producir una cadena finita de unidades de trabajo:

```text
┌──────────────────────┐
│ NECESIDAD             │
└──────────┬───────────┘
           ↓
   ¿Necesita agente?
           ↓
┌──────────────────────┐
│ PROMPT CONTROLADO     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ RESULTADO             │
└──────────┬───────────┘
           ↓
      CLASIFICAR
           ↓
 ┌─────────┼──────────┐
 ↓         ↓          ↓
CERRAR   DECIDIR   CORREGIR
           │          │
           └────┬─────┘
                ↓
          NUEVA TAREA
          SOLO SI ES
            NECESARIA
```

La regla final es:

> **No crear el siguiente prompt porque Antigravity terminó el anterior. Crear el siguiente prompt únicamente porque existe una nueva acción necesaria.**
