/**
 * @file page.jsx
 * @module operations/inventory
 * @description Vista principal de bitácora de inventario en Bodega y Cava (SRP + CSS Modules).
 * @responsibility Orquestar pestañas, KPIs, listado de inventario y modales de ajuste sin lógica pesada acoplada.
 * @usedBy Next.js router (/operations/inventory)
 * @dependencies react, @/components/ui/States, @/components/ui/AssistedEmptyState, @/components/ui/Button, lucide-react, ./components/GlobalInventoryAdjustmentModal
 */
'use client';

import React from 'react';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import { Button } from '@/components/ui/Button';
import { LayoutGrid } from 'lucide-react';
import { GlobalInventoryAdjustmentModal } from './components/GlobalInventoryAdjustmentModal';
import styles from './inventory.module.css';
import { useInventoryPageData } from './hooks/useInventoryPageData';
import InventoryKpiGrid from './components/InventoryKpiGrid';
import InventoryStockTable from './components/InventoryStockTable';
import InventoryItemAdjustmentModal from './components/InventoryItemAdjustmentModal';

export default function InventoryPage() {
  const {
    activeTab, setActiveTab, inventory, finishedProducts, metadata,
    loading, error, expandedId, movements, loadingMovements,
    isGlobalAdjustmentOpen, setIsGlobalAdjustmentOpen, adjustmentModal,
    setAdjustmentModal, handleToggleRow, submitAdjustment, fetchData
  } = useInventoryPageData();

  const currentItems = activeTab === 'INSUMOS' ? inventory : finishedProducts;

  return (
    <div className={styles.container}>
      <header className={styles.headerPanel}>
        <div className={styles.headerTopRow}>
          <div className={styles.titleSection}>
            <LayoutGrid size={28} className={styles.titleIcon} />
            <div>
              <h1 className={styles.mainTitle}>Bitácora de Inventario</h1>
              <p className={styles.subTitle}>Control maestro de almacén y cava. Valorización en tiempo real.</p>
            </div>
          </div>
          <Button variant="primary" onClick={() => setIsGlobalAdjustmentOpen(true)}>
            + Saldo Inicial / Ajuste Global
          </Button>
        </div>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'INSUMOS' ? styles.tabActive : ''}`} 
            onClick={() => setActiveTab('INSUMOS')}
          >
            Bodega (Insumos)
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'PRODUCTOS' ? styles.tabActive : ''}`} 
            onClick={() => setActiveTab('PRODUCTOS')}
          >
            Cava (Prod. Terminado)
          </button>
        </div>
      </header>

      {activeTab === 'INSUMOS' && !loading && !error && (
        <InventoryKpiGrid metadata={metadata} />
      )}

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : currentItems.length === 0 ? (
        <AssistedEmptyState
          icon="📦"
          title={activeTab === 'INSUMOS' ? 'Comienza registrando existencias en Bodega' : 'No hay existencias de Producto Terminado en Cava'}
          description="Controla el stock disponible en bodega valorizado al costo promedio y registra entradas desde compras o producción."
          actionLabel={activeTab === 'INSUMOS' ? '+ Registrar Compra de Insumos' : '+ Programar Producción'}
          onAction={() => window.location.href = (activeTab === 'INSUMOS' ? '/operations/purchases/new?mode=direct' : '/operations/production')}
          topButtonLabel="Ajuste Global / Saldo Inicial"
        />
      ) : (
        <InventoryStockTable
          activeTab={activeTab}
          inventory={inventory}
          finishedProducts={finishedProducts}
          expandedId={expandedId}
          movements={movements}
          loadingMovements={loadingMovements}
          handleToggleRow={handleToggleRow}
          setAdjustmentModal={setAdjustmentModal}
        />
      )}

      <GlobalInventoryAdjustmentModal
        isOpen={isGlobalAdjustmentOpen}
        onClose={() => setIsGlobalAdjustmentOpen(false)}
        onSuccess={fetchData}
      />

      <InventoryItemAdjustmentModal
        adjustmentModal={adjustmentModal}
        setAdjustmentModal={setAdjustmentModal}
        activeTab={activeTab}
        submitAdjustment={submitAdjustment}
      />
    </div>
  );
}
