TAREA CONTROLADA — DISEÑO DE ARQUITECTURA Y MODELO DE NEGOCIO: RECETAS V2 (CON TOLERANCIA OPERATIVA Y VARIANTES)

OBJETIVO
Elaborar el diseño funcional y arquitectónico completo del nuevo módulo de Recetas (Recetas V2). La receta debe dejar de ser una cabecera plana y transformarse en la fórmula técnica integral de manufactura (BOM de insumos reales, etapas de proceso con tiempos/condiciones flexibles, componentes opcionales/variantes y cálculo de rendimiento escalable).

REGLAS DE SEGURIDAD ESTRICTAS (SOLO DISEÑO DOCUMENTAL)
1. PROHIBIDO modificar, crear o borrar código fuente de la aplicación.
2. PROHIBIDO ejecutar migraciones en Prisma o alterar la base de datos PostgreSQL.
3. PROHIBIDO crear archivos de implementación o endpoints todavía.
4. Toda decisión técnica debe basarse en el diagnóstico previo y el código fuente vivo.

FUENTES DE CONTEXTO
- `docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md`
- `apps/api/prisma/schema.prisma`
- Diagnóstico técnico previo (Tarea 65)

REQUISITOS FUNCIONALES OBLIGATORIOS A DISEÑAR

1. INTEGRIDAD DE MATERIALES (BOM):
   - Todo insumo físico (materia prima, aditivos, fruta, cereal, vaso, tapa, cuchara, etiqueta, cinta) debe vincularse por FK a un registro existente de `Insumos`. PROHIBIDO texto libre para materiales.
   - Manejo de empaque comercial y materias primas integrados en la receta.

2. FLEXIBILIDAD EN PROCESOS Y ALMACENAMIENTO (ETAPAS):
   - Las etapas no deben ser rígidas; los procesos lácteos dependen de factores ambientales.
   - Diseñar soporte para tiempos y condiciones flexibles:
     * Duración con rangos/tolerancias (ej. Fermentación: tiempo mínimo 8h, tiempo estándar 9h, tiempo máximo 10h).
     * Parámetros de proceso/almacenamiento (ej. Temperatura de incubación 42°C - 45°C; Refrigeración: 4°C; Instrucciones de almacenamiento).

3. VARIANTES Y COMPLEMENTOS:
   - Diseñar cómo permitir combinaciones (sin complemento, con cereal, con fruta, con jalea, o combinados) sin duplicar recetas maestras idénticas.
   - Proponer una alternativa minimalista para V1 (ej. Flag de insumo obligatorio vs. complementario/opcional por receta o sub-fórmula).

4. ESCALABILIDAD DE RENDIMIENTO:
   - Definición de fórmula para proyectar insumos teóricos:
     `Cantidad Requerida = (Cantidad Solicitada / Rendimiento Base) * Cantidad Unitaria Base`.

5. DESACOPLE DE MERMAS:
   - Merma teórica (%) en la receta para proyección y compras.
   - Merma real calculada exclusivamente en la orden de producción final.

ESTRUCTURA OBLIGATORIA DEL DOCUMENTO DE DISEÑO (Entregar exactamente estas secciones):

1. OBJETIVO Y VISIÓN FUNCIONAL
2. MODELO CONCEPTUAL (Cabecera, BOM, Procesos, Variantes)
3. ESQUEMA DE BASE DE DATOS PROPUESTO (Prisma: Receta, EtapaReceta, DetalleReceta)
   - Especificar campos, tipos, relaciones, FKs, rangos de tiempo y condiciones de proceso.
4. ESTRATEGIA DE VARIANTES / COMPONENTES OPCIONALES
5. ESCALAMIENTO DE RENDIMIENTO Y CONVERSIÓN DE UNIDADES
6. FLUJO DE COSTOS Y PROYECCIÓN TEÓRICA (Vínculo con PrecioProveedor)
7. ARTICULACIÓN CON PRODUCCIÓN E INVENTARIO (Cálculo Necesario vs. Stock vs. Faltante)
8. DISEÑO DE API Y ENDPOINTS (Transacciones Prisma en backend)
9. DISEÑO DE INTERFAZ DE USUARIO (UX/UI: Selección interactiva, etapas visuales, resumen previo)
10. IMPACTO Y COMPATIBILIDAD CON V1 (Migración de datos sin destruir lo existente)
11. PLAN DE IMPLEMENTACIÓN EN SUB-FASES
12. DECISIONES QUE REQUIEREN APROBACIÓN DEL USUARIO (Marcar claramente alternativas e impactos)

REGLA FINAL
NO IMPLEMENTAR NADA. Entregar únicamente el diseño técnico estructurado para revisión y consenso.