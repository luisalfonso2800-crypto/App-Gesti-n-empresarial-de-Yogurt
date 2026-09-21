TAREA:
Auditoría técnica Fullstack integral (Backend + Frontend + Trazabilidad Transversal) del módulo de Recetas Técnicas.

OBJETIVO:
Inspeccionar en profundidad tanto la arquitectura del Backend (`apps/api`) como la interfaz del Frontend (`apps/web`) para determinar:
1. Para qué está preparado exactamente hoy el sistema de recetas.
2. Qué inconsistencias o desalineaciones existen entre el modelo de datos, la API y la UI.
3. Qué brechas técnicas y de experiencia de usuario deben corregirse para transformarlo en un sistema "a prueba de tontos" (Poka-Yoke), que impida errores de formulación, desfases de unidades, omisión de empaques o pérdidas financieras.

MODO DE TRABAJO:
Estrictamente DIAGNÓSTICO Y SOLO LECTURA. PROHIBIDO modificar código (.js, .jsx), ejecutar migraciones de Prisma o alterar la base de datos. El informe final se guardará en: `docs/diagnosticos/AUDITORIA_SISTEMA_INTEGRAL_RECETAS.md`.

FUENTES DE VERDAD A INSPECCIONAR:
- Base de datos: `apps/api/prisma/schema.prisma`
- Backend Recetas: `apps/api/src/recipes/` (controller, service, repository, DTOs)
- Backend Consumo & Stock: `apps/api/src/production/`, `apps/api/src/inventory/`, `apps/api/src/lots/`
- Frontend Recetas: `apps/web/src/app/catalog/recipes/` (page.jsx, componentes, hooks, estilos)
- Frontend Dependencias: `apps/web/src/app/catalog/products/`, `apps/web/src/lib/api-client.js`
- Directrices maestras: `AGENTS.md` (Reglas 0, 2, 7, 13.1, 13.2, 14, 37, 38)

EJES DE INVESTIGACIÓN OBLIGATORIOS:

1. AUDITORÍA DEL BACKEND (`apps/api`):
   - **Modelo de Persistencia (`schema.prisma`):**
     * ¿Cómo modela Prisma `Receta`, `EtapaReceta` y `DetalleReceta`?
     * ¿El detalle soporta tanto insumos comprados (`Insumo`) como bases semielaboradas elaboradas en planta (`Producto` WIP)? ¿Existe clave foránea opcional o discriminador de tipo?
     * ¿Se almacenan parámetros técnicos de planta (temperatura en °C, tiempo de incubación/enfriamiento en minutos/horas, agitación) o solo cantidades de insumos?
     * ¿Cómo se gestionan las versiones o la eliminación (borrado lógico `activo: Boolean` vs `onDelete: Cascade`)?
   - **Validación y DTOs (`create-recipe.dto.js`, `update-recipe.dto.js`):**
     * ¿Qué valida la API antes de persistir? ¿Admite cantidades en cero o negativas?
     * ¿Exige que las unidades coincidan con la unidad base del insumo/producto?
     * ¿Valida que una receta de producto final comercial incluya obligatoriamente un insumo de empaque (vaso/tapa/botella)?
   - **Lógica de Negocio y Transaccionalidad (`recipes.service.js`):**
     * ¿La creación de Cabecera + Etapas + BOM de Insumos corre bajo un `prisma.$transaction` atómico?
     * ¿Existe protección contra recursión cíclica (que el producto destino intente consumirse a sí mismo como ingrediente)?
     * ¿Cómo calcula el backend el costo unitario y costo por batch? ¿Es dinámico según última compra/promedio ponderado o almacena un valor estático?

2. AUDITORÍA DEL FRONTEND (`apps/web`):
   - **Manejo de Formularios y Estado:**
     * ¿Cómo administra el estado el formulario (`RecipeModal.jsx`, `IngredientsFormSection.jsx`)? ¿Hay riesgo de desincronización en arreglos de etapas e insumos?
     * ¿Qué valores vienen quemados por defecto (ej. ceros forzados en rendimiento, unidad "Litros" fija que rompe con productos comerciales envasados por unidades)?
   - **Selectores y Poka-Yoke Contextual:**
     * ¿El selector de ingredientes segrega visualmente `<optgroup>` entre Materias Primas compradas y Semielaborados WIP de planta?
     * ¿El selector bloquea automáticamente la unidad de medida según el insumo elegido para que el usuario no pueda cambiarla por error?
     * ¿Existen plantillas asistidas de 1 clic para cargar etapas de base en tanque vs. etapas de envasado?
   - **Semáforo y Proyección Financiera:**
     * ¿La interfaz compara en vivo el costo unitario calculado contra el costo máximo admisible fijado en la ficha del producto?
     * ¿Los valores monetarios siguen el estándar en moneda local sin decimales (`$ X.XXX`)?

3. MATRIZ DE IMPACTO TRANSVERSAL:
   - **Receta -> Producción:** ¿Al programar una orden de fabricación, el backend toma un snapshot JSON inmutable de la receta o lee la receta viva arriesgando históricos si alguien la edita después?
   - **Receta -> Inventario / Kardex:** ¿Cómo se gestiona la conversión de unidades al descargar ingredientes (ej. comprar sacos de 50 kg y consumir gramos)? ¿Los empaques discretos se redondean estrictamente hacia arriba (`Math.ceil`)?
   - **Receta -> Trazabilidad de Lotes:** ¿La receta marca explícitamente cuál de sus ingredientes es la base láctea para obligar en producción a seleccionar el lote del tanque padre (`idLotePadre`)?

ESTRUCTURA DEL INFORME A GENERAR (`docs/diagnosticos/AUDITORIA_SISTEMA_INTEGRAL_RECETAS.md`):
1. **RESUMEN EJECUTIVO**: Estado actual, nivel de madurez y dictamen general.
2. **CAPACIDADES REALES ACTUALES**: Para qué está preparado el sistema hoy (Backend y Frontend).
3. **BRECHAS Y VULNERABILIDADES CRÍTICAS**:
   - Puntos ciegos en Base de Datos y Backend (DTOs, transacciones, snapshots).
   - Errores de UX y puntos donde un operario puede equivocarse (Poka-Yoke ausente).
   - Riesgos de descuadre en Inventario, Producción y Costos.
4. **PLAN DE MEJORA Y BLINDAJE PASO A PASO**:
   - Fase 1: Blindaje de Backend, DTOs y Esquema (integridad dura).
   - Fase 2: Reingeniería Poka-Yoke de UI (Formulario inteligente, plantillas y unidades dinámicas).
   - Fase 3: Conexión transversal (Snapshots en producción y trazabilidad de tanque).

VERIFICACIÓN:
Asegurar con `git status --short` que NO se modificó ningún archivo de código fuente.

DETENCIÓN:
Al generar y guardar el documento `docs/diagnosticos/AUDITORIA_SISTEMA_INTEGRAL_RECETAS.md`, DETENTE inmediatamente.