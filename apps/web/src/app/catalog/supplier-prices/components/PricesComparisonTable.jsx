/**
 * @file PricesComparisonTable.jsx
 * @module catalog/supplier-prices/components
 * @description Tabla comparativa de precios responsiva con paginación de 10 ítems (SRP < 150 líneas).
 * @responsibility Renderizar vista de tabla desktop y tarjetas móviles con paginación de 10 elementos.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies @/components/ui/Table, States, AssistedEmptyState, PriceRow, SupplierPriceMobileCard, SupplierPricesPagination
 */
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import PriceRow from './parts/PriceRow';
import { SupplierPriceMobileCard } from './SupplierPriceMobileCard';
import { SupplierPricesPagination } from './SupplierPricesPagination';
import styles from '../supplier-prices.module.css';

const PAGE_SIZE = 10;

export function PricesComparisonTable({
  items, filteredItems, loading, error, bestPricesMap,
  selectedForPurchase, handleOpenModal, handleToggleActive,
  togglePurchaseItem, onNewTarifa
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredItems.length]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredItems, currentPage]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (items.length === 0) {
    return (
      <AssistedEmptyState
        icon="💰"
        title="Comienza registrando tu primera Tarifa de Proveedor"
        description="Cotiza tarifas de compra para calcular costos base de materia prima."
        actionLabel="+ Nueva Tarifa"
        onAction={() => onNewTarifa && onNewTarifa()}
        topButtonLabel="Nueva Tarifa"
      />
    );
  }

  return (
    <div className={styles.pricesTableWrapper}>
      {/* Vista Móvil: Tarjetas Fluidas (MAN-UI-002) */}
      <div className={styles.mobileCardsContainer}>
        {paginatedItems.length === 0 ? (
          <div className={styles.emptyTableText}>No hay resultados para los filtros aplicados</div>
        ) : (
          paginatedItems.map((item) => {
            const itemCosto = Number(item.costoUnidadBase || 0);
            const isBestPrice = item.activo && itemCosto === bestPricesMap.get(item.idInsumo);
            const isAdded = selectedForPurchase.some(p => (p.insumoId === item.idInsumo || p.idInsumo === item.idInsumo) && (p.proveedorId === item.idProveedor || p.idProveedor === item.idProveedor));
            return (
              <SupplierPriceMobileCard
                key={item.id}
                item={item}
                isBestPrice={isBestPrice}
                isAdded={isAdded}
                onToggleCart={togglePurchaseItem}
                onEdit={handleOpenModal}
                onToggleActive={handleToggleActive}
              />
            );
          })
        )}
      </div>

      {/* Vista Desktop: Tabla Comparativa */}
      <div className={styles.desktopTableContainer}>
        <Table>
          <THead>
            <TR>
              <TH>Insumo / Stock</TH>
              <TH>Proveedor / Vigencia</TH>
              <TH>Presentación Compra</TH>
              <TH>Precio Empaque</TH>
              <TH>Base / IVA ($)</TH>
              <TH>Costo Final / Und Base</TH>
              <TH>Estado</TH>
              <TH>Acciones</TH>
            </TR>
          </THead>
          <TBody>
            {paginatedItems.length === 0 ? (
              <TR>
                <TD colSpan="8" className={styles.emptyTableText}>No hay resultados para los filtros aplicados</TD>
              </TR>
            ) : (
              paginatedItems.map((item) => {
                const itemCosto = Number(item.costoUnidadBase || 0);
                const isBestPrice = item.activo && itemCosto === bestPricesMap.get(item.idInsumo);
                const isAdded = selectedForPurchase.some(p => (p.insumoId === item.idInsumo || p.idInsumo === item.idInsumo) && (p.proveedorId === item.idProveedor || p.idProveedor === item.idProveedor));
                return (
                  <PriceRow
                    key={item.id}
                    item={item}
                    isBestPrice={isBestPrice}
                    isAdded={isAdded}
                    onToggleCart={togglePurchaseItem}
                    onEdit={handleOpenModal}
                    onToggleActive={handleToggleActive}
                  />
                );
              })
            )}
          </TBody>
        </Table>
      </div>

      <SupplierPricesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
