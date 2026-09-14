# 03. ARQUITECTURA FRONTEND Y CALIDAD DE CÓDIGO (FRONTEND ARCHITECTURE)

> **NOTA:** Este módulo define la arquitectura en 3 capas de Next.js App Router, convenciones de modularización, Single Responsibility Principle (SRP), límites de líneas, convenciones de iconos, imports y trazabilidad JSDoc.

---

## 1. ARQUITECTURA Y MODULARIZACIÓN

### 4. MANEJO DE ICONOS (FRONTEND)
- **Reutilización Canónica:** Reutilizar exclusivamente iconos provenientes de `lucide-react` o aquellos debidamente exportados en `@/components/ui/icons`.
- **Verificación Previa:** Prohibido importar iconos a ciegas sin verificar previamente su existencia en los exports del paquete o archivo UI correspondiente.
- **Veto a SVGs Inline:** Prohibido insertar etiquetas `<svg>` inline directamente en vistas, páginas o componentes de dominio; siempre deben abstraerse en componentes de iconos reutilizables.

### 5. SISTEMA DE RUTAS, PATH ALIASES Y NORMALIZACIÓN
- **Uso Obligatorio de Alias Canónicos (`@/*`):** Todas las importaciones entre capas, módulos y librerías internas deben realizarse utilizando el alias canónico `@/*`.
- **Prohibición de Rutas Relativas Profundas:** Prohibido el uso de rutas relativas de salto profundo (e.g., `../../../../`). Solo se admiten rutas relativas locales (`./` o `../`) si se encuentran estrictamente dentro de la misma carpeta de submódulo o componente co-locado.
- **Boy Scout Rule Acotada:** Al intervenir cualquier archivo existente, normalizar oportunamente las rutas relativas profundas hacia `@/*`.

### 6. ARQUITECTURA MODULAR (PATRÓN DE 3 CAPAS CO-LOCADAS)
La estructura de cada vista o pantalla en Next.js App Router debe respetar estrictamente la división de 3 capas:
1. **`page.jsx` (Orquestador Visual):**
   - Responsabilidad exclusiva de layout declarativo y composición de componentes (< 120 líneas).
   - Prohibido realizar llamadas de red directas (`fetch`/API), orquestar lógica de negocio compleja o ejecutar cálculos pesados en esta capa.
2. **`hooks/` (Lógica y Estado):**
   - Custom Hooks puros implementados en archivos JavaScript nativo (`.js`).
   - Centralizan el estado local, efectos, interacción con servicios API y transformaciones de datos.
   - **Veto a JSX en Hooks:** PROHIBIDO retornar elementos JSX o fragmentos visuales desde custom hooks (lógica pura en `.js`, presentación en `.jsx`).
3. **`components/` (Presentación Pura y Componentes Atómicos):**
   - Componentes declarativos co-locados (`.jsx`) que reciben datos y manejadores de eventos (`callbacks`) exclusivamente a través de `props`.

### 6.1. PRINCIPIO DE RESPONSABILIDAD ÚNICA (SRP)
- **Un archivo, un propósito:** Prohibido mezclar en una misma unidad de código la orquestación visual, la gestión de formularios complejos, el cómputo de reglas de negocio y el consumo de red.
- Cada subcomponente, modal, gancho o utilidad debe tener un ámbito de responsabilidad claramente delimitado y comprobable.

### 6.2. LÍMITES DUROS DE LÍNEAS EN FRONTEND
- **`page.jsx`:** Máximo **120 líneas** de código (única excepción técnica: `dashboard/page.jsx` debido al canvas SCADA interactivo).
- **Componentes (`*Modal.jsx`, tablas, tarjetas, formularios, vistas secundarias):** Máximo **150 líneas** de código.
- **Custom Hooks:** Máximo **150 líneas** de código.
- **Fragmentación Obligatoria:** Si cualquier componente o modal supera las 150 líneas, DEBE fragmentarse inmediatamente en subcomponentes co-locados bajo subcarpetas `parts/` o `modal-parts/`.

### 6.3. DIRECTIVA 'use client' Y HOMOLOGACIÓN DE EXPORTS
- **Directiva `'use client'` Mandatoria:** Colocar `'use client';` como primera línea en todo archivo que utilice hooks de React (`useState`, `useEffect`, etc.), contextos o manejadores de eventos interactivos (`onClick`, `onChange`, etc.) dentro de Next.js App Router.
- **Homologación de Exports e Imports:**
  - Todo componente visual debe exportarse como default: `export default function NombreComponente(...)`.
  - Al importar componentes, verificar cuidadosamente el tipo de export (default vs. named) para evitar el error de runtime: `React.jsx: type is invalid ... got: undefined`.

