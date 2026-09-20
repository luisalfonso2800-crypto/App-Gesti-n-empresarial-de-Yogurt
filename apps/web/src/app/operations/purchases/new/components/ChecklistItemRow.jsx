import React, { useState } from 'react';
import styles from '../new-purchase.module.css';
import { AlertCircleIcon, CheckIcon } from '@/components/ui/icons';
import { ArrowRightLeft, ChevronDown, ChevronUp, X } from 'lucide-react';
import ChecklistItemRowMoveModal from './parts/ChecklistItemRowMoveModal';
import ChecklistItemRowCommercial from './parts/ChecklistItemRowCommercial';
import ChecklistItemRowMotivos from './parts/ChecklistItemRowMotivos';
import { useChecklistItemActions } from '../hooks/useChecklistItemActions';
import { numeroATexto } from '@/utils/numberToWords';

export function ChecklistItemRow({ item, checklistMgr, proveedoresDB, setPendingItems, setComprasAsentadas }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateChecklistItem } = checklistMgr;
  const {
    lists, availableLists, isMoveModalOpen, setIsMoveModalOpen, selectedTargetList,
    setSelectedTargetList, moveError, setMoveError, isMoving, handleMoveList,
    handleMantenerEnLista, handleDescartarItem, handleConseguido
  } = useChecklistItemActions({ item, checklistMgr, proveedoresDB, setPendingItems, setComprasAsentadas });

  const cantidad = item.cantidadSolicitada || 1;
  const precio = item.precioCompraActual || 0;
  const subtotal = cantidad * precio;
  const contenidoNeto = item.contenidoBaseEditado || item.contenidoBase || item.priceData?.cantidadEquivalenteBase || 1;
  const ingresoNeto = cantidad * contenidoNeto;
  const costoUnitario = ingresoNeto > 0 ? Number((subtotal / ingresoNeto).toFixed(2)) : 0;
  const unidadBase = item.unidadBaseEditada || item.insumoData?.unidadBase || item.unidadBase || item.unidadMedida || '';
  const subtotalEntero = Math.round(Number(subtotal) || 0);
  const isConseguido = item.estadoOperativo === 'CONSEGUIDO';
  const isNoConseguido = item.estadoOperativo === 'NO_CONSEGUIDO';

  return (
    <div className={`${styles.operationalRowWrapper} ${isConseguido ? styles.operationalRowWrapperConseguido : isNoConseguido ? styles.operationalRowWrapperNoConseguido : ''}`}>
      <div className={styles.operationalRow}>
        <div>
          <div className={styles.productTitle}>
            <span>{item.insumoData?.nombre || item.nombre}</span>
            {item.duplicateWarning && <span className={styles.duplicateWarningBadge}>!</span>}
          </div>
          <div className={styles.productSubtext}>
            {item.insumoData?.categoria || item.categoria || 'INSUMO'} · {item.insumoData?.marca || item.marca || 'Sin marca'} · {item.priceData?.presentacionCompra || item.presentacionCompra || 'Empaque'} ({contenidoNeto} {unidadBase})
          </div>
        </div>

        <div>
          <span className={styles.columnMicroLabel}>CANTIDAD</span>
          <div className={styles.inputWithUnit}>
            <input
              type="number" className={`${styles.inputBare} ${styles.inputCompact}`} min="1" step="any"
              value={item.cantidadSolicitada}
              onChange={(e) => updateChecklistItem(item._id, 'cantidadSolicitada', parseFloat(e.target.value))}
              onBlur={(e) => {
                const val = parseFloat(e.target.value);
                if (isNaN(val) || val < 1) updateChecklistItem(item._id, 'cantidadSolicitada', 1);
              }}
            />
            <span className={styles.inputUnitBadge}>{item.priceData?.presentacionCompra || item.presentacionCompra || 'empaques'}</span>
          </div>
        </div>

        <div className={styles.priceCol}>
          <span className={styles.columnMicroLabel}>PRECIO EMPAQUE</span>
          <div className={styles.inputWithCurrency}>
            <span className={styles.currencyPrefix}>$</span>
            <input
              type="number" className={`${styles.inputBare} ${styles.inputPriceCompact}`} min="0" step="any"
              value={item.precioCompraActual}
              onChange={(e) => updateChecklistItem(item._id, 'precioCompraActual', parseFloat(e.target.value) || 0)}
            />
            <span className={styles.pricePerUnit}>/ und</span>
          </div>
        </div>

        <div className={styles.bodegaCol}>
          <span className={styles.columnMicroLabel}>BODEGA</span>
          <span className={styles.netReceiptLabel}>Entran: <strong>{Math.round(ingresoNeto).toLocaleString('es-CO')} {unidadBase}</strong></span>
          <span className={styles.unitCostLabel}>Costo: <strong>$ {costoUnitario.toFixed(2)} / {unidadBase}</strong></span>
        </div>

        <div className={styles.subtotalBlock}>
          <span className={styles.columnMicroLabel}>TOTAL COMPRA</span>
          <span className={styles.subtotalAmount}>$ {subtotalEntero.toLocaleString('es-CO')}</span>
          <span className={styles.subtotalTextWords}>{numeroATexto(subtotalEntero)} M/CTE</span>
        </div>

        <div className={styles.rowActionsCol}>
          <button type="button" className={`${styles.btnCheckCompact} ${isConseguido ? styles.btnCheckCompactActive : ''}`} onClick={handleConseguido} title="Marcar como conseguido">
            <CheckIcon size={14} /> Conseguido
          </button>
          <button type="button" className={`${styles.btnIconCompact} ${isExpanded ? styles.btnIconCompactActive : ''}`} onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? 'Ocultar detalles' : 'Ver detalle / opciones'}>
            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.expandedDetailBox}>
          {item.duplicateWarning && (
            <div className={`${styles.duplicateAlertBox} ${styles.duplicateAlertExpanded}`}>
              <AlertCircleIcon size={16} /> <b>Atención:</b> {item.duplicateWarning}
            </div>
          )}
          <div className={styles.expandedDetailGrid}>
            <span><b>Stock Mín:</b> {item.insumoData?.stockMinimo || item.stockMinimo || 0} {unidadBase}</span>
            <span>•</span>
            <span><b>Presentación:</b> {item.priceData?.presentacionCompra || item.presentacionCompra || 'N/A'}</span>
            <span>•</span>
            <span><b>Contenido Neto:</b> {contenidoNeto} {unidadBase}</span>
          </div>
          <div className={styles.expandedWords}><b>Monto en letras:</b> {numeroATexto(subtotalEntero)} PESOS M/CTE</div>
          <div className={styles.expandedSecondaryActions}>
            <button
              type="button"
              className={item.editCommercial ? styles.btnEditActive : styles.btnEdit}
              onClick={() => updateChecklistItem(item._id, 'editCommercial', !item.editCommercial)}
            >
              ⚙ {item.editCommercial ? 'Editando condiciones' : 'Editar condiciones'}
            </button>
            <button type="button" className={`${styles.btnReintentar} ${styles.btnNoConseguidoSecondary}`} onClick={() => updateChecklistItem(item._id, 'estadoOperativo', 'NO_CONSEGUIDO')}>
              <X size={14} /> No Conseguido
            </button>
            <button type="button" className={styles.btnReintentar} onClick={() => setIsMoveModalOpen(true)} disabled={!item.orderItemId || !item.currentOrderId}>
              <ArrowRightLeft size={14} /> Mover Lista
            </button>
          </div>
          {(item.estadoOperativo === 'NO_CONSEGUIDO' || item.estadoOperativo === 'PENDIENTE_OTRO_PROVEEDOR') && (
            <ChecklistItemRowMotivos item={item} updateChecklistItem={updateChecklistItem} handleMantenerEnLista={handleMantenerEnLista} handleDescartarItem={handleDescartarItem} />
          )}
          {item.editCommercial && (
            <ChecklistItemRowCommercial
              item={item}
              proveedoresDB={proveedoresDB}
              updateChecklistItem={updateChecklistItem}
              onClose={() => updateChecklistItem(item._id, 'editCommercial', false)}
            />
          )}
        </div>
      )}

      <ChecklistItemRowMoveModal
        isOpen={isMoveModalOpen} onClose={() => { setIsMoveModalOpen(false); setMoveError(null); }}
        item={item} availableLists={availableLists} lists={lists}
        selectedTargetList={selectedTargetList} setSelectedTargetList={setSelectedTargetList}
        moveError={moveError} setMoveError={setMoveError} isMoving={isMoving} handleMoveList={handleMoveList}
      />
    </div>
  );
}
