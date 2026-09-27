'use client';
import React, { useRef, useEffect } from 'react';
import styles from './canvas-widgets.module.css';

/**
 * @file LiquidSilosCanvas.jsx
 * @module Dashboard/Components
 * @description Dos silos industriales transparentes con líquido animado.
 */
export default function LiquidSilosCanvas({ rawMaterialsValue, finishedProductsValue }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
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

    // Max values for scaling
    const maxRaw = Math.max(10000000, rawMaterialsValue * 1.2);
    const maxFin = Math.max(10000000, finishedProductsValue * 1.2);

    const drawSilo = (x, y, width, height, value, max, color1, color2, label, offsetAnim) => {
      const radius = width / 2;
      // Background / Glass
      ctx.fillStyle = 'rgba(28, 63, 53, 0.05)';
      ctx.strokeStyle = 'rgba(28, 63, 53, 0.25)';
      ctx.lineWidth = 2;
      
      // Cristal con cúpula superior completa (sin recorte) y base curva
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + height);
      ctx.arc(x + radius, y + height, radius, Math.PI, 0, true); // Base curva hacia abajo
      ctx.lineTo(x + width, y);
      ctx.arc(x + radius, y, radius, 0, Math.PI, true); // Cúpula superior arqueada hacia arriba
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Liquido
      const percent = Math.min(value / max, 1);
      const liquidHeight = height * percent;
      const liquidY = y + height - liquidHeight;

      if (percent > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + height);
        ctx.arc(x + radius, y + height, radius, Math.PI, 0, true);
        ctx.lineTo(x + width, y);
        ctx.arc(x + radius, y, radius, 0, Math.PI, true);
        ctx.closePath();
        ctx.clip();

        ctx.beginPath();
        ctx.moveTo(x, y + height + radius + 10);
        ctx.lineTo(x + width, y + height + radius + 10);
        ctx.lineTo(x + width, liquidY);
        for (let ix = 0; ix <= width; ix += 2) {
          ctx.lineTo(x + width - ix, liquidY + Math.sin(ix * 0.05 + offsetAnim) * 3);
        }
        ctx.lineTo(x, y + height + radius + 10);
        ctx.closePath();

        const grad = ctx.createLinearGradient(x, liquidY, x, y + height);
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }

      ctx.fillStyle = '#A8A29E';
      ctx.font = '10px monospace';
      for(let i=0; i<=4; i++) {
        const tickY = y + (height * i) / 4;
        ctx.beginPath();
        ctx.moveTo(x - 5, tickY);
        ctx.lineTo(x, tickY);
        ctx.stroke();
        ctx.fillText(`${100 - i*25}%`, x - 25, tickY + 3);
      }

      ctx.fillStyle = '#1C3F35';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + radius, y + height + radius + 14);
      
      const fmtValue = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
      ctx.fillStyle = color1;
      ctx.fillText(fmtValue, x + radius, y + height + radius + 27);
      ctx.textAlign = 'left';
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      ctx.fillStyle = '#FAF8F5';
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      const siloW = Math.min(74, Math.max(50, Math.floor(cssWidth * 0.28)));
      const radius = siloW / 2;
      const topPadding = radius + 12;
      const bottomPadding = radius + 36;
      const siloH = Math.max(70, Math.min(130, cssHeight - topPadding - bottomPadding));
      const space = (cssWidth - siloW * 2) / 3;

      drawSilo(space + 10, topPadding, siloW, siloH, rawMaterialsValue, maxRaw, '#F59E0B', '#B45309', 'MATERIA PRIMA', offset);
      drawSilo(space * 2 + siloW - 10, topPadding, siloW, siloH, finishedProductsValue, maxFin, '#10B981', '#047857', 'CAVA PRODUCTO', offset * 1.5);

      offset += 0.05;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [rawMaterialsValue, finishedProductsValue]);

  return (
    <div className={styles.siloCanvasWrapper}>
      <canvas ref={canvasRef} className={styles.canvasBlock} />
    </div>
  );
}
