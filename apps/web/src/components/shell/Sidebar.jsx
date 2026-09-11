import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Leaf, 
  LayoutDashboard, 
  Bell,
  Layout, 
  TestTube, 
  Truck, 
  Tag, 
  Package, 
  FlaskConical,
  ShoppingCart,
  Database,
  Factory,
  Boxes,
  Users,
  TrendingUp,
  CreditCard,
  Receipt
} from 'lucide-react';
import styles from './shell.module.css';

const navItems = [
  {
    group: 'General',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Alarmas SCADA', path: '/dashboard/alarms', icon: Bell, badge: '3' },
    ]
  },
  {
    group: 'Catálogos',
    items: [
      { name: 'Presentaciones', path: '/catalog/presentations', icon: Layout },
      { name: 'Insumos', path: '/catalog/supplies', icon: TestTube },
      { name: 'Proveedores', path: '/catalog/suppliers', icon: Truck },
      { name: 'Precios Prov.', path: '/catalog/supplier-prices', icon: Tag },
      { name: 'Productos', path: '/catalog/products', icon: Package },
      { name: 'Recetas', path: '/catalog/recipes', icon: FlaskConical },
    ]
  },
  {
    group: 'Operaciones',
    items: [
      { name: 'Compras', path: '/operations/purchases', icon: ShoppingCart },
      { name: 'Inventario', path: '/operations/inventory', icon: Database },
      { name: 'Producción', path: '/operations/production', icon: Factory },
      { name: 'Lotes', path: '/operations/lots', icon: Boxes },
    ]
  },
  {
    group: 'Comercial',
    items: [
      { name: 'Clientes', path: '/commercial/clients', icon: Users },
      { name: 'Ventas', path: '/commercial/sales', icon: TrendingUp },
      { name: 'Pagos/Cobros', path: '/commercial/payments', icon: CreditCard },
      { name: 'Gastos', path: '/commercial/expenses', icon: Receipt },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      {/* Wrapper superior para alinear header y listado, dejando footer abajo */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div className={styles.brandWrapper}>
          <Leaf className={styles.brandLogoIcon} size={28} />
          <h1 className={styles.brandTitle}>MANNÁ</h1>
          <span className={styles.brandSubtitle}>Semilla · Tiempo · Fruto</span>
        </div>
        
        <nav className={styles.navList}>
          {navItems.map((group) => (
            <div key={group.group}>
              <div className={styles.navGroupTitle}>{group.group}</div>
              {group.items.map((item) => {
                const isActive = item.path === '/' 
                  ? pathname === '/'
                  : (pathname === item.path || pathname.startsWith(item.path + '/'));
                
                const Icon = item.icon;
                
                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
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
    </div>
  );
}
