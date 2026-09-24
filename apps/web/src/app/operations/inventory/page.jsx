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
import CavaCommercialTable from './components/CavaCommercialTable';
import InventoryWipTable from './components/InventoryWipTable';
import InventoryItemAdjustmentModal from './components/InventoryItemAdjustmentModal';

export default function InventoryPage() {
  const {
    activeTab, setActiveTab, cavaSubTab, setCavaSubTab, commercialItems, bulkItems,
    inventory, wipLots, metadata, loading, error, expandedId, movements,
    loadingMovements, isGlobalAdjustmentOpen, setIsGlobalAdjustmentOpen,
    adjustmentModal, setAdjustmentModal, handleToggleRow, submitAdjustment, fetchData
  } = useInventoryPageData();

  const currentItems = activeTab === 'INSUMOS' ? inventory : activeTab === 'WIP' ? wipLots : (cavaSubTab === 'COMERCIAL' ? commercialItems : bulkItems);

  return (
    <div className={styles.container}>
      <header className={styles.headerPanel}>
        <div className={styles.tabsHeaderRow}>
          <div className={styles.tabsGroup}>
            <button className={`${styles.tabBtn} ${activeTab === 'INSUMOS' ? styles.tabActive : ''}`} onClick={() => setActiveTab('INSUMOS')}>Bodega (Insumos)</button>
            <button className={`${styles.tabBtn} ${activeTab === 'PRODUCTOS' ? styles.tabActive : ''}`} onClick={() => setActiveTab('PRODUCTOS')}>Cava (Prod. Terminado)</button>
            <button className={`${styles.tabBtn} ${activeTab === 'WIP' ? styles.tabActiveWip : ''}`} onClick={() => setActiveTab('WIP')}>🧫 Semielaborados & Cepas (WIP)</button>
          </div>
          <Button variant="primary" onClick={() => setIsGlobalAdjustmentOpen(true)}>+ Saldo Inicial / Ajuste Global</Button>
        </div>

        {activeTab === 'PRODUCTOS' && (
          <div className={styles.tabs}>
            <button className={`${styles.tabBtn} ${cavaSubTab === 'COMERCIAL' ? styles.tabActive : ''}`} onClick={() => setCavaSubTab('COMERCIAL')}>
              🛍️ Cava Comercial (Envasados) ({commercialItems.length})
            </button>
            <button className={`${styles.tabBtn} ${cavaSubTab === 'BULK' ? styles.tabActive : ''}`} onClick={() => setCavaSubTab('BULK')}>
              🥛 Bases en Cava (Granel / Tanques) ({bulkItems.length})
            </button>
          </div>
        )}
      </header>

      {activeTab === 'INSUMOS' && !loading && !error && <InventoryKpiGrid metadata={metadata} />}

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : currentItems.length === 0 ? (
        <AssistedEmptyState
          icon="📦"
          title={activeTab === 'INSUMOS' ? 'Comienza registrando existencias en Bodega' : (cavaSubTab === 'COMERCIAL' ? 'No hay productos comerciales envasados en Cava' : 'No hay bases lácteas o graneles en Cava')}
          description="Controla el stock disponible en bodega o cava valorizado al costo promedio."
          actionLabel={activeTab === 'INSUMOS' ? '+ Registrar Compra' : '+ Programar Producción'}
          onAction={() => window.location.href = (activeTab === 'INSUMOS' ? '/operations/purchases/new?mode=direct' : '/operations/production')}
          topButtonLabel="Ajuste Global / Saldo Inicial"
        />
      ) : activeTab === 'WIP' ? (
        <InventoryWipTable wipLots={wipLots} />
      ) : activeTab === 'PRODUCTOS' && cavaSubTab === 'COMERCIAL' ? (
        <CavaCommercialTable items={commercialItems} onAdjust={(item) => setAdjustmentModal({ open: true, item, tipo: 'AJUSTE_POSITIVO', cantidad: '', motivo: '' })} />
      ) : (
        <InventoryStockTable
          activeTab={activeTab}
          inventory={activeTab === 'INSUMOS' ? inventory : bulkItems}
          finishedProducts={bulkItems}
          expandedId={expandedId}
          movements={movements}
          loadingMovements={loadingMovements}
          handleToggleRow={handleToggleRow}
          setAdjustmentModal={setAdjustmentModal}
        />
      )}

      <GlobalInventoryAdjustmentModal isOpen={isGlobalAdjustmentOpen} onClose={() => setIsGlobalAdjustmentOpen(false)} onSuccess={fetchData} />
      <InventoryItemAdjustmentModal adjustmentModal={adjustmentModal} setAdjustmentModal={setAdjustmentModal} activeTab={activeTab} submitAdjustment={submitAdjustment} />
    </div>
  );
}
