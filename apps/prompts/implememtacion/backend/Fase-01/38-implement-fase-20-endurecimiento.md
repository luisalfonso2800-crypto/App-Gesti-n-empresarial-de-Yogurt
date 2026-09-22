TAREA CONTROLADA — FASE 20: ENDURECIMIENTO, SEGURIDAD Y ESTABILIZACIÓN DEL BACKEND V1 (CONSUMO CALIBRADO)

REGLAS DE CUOTA ESTRICTA Y ANTI-BLOQUEO (WINDOWS CLI)
- PROHIBIDO listar directorios completos, búsquedas recursivas o subshells lentas (`Select-String`, `findstr`, `grep`).
- Inspecciona EXCLUSIVAMENTE los archivos indispensables listados en la sección 1.
- Comandos CLI permitidos exclusivamente:
  * `pnpm --filter api exec prisma validate`
  * `pnpm --filter api exec prisma generate`
  * `pnpm --filter api test`
  * `pnpm --filter api build` (si existe script configurado)
  NUNCA usar `npx`.
- PROHIBIDO exponer `DATABASE_URL`, credenciales, tokens o secretos en consola o reportes.

OBJETIVO
Realizar el endurecimiento técnico y de seguridad del Backend V1 sobre el sistema real existente:
1. Asegurar variables de entorno y exclusión estricta de secretos en Git (.env vs .env.example).
2. Endurecer transporte HTTP en `main.ts` (CORS restrictivo, Helmet si está disponible, prefijo global).
3. Blindar validaciones contra Mass Assignment (`ValidationPipe` global con whitelist y forbidNonWhitelisted).
4. Unificar `GlobalExceptionFilter` para que errores de Prisma o base de datos no filtren stack traces, consultas SQL o rutas internas.
5. Auditar autenticación/autorización: si no están definidas documentalmente ni implementadas, declararlas formalmente como NO IMPLEMENTADA (PROHIBIDO inventar JWT, roles o guards nuevos).
6. Ejecutar pruebas de seguridad y regresión completa sin romper la integración lograda en Fase 19.

1. LECTURA MÍNIMA ESTRICTA (SOLO ESTOS ARCHIVOS)
- `apps/api/src/main.ts`
- `apps/api/package.json`
- `.gitignore` y `apps/api/.env.example`
- `apps/api/src/common/` (filtros o pipes existentes)
- `apps/api/prisma/schema.prisma` (verificar únicamente si existe modelo de Usuario/Auth)

2. ALCANCE DIRECTO A IMPLEMENTAR
- Seguridad en `main.ts`:
  * Configurar `ValidationPipe` global: `{ whitelist: true, forbidNonWhitelisted: true, transform: true }`.
  * Habilitar CORS con configuración controlada.
  * Conectar cabeceras seguras (Helmet o configuración nativa equivalente).
- Manejo Seguro de Errores:
  * Implementar o estandarizar `GlobalExceptionFilter` en `src/common/filters/`.
  * Mapear errores de Prisma (`PrismaClientKnownRequestError`) a respuestas HTTP seguras (400, 404, 409).
  * Excepciones 500 no controladas deben emitir un mensaje genérico al cliente sin detalles internos del servidor o base de datos.
- Auditoría de Secretos:
  * Confirmar que `.env` esté ignorado en `.gitignore`.
  * Confirmar que `.env.example` no contenga credenciales reales.
- Regla Estricta de Autenticación / Autorización:
  * Si no existe un módulo `auth` o modelo de usuario en `schema.prisma`, reportar:
    `Autenticación: NO IMPLEMENTADA`, `Autorización: NO IMPLEMENTADA`.
  * PROHIBIDO inventar esquemas RBAC, tablas de usuarios o flujos JWT en esta fase.

3. LÍMITES ESTRICTOS (PROHIBICIONES)
- NO alterar el modelo de negocio ni generar migraciones en `schema.prisma`.
- NO implementar frontend, vistas ni reportes.
- NO romper la suite de pruebas unitarias ni el test de integración transversal (`business-flow.integration.spec.ts`).

4. PRUEBAS, REGRESIÓN Y AUTOAUDITORÍA
- Agregar o ajustar tests para verificar:
  * Rechazo de campos no autorizados (forbidNonWhitelisted).
  * Manejo controlado de excepciones (cero fuga de stack traces o SQL).
- Ejecutar validación técnica y regresión general:
    pnpm --filter api exec prisma validate
    pnpm --filter api test
    pnpm --filter api build (registrar NO CONFIGURADO si no existe script de build)
- Actualizar `docs/implementation/05-prisma-implementation-plan.md` reflejando el cierre de la Fase 20.

REPORTE FINAL OBLIGATORIO (DETENERSE TRAS EMITIR)
Responder ÚNICAMENTE con este formato:

FASE 20 — CIERRE

• Estado: [COMPLETADA / PARCIAL / BLOQUEADA]

• Configuración: OK / ERROR
• Variables de entorno: OK / ERROR
• Secretos: OK / ERROR
• Validación de entradas: OK / ERROR
• DTOs: OK / ERROR
• Mass assignment: OK / ERROR
• Manejo de errores: OK / ERROR
• Prisma/PostgreSQL: OK / ERROR
• Transacciones: OK / ERROR
• CORS: OK / ERROR
• HTTP Security: OK / ERROR / NO APLICA
• Rate Limiting: NO DEFINIDO / [detalle]
• Logging: OK / ERROR
• Autenticación: NO IMPLEMENTADA / [detalle si ya existía]
• Autorización: NO IMPLEMENTADA / [detalle si ya existía]
• Endpoints: OK / ERROR
• Respuestas API: OK / ERROR
• Dependencias: OK / ERROR
• Pruebas de seguridad: OK / ERROR
• Regresión funcional: OK / ERROR

• Prisma format: OK / ERROR
• Prisma validate: OK / ERROR
• Prisma generate: OK / ERROR
• Tests: OK / ERROR
• Build: OK / ERROR / NO CONFIGURADO
• Lint: OK / ERROR / NO CONFIGURADO

• Autoauditoría: OK / ERROR

• Decisiones documentales: NINGUNA / [detalle]

• Documentos modificados: [lista]
• Archivos creados: [lista]
• Archivos modificados: [lista]
• Archivos eliminados: [lista]

• Cambios fuera de alcance: NINGUNO
• Discrepancias: NINGUNA / [detalle]
• Bloqueos: NINGUNO
• Limitaciones conocidas: [ej. Autenticación no contemplada en V1]

• Siguiente fase: Calidad Final / API / Preparación de Entrega V1

DETENTE inmediatamente tras el reporte.