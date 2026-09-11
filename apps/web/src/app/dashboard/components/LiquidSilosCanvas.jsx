'use client';
import React, { useRef, useEffect } from 'react';

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
    const cssWidth = canvas.parentElement.clientWidth || 400;
    const cssHeight = 250;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    // Max values for scaling
    const maxRaw = Math.max(10000000, rawMaterialsValue * 1.2);
    const maxFin = Math.max(10000000, finishedProductsValue * 1.2);

    const drawSilo = (x, y, width, height, value, max, color1, color2, label, offsetAnim) => {
      // Background / Glass
      ctx.fillStyle = 'rgba(28, 63, 53, 0.05)';
      ctx.strokeStyle = 'rgba(28, 63, 53, 0.2)';
      ctx.lineWidth = 2;
      
      // Cristal
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + height);
      ctx.arc(x + width/2, y + height, width/2, Math.PI, 0, true); // Base curva
      ctx.lineTo(x + width, y);
      ctx.arc(x + width/2, y, width/2, 0, Math.PI, true); // Tapa curva
      ctx.fill();
      ctx.stroke();

      // Liquido
      const percent = Math.min(value / max, 1);
      const liquidHeight = height * percent;
      const liquidY = y + height - liquidHeight;

      if (percent > 0) {
        ctx.save();
        ctx.beginPath();
        // Path recortado para el líquido
        ctx.moveTo(x, y + height);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x + width, liquidY);
        
        // Onda sinusoidal superior
        for (let ix = 0; ix <= width; ix += 2) {
          const waveY = liquidY + Math.sin(ix * 0.05 + offsetAnim) * 3;
          ctx.lineTo(x + width - ix, waveY);
        }
        
        ctx.lineTo(x, y + height);
        ctx.clip();

        // Gradient
        const grad = ctx.createLinearGradient(x, liquidY, x, y + height);
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }

      // Indicadores
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

      // Label
      ctx.fillStyle = '#1C3F35';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + width/2, y + height + 20);
      
      // Value display
      const fmtValue = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
      ctx.fillStyle = color1;
      ctx.fillText(fmtValue, x + width/2, y + height + 35);
      ctx.textAlign = 'left';
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      
      // Fondo
      ctx.fillStyle = '#FAF8F5';
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      const siloW = 80;
      const siloH = 150;
      const space = (cssWidth - siloW * 2) / 3;

      // Silo Materia Prima (Ambar Lechoso)
      drawSilo(space + 20, 30, siloW, siloH, rawMaterialsValue, maxRaw, '#F59E0B', '#B45309', 'MATERIA PRIMA', offset);
      
      // Silo Cava (Verde/Crema Lácteo)
      drawSilo(space * 2 + siloW, 30, siloW, siloH, finishedProductsValue, maxFin, '#10B981', '#047857', 'CAVA PRODUCTO', offset * 1.5);

      offset += 0.05;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [rawMaterialsValue, finishedProductsValue]);

  return (
    <div style={{ width: '100%', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
