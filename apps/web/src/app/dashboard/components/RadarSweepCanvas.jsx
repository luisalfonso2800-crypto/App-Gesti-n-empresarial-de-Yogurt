'use client';
import React, { useRef, useEffect, useState } from 'react';

/**
 * @file RadarSweepCanvas.jsx
 * @module Dashboard/Components
 * @description Pantalla circular de radar vintage estilo fósforo con lotes reales FEFO.
 */
export default function RadarSweepCanvas({ radarLots = [] }) {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  
  const itemsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let angle = 0;

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.parentElement.clientWidth || 300;
    const cssHeight = 300;
    const cx = cssWidth / 2;
    const cy = cssHeight / 2;
    const radius = Math.min(cx, cy) - 10;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    const mappedItems = radarLots.map((lote) => {
      // Usar las distancias y ángulos pre-calculados por el backend (Simulation/FEFO Engine)
      const r = radius * (lote.distancia || 0.5);
      const theta = lote.angulo || 0;
      
      return {
        ...lote,
        r,
        theta,
        x: cx + r * Math.cos(theta),
        y: cy + r * Math.sin(theta)
      };
    });
    itemsRef.current = mappedItems;

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      // Fondo cabina #182622
      ctx.fillStyle = '#182622';
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Retícula
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(202, 213, 181, 0.2)'; // CAD5B5 tenue
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius / 3) * i, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius); ctx.lineTo(cx, cy + radius);
      ctx.moveTo(cx - radius, cy); ctx.lineTo(cx + radius, cy);
      ctx.stroke();

      // Barrido
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, 0, 0.2);
      ctx.lineTo(0, 0);
      const grad = ctx.createLinearGradient(0, 0, radius * Math.cos(0.2), radius * Math.sin(0.2));
      grad.addColorStop(0, 'rgba(202, 213, 181, 0)');
      grad.addColorStop(1, 'rgba(202, 213, 181, 0.5)'); // #CAD5B5
      ctx.fillStyle = grad;
      ctx.fill();
      // Aguja del barrido
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius, 0);
      ctx.strokeStyle = '#CAD5B5';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Blips (Puntos)
      mappedItems.forEach(item => {
        let dTheta = (angle % (Math.PI * 2)) - item.theta;
        if (dTheta < 0) dTheta += Math.PI * 2;
        
        let alpha = 0.3;
        if (dTheta >= 0 && dTheta < 1) {
          alpha = 1 - dTheta;
        }

        ctx.beginPath();
        ctx.arc(item.x, item.y, 4, 0, Math.PI * 2);
        
        // Colores pre-calculados por el backend (Rojo #EF4444, Ámbar #D97706, Salvia #10B981)
        const hex = item.color || '#10B981';
        // Convert hex to rgb for alpha manipulation
        let r = 16, g = 185, b = 129; // default green
        if (hex === '#EF4444') { r = 239; g = 68; b = 68; }
        else if (hex === '#D97706') { r = 217; g = 119; b = 6; }
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0.4, alpha)})`;
        ctx.fill();
        
        // Pulso
        if (alpha > 0.8) {
          ctx.beginPath();
          ctx.arc(item.x, item.y, 10 * alpha, 0, Math.PI * 2);
          ctx.strokeStyle = ctx.fillStyle;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      angle -= 0.05;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [radarLots]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    let found = null;
    for (let item of itemsRef.current) {
      const dx = item.x - x;
      const dy = item.y - y;
      if (Math.sqrt(dx*dx + dy*dy) < 10) {
        found = item;
        break;
      }
    }
    setTooltip(found ? { item: found, x, y } : null);
  };

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', background: '#182622', borderRadius: '8px' }}>
      <canvas 
        ref={canvasRef} 
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
        style={{ display: 'block', cursor: tooltip ? 'pointer' : 'default' }} 
      />
      {tooltip && (
        <div style={{
          position: 'absolute',
          left: tooltip.x + 15,
          top: tooltip.y + 15,
          background: 'rgba(24, 38, 34, 0.95)',
          border: `1px solid ${tooltip.item.color}`,
          color: '#F7F4EE',
          padding: '8px',
          borderRadius: '4px',
          pointerEvents: 'none',
          fontSize: '12px',
          zIndex: 10,
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}>
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
