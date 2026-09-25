# Auditoría Estructural para Empaquetado de Escritorio (Electron)

> **Documento:** Auditoría técnica estática de runtime, dependencias y arquitectura para distribución de escritorio en Windows (.exe)  
> **Fecha:** 25 de Septiembre de 2026  
> **Alcance:** Monorepo (`apps/web`, `apps/api`) y paquete de empaquetado Electron  
> **Modo:** Inspección Estática (Solo Lectura)

---

## 1. Diagnóstico de Compilación y Runtime Actual

### 1.1 Frontend (`apps/web` — Next.js 15 + React 19)
- **Modo Actual de Compilación:**
  - `next build` genera actualmente la salida estándar bajo `.next/`.
  - En `next.config.mjs` no está configurado `output: 'export'` ni `output: 'standalone'`.
  - Las vistas utilizan App Router con componentes `'use client'`, hooks (`useRouter`, `useSearchParams`, `Suspense`), y llamadas directas hacia el gateway API mediante `fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1')`.
- **Compatibilidad con Electron:**
  - **Export Estático (`output: 'export'`):** NO recomendado en esta fase debido al uso dinámico de `useSearchParams` y rutas cliente que requieren servidor HTTP local para evitar problemas con el protocolo `file://` y recargas de página.
  - **Modo Standalone (`output: 'standalone'`):** **ALTAMENTE RECOMENDADO**. Next.js empaqueta un servidor Node.js ultra-liviano (`server.js`) con sólo los módulos necesarios, permitiendo a Electron arrancarlo en un puerto interno (o dinámico) y cargar `http://localhost:3000`.

### 1.2 Backend (`apps/api` — NestJS 11 + Prisma ORM + PostgreSQL)
- **Modo Actual:**
  - Se ejecuta mediante `node index.js`, el cual activa `@babel/register` y levanta `./src/main.js` sobre Express/NestJS escuchando en el puerto 4000.
  - `prisma generate` genera el cliente Prisma vinculado a la base de datos PostgreSQL (`pg` + `@prisma/adapter-pg`).
- **Consideraciones para el Entorno de Escritorio:**
  - El backend requiere conexión a PostgreSQL definida en `DATABASE_URL`.
  - En distribución de escritorio, se debe distinguir entre:
    1. **Entorno de Red Local/Servidor:** La base de datos corre en un servidor local o remoto y la app de escritorio se conecta mediante IP/host configurado en un archivo `.env` o diálogo de configuración inicial.
    2. **Instalación Monolítica (Standalone PC):** El instalador instala o conecta a un servicio local PostgreSQL o SQLite/embedded (si aplicara en el futuro). Para este proyecto MANNÁ, el backend ya está diseñado para PostgreSQL.

---

## 2. Estrategia de Arquitectura para Electron

### 2.1 Esquema de Procesos (Supervisión y Orquestación)
Se recomienda crear un paquete desacoplado `apps/desktop` o ubicar el proceso principal en la raíz sin contaminar el código funcional web/api:

```
[ Electron Main Process (desktop/main.js) ]
         │
         ├── 1. Lanza/Verifica Servicio Backend (NestJS puerto 4000)
         │       └─ child_process.fork('apps/api/index.js') o child_process.spawn('node')
         │
         ├── 2. Lanza/Verifica Servidor Frontend (Next.js Standalone puerto 3000)
         │       └─ child_process.fork('apps/web/.next/standalone/server.js')
         │
         └── 3. Crea BrowserWindow (Kiosk / Ergonómico de Planta)
                 └─ win.loadURL('http://localhost:3000')
```

### 2.2 Ventajas de esta Arquitectura
1. **CERO Cambios a la Lógica de Negocio:** No se tocan rutas, controladores, contratos ni hooks de Next.js ni NestJS.
2. **Aislamiento Hermético:** Electron actúa estrictamente como **contenedor / runtime supervisor** que gestiona la ventana, ciclo de vida del SO (cerrar subprocesos al salir de la app) y menús del sistema.
3. **Gestión de Puertos y Ciclo de Vida:**
   - Al cerrar la ventana principal de Electron, el evento `window-all-closed` y `before-quit` envía señales `SIGTERM`/`SIGKILL` a los procesos hijos para no dejar puertos huérfanos (3000 y 4000).

---

## 3. Hoja de Ruta de Empaquetado (.exe con `electron-builder`)

### Fase 1: Configuración de Next.js Standalone
- Ajustar `apps/web/next.config.mjs` con:
  ```javascript
  const nextConfig = {
    output: 'standalone',
  };
  export default nextConfig;
  ```
  Esto reduce el peso de producción y permite ejecutar `node apps/web/.next/standalone/apps/web/server.js`.

### Fase 2: Módulo Desktop Orquestador (`apps/desktop/`)
1. Crear `apps/desktop/package.json` con dependencias:
   - `electron` (devDependency).
   - `electron-builder` (devDependency).
2. Crear `apps/desktop/src/main.js`:
   - Lanza el backend (`apps/api`) y frontend (`apps/web`).
   - Espera que los puertos 4000 y 3000 respondan antes de mostrar `BrowserWindow` (Splash screen elegante MANNÁ mientras inicia).
   - Previene múltiples instancias (`app.requestSingleInstanceLock()`).

### Fase 3: Configuración de `electron-builder`
- Configurar la sección `build` en `apps/desktop/package.json`:
  ```json
  "build": {
    "appId": "com.manna.yogurtmanagement",
    "productName": "MANNÁ Gestión Empresarial",
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true
    }
  }
  ```

### Fase 4: Scripts Monorepo en `package.json`
- `pnpm run build:desktop`: Ejecuta `pnpm build`, copia los artefactos y compila el instalador `.exe` de Windows.
