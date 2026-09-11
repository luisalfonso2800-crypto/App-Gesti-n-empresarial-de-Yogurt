'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { apiClient } from '@/lib/api-client';
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
  Leaf
} from 'lucide-react';
import styles from './shell.module.css';

const ERP_SECTIONS = [
  {
    category: 'GENERAL',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Alarmas SCADA', href: '/dashboard?channel=ALARMS', icon: Bell, badge: '3' },
    ],
  },
  {
    category: 'CATÁLOGOS',
    items: [
      { label: 'Presentaciones', href: '/catalog/presentations', icon: Box },
      { label: 'Insumos', href: '/catalog/supplies', icon: Layers },
      { label: 'Proveedores', href: '/catalog/suppliers', icon: Truck },
      { label: 'Precios de Proveedores', href: '/catalog/supplier-prices', icon: DollarSign },
      { label: 'Productos', href: '/catalog/products', icon: Package },
      { label: 'Recetas', href: '/catalog/recipes', icon: BookOpen },
    ],
  },
  {
    category: 'OPERACIONES',
    items: [
      { label: 'Compras', href: '/operations/purchases', icon: ShoppingCart },
      { label: 'Inventario', href: '/operations/inventory', icon: Boxes },
      { label: 'Producción', href: '/operations/production', icon: Factory },
      { label: 'Lotes', href: '/operations/lots', icon: QrCode },
    ],
  },
  {
    category: 'COMERCIAL',
    items: [
      { label: 'Clientes', href: '/commercial/clients', icon: Users },
      { label: 'Ventas', href: '/commercial/sales', icon: TrendingUp },
      { label: 'Pagos y Cobros', href: '/commercial/payments', icon: CreditCard },
      { label: 'Gastos', href: '/commercial/expenses', icon: Receipt },
    ],
  },
];

export function Shell({ children }) {
  const pathname = usePathname();
  // Estado reactivo de alarmas — se actualiza cada 45 segundos (polling táctico)
  const [alarmCount, setAlarmCount] = useState(0);
  const [hasCritical, setHasCritical] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchAlarmSummary = async () => {
      try {
        // apiClient apunta al backend NestJS (NEXT_PUBLIC_API_URL → puerto 4000)
        const data = await apiClient.get('/dashboard/alarms');
        if (isMounted && data?.summary) {
          setAlarmCount(data.summary.total || 0);
          setHasCritical((data.summary.critical || 0) > 0);
        }
      } catch (error) {
        // Silencioso — no rompe la navegación si el backend no responde
        console.error('[SIDEBAR] Error cargando resumen de alarmas:', error);
      }
    };
    fetchAlarmSummary();
    const interval = setInterval(fetchAlarmSummary, 30000); // Refresco cada 30s
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar} aria-label="Navegación ERP MANNÁ">
        {/* CABECERA BOTÁNICA FIJA */}
        <div className={styles.brandWrapper}>
          <Leaf className={styles.brandLogoIcon} size={26} />
          <h1 className={styles.brandTitle}>MANNÁ</h1>
          <span className={styles.brandSubtitle}>Semilla · Tiempo · Fruto</span>
        </div>

        {/* NAVEGACIÓN COMPLETA CON SCROLL INTERNO */}
        <nav className={styles.navList}>
          {ERP_SECTIONS.map((section) => (
            <div key={section.category} className={styles.navGroup}>
              <span className={styles.groupTitle}>{section.category}</span>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
                const isAlarmItem = item.label === 'Alarmas SCADA';

                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  >
                    <Icon size={16} strokeWidth={isActive ? 2.2 : 1.75} />
                    <span>{item.label}</span>
                    {/* Badge dinámico: solo visible cuando hay alarmas reales */}
                    {isAlarmItem && alarmCount > 0 && (
                      <span className={`${styles.alarmBadge} ${hasCritical ? styles.badgeCritical : styles.badgeWarning}`}>
                        {alarmCount > 99 ? '99+' : alarmCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* PIE DE PÁGINA BOTÁNICO FIJO */}
        <div className={styles.sidebarFooter}>
          <Leaf className={styles.footerLeafIcon} size={18} />
          <div className={styles.footerQuote}>Procesos que dan vida</div>
          <div className={styles.footerSubQuote}>La tecnología también puede cuidar lo esencial.</div>
        </div>
      </aside>

      <div className={styles.mainContent}>
        <Header />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
