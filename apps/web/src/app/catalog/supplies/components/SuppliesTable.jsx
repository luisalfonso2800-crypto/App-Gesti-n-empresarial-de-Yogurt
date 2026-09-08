/**
 * @file SuppliesTable.jsx
 * @module catalog/supplies/components
 * @description Tabla de catálogo de insumos.
 * @responsibility Dibujar matriz de inventario y acciones CRUD.
 * @usedBy apps/web/src/app/catalog/supplies/page.jsx
 * @dependencies @/components/ui/Table, Badge, Button, States
 */
import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import styles from '../supplies.module.css';

export function SuppliesTable({ items, loading, error, searchTerm, categoryFilter, onEdit, onToggleActive }) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (items.length === 0) return <EmptyState title="No hay registros" description="Crea el primer registro para comenzar" />;

  const generateCode = (item) => {
    if (item.codigo) return item.codigo;
    if (item.code) return item.code;
    return item.id ? item.id.substring(0, 8).toUpperCase() : 'N/A';
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          generateCode(item).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? item.categoria === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <Table>
      <THead>
        <TR>
          <TH>Código</TH>
          <TH>Nombre</TH>
          <TH>Categoría</TH>
          <TH>Marca</TH>
          <TH>Unidad Base</TH>
          <TH>Stock Mínimo</TH>
          <TH>Costo Ref. (Base)</TH>
          <TH>Estado</TH>
          <TH>Acciones</TH>
        </TR>
      </THead>
      <TBody>
        {filteredItems.map((item) => (
          <TR key={item.id}>
            <TD>{generateCode(item)}</TD>
            <TD>{item.nombre}</TD>
            <TD>{item.categoria}</TD>
            <TD>{item.marca}</TD>
            <TD>{item.unidadBase}</TD>
            <TD>{item.stockMinimo}</TD>
            <TD>{item.precios && item.precios.length > 0 ? `$${item.precios[0].costoUnidadBase} / ${item.unidadBase || 'Unidad'}` : '-'}</TD>
            <TD>
              <Badge status={item.activo ? 'active' : 'inactive'}>{item.activo ? 'Activo' : 'Inactivo'}</Badge>
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
