'use client';
import React, { useRef, useEffect } from 'react';
import { useLiquidSilosRenderer } from '../hooks/useLiquidSilosRenderer';
import styles from './canvas-widgets.module.css';

/**
 * @file LiquidSilosCanvas.jsx
 * @module Dashboard/Components
 * @description Tríada de silos industriales (Materia Prima, WIP, Cava) interactivos con líquido animado.
 */
export default function LiquidSilosCanvas({
  rawMaterialsValue = 0,
  wipValue = 0,
  finishedProductsValue = 0,
  onSiloClick
}) {
  const canvasRef = useRef(null);
  const silosLayoutRef = useRef([]);
  const { drawSilo } = useLiquidSilosRenderer({});

  const handleClick = (e) => {
    if (!canvasRef.current || !onSiloClick) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const clicked = silosLayoutRef.current.find(s =>
      clickX >= s.x - 10 && clickX <= s.x + s.width + 10 &&
      clickY >= s.y - s.radius - 10 && clickY <= s.y + s.height + s.radius + 35
    );
    if (clicked) onSiloClick(clicked.id);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let offset = 0;

    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    const cssWidth = parent?.clientWidth || 400;
    const cssHeight = Math.max(220, parent?.clientHeight || 220);

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    const maxRaw = Math.max(10000000, rawMaterialsValue * 1.2);
    const maxWip = Math.max(10000000, wipValue * 1.2);
    const maxFin = Math.max(10000000, finishedProductsValue * 1.2);

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      ctx.fillStyle = '#FAF8F5';
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      const siloW = Math.min(62, Math.max(42, Math.floor(cssWidth * 0.20)));
      const radius = siloW / 2;
      const topPadding = radius + 12;
      const bottomPadding = radius + 34;
      const siloH = Math.max(65, Math.min(125, cssHeight - topPadding - bottomPadding));
      const space = (cssWidth - siloW * 3) / 4;

      const s1X = space + 4;
      const s2X = space * 2 + siloW;
      const s3X = space * 3 + siloW * 2 - 4;

      silosLayoutRef.current = [
        { id: 'RAW', x: s1X, y: topPadding, width: siloW, height: siloH, radius },
        { id: 'WIP', x: s2X, y: topPadding, width: siloW, height: siloH, radius },
        { id: 'CAVA', x: s3X, y: topPadding, width: siloW, height: siloH, radius }
      ];

      drawSilo(ctx, s1X, topPadding, siloW, siloH, rawMaterialsValue, maxRaw, '#F59E0B', '#B45309', 'MATERIA PRIMA', offset);
      drawSilo(ctx, s2X, topPadding, siloW, siloH, wipValue, maxWip, '#8B5CF6', '#6D28D9', 'WIP EN PROCESO', offset * 1.25);
      drawSilo(ctx, s3X, topPadding, siloW, siloH, finishedProductsValue, maxFin, '#10B981', '#047857', 'CAVA PRODUCTO', offset * 1.5);

      offset += 0.05;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [rawMaterialsValue, wipValue, finishedProductsValue, drawSilo]);

  return (
    <div className={styles.siloCanvasWrapper}>
      <canvas ref={canvasRef} onClick={handleClick} className={styles.siloCanvasInteractive} />
    </div>
  );
}
