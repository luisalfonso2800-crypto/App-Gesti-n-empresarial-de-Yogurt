'use client';
import React, { useRef, useEffect } from 'react';

export default function SeismographChart({ sales, expenses }) {
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

    const maxVal = Math.max(sales, expenses, 1000);

    const draw = () => {
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Fondo Lino
      ctx.fillStyle = '#FAF8F5';
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Cuadrícula Milimétrica
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#E7E5E4'; // Tenue
      
      // Verticales en movimiento
      const gridSize = 20;
      for (let x = -(offset % gridSize); x < cssWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, cssHeight);
        ctx.stroke();
      }
      
      // Horizontales fijas
      for (let y = 0; y < cssHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cssWidth, y);
        ctx.stroke();
      }

      // Dibujar líneas sísmicas simuladas (Ventas vs Gastos)
      // Como solo tenemos 2 valores estáticos, simularemos el trazo en el tiempo con ruido (pulso vivo)
      const drawLine = (baseValue, color, phaseShift, noiseAmplitude) => {
        const baseY = cssHeight - (baseValue / maxVal) * (cssHeight - 30);
        
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';

        for (let x = 0; x <= cssWidth; x += 2) {
          // Generador de ruido/pulso basado en seno y offset temporal
          const noise = Math.sin((x + offset * 2 + phaseShift) * 0.05) * noiseAmplitude
                      + Math.sin((x - offset * 3) * 0.1) * (noiseAmplitude * 0.5);
          
          const y = baseY + noise;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      // Trazado de Ventas (Oro/Ámbar)
      drawLine(sales, '#D97706', 0, 4);
      
      // Trazado de Gastos (Carbón/Rojo Ladrillo)
      drawLine(expenses, '#991B1B', 100, 3);

      // UI Text Overlay
      ctx.fillStyle = '#44403C';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('VENTAS MES (ORO)', 10, 15);
      ctx.fillStyle = '#991B1B';
      ctx.fillText('GASTOS MES (CARBÓN)', 10, 30);

      // Borde del tambor
      ctx.strokeStyle = '#D6D3D1';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, cssWidth, cssHeight);

      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset scale

      offset += 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [sales, expenses]);

  return (
    <div style={{ width: '100%', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
