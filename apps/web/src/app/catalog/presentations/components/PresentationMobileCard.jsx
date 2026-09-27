/**
 * @file PresentationMobileCard.jsx
 * @module catalog/presentations/components
 * @description Tarjeta responsiva para visualizar todos los datos de una presentación en móviles (SRP < 110 líneas).
 * @responsibility Presentar imagen, nombre, capacidad, tipo, observaciones y acciones con ergonomía táctil e íconos.
 * @usedBy apps/web/src/app/catalog/presentations/components/PresentationsTable.jsx
 * @dependencies react, lucide-react, @/components/ui/Badge, @/components/ui/ProductAvatar, ../presentations.module.css
 */
import React from 'react';
import { Pencil, Power, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
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
        <button
          type="button"
          onClick={() => onEdit(item)}
          className={`${styles.mobileActionBtn} ${styles.actionBtnEdit}`}
          aria-label="Editar presentación"
        >
          <Pencil size={15} strokeWidth={2} />
          <span>Editar</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleActive(item)}
          className={`${styles.mobileActionBtn} ${item.activo ? styles.actionBtnDeactivate : styles.actionBtnActivate}`}
          aria-label={item.activo ? 'Desactivar presentación' : 'Activar presentación'}
        >
          <Power size={15} strokeWidth={2} />
          <span>{item.activo ? 'Desactivar' : 'Activar'}</span>
        </button>

        {!item.activo && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(item)}
            title="Eliminar definitivamente esta presentación"
            className={`${styles.mobileActionBtn} ${styles.actionBtnDelete}`}
            aria-label="Eliminar definitivamente"
          >
            <Trash2 size={15} strokeWidth={2} />
            <span>Eliminar</span>
          </button>
        )}
      </div>
    </article>
  );
}
