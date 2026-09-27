/**
 * @file SupplierMobileCard.jsx
 * @module catalog/suppliers/components
 * @description Tarjeta responsiva para visualizar proveedores en móviles y tablets (SRP < 110 líneas).
 * @responsibility Presentar razón social, NIT, enlaces táctiles de contacto y botones de acción.
 * @usedBy apps/web/src/app/catalog/suppliers/components/SuppliersTable.jsx
 * @dependencies react, lucide-react, @/components/ui/Badge
 */
import React from 'react';
import { Pencil, Power, Phone, Mail, Building2, MapPin, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import styles from '../suppliers.module.css';

export function SupplierMobileCard({ item, onEdit, onToggleActive }) {
  const comprasCount = item._count?.compras || 0;

  return (
    <article className={styles.mobileCard}>
      <div className={styles.mobileCardHeader}>
        <div className={styles.mobileCardTopRow}>
          <div className={styles.supplierIconWrapper}>
            <Building2 size={16} className={styles.supplierIcon} />
          </div>
          <div className={styles.mobileCardBadges}>
            <span className={styles.nitBadge}>{item.nitCedula || 'S/N'}</span>
            <Badge status={item.activo ? 'active' : 'inactive'}>
              {item.activo ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
        <h3 className={styles.mobileCardTitle}>{item.nombre}</h3>
        {item.observaciones && (
          <p className={styles.mobileNotesText}>{item.observaciones}</p>
        )}
      </div>

      <div className={styles.mobileCardSpecsGrid}>
        <div className={styles.mobileSpecItem}>
          <span className={styles.specLabel}>Contacto</span>
          <span className={styles.specValue}>{item.nombreContacto || 'Sin contacto'}</span>
        </div>

        <div className={styles.mobileSpecItem}>
          <span className={styles.specLabel}>Teléfono</span>
          {item.telefono ? (
            <a href={`tel:${item.telefono}`} className={styles.contactLinkHighlight}>
              <Phone size={13} />
              <span>{item.telefono}</span>
            </a>
          ) : (
            <span className={styles.textMuted}>N/D</span>
          )}
        </div>

        <div className={styles.mobileSpecItem}>
          <span className={styles.specLabel}>Correo Electrónico</span>
          {item.email ? (
            <a href={`mailto:${item.email}`} className={styles.contactLinkHighlight}>
              <Mail size={13} />
              <span>{item.email}</span>
            </a>
          ) : (
            <span className={styles.textMuted}>N/D</span>
          )}
        </div>

        <div className={styles.mobileSpecItem}>
          <span className={styles.specLabel}>Historial Compras</span>
          {comprasCount > 0 ? (
            <span className={styles.purchasesBadge}>
              <ShoppingBag size={12} />
              <span>{comprasCount} compra{comprasCount > 1 ? 's' : ''}</span>
            </span>
          ) : (
            <span className={styles.textMuted}>Sin compras</span>
          )}
        </div>

        {item.direccion && (
          <div className={`${styles.mobileSpecItem} ${styles.specItemFull}`}>
            <span className={styles.specLabel}>Dirección</span>
            <p className={styles.specText}>
              <MapPin size={12} className={styles.inlineIcon} />
              <span>{item.direccion}</span>
            </p>
          </div>
        )}
      </div>

      <div className={styles.mobileCardActions}>
        <button
          type="button"
          onClick={() => onEdit(item)}
          className={`${styles.mobileActionBtn} ${styles.actionBtnEdit}`}
          aria-label="Editar proveedor"
        >
          <Pencil size={15} strokeWidth={2} />
          <span>Editar</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleActive(item)}
          className={`${styles.mobileActionBtn} ${item.activo ? styles.actionBtnDeactivate : styles.actionBtnActivate}`}
          aria-label={item.activo ? 'Desactivar proveedor' : 'Activar proveedor'}
        >
          <Power size={15} strokeWidth={2} />
          <span>{item.activo ? 'Desactivar' : 'Activar'}</span>
        </button>
      </div>
    </article>
  );
}
