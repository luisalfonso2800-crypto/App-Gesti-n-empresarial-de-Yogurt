/**
 * @file FormPhaseRowPackaging.jsx
 * @module operations/purchases/new/parts
 * @description Controles de marca, tipo de empaque, contenido neto y unidad de medida (< 150 líneas).
 * @usedBy apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowItem.jsx
 * @dependencies React, ../../new-purchase.module.css
 */
import React from 'react';
import styles from '../../new-purchase.module.css';

export default function FormPhaseRowPackaging({ row, updateDetalle, hasPokaYokeWarning }) {
  return (
    <>
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
            className={`${styles.netContentField} ${row.empaqueTipo === 'UNIDAD' ? styles.netContentDisabled : styles.netContentEnabled} ${hasPokaYokeWarning ? styles.netContentFieldWarning : ''}`}
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

        {Array.isArray(row.availablePresentations) && row.availablePresentations.length > 1 && (
          <div className={styles.presentationsRow}>
            <span>Presentaciones:</span>
            {row.availablePresentations.map((p, pIdx) => {
              const isActive = (row.empaque === p.presentacionCompra?.toUpperCase() || (row.empaqueTipo === 'UNIDAD' && p.presentacionCompra?.toUpperCase() === 'UNIDAD')) && Number(row.contenidoNeto) === Number(p.cantidadEquivalenteBase);
              return (
                <button
                  key={p.id || pIdx}
                  type="button"
                  onClick={() => {
                    const parts = (p.presentacionCompra || '').split(' ');
                    const firstPart = parts[0]?.toUpperCase() || 'OTRO';
                    const allowed = ['UNIDAD', 'BOLSA', 'CAJA', 'BULTO', 'BOTELLA', 'BIDÓN', 'CANASTILLA', 'ENVASE'];
                    let tipo = 'OTRO';
                    if (firstPart === 'PAQUETE' || firstPart === 'BOLSA') tipo = 'BOLSA / PAQUETE';
                    else if (firstPart === 'SACO' || firstPart === 'BULTO') tipo = 'BULTO / SACO';
                    else if (firstPart === 'FRASCO' || firstPart === 'BOTELLA') tipo = 'BOTELLA / FRASCO';
                    else if (firstPart === 'GARRAFA' || firstPart === 'BIDÓN') tipo = 'BIDÓN / GARRAFA';
                    else if (allowed.includes(firstPart)) tipo = firstPart;

                    updateDetalle(row.id, 'empaqueTipo', tipo);
                    updateDetalle(row.id, 'empaque', (p.presentacionCompra || 'UNIDAD').toUpperCase());
                    updateDetalle(row.id, 'contenidoNeto', String(p.cantidadEquivalenteBase || 1));
                    updateDetalle(row.id, 'unidadMedida', p.unidadPresentacion || row.insumo?.unidadBase || 'kg');
                    if (p.precioCompra) updateDetalle(row.id, 'precioUnitario', String(p.precioCompra));
                  }}
                  className={`${styles.presentationPill} ${isActive ? styles.presentationPillActive : ''}`}
                >
                  {p.presentacionCompra} (${Number(p.precioCompra || 0).toLocaleString('es-CO')})
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
