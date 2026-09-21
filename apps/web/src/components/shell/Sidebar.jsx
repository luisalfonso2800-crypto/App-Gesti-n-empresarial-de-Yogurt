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
  Receipt,
  Settings
} from 'lucide-react';
import { SidebarCollapseButton } from './parts/SidebarCollapseButton';
import { SidebarNavItem } from './parts/SidebarNavItem';
import InvoiceSettingsModal from '@/components/settings/InvoiceSettingsModal';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { isRouteUnlocked } from '@/lib/onboarding-unlock-rules';
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
  const { data: onboardingData } = useOnboardingStatus();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

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
                
                const { isUnlocked, requiredStepText } = isRouteUnlocked(item.path, onboardingData);

                return (
                  <SidebarNavItem
                    key={item.path}
                    item={item}
                    isActive={isActive}
                    isUnlocked={isUnlocked}
                    requiredStepText={requiredStepText}
                    collapsed={collapsed}
                  />
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.footerTopRow}>
        <button
          type="button"
          className={styles.settingsBtn}
          onClick={() => setIsSettingsOpen(true)}
          title="Configuración de comprobante"
          aria-label="Configuración de comprobante"
        >
          <Settings size={16} />
        </button>
      </div>

      <div className={styles.sidebarFooter}>
        <Leaf className={styles.footerLeafIcon} size={14} />
        <span className={styles.footerQuote}>"Procesos que dan vida."</span>
        <span className={styles.footerSubQuote}>La tecnología también puede cuidar lo esencial.</span>
      </div>

      <InvoiceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </aside>
  );
}
