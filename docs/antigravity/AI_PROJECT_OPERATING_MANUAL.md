

# AI PROJECT OPERATING MANUAL

**Proyecto:** Yogurt ERP / Yogurt Management System

**Archivo:** `AI_PROJECT_OPERATING_MANUAL.md`

**Propósito:** Manual operativo permanente para cualquier agente de IA que trabaje dentro del proyecto.

**Función:** Primera capa de control de comportamiento, arquitectura, contexto, autonomía y consumo de cuota.

---

## 00. PRINCIPIO FUNDAMENTAL Y NATURALEZA DEL MANUAL

Este documento establece las reglas permanentes de comportamiento técnico y operativo que rigen a cualquier agente de IA en este repositorio.

* **Prioridad Absoluta:**

$$\text{INTEGRIDAD DEL SISTEMA} > \text{CUMPLIMIENTO DE LA TAREA} > \text{CALIDAD DE IMPLEMENTACIÓN} > \text{MEJORAS FUTURAS}$$


* **Mandato Rector:**
> **Hacer exactamente lo necesario para completar correctamente la tarea asignada. Ni menos (evitar código roto o cabos sueltos), ni más (cero trabajo especulativo o refactorizaciones no solicitadas).**


* Conocer más del proyecto o descubrir código mejorable **NO** constituye autorización para modificarlo.

---

## 01. IDENTIDAD Y ARQUITECTURA TÉCNICA DEL PROYECTO

El proyecto es **Yogurt ERP**, un sistema integral de producción, inventario y comercialización de productos lácteos estructurado como un monorepo moderno:

* **Frontend (`apps/web/`):** Next.js (App Router, ejecución sobre Turbopack), React nativo, CSS Modules y Context API.
* **Backend (`apps/api/`):** Node.js, Express, arquitectura por capas (Controller $\rightarrow$ Service $\rightarrow$ Repository).
* **Persistencia (`apps/api/prisma/`):** Prisma ORM sobre base de datos PostgreSQL.
* **Lenguaje:** **JavaScript nativo estricto (`.js`, `.jsx`). Está terminantemente prohibido introducir o compilar TypeScript (`.ts`, `.tsx`).**

---

## 02. JERARQUÍA DE AUTORIDAD

Toda instrucción debe interpretarse respetando estrictamente los siguientes niveles:

```text
NIVEL 0: Entorno de ejecución y restricciones de sistema
   ↓
NIVEL 1: AI_PROJECT_OPERATING_MANUAL.md (Este manual)
   ↓
NIVEL 2: Fuente de verdad funcional (schema.prisma, endpoints activos y código vigente)
   ↓
NIVEL 3: Especificaciones de arquitectura (Plan Maestro / Documentación ratificada)
   ↓
NIVEL 4: Prompt de la tarea actual

```

* Las instrucciones de niveles inferiores **nunca** pueden invalidar una regla superior.
* Ante discrepancias irresolubles, no improvisar: informar el bloqueo y detenerse.

---

## 03. REGLAS TÉCNICAS Y ENTORNO DE EJECUCIÓN (STRICT)

1. **Comandos de Persistencia:**
* Usa EXCLUSIVAMENTE `pnpm --filter api exec ...` para interactuar con Prisma. **NUNCA uses `npx**`.
* Prohibido ejecutar `prisma migrate` en entornos activos sin autorización. Para sincronizar modelos usa únicamente:
```bash
pnpm --filter api exec prisma db push
pnpm --filter api exec prisma generate

```


* **Aviso Obligatorio de Migración:** Cada vez que se agregue o modifique un modelo en `schema.prisma`, DEBES alertar explícitamente al usuario al finalizar para que ejecute los comandos de sincronización de base de datos.


2. **Modo Rápido de Validación (Sin Builds Pesados):**
* **PROHIBIDO ejecutar `pnpm build` o purgar la caché (`.next`) para comprobaciones rápidas.**
* Toda validación estática ligera debe realizarse mediante `node --check` sobre los archivos modificados.


3. **Backend y Alcance:**
* No modificar `apps/api/src/` salvo que la tarea lo requiera explícitamente para completar el flujo funcional.
* Prohibido crear entidades o endpoints ajenos a la fase asignada.


4. **Manejo Centralizado de Iconos:**
* Reutilizar primero los iconos de `lucide-react` o los exportados en `@/components/ui/icons`.
* Si no existe un icono representativo, créalo como componente SVG accesible y agrégalo directamente a `@/components/ui/icons`.
* **NUNCA incrustes SVGs en línea dentro de páginas o subcomponentes.**


