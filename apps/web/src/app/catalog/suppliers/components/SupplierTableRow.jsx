/**
 * @file SupplierTableRow.jsx
 * @module catalog/suppliers/components
 * @description Fila enriquecida para la tabla desktop de proveedores (SRP < 110 líneas).
 * @responsibility Renderizar datos de contacto, NIT, historial y botones de acción vectoriales.
 * @usedBy apps/web/src/app/catalog/suppliers/components/SuppliersTable.jsx
 * @dependencies react, lucide-react, @/components/ui/Table, @/components/ui/Badge
 */
import React from 'react';
import { Pencil, Power, Phone, Mail, Building2, ShoppingBag } from 'lucide-react';
import { TR, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import styles from '../suppliers.module.css';

export function SupplierTableRow({ item, onEdit, onToggleActive }) {
  const comprasCount = item._count?.compras || 0;
  const preciosCount = item._count?.precios || 0;

  return (
    <TR>
      <TD>
        <div className={styles.supplierIdentityWrapper}>
          <div className={styles.supplierIconWrapper}>
            <Building2 size={18} className={styles.supplierIcon} />
          </div>
          <div className={styles.supplierNameGroup}>
            <span className={styles.supplierNameText}>{item.nombre}</span>
            {item.observaciones && (
              <span className={styles.supplierNotesText} title={item.observaciones}>
                {item.observaciones}
              </span>
            )}
          </div>
        </div>
      </TD>
      <TD className={styles.nitCell}>
        <span className={styles.nitBadge}>{item.nitCedula || 'S/N'}</span>
      </TD>
      <TD>
        <div className={styles.contactCellGroup}>
          <span className={styles.contactNameText}>{item.nombreContacto || 'Sin contacto asignado'}</span>
          {item.telefono && (
            <a href={`tel:${item.telefono}`} className={styles.contactLink} title="Llamar proveedor">
              <Phone size={12} />
              <span>{item.telefono}</span>
            </a>
          )}
        </div>
      </TD>
      <TD>
        <div className={styles.locationCellGroup}>
          {item.email ? (
            <a href={`mailto:${item.email}`} className={styles.contactLink} title="Enviar correo">
              <Mail size={12} />
              <span>{item.email}</span>
            </a>
          ) : (
            <span className={styles.textMuted}>Sin email</span>
          )}
          {item.direccion && (
            <span className={styles.addressText} title={item.direccion}>
              {item.direccion}
            </span>
          )}
        </div>
      </TD>
      <TD>
        {comprasCount > 0 ? (
          <span className={styles.purchasesBadge} title={`${comprasCount} compras registradas y ${preciosCount} cotizaciones activas`}>
            <ShoppingBag size={12} />
            <span>{comprasCount} compra{comprasCount > 1 ? 's' : ''}</span>
          </span>
        ) : (
          <span className={styles.textMutedBadge}>Sin compras</span>
        )}
      </TD>
      <TD>
        <Badge status={item.activo ? 'active' : 'inactive'}>
          {item.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      </TD>
      <TD>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionBtnEdit}
            onClick={() => onEdit(item)}
            title="Editar información del proveedor"
            aria-label="Editar proveedor"
          >
            <Pencil size={14} strokeWidth={2} />
            <span>Editar</span>
          </button>

          <button
            type="button"
            className={item.activo ? styles.actionBtnDeactivate : styles.actionBtnActivate}
            onClick={() => onToggleActive(item)}
            title={item.activo ? 'Desactivar proveedor' : 'Activar proveedor'}
            aria-label={item.activo ? 'Desactivar' : 'Activar'}
          >
            <Power size={14} strokeWidth={2} />
            <span>{item.activo ? 'Desactivar' : 'Activar'}</span>
          </button>
        </div>
      </TD>
    </TR>
  );
}
