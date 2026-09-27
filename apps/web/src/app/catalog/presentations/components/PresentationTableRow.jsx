/**
 * @file PresentationTableRow.jsx
 * @module catalog/presentations/components
 * @description Fila individual enriquecida para la tabla desktop de presentaciones (SRP < 90 líneas).
 * @responsibility Renderizar avatar, nombre, volumen, tipo, tapilla, estado y botones de acción.
 * @usedBy apps/web/src/app/catalog/presentations/components/PresentationsTable.jsx
 * @dependencies react, @/components/ui/Table, @/components/ui/Badge, @/components/ui/Button, @/components/ui/ProductAvatar
 */
import React from 'react';
import { TR, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import ProductAvatar from '@/components/ui/ProductAvatar';
import styles from '../presentations.module.css';

export function PresentationTableRow({ item, imageSrc, onEdit, onToggleActive, onDelete }) {
  const isGranel = item.tipoEnvase === 'BALDE' || item.tipoEnvase === 'TANQUE_GRANEL' || item.nombre?.toUpperCase().includes('GRANEL');

  return (
    <TR>
      <TD className={styles.thumbnailCell}>
        <div className={styles.avatarWrapper}>
          <ProductAvatar
            src={imageSrc}
            alt={item.nombre || 'Envase'}
            name={item.nombre || 'Envase'}
            size={52}
          />
        </div>
      </TD>
      <TD>
        <div className={styles.nameCellWrapper}>
          <span className={styles.presentationNameText}>{item.nombre}</span>
          {item.observaciones && (
            <span className={styles.presentationNotesText} title={item.observaciones}>
              {item.observaciones}
            </span>
          )}
        </div>
      </TD>
      <TD>
        <span className={styles.tipoEnvaseBadge}>{item.tipoEnvase || 'ENVASE'}</span>
      </TD>
      <TD>
        {isGranel ? (
          <span className={styles.granelBadge}>A Granel / Tanque</span>
        ) : (
          <span className={styles.capacityText}>
            <strong>{Number(item.cantidadMl || 0).toLocaleString()}</strong> ml &middot; {Number(item.cantidadOz || 0)} oz
          </span>
        )}
      </TD>
      <TD>
        <span className={styles.specValueBadge}>{item.unidadMedida || 'ml'}</span>
      </TD>
      <TD>
        <span className={styles.tapillaText}>{item.tapilla || '—'}</span>
      </TD>
      <TD>
        <Badge status={item.activo ? 'active' : 'inactive'}>
          {item.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      </TD>
      <TD>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => onEdit(item)} size="sm">Editar</Button>
          <Button 
            variant={item.activo ? 'danger' : 'primary'} 
            onClick={() => onToggleActive(item)}
            size="sm"
          >
            {item.activo ? 'Desactivar' : 'Activar'}
          </Button>
          {!item.activo && onDelete && (
            <Button 
              variant="danger" 
              onClick={() => onDelete(item)}
              title="Eliminar definitivamente esta presentación"
              size="sm"
            >
              🗑
            </Button>
          )}
        </div>
      </TD>
    </TR>
  );
}
