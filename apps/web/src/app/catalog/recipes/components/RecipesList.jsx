/**
 * @file RecipesList.jsx
 * @module catalog/recipes/components
 * @description Tabla de recetas existentes.
 * @responsibility Renderizar lista de recetas y sus acciones.
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies @/components/ui/Table, Badge, Button, States
 */
import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import styles from '../recipes.module.css';

export function RecipesList({ items, loading, error, onEdit, onToggleActive }) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (items.length === 0) return <EmptyState title="No hay registros" description="Crea la primera receta para comenzar" />;

  return (
    <Table>
      <THead>
        <TR>
          <TH>Nombre Receta</TH>
          <TH>Producto Asociado</TH>
          <TH>Rendimiento</TH>
          <TH>N° Etapas</TH>
          <TH>Estado</TH>
          <TH>Acciones</TH>
        </TR>
      </THead>
      <TBody>
        {items.map((item) => (
          <TR key={item.id}>
            <TD>{item.nombre}</TD>
            <TD>{item.producto ? `${item.producto.nombre} (${item.producto.presentacion?.nombre || ''})` : item.idProducto}</TD>
            <TD>{item.rendimientoBase} {item.unidadRendimiento}</TD>
            <TD>{item.etapas?.filter(e => e.activo !== false).length || 0}</TD>
            <TD>
              <Badge status={item.activo ? 'active' : 'inactive'}>
                {item.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </TD>
            <TD>
              <div className={styles.actions}>
                <Button variant="secondary" onClick={() => onEdit(item)}>Editar / Ver BOM</Button>
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
