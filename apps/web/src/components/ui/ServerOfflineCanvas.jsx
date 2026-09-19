'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Leaf, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ReconnectionChecklist } from './parts/ReconnectionChecklist';
import styles from './server-offline-canvas.module.css';

/**
 * @file ServerOfflineCanvas.jsx
 * @module components/ui/ServerOfflineCanvas
 * @description Estado de desconexión con handshake secuencial y desvanecimiento suave.
 */
export default function ServerOfflineCanvas({
  onRetry,
  onRecovered,
  title = 'Sincronizando con Servidor de Planta',
  message = 'El enlace operativo se ha pausado temporalmente o el servicio está iniciando. Reintentando enlace automáticamente...',
  statusBadge = 'Estado: Reconectando SCADA Bus...'
}) {
  const [phase, setPhase] = useState('offline'); // 'offline' | 'handshake' | 'closing'
  const [isChecking, setIsChecking] = useState(false);
  const timersRef = useRef([]);

  const checkApiConnection = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    const urls = [`${baseUrl}/system/onboarding-status`, `${baseUrl}/system`, '/api/v1/system/onboarding-status', '/api/v1/system'];
    for (const url of urls) {
      try {
        const res = await fetch(url, { method: 'GET', cache: 'no-store' });
        if (res.ok) return true;
      } catch { /* Fallback silencioso */ }
    }
    return false;
  };

  useEffect(() => {
    if (phase !== 'offline') return;
    const timer = setInterval(async () => {
      if (isChecking) return;
      const isOnline = await checkApiConnection();
      if (isOnline) {
        clearInterval(timer);
        triggerHandshakeSequence();
      }
    }, 2500);

    const handleOnline = () => {
      if (phase === 'offline') {
        clearInterval(timer);
        triggerHandshakeSequence();
      }
    };
    if (typeof window !== 'undefined') window.addEventListener('manna:network-online', handleOnline);
    return () => {
      clearInterval(timer);
      if (typeof window !== 'undefined') window.removeEventListener('manna:network-online', handleOnline);
      timersRef.current.forEach(clearTimeout);
    };
  }, [phase, isChecking]);

  const triggerHandshakeSequence = () => {
    setPhase('handshake');
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('manna:network-online'));
    const handshakeTimer = setTimeout(() => {
      setPhase('closing');
      const closingTimer = setTimeout(() => {
        if (typeof onRecovered === 'function') onRecovered();
        else if (typeof onRetry === 'function') onRetry();
        else if (typeof window !== 'undefined') window.location.reload();
      }, 400);
      timersRef.current.push(closingTimer);
    }, 800);
    timersRef.current.push(handshakeTimer);
  };

  const handleRetry = async () => {
    if (isChecking || phase !== 'offline') return;
    setIsChecking(true);
    try {
      if (typeof onRetry === 'function') {
        await onRetry();
        triggerHandshakeSequence();
        return;
      }
      const isOnline = await checkApiConnection();
      if (!isOnline) throw new Error('Servidor no disponible');
      triggerHandshakeSequence();
    } catch {
      setIsChecking(false);
    }
  };

  const isHandshake = phase === 'handshake' || phase === 'closing';

  return (
    <div className={`${styles.canvasContainer} ${phase === 'closing' ? styles.fadeOut : ''}`} role="status" aria-live="polite">
      <div className={isHandshake ? styles.iconWrapperSuccess : styles.iconWrapper} aria-hidden="true">
        {isHandshake ? <CheckCircle2 size={42} className={styles.checkIcon} /> : <Leaf size={42} className={styles.leafIcon} />}
      </div>

      <h2 className={styles.title}>{isHandshake ? 'Enlace Operativo Confirmado' : title}</h2>
      {!isHandshake && <p className={styles.message}>{message}</p>}

      {!isHandshake && (
        <div className={styles.badge}>
          <span className={styles.statusDot} aria-hidden="true" />
          <span>{statusBadge}</span>
        </div>
      )}

      {isHandshake ? (
        <ReconnectionChecklist />
      ) : (
        <button type="button" onClick={handleRetry} disabled={isChecking} className={styles.retryButton}>
          <RefreshCw size={15} className={isChecking ? styles.spinIcon : ''} />
          <span>{isChecking ? 'Comprobando Enlace...' : 'Reintentar Conexión'}</span>
        </button>
      )}
    </div>
  );
}
