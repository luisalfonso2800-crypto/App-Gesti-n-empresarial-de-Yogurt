'use client';
import React, { useRef, useEffect } from 'react';
import styles from './canvas-widgets.module.css';

/**
 * @file OscilloscopeCanvas.jsx
 * @module Dashboard/Components
 * @description Registro tipo tambor sismográfico con ondas de Ventas y Gastos con base en 12 puntos históricos.
 */
export default function OscilloscopeCanvas({ trendSales = [], trendExpenses = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let offset = 0;

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.parentElement.clientWidth || 600;
    const cssHeight = 160;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    const allValues = [...trendSales, ...trendExpenses];
    const maxVal = Math.max(...allValues, 1000);

    // Expandimos los 12 puntos en todo el canvas para hacer una onda continua
    const points = trendSales.length;
    const stepX = cssWidth / Math.max(1, points - 1);

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Fondo Papel Lino / Marfil
      ctx.fillStyle = '#FAF8F5';
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Cuadrícula Milimétrica
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#EFEAE1';
      
      const gridSize = 20;
      for (let x = -(offset % gridSize); x < cssWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, cssHeight);
        ctx.stroke();
      }
      for (let y = 0; y < cssHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cssWidth, y);
        ctx.stroke();
      }

      const drawDataWave = (data, color, phaseOffset) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';

        for (let i = 0; i < points - 1; i++) {
          const x0 = i * stepX;
          const y0 = cssHeight - (data[i] / maxVal) * (cssHeight - 30);
          const x1 = (i + 1) * stepX;
          const y1 = cssHeight - (data[i+1] / maxVal) * (cssHeight - 30);
          
          if (i === 0) ctx.moveTo(x0, y0);
          
          // Bezier para suavizar
          const cpX = x0 + (x1 - x0) / 2;
          
          // Agregamos ruido de osciloscopio
          const noiseY = Math.sin(offset * 0.2 + i * phaseOffset) * 2;

          ctx.bezierCurveTo(cpX, y0 + noiseY, cpX, y1 + noiseY, x1, y1 + noiseY);
        }
        ctx.stroke();
        
        // Cabezal vivo (aguja)
        if (points > 0) {
          const lastX = (points - 1) * stepX;
          const lastY = cssHeight - (data[points-1] / maxVal) * (cssHeight - 30);
          const noiseY = Math.sin(offset * 0.2 + (points-1) * phaseOffset) * 2;
          
          ctx.beginPath();
          ctx.arc(lastX, lastY + noiseY, 3, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      };

      // Trazados
      if (trendSales.length > 0) drawDataWave(trendSales, '#1C3F35', 1); // Verde Bosque
      if (trendExpenses.length > 0) drawDataWave(trendExpenses, '#B91C1C', 2); // Terracota

      // Textos
      ctx.fillStyle = '#1C3F35';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('VENTAS MES (VERDE BOSQUE)', 10, 15);
      ctx.fillStyle = '#B91C1C';
      ctx.fillText('GASTOS MES (TERRACOTA)', 10, 30);

      ctx.strokeStyle = '#D6D3D1';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, cssWidth, cssHeight);

      offset += 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [trendSales, trendExpenses]);

  return (
    <div className={styles.canvasWrapper}>
      <canvas ref={canvasRef} className={styles.canvasBlock} />
    </div>
  );
}
