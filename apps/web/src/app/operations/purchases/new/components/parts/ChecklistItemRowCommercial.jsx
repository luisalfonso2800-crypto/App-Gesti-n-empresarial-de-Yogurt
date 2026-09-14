/**
 * @file ChecklistItemRowCommercial.jsx
 * @module operations/purchases/new/parts
 * @description Sección expandible para modificar condiciones comerciales de un ítem de checklist en ruta.
 * @responsibility Selección alternativa de proveedor, marca, empaque y contenido neto.
 * @usedBy apps/web/src/app/operations/purchases/new/components/ChecklistItemRow.jsx
 * @dependencies React, ../../new-purchase.module.css
 */
import React from 'react';
import styles from '../../new-purchase.module.css';

export default function ChecklistItemRowCommercial({
  item,
  proveedoresDB,
  updateChecklistItem
}) {
  return (
    <div className={styles.qualitySection}>
      <div className={styles.commercialHeader}>Nuevas condiciones comerciales:</div>
      <div>
        <label className={styles.label}>Proveedor</label>
        <div className={styles.providerSelectWrapper}>
          <select 
            className={`${styles.select} ${styles.flexSelect}`} 
            value={item.idProveedorAlternativo || ''} 
            onChange={e => updateChecklistItem(item._id, 'idProveedorAlternativo', e.target.value)}
          >
            <option value="">-- Mismo Proveedor --</option>
            {proveedoresDB.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={styles.label}>Marca</label>
        <input 
          type="text" 
          className={styles.input} 
          list="marcas-list" 
          value={item.marcaAlternativa || item.insumoData?.marca || item.marca || ''} 
          onChange={e => updateChecklistItem(item._id, 'marcaAlternativa', e.target.value)} 
        />
      </div>
      <div className={styles.commercialGridRow}>
        <div className={styles.flexItem}>
          <label className={styles.label}>Empaque Comercial</label>
          <input 
            type="text" 
            className={styles.input} 
            value={item.empaqueAlternativo || item.priceData?.presentacionCompra || 'Bulto'} 
            onChange={e => updateChecklistItem(item._id, 'empaqueAlternativo', e.target.value)} 
          />
        </div>
        <div className={styles.netContentInput}>
          <label className={styles.label}>Cont. Neto</label>
          <input 
            type="number" 
            step="any" 
            className={styles.input} 
            value={item.contenidoBaseEditado || item.contenidoBase || item.priceData?.cantidadEquivalenteBase || 1} 
            onChange={e => updateChecklistItem(item._id, 'contenidoBaseEditado', parseFloat(e.target.value) || 1)} 
          />
        </div>
        <div className={styles.unitSelect}>
          <label className={styles.label}>Unidad</label>
          <select 
            className={styles.select} 
            value={item.unidadBaseEditada || item.insumoData?.unidadBase || item.unidadBase || item.unidadMedida} 
            onChange={e => updateChecklistItem(item._id, 'unidadBaseEditada', e.target.value)}
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="L">L</option>
            <option value="ml">ml</option>
            <option value="Unidades">Unidades</option>
          </select>
        </div>
      </div>
    </div>
  );
}
