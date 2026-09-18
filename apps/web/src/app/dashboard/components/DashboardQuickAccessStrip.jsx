import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Tag, Package, CreditCard, TrendingUp, Lock } from 'lucide-react';
import { isRouteUnlocked } from '@/lib/onboarding-unlock-rules';
import styles from '../Dashboard.module.css';

const QUICK_CARDS = [
  {
    path: '/operations/purchases',
    category: 'MÓDULO',
    title: 'Compras',
    icon: ShoppingCart
  },
  {
    path: '/catalog/supplier-prices',
    category: 'INSUMOS',
    title: 'Precios Proveedor',
    icon: Tag
  },
  {
    path: '/catalog/products',
    category: 'CATÁLOGO',
    title: 'Productos',
    icon: Package
  },
  {
    path: '/commercial/payments',
    category: 'TESORERÍA',
    title: 'Pagos y Cobros',
    icon: CreditCard
  },
  {
    path: '/commercial/sales',
    category: 'COMERCIAL',
    title: 'Ventas',
    icon: TrendingUp
  }
];

/**
 * @file DashboardQuickAccessStrip.jsx
 * @description Cinta táctica de accesos rápidos del Dashboard con Progressive Disclosure.
 */
export function DashboardQuickAccessStrip({ onboardingData }) {
  return (
    <section className={styles.quickAccessGrid} aria-label="Accesos Rápidos Operativos">
      {QUICK_CARDS.map((card) => {
        const { isUnlocked, requiredStepText } = isRouteUnlocked(card.path, onboardingData);
        const Icon = card.icon;

        if (!isUnlocked) {
          const lockedTitle = `Bloqueado: Requiere ${requiredStepText}`;
          return (
            <div
              key={card.path}
              className={`${styles.actionCard} ${styles.cardLocked}`}
              title={lockedTitle}
              role="button"
              aria-disabled="true"
              onClick={(e) => e.preventDefault()}
            >
              <div className={styles.cardIconWrapper}>
                <Icon className={styles.actionCardIcon} size={18} />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.actionCardCategory}>{card.category}</span>
                <strong className={styles.actionCardTitle}>{card.title}</strong>
              </div>
              <div className={styles.cardLockBadge}>
                <Lock size={13} />
              </div>
            </div>
          );
        }

        return (
          <Link key={card.path} className={styles.actionCard} href={card.path}>
            <div className={styles.cardIconWrapper}>
              <Icon className={styles.actionCardIcon} size={18} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.actionCardCategory}>{card.category}</span>
              <strong className={styles.actionCardTitle}>{card.title}</strong>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
