/**
 * @file useLiquidSilosRenderer.js
 * @module Dashboard/Hooks
 * @description Hook de renderizado y animación de la tríada de silos industriales (Materia Prima, WIP, Cava).
 */
export function useLiquidSilosRenderer({
  canvasRef,
  silosLayoutRef,
  rawMaterialsValue,
  wipValue,
  finishedProductsValue
}) {
  const drawSilo = (ctx, x, y, width, height, value, max, color1, color2, label, offsetAnim) => {
    const radius = width / 2;
    ctx.fillStyle = 'rgba(28, 63, 53, 0.05)';
    ctx.strokeStyle = 'rgba(28, 63, 53, 0.25)';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height);
    ctx.arc(x + radius, y + height, radius, Math.PI, 0, true);
    ctx.lineTo(x + width, y);
    ctx.arc(x + radius, y, radius, 0, Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

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
    ctx.font = '9px monospace';
    for (let i = 0; i <= 4; i++) {
      const tickY = y + (height * i) / 4;
      ctx.beginPath();
      ctx.moveTo(x - 4, tickY);
      ctx.lineTo(x, tickY);
      ctx.stroke();
      ctx.fillText(`${100 - i * 25}%`, Math.max(2, x - 22), tickY + 3);
    }

    ctx.fillStyle = '#1C3F35';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + radius, y + height + radius + 13);
    
    const fmtValue = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
    ctx.fillStyle = color1;
    ctx.fillText(fmtValue, x + radius, y + height + radius + 25);
    ctx.textAlign = 'left';
  };

  return { drawSilo };
}