5. **Path Aliases y Rutas Canónicas:**
* Usa SIEMPRE alias canónicos (`@/*`) para enlazar componentes, hooks, contextos y utilidades (`@/components/...`, `@/lib/api-client`, `@/context/...`).
* **PROHIBIDAS las rutas relativas profundas (`../../../../`).**
* Las únicas rutas relativas permitidas (`./` o `../`) son las estrictamente co-locadas en el mismo submódulo.
* **Migración Oportunista Acotada:** Si el archivo que estás editando contiene rutas relativas profundas, normalízalas a `@/*`. No saltes a limpiar archivos ajenos a la tarea.


6. **Arquitectura Modular Frontend (Patrón de 3 Capas):**
Toda pantalla funcional en `apps/web/src/app` debe descomponerse en:
* **`page.jsx` (Orquestador Visual):** Exclusivamente layout declarativo ($< 100\text{--}120$ líneas). Sin sentencias `fetch`, sin cálculos pesados ni acumulación de estados.
* **`hooks/`:** Custom Hooks co-locados para llamadas a la API, lógica de negocio y estados complejos del formulario.
* **`components/`:** Componentes atómicos declarativos ("dumb components") que reciben datos y manejadores únicamente vía props.


7. **Estándar JSDoc y Trazabilidad:**
Todo archivo creado o refactorizado debe abrir obligatoriamente con la cabecera:
```javascript
/**
 * @file [NombreDelArchivo.jsx]
 * @module [Modulo/Submodulo]
 * @description [Propósito puntual]
 * @responsibility [Qué hace y qué NO debe hacer]
 * @usedBy [Rutas exactas de los archivos que lo consumen]
 * @dependencies [Librerías, hooks, cliente API o iconos requeridos]
 */

```


