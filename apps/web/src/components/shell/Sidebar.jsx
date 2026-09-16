import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Leaf, 
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
  Receipt
} from 'lucide-react';
import { SidebarCollapseButton } from './parts/SidebarCollapseButton';
import styles from './shell.module.css';

const navItems = [
  {
    group: 'GENERAL',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Alarmas SCADA', path: '/dashboard?channel=ALARMS', icon: Bell, badge: '3' },
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
    ]
  }
];

export function Sidebar({ collapsed = false, onToggle }) {
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`} aria-label="Navegación ERP MANNÁ">
      <SidebarCollapseButton collapsed={collapsed} onToggle={onToggle} />

      <div className={styles.sidebarContentWrapper}>
        <div className={styles.brandWrapper}>
          <Leaf className={styles.brandLogoIcon} size={28} />
          <h1 className={styles.brandTitle}>MANNÁ</h1>
          <span className={styles.brandSubtitle}>Semilla · Tiempo · Fruto</span>
        </div>
        
        <nav className={styles.navList}>
          {navItems.map((group) => (
            <div key={group.group} className={styles.navGroup}>
              <div className={styles.groupTitle}>{group.group}</div>
              {group.items.map((item) => {
                const isActive = item.path === '/dashboard'
                  ? (pathname === '/dashboard' || pathname === '/')
                  : (pathname === item.path || pathname.startsWith(item.path + '/'));
                
                const Icon = item.icon;
                
                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon size={16} strokeWidth={isActive ? 2.2 : 1.75} />
                    <span className={styles.navItemText}>{item.name}</span>
                    {item.badge && <span className={styles.alarmBadge}>{item.badge}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.sidebarFooter}>
        <Leaf className={styles.footerLeafIcon} size={14} />
        <span className={styles.footerQuote}>"Procesos que dan vida."</span>
        <span className={styles.footerSubQuote}>La tecnología también puede cuidar lo esencial.</span>
      </div>
    </aside>
  );
}
