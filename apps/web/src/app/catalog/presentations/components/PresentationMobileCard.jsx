/**
 * @file PresentationMobileCard.jsx
 * @module catalog/presentations/components
 * @description Tarjeta responsiva para visualizar todos los datos de una presentación en móviles (SRP < 110 líneas).
 * @responsibility Presentar imagen, nombre, capacidad, tipo, observaciones y acciones con ergonomía táctil.
 * @usedBy apps/web/src/app/catalog/presentations/components/PresentationsTable.jsx
 * @dependencies react, @/components/ui/Badge, @/components/ui/Button, @/components/ui/ProductAvatar, ../presentations.module.css
 */
import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import ProductAvatar from '@/components/ui/ProductAvatar';
import styles from '../presentations.module.css';

export function PresentationMobileCard({ item, imageSrc, onEdit, onToggleActive, onDelete }) {
  const isGranel = item.tipoEnvase === 'BALDE' || item.tipoEnvase === 'TANQUE_GRANEL' || item.nombre?.toUpperCase().includes('GRANEL');

  return (
    <article className={styles.mobileCard}>
      <div className={styles.mobileCardHeader}>
        <div className={styles.avatarWrapper}>
          <ProductAvatar
            src={imageSrc}
            alt={item.nombre || 'Envase'}
            name={item.nombre || 'Envase'}
            size={64}
          />
        </div>
        <div className={styles.mobileCardMainInfo}>
          <div className={styles.mobileCardBadges}>
            <span className={styles.tipoEnvaseBadge}>{item.tipoEnvase || 'ENVASE'}</span>
            <Badge status={item.activo ? 'active' : 'inactive'}>
              {item.activo ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
          <h3 className={styles.mobileCardTitle}>{item.nombre}</h3>
        </div>
      </div>

      <div className={styles.mobileCardSpecsGrid}>
        <div className={styles.mobileSpecItem}>
          <span className={styles.specLabel}>Capacidad</span>
          <span className={styles.specValue}>
            {isGranel ? (
              <span className={styles.granelBadge}>Granel / Tanque</span>
            ) : (
              `${Number(item.cantidadMl || 0).toLocaleString()} ml · ${Number(item.cantidadOz || 0)} oz`
            )}
          </span>
        </div>

        <div className={styles.mobileSpecItem}>
          <span className={styles.specLabel}>Unidad Base</span>
          <span className={styles.specValueBadge}>{item.unidadMedida || 'ml'}</span>
        </div>

        {item.tapilla && (
          <div className={styles.mobileSpecItem}>
            <span className={styles.specLabel}>Tapilla / Tapa</span>
            <span className={styles.specValue}>{item.tapilla}</span>
          </div>
        )}

        {item.observaciones && (
          <div className={`${styles.mobileSpecItem} ${styles.specItemFull}`}>
            <span className={styles.specLabel}>Observaciones</span>
            <p className={styles.specText}>{item.observaciones}</p>
          </div>
        )}
      </div>

      <div className={styles.mobileCardActions}>
        <Button variant="secondary" onClick={() => onEdit(item)} className={styles.mobileActionBtn}>
          ✏️ Editar
        </Button>
        <Button
          variant={item.activo ? 'danger' : 'primary'}
          onClick={() => onToggleActive(item)}
          className={styles.mobileActionBtn}
        >
          {item.activo ? 'Desactivar' : 'Activar'}
        </Button>
        {!item.activo && onDelete && (
          <Button
            variant="danger"
            onClick={() => onDelete(item)}
            title="Eliminar definitivamente esta presentación"
            className={styles.mobileActionBtn}
          >
            🗑 Eliminar
          </Button>
        )}
      </div>
    </article>
  );
}
