import React from 'react';
import Link from 'next/link';
import styles from './shell.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerLinks}>
        <Link href="/" className={styles.headerLink}>Dashboard</Link>
        <Link href="/catalog/products" className={styles.headerLink}>Catálogos</Link>
        <Link href="/operations/purchases" className={styles.headerLink}>Operaciones</Link>
        <Link href="/commercial/sales" className={styles.headerLink}>Comercial</Link>
      </div>
      <div>Bienvenido</div>
    </header>
  );
}
