/**
 * @file SuppliesTable.jsx
 * @module catalog/supplies/components
 * @description Tabla de catálogo enriquecida y responsiva de insumos con paginación de 10 ítems (SRP < 150 líneas).
 * @responsibility Filtrado de búsqueda/categoría, paginación estricta y orquestación desktop/móvil.
 * @usedBy apps/web/src/app/catalog/supplies/page.jsx
 * @dependencies @/components/ui/Table, States, AssistedEmptyState, SupplyTableRow, SupplyMobileCard, SuppliesPagination
 */
import React, { useState, useMemo, useEffect } from 'react';
import { Table, THead, TBody, TR, TH } from '@/components/ui/Table';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import { SupplyTableRow } from './SupplyTableRow';
import { SupplyMobileCard } from './SupplyMobileCard';
import { SuppliesPagination } from './SuppliesPagination';
import styles from '../supplies.module.css';

const PAGE_SIZE = 10;

export function SuppliesTable({
  items,
  loading,
  error,
  searchTerm,
  categoryFilter,
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
    return items.filter(item => {
      const code = generateCode(item);
      const matchesSearch = item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter ? item.categoria === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, categoryFilter]);

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Si cambia la búsqueda o el filtro, reiniciar a la página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

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
