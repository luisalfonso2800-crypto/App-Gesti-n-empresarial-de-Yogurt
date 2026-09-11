'use client';
import React, { useRef, useEffect } from 'react';

export default function AnalogGauge({ value, label }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let currentVal = 0; // Starts at 0, interpolates to value

    const draw = () => {
      // Suavizado (amortiguación)
      currentVal += (value - currentVal) * 0.08;

      // Escala para alta resolución (evitar bordes pixelados en pantallas retina)
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = 140;
      const cssHeight = 80;
      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, cssWidth, cssHeight);
      const cx = cssWidth / 2;
      const cy = cssHeight - 5;
      const radius = cx - 15;

      // Cuadrícula cristal tenue
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) {
        const a = Math.PI + (Math.PI * (i / 10));
        ctx.moveTo(cx + Math.cos(a) * (radius - 5), cy + Math.sin(a) * (radius - 5));
        ctx.lineTo(cx + Math.cos(a) * (radius + 5), cy + Math.sin(a) * (radius + 5));
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#57534E';
      ctx.stroke();

      // Arco Base Oscuro
      ctx.beginPath();
      ctx.arc(cx, cy, radius, Math.PI, 0);
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#292524';
      ctx.stroke();

      // Zona Ámbar (<30%)
      ctx.beginPath();
      ctx.arc(cx, cy, radius, Math.PI, Math.PI + (Math.PI * 0.3));
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#D97706';
      ctx.stroke();

      // Zona Verde (>30%)
      ctx.beginPath();
      ctx.arc(cx, cy, radius, Math.PI + (Math.PI * 0.3), 0);
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#10B981';
      ctx.stroke();

      // Aguja
      const clamped = Math.min(Math.max(currentVal, 0), 100);
      const angle = Math.PI + (Math.PI * (clamped / 100));
      const nx = cx + Math.cos(angle) * (radius - 8);
      const ny = cy + Math.sin(angle) * (radius - 8);
      
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#FAF8F5';
      ctx.lineCap = 'round';
      ctx.stroke();

      // Eje Central
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#D97706';
      ctx.fill();
      ctx.strokeStyle = '#FAF8F5';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Texto Valor
      ctx.fillStyle = '#FAF8F5';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${clamped.toFixed(1)}%`, cx, cy - 15);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <canvas ref={canvasRef} style={{ width: '140px', height: '80px', display: 'block' }} />
      <span style={{ fontSize: '0.65rem', color: '#A8A29E', fontFamily: 'monospace', textTransform: 'uppercase', marginTop: '4px' }}>
        {label}
      </span>
    </div>
  );
}
