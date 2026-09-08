/**
 * @file SuppliersTable.jsx
 * @module catalog/suppliers/components
 * @description Tabla de proveedores.
 * @responsibility Mostrar proveedores y proveer los botones de edición y estado.
 * @usedBy apps/web/src/app/catalog/suppliers/page.jsx
 * @dependencies @/components/ui/Table, Badge, Button, States
 */
import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import styles from '../suppliers.module.css';

export function SuppliersTable({ items, loading, error, onEdit, onToggleActive }) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (items.length === 0) return <EmptyState title="No hay registros" description="Crea el primer registro para comenzar" />;

  return (
    <Table>
      <THead>
        <TR>
          <TH>Nombre</TH>
          <TH>NIT/Cédula</TH>
          <TH>Contacto</TH>
          <TH>Teléfono</TH>
          <TH>Estado</TH>
          <TH>Acciones</TH>
        </TR>
      </THead>
      <TBody>
        {items.map((item) => (
          <TR key={item.id}>
            <TD>{item.nombre}</TD>
            <TD>{item.nitCedula}</TD>
            <TD>{item.nombreContacto}</TD>
            <TD>{item.telefono}</TD>
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
