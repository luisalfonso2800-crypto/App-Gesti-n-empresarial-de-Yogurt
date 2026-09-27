/**
 * @file page.jsx
 * @module operations/lots
 * @description Vista principal de trazabilidad de lotes en cava (SRP < 120 líneas, 0 inline styles).
 */
'use client';

import React from 'react';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import { Button } from '@/components/ui/Button';
import { RefreshCw, Package } from 'lucide-react';
import styles from './lots.module.css';
import { useLotsData } from './hooks/useLotsData';
import { LotsMetrics } from './components/LotsMetrics';
import { LotsMetricsDetailModal } from './components/LotsMetricsDetailModal';
import { LotsFilterBar } from './components/LotsFilterBar';
import { LotsHistoryTable } from './components/LotsHistoryTable';
import { DiscardLotModal } from './components/DiscardLotModal';

export default function LotsPage() {
  const lotsState = useLotsData();
  const {
    lots, loading, error, fetchLots, getStatus,
    tab, setTab, tabCounts,
    filterSearch, setFilterSearch,
    filterType, setFilterType,
    filterStatus, setFilterStatus,
    hasFilters, clearFilters,
    currentPage, setCurrentPage, totalPages, pageSize,
    filteredLotsCount, paginatedLots,
    globalMetrics, metricsModalOpen, selectedMetricType,
    openMetricsModal, closeMetricsModal,
    discardModalOpen, selectedLotForDiscard, discardSubmitting,
    openDiscardModal, closeDiscardModal, confirmDiscard
  } = lotsState;

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <Package className={styles.icon} size={28} />
          <div>
            <h1 className={styles.title}>Bitácora de Lotes y Cava</h1>
            <p className={styles.subtitle}>Trazabilidad de producción, cepas semielaboradas y control FEFO.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" onClick={fetchLots}><RefreshCw size={16} /> Actualizar</Button>
        </div>
      </div>

      <LotsMetrics metrics={globalMetrics} loading={loading} onCardClick={openMetricsModal} />

      <div className={styles.tabsBar}>
        <div className={styles.tabsGroup}>
          <button type="button" className={`${styles.tabBtn} ${tab === 'EXISTENCIA' ? styles.tabBtnActive : ''}`} onClick={() => setTab('EXISTENCIA')}>🟢 En Existencia ({tabCounts.act})</button>
          <button type="button" className={`${styles.tabBtn} ${tab === 'CEPAS' ? styles.tabBtnActive : ''}`} onClick={() => setTab('CEPAS')}>🧫 Cepas Disponibles ({tabCounts.cep})</button>
          <button type="button" className={`${styles.tabBtn} ${tab === 'AGOTADOS' ? styles.tabBtnActive : ''}`} onClick={() => setTab('AGOTADOS')}>📁 Archivo / Agotados ({tabCounts.ago})</button>
          <button type="button" className={`${styles.tabBtn} ${tab === 'TODOS' ? styles.tabBtnActive : ''}`} onClick={() => setTab('TODOS')}>Ver Todos ({tabCounts.all})</button>
        </div>
      </div>

      <LotsFilterBar
        filterSearch={filterSearch} setFilterSearch={setFilterSearch}
        filterType={filterType} setFilterType={setFilterType}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
        hasFilters={hasFilters} clearFilters={clearFilters}
      />

      {paginatedLots.length === 0 ? (
        <AssistedEmptyState
          icon="🏷️"
          title="No hay lotes en esta vista"
          description={hasFilters ? "No se encontraron lotes coincidentes con los filtros aplicados." : "Monitorea las existencias, cepas vivas y lotes históricos de la planta."}
          topButtonLabel={hasFilters ? "Limpiar Filtros" : "Actualizar"}
          onTopButtonClick={hasFilters ? clearFilters : fetchLots}
        />
      ) : (
        <LotsHistoryTable
          paginatedLots={paginatedLots} totalLotsCount={filteredLotsCount}
          currentPage={currentPage} totalPages={totalPages} pageSize={pageSize}
          onPageChange={setCurrentPage} getStatus={getStatus} onOpenDiscard={openDiscardModal}
        />
      )}

      <LotsMetricsDetailModal
        isOpen={metricsModalOpen} onClose={closeMetricsModal}
        type={selectedMetricType} metrics={globalMetrics} lots={lots}
        getStatus={getStatus} onSelectTab={setTab}
      />

      <DiscardLotModal
        isOpen={discardModalOpen} onClose={closeDiscardModal}
        lot={selectedLotForDiscard} onConfirm={confirmDiscard} submitting={discardSubmitting}
      />
    </div>
  );
}
