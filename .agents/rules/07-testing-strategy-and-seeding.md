# REGLA 07: ESTRATEGIA DE PRUEBAS INDUSTRIALES Y SIEMBRA DE DATOS DESACOPLADA

Esta regla es de cumplimiento obligatorio para evitar la fragilidad de pruebas visuales, bloqueos de UI (Poka-Yoke/animaciones) y consumo excesivo de cuota.

## 1. PROHIBICIÓN DE SIEMBRA MASIVA POR INTERFAZ (ANTI-DIGITADOR)
* Queda TERMINANTEMENTE PROHIBIDO utilizar pruebas E2E de navegador (Playwright/Chromium) para sembrar registros masivos en bucles (`for`/`while`) con el propósito de alimentar módulos posteriores.
* Playwright NO es un digitador de fábrica. Automatizar formularios complejos multinivel mediante clics para crear 5, 10 o 20 productos es un anti-patrón inaceptable.

## 2. SIEMBRA DESACOPLADA VÍA PRISMA O API DIRECTA (FACTORIES / SEEDERS)
* Si un módulo en prueba requiere datos previos de otro módulo (ej. Recetas necesita Insumos comprados; Producción necesita Recetas; Ventas necesita Lotes en Cava):
  - La siembra de datos DEBE ejecutarse mediante un script de Node.js puro usando Prisma Client (`apps/api/prisma/seed-*.js`) o llamadas HTTP directas a la API (`request.post`).
  - Los scripts de siembra deben ser estrictamente idempotentes (`upsert` o validación de existencia previa) y persistir los IDs generados en `.test-data/*.chain.json` para trazabilidad de la cadena de valor.

## 3. PIRÁMIDE DE PRUEBAS Y DISTRIBUCIÓN DE RESPONSABILIDADES
* **Nivel 1: Integración de API / Backend (80% de la lógica):**
  - Toda regla Poka-Yoke, rechazo de negocio (400 Bad Request), campos obligatorios, mermas y balances matemáticos DEBE probarse directamente contra los endpoints de la API mediante llamadas HTTP (fixture `request` de Playwright o Supertest).
  - Rápido (<100ms), determinista y sin impacto por renderizados ni estados locales de React.
* **Nivel 2: E2E Representativo / Happy Path Visual (20% de la cobertura):**
  - Las suites de UI en Playwright deben validar ÚNICAMENTE 1 camino feliz representativo por módulo (abrir modal, completar formulario válido, verificar que los botones respondan y confirmar que el elemento persista en la lista).
  - Prohibido iterar colecciones en tests de UI. Si se requiere probar filtros o paginación, los datos deben ser inyectados previamente por base de datos.
