# CARGA DE IMAGEN LOCAL, PRESETS VECTORIALES Y ROTACIÓN VISUAL EN SCADA

## REGLAS DE CUOTA Y ARQUITECTURA:
1. MODO BISTURÍ: Modifica exclusivamente los archivos indicados.
2. CERO TAILWIND: Emplea CSS Modules (`.module.css`).
3. CERO IMÁGENES ROTAS: Los presets deben definirse como SVGs vectoriales inline (Data URI en base64 o SVG puro) dentro de `presetImages.js` para garantizar que nunca den error 404.
4. POKA-YOKE DE ALMACENAMIENTO: Permitir subir imágenes locales desde el computador. Para evitar fallas de rutas en Windows o dependencias pesadas de storage, comprime la imagen seleccionada en el cliente con HTML5 Canvas a WebP/JPEG (resolución 400x400 px, < 40 KB) y guárdala directamente en el campo `imagenUrl` del modelo.

---

### 1. CORRECCIÓN DE PRESETS VECTORIALES (`apps/web/src/lib/presetImages.js`)
Reemplaza las rutas de archivo rotas por SVGs vectoriales estilizados de MANNÁ (fondo lino `#FBF9F5`, trazos ámbar/verde bosque):
- `PRESET_VASO_3_5`: Data URI SVG de vaso con tapa escolar.
- `PRESET_BOTELLA_1L`: Data URI SVG de botella lechera tradicional 1 Litro.
- `PRESET_VASO_500G`: Data URI SVG de tarro/copa de yogur griego.
- `PRESET_FRASCO`: Data URI SVG de frasco artesanal con etiqueta.
- Exporta `resolveProductImage(producto)`:
  * Si `producto?.imagenUrl` existe, retorna esa URL/Base64.
  * Si no, asigna automáticamente el preset correspondiente según el nombre o la presentación seleccionada.

---

### 2. CARGA DE IMAGEN LOCAL EN MODAL DE PRODUCTOS (`apps/web/src/app/catalog/products/`):
En el formulario modal de Crear / Editar Producto:
1. **Selector de Presets:**
   - Renderiza las 4 miniaturas clicables usando los SVGs vectoriales.
   - Al hacer clic en un preset, se previsualiza en la caja de vista previa y asigna el valor.
2. **Carga desde el Computador (`<input type="file" accept="image/*">`):**
   - Agrega un botón táctil vintage: `[ 📁 Subir Imagen desde el Equipo ]`.
   - Al seleccionar un archivo:
     * Lanza lectura inmediata con `FileReader`.
     * Dibuja y comprime la imagen en un Canvas oculto de 400x400 px en formato `image/webp` con calidad 0.8.
     * Actualiza el estado `imagenUrl` con el DataURL resultante y muestra la previsualización inmediata.
3. **Previsualizador en Vivo:**
   - Muestra un recuadro de 70x70 px con marco lino/ámbar que exhibe la imagen seleccionada o el preset activo.

---

### 3. COLUMNA DE IMAGEN EN LA TABLA DE CATÁLOGO (`apps/web/src/app/catalog/products/page.jsx`):
- Agrega la columna "Imagen" como primera columna de la tabla de productos.
- Renderiza una miniatura de 40x40 px con bordes redondeados (`8px`), fondo pergamino y `object-fit: cover` usando `resolveProductImage(producto)`.

---

### 4. ROTACIÓN VISUAL EN EL DASHBOARD SCADA (`apps/web/src/app/dashboard/`):
- En la barra o tarjeta de "Telemetría de Cava" y en el monitor superior:
  * Vincula la miniatura al producto que se encuentra activo en la rotación (Modo AFK de 8 segundos).
  * Al rotar de producto, la imagen debe cambiar sincronizadamente junto a los diales de stock, costo y tacómetro análogo, aplicando una transición suave de opacidad (fade-in).
  * Si el producto no tiene foto personalizada cargada, debe proyectar su preset vectorial asignado por defecto (cero espacios vacíos).

---

### VALIDACIÓN:
1. Abre el modal de producto y confirma que los 4 iconos de presets se vean nítidos y sin íconos rotos.
2. Sube una foto de prueba desde tu computador y confirma que se previsualice y guarde correctamente.
3. En la tabla de `/catalog/products`, verifica que aparezca la miniatura de cada producto.
4. En `/dashboard`, verifica que la imagen del producto rote cada 8 segundos en sincronía con la telemetría.