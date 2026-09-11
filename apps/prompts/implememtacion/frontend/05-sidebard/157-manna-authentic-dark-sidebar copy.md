'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Share2, 
  Cpu, 
  Bell, 
  TrendingUp, 
  FileText, 
  Settings, 
  Users, 
  Leaf 
} from 'lucide-react';
import styles from './shell.module.css';

const NAV_ITEMS = [
  { label: 'Vista General', href: '/dashboard', icon: Home },
  { label: 'Canales Tácticos', href: '/dashboard?channel=all', icon: Share2 },
  { label: 'Dispositivos', href: '/operations/production', icon: Cpu },
  { label: 'Alarmas', href: '/dashboard#alerts', icon: Bell, badge: '3' },
  { label: 'Históricos', href: '/commercial/sales', icon: TrendingUp },
  { label: 'Reportes', href: '/commercial/expenses', icon: FileText },
  { label: 'Configuración', href: '/catalog/products', icon: Settings },
  { label: 'Usuarios', href: '/catalog/providers', icon: Users },
];

export default function Shell({ children }) {
  const pathname = usePathname();

  return (
    <div className={styles.layoutContainer}>
      {/* SIDEBAR TÁCTICO BOTÁNICO */}
      <aside className={styles.sidebar} aria-label="Menú Principal MANNÁ">
        <div>
          {/* IDENTIDAD DE MARCA */}
          <div className={styles.brandWrapper}>
            <Leaf className="{styles.brandLogoIcon}" size="{28}"/>
            <h1 className={styles.brandTitle}>MANNÁ</h1>
            <span className={styles.brandSubtitle}>Semilla · Tiempo · Fruto</span>
          </div>

          {/* LISTA DE NAVEGACIÓN */}
          <nav className={styles.navList}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');

              return (
                <Link ${isActive ''}`} : ? className="{`${styles.navItem}" href="{item.href}" key="{item.label}" styles.navItemActive>
                  <Icon 1.75} 2.2 : ? size="{18}" strokeWidth="{isActive"/>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={styles.alarmBadge}>{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* PIE BOTÁNICO INSPIRACIONAL */}
        <div className={styles.sidebarFooter}>
          <Leaf className="{styles.footerLeafIcon}" size="{20}"/>
          <div className={styles.footerQuote}>Procesos que dan vida</div>
          <div className={styles.footerSubQuote}>La tecnología también puede cuidar lo esencial.</div>
        </div>
      </aside>

      {/* ÁREA ÚTIL DE LA PANTALLA (DASHBOARD Y MÓDULOS) */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}