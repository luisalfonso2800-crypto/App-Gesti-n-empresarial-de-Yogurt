import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Settings } from 'lucide-react';
import { SidebarCollapseButton } from './parts/SidebarCollapseButton';
import { SidebarNavItem } from './parts/SidebarNavItem';
import { SIDEBAR_NAV_ITEMS } from './parts/sidebarNavConfig';
import InvoiceSettingsModal from '@/components/settings/InvoiceSettingsModal';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { useAlarmsCount } from '@/hooks/useAlarmsCount';
import { isRouteUnlocked } from '@/lib/onboarding-unlock-rules';
import styles from './shell.module.css';

export function Sidebar({ collapsed = false, onToggle, mobileOpen = false, onCloseMobile }) {
  const pathname = usePathname();
  const { data: onboardingData } = useOnboardingStatus();
  const { totalAlarms } = useAlarmsCount();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  return (
    <>
      {mobileOpen && (
        <div
          className={styles.sidebarBackdrop}
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''} ${mobileOpen ? styles.sidebarOpenMobile : ''}`}
        aria-label="Navegación ERP MANNÁ"
      >
        <SidebarCollapseButton collapsed={collapsed} onToggle={onToggle} />

      <div className={styles.sidebarContentWrapper}>
        <div className={styles.brandWrapper}>
          <Leaf className={styles.brandLogoIcon} size={28} />
          <h1 className={styles.brandTitle}>MANNÁ</h1>
          <span className={styles.brandSubtitle}>Semilla · Tiempo · Fruto</span>
        </div>
        
        <nav className={styles.navList}>
          {SIDEBAR_NAV_ITEMS.map((group) => (
            <div key={group.group} className={styles.navGroup}>
              <div className={styles.groupTitle}>{group.group}</div>
              {group.items.map((item) => {
                const isActive = item.path === '/dashboard'
                  ? (pathname === '/dashboard' || pathname === '/')
                  : (pathname === item.path || pathname.startsWith(item.path + '/'));
                
                const { isUnlocked, requiredStepText } = isRouteUnlocked(item.path, onboardingData);

                // Inyección dinámica de badge si hay alarmas activas reales
                const dynamicItem = item.name === 'Alarmas SCADA'
                  ? { ...item, badge: totalAlarms > 0 ? String(totalAlarms) : null }
                  : item;

                return (
                  <SidebarNavItem
                    key={item.path}
                    item={dynamicItem}
                    isActive={isActive}
                    isUnlocked={isUnlocked}
                    requiredStepText={requiredStepText}
                    collapsed={collapsed}
                    onNavigate={onCloseMobile}
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
    </>
  );
}
