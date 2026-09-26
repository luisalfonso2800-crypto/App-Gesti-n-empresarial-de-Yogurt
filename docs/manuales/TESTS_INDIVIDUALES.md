# Tests E2E Individuales por Archivo (Playwright)

Este archivo contiene el inventario de comandos para correr archivos `.spec.js` individuales y tests específicos por nombre (`-g`).

> **Nota:** Todos los comandos se ejecutan desde la raíz del proyecto (`C:\Proyects\App-Gesti-n-empresarial-de-Yogurt`).
> Requiere tener levantados el backend (puerto 3000) y el frontend (puerto 3001).

---

## 🥛 1. Insumos (`apps/web/e2e/supplies/`)

```bash
# T01-T14: Validaciones básicas de formulario e interfaz
pnpm --filter web exec playwright test supplies/supplies-basics.spec.js --reporter=list

# T15-T25: Validaciones avanzadas (densidad, empaque, unidades)
pnpm --filter web exec playwright test supplies/supplies-advanced.spec.js --reporter=list

# T26-T36: Reglas de validación, límites y casos borde
pnpm --filter web exec playwright test supplies/supplies-validations.spec.js --reporter=list

# T37-T43: Control de duplicados y unicidad de insumos
pnpm --filter web exec playwright test supplies/supplies-duplicates.spec.js --reporter=list

# Asistente de densidad y flujo guiado
pnpm --filter web exec playwright test supplies/supplies-flow-and-density.spec.js --reporter=list

# T44: Cadena de Valor (Insumo Maestro LECHE_ENTERA)
pnpm --filter web exec playwright test supplies/supplies-chain.spec.js --reporter=list

# Ejecutar un test puntual por nombre (ejemplo: T44 o T01)
pnpm --filter web exec playwright test supplies/ -g "T44" --reporter=list
pnpm --filter web exec playwright test supplies/ -g "T01" --reporter=list
```

---

## 🛒 2. Compras (`apps/web/e2e/purchases/`)

```bash
# T01-T08: UI y navegación básica del módulo de compras
pnpm --filter web exec playwright test purchases/purchases-basics.spec.js --reporter=list

# Motor de cálculos de cantidades, empaques y conversiones
pnpm --filter web exec playwright test purchases/purchases-calculations.spec.js --reporter=list

# Cálculos de totales financieros, subtotal e IVA
pnpm --filter web exec playwright test purchases/purchases-totals.spec.js --reporter=list

# T09-T18: Validaciones de campos requeridos y envíos
pnpm --filter web exec playwright test purchases/purchases-validation.spec.js --reporter=list

# T25-T29: Drawer lateral de consulta de stock en compras
pnpm --filter web exec playwright test purchases/purchases-stock.spec.js --reporter=list

# T30-T33: Poka-Yoke y persistencia local del borrador
pnpm --filter web exec playwright test purchases/purchases-poka-yoke.spec.js --reporter=list

# T34: Cadena de valor compra maestra de leche
pnpm --filter web exec playwright test purchases/purchases-chain.spec.js --reporter=list

# Ejecutar un test puntual de compras por nombre
pnpm --filter web exec playwright test purchases/ -g "T01" --reporter=list
pnpm --filter web exec playwright test purchases/ -g "C01" --reporter=list
```

---

## 🚚 3. Proveedores (`apps/web/e2e/suppliers/`)

```bash
# Validaciones básicas de interfaz y listado de proveedores
pnpm --filter web exec playwright test suppliers/suppliers-basics.spec.js --reporter=list

# Validaciones de NIT, campos requeridos y formatos
pnpm --filter web exec playwright test suppliers/suppliers-validation.spec.js --reporter=list

# Poka-Yoke, duplicados y reglas de negocio de proveedores
pnpm --filter web exec playwright test suppliers/suppliers-poka-yoke.spec.js --reporter=list

# Cadena de valor (Proveedor Maestro)
pnpm --filter web exec playwright test suppliers/suppliers-chain.spec.js --reporter=list
```

---

## 📦 4. Presentaciones (`apps/web/e2e/presentations/`)

```bash
# Validaciones básicas de creación y formatos
pnpm --filter web exec playwright test presentations/presentations-basics.spec.js --reporter=list

# Validaciones avanzadas de empaques y factores de conversión
pnpm --filter web exec playwright test presentations/presentations-advanced.spec.js --reporter=list
```

---

## 🔍 5. Suite Exhaustiva por Archivo (`apps/web/e2e/exhaustive/`)

```bash
# Catálogo 01: Insumos y Categorías
pnpm --filter web exec playwright test exhaustive/catalog-01-supplies-categories.spec.js --reporter=list

# Catálogo 02: Presentaciones y Sabores
pnpm --filter web exec playwright test exhaustive/catalog-02-presentations-flavors.spec.js --reporter=list

# Catálogo 03: Proveedores, Clientes y Precios
pnpm --filter web exec playwright test exhaustive/catalog-03-suppliers-clients-prices.spec.js --reporter=list

# Operaciones 01: Compras y Producción
pnpm --filter web exec playwright test exhaustive/operations-01-purchases-production.spec.js --reporter=list

# Operaciones 02: Envasado, Mermas e Inventario
pnpm --filter web exec playwright test exhaustive/operations-02-packaging-waste-inventory.spec.js --reporter=list

# Comercial 01: Pedidos y Despachos
pnpm --filter web exec playwright test exhaustive/commercial-01-orders-shipments.spec.js --reporter=list

# Comercial 02: Facturación y Cartera/Cuentas por Cobrar
pnpm --filter web exec playwright test exhaustive/commercial-02-invoicing-receivables.spec.js --reporter=list
```

---

## 🛠️ 6. Tests Especiales / Remediación

```bash
# Proveedores completo (archivo legacy unificado)
pnpm --filter web exec playwright test suppliers-complete.spec.js --reporter=list

# Cadena de valor punta a punta completa
pnpm --filter web exec playwright test value-chain-complete.spec.js --reporter=list

# Remediación Poka-Yoke
pnpm --filter web exec playwright test remediation-poka-yoke.spec.js --reporter=list
```
