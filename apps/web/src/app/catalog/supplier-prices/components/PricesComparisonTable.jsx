/**
 * @file PricesComparisonTable.jsx
 * @module catalog/supplier-prices/components
 * @description Tabla comparativa de precios delegada en filas atómicas PriceRow (< 90 líneas).
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 */
'use client';

import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import PriceRow from './parts/PriceRow';
import styles from '../supplier-prices.module.css';

export function PricesComparisonTable({
  items, filteredItems, loading, error, bestPricesMap, selectedForPurchase,
  handleOpenModal, handleToggleActive, togglePurchaseItem, onNewTarifa
}) {
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
        {filteredItems.length === 0 ? (
          <TR>
            <TD colSpan="8" className={styles.emptyTableText}>No hay resultados para los filtros aplicados</TD>
          </TR>
        ) : (
          filteredItems.map((item) => {
            const itemCosto = Number(item.costoUnidadBase || 0);
            const isBestPrice = item.activo && itemCosto === bestPricesMap.get(item.idInsumo);
            const isAdded = selectedForPurchase.some(p => (p.insumoId === item.idInsumo || p.idInsumo === item.idInsumo) && (p.proveedorId === item.idProveedor || p.idProveedor === item.idProveedor));
            const alreadyHasSameProviderAndInsumo = !isAdded && selectedForPurchase.some(p => (p.insumoId === item.idInsumo || p.idInsumo === item.idInsumo) && (p.proveedorId === item.idProveedor || p.idProveedor === item.idProveedor));

            return (
              <PriceRow
                key={item.id}
                item={item}
                isBestPrice={isBestPrice}
                isAdded={isAdded}
                alreadyHasSameProviderAndInsumo={alreadyHasSameProviderAndInsumo}
                onToggleCart={togglePurchaseItem}
                onEdit={handleOpenModal}
                onToggleActive={handleToggleActive}
              />
            );
          })
        )}
      </TBody>
    </Table>
  );
}
