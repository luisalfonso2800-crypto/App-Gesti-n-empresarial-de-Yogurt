/**
 * @file PurchasesActiveOrdersSection.jsx
 * @module operations/purchases/components
 * @description Sección de tarjetas para órdenes preparadas o en ruta con soporte de fusión y eliminación.
 * @responsibility Renderizar las tarjetas de órdenes activas y controles de fusión.
 * @usedBy apps/web/src/app/operations/purchases/page.jsx
 * @dependencies react, next/navigation, lucide-react, @/components/ui/Button, @/components/ui/Badge
 */
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GitMerge, Pencil, Trash2, Eye } from 'lucide-react';
import styles from '../purchases.module.css';

export default function PurchasesActiveOrdersSection({
  activeOrders,
  isMergingMode,
  selectedForMerge,
  setIsMergingMode,
  setSelectedForMerge,
  executeMerge,
  handleToggleMergeSelection,
  setEditNameValue,
  setEditNameModalOpen,
  setDeleteModalOpen
}) {
  const router = useRouter();
  if (!activeOrders || activeOrders.length === 0) return null;

  return (
    <div className={styles.activeOrdersSection}>
      <div className={styles.activeOrdersHeader}>
        <h2 className={styles.activeOrdersTitle}>Listas Preparadas / En Ruta</h2>
        <div className={styles.actions}>
          {isMergingMode && selectedForMerge.length >= 2 && (
            <Button variant="primary" onClick={executeMerge}>Confirmar Fusión</Button>
          )}
          {isMergingMode && (
            <Button variant="secondary" onClick={() => { setIsMergingMode(false); setSelectedForMerge([]); }}>
              Cancelar Fusión
            </Button>
          )}
          {!isMergingMode && (
            <Button variant="secondary" onClick={() => setIsMergingMode(true)}>
              <GitMerge size={16} /> Fusionar Seleccionadas
            </Button>
          )}
        </div>
      </div>
      <div className={styles.activeOrdersGrid}>
        {activeOrders.map((order) => {
          const totalItems = order.items?.length || 0;
          const completedItems = order.items?.filter(i => i.estadoItem !== 'PENDIENTE').length || 0;
          
          return (
            <div key={order.id} className={styles.orderCard}>
              {isMergingMode && (
                <input 
                  type="checkbox" 
                  className={styles.mergeCheckbox}
                  checked={selectedForMerge.includes(order.id)}
                  onChange={() => handleToggleMergeSelection(order.id)}
                />
              )}
              <div className={styles.orderCardBody}>
                <div className={styles.orderCardHeader}>
                  <span className={styles.orderCardCode}>{order.codigo}</span>
                  <Badge status="active">{order.estado}</Badge>
                </div>
                <div className={styles.orderCardTitleRow}>
                  <span className={styles.orderNameContainer}>
                    <span>{order.nombre}</span>
                    <button 
                      title="Editar Nombre" 
                      onClick={() => { setEditNameValue(order.nombre); setEditNameModalOpen(order.id); }} 
                      className={styles.btnActionIcon}
                    >
                      <Pencil size={14} />
                    </button>
                  </span>
                </div>
                <div className={styles.orderCardProgress}>
                  Progreso: {completedItems} / {totalItems} ítems procesados
                </div>
                <div className={styles.orderCardActions}>
                  <Button 
                    variant="primary" 
                    onClick={() => router.push(`/operations/purchases/new?orderId=${order.id}`)} 
                    className={styles.btnViewOrder}
                  >
                    <Eye size={16} /> Ver Lista
                  </Button>
                  <Button 
                    variant="danger" 
                    title="Eliminar Lista" 
                    onClick={() => setDeleteModalOpen(order.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
