/**
 * @file ProductMobileCard.jsx
 * @module catalog/products/components
 * @description Tarjeta fluida para visualización de producto en pantallas móviles (MAN-UI-002, SRP < 120 líneas).
 * @responsibility Renderizar avatar, ficha resumida, precio, estado y botones de acción táctiles (touch targets >= 40px).
 * @usedBy apps/web/src/app/catalog/products/components/ProductsTable.jsx
 * @dependencies react, lucide-react, @/lib/presetImages, @/lib/formatters, ./products-table.module.css
 */
'use client';

import React from 'react';
import { Pencil, Trash2, Power } from 'lucide-react';
import ProductAvatar from '@/components/ui/ProductAvatar';
import { resolveProductImage } from '@/lib/presetImages';
import { formatCurrency } from '@/lib/formatters';
import styles from './products-table.module.css';

export function ProductMobileCard({
  item,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  onToggleActive
}) {
  const numPrice = Number(item.precioVenta) || 0;
  const isDeactivated = item.activo === false;
  const hasPresentation = Boolean(item.idPresentacion || item.presentacionId || item.presentacion?.id);
  const isReady = numPrice > 0 && hasPresentation && !isDeactivated;

  return (
    <div className={`${styles.mobileCard} ${isSelected ? styles.mobileCardSelected : ''}`}>
      <div className={styles.mobileCardHeader}>
        <div className={styles.mobileCardLeft}>
          <input
            type="checkbox"
            className={styles.rowCheckbox}
            checked={isSelected}
            onChange={() => onToggleSelect && onToggleSelect(item.id)}
            aria-label={`Seleccionar ${item.nombre}`}
          />
          <ProductAvatar
            src={resolveProductImage(item)}
            alt={item.nombre}
            name={item.nombre}
            size={40}
          />
          <div className={styles.mobileProductInfo}>
            <span className={styles.mobileProductTitle}>{item.nombre}</span>
            <span className={styles.mobileProductSub}>
              {item.presentacion?.nombre || (item.categoria?.includes('WIP') ? 'A Granel' : 'Estándar')}
            </span>
          </div>
        </div>

        <span className={isDeactivated ? styles.statusRed : isReady ? styles.statusGreen : styles.statusYellow}>
          {isDeactivated ? '🔴 Inactivo' : isReady ? '🟢 Listo' : '🟡 Incompleto'}
        </span>
      </div>

      <div className={styles.mobileCardBody}>
        <div className={styles.mobileDataRow}>
          <span className={styles.mobileDataLabel}>Categoría:</span>
          <span className={styles.mobileDataValue}>{item.categoria || 'Sin categoría'}</span>
        </div>
        <div className={styles.mobileDataRow}>
          <span className={styles.mobileDataLabel}>Canal:</span>
          <span className={styles.mobileDataValue}>
            {item.canalVenta === 'SOLO_PLANTA' || item.canalVenta === 'USO_INTERNO' ? 'Uso Planta (WIP)' : 'Comercial'}
          </span>
        </div>
        <div className={styles.mobileDataRow}>
          <span className={styles.mobileDataLabel}>Precio Venta:</span>
          <span className={styles.mobilePriceValue}>
            {numPrice > 0 ? formatCurrency(numPrice) : '$0 (Costo Interno)'}
          </span>
        </div>
      </div>

      <div className={styles.mobileCardActions}>
        {onToggleActive && (
          <button
            type="button"
            className={isDeactivated ? styles.btnActionActivate : styles.btnActionDeactivate}
            onClick={() => onToggleActive(item)}
            title={isDeactivated ? 'Activar producto' : 'Desactivar producto'}
            aria-label={isDeactivated ? 'Activar' : 'Desactivar'}
          >
            <Power size={15} />
            <span>{isDeactivated ? 'Activar' : 'Pausar'}</span>
          </button>
        )}
        <button
          type="button"
          className={styles.btnActionEdit}
          onClick={() => onEdit && onEdit(item)}
          title="Editar producto"
          aria-label="Editar"
        >
          <Pencil size={15} />
          <span>Editar</span>
        </button>
        {onDelete && (
          <button
            type="button"
            className={styles.btnActionDelete}
            onClick={() => onDelete && onDelete(item)}
            title="Eliminar producto"
            aria-label="Eliminar"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
