import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import styles from '../shell.module.css';

/**
 * @file SidebarNavItem.jsx
 * @module components/shell/parts
 * @description Renglón individual de navegación del Sidebar con soporte de desbloqueo progresivo.
 */
export function SidebarNavItem({ item, isActive, isUnlocked, requiredStepText, collapsed }) {
  const Icon = item.icon;

  if (!isUnlocked) {
    const lockedTitle = `Bloqueado: Requiere ${requiredStepText}`;
    return (
      <div
        className={`${styles.navItem} ${styles.navItemLocked}`}
        title={lockedTitle}
        role="button"
        aria-disabled="true"
        onClick={(e) => e.preventDefault()}
      >
        <Icon size={16} strokeWidth={1.75} />
        <span className={styles.navItemText}>{item.name}</span>
        <Lock size={12} className={styles.lockIcon} />
      </div>
    );
  }

  const handleClick = () => {
    if (item.path === '/catalog/recipes' && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('reset-recipe-modal'));
    }
  };

  return (
    <Link
      href={item.path}
      onClick={handleClick}
      className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
      title={collapsed ? item.name : undefined}
    >
      <Icon size={16} strokeWidth={isActive ? 2.2 : 1.75} />
      <span className={styles.navItemText}>{item.name}</span>
      {item.badge && <span className={styles.alarmBadge}>{item.badge}</span>}
    </Link>
  );
}