Comenta minuciosamente cálculos de negocio, condiciones de guarda y efectos (`useEffect`).
8. **Estilos y Scripts:**
* Uso exclusivo de **CSS Modules (`.module.css`)**. Prohibido renombrar clases arbitrariamente.
* Al manipular código vía scripts, **NUNCA escapes comillas invertidas (`) ni interpolaciones (${})** en template literals para evitar errores sintácticos de parseo.


9. **Red y API:**
* Toda petición HTTP en frontend debe usar la instancia centralizada `@/lib/api-client` (o `@/lib/api`) resolviendo contra `/api/v1/...`.



---

## 04. REGLAS DE INGENIERÍA, INTEGRIDAD Y MODELADO

10. **Fuente de Verdad Operativa:**
* El código y la base de datos actuales constituyen la fuente de verdad. No asumas que una funcionalidad existe porque figure en planes o notas históricas.
* Si la documentación antigua contradice al código funcional, **prevalece el código funcional**.


11. **Validación Real (No Confundir Build con Funcionalidad):**
* Que un archivo compile o pase `node --check` **NO** significa que la funcionalidad opere.
* La validación debe contemplar: sintaxis, integración frontend $\leftrightarrow$ API $\leftrightarrow$ DB, y flujo de negocio.
* Prohibido reportar "OK" o "LISTO" si solo verificaste compilación estática. Si algo no se probó, repórtalo como `NO VERIFICADO`.


12. **Integridad y Datos de Prueba:**
* Los seeds deben ser estrictamente **idempotentes**; prohibido generar datos duplicados por reinicios.
* NUNCA inventes UUIDs o IDs arbitrarios en el frontend para forzar que la UI renderice. Usa los identificadores reales de la base de datos.


13. **Relaciones entre Entidades (UI Humana):**
* Ningún usuario debe tipear manualmente un UUID. Para relaciones foráneas (ej. Producto $\rightarrow$ Receta), utiliza autocompletados o selectores.
* Muestra siempre datos legibles por humanos (ej. `Yogurt Fresa 1L`), nunca hashes técnicos.


14. **Análisis de Impacto Transversal:**
* Antes de alterar una tabla, endpoint o contrato, identifica sus consumidores en compras, producción, recetas, ventas e inventario.
* No dejes dependencias rotas en módulos que consumían la versión previa.


15. **Validación de Flujos de Negocio Completos:**
* Un cambio no está listo si funciona aislado pero rompe el circuito:

$$\text{Compra} \rightarrow \text{Inventario}$$


$$\text{Receta} \rightarrow \text{Producción} \rightarrow \text{Inventario} \rightarrow \text{Lote}$$


$$\text{Venta} \rightarrow \text{Inventario/Lote} \rightarrow \text{Cobro}$$





---

## 05. EXPERIENCIA DE USUARIO (UX) Y REGLAS FUNCIONALES

16. **Estados Obligatorios de Interfaz:**
Toda pantalla debe prever:
* Estado de carga (skeletons / spinners).
* Estado vacío explicativo.
* Estado con datos.
* Estado de error comprensible.
* Confirmación modal para acciones destructivas.
* Feedback interactivo (Toasts) y prevención de doble envío (`disabled` en botones durante peticiones).


17. **Formularios Complejos:**
* Las relaciones 1:N o N:N deben gestionarse dinámicamente (agregar, editar, eliminar ítems en línea con validación antes de persistir).
* Organiza estructuras complejas en secciones o etapas visuales coherentes.


18. **Cálculos Centralizados (Costos e Inventario):**
* Todo cálculo de rendimientos, mermas, stock o costos debe contar con una única función fuente. Prohibido duplicar fórmulas matemáticas con discrepancias entre pantallas.


19. **Prohibición de Hardcodeo:**
* Precios, nombres de insumos, proveedores o catálogos jamás deben quedar fijos en código frontend. Deben provenir siempre de la API.



---

## 06. CONTROL DE ALCANCE, CUOTA Y EFICIENCIA OPERATIVA

20. **Diagnóstico antes de Corregir:**
* Identifica primero componente, capa y causa raíz. Prohibidas las soluciones cosméticas que silencien errores ocultando el fallo.
* Prohibido relajar reglas de linters o TypeScript para forzar un pase en verde.


21. **Control de Alcance V1 vs V2/V3:**
* Resuelve estrictamente las necesidades de V1. Capacidades como multi-tenancy, analítica predictiva o auditoría avanzada quedan para versiones futuras; documéntalas como notas sin codificarlas.


22. **Preservación del Trabajo Existente:**
* Modificaciones incrementales y localizadas. Prohibido reescribir módulos enteros que ya funcionan bajo el pretexto de que no se comprende el código previo.


23. **Control Estricto de Alcance y Consumo de Contexto:**
* Trabaja únicamente sobre el objetivo explícito del prompt.
* Prioridad de lectura: Prompt actual $\rightarrow$ Archivos directamente afectados $\rightarrow$ Dependencias inmediatas.
* **Prohibido realizar búsquedas globales ciegas o auditorías de todo el repositorio.**


24. **Contexto Mínimo Suficiente (No Trabajar a Ciegas):**
* Reducir lectura no autoriza a asumir contratos. Conoce qué hace el archivo, qué API consume y quién depende de él antes de guardar cambios.


25. **Regla de "No Mejorar por Mejorar":**
* No modifiques código funcional únicamente por preferencia de redacción o estilo personal. Si encuentras una mejora ajena a la tarea, regístrala como `OBSERVACIÓN FUERA DE ALCANCE` y no la implementes.



---

## 07. CRITERIO DE CIERRE Y DETENCIÓN INMEDIATA

Una tarea se considera finalizada cuando se cumplen estrictamente estas 5 condiciones:

1. El objetivo funcional exacto del prompt fue implementado.
2. No quedan errores de sintaxis o ejecución introducidos por la tarea (`node --check` limpio).
3. Las dependencias directas modificadas continúan siendo compatibles.
4. Se ejecutaron las validaciones proporcionales requeridas.
5. Se redactó el reporte técnico final con trazabilidad clara (`VERIFICADO`, `NO VERIFICADO`, `BLOQUEADO`).

> **Al cumplirse estas condiciones, la IA DEBE DETENERSE INMEDIATAMENTE. Queda terminantemente prohibido continuar explorando, refactorizando o ejecutando tareas no solicitadas.**


---
PRINCIPIO FINAL
El comportamiento esperado de cualquier agente dentro del proyecto puede resumirse así:
> **Conoce lo necesario.**
>
> **Consulta primero lo que el proyecto ya sabe.**
>
> **No redescubras sin necesidad.**
>
> **No confundas conocimiento con autorización.**
>
> **No inventes lo que falta.**
>
> **No resuelvas decisiones que no te corresponden.**
>
> **No amplíes el alcance por iniciativa propia.**
>
> **Modifica únicamente lo necesario.**
>
> **Verifica el resultado.**
>
> **Documenta el conocimiento que deba permanecer.**
>
> **Y cuando termines, DETENTE.**


