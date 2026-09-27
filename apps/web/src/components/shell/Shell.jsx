'use client';

import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import ServerOfflineCanvas from '@/components/ui/ServerOfflineCanvas';
import styles from './shell.module.css';

export function Shell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isServerOffline, setIsServerOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsServerOffline(true);
    const handleOnline = () => setIsServerOffline(false);

    window.addEventListener('manna:network-offline', handleOffline);
    window.addEventListener('manna:network-online', handleOnline);

    return () => {
      window.removeEventListener('manna:network-offline', handleOffline);
      window.removeEventListener('manna:network-online', handleOnline);
    };
  }, []);

  const handleRetryConnection = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, '');
    const res = await fetch(`${baseUrl}/health`).catch(() => null);
    if (!res || !res.ok) {
      throw new Error('Servidor no disponible');
    }
  };

  const handleToggle = () => {
    setCollapsed(prev => !prev);
  };

  const handleToggleMobile = () => {
    setMobileOpen(prev => !prev);
  };

  const handleCloseMobile = () => {
    setMobileOpen(false);
  };

  return (
    <div className={styles.layoutContainer}>
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggle}
        mobileOpen={mobileOpen}
        onCloseMobile={handleCloseMobile}
      />

      <div className={styles.mainContent}>
        <Header onToggleMobile={handleToggleMobile} />
        <main className={styles.content}>
          {isServerOffline ? (
            <ServerOfflineCanvas
              onRetry={handleRetryConnection}
              onRecovered={() => setIsServerOffline(false)}
            />
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

