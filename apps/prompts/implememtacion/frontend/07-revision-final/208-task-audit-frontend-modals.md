OBJETIVO: Auditoría de SOLO LECTURA en `apps/web/src/`. Prohibido crear, modificar archivos o inspeccionar `apps/api/`.

TAREAS:
1. Localizar todos los modales, diálogos y formularios emergentes (`*Modal*.jsx` o similares en `@/components/` y subcarpetas de rutas `app/**/`).
2. Auditar cada modal frente a las reglas de AGENTS.md (Bloque VI):
   - Origen de estilos (`SmartModal`, `.module.css` o inline/propios).
   - Campos requeridos y opcionales.
   - Mayúsculas automáticas (`UPPERCASE`).
   - Inputs numéricos limpios (sin `0` fijo inicial, con `placeholder="0"`).
   - Máscaras activas (teléfono `XXX XXX XXXX`, NIT, moneda).
   - Uso de `montoATextoPesos`.
   - Cápsula resumen Poka-Yoke en lenguaje natural.
   - Captura de error dinámico de backend en bloque `catch` (sin mensajes genéricos).
   - Botón de guardado bloqueado (`disabled`, `opacity: 0.5`) si el formulario es inválido.

SALIDA REQUERIDA (únicamente este reporte):
### 1. Inventario Consolidado de Modales
| Archivo / Componente | Ruta | Origen de Estilos | Campos Clave | Cumplimiento AGENTS.md |
| :--- | :--- | :--- | :--- | :--- |

### 2. Modales Nuevos Detectados
(Listar modales fuera del grupo conocido: SupplierModal, SupplyModal, SupplierPriceModal, ProductModal, PresentationModal, SaleModal, ConfirmActionModal).

### 3. Diagnóstico de Discrepancias Globales
(Lista resumida de modales que carecen de: mayúsculas, máscaras, Poka-Yoke o banner de error backend).