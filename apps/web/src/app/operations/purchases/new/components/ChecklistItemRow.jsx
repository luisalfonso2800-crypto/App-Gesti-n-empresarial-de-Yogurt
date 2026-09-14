/**
 * @file ChecklistItemRow.jsx
 * @module operations/purchases/new/components
 * @description Tarjeta interactiva para control de adquisición de un ítem en ruta (<150 líneas, SRP).
 * @responsibility Renderizado del ítem, cantidades, precios y delegación a subcomponentes y hook de acciones.
 * @usedBy apps/web/src/app/operations/purchases/new/components/ChecklistSection.jsx
 * @dependencies React, lucide-react, ../new-purchase.module.css, ./parts/*, ../hooks/useChecklistItemActions
 */
import React from 'react';
import styles from '../new-purchase.module.css';
import { AlertCircleIcon, XIcon, CheckIcon } from '@/components/ui/icons';
import { ArrowRightLeft } from 'lucide-react';
import ChecklistItemRowMoveModal from './parts/ChecklistItemRowMoveModal';
import ChecklistItemRowCommercial from './parts/ChecklistItemRowCommercial';
import ChecklistItemRowMotivos from './parts/ChecklistItemRowMotivos';
import { useChecklistItemActions } from '../hooks/useChecklistItemActions';

export function ChecklistItemRow({ item, checklistMgr, proveedoresDB, setPendingItems, setComprasAsentadas }) {
  const { updateChecklistItem } = checklistMgr;
  const {
    lists, availableLists, isMoveModalOpen, setIsMoveModalOpen,
    selectedTargetList, setSelectedTargetList, moveError, setMoveError,
    isMoving, handleMoveList, handleMantenerEnLista, handleDescartarItem, handleConseguido
  } = useChecklistItemActions({ item, checklistMgr, proveedoresDB, setPendingItems, setComprasAsentadas });

  const cantidad = item.cantidadSolicitada || 1;
  const precio = item.precioCompraActual || 0;
  const subtotal = cantidad * precio;
  const contenidoNeto = item.contenidoBaseEditado || item.contenidoBase || item.priceData?.cantidadEquivalenteBase || 1;
  const ingresoNetoBodega = cantidad * contenidoNeto;
  const costoBaseUnitario = ingresoNetoBodega > 0 ? subtotal / ingresoNetoBodega : 0;
  const unidadBase = item.unidadBaseEditada || item.insumoData?.unidadBase || item.unidadBase || item.unidadMedida || '';

  return (
    <div className={`${styles.checklistCard} ${item.estadoOperativo === 'CONSEGUIDO' ? styles.checklistCardConseguido : styles.checklistCardNoConseguido}`}>
      <div className={styles.checklistHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.insumoName}>{item.insumoData?.nombre || item.nombre}</span>
          {item.duplicateWarning && <span className={styles.duplicateWarningBadge}>{item.duplicateWarning}</span>}
        </div>
        <span className={styles.badge}>Categoría: {item.insumoData?.categoria || item.categoria || 'N/A'}</span>
        <span className={styles.badge}>Marca: {item.insumoData?.marca || item.marca || 'Sin marca'}</span>
        <span className={`${styles.badge} ${styles.badgeStock}`}>
          Stock Mín: {item.insumoData?.stockMinimo || item.stockMinimo || 0} {item.insumoData?.unidadBase || item.unidadBase || item.unidadMedida}
        </span>
        <span className={styles.presentationInfo}>
          Presentación: {item.priceData?.presentacionCompra || item.presentacionCompra || 'N/A'} ({contenidoNeto} {unidadBase})
        </span>
      </div>

      {item.duplicateWarning && (
        <div className={styles.duplicateAlertBox}>
          <AlertCircleIcon size={18} />
          <b>Atención:</b> {item.duplicateWarning}
        </div>
      )}

      <div className={`${styles.checklistBody} ${(item.estadoOperativo === 'NO_CONSEGUIDO' || item.estadoOperativo === 'DESCARTADO') ? styles.disabledArea : ''}`}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Cant. Solicitada</label>
          <input 
            type="number" className={`${styles.input} ${styles.qtyInput}`} min="1" step="any"
            value={item.cantidadSolicitada} 
            onChange={(e) => updateChecklistItem(item._id, 'cantidadSolicitada', parseFloat(e.target.value))} 
            onBlur={(e) => {
              let val = parseFloat(e.target.value);
              if (isNaN(val) || val < 1) updateChecklistItem(item._id, 'cantidadSolicitada', 1);
            }}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Precio Empaque ($)</label>
          <input 
            type="number" className={`${styles.input} ${styles.priceInput}`} min="0" step="any"
            value={item.precioCompraActual} 
            onChange={(e) => updateChecklistItem(item._id, 'precioCompraActual', parseFloat(e.target.value) || 0)} 
          />
        </div>

        <div className={styles.summaryBlock}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Subtotal:</span>
            <span className={styles.summaryValue}>${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total neto a bodega:</span>
            <span className={styles.summaryValue}>{ingresoNetoBodega.toFixed(2)} {unidadBase}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Costo unitario real:</span>
            <span className={styles.summaryValue}>${costoBaseUnitario.toFixed(2)} / {unidadBase}</span>
          </div>
        </div>
      </div>

      {(item.estadoOperativo === 'NO_CONSEGUIDO' || item.estadoOperativo === 'PENDIENTE_OTRO_PROVEEDOR') && (
        <ChecklistItemRowMotivos
          item={item} updateChecklistItem={updateChecklistItem}
          handleMantenerEnLista={handleMantenerEnLista} handleDescartarItem={handleDescartarItem}
        />
      )}

      {item.editCommercial && (
        <ChecklistItemRowCommercial item={item} proveedoresDB={proveedoresDB} updateChecklistItem={updateChecklistItem} />
      )}

      <div className={styles.checklistFooter}>
        <button 
          type="button" className={`${styles.toggleBtn} ${styles.toggleCommercialBtn}`} 
          onClick={() => updateChecklistItem(item._id, 'editCommercial', !item.editCommercial)}
        >
          ¿Comprado con otros datos? (Cambiar proveedor / marca / empaque)
        </button>

        <button 
          className={`${styles.btnNoConseguido} ${item.estadoOperativo === 'NO_CONSEGUIDO' ? styles.btnNoConseguidoActive : ''}`}
          onClick={() => updateChecklistItem(item._id, 'estadoOperativo', 'NO_CONSEGUIDO')}
        >
          <XIcon size={18} /> No Conseguido
        </button>
        <button 
          className={`${styles.btnNoConseguido} ${(!item.orderItemId || !item.currentOrderId) ? styles.moveListDisabled : ''}`}
          onClick={() => setIsMoveModalOpen(true)} title="Mover a otra lista" disabled={!item.orderItemId || !item.currentOrderId}
        >
          <ArrowRightLeft size={18} /> Mover Lista
        </button>
        <button 
          className={`${styles.btnConseguido} ${item.estadoOperativo === 'CONSEGUIDO' ? styles.btnConseguidoActive : ''}`}
          onClick={handleConseguido}
        >
          <CheckIcon size={18} /> Conseguido
        </button>
      </div>

      <ChecklistItemRowMoveModal
        isOpen={isMoveModalOpen} onClose={() => { setIsMoveModalOpen(false); setMoveError(null); }}
        item={item} availableLists={availableLists} lists={lists}
        selectedTargetList={selectedTargetList} setSelectedTargetList={setSelectedTargetList}
        moveError={moveError} setMoveError={setMoveError} isMoving={isMoving} handleMoveList={handleMoveList}
      />
    </div>
  );
}
