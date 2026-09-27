/**
 * @file RecipeMobileCard.jsx
 * @module catalog/recipes/components
 * @description Tarjeta fluida para visualización de receta en pantallas móviles (MAN-UI-002, SRP < 120 líneas).
 * @responsibility Renderizar producto, rendimiento, etapas, estado y botones de acción táctiles (touch targets >= 40px).
 * @usedBy apps/web/src/app/catalog/recipes/components/RecipesList.jsx
 * @dependencies react, lucide-react, @/lib/presetImages, ../recipes.module.css
 */
'use client';

import React from 'react';
import { Eye, Power, Trash2 } from 'lucide-react';
import ProductAvatar from '@/components/ui/ProductAvatar';
import { resolveProductImage } from '@/lib/presetImages';
import styles from '../recipes.module.css';

export function RecipeMobileCard({
  item,
  onEdit,
  onToggleActive,
  onDelete
}) {
  const activeStagesCount = item.etapas?.filter(e => e.activo !== false).length || 0;
  const isInactive = !item.activo;

  return (
    <div className={styles.mobileCard}>
      <div className={styles.mobileCardHeader}>
        <div className={styles.mobileCardLeft}>
          {item.producto ? (
            <ProductAvatar
              src={resolveProductImage(item.producto)}
              alt={item.producto.nombre}
              name={item.producto.nombre}
              size={40}
            />
          ) : (
            <div className={styles.mobileAvatarPlaceholder}>📋</div>
          )}
          <div className={styles.mobileProductInfo}>
            <span className={styles.mobileProductTitle}>{item.nombre}</span>
            <span className={styles.mobileProductSub}>
              {item.producto?.nombre || 'Sin producto asociado'} {item.producto?.presentacion?.nombre ? `• ${item.producto.presentacion.nombre}` : ''}
            </span>
          </div>
        </div>

        <span className={isInactive ? styles.statusRed : styles.statusGreen}>
          {isInactive ? '🔴 Inactiva' : '🟢 Activa'}
        </span>
      </div>

      <div className={styles.mobileCardBody}>
        <div className={styles.mobileDataRow}>
          <span className={styles.mobileDataLabel}>Rendimiento Base:</span>
          <span className={styles.mobileDataValue}>
            {item.rendimientoBase} {item.unidadRendimiento || 'unidades'}
          </span>
        </div>
        <div className={styles.mobileDataRow}>
          <span className={styles.mobileDataLabel}>Etapas de Proceso:</span>
          <span className={styles.mobileDataValue}>
            {activeStagesCount} {activeStagesCount === 1 ? 'etapa' : 'etapas'}
          </span>
        </div>
      </div>

      <div className={styles.mobileCardActions}>
        <button
          type="button"
          className={styles.mobileBtnBom}
          onClick={() => onEdit && onEdit(item)}
          title="Ver explosión BOM y editar formulación"
          aria-label="Ver BOM y editar receta"
        >
          <Eye size={16} />
          <span>Ver BOM</span>
        </button>

        {onToggleActive && (
          <button
            type="button"
            className={isInactive ? styles.mobileBtnActivate : styles.mobileBtnDeactivate}
            onClick={() => onToggleActive(item)}
            title={isInactive ? 'Activar receta' : 'Desactivar receta'}
            aria-label={isInactive ? 'Activar receta' : 'Desactivar receta'}
          >
            <Power size={16} />
            <span>{isInactive ? 'Activar' : 'Pausar'}</span>
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            className={`${styles.mobileBtnDelete} ${item.activo ? styles.btnDeleteDisabled : ''}`}
            onClick={() => !item.activo && onDelete(item)}
            disabled={item.activo}
            title={item.activo ? 'Desactive la receta para eliminarla' : 'Eliminar receta'}
            aria-label="Eliminar receta"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
