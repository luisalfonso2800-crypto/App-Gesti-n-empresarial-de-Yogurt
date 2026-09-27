/**
 * @file ProductsMetricsDetailModal.jsx
 * @module catalog/products/components
 * @description Modal interactivo al pulsar tarjetas métricas de productos terminados (SRP < 120 líneas).
 * @responsibility Mostrar desglose y permitir filtrar rápidamente la tabla principal por canal o estado de ficha.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies SmartModal, styles
 */
'use client';

import React from 'react';
import SmartModal from '@/components/ui/SmartModal';
import { Package, ShoppingBag, AlertCircle, ChefHat, ArrowRight } from 'lucide-react';
import styles from '../products.module.css';

export function ProductsMetricsDetailModal({
  isOpen,
  onClose,
  detailType,
  metrics,
  onFilterByChannel,
  onFilterByStatus,
  onNewProduct
}) {
  if (!isOpen || !detailType) return null;

  const titles = {
    total: { title: 'Catálogo General de Productos', subtitle: 'Listado completo de artículos finales y premezclas', icon: Package },
    canales: { title: 'Desglose por Canal de Destino', subtitle: 'Artículos comerciales para venta y bases internas', icon: ShoppingBag },
    estados: { title: 'Control de Calidad de Ficha Técnica', subtitle: 'Productos listos con precio y envase vs pendientes', icon: AlertCircle },
    recetas: { title: 'Cobertura de Recetas y Formulaciones', subtitle: 'Vínculo directo entre producto final y fórmula de producción', icon: ChefHat }
  };
  const currentMeta = titles[detailType] || titles.total;

  return (
    <SmartModal isOpen={isOpen} onClose={onClose} title={currentMeta.title} subtitle={currentMeta.subtitle} icon={currentMeta.icon}>
      <div className={styles.modalDetailContainer}>
        {detailType === 'total' && (
          <div className={styles.detailSection}>
            <div className={styles.detailStatsRow}>
              <div className={styles.detailStatBox}>
                <span className={styles.detailStatNum}>{metrics?.totalProducts || 0}</span>
                <span className={styles.detailStatLabel}>Total Registros</span>
              </div>
              <div className={styles.detailStatBox}>
                <span className={styles.detailStatNumSuccess}>{metrics?.activeCount || 0}</span>
                <span className={styles.detailStatLabel}>Activos</span>
              </div>
            </div>
            <div className={styles.detailModalActions}>
              <button type="button" className={styles.detailActionBtnPrimary} onClick={() => { onClose(); onNewProduct(); }}>
                + Registrar Nuevo Producto
              </button>
            </div>
          </div>
        )}

        {detailType === 'canales' && (
          <div className={styles.detailList}>
            <div className={styles.detailListHeader}>Filtra la tabla por el canal operativo:</div>
            <button type="button" className={styles.detailListItemBtn} onClick={() => { onFilterByChannel('COMERCIAL'); onClose(); }}>
              <div className={styles.detailItemText}>
                <span className={styles.detailItemTitle}>Productos Comerciales ({metrics?.commercialCount || 0})</span>
                <span className={styles.detailItemSub}>Destinados a la venta B2B/B2C al público</span>
              </div>
              <ArrowRight size={16} className={styles.detailArrow} />
            </button>
            <button type="button" className={styles.detailListItemBtn} onClick={() => { onFilterByChannel('WIP'); onClose(); }}>
              <div className={styles.detailItemText}>
                <span className={styles.detailItemTitle}>Bases de Planta / WIP ({metrics?.wipCount || 0})</span>
                <span className={styles.detailItemSub}>Uso interno en planta como insumo intermedio</span>
              </div>
              <ArrowRight size={16} className={styles.detailArrow} />
            </button>
            <button type="button" className={styles.detailListItemBtn} onClick={() => { onFilterByChannel('TODOS'); onClose(); }}>
              <div className={styles.detailItemText}>
                <span className={styles.detailItemTitle}>Ver Todos los Canales</span>
                <span className={styles.detailItemSub}>Mostrar comerciales y bases intermedias</span>
              </div>
              <ArrowRight size={16} className={styles.detailArrow} />
            </button>
          </div>
        )}

        {detailType === 'estados' && (
          <div className={styles.detailList}>
            <div className={styles.detailListHeader}>Filtra según la integridad de datos:</div>
            <button type="button" className={styles.detailListItemBtn} onClick={() => { onFilterByStatus('INCOMPLETO'); onClose(); }}>
              <div className={styles.detailItemText}>
                <span className={styles.detailItemTitle}>Incompletos ({metrics?.incompleteCount || 0})</span>
                <span className={styles.detailItemSub}>Requieren asignar precio de venta o tipo de envase</span>
              </div>
              <ArrowRight size={16} className={styles.detailArrow} />
            </button>
            <button type="button" className={styles.detailListItemBtn} onClick={() => { onFilterByStatus('LISTO'); onClose(); }}>
              <div className={styles.detailItemText}>
                <span className={styles.detailItemTitle}>Listos para Venta ({metrics?.readyCount || 0})</span>
                <span className={styles.detailItemSub}>Cuentan con presentación, precio y están activos</span>
              </div>
              <ArrowRight size={16} className={styles.detailArrow} />
            </button>
            <button type="button" className={styles.detailListItemBtn} onClick={() => { onFilterByStatus('DESACTIVADO'); onClose(); }}>
              <div className={styles.detailItemText}>
                <span className={styles.detailItemTitle}>Desactivados</span>
                <span className={styles.detailItemSub}>Productos dados de baja sin oferta actual</span>
              </div>
              <ArrowRight size={16} className={styles.detailArrow} />
            </button>
          </div>
        )}

        {detailType === 'recetas' && (
          <div className={styles.detailSection}>
            <div className={styles.detailStatsRow}>
              <div className={styles.detailStatBox}>
                <span className={styles.detailStatNumSuccess}>{metrics?.withRecipeCount || 0}</span>
                <span className={styles.detailStatLabel}>Con Fórmula Activa</span>
              </div>
              <div className={styles.detailStatBox}>
                <span className={styles.detailStatNum}>{metrics?.totalProducts || 0}</span>
                <span className={styles.detailStatLabel}>Total Productos</span>
              </div>
            </div>
            <p className={styles.detailExplanation}>
              Tener recetas asociadas a los productos permite calcular automáticamente costos de lote y explosión de materia prima.
            </p>
          </div>
        )}
      </div>
    </SmartModal>
  );
}
