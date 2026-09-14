/**
 * @file FormPhaseRowItem.jsx
 * @module operations/purchases/new/parts
 * @description Fila interactiva para registrar insumo, proveedor, presentación, cantidad y precio en ruta.
 * @responsibility Selección con dropdown, validaciones de contenido neto y cálculo en tiempo real por fila.
 * @usedBy apps/web/src/app/operations/purchases/new/components/FormPhase.jsx
 * @dependencies React, @/utils/numberToWords, ../../new-purchase.module.css
 */
import React from 'react';
import { montoATextoPesos } from '@/utils/numberToWords';
import styles from '../../new-purchase.module.css';

export default function FormPhaseRowItem({
  row,
  idx,
  removeRow,
  updateDetalle,
  clearInsumo,
  activeDropdown,
  setActiveDropdown,
  openDropdown,
  dropdownSearch,
  setDropdownSearch,
  filteredProveedores,
  filteredInsumosByRow,
  supplierPrices,
  setNewProvTargetRow,
  setInitialProvData,
  setShowNewProvModal,
  setNewInsumoTargetRow,
  setInitialSupplyData,
  setShowNewInsumoModal
}) {
  const isProvDropOpen = activeDropdown.rowId === row.id && activeDropdown.type === 'proveedor';
  const isInsumoDropOpen = activeDropdown.rowId === row.id && activeDropdown.type === 'insumo';

  const empaquesNum = parseInt(row.empaques, 10) || 0;
  const precioUnitarioNum = parseInt(row.precioUnitario, 10) || 0;
  const contNetoNum = parseFloat(row.contenidoNeto) || 1;
  const ingresoNeto = Math.round(empaquesNum * contNetoNum);
  const subtotalRow = empaquesNum * precioUnitarioNum;
  const unidadLabel = row.unidadMedida === 'Unidades' ? 'und' : (row.unidadMedida || 'ml');

  return (
    <div className={`${styles.formRowCard} ${idx === 0 ? styles.formRowCardFirst : styles.formRowCardNormal}`}>
      {/* Cabecera de fila */}
      <div className={styles.rowCardTopBar}>
        <div className={styles.rowCardTagGroup}>
          {idx === 0 && <span className={styles.lastAddedBadge}>✦ ÚLTIMA ADICIÓN</span>}
          <span className={styles.rowItemNumber}>ÍTEM #{idx + 1}</span>
        </div>

        <button
          type="button"
          onClick={() => removeRow(row.id)}
          className={styles.rowDeleteBtn}
          title="Eliminar este ítem"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>

      {/* Línea 1: Insumo, proveedor, marca y empaque */}
      <div className={styles.line1Grid}>
        {/* Proveedor */}
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

        {/* Insumo */}
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

        {/* Marca */}
        <div>
          <label className={styles.fieldLabel}>Marca</label>
          <input
            type="text"
            placeholder="Marca del producto..."
            value={row.marca || ''}
            onChange={e => {
              const val = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '').toUpperCase();
              updateDetalle(row.id, 'marca', val);
            }}
            className={styles.marcaInput}
          />
        </div>

        {/* Empaque y Presentación */}
        <div>
          <label className={styles.fieldLabel}>Empaque / Contenido por unidad</label>
          <div className={styles.empaqueGroup}>
            <select
              value={row.empaqueTipo || 'UNIDAD'}
              onChange={e => {
                const tipo = e.target.value;
                updateDetalle(row.id, 'empaqueTipo', tipo);
                if (tipo === 'UNIDAD') {
                  updateDetalle(row.id, 'contenidoNeto', '1');
                  updateDetalle(row.id, 'empaque', 'UNIDAD');
                } else if (tipo !== 'OTRO') {
                  updateDetalle(row.id, 'empaque', tipo);
                } else {
                  updateDetalle(row.id, 'empaque', '');
                }
              }}
              className={styles.empaqueSelect}
            >
              <option value="UNIDAD">UNIDAD</option>
              <option value="BOLSA / PAQUETE">BOLSA</option>
              <option value="CAJA">CAJA</option>
              <option value="BULTO / SACO">BULTO</option>
              <option value="BOTELLA / FRASCO">BOTELLA</option>
              <option value="BIDÓN / GARRAFA">BIDÓN</option>
              <option value="CANASTILLA">CANASTILLA</option>
              <option value="ENVASE">ENVASE</option>
              <option value="OTRO">OTRO</option>
            </select>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Contenido c/u"
              value={row.contenidoNeto ? row.contenidoNeto.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : ''}
              disabled={row.empaqueTipo === 'UNIDAD'}
              onChange={e => {
                let raw = e.target.value.replace(/[^0-9.]/g, '');
                if ((raw.match(/\./g) || []).length > 1) raw = raw.replace(/\.+$/, '');
                updateDetalle(row.id, 'contenidoNeto', raw);
              }}
              className={`${styles.netContentField} ${row.empaqueTipo === 'UNIDAD' ? styles.netContentDisabled : styles.netContentEnabled}`}
            />
            <select
              value={row.unidadMedida || 'kg'}
              disabled={row.empaqueTipo === 'UNIDAD'}
              onChange={e => updateDetalle(row.id, 'unidadMedida', e.target.value)}
              className={`${styles.unitField} ${row.empaqueTipo === 'UNIDAD' ? styles.unitDisabled : styles.unitEnabled}`}
            >
              <option value="ml">ml</option>
              <option value="L">L</option>
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="oz">oz</option>
              <option value="Unidades">und</option>
            </select>
          </div>
          {row.empaqueTipo === 'OTRO' && (
            <input 
              type="text" 
              className={styles.empaqueOtroInput} 
              placeholder="Especifique empaque" 
              value={row.empaque || ''} 
              onChange={e => updateDetalle(row.id, 'empaque', e.target.value.toUpperCase())} 
            />
          )}
        </div>
      </div>

      {/* Línea 2: Transacción económica y cálculos en vivo */}
      <div className={styles.line2Grid}>
        <div className={styles.line2Col}>
          <label className={styles.line2Label}>Cant. Empaques</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={row.empaques ? row.empaques.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
            onChange={e => {
              let raw = e.target.value.replace(/\D/g, '');
              updateDetalle(row.id, 'empaques', raw);
            }}
            className={styles.empaquesInput}
          />
        </div>

        <div className={styles.line2Col}>
          <label className={styles.line2Label}>Precio Unitario ($)</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={row.precioUnitario ? row.precioUnitario.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
            onChange={e => {
              let raw = e.target.value.replace(/\D/g, '');
              updateDetalle(row.id, 'precioUnitario', raw);
            }}
            className={styles.unitPriceInput}
          />
          {precioUnitarioNum > 0 && (
            <span className={styles.priceWordsSub}>
              ✦ {montoATextoPesos(precioUnitarioNum)}
            </span>
          )}
        </div>

        <div className={styles.line2SummaryPanel}>
          <div className={styles.summaryColRight}>
            <span className={styles.summaryMicroLabel}>Ingreso Neto</span>
            <strong className={styles.netIngresoVal}>
              {ingresoNeto.toLocaleString('es-CO')} {unidadLabel}
            </strong>
            <span className={styles.netIngresoFormula}>
              {row.empaques && row.contenidoNeto 
                ? `(${row.empaques} ${row.empaque?.toLowerCase() || 'empaques'} × ${Number(row.contenidoNeto).toLocaleString('es-CO')} ${row.unidadMedida || 'ml'})` 
                : ''}
            </span>
          </div>

          <div className={styles.summaryColRight}>
            <span className={styles.summaryMicroLabel}>Subtotal</span>
            <strong className={styles.subtotalVal}>
              ${subtotalRow.toLocaleString('es-CO')}
            </strong>
            {subtotalRow > 0 && (
              <span className={styles.subtotalWordsSub}>
                ✦ {montoATextoPesos(subtotalRow)}
              </span>
            )}
          </div>
        </div>
      </div>

      {row.insumo && empaquesNum > 0 && (
        <div className={styles.rowItemFooterSummary}>
          ✦ <strong>Resumen:</strong> Comprando <strong>{row.empaques || 0} {row.empaque?.toLowerCase() || 'unidades'}</strong> de <strong>{Number(row.contenidoNeto || 1).toLocaleString('es-CO')} {row.unidadMedida || 'ml'}</strong> cada una. Ingresarán <strong>{Number(empaquesNum * contNetoNum).toLocaleString('es-CO')} {row.unidadMedida || 'ml'}</strong> de <em>{row.insumo.nombre || 'insumo'}</em> a bodega por <strong>${subtotalRow.toLocaleString('es-CO')}</strong>.
        </div>
      )}
    </div>
  );
}
