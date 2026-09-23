# Comandos Útiles del Proyecto

Aquí tienes la lista de los comandos principales para gestionar la base de datos y levantar los servidores. Todos los comandos deben ejecutarse desde la raíz del proyecto (`C:\Proyects\App-Gesti-n-empresarial-de-Yogurt`).

---

## 🖥️ 1. Levantar los Servidores

Para trabajar localmente, abre dos terminales distintas y ejecuta un comando en cada una:

**Terminal 1 (Backend - Puerto 3000):**
```bash
pnpm run start:api:dev
```

**Terminal 2 (Frontend Web - Puerto 3001):**
```bash
pnpm --filter web dev
pnpm --filter web run dev --turbo
```

---

# 3. Levantar backend y frontend simultáneamente
pnpm dev

## 🗄️ 2. Gestión de Base de Datos (Prisma)

Estos comandos son para administrar tu PostgreSQL usando Prisma.

### Crear / Actualizar las tablas en la Base de Datos
*Usa esto la primera vez que configuras el proyecto o cada vez que hagas un cambio en el archivo `schema.prisma`.*
```bash
pnpm --filter api exec prisma db push
pnpm --filter api exec prisma generate
```

### Sembrar (Llenar) la Base de Datos con datos de prueba
*Este script limpia las tablas existentes y carga datos ficticios iniciales para poder probar la aplicación.*
```bash
pnpm --filter api run db:seed:test
```

### Vaciar la Base de Datos
*Úsalo si solo quieres eliminar todos los registros de las tablas sin eliminar la estructura de la base de datos.*
```bash
pnpm --filter api run db:clean:test
```

---

## 📦 3. Instalación de Dependencias
*Solo necesitas correr esto la primera vez o cuando alguien agregue nuevas librerías al proyecto.*
```bash
pnpm install
```

---

## 🧪 4. Ejecución de Tests E2E (Playwright)

Los tests se ejecutan desde la raíz del proyecto. Asegúrate de tener levantados el backend (puerto 3000) y el frontend (puerto 3001).

### Comandos Generales
```bash
# Ejecutar todos los tests (con interfaz/navegador visible)
pnpm --filter web exec playwright test

# Ejecutar todos los tests en segundo plano (headless)
pnpm --filter web exec playwright test --headed=false

# Ver reporte visual interactivo en navegador del último resultado
pnpm --filter web exec playwright show-report apps/web/playwright-report
```

### Suite Modularizada de Insumos (44 Tests - 100% Passing)
```bash
# Ejecutar toda la suite modular de Insumos (44 tests)
pnpm --filter web exec playwright test supplies/ --reporter=list

# Ejecutar por sub-suites individuales (<150 líneas cada una)
pnpm --filter web exec playwright test supplies/supplies-basics.spec.js --reporter=list       # T01-T14: Validaciones básicas
pnpm --filter web exec playwright test supplies/supplies-advanced.spec.js --reporter=list     # T15-T25: Validaciones avanzadas
pnpm --filter web exec playwright test supplies/supplies-validations.spec.js --reporter=list    # T26-T36: Casos extremos y límites
pnpm --filter web exec playwright test supplies/supplies-duplicates.spec.js --reporter=list     # T37-T43: Duplicados y unicidad
pnpm --filter web exec playwright test supplies/supplies-chain.spec.js --reporter=list          # T44: Insumo Maestro Cadena de Valor

# Ejecutar únicamente un test por patrón de nombre (-g)
pnpm --filter web exec playwright test supplies/ -g "T44" --reporter=list

# Verificar estándares arquitecturales E2E (<150 líneas, tests explícitos, sin bucles)
pnpm --filter web run test:e2e:lint
```

### Ejecutar Tests E2E de Otros Módulos
```bash
# Presentaciones (Modularizado)
pnpm --filter web exec playwright test presentations/ --reporter=list

# Suite Exhaustiva Todos los Módulos (Modularizada)
pnpm --filter web exec playwright test exhaustive/ --reporter=list

# Proveedores (Cobertura completa)
pnpm --filter web exec playwright test suppliers-complete.spec.js --reporter=list

# Cadena de Valor Completa
pnpm --filter web exec playwright test value-chain-complete.spec.js --reporter=list
```

### Opciones Útiles para Depurar Tests
```bash
# Ejecutar con salida en lista detallada y timeout ampliado (recomendado)
pnpm --filter web exec playwright test supplies/ --reporter=list --timeout=20000

# Ejecutar con navegador visible (headed mode)
pnpm --filter web exec playwright test supplies/ --headed

# Modo Debug paso a paso con inspector de Playwright
pnpm --filter web exec playwright test supplies/supplies-chain.spec.js --debug
```

