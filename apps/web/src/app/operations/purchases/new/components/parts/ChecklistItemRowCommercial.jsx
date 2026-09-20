import React, { useState } from 'react';
import styles from '../../new-purchase.module.css';
import { X } from 'lucide-react';

export default function ChecklistItemRowCommercial({
  item,
  proveedoresDB = [],
  updateChecklistItem,
  onClose
}) {
  const [formData, setFormData] = useState({
    idProveedorAlternativo: item.idProveedorAlternativo || '',
    marcaAlternativa: item.marcaAlternativa || item.insumoData?.marca || item.marca || '',
    empaqueAlternativo: item.empaqueAlternativo || item.priceData?.presentacionCompra || item.presentacionCompra || 'Empaque',
    contenidoBaseEditado: item.contenidoBaseEditado || item.contenidoBase || item.priceData?.cantidadEquivalenteBase || 1,
    unidadBaseEditada: item.unidadBaseEditada || item.insumoData?.unidadBase || item.unidadBase || item.unidadMedida || 'kg'
  });

  const handleApply = () => {
    Object.entries(formData).forEach(([key, val]) => {
      updateChecklistItem(item._id, key, val);
    });
    if (onClose) onClose();
  };

  return (
    <div className={styles.editConditionsPanel}>
      <div className={styles.editConditionsHeader}>
        <h4 className={styles.editConditionsTitle}>⚙ EDITAR CONDICIONES DE COMPRA</h4>
        <button type="button" className={styles.btnIconCompact} onClick={onClose} title="Cerrar">
          <X size={14} />
        </button>
      </div>
      <p className={styles.editConditionsSubtext}>Modifica proveedor, marca o presentación para esta compra.</p>

      <div className={styles.editConditionsGrid}>
        <div>
          <label className={styles.label}>Proveedor</label>
          <select
            className={`${styles.select} ${styles.flexSelect}`}
            value={formData.idProveedorAlternativo}
            onChange={(e) => setFormData({ ...formData, idProveedorAlternativo: e.target.value })}
          >
            <option value="">Mantener proveedor actual</option>
            {proveedoresDB.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={styles.label}>Marca</label>
          <input
            type="text"
            className={styles.input}
            list="marcas-list"
            value={formData.marcaAlternativa}
            onChange={(e) => setFormData({ ...formData, marcaAlternativa: e.target.value })}
          />
        </div>

        <div>
          <label className={styles.label}>Presentación comercial</label>
          <input
            type="text"
            className={styles.input}
            value={formData.empaqueAlternativo}
            onChange={(e) => setFormData({ ...formData, empaqueAlternativo: e.target.value })}
          />
        </div>

        <div>
          <label className={styles.label}>Contenido neto</label>
          <div className={styles.netContentRow}>
            <input
              type="number"
              step="any"
              className={styles.input}
              value={formData.contenidoBaseEditado}
              onChange={(e) => setFormData({ ...formData, contenidoBaseEditado: parseFloat(e.target.value) || 1 })}
            />
            <select
              className={`${styles.select} ${styles.selectUnitCompact}`}
              value={formData.unidadBaseEditada}
              onChange={(e) => setFormData({ ...formData, unidadBaseEditada: e.target.value })}
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

      <div className={styles.editActionsRow}>
        <button type="button" className={styles.btnCancelEdit} onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className={styles.btnApplyEdit} onClick={handleApply}>
          Aplicar cambios
        </button>
      </div>
    </div>
  );
}
