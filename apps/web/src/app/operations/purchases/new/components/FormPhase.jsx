/**
 * @file FormPhase.jsx
 * @module operations/purchases/new/components
 * @description Registro de Compras Adicionales o Directas (<150 líneas, SRP, 0 inline styles).
 * @responsibility Orquestación visual: barra fija, modales auxiliares, flete, lista LIFO de filas y resumen financiero.
 * @usedBy apps/web/src/app/operations/purchases/new/page.jsx
 * @dependencies React, SupplierModal, SupplyModal, ../new-purchase.module.css, ./parts/*, ../hooks/useFormPhaseData
 */
import React from 'react';
import styles from '../new-purchase.module.css';
import { SupplierModal } from '@/components/catalog/SupplierModal';
import { SupplyModal } from '@/components/catalog/SupplyModal';
import { useFormPhaseData } from '../hooks/useFormPhaseData';
import FormPhaseStickyBar from './parts/FormPhaseStickyBar';
import FormPhaseFleteSection from './parts/FormPhaseFleteSection';
import FormPhaseRowItem from './parts/FormPhaseRowItem';
import FormPhaseSummaryCard from './parts/FormPhaseSummaryCard';

export function FormPhase({
  proveedoresDB: proveedoresDBProp,
  insumosDB: insumosDBProp,
  supplierPrices,
  setPhase,
  showNotification,
  activeOrder,
  refreshOrder,
  router
}) {
  const {
    isDirectPurchase, detalles, flete, setFlete, isSubmitting, containerRef,
    totalConFlete, totalSinIvaCompra, totalIvaCompra, addRow, removeRow, updateDetalle, clearInsumo, activeDropdown,
    setActiveDropdown, openDropdown, dropdownSearch, setDropdownSearch,
    filteredProveedores, filteredInsumosByRow, showNewProvModal, setShowNewProvModal,
    setNewProvTargetRow, initialProvData, setInitialProvData, showNewInsumoModal,
    setShowNewInsumoModal, setNewInsumoTargetRow, initialSupplyData, setInitialSupplyData,
    handleSuccessProv, handleSuccessInsumo, handleConfirmar
  } = useFormPhaseData({
    proveedoresDBProp, insumosDBProp, supplierPrices, setPhase,
    showNotification, activeOrder, refreshOrder, router
  });

  const generatedId = activeOrder?.codigo || 'En curso';

  return (
    <div className={styles.container} ref={containerRef}>
      <SupplierModal 
        isOpen={showNewProvModal} 
        onClose={() => setShowNewProvModal(false)}
        onSuccess={handleSuccessProv}
        initialData={initialProvData}
      />

      <SupplyModal 
        isOpen={showNewInsumoModal} 
        onClose={() => setShowNewInsumoModal(false)}
        onSuccess={handleSuccessInsumo}
        initialData={initialSupplyData}
      />

      <FormPhaseStickyBar
        isDirectPurchase={isDirectPurchase}
        router={router}
        setPhase={setPhase}
        generatedId={generatedId}
        totalConFlete={totalConFlete}
        addRow={addRow}
        handleConfirmar={handleConfirmar}
        isSubmitting={isSubmitting}
        detallesCount={detalles.length}
      />

      <div className={styles.formContentWrapper}>
        <FormPhaseFleteSection flete={flete} setFlete={setFlete} />

        {detalles.length === 0 && (
          <div className={styles.formEmptyState}>
            <p className={styles.formEmptyParagraph}>
              No hay filas de compra registradas.<br/>Pulse <b>+ Añadir Fila</b> para comenzar.
            </p>
          </div>
        )}

        {detalles.map((row, idx) => (
          <FormPhaseRowItem
            key={row.id}
            row={row}
            idx={idx}
            removeRow={removeRow}
            updateDetalle={updateDetalle}
            clearInsumo={clearInsumo}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            openDropdown={openDropdown}
            dropdownSearch={dropdownSearch}
            setDropdownSearch={setDropdownSearch}
            filteredProveedores={filteredProveedores}
            filteredInsumosByRow={filteredInsumosByRow}
            supplierPrices={supplierPrices}
            setNewProvTargetRow={setNewProvTargetRow}
            setInitialProvData={setInitialProvData}
            setShowNewProvModal={setShowNewProvModal}
            setNewInsumoTargetRow={setNewInsumoTargetRow}
            setInitialSupplyData={setInitialSupplyData}
            setShowNewInsumoModal={setShowNewInsumoModal}
          />
        ))}

        <FormPhaseSummaryCard
          detallesCount={detalles.length}
          flete={flete}
          totalSinIvaCompra={totalSinIvaCompra}
          totalIvaCompra={totalIvaCompra}
          totalConFlete={totalConFlete}
        />
      </div>
    </div>
  );
}
