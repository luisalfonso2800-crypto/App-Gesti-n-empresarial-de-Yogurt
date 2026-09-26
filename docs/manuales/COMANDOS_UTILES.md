# Comandos Útiles del Proyecto (Suites Completas y Operación)

Guía centralizada de comandos para gestión de servidores, base de datos, compilación, auditoría de arquitectura y **ejecución de suites completas de pruebas**.

> **Nota:** Todos los comandos deben ejecutarse desde la terminal en la raíz del proyecto:
> `C:\Proyects\App-Gesti-n-empresarial-de-Yogurt`

---

## 🖥️ 1. Levantar Servidores de Desarrollo

Para trabajar localmente puedes levantar ambos servicios juntos o en terminales independientes:

### Opción A: Ambos Servidores Simultáneos (Recomendado)
```bash
pnpm dev
```

### Opción B: En Dos Terminales Separadas
* **Terminal 1 (Backend API - Puerto 3000):**
  ```bash
  pnpm run start:api:dev
  ```
* **Terminal 2 (Frontend Web - Puerto 3001):**
  ```bash
  pnpm --filter web dev
  # o con Turbopack para recargas rápidas:
  pnpm --filter web run dev --turbo
  ```

---

## 🗄️ 2. Gestión de Base de Datos (Prisma & PostgreSQL)

Comandos para administración del esquema y los datos:

```bash
# 1. Sincronizar esquema de schema.prisma con la base de datos
pnpm --filter api exec prisma db push

# 2. Regenerar el cliente Prisma (después de cualquier cambio de modelo)
pnpm --filter api exec prisma generate

# 3. Abrir la interfaz gráfica interactiva de Prisma Studio
pnpm --filter api exec prisma studio

# 4. Sembrar (Seed) datos de prueba iniciales (limpia y carga data base)
pnpm --filter api run db:seed:test

# 5. Vaciar completamente los datos de prueba sin alterar las tablas
pnpm --filter api run db:clean:test
```

---

## 📦 3. Dependencias, Compilación y Calidad de Código

```bash
# Instalar o actualizar dependencias de todo el monorepo
pnpm install

# Compilar backend y frontend para producción
pnpm run build

# Compilar únicamente el backend (API)
pnpm run build:api

# Compilar únicamente el frontend (Web)
pnpm run build:web

# Auditoría estática de Responsabilidad Única y CSS Modules (Reglas MANNÁ)
pnpm run verify:srp

# Verificación de límites de líneas en archivos E2E (<140 líneas)
pnpm --filter web run test:e2e:lint

# Limpiar caché de compilación de Next.js (PowerShell)
Remove-Item -Recurse -Force apps/web/.next
# o desde la carpeta web:
# Remove-Item -Recurse -Force .next

# Matar procesos de Node colgados o zombis (liberar puertos 3000 / 3001)
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

---

## 🧪 4. Ejecución de Tests E2E — Suites Completas y por Categoría

> ⚠️ Para ejecutar tests E2E, asegúrate de tener levantados el backend (3000) y el frontend (3001).
> Para ejecutar tests individuales, archivos `.spec.js` específicos o filtros `-g`, consulta el archivo [TESTS_INDIVIDUALES.md](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/TESTS_INDIVIDUALES.md).

### 🚀 A. Selector Interactivo de Suites
Lanza el menú de consola para seleccionar y ejecutar suites completas de forma interactiva:
```bash
pnpm run test:e2e:select
```

---

### 📋 B. Suites Completas por Módulo / Categoría

#### 1. Suite Completa de Insumos (`supplies/`)
```bash
# Ejecutar toda la suite de insumos con lista detallada
pnpm --filter web exec playwright test supplies/ --reporter=list
```

#### 2. Suite Completa de Compras (`purchases/`)
```bash
# Ejecutar los 58 tests de compras (UI, cálculos, stock, totales, poka-yoke y cadena)
pnpm --filter web exec playwright test purchases/ --reporter=list
```

#### 3. Suite Completa de Proveedores (`suppliers/`)
```bash
# Ejecutar todos los tests modulares de proveedores
pnpm --filter web exec playwright test suppliers/ --reporter=list
```

#### 4. Suite Completa de Presentaciones (`presentations/`)
```bash
# Ejecutar todos los tests de presentaciones y empaques
pnpm --filter web exec playwright test presentations/ --reporter=list
```

#### 5. Suite Exhaustiva de Todo el ERP (`exhaustive/`)
```bash
# Ejecutar la suite exhaustiva de punta a punta (Catálogos, Operaciones y Comercial)
pnpm --filter web exec playwright test exhaustive/ --reporter=list
```

#### 6. Suite de Cadena de Valor Completa
```bash
# Ejecutar el flujo integral de negocio (Insumo -> Proveedor -> Compra -> Fabricación -> Venta)
pnpm --filter web exec playwright test value-chain-complete.spec.js --reporter=list
```

#### 7. Suite Completa de Precios de Proveedores y Carrito Global (`supplier-prices/`)
```bash
# Ejecutar los 40 tests: tabla comparativa, modal poka-yoke, cálculos IVA y carrito del header
pnpm --filter web exec playwright test supplier-prices/ --reporter=list
```

#### 8. Suite de Operaciones: Checklist Operativo y Fusión de Listas (`operations/`)
```bash
# Ejecutar los 23 tests de operaciones: checklist en planta (T33-T45) y tablero/fusión de órdenes (T46-T55)
pnpm --filter web exec playwright test operations/checklist-operativo.spec.js operations/listas-fusion.spec.js --reporter=list
```

#### 9. Suite Integral: Precios → Carrito → Checklist → Fusión (Ciclo Completo)
```bash
# Ejecutar el ciclo completo integrado entre catálogo, carrito, checklist y fusión (T01-T60)
pnpm --filter web exec playwright test supplier-prices/ operations/checklist-operativo.spec.js operations/listas-fusion.spec.js exhaustive/flow-precios-carrito-checklist.spec.js --reporter=list
```

---

### 🌐 C. Ejecución Global de Todos los Tests E2E

```bash
# Ejecutar absolutamente todos los tests E2E del sistema en segundo plano (Headless)
pnpm --filter web exec playwright test --reporter=list

# Ejecutar todos los tests abriendo ventana de navegador (Headed)
pnpm --filter web exec playwright test --headed

# Ver el último reporte HTML interactivo con capturas y trazas
pnpm --filter web exec playwright show-report apps/web/playwright-report
```

---

### 🔧 D. Opciones Globales de Diagnóstico
Puedes agregar estos modificadores al final de cualquier comando de suite:
- `--reporter=list` : Muestra cada test con su tiempo exacto en la terminal.
- `--timeout=20000` : Amplía el tiempo máximo por test a 20 segundos.
- `--debug` : Abre el Inspector de Playwright para pausar y avanzar paso a paso.
- `--trace=on` : Graba trazas completas para diagnóstico detallado de fallos.