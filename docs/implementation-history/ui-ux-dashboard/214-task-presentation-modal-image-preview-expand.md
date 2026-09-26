OBJETIVO: Rediseñar la sección "IMAGEN DEL ENVASE" en `apps/web/src/app/catalog/presentations/components/PresentationModal.jsx` para aprovechar el espacio en blanco horizontal a la derecha y agrandar significativamente la previsualización de la imagen, sin alterar el orden ni la posición de los demás campos del formulario.

ARCHIVOS A MODIFICAR:
- `apps/web/src/app/catalog/presentations/components/PresentationModal.jsx`

REGLAS DE MAQUETACIÓN:
1. Contenedor de "IMAGEN DEL ENVASE":
   - Implementar un contenedor con `display: flex`, `gap: 1rem`, `alignItems: stretch` entre "TIPO DE ENVASE" y "OBSERVACIONES".
2. Columna Izquierda (Acciones):
   - Ancho fijo/ajustado al contenido (`display: flex`, `flexDirection: column`, `justifyContent: center`, `gap: 0.5rem`).
   - Contiene el botón `[ Subir Imagen Local ]` (con input file oculto) y el botón `[ 🗑 Eliminar Imagen ]` (visible solo si hay imagen).
3. Columna Derecha (Visor Ampliado de Imagen):
   - Ocupa todo el espacio restante horizontal disponible (`flex: 1`).
   - Altura de ~140px a 160px, fondo neutro (`#F9FAFB`), borde `1px solid #E5E7EB` y esquinas redondeadas (`8px`).
   - Si `imagenUrl` tiene valor: renderizar `<img>` con `width: 100%`, `height: 100%`, `objectFit: 'contain'`.
   - Si no hay imagen: renderizar placeholder sutil en gris claro con icono o texto "Sin imagen asignada".
4. Preservar intactos:
   - Orden y lógica de los demás campos (`nombre`, `cantidadOz`, `cantidadMl`, `tipoEnvase`, `observaciones`, `activo`).
   - Bloqueo y validación de `SubmitButton`, inputs en `UPPERCASE` y cápsula Poka-Yoke.

VERIFICACIÓN:
`pnpm --filter web exec next lint --file src/app/catalog/presentations/components/PresentationModal.jsx`

SALIDA: Reporte exclusivo y conciso: líneas modificadas y confirmación del lint. Sin texto adicional.
```[cite: 1, 2]