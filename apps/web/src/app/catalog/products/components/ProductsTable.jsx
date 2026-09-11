/**
 * @file ProductsTable.jsx
 * @module catalog/products/components
 * @description Listado de productos finales de la planta.
 * @responsibility Renderizar tabla interactiva con CRUD.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies @/components/ui/Table, Badge, Button, States
 */
import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import { resolveProductImage } from '@/lib/presetImages';
import ProductAvatar from '@/components/ui/ProductAvatar';
import styles from '../products.module.css';

export function ProductsTable({ items, loading, error, onEdit, onToggleActive }) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (items.length === 0) return <EmptyState title="No hay registros" description="Crea el primer registro para comenzar" />;

  return (
    <Table>
      <THead>
        <TR>
          <TH>Imagen</TH>
          <TH>Nombre</TH>
          <TH>Categoría</TH>
          <TH>Precio Venta</TH>
          <TH>Estado</TH>
          <TH>Acciones</TH>
        </TR>
      </THead>
      <TBody>
        {items.map((item) => (
          <TR key={item.id} style={{ minHeight: '85px', height: '85px' }}>
            <TD style={{ width: '20%', verticalAlign: 'middle', textAlign: 'center' }}>
              <ProductAvatar 
                src={resolveProductImage(item)} 
                alt={item.nombre} 
                name={item.nombre}
                fluid={true} 
              />
            </TD>
            <TD>{item.nombre}</TD>
            <TD>{item.categoria}</TD>
            <TD>{item.precioVenta}</TD>
            <TD>
              <Badge status={item.activo ? 'active' : 'inactive'}>
                {item.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </TD>
            <TD>
              <div className={styles.actions}>
                <Button variant="secondary" onClick={() => onEdit(item)}>Editar</Button>
                <Button variant={item.activo ? 'danger' : 'primary'} onClick={() => onToggleActive(item)}>
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
