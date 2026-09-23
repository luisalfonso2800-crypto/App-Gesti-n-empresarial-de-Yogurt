'use client';
import React, { useRef, useState, useCallback } from 'react';
import { useRadarRenderer } from '../hooks/useRadarRenderer';
import styles from './canvas-widgets.module.css';

/**
 * @file RadarSweepCanvas.jsx
 * @module Dashboard/Components
 * @description Pantalla circular de radar vintage estilo fósforo con lotes reales FEFO (SRP < 150 líneas).
 */
export default function RadarSweepCanvas({ radarLots = [] }) {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const itemsRef = useRef([]);

  const handleUpdateItems = useCallback((items) => {
    itemsRef.current = items;
  }, []);

  useRadarRenderer({ canvasRef, radarLots, onUpdateItems: handleUpdateItems });

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    let found = null;
    for (let item of itemsRef.current) {
      const dx = item.x - x;
      const dy = item.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < 10) {
        found = item;
        break;
      }
    }
    setTooltip(found ? { item: found, x, y } : null);
  };

  return (
    <div className={styles.radarWrapper}>
      <canvas 
        ref={canvasRef} 
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
        className={`${styles.radarCanvas} ${tooltip ? styles.radarCanvasPointer : styles.radarCanvasDefault}`} 
      />
      {tooltip && (
        <div 
          className={styles.radarTooltip}
          style={{
            left: `${tooltip.x + 15}px`,
            top: `${tooltip.y + 15}px`,
            borderColor: tooltip.item.color
          }}
        >
          <strong style={{ color: tooltip.item.color }}>{tooltip.item.producto}</strong><br />
          Lote: {tooltip.item.codigo}<br />
          Cant: {tooltip.item.cantidad}<br />
          Estado: {tooltip.item.severidad}<br />
          Vence en: {tooltip.item.diasRestantes} días
        </div>
      )}
    </div>
  );
}
