/**
 * @file ProductTableRow.jsx
 * @module catalog/products/components
 * @description Fila individual del listado de productos terminados (SRP < 150 líneas).
 * @responsibility Renderizado de avatar compacto, nombre con presentación, chip de categoría, precio formateado y acciones.
 * @usedBy apps/web/src/app/catalog/products/components/ProductsTable.jsx
 * @dependencies @/components/ui/Table, @/components/ui/Badge, @/components/ui/ProductAvatar, @/lib/presetImages, @/lib/formatters
 */
import React from 'react';
import { TR, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { resolveProductImage } from '@/lib/presetImages';
import { formatCurrency } from '@/lib/formatters';
import ProductAvatar from '@/components/ui/ProductAvatar';
import styles from './products-table.module.css';

const CATEGORY_MAP = {
  BASES_LACTEAS: { label: 'Bases Lácteas', className: styles.catBasesLacteas },
  DULCES_JALEAS: { label: 'Dulces y Jaleas', className: styles.catDulcesJaleas },
  TOPPING_CEREAL: { label: 'Topping / Cereal (WIP)', className: styles.catToppingCereal },
  INSUMO_BASE_WIP: { label: 'Premezcla Planta (WIP)', className: styles.catInsumoBaseWip },
  LACTEOS: { label: 'Lácteos Terminados', className: styles.catLacteos },
  POSTRES: { label: 'Postres y Otros', className: styles.catPostres },
  BEBIDAS: { label: 'Bebidas', className: styles.catBebidas }
};

const CHANNEL_MAP = {
  SOLO_PLANTA: { label: 'Solo Planta', className: styles.chanSoloPlanta },
  USO_INTERNO: { label: 'Solo Planta', className: styles.chanSoloPlanta },
  MIXTO: { label: 'Mixto', className: styles.chanMixto },
  B2B: { label: 'B2B', className: styles.chanB2B },
  B2C: { label: 'B2C', className: styles.chanB2C },
  AMBOS: { label: 'Mixto', className: styles.chanAmbos }
};

export function ProductTableRow({
  item,
  isSelected = false,
  onToggleSelect,
  isHovered = false,
  onHoverProduct,
  onEdit,
  onDelete
}) {
  const categoryConfig = CATEGORY_MAP[item.categoria] || {
    label: item.categoria || 'Sin Categoría',
    className: styles.catDefault
  };

  const channelKey = item.canalVenta || (item.categoria?.includes('WIP') ? 'SOLO_PLANTA' : 'AMBOS');
  const channelConfig = CHANNEL_MAP[channelKey] || {
    label: item.canalVenta || 'Comercial',
    className: styles.chanDefault
  };

  const presentationText = item.presentacion?.nombre || (item.categoria?.includes('WIP') ? 'A Granel' : null);
  const numPrice = Number(item.precioVenta) || 0;

  const handleDoubleClick = (e) => {
    // Evitar disparar si se hizo doble clic dentro de un botón o input
    if (e.target.closest('button') || e.target.closest('input')) return;
    onToggleSelect?.(item.id);
  };

  return (
    <TR
      className={`${styles.tableRow} ${isHovered ? styles.tableRowActive : ''}`}
      onMouseEnter={() => onHoverProduct && onHoverProduct(item)}
      onDoubleClick={handleDoubleClick}
      title="Doble clic para seleccionar / deseleccionar"
    >
      <TD className={styles.checkboxCell}>
        <input
          type="checkbox"
          className={styles.rowCheckbox}
          checked={isSelected}
          onChange={() => onToggleSelect && onToggleSelect(item.id)}
          aria-label={`Seleccionar ${item.nombre}`}
        />
      </TD>
      <TD className={styles.imageCell}>
        <div className={styles.avatarWrapper}>
          <ProductAvatar
            src={resolveProductImage(item)}
            alt={item.nombre}
            name={item.nombre}
            size={48}
          />
        </div>
      </TD>
      <TD className={styles.productNameCell}>
        <div className={styles.productName}>{item.nombre}</div>
        {presentationText && (
          <div className={styles.productSubtitle}>{presentationText}</div>
        )}
      </TD>
      <TD className={styles.categoryCell}>
        <span className={`${styles.categoryChip} ${categoryConfig.className}`}>
          {categoryConfig.label}
        </span>
      </TD>
      <TD className={styles.categoryCell}>
        <span className={`${styles.channelChip} ${channelConfig.className}`}>
          {channelConfig.label}
        </span>
      </TD>
      <TD className={styles.priceCell}>
        {numPrice > 0 ? (
          <span className={styles.priceText}>{formatCurrency(numPrice)}</span>
        ) : (
          <span className={styles.internalCostPrice}>$0 (Costo Interno)</span>
        )}
      </TD>
      <TD className={styles.statusCell}>
        <Badge status={item.activo ? 'active' : 'inactive'}>
          {item.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      </TD>
      <TD className={styles.actionsCell}>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnEdit}
            onClick={() => onEdit(item)}
          >
            Editar
          </button>
          {onDelete && (
            <button
              type="button"
              className={styles.btnDelete}
              onClick={() => onDelete(item)}
              title="Eliminar producto"
              aria-label={`Eliminar ${item.nombre}`}
            >
              🗑️
            </button>
          )}
        </div>
      </TD>
    </TR>
  );
}
