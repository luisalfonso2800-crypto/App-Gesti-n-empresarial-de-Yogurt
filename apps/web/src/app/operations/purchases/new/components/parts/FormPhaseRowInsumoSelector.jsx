/**
 * @file FormPhaseRowInsumoSelector.jsx
 * @module operations/purchases/new/parts
 * @description Selector y dropdown reactivo de Insumo con soporte para nuevo insumo (< 150 líneas).
 * @usedBy apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowSelectors.jsx
 * @dependencies React, ../../new-purchase.module.css
 */
import React from 'react';
import styles from '../../new-purchase.module.css';

export default function FormPhaseRowInsumoSelector({
  row,
  updateDetalle,
  selectInsumoRow,
  clearInsumo,
  activeDropdown,
  setActiveDropdown,
  openDropdown,
  dropdownSearch,
  setDropdownSearch,
  filteredInsumosByRow,
  supplierPrices,
  setNewInsumoTargetRow,
  setInitialSupplyData,
  setShowNewInsumoModal
}) {
  const isInsumoDropOpen = activeDropdown.rowId === row.id && activeDropdown.type === 'insumo';

  return (
    <div className={styles.fieldRelWrapper}>
      <div className={styles.insumoHeaderRow}>
        <label className={styles.fieldLabel}>
          Insumo <span className={styles.reqStar}>*</span>
        </label>
        {row.insumo && (
          <span className={styles.insumoMetaText}>
            Unidad: {row.insumo.unidadBase || 'ml'} | Mín: {row.insumo.stockMinimo || 0}
          </span>
        )}
      </div>
      <div className={styles.inputControlWrapper}>
        <input
          type="text"
          placeholder="Buscar insumo..."
          value={isInsumoDropOpen ? dropdownSearch : (row.insumo?.nombre || row.insumoSearch || '')}
          onFocus={() => openDropdown(row.id, 'insumo', row.insumo?.nombre || row.insumoSearch || '')}
          onChange={e => {
            const val = e.target.value;
            setDropdownSearch(val);
            if (val === '') {
              clearInsumo(row.id);
            } else {
              if (row.insumo) updateDetalle(row.id, 'insumo', null);
              updateDetalle(row.id, 'insumoSearch', val);
            }
          }}
          className={styles.insumoInput}
        />
        {(row.insumo || row.insumoSearch) && (
          <button
            type="button"
            onClick={() => clearInsumo(row.id)}
            className={styles.clearFieldBtn}
            title="Limpiar insumo"
          >
            ✕
          </button>
        )}
      </div>
      {isInsumoDropOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownAction} onClick={() => {
            setNewInsumoTargetRow(row.id);
            setInitialSupplyData({ nombre: dropdownSearch });
            setShowNewInsumoModal(true);
            setActiveDropdown({ rowId: null, type: null });
          }}>
            + Nuevo Insumo
          </div>
          {(() => {
            const { filtered, showingAll } = filteredInsumosByRow(row, dropdownSearch);
            return (
              <>
                {showingAll && row.proveedor?.id && (
                  <div className={styles.showingAllInsumosNote}>
                    Mostrando todos los insumos (sin cotización previa para este proveedor)
                  </div>
                )}
                {filtered.map(i => (
                  <div key={i.id} className={styles.dropdownItem} onClick={() => {
                    if (typeof selectInsumoRow === 'function') {
                      selectInsumoRow(row.id, i);
                    } else {
                      updateDetalle(row.id, 'insumo', i);
                      updateDetalle(row.id, 'insumoSearch', i.nombre);
                    }
                    setActiveDropdown({ rowId: null, type: null });
                  }}>
                    <div className={styles.insumoOptionItem}>
                      <span className={styles.insumoOptionTitle}>{i.nombre}</span>
                      <span className={styles.insumoOptionSubtitle}>
                        {i.contenidoReferencial && Number(i.contenidoReferencial) > 0
                          ? `${Number(i.contenidoReferencial).toLocaleString('es-CO')} ${i.unidadBase || i.unidadMedida || ''}${i.empaque ? ` • ${i.empaque}` : ''}`
                          : `Unidad base: ${i.unidadBase || 'und'}`}
                      </span>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className={styles.dropdownEmpty}>Sin resultados</div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
