/**
 * @file purchases/new/components/QuickSupplierModal.jsx
 * @module components/QuickSupplierModal
 * @description Modal de alta rápida de proveedor desde el flujo de compras.
 * @responsibility Proveer la UI y lanzar la petición de creación de proveedor.
 * @usedBy apps/web/src/app/operations/purchases/new/page.jsx
 * @dependencies apiClient, useState
 */
import { apiClient } from '@/lib/api-client';
import styles from '../new-purchase.module.css';

export function QuickSupplierModal({ 
  show, 
  onClose, 
  newProv, 
  setNewProv, 
  setProveedoresDB, 
  targetRowId, 
  setTargetRowId, 
  setProveedorSeleccionado, 
  setProvSearch, 
  setShowProvDropdown, 
  updateChecklistItem, 
  showNotification 
}) {
  if (!show) return null;

  const handleCreateProv = async () => {
    if (!newProv.nombre || !newProv.nitCedula) {
      alert("Nombre y NIT/Cédula son obligatorios.");
      return;
    }
    
    const payload = {
      nombre: newProv.nombre?.trim(),
      nitCedula: newProv.nitCedula?.trim(),
      nombreContacto: newProv.personaContacto?.trim() || newProv.nombreContacto?.trim() || null,
      telefono: newProv.telefono?.trim() || null,
      email: newProv.email?.trim() || null,
      direccion: newProv.direccion?.trim() || null,
      observaciones: newProv.observaciones?.trim() || null,
      activo: newProv.activo !== undefined ? newProv.activo : true,
    };

    try {
      const p = await apiClient.post('/suppliers', payload);
      if (p) {
        setProveedoresDB(prev => [...prev, p]);
        
        if (targetRowId !== null) {
          updateChecklistItem(targetRowId, 'idProveedorAlternativo', p.id);
          setTargetRowId(null);
        } else {
          if (setProveedorSeleccionado) setProveedorSeleccionado(p);
          if (setProvSearch) setProvSearch(p.nombre);
          if (setShowProvDropdown) setShowProvDropdown(false);
        }
        
        onClose();
        showNotification(`Proveedor "${payload.nombre}" registrado y asignado.`);
      } else {
        alert("Error al registrar proveedor en el sistema.");
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Error de red al registrar proveedor (posible NIT duplicado)";
      alert(msg);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalTitle}>Nuevo Proveedor</div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre / Razón Social *</label>
          <input type="text" className={styles.input} value={newProv.nombre} onChange={e => setNewProv({...newProv, nombre: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>NIT / Cédula *</label>
          <input type="text" className={styles.input} value={newProv.nitCedula} onChange={e => setNewProv({...newProv, nitCedula: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Teléfono</label>
          <input type="text" className={styles.input} value={newProv.telefono} onChange={e => setNewProv({...newProv, telefono: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input type="email" className={styles.input} value={newProv.email} onChange={e => setNewProv({...newProv, email: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Persona de Contacto</label>
          <input type="text" className={styles.input} value={newProv.personaContacto} onChange={e => setNewProv({...newProv, personaContacto: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Dirección</label>
          <input type="text" className={styles.input} value={newProv.direccion} onChange={e => setNewProv({...newProv, direccion: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Observaciones</label>
          <textarea className={styles.input} value={newProv.observaciones} onChange={e => setNewProv({...newProv, observaciones: e.target.value})} />
        </div>
        <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" checked={newProv.activo} onChange={e => setNewProv({...newProv, activo: e.target.checked})} />
          <label className={styles.label} style={{ margin: 0 }}>Activo</label>
        </div>
        <div className={styles.modalActions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
          <button type="button" className={styles.saveBtn} onClick={handleCreateProv}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
