# COMPONENTE PRODUCTAVATAR CON FALLBACK DE LUCIDE-REACT Y TAMAÑO VISUAL ÓPTIMO

REGLAS DE MÁXIMO AHORRO DE CUOTA:
- Modo bisturí: modifica únicamente los archivos indicados.
- Cero Tailwind: utiliza CSS Modules y Lucide React ya instalado en el proyecto.
- Cero imágenes rotas: si la URL no existe o falla en cargar (`onError`), renderiza automáticamente un icono elegante de Lucide (`Milk`, `Package`, o `CupSoda`) sobre fondo lino vintage.

---

### 1. CREAR COMPONENTE `apps/web/src/components/ui/ProductAvatar.jsx`:
Crea un componente blindado contra fallas de imagen:

```jsx
'use client';

import React, { useState } from 'react';
import { Milk, Package, CupSoda, Coffee } from 'lucide-react';

export default function ProductAvatar({ src, alt = 'Producto', size = 52, name = '', className = '' }) {
  const [imgError, setImgError] = useState(false);

  // Selector de icono Lucide según texto del producto
  const getLucideIcon = () => {
    const text = (name || alt || '').toLowerCase();
    const iconProps = { size: Math.round(size * 0.55), color: '#1E2E28', strokeWidth: 1.75 };

    if (text.includes('1l') || text.includes('litro') || text.includes('botella')) {
      return <Milk {...iconProps}/>;
    }
    if (text.includes('3.5') || text.includes('escolar') || text.includes('vaso')) {
      return <CupSoda {...iconProps}/>;
    }
    if (text.includes('griego') || text.includes('500')) {
      return <Coffee {...iconProps}/>;
    }
    return <Package {...iconProps}/>;
  };

  const containerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    minHeight: `${size}px`,
    borderRadius: '10px',
    backgroundColor: '#FAF8F5',
    border: '1px solid #E8E2D7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  };

  if (!src || imgError) {
    return (
      <div style={containerStyle} className={className} title={alt}>
        {getLucideIcon()}
      </div>
    );
  }

  return (
    <div style={containerStyle} className={className}>
      <img
        src={src}
        alt={alt}
        onError={() => setImgError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />
    </div>
  );
}