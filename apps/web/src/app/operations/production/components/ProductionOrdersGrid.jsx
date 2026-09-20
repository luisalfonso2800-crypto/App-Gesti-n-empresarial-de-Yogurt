/**
 * @file ProductionOrdersGrid.jsx
 * @module operations/production/components
 * @description Muestra el listado de órdenes con filtro de flujo de planta y ordenamiento.
 * @responsibility Filtrar por estado operativo, ordenar por fecha descendente y renderizar grilla o empty state.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 */
import React, { useState, useMemo } from 'react';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import ProductionOrderCard from './ProductionOrderCard';
import ProductionHistoryTable from './ProductionHistoryTable';
import styles from '../production.module.css';

const TABS = {
  ACTIVOS: 'ACTIVOS',
  POR_LIQUIDAR: 'POR_LIQUIDAR',
  HISTORICO: 'HISTORICO',
  TODOS: 'TODOS'
};

const TAB_CONFIG = [
  { id: TABS.ACTIVOS, label: '🟡 Activos en Tanque' },
  { id: TABS.POR_LIQUIDAR, label: '🟢 Por Liquidar / Envasar' },
  { id: TABS.HISTORICO, label: '📁 Histórico Liquidado' },
  { id: TABS.TODOS, label: 'Ver Todos' }
];

const EMPTY_MESSAGES = {
  [TABS.ACTIVOS]: {
    title: 'No hay tanques en fermentación activa en este momento.',
    desc: 'Inicia una orden planificada o programa una nueva tanda de producción.'
  },
  [TABS.POR_LIQUIDAR]: {
    title: 'No hay órdenes pendientes de inicio o por liquidar.',
    desc: 'Todas las órdenes han sido procesadas o están activas en planta.'
  },
  [TABS.HISTORICO]: {
    title: 'No hay registros en el histórico liquidado.',
    desc: 'Las órdenes completadas y cerradas se listarán aquí para consulta.'
  },
  [TABS.TODOS]: {
    title: 'Comienza programando tu primera Orden de Producción',
    desc: 'Programa órdenes de transformación por lote a partir de las recetas activas.'
  }
};

export default function ProductionOrdersGrid({
  orders = [],
  onOpenCreate,
  startOrder,
  openComplete,
  handleReportIncident
}) {
  const [activeTab, setActiveTab] = useState(TABS.ACTIVOS);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.fechaProduccion || a.createdAt || 0).getTime();
      const dateB = new Date(b.fechaProduccion || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [orders]);

  const counts = useMemo(() => ({
    activos: orders.filter(o => ['EN_PROCESO', 'FERMENTACION', 'INCUBACION'].includes(o.estado)).length,
    porLiquidar: orders.filter(o => o.estado === 'PLANIFICADA').length,
    historico: orders.filter(o => ['COMPLETADA', 'LIQUIDADO', 'CERRADO'].includes(o.estado)).length,
    todos: orders.length
  }), [orders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === TABS.ACTIVOS) return sortedOrders.filter(o => ['EN_PROCESO', 'FERMENTACION', 'INCUBACION'].includes(o.estado));
    if (activeTab === TABS.POR_LIQUIDAR) return sortedOrders.filter(o => o.estado === 'PLANIFICADA');
    if (activeTab === TABS.HISTORICO) return sortedOrders.filter(o => ['COMPLETADA', 'LIQUIDADO', 'CERRADO'].includes(o.estado));
    return sortedOrders;
  }, [sortedOrders, activeTab]);

  const emptyInfo = EMPTY_MESSAGES[activeTab] || EMPTY_MESSAGES[TABS.TODOS];

  return (
    <div>
      <div className={styles.plantTabsContainer} role="tablist">
        {TAB_CONFIG.map(tab => {
          const count = tab.id === TABS.ACTIVOS ? counts.activos
            : tab.id === TABS.POR_LIQUIDAR ? counts.porLiquidar
            : tab.id === TABS.HISTORICO ? counts.historico
            : counts.todos;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.plantTabButton} ${isActive ? styles.plantTabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              <span className={`${styles.plantTabBadge} ${isActive ? styles.plantTabBadgeActive : ''}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <AssistedEmptyState
          icon="⚙️"
          title={emptyInfo.title}
          description={emptyInfo.desc}
          actionLabel="+ Programar Producción"
          onAction={onOpenCreate}
          topButtonLabel="+ Nueva Producción"
        />
      ) : activeTab === TABS.HISTORICO ? (
        <ProductionHistoryTable orders={filteredOrders} />
      ) : (
        <div className={styles.grid}>
          {filteredOrders.map((order) => (
            <ProductionOrderCard
              key={order.id}
              order={order}
              startOrder={startOrder}
              openComplete={openComplete}
              onReportIncident={handleReportIncident}
            />
          ))}
        </div>
      )}
    </div>
  );
}



