'use client';
import React, { useRef, useEffect, useState } from 'react';

/**
 * @file RadarSweepCanvas.jsx
 * @module Dashboard/Components
 * @description Pantalla circular de radar vintage estilo fósforo verde/ámbar con retícula concéntrica y barrido rotatorio.
 */
export default function RadarSweepCanvas({ radarLots = [] }) {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  
  // Guardamos las coordenadas en el efecto para usarlas en los clics o hover
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

    // Posicionar puntos aleatorios basados en datos para no superponer todos en el centro
    const mappedItems = radarLots.map((lote, index) => {
      // Distancia según porcentaje de vida util (menor % -> mas al centro)
      const r = radius * 0.1 + (radius * 0.8 * (lote.porcentajeVidaUtil / 100));
      // Angulo fijo por item para que no cambien de lugar
      const theta = (index * (Math.PI * 2) / Math.max(radarLots.length, 1)) + (lote.id.length % 10) * 0.1;
      
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
      
      // Fondo lino (radar apagado) y desvanecimiento para estela
      ctx.fillStyle = 'rgba(250, 248, 245, 0.2)';
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Retícula
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(30, 46, 40, 0.12)'; // Fósforo esmeralda tenue
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
      grad.addColorStop(0, 'rgba(16, 185, 129, 0)');
      grad.addColorStop(1, 'rgba(16, 185, 129, 0.5)');
      ctx.fillStyle = grad;
      ctx.fill();
      // Aguja del barrido
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius, 0);
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Blips (Puntos)
      mappedItems.forEach(item => {
        // Calcular diferencia de angulo para iluminarlo cuando pasa la aguja
        let dTheta = (angle % (Math.PI * 2)) - item.theta;
        if (dTheta < 0) dTheta += Math.PI * 2;
        
        let alpha = 0.3;
        if (dTheta >= 0 && dTheta < 1) {
          alpha = 1 - dTheta;
        }

        ctx.beginPath();
        ctx.arc(item.x, item.y, 4, 0, Math.PI * 2);
        
        if (item.alerta === 'CRITICO') {
          ctx.fillStyle = `rgba(220, 38, 38, ${Math.max(0.4, alpha)})`; // Rojo
        } else if (item.alerta === 'PREVENCION') {
          ctx.fillStyle = `rgba(217, 119, 6, ${Math.max(0.4, alpha)})`; // Ambar
        } else {
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`; // Verde
        }
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

      angle -= 0.05; // Girar contrario a reloj o normal
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
    <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', background: '#FAF8F5', borderRadius: '8px' }}>
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
          background: 'rgba(250, 248, 245, 0.95)',
          border: `1px solid ${tooltip.item.alerta === 'CRITICO' ? '#DC2626' : tooltip.item.alerta === 'PREVENCION' ? '#D97706' : '#10B981'}`,
          color: '#1C3F35',
          padding: '8px',
          borderRadius: '4px',
          pointerEvents: 'none',
          fontSize: '12px',
          zIndex: 10
        }}>
          <strong>{tooltip.item.producto}</strong><br />
          Estado: {tooltip.item.alerta}<br />
          Vida útil: {tooltip.item.porcentajeVidaUtil}%<br />
          Vence en: {tooltip.item.diasRestantes} días
        </div>
      )}
    </div>
  );
}
