/**
 * @file FormPhaseRowSelectors.jsx
 * @module operations/purchases/new/parts
 * @description Selector de proveedor y composición de selector de insumo (< 150 líneas).
 * @usedBy apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowItem.jsx
 * @dependencies React, ../../new-purchase.module.css, ./FormPhaseRowInsumoSelector
 */
import React from 'react';
import styles from '../../new-purchase.module.css';
import FormPhaseRowInsumoSelector from './FormPhaseRowInsumoSelector';

export default function FormPhaseRowSelectors(props) {
  const {
    row,
    updateDetalle,
    activeDropdown,
    setActiveDropdown,
    openDropdown,
    dropdownSearch,
    setDropdownSearch,
    filteredProveedores,
    setNewProvTargetRow,
    setInitialProvData,
    setShowNewProvModal
  } = props;

  const isProvDropOpen = activeDropdown.rowId === row.id && activeDropdown.type === 'proveedor';

  return (
    <>
      <div className={styles.fieldRelWrapper}>
        <label className={styles.fieldLabel}>Proveedor</label>
        <input
          type="text"
          placeholder="Ej: Colanta, Disar..."
          value={isProvDropOpen ? dropdownSearch : (row.proveedor?.nombre || row.provSearch || '')}
          onFocus={() => openDropdown(row.id, 'proveedor', row.proveedor?.nombre || row.provSearch || '')}
          onChange={e => {
            setDropdownSearch(e.target.value);
            if (row.proveedor) updateDetalle(row.id, 'proveedor', null);
            updateDetalle(row.id, 'provSearch', e.target.value);
          }}
          className={styles.provInput}
        />
        {(row.proveedor || row.provSearch) && (
          <button
            type="button"
            onClick={() => {
              updateDetalle(row.id, 'proveedor', null);
              updateDetalle(row.id, 'provSearch', '');
            }}
            className={styles.clearFieldBtn}
            title="Limpiar proveedor"
          >
            ✕
          </button>
        )}
        {isProvDropOpen && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownAction} onClick={() => {
              setNewProvTargetRow(row.id);
              setInitialProvData({ nombre: dropdownSearch });
              setShowNewProvModal(true);
              setActiveDropdown({ rowId: null, type: null });
            }}>
              + Nuevo Proveedor
            </div>
            {filteredProveedores(dropdownSearch).map(p => (
              <div key={p.id} className={styles.dropdownItem} onClick={() => {
                updateDetalle(row.id, 'proveedor', p);
                updateDetalle(row.id, 'provSearch', p.nombre);
                setActiveDropdown({ rowId: null, type: null });
              }}>
                {p.nombre}
              </div>
            ))}
            {filteredProveedores(dropdownSearch).length === 0 && (
              <div className={styles.dropdownEmpty}>Sin resultados</div>
            )}
          </div>
        )}
      </div>

      <FormPhaseRowInsumoSelector {...props} />
    </>
  );
}
