/**
 * @file purchases/new/components/QuickSupplyModal.jsx
 * @module components/QuickSupplyModal
 * @description Modal de alta rápida de insumo desde el flujo de compras.
 * @responsibility Proveer la UI y lógica para crear nuevos insumos.
 * @usedBy apps/web/src/app/operations/purchases/new/page.jsx
 * @dependencies apiClient, useState
 */
import { apiClient } from '@/lib/api-client';
import styles from '../new-purchase.module.css';

export function QuickSupplyModal({
  show,
  onClose,
  newInsumo,
  setNewInsumo,
  setInsumosDB,
  proveedorSeleccionado,
  setSupplierPrices,
  detalles,
  setDetalles,
  targetRowId,
  setActiveInsumoDropdown,
  showNotification
}) {
  if (!show) return null;

  const handleCreateInsumo = async () => {
    try {
      const payload = { ...newInsumo, subcategoria: newInsumo.subcategoria || 'N/A' };
      const i = await apiClient.post('/supplies', payload);
      if (i) {
        setInsumosDB(prev => [...prev, i]);
        
        // Simular que este proveedor suministra este insumo recién creado
        if (proveedorSeleccionado) {
          setSupplierPrices(prev => [...prev, { idProveedor: proveedorSeleccionado.id, idInsumo: i.id }]);
        }
        
        if (setDetalles && detalles) {
          setDetalles(detalles.map(d => {
            if (d.id === targetRowId) {
              return { ...d, insumo: i, unidadMedida: i.unidadBase || 'kg', marca: i.marca || '' };
            }
            return d;
          }));
        }
        
        onClose();
        if (setActiveInsumoDropdown) setActiveInsumoDropdown(null);
        showNotification(`Insumo "${i.nombre}" registrado exitosamente.`, 'success');
      } else {
        showNotification("Error al registrar insumo en el sistema.", 'error');
      }
    } catch (err) {
      const serverError = err?.response?.data?.message || err?.response?.data?.error || err?.message;
      console.error('Detalle error insumo:', err?.response?.data);
      showNotification(`Error de red al registrar insumo: ${JSON.stringify(serverError)}`, 'error');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalTitle}>Nuevo Insumo</div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre</label>
          <input type="text" className={styles.input} value={newInsumo.nombre} onChange={e => setNewInsumo({...newInsumo, nombre: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Marca</label>
          <input type="text" className={styles.input} value={newInsumo.marca} onChange={e => setNewInsumo({...newInsumo, marca: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Categoría</label>
          <select className={styles.select} value={newInsumo.categoria} onChange={e => setNewInsumo({...newInsumo, categoria: e.target.value})}>
            <option value="MATERIA_PRIMA">Materia Prima</option>
            <option value="EMPAQUE">Empaque</option>
            <option value="LIMPIEZA">Limpieza</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Unidad Base</label>
          <select className={styles.select} value={newInsumo.unidadBase} onChange={e => setNewInsumo({...newInsumo, unidadBase: e.target.value})}>
            <option value="kg">Kilogramos (kg)</option>
            <option value="L">Litros (L)</option>
            <option value="Unidades">Unidad (Unidades)</option>
            <option value="g">Gramos (g)</option>
            <option value="ml">Mililitros (ml)</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Stock Mínimo</label>
          <input type="number" className={styles.input} value={newInsumo.stockMinimo} onChange={e => setNewInsumo({...newInsumo, stockMinimo: parseFloat(e.target.value) || 0})} />
        </div>
        <div className={styles.modalActions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
          <button type="button" className={styles.saveBtn} onClick={handleCreateInsumo}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
