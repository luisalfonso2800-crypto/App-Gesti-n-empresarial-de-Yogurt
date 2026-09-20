/**
 * @file ProductsTable.jsx
 * @module catalog/products/components
 * @description Listado de productos finales de la planta.
 * @responsibility Renderizar tabla interactiva con CRUD delegando filas a ProductTableRow.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies @/components/ui/Table, States, AssistedEmptyState, ProductTableRow
 */
import React from 'react';
import { Table, THead, TBody, TR, TH } from '@/components/ui/Table';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import { ProductTableRow } from './ProductTableRow';
import styles from './products-table.module.css';

export function ProductsTable({
  items,
  recipes = [],
  loading,
  error,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  hoveredProductId,
  onHoverProduct,
  onEdit,
  onToggleActive = () => {},
  onDelete,
  onNew
}) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (items.length === 0) {
    return (
      <AssistedEmptyState
        icon="🥛"
        title="Comienza registrando tu primer Producto"
        description="Registra los artículos comerciales terminados vinculados a su receta y envase."
        actionLabel="+ Nuevo Producto"
        onAction={() => onNew && onNew()}
        topButtonLabel="Nuevo Producto"
      />
    );
  }

  const allSelected = items.length > 0 && items.every(item => selectedIds.includes(item.id));
  const someSelected = items.some(item => selectedIds.includes(item.id));

  return (
    <Table>
      <THead>
        <TR>
          <TH className={styles.checkboxCell}>
            <input
              type="checkbox"
              className={styles.rowCheckbox}
              checked={allSelected}
              ref={el => { if (el) el.indeterminate = someSelected && !allSelected; }}
              onChange={() => onToggleSelectAll && onToggleSelectAll(items)}
              aria-label="Seleccionar todos los productos de esta página"
            />
          </TH>
          <TH>Imagen</TH>
          <TH>Nombre</TH>
          <TH>Categoría</TH>
          <TH>Canal</TH>
          <TH>Precio Venta</TH>
          <TH>Estado</TH>
          <TH className={styles.actionsHeader}>Acciones</TH>
        </TR>
      </THead>
      <TBody>
        {items.map((item) => (
          <ProductTableRow
            key={item.id}
            item={item}
            isSelected={selectedIds.includes(item.id)}
            onToggleSelect={onToggleSelect}
            isHovered={String(hoveredProductId) === String(item.id)}
            onHoverProduct={onHoverProduct}
            onEdit={onEdit}
          />
        ))}
      </TBody>
    </Table>
  );
}
