TAREA:
Auditar cumplimiento de SRP (Reglas 6, 6.1, 6.2 y 8.1) en apps/web sin modificar código.

OBJETIVO:
Ejecutar comandos estáticos para identificar:
1. Archivos `page.jsx` con más de 120 líneas.
2. Componentes `.jsx` con más de 150 líneas.
3. Ocurrencias de `style={{` en el árbol de componentes.
4. Generar el reporte estructurado en `docs/diagnosticos/AUDITORIA_SRP_FRONTEND.md`.

REGLA DE CUOTA:
PROHIBIDO abrir y leer archivos completos con herramientas de lectura repetitiva. Utiliza exclusivamente comandos CLI de PowerShell (`Measure-Object`, `git grep`) para consolidar el reporte.

CRITERIO DE FINALIZACIÓN:
- Reporte generado en `docs/diagnosticos/AUDITORIA_SRP_FRONTEND.md` con la lista de infractores ordenada de mayor a menor tamaño.
- Código de salida 0.

DETENCIÓN:
Al generar el reporte, DETENTE.