'use client';
import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import styles from './shell.module.css';

export function Shell({ children }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
