/**
 * @file PresentationsTable.jsx
 * @module catalog/presentations/components
 * @description Tabla de las presentaciones disponibles en catálogo.
 * @responsibility Renderizar las configuraciones de formato/volumen.
 * @usedBy apps/web/src/app/catalog/presentations/page.jsx
 * @dependencies @/components/ui/Table, Badge, Button, States
 */
import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import styles from '../presentations.module.css';

export function PresentationsTable({ presentations, loading, error, onEdit, onToggleActive, onNew }) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (presentations.length === 0) {
    return (
      <AssistedEmptyState
        icon="🧴"
        title="Comienza registrando tu primera Presentación"
        description="Define los envases y moldes físicos (botellas, vasos) donde se empacan los productos."
        actionLabel="+ Nueva Presentación"
        onAction={() => onNew && onNew()}
        topButtonLabel="Nueva Presentación"
      />
    );
  }

  return (
    <Table>
      <THead>
        <TR>
          <TH>Nombre</TH>
          <TH>Volumen (Oz/Ml)</TH>
          <TH>Envase</TH>
          <TH>Estado</TH>
          <TH>Acciones</TH>
        </TR>
      </THead>
      <TBody>
        {presentations.map((item) => (
          <TR key={item.id}>
            <TD>{item.nombre}</TD>
            <TD>{item.cantidadOz} oz / {item.cantidadMl} ml</TD>
            <TD>{item.tipoEnvase}</TD>
            <TD>
              <Badge status={item.activo ? 'active' : 'inactive'}>
                {item.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </TD>
            <TD>
              <div className={styles.actions}>
                <Button variant="secondary" onClick={() => onEdit(item)}>Editar</Button>
                <Button 
                  variant={item.activo ? 'danger' : 'primary'} 
                  onClick={() => onToggleActive(item)}
                >
                  {item.activo ? 'Desactivar' : 'Activar'}
                </Button>
              </div>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
