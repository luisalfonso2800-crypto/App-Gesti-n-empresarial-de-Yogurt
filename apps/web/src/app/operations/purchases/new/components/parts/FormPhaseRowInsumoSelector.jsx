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
                    updateDetalle(row.id, 'insumo', i);
                    updateDetalle(row.id, 'insumoSearch', i.nombre);
                    updateDetalle(row.id, 'unidadMedida', i.unidadBase || 'kg');
                    if (i.marca && i.marca !== 'N/A') {
                      updateDetalle(row.id, 'marca', i.marca);
                    }
                    updateDetalle(row.id, 'empaque', i.empaque || 'UNIDAD');
                    updateDetalle(row.id, 'empaqueTipo', i.empaque ? 'OTRO' : 'UNIDAD');
                    updateDetalle(row.id, 'contenidoNeto', i.contenidoReferencial || (['g', 'ml'].includes(i.unidadBase?.toLowerCase()) ? 1000 : 1));
                    
                    let preloaded = false;
                    if (row.proveedor?.id && supplierPrices?.length > 0) {
                      const tarifa = supplierPrices.find(sp => sp.idProveedor === row.proveedor.id && sp.idInsumo === i.id && sp.activo);
                      if (tarifa) {
                        const pParts = (tarifa.presentacionCompra || '').split(' ');
                        let matchEmpaque = pParts[0]?.toUpperCase() || 'OTRO';
                        const allowedEmpaques = ['UNIDAD', 'BOLSA', 'CAJA', 'BULTO', 'BOTELLA', 'BIDÓN', 'CANASTILLA', 'ENVASE'];
                        if (matchEmpaque === 'PAQUETE') matchEmpaque = 'BOLSA / PAQUETE';
                        else if (matchEmpaque === 'SACO') matchEmpaque = 'BULTO / SACO';
                        else if (matchEmpaque === 'FRASCO') matchEmpaque = 'BOTELLA / FRASCO';
                        else if (matchEmpaque === 'GARRAFA') matchEmpaque = 'BIDÓN / GARRAFA';
                        else if (matchEmpaque === 'BOLSA') matchEmpaque = 'BOLSA / PAQUETE';
                        else if (matchEmpaque === 'BULTO') matchEmpaque = 'BULTO / SACO';
                        else if (matchEmpaque === 'BOTELLA') matchEmpaque = 'BOTELLA / FRASCO';
                        else if (matchEmpaque === 'BIDÓN') matchEmpaque = 'BIDÓN / GARRAFA';
                        else if (!allowedEmpaques.includes(matchEmpaque)) matchEmpaque = 'OTRO';

                        updateDetalle(row.id, 'empaqueTipo', matchEmpaque);
                        updateDetalle(row.id, 'empaque', matchEmpaque === 'OTRO' ? pParts[0]?.toUpperCase() : (tarifa.presentacionCompra || 'UNIDAD').toUpperCase());
                        updateDetalle(row.id, 'contenidoNeto', tarifa.cantidadEquivalenteBase || 1);
                        updateDetalle(row.id, 'unidadMedida', tarifa.unidadPresentacion || i.unidadBase || 'kg');
                        updateDetalle(row.id, 'precioUnitario', tarifa.precioCompra || 0);
                        preloaded = true;
                      }
                    }
                    
                    if (!preloaded && i.costoBase) {
                      updateDetalle(row.id, 'precioUnitario', i.costoBase);
                    }
                    setActiveDropdown({ rowId: null, type: null });
                  }}>
                    {i.nombre} <span className={styles.insumoUnitSub}>({i.unidadBase})</span>
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
