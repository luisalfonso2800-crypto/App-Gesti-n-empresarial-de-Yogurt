/**
 * @file RecipesMetricsDetailModal.jsx
 * @module catalog/recipes/components
 * @description Modal interactivo al pulsar tarjetas métricas de recetas técnicas (SRP < 150 líneas).
 * @responsibility Mostrar desglose y permitir filtrar rápidamente la lista por estado o crear fórmula para huérfanos.
 */
'use client';

import React from 'react';
import SmartModal from '@/components/ui/SmartModal';
import { ChefHat, CheckCircle2, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import styles from '../recipes.module.css';

const TITLES = {
  total: { title: 'Catálogo de Recetas Técnicas', subtitle: 'Formulaciones registradas en el sistema', icon: ChefHat },
  estados: { title: 'Disponibilidad de Formulaciones', subtitle: 'Recetas activas en planta vs inactivas', icon: CheckCircle2 },
  cobertura: { title: 'Cobertura de Productos', subtitle: 'Productos con fórmula vs pendientes', icon: AlertTriangle },
  etapas: { title: 'Complejidad Operativa', subtitle: 'Etapas de proceso, tiempos y temperaturas', icon: Layers }
};

export function RecipesMetricsDetailModal({
  isOpen, onClose, detailType, metrics, orphanProducts = [],
  onFilterByStatus, onNewRecipe, onSelectOrphan
}) {
  if (!isOpen || !detailType) return null;
  const currentMeta = TITLES[detailType] || TITLES.total;

  return (
    <SmartModal isOpen={isOpen} onClose={onClose} title={currentMeta.title} subtitle={currentMeta.subtitle} icon={currentMeta.icon}>
      <div className={styles.modalDetailContainer}>
        {detailType === 'total' && (
          <div className={styles.detailSection}>
            <div className={styles.detailStatsRow}>
              <div className={styles.detailStatBox}>
                <span className={styles.detailStatNum}>{metrics?.totalRecipes || 0}</span>
                <span className={styles.detailStatLabel}>Total Recetas</span>
              </div>
              <div className={styles.detailStatBox}>
                <span className={styles.detailStatNumSuccess}>{metrics?.activeCount || 0}</span>
                <span className={styles.detailStatLabel}>Activas en Planta</span>
              </div>
            </div>
            <div className={styles.detailModalActions}>
              <button type="button" className={styles.detailActionBtnPrimary} onClick={() => { onClose(); onNewRecipe(); }}>
                + Formular Nueva Receta
              </button>
            </div>
          </div>
        )}

        {detailType === 'estados' && (
          <div className={styles.detailList}>
            <div className={styles.detailListHeader}>Filtra la lista de recetas por disponibilidad:</div>
            <button type="button" className={styles.detailListItemBtn} onClick={() => { onFilterByStatus('ACTIVO'); onClose(); }}>
              <div className={styles.detailItemText}>
                <span className={styles.detailItemTitle}>Recetas Activas ({metrics?.activeCount || 0})</span>
                <span className={styles.detailItemSub}>Habilitadas para lanzar órdenes de producción</span>
              </div>
              <ArrowRight size={16} className={styles.detailArrow} />
            </button>
            <button type="button" className={styles.detailListItemBtn} onClick={() => { onFilterByStatus('INACTIVO'); onClose(); }}>
              <div className={styles.detailItemText}>
                <span className={styles.detailItemTitle}>Recetas Inactivas ({metrics?.inactiveCount || 0})</span>
                <span className={styles.detailItemSub}>Pausadas o en fase de reformulación técnica</span>
              </div>
              <ArrowRight size={16} className={styles.detailArrow} />
            </button>
            <button type="button" className={styles.detailListItemBtn} onClick={() => { onFilterByStatus('TODOS'); onClose(); }}>
              <div className={styles.detailItemText}>
                <span className={styles.detailItemTitle}>Ver Todas ({metrics?.totalRecipes || 0})</span>
                <span className={styles.detailItemSub}>Mostrar activas e inactivas</span>
              </div>
              <ArrowRight size={16} className={styles.detailArrow} />
            </button>
          </div>
        )}

        {detailType === 'cobertura' && (
          <div className={styles.detailSection}>
            <div className={styles.detailStatsRow}>
              <div className={styles.detailStatBox}>
                <span className={styles.detailStatNumSuccess}>{metrics?.totalRecipes || 0}</span>
                <span className={styles.detailStatLabel}>Productos Cubiertos</span>
              </div>
              <div className={styles.detailStatBox}>
                <span className={metrics?.orphanProductsCount > 0 ? styles.detailStatNumGold : styles.detailStatNumSuccess}>
                  {metrics?.orphanProductsCount || 0}
                </span>
                <span className={styles.detailStatLabel}>Sin Formulación</span>
              </div>
            </div>
            {orphanProducts.length > 0 ? (
              <div className={styles.detailList}>
                <div className={styles.detailListHeader}>Productos huérfanos sin receta técnica:</div>
                {orphanProducts.slice(0, 5).map((prod, idx) => (
                  <button key={`${prod.id || idx}-${idx}`} type="button" className={styles.detailListItemBtn} onClick={() => { onClose(); onSelectOrphan(prod.id); }}>
                    <div className={styles.detailItemText}>
                      <span className={styles.detailItemTitle}>{prod.nombre}</span>
                      <span className={styles.detailItemSub}>{prod.categoria || 'Producto Terminado'}</span>
                    </div>
                    <span className={styles.detailOrphanAction}>Formular +</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className={styles.detailExplanation}>¡Excelente! Todos los productos cuentan con su fórmula y explosión BOM.</p>
            )}
          </div>
        )}

        {detailType === 'etapas' && (
          <div className={styles.detailSection}>
            <div className={styles.detailStatsRow}>
              <div className={styles.detailStatBox}>
                <span className={styles.detailStatNum}>{metrics?.averageStages || 0}</span>
                <span className={styles.detailStatLabel}>Promedio Etapas / Receta</span>
              </div>
              <div className={styles.detailStatBox}>
                <span className={styles.detailStatNum}>{metrics?.totalStagesAll || 0}</span>
                <span className={styles.detailStatLabel}>Etapas Totales Planta</span>
              </div>
            </div>
            <p className={styles.detailExplanation}>
              Cada etapa representa un hito operativo con sus variables de temperatura y tiempo de retención.
            </p>
          </div>
        )}
      </div>
    </SmartModal>
  );
}
