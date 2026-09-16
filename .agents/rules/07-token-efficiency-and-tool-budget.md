# Regla 07: Presupuesto de Herramientas y Eficiencia de Tokens (Anti-Exploración Redundante)

## Objetivo
Evitar el agotamiento prematuro de la cuota de contexto y tokens limitando lecturas redundantes, búsquedas difusas no acotadas e iteraciones innecesarias sobre los mismos archivos.

## 1. Prohibición de Relecturas Redundantes (Cache Mental)
- **Máximo 1 lectura por archivo:** Queda estrictamente prohibido ejecutar `Read` sobre el mismo archivo más de una (1) vez durante una misma tarea.
- Si necesitas editar un archivo que ya leíste, usa la memoria en contexto; no vuelvas a inspeccionarlo antes o después de usar `Edit`.
- No verifiques el archivo inmediatamente volviéndolo a leer tras una edición. Confía en la salida del comando de sintaxis (`node --check`) o scripts de validación (`verify-srp.js`).

## 2. Restricción de Búsquedas Globales (Search / Grep)
- **Prohibido el barrido ciego:** No ejecutes `Search` o `Grep` sobre todo el proyecto o directorios raíz (`apps/web`, `src/`, etc.) si la ruta del archivo ya es conocida o deducible.
- Solo se permite `Search` si la ubicación de un componente es desconocida, acotando el path al subdirectorio más profundo posible (ejemplo: `apps/web/src/components/shell/`).
- No concatenes más de dos (2) operaciones de búsqueda sin antes ejecutar una acción concreta o solicitar aclaración.

## 3. Presupuesto Máximo de Herramientas (Tool Budget)
- **Límite de inspección:** Para cualquier tarea puntual de frontend o CSS, el agente no debe superar un presupuesto de **4 a 6 llamadas de lectura/búsqueda** antes de aplicar los cambios con `Edit`.
- Si el agente supera 6 operaciones continuas de sola lectura sin haber editado o ejecutado un comando resolutivo, debe detenerse y aplicar la solución con los datos recopilados hasta ese punto.

## 4. Ejecución Directa y Quirúrgica
- En tareas de ajuste de estilos (CSS) o composición de layout, focaliza la lectura únicamente en:
  1. El componente JSX objetivo.
  2. Su archivo CSS Module directo.
- No leas archivos auxiliares (`layout.jsx`, `Shell.jsx`, `Header.jsx`) a menos que el prompt los mencione explícitamente como fuentes de verdad a modificar.

## 5. Cierre Inmediato
- En cuanto se aplique el `Edit` y se confirme con `node .agents/scripts/verify-srp.js`, el agente debe generar el reporte y DETENERSE inmediatamente sin inspecciones adicionales.
