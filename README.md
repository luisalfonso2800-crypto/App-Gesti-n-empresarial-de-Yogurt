# 🥛 ERP Industrial MANNÁ — Sistema Integral de Manufactura Láctea, Trazabilidad Sanitaria y Centro de Mando Táctico

> **ERP vertical de grado alimentario (BPM / INVIMA)** diseñado y construido para digitalizar las operaciones de la planta láctea familiar **Lácteos MANNÁ**. Gobierna la formulación multinivel (BOM/WIP), trazabilidad sanitaria de lotes en tanque y empaque, costeo absorbido en caliente y telemetría de planta en tiempo real.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16_Neon_Cloud-336791?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E_Coverage-2EAD33?style=flat-square&logo=playwright)](https://playwright.dev/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![Railway](https://img.shields.io/badge/Deployed_on-Railway-0B0D0E?style=flat-square&logo=railway)](https://railway.app/)

---

## 🔗 Despliegue en Vivo y Distribución

| Componente | Plataforma | URL |
|:-----------|:-----------|:----|
| **Frontend Web** | Vercel | [app-gesti-n-empresarial-de-yogurt-a.vercel.app](https://app-gesti-n-empresarial-de-yogurt-a.vercel.app) |
| **API Backend** | Railway | [api-production-ec9ee.up.railway.app/api/v1](https://api-production-ec9ee.up.railway.app/api/v1) |
| **Base de Datos** | Neon Cloud (PostgreSQL 16 serverless) | AWS `us-east-2` (Ohio) con connection pooling |
| **Instalador Desktop** | GitHub Releases | [MANNÁ Gestión Empresarial (.exe)](https://github.com/luisalfonso2800-crypto/App-Gesti-n-empresarial-de-Yogurt/releases/latest) |

> El instalador desktop incluye un lanzador silencioso (`lanzar-manna-oculto.vbs`) que arranca los servicios locales y abre la ventana nativa de Electron sin terminales emergentes en pantalla.

---

## 📸 Vista Previa del Sistema

### Centro de Mando SCADA
![Dashboard MANNÁ](docs/qa-testing/screenshots/04-app-funcionando.png)

### Infraestructura y Despliegue

| Frontend (Vercel) | Backend (Railway) | Database (Neon) |
|:---:|:---:|:---:|
| ![Vercel](docs/qa-testing/screenshots/01-vercel-frontend.png) | ![Railway](docs/qa-testing/screenshots/02-railway-backend.png) | ![Neon](docs/qa-testing/screenshots/03-neon-database.png) |

---

## 🎯 El Problema de Negocio vs. Solución de Ingeniería

Los sistemas ERP convencionales fallan en la pequeña industria láctea debido a la física del proceso:

1. **Desbalances de masa y mermas térmicas:** 100 L de leche cruda nunca producen 100 L exactos de base láctea debido a la evaporación, adhesión en marmita y desuerado técnico.
2. **Fabricación bifásica (semielaborados WIP a granel):** La planta elabora primero bases en tanque (Base Blanca, jaleas artesanales) y posteriormente dosifica en vasitos comerciales.
3. **Trazabilidad sanitaria estricta (INVIMA / BPM):** Obligación de rastrear qué tanque de base láctea líquida originó cada vasito terminado en góndola.

**MANNÁ ERP** resuelve estos desafíos mediante un esquema relacional adaptado a planta, cálculo transaccional atómico y controles Poka-Yoke que impiden el error operativo antes de persistir datos.

---

## 🏛️ Arquitectura del Sistema

Monorepo gobernado con **pnpm workspaces** bajo principios de responsabilidad única (SRP):

- **`apps/web`** — Frontend en **Next.js 15 (App Router)**, React 19, módulos CSS aislados (sin dependencias CSS complejas) y Context API.
- **`apps/api`** — Backend desacoplado en **NestJS 11** con arquitectura por capas (*Controller → Service → Repository*) y transacciones ACID estrictas mediante **Prisma ORM**.
- **`apps/desktop`** — Contenedor nativo en **Electron 33** empaquetado con NSIS para distribución e instalación híbrida.
- **`database`** — PostgreSQL 16 alojado en **Neon Cloud** con cifrado SSL obligatorio.

### Principios de Calidad de Código

- **Transacciones ACID estrictas:** Toda salida de materias primas, ingreso de producto terminado a Cava y despacho comercial se ejecuta dentro de bloques `prisma.$transaction`.
- **Guardián de arquitectura automatizado:** Script interno (`verify-srp.js`) que valida en cada confirmación que ningún componente ni controlador exceda su límite de líneas (SRP <= 130 líneas).
- **Precisión numérica absoluta:** Cálculos financieros y balances de masa controlados con `Decimal.js` y redondeo discreto (`Math.ceil`) para empaques indivisibles (tapas, vasos, etiquetas).
- **Pruebas automatizadas:** Cobertura de integración de contratos de API y pruebas visuales end-to-end con Playwright, sin bucles de ejecución.

---

## 📋 Módulos Principales del Sistema

| Módulo | Enfoque Operativo | Característica Técnica |
|:-------|:------------------|:----------------------|
| **Centro de Mando (SCADA)** | Monitoreo en tiempo real de litros procesados, stock en Cava y telemetría de fermentación. | Canvas interactivos de fluidos, osciloscopio y simulador táctico de producción y ganancia. |
| **Fórmulas y Recetas (BOM)** | Formulación multinivel por etapas técnicas (tiempos y temperaturas mín/obj/máx). | Soporte para semielaborados WIP (A GRANEL), insumos de bodega y semáforo de rentabilidad en vivo. |
| **Piso de Planta y Lotes** | Registro de órdenes de trabajo, balance de mermas y liquidación a Cava comercial. | Genealogía sanitaria `Lote Padre -> Lote Hijo` y congelación de instantánea (*snapshot*) inmutable de la receta. |
| **Abastecimiento y Kárdex** | Compras asistidas por déficit de stock en recetas y recepción física de mercancía. | Kárdex automatizado con registro de stock anterior, nuevo y costo promedio ponderado de absorción. |
| **Ventas y Cartera** | Despacho comercial con selección de lote por caducidad (FEFO) y facturación en caliente. | Validación de existencias reales en Cava, abonos parciales y liquidación controlada de cuentas por cobrar. |
| **Rumbo MANNÁ** | Planificación estratégica y asignación de margen operativo hacia fondos de cosecha. | Cálculo reactivo de ritmo (*pacing*) contra flujo de caja y recaudos reales del ERP. |

---

## 🛠️ Pila Tecnológica

| Componente | Tecnología |
|:-----------|:-----------|
| **Runtime & Package Manager** | Node.js 20+, pnpm 10+ (Workspaces) |
| **Frontend** | Next.js 15 (App Router), React 19, Lucide React, CSS Modules |
| **Backend** | NestJS 11, Express Runtime, Zod, Decimal.js |
| **ORM & Base de Datos** | Prisma ORM 7, PostgreSQL 16 (Neon Serverless Cloud) |
| **Desktop Wrapper** | Electron 33, electron-builder |
| **Testing & QA** | Playwright 1.50+ (Suites E2E y pruebas de integración API) |

---

## 🤖 Metodología: Desarrollo Asistido por IA

Este proyecto fue construido con un flujo **human-in-the-loop** de alta velocidad: el desarrollador actúa como arquitecto, evaluador y orquestador de agentes de IA (Antigravity, Claude, GitHub Copilot), implementando bajo reglas estrictas y auditables.

### Flujo de trabajo

1. **Investigación previa:** Estudio de alternativas técnicas (ej. `Decimal.js` vs punto flotante, `pnpm` vs `npm`, `Vercel` vs `Railway`), documentando matrices de decisión.
2. **Documentación antes de código:** Especificaciones, criterios de aceptación y contratos formales antes de la implementación técnica.
3. **Implementación por agentes:** Trabajo guiado por arquitectura en tres capas, desacople SRP y transacciones ACID.
4. **Verificación automatizada:** Script guardián que audita en cada confirmación que ningún archivo supere los límites de líneas establecidos.
5. **Auditorías forenses:** Diagnóstico a causa raíz (RCA) documentado para cada fallo sin dependencias de parches cosméticos.
6. **Despliegue multicloud:** Integración continua hacia Vercel (frontend), Railway (backend) y Neon (PostgreSQL).

### Gobernanza del Repositorio

- **`AGENTS.md`** — Constitución operativa del proyecto con directrices técnicas transversales.
- **`.agents/rules/`** — Reglas modulares por especialidad: backend, frontend, design system, formularios, testing y límites de consumo.
- **`.agents/scripts/verify-srp.js`** — Auditor de arquitectura y responsabilidad única automatizado.

### Métricas del desarrollo

| Métrica | Valor |
|:--------|:------|
| Tiempo de desarrollo | 3 semanas (idea -> producción) |
| Módulos funcionales | 16 |
| Documentación técnica generada | 750 archivos `.md` organizados por dominio |
| Componentes con SRP cumplido | 100% |
| Plataformas cloud integradas | 3 (Vercel + Railway + Neon) |
| Producto distribuible | Instalador `.exe` Windows (180 MB) |

---

## 💻 Puesta en Marcha en Desarrollo

### Prerrequisitos

- Node.js `>= 20.x`
- pnpm `>= 10.x`
- PostgreSQL 16 activo (local o conexión segura a Neon)

### Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/luisalfonso2800-crypto/App-Gesti-n-empresarial-de-Yogurt.git
cd App-Gesti-n-empresarial-de-Yogurt

# 2. Instalar dependencias del monorepo
pnpm install

# 3. Configurar variables de entorno
# Configurar DATABASE_URL en apps/api/.env

# 4. Generar cliente Prisma y compilar API
pnpm --filter api exec prisma generate
pnpm --filter api build

# 5. Iniciar servidores concurrentes
pnpm run dev
```
