'use client';

import React, { useState } from 'react';
import { Milk, Package, CupSoda, Coffee } from 'lucide-react';

import styles from './ProductAvatar.module.css';

export default function ProductAvatar({ src, alt = 'Producto', size = 72, name = '', className = '', fluid = false }) {
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

  const dynamicStyle = fluid ? {} : {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    minHeight: `${size}px`,
  };

  const combinedClass = `${styles.avatarContainer} ${fluid ? styles.fluid : ''} ${className}`;

  if (!src || imgError) {
    return (
      <div style={dynamicStyle} className={combinedClass} title={alt}>
        {getLucideIcon()}
      </div>
    );
  }

  return (
    <div style={dynamicStyle} className={combinedClass}>
      <img
        src={src}
        alt={alt}
        onError={() => setImgError(true)}
        className={styles.avatarImage}
      />
    </div>
  );
}
