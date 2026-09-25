'use client';

/**
 * @file MannaWelcomeSplash.jsx
 * @module components/ui/MannaWelcomeSplash
 * @description Pantalla de bienvenida con Canvas de gotas/partículas doradas MANNÁ (SRP < 130 líneas).
 */
import React, { useEffect, useRef, useState } from 'react';
import styles from './MannaWelcomeSplash.module.css';

const SESSION_KEY = 'manna_app_opened';
const DISPLAY_DURATION_MS = 3800;

export default function MannaWelcomeSplash() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, 'true');

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / DISPLAY_DURATION_MS) * 100));
      setProgress(pct);
      if (progressBarRef.current) progressBarRef.current.style.width = `${pct}%`;
      if (elapsed >= DISPLAY_DURATION_MS) {
        clearInterval(interval);
        handleDismiss();
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setFading(true);
    setTimeout(() => setVisible(false), 800);
  };

  useEffect(() => {
    if (!visible || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.8 + 1.2,
      c: Math.random() > 0.4 ? 'rgba(197, 138, 62, ' : 'rgba(250, 248, 245, ',
      o: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 0.9 + 0.3),
      p: Math.random() * Math.PI
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.p += 0.03;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.c}${Math.max(0.1, p.o + Math.sin(p.p) * 0.25)})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#C58A3E';
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={`${styles.splashOverlay} ${fading ? styles.splashOverlayFading : ''}`}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.contentWrapper}>
        <div className={styles.logoBadge}><span className={styles.logoIcon}>🌾</span></div>
        <h1 className={styles.brandTitle}>MANNÁ</h1>
        <p className={styles.brandSubtitle}>Manufactura Láctea &amp; Gestión Artesanal</p>
        <div className={styles.quoteBox}>
          <p className={styles.quoteText}>&ldquo;El fruto del esfuerzo diario con la pureza del origen&rdquo;</p>
        </div>
        <div className={styles.progressContainer}>
          <div className={styles.progressBarTrack}>
            <div ref={progressBarRef} className={styles.progressBarFill} />
          </div>
          <span className={styles.progressLabel}>
            {progress < 40 ? 'Iniciando planta...' : progress < 80 ? 'Cargando inventarios...' : 'Listo'}
          </span>
        </div>
      </div>
      <button type="button" onClick={handleDismiss} className={styles.skipButton}>
        Entrar ahora ➔
      </button>
    </div>
  );
}
