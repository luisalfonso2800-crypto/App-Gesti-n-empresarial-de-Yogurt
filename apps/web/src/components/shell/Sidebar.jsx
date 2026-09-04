import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './shell.module.css';

const navItems = [
  {
    group: 'Catálogos',
    items: [
      { name: 'Presentaciones', path: '/catalog/presentations' },
      { name: 'Insumos', path: '/catalog/supplies' },
      { name: 'Proveedores', path: '/catalog/suppliers' },
      { name: 'Precios de Proveedores', path: '/catalog/supplier-prices' },
      { name: 'Productos', path: '/catalog/products' },
      { name: 'Recetas', path: '/catalog/recipes' },
    ]
  },
  {
    group: 'Operaciones',
    items: [
      { name: 'Compras', path: '/operations/purchases' },
      { name: 'Inventario', path: '/operations/inventory' },
      { name: 'Producción', path: '/operations/production' },
      { name: 'Lotes', path: '/operations/lots' },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>Yogurt ERP</div>
      <nav className={styles.nav}>
        {navItems.map((group) => (
          <div key={group.group} className={styles.navGroup}>
            <div className={styles.navGroupTitle}>{group.group}</div>
            {group.items.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );
}
