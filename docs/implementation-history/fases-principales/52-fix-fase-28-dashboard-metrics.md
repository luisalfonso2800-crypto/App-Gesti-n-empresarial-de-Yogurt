# FASE 28 — DIAGNÓSTICO DASHBOARD V1

## Objetivo

Investigar exclusivamente por qué el Dashboard del frontend muestra todas sus métricas en `0` mientras los demás módulos de la aplicación sí muestran correctamente los datos existentes en PostgreSQL.

Esta fase es de DIAGNÓSTICO Y CORRECCIÓN PUNTUAL.

No realizar una auditoría general del proyecto.

No refactorizar módulos que ya funcionan.

No modificar Prisma, modelos de base de datos, seed de datos ni lógica de negocio existente salvo que exista evidencia directa de que el Dashboard depende incorrectamente de ellos.

---

## REGLAS OBLIGATORIAS

1. El proyecto frontend utiliza exclusivamente JavaScript.
2. NO introducir TypeScript.
3. NO crear archivos `.ts` ni `.tsx`.
4. Mantener React/Next.js y la arquitectura frontend existente.
5. Mantener CSS Modules.
6. NO introducir Tailwind.
7. NO instalar dependencias nuevas.
8. NO actualizar versiones de Next.js, React, Prisma, ESLint ni otras dependencias.
9. NO modificar el lockfile salvo que sea estrictamente inevitable; en principio esta tarea NO requiere modificaciones de dependencias.
10. NO modificar módulos que actualmente funcionan correctamente.
11. NO cambiar la estructura de PostgreSQL.
12. NO modificar el seed.
13. NO eliminar datos existentes.
14. No asumir que la base de datos está vacía.
15. No reemplazar los datos reales por valores simulados.
16. No implementar métricas falsas o hardcodeadas.
17. Antes de modificar código, identificar exactamente dónde se pierde la información.

---

# 1. LEER DOCUMENTACIÓN

Leer primero:

`docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md`

Después revisar únicamente la documentación necesaria relacionada con:

* arquitectura frontend
* API Client
* Dashboard
* integración frontend/backend
* convenciones JavaScript
* CSS Modules

No realizar una lectura indiscriminada de todo el proyecto.

---

# 2. REVISAR EL DASHBOARD ACTUAL

Inspeccionar:

`apps/web/src/app/page.jsx`

y su CSS asociado:

`apps/web/src/app/page.module.css`

Determinar:

* qué métricas muestra;
* qué endpoints intenta consultar;
* cómo utiliza `api-client.js`;
* cómo transforma la respuesta del backend;
* qué valores utiliza como fallback;
* dónde se asigna `0`;
* si está esperando una estructura de respuesta diferente a la que realmente devuelve la API;
* si existe algún error silencioso;
* si las peticiones se ejecutan realmente.

No corregir todavía.

---

# 3. REVISAR EL API CLIENT

Inspeccionar:

`apps/web/src/lib/api-client.js`

Determinar:

* URL base utilizada;
* método de petición;
* manejo de errores;
* parsing de respuestas;
* formato real que entrega al Dashboard;
* si existe alguna diferencia entre el API Client utilizado por el Dashboard y el utilizado por los módulos que sí funcionan.

Comparar únicamente contra uno o dos módulos funcionales que actualmente muestran datos correctamente.

Por ejemplo:

* Presentations
* Products
* Inventory
* Clients
* Sales

Elegir los módulos necesarios para establecer cómo se consume correctamente la API.

---

# 4. REVISAR LOS ENDPOINTS DEL BACKEND

Localizar los endpoints que podrían proporcionar información para las métricas del Dashboard.

Revisar únicamente lo necesario:

* Controller
* Service
* Repository

No modificar nada todavía.

Determinar si actualmente existen endpoints apropiados para obtener:

* cantidad de presentaciones;
* cantidad de productos;
* inventario;
* producción;
* lotes;
* clientes;
* ventas;
* pagos;
* gastos;

o cualquier otra métrica que actualmente muestre el Dashboard.

---

# 5. DETERMINAR LA CAUSA

Clasificar el problema en una de estas categorías:

### A. Dashboard no realiza las peticiones

Ejemplo:

El componente se renderiza, pero nunca ejecuta la consulta.

### B. Endpoint incorrecto

El Dashboard solicita una ruta que no existe o que no corresponde al backend actual.

### C. Respuesta interpretada incorrectamente

