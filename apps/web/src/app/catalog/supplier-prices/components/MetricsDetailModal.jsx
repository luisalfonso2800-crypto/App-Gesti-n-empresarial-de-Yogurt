/**
 * @file MetricsDetailModal.jsx
 * @module catalog/supplier-prices/components
 * @description Modal informativo Poka-Yoke con desglose detallado al pulsar una tarjeta métrica (SRP < 120 líneas).
 * @responsibility Mostrar desglose y permitir filtrar rápidamente la tabla principal por el criterio seleccionado.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies SmartModal, styles
 */
'use client';

import React from 'react';
import SmartModal from '@/components/ui/SmartModal';
import { FileSpreadsheet, Truck, Boxes, TrendingDown, ArrowRight } from 'lucide-react';
import styles from '../supplier-prices.module.css';

export function MetricsDetailModal({
  isOpen, onClose, detailType, metrics,
  items = [], uniqueProveedores = [], uniqueInsumos = [],
  onFilterBySupplier, onFilterByInsumo, onFilterByStatus, onOpenNewTarifa
}) {
  if (!isOpen || !detailType) return null;

  const titles = {
    tarifas: { title: 'Desglose de Tarifas Registradas', subtitle: 'Catálogo completo y vigencia de precios de compra', icon: FileSpreadsheet },
    proveedores: { title: 'Proveedores con Cotizaciones Activas', subtitle: 'Fuentes de suministro disponibles para cotización', icon: Truck },
    insumos: { title: 'Insumos con Costo de Compra', subtitle: 'Materias primas vinculadas con cotizaciones', icon: Boxes },
    ahorro: { title: 'Opciones de Ahorro y Competitividad', subtitle: 'Materias primas cotizadas por múltiples proveedores', icon: TrendingDown }
  };
  const currentMeta = titles[detailType] || titles.tarifas;

  return (
    <SmartModal isOpen={isOpen} onClose={onClose} title={currentMeta.title} subtitle={currentMeta.subtitle} icon={currentMeta.icon}>
      <div className={styles.modalDetailContainer}>
        {detailType === 'tarifas' && (
          <div className={styles.detailSection}>
            <div className={styles.detailStatsRow}>
              <button type="button" className={styles.detailStatBoxAction} onClick={() => { onFilterByStatus('Todos'); onClose(); }} title="Ver todas las tarifas">
                <span className={styles.detailStatNum}>{metrics?.totalTarifas || 0}</span>
                <span className={styles.detailStatLabel}>Ver Todas</span>
              </button>
              <button type="button" className={styles.detailStatBoxAction} onClick={() => { onFilterByStatus('Activos'); onClose(); }} title="Filtrar vigentes">
                <span className={styles.detailStatNumSuccess}>{metrics?.activasCount || 0}</span>
                <span className={styles.detailStatLabel}>Filtrar Activas</span>
              </button>
              <button type="button" className={styles.detailStatBoxAction} onClick={() => { onFilterByStatus('Inactivos'); onClose(); }} title="Filtrar inactivas">
                <span className={styles.detailStatNumMuted}>{metrics?.inactivasCount || 0}</span>
                <span className={styles.detailStatLabel}>Filtrar Inactivas</span>
              </button>
            </div>
            <div className={styles.detailModalActions}>
              <button type="button" className={styles.detailActionBtnPrimary} onClick={() => { onClose(); onOpenNewTarifa(); }}>
                + Registrar Nueva Tarifa
              </button>
            </div>
          </div>
        )}

        {detailType === 'proveedores' && (
          <div className={styles.detailList}>
            <div className={styles.detailListHeader}>Haz clic en un proveedor para aislar sus cotizaciones:</div>
            {uniqueProveedores.map((prov) => {
              const provId = prov.id || prov.ID_Proveedor;
              const count = items.filter(i => (i.idProveedor === provId || i.proveedor?.id === provId) && i.activo).length;
              return (
                <button key={provId} type="button" className={styles.detailListItemBtn} onClick={() => { onFilterBySupplier(provId); onClose(); }}>
                  <div className={styles.detailItemText}>
                    <span className={styles.detailItemTitle}>{prov.Nombre_Proveedor || prov.nombre}</span>
                    <span className={styles.detailItemSub}>{count} tarifas activas disponibles</span>
                  </div>
                  <ArrowRight size={16} className={styles.detailArrow} />
                </button>
              );
            })}
          </div>
        )}

        {detailType === 'insumos' && (
          <div className={styles.detailList}>
            <div className={styles.detailListHeader}>Haz clic en una materia prima para ver sus costos y proveedores:</div>
            {uniqueInsumos.map((ins) => {
              const insId = ins.id || ins.ID_Insumo;
              const count = items.filter(i => (i.idInsumo === insId || i.insumo?.id === insId) && i.activo).length;
              return (
                <button key={insId} type="button" className={styles.detailListItemBtn} onClick={() => { onFilterByInsumo(insId); onClose(); }}>
                  <div className={styles.detailItemText}>
                    <span className={styles.detailItemTitle}>{ins.Nombre_Insumo || ins.nombre}</span>
                    <span className={styles.detailItemSub}>{count > 0 ? `${count} tarifas vigentes` : 'Sin cotización activa'}</span>
                  </div>
                  <ArrowRight size={16} className={styles.detailArrow} />
                </button>
              );
            })}
          </div>
        )}

        {detailType === 'ahorro' && (
          <div className={styles.detailList}>
            <div className={styles.detailListHeader}>Insumos con múltiples proveedores y margen de ahorro directo:</div>
            {(metrics?.multiCotizadosList || []).length === 0 ? (
              <div className={styles.emptyTableText}>No hay insumos con más de un proveedor activo cotizado.</div>
            ) : (
              metrics.multiCotizadosList.map((item) => (
                <button key={item.id} type="button" className={styles.detailListItemBtn} onClick={() => { onFilterByInsumo(item.id); onClose(); }}>
                  <div className={styles.detailItemText}>
                    <span className={styles.detailItemTitle}>{item.nombre}</span>
                    <span className={styles.detailItemSub}>{item.count} proveedores • Mejor: ${item.minCosto.toLocaleString('es-CO')} ({item.mejorProveedor})</span>
                  </div>
                  <div className={styles.savingBadgeRow}>
                    <span className={styles.savingBadge}>-{item.ahorro}% ahorro</span>
                    <ArrowRight size={16} className={styles.detailArrow} />
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </SmartModal>
  );
}
