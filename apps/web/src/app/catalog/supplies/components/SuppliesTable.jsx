/**
 * @file SuppliesTable.jsx
 * @module catalog/supplies/components
 * @description Tabla de catálogo enriquecida y responsiva de insumos con paginación de 10 ítems (SRP < 150 líneas).
 * @responsibility Filtrado avanzado multidimensional, paginación estricta y orquestación desktop/móvil.
 * @usedBy apps/web/src/app/catalog/supplies/page.jsx
 * @dependencies @/components/ui/Table, States, AssistedEmptyState, SupplyTableRow, SupplyMobileCard, SuppliesPagination, ../utils/supplyFilters
 */
import React, { useState, useMemo, useEffect } from 'react';
import { Table, THead, TBody, TR, TH } from '@/components/ui/Table';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import { SupplyTableRow } from './SupplyTableRow';
import { SupplyMobileCard } from './SupplyMobileCard';
import { SuppliesPagination } from './SuppliesPagination';
import { filterSupplies } from '../utils/supplyFilters';
import styles from '../supplies.module.css';

const PAGE_SIZE = 10;

export function SuppliesTable({
  items,
  loading,
  error,
  filters,
  onEdit,
  onToggleActive,
  onDelete,
  onNew
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const generateCode = (item) => {
    if (item.codigo) return item.codigo;
    if (item.code) return item.code;
    return item.id ? item.id.substring(0, 8).toUpperCase() : 'N/A';
  };

  const filteredItems = useMemo(() => {
    return filterSupplies(items, filters);
  }, [items, filters]);

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredItems, currentPage]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (items.length === 0) {
    return (
      <AssistedEmptyState
        icon="📦"
        title="Comienza registrando tu primer Insumo"
        description="Registra las materias primas, cultivos y empaques necesarios para elaborar productos."
        actionLabel="+ Nuevo Insumo"
        onAction={() => onNew && onNew()}
        topButtonLabel="Nuevo Insumo"
      />
    );
  }

  return (
    <div className={styles.suppliesWrapper}>
      {/* Vista Móvil: Tarjetas Fluidas (MAN-UI-002) */}
      <div className={styles.mobileCardsContainer}>
        {paginatedItems.map((item) => (
          <SupplyMobileCard
            key={item.id}
            item={item}
            code={generateCode(item)}
            onEdit={onEdit}
            onToggleActive={onToggleActive}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Vista Desktop: Tabla Enriquecida */}
      <div className={styles.desktopTableContainer}>
        <Table>
          <THead>
            <TR>
              <TH>Código</TH>
              <TH>Nombre y Detalle</TH>
              <TH>Categoría</TH>
              <TH>Unidad / Densidad</TH>
              <TH>Stock Actual / Mínimo</TH>
              <TH>Costo Ref.</TH>
              <TH>Trazabilidad</TH>
              <TH>Estado</TH>
              <TH className={styles.actionsHeader}>Acciones</TH>
            </TR>
          </THead>
          <TBody>
            {paginatedItems.map((item) => (
              <SupplyTableRow
                key={item.id}
                item={item}
                code={generateCode(item)}
                onEdit={onEdit}
                onToggleActive={onToggleActive}
                onDelete={onDelete}
              />
            ))}
          </TBody>
        </Table>
      </div>

      {/* Paginación fija de 10 elementos */}
      <SuppliesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