---

## 2. ESTILOS, CALIDAD Y ROBUSTEZ

### 7. COMENTARIOS EXHAUSTIVOS Y JSDOC
- **Cabecera Obligatoria de Archivo:** Todo archivo de frontend debe iniciar con su bloque JSDoc estructurado:
  ```javascript
  /**
   * @file NombreDelArchivo.jsx
   * @module ruta/del/modulo
   * @description Descripción precisa del componente o hook.
   * @responsibility Propósito único y acotado del archivo.
   * @usedBy Vistas o componentes consumidores.
   * @dependencies Lista de hooks, componentes y utilidades clave.
   */
  ```
- **Documentación Interna:** Documentar paso a paso y línea a línea funciones complejas, algoritmos de cálculo, transformaciones matemáticas y dependencias de efectos (`useEffect`).

### 8. LENGUAJE, ESTILOS Y TEMPLATES
- **JavaScript Nativo Exclusivo:** El proyecto utiliza exclusivamente JavaScript nativo (`.js`, `.jsx`). PROHIBIDO el uso de TypeScript (`.ts`, `.tsx`).
- **CSS Modules Puro:** Estilizado estricto mediante archivos CSS Modules (`.module.css`). Prohibido Tailwind o utilidades de clases en cadena no estándar.
- **Nomenclatura camelCase en CSS Modules:** Todas las clases en `.module.css` deben definirse en `camelCase` (e.g., `.statCard`, `.actionButton`, `.filterContainer`) para garantizar el acceso directo mediante propiedades (`styles.statCard`) y evitar accesos por corchetes (`styles['stat-card']`).
- **Templates Literales Limpios:** Prohibido escapar comillas invertidas (\`) o interpolaciones (\${}) en template literals generados por scripts o plantillas automatizadas.

### 8.1. PROHIBICIÓN ESTRICTA DE ESTILOS EN LÍNEA (style={{ ... }})
- **Veto Absoluto:** Prohibido el uso de `style={{ ... }}` en elementos JSX. Todo diseño, espaciado, color o ajuste debe declararse en su correspondiente archivo `.module.css`.
- **Verificación Automatizada:** Validación obligatoria ejecutando `node .agents/scripts/verify-srp.js` antes de dar por cerrada cualquier tarea de frontend.

### 16.3. REACTIVIDAD TRANSVERSAL
- **Actualización sin F5:** Asegurar la sincronización de la interfaz suscribiéndose a timestamps o variables reactivas (e.g., `lastUpdated`, eventos de mutación) en contextos compartidos.
- Las mutaciones exitosas de datos deben refrescar automáticamente las listas y métricas dependientes en tiempo real sin requerir recarga manual de página.

### 16.4. RESILIENCIA EN MONTAJES (DEFENSIVE RENDERING)
- **Manejo Seguro de Excepciones:** Bloques `try / catch / finally` obligatorios en todos los efectos asíncronos iniciales de carga de datos.
- **Fallbacks Defensivos:** Proveer siempre estados iniciales y de fallback seguros (e.g., `items: []`, `loading: false`, `error: null`) para evitar pantallas en blanco o rojas ante fallas de conectividad o respuestas nulas de la API.

### 18. CÁLCULOS, INVENTARIO Y COSTOS
- **Fuente Única de Cómputo:** Centralizar fórmulas y cálculos en utilidades compartidas o hooks dedicados; no dispersar lógica contable o matemática en componentes visuales.
- **Respeto a Unidades Técnicas:** Mantener coherencia absoluta en unidades base de inventario, mermas, formulación y equivalencias operativas del negocio.

### 19. PROHIBICIÓN DE DATOS HARCODEADOS
- **Consumo Real de API:** Todos los catálogos, registros, inventarios y métricas deben consumirse desde los endpoints reales del backend; prohibido dejar registros simulados o textos fijos provisionales en código de producción.
- **Encadenamiento Seguro (Optional Chaining):** Utilizar siempre optional chaining y valores predeterminados defensivos (e.g., `item.insumo?.nombre || 'Sin nombre'`) para proteger el renderizado contra propiedades inexistentes o nulas.
