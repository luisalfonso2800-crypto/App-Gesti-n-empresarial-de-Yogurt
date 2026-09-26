# ERP Industrial MANNÁ — Sistema Integral de Manufactura Láctea, Trazabilidad Sanitaria y Centro de Mando Táctico

[![Next.js 15](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![NestJS 11](https://img.shields.io/badge/NestJS-11.0-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-7.10-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Electron](https://img.shields.io/badge/Electron-33-47848F?style=for-the-badge&logo=electron)](https://www.electronjs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-100%25_Passing-2EAD33?style=for-the-badge&logo=playwright)](https://playwright.dev/)

> **ERP Vertical de Grado Alimentario (BPM / INVIMA)** diseñado con ergonomía de planta para la gestión técnica, operativa, comercial y estratégica en la elaboración y comercialización de derivados lácteos.

---

## 🔗 Demo en Vivo (Producción)

**Stack desplegado en la nube:**
- 🎨 **Frontend:** [app-gesti-n-empresarial-de-yogurt-a.vercel.app](https://app-gesti-n-empresarial-de-yogurt-a.vercel.app) — Vercel
- ⚙️ **Backend API:** [api-production-ec9ee.up.railway.app/api/v1](https://api-production-ec9ee.up.railway.app/api/v1) — Railway
- 💾 **Base de Datos:** PostgreSQL 16 serverless en Neon.tech (AWS us-east-2)

---

## 📸 Vista Previa del Sistema

### Centro de Mando SCADA (Dashboard Principal)
![Dashboard MANNÁ](docs/qa-testing/screenshots/04-app-funcionando.png)

### Infraestructura y Despliegue

| Frontend (Vercel) | Backend (Railway) | Database (Neon) |
|:---:|:---:|:---:|
| ![Vercel](docs/qa-testing/screenshots/01-vercel-frontend.png) | ![Railway](docs/qa-testing/screenshots/02-railway-backend.png) | ![Neon](docs/qa-testing/screenshots/03-neon-database.png) |

---

## 🚀 Distribución y Modalidades de Acceso

El sistema cuenta con dos vías de acceso y distribución:

1. **🌐 Aplicación Web (Recomendado):**  
   Demo en vivo y en producción desplegada en la nube:  
   👉 **[Acceder a la Plataforma Web en Vercel](https://app-gesti-n-empresarial-de-yogurt-a.vercel.app)**

2. **📦 Aplicación de Escritorio (Windows 64-bit):**  
   Instalador `.exe` nativo disponible en la pestaña de **Releases** de este repositorio:  
   * **[Descargar MANNÁ Gestión Empresarial (Instalador .exe)](https://github.com/luisalfonso2800-crypto/App-Gesti-n-empresarial-de-Yogurt/releases)**
   * **Ejecución Local Rápida (Sin Consolas Visibles):**  
     El sistema incluye un orquestador en segundo plano (`lanzar-manna-oculto.vbs`). Al ejecutarse, Windows levanta los microservicios locales y abre la ventana nativa de Electron sin terminales emergentes en pantalla.

---

## 🎯 Desafíos Industriales que Resuelve

1. **Trazabilidad Sanitaria y Genealogía de Lotes (BPM / INVIMA):**
   * Vinculación obligatoria entre el lote padre de base láctea intermedia (`idLotePadre`) y los lotes hijos envasados comercialmente.
   * Monitoreo por etapas: temperaturas de pasteurización, curvas de fermentación y control de tiempos de maduración.

2. **Gestión de Inventario Intermedio (WIP - Work in Progress):**
   * Control desacoplado entre materia prima en bodega, tanques de maduración a granel (`A GRANEL`) y stock final en Cava de Producto Terminado.
   * Manejo de recirculación de inóculos y cepas vivas internas para siembra de lotes sucesivos sin depender de compras externas.

3. **Cálculo Real de Mermas y Rendimiento Lácteo:**
   * Motor transaccional con precisión matemática estricta (`Decimal.js`), eliminando errores de redondeo en punto flotante IEEE 754.
   * Deducción discreta para empaques indivisibles (vasos, tapas, etiquetas) mediante redondeo entero superior y balances continuos para masa/volumen.

4. **Ciclo Comercial y Cartera Poka-Yoke:**
   * Despacho dinámico y validación de stock disponible en Cava en tiempo real.
   * Facturación con cálculo de margen bruto en caliente, pagos parciales, liquidación total y comprobantes con máscara numérica y conversión a letras.

5. **Rumbo MANNÁ (Dirección Estratégica y Fondos de Cosecha):**
   * Motor analítico reactivo de avance y ritmo de ejecución (*pacing*) que asigna la utilidad operativa real hacia metas de inversión de planta y proyectos familiares.

---

## 🏛️ Arquitectura del Sistema

El ecosistema está estructurado como un **Monorepo gobernado con pnpm workspaces**, aplicando arquitectura limpia de tres capas en backend y componentes desacoplados de responsabilidad única (SRP) en frontend.

```mermaid
graph TD
    subgraph Capa de Presentación Nativa
        E[Electron Runtime<br/>apps/desktop] -->|Carga HTTP Local| W[Next.js 15 Standalone<br/>apps/web - Puerto 3000]
    end

    subgraph Frontend Arquitectura por Capas
        W --> Views[Orquestadores de Vista<br/>App Router / SRP &lt; 120 líneas]
        Views --> Hooks[Custom Hooks de Dominio<br/>useRecipeForm, useProductionForm]
        Views --> Modals[SmartModals &amp; Componentes Poka-Yoke<br/>CSS Modules / Sin Estilos Inline]
    end

    subgraph Backend Micro-Modular NestJS
        W -->|REST API v1| C[Controllers NestJS<br/>apps/api - Puerto 4000]
        C --> S[Services de Dominio<br/>Lógica de Negocio y Mermas]
        S --> R[Repositories Prisma<br/>Transacciones Atómicas]
    end

    subgraph Persistencia y Trazabilidad
        R --> DB[(PostgreSQL 16<br/>yogurt_dev)]
        R --> KDX[Movimientos_Inventario<br/>Kárdex PEPS / Entradas y Salidas]
    end
```

### Principios de Ingeniería y Calidad de Código
* **Veto Anti-Blue y Design System MANNÁ:** Paleta institucional de planta (`#182622` Bosque Profundo, `#8F704A` Trigo Tostado, `#FAF8F5` Lino), cero alertas nativas (`no-alert`) y feedback contextual perimetral.
* **Backend-First y Transacciones ACID:** Toda entrada de compras, consumo de insumos en recetas o despacho comercial se ejecuta dentro de bloques `prisma.$transaction`.
* **Testing Automatizado Exhaustivo (Regla 07):** 100% de cobertura en suites de integración API y pruebas visuales End-to-End con Playwright, garantizando flujos deterministas sin bucles de ejecución.
* **Guardián de Arquitectura Automatizado:** Script interno (`verify-srp.js`) que audita en cada commit que ningún componente o controlador exceda su límite de líneas (SRP $\le 120-130$).

---

## 📸 Módulos Principales del Sistema

| Módulo | Enfoque Operativo | Característica Técnica |
| :--- | :--- | :--- |
| **Centro de Mando (SCADA)** | Métricas en tiempo real de litros procesados, stock en Cava y telemetría de fermentación. | Canvas dinámicos de fluidos, osciloscopio y simulador táctico de producción y ganancia. |
| **Diseñador de Fórmulas (BOM)** | Formulación de recetas por etapas técnicas (tiempos, temperaturas mín/obj/máx). | Soporte multinivel (Insumos vs Semielaborados WIP) y semáforo de rentabilidad en tiempo real. |
| **Piso de Planta y Lotes** | Registro de órdenes de producción, consumos reales y liquidación a Cava. | Trazabilidad genealógica Lote Padre $\rightarrow$ Lote Hijo y congelación de snapshot inmutable de la receta. |
| **Abastecimiento y Kárdex** | Control de compras asistidas por faltantes, recepción física y costeo ponderado. | Kárdex automatizado con registro de stock anterior, nuevo y costo unitario de absorción. |
| **Ventas y Cartera** | Despacho comercial con selección de lote por caducidad (FEFO) y facturación. | Validación de existencias en Cava, abonos parciales y liquidación controlada de cuentas por cobrar. |
| **Rumbo MANNÁ** | Planificación estratégica y siembra de metas empresariales y familiares. | Cálculo reactivo de ritmo (*pacing*) contra flujo de caja y recaudos reales del ERP. |

---

## 🛠️ Pila Tecnológica

| Componente | Tecnología | Detalle Técnico |
| :--- | :--- | :--- |
| **Monorepo Manager** | pnpm 10+ Workspaces | Aislamiento de paquetes y resolución determinista de dependencias |
| **Frontend Web** | Next.js 15 (App Router) | Servidor standalone optimizado para empaquetado de escritorio |
| **Biblioteca de UI** | React 19 + Lucide Icons | Componentes reactivos modularizados con CSS Modules |
| **Contenedor Desktop** | Electron 33 + electron-builder | Ventana nativa Windows con bloqueo de instancia única |
| **Backend API** | NestJS 11 + Express Runtime | Arquitectura desacoplada Controller $\rightarrow$ Service $\rightarrow$ Repository |
| **Modelado y Persistencia** | Prisma ORM 7 + PostgreSQL 16 | Esquema relacional con transacciones atómicas e integridad referencial |
| **Validación Numérica** | Decimal.js + Zod | Aritmética decimal de precisión fija para transacciones contables |
| **Testing Automatizado** | Playwright 1.50+ | Suites de integración API HTTP y pruebas visuales E2E |

---

## 💻 Puesta en Marcha en Desarrollo

### Prerrequisitos
* **Node.js:** `>= 20.x`
* **pnpm:** `>= 10.x`
* **PostgreSQL:** Base de datos activa (local o cloud, e.g. Neon.tech). La cadena de conexión se configura en `apps/api/.env` como `DATABASE_URL`.

### Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/luisalfonso2800-crypto/App-Gesti-n-empresarial-de-Yogurt.git
cd App-Gesti-n-empresarial-de-Yogurt

# 2. Instalar dependencias del monorepo
pnpm install

# 3. Sincronizar esquema y generar cliente Prisma
pnpm --filter api build

# 4. Iniciar servidores de desarrollo
pnpm run dev
```

* **Frontend Web:** `http://localhost:3000`
* **Backend API Gateway:** `http://localhost:4000/api/v1`

---

## 🧪 Verificación y Suites de Pruebas

```bash
# Auditoría de responsabilidad única (Guardián SRP en frontend y backend)
node .agents/scripts/verify-srp.js

# Integración API (sin navegador - ejecución ultrarrápida de contratos)
pnpm --filter web test:e2e e2e/recipes/recipes-api-integration.spec.js
pnpm --filter web test:e2e e2e/production/production-api-integration.spec.js
pnpm --filter web test:e2e e2e/purchases/purchases-api-integration.spec.js
pnpm --filter web test:e2e e2e/payments/payments-api-integration.spec.js
pnpm --filter web test:e2e e2e/expenses/expenses-api-integration.spec.js
pnpm --filter web test:e2e e2e/goals/goals-api-integration.spec.js

# Flujos Visuales End-to-End (Happy Path en UI y modales Poka-Yoke)
pnpm --filter web test:e2e e2e/recipes/recipes-happy-path.spec.js
pnpm --filter web test:e2e e2e/production/production-happy-path.spec.js
pnpm --filter web test:e2e e2e/purchases/purchases-flow.spec.js
pnpm --filter web test:e2e e2e/sales/sales-flow.spec.js
pnpm --filter web test:e2e e2e/payments/payments-flow.spec.js
pnpm --filter web test:e2e e2e/expenses/expenses-flow.spec.js
pnpm --filter web test:e2e e2e/goals/goals-flow.spec.js

# Cobertura Exhaustiva de Cadena de Valor (E2E Completo)
pnpm --filter web test:e2e e2e/exhaustive/operations-01-purchases-production.spec.js
pnpm --filter web test:e2e e2e/exhaustive/commercial-01-orders-shipments.spec.js
pnpm --filter web test:e2e e2e/value-chain-complete.spec.js
```

---

## 📄 Licencia

Desarrollado para **Lácteos MANNÁ**. Código abierto para propósitos de demostración técnica y evaluación de arquitectura.
