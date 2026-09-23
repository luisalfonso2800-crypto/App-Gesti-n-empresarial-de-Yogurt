'use client';
import { useRef, useEffect } from 'react';

/**
 * @file useRadarRenderer.js
 * @module Dashboard/Hooks
 * @description Hook de renderizado de animación de barrido de radar fósforo vintage.
 */
export function useRadarRenderer({ canvasRef, radarLots, onUpdateItems }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let angle = 0;

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.parentElement?.clientWidth || 300;
    const cssHeight = 300;
    const cx = cssWidth / 2;
    const cy = cssHeight / 2;
    const radius = Math.min(cx, cy) - 10;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    const mappedItems = radarLots.map((lote) => {
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
    onUpdateItems(mappedItems);

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#182622';
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Retícula
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(202, 213, 181, 0.2)';
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
      grad.addColorStop(1, 'rgba(202, 213, 181, 0.5)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Aguja
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
        if (dTheta >= 0 && dTheta < 1) alpha = 1 - dTheta;

        ctx.beginPath();
        ctx.arc(item.x, item.y, 4, 0, Math.PI * 2);
        const hex = item.color || '#10B981';
        let r = 16, g = 185, b = 129;
        if (hex === '#EF4444') { r = 239; g = 68; b = 68; }
        else if (hex === '#D97706') { r = 217; g = 119; b = 6; }
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0.4, alpha)})`;
        ctx.fill();

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
  }, [radarLots, canvasRef, onUpdateItems]);
}
