import { 
  LayoutDashboard, 
  Bell,
  Box, 
  Layers, 
  Truck, 
  DollarSign, 
  Package, 
  BookOpen,
  ShoppingCart,
  Boxes,
  Factory,
  QrCode,
  Users,
  TrendingUp,
  CreditCard,
  Receipt,
  Sprout
} from 'lucide-react';

/**
 * @file sidebarNavConfig.js
 * @module components/shell/parts
 * @description Configuración declarativa de rutas y grupos de navegación para el Sidebar ERP MANNÁ.
 */
export const SIDEBAR_NAV_ITEMS = [
  {
    group: 'GENERAL',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Alarmas SCADA', path: '/dashboard?channel=ALARMS', icon: Bell },
    ]
  },
  {
    group: 'CATÁLOGOS',
    items: [
      { name: 'Presentaciones', path: '/catalog/presentations', icon: Box },
      { name: 'Insumos', path: '/catalog/supplies', icon: Layers },
      { name: 'Proveedores', path: '/catalog/suppliers', icon: Truck },
      { name: 'Precios de Prov.', path: '/catalog/supplier-prices', icon: DollarSign },
      { name: 'Productos', path: '/catalog/products', icon: Package },
      { name: 'Recetas', path: '/catalog/recipes', icon: BookOpen },
    ]
  },
  {
    group: 'OPERACIONES',
    items: [
      { name: 'Compras', path: '/operations/purchases', icon: ShoppingCart },
      { name: 'Inventario', path: '/operations/inventory', icon: Boxes },
      { name: 'Producción', path: '/operations/production', icon: Factory },
      { name: 'Lotes', path: '/operations/lots', icon: QrCode },
    ]
  },
  {
    group: 'COMERCIAL',
    items: [
      { name: 'Clientes', path: '/commercial/clients', icon: Users },
      { name: 'Ventas', path: '/commercial/sales', icon: TrendingUp },
      { name: 'Pagos/Cobros', path: '/commercial/payments', icon: CreditCard },
      { name: 'Gastos', path: '/commercial/expenses', icon: Receipt },
      { name: 'Rumbo MANNÁ', path: '/commercial/goals', icon: Sprout },
    ]
  }
];
