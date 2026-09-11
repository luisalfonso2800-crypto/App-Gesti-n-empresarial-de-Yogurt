# BARRA COMPACTA DE ACCESOS RÁPIDOS SCADA (CERO SCROLL / 100VH ESTRICTO)

REGLAS DE ARQUITECTURA Y CUOTA:
- Modo bisturí: modifica únicamente `apps/web/src/app/dashboard/page.jsx` y `Dashboard.module.css`.
- CERO TAILWIND: Usa exclusivamente CSS Modules nativos.
- CERO INCREMENTO DE ALTURA (100vh estricto): Los accesos rápidos deben integrarse dentro del flujo superior existente (en la barra de cabecera o como una cinta táctica ultracompacta de 30px) reajustando fracciones del flex/grid sin generar scrollbar vertical en la pantalla.
- Rutas del ERP:
  1. Compras -> `/operations/purchases`
  2. Precios Proveedores (Comprar Insumos) -> `/catalog/supplier-prices`
  3. Catálogo de Productos -> `/catalog/products`
  4. Pagos y Cobros -> `/commercial/payments`
  5. Ventas -> `/commercial/sales`

---

### 1. INTEGRACIÓN EN EL HEADER / SUBBARRA (`apps/web/src/app/dashboard/page.jsx`):
Importa `Link` de `next/link` y los iconos de `lucide-react` (`ShoppingCart`, `BadgePercent`, `Package`, `CreditCard`, `Receipt`):

```jsx
import Link from 'next/link';
import { ShoppingCart, Tag, Package, CreditCard, TrendingUp } from 'lucide-react';