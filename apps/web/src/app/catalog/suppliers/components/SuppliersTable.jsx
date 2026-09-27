/**
 * @file SuppliersTable.jsx
 * @module catalog/suppliers/components
 * @description Tabla de proveedores enriquecida y responsiva con paginación de 10 ítems (SRP < 150 líneas).
 * @responsibility Filtrado de búsqueda/estado, paginación estricta y orquestación desktop/móvil.
 * @usedBy apps/web/src/app/catalog/suppliers/page.jsx
 * @dependencies @/components/ui/Table, States, AssistedEmptyState, SupplierTableRow, SupplierMobileCard, SuppliersPagination
 */
import React, { useState, useMemo, useEffect } from 'react';
import { Table, THead, TBody, TR, TH } from '@/components/ui/Table';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import { SupplierTableRow } from './SupplierTableRow';
import { SupplierMobileCard } from './SupplierMobileCard';
import { SuppliersPagination } from './SuppliersPagination';
import styles from '../suppliers.module.css';

const PAGE_SIZE = 10;

export function SuppliersTable({
  items,
  loading,
  error,
  searchTerm = '',
  statusFilter = '',
  onEdit,
  onToggleActive,
  onNew
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchLower = searchTerm.toLowerCase().trim();
      if (searchLower) {
        const matches = 
          (item.nombre || '').toLowerCase().includes(searchLower) ||
          (item.nitCedula || '').toLowerCase().includes(searchLower) ||
          (item.nombreContacto || '').toLowerCase().includes(searchLower) ||
          (item.telefono || '').toLowerCase().includes(searchLower) ||
          (item.email || '').toLowerCase().includes(searchLower);
        if (!matches) return false;
      }

      if (statusFilter) {
        const wantsActive = statusFilter === 'active';
        if (Boolean(item.activo) !== wantsActive) return false;
      }

      return true;
    });
  }, [items, searchTerm, statusFilter]);

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredItems, currentPage]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (items.length === 0) {
    return (
      <AssistedEmptyState
        icon="🚛"
        title="Comienza registrando tu primer Proveedor"
        description="Registra los fabricantes y distribuidores de materia prima y empaques."
        actionLabel="+ Nuevo Proveedor"
        onAction={() => onNew && onNew()}
        topButtonLabel="Nuevo Proveedor"
      />
    );
  }

  return (
    <div className={styles.suppliersWrapper}>
      {/* Vista Móvil: Tarjetas Fluidas (MAN-UI-002) */}
      <div className={styles.mobileCardsContainer}>
        {paginatedItems.map((item) => (
          <SupplierMobileCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onToggleActive={onToggleActive}
          />
        ))}
      </div>

      {/* Vista Desktop: Tabla Enriquecida */}
      <div className={styles.desktopTableContainer}>
        <Table>
          <THead>
            <TR>
              <TH>Proveedor / Razón Social</TH>
              <TH>NIT / Cédula</TH>
              <TH>Contacto & Teléfono</TH>
              <TH>Email & Dirección</TH>
              <TH>Historial</TH>
              <TH>Estado</TH>
              <TH className={styles.actionsHeader}>Acciones</TH>
            </TR>
          </THead>
          <TBody>
            {paginatedItems.map((item) => (
              <SupplierTableRow
                key={item.id}
                item={item}
                onEdit={onEdit}
                onToggleActive={onToggleActive}
              />
            ))}
          </TBody>
        </Table>
      </div>

      {/* Paginación estricta de 10 elementos */}
      <SuppliersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