El backend devuelve datos válidos, pero el Dashboard espera otra estructura.

Ejemplo conceptual:

Backend:

```json
{
  "data": [...],
  "meta": {
    "total": 25
  }
}
```

Dashboard espera:

```javascript
response.length
```

y termina mostrando `0`.

### D. API Client transforma incorrectamente la respuesta

La información llega al frontend pero se pierde durante el procesamiento.

### E. Endpoint no existente para una métrica

El Dashboard necesita información agregada que el backend todavía no proporciona.

### F. Error silencioso

La petición falla y el Dashboard utiliza `0` como fallback.

### G. Otra causa

Documentarla claramente.

---

# 6. REGLA CRÍTICA

NO aceptar como explicación:

> "La base de datos está vacía."

La base de datos YA FUE POBLADA mediante:

`pnpm --filter api run db:seed:test`

y los módulos del frontend están mostrando esos datos correctamente.

Por lo tanto, debe comprobarse primero la cadena:

`PostgreSQL → Backend → Endpoint → API Client → Dashboard`

---

# 7. PRUEBA COMPARATIVA

Utilizar al menos un módulo que funciona correctamente como referencia.

Determinar:

```text
Módulo funcional
↓
Endpoint utilizado
↓
Respuesta real
↓
API Client
↓
Renderizado
```

y comparar contra:

```text
Dashboard
↓
Endpoint utilizado
↓
Respuesta real
↓
API Client
↓
Renderizado
```

Identificar exactamente en qué punto divergen.

---

# 8. CORRECCIÓN

Una vez identificada la causa, realizar únicamente la modificación mínima necesaria.

Prioridades:

1. Corregir la fuente de datos.
2. Corregir el endpoint si está mal.
3. Corregir el procesamiento de la respuesta.
4. Corregir el fallback solamente si está ocultando errores reales.
5. Mantener el diseño actual del Dashboard.
6. Mantener JavaScript.
7. Mantener CSS Modules.

NO aprovechar esta tarea para rediseñar el Dashboard.

NO agregar nuevas funcionalidades.

---

# 9. VALIDACIÓN

Después de la corrección:

### Backend

Comprobar que continúa levantando correctamente.

### Frontend

Ejecutar:

```bash
pnpm --filter web build
```

Debe finalizar correctamente.

### Integración

Comprobar que:

* Dashboard muestra valores diferentes de cero cuando corresponde;
* Presentations continúa funcionando;
* Products continúa funcionando;
* Recipes continúa funcionando;
* Purchases continúa funcionando;
* Inventory continúa funcionando;
* Production continúa funcionando;
* Lots continúa funcionando;
* Clients continúa funcionando;
* Sales continúa funcionando;
* Payments continúa funcionando;
* Expenses continúa funcionando.

No realizar pruebas destructivas.

No borrar la base de datos.

No volver a ejecutar el seed si no es necesario.

---

# 10. NO INSTALAR NADA

Esta tarea NO autoriza:

* `pnpm add`
* `pnpm install`
* actualización de paquetes;
* actualización de Next.js;
* actualización de React;
* actualización de Prisma;
* modificación de ESLint;
* modificación del lockfile.

Si se determina que una dependencia externa es realmente indispensable, DETENERSE y reportarlo antes de instalarla.

---

# 11. REPORTE FINAL OBLIGATORIO

Entregar exactamente:

## FASE 28 — CIERRE

* Estado: COMPLETADA / BLOQUEADA
* Causa encontrada:
* Dashboard antes:
* Dashboard después:
* Endpoint(s) revisados:
* Problema localizado en:
* Corrección aplicada:
* JavaScript: OK / ERROR
* TypeScript introducido: NO
* CSS Modules: OK / ERROR
* Backend modificado: SÍ / NO
* Base de datos modificada: SÍ / NO
* Seed modificado: SÍ / NO
* Dependencias nuevas: NINGUNA / LISTAR
* Lockfile modificado: NO / SÍ
* Build: OK / ERROR
* Regresión de módulos: OK / ERROR
* Archivos modificados:
* Archivos creados:
* Archivos eliminados:
* Bloqueos:
* Problemas pendientes:
* Siguiente paso:

## REGLA FINAL

No declarar la Fase 28 como completada solamente porque el build pasa.

La condición principal de éxito es:

**Los datos existentes en PostgreSQL deben llegar correctamente al Dashboard y sus métricas deben reflejar los datos reales de la aplicación.**
