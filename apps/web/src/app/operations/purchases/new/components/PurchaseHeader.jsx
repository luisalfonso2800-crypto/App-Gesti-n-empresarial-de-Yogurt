import React from 'react';
import styles from '../new-purchase.module.css';

export function PurchaseHeader({ 
  condicion, setCondicion, 
  diasCredito, setDiasCredito,
  proveedoresDB,
  proveedorSeleccionado, setProveedorSeleccionado,
  provSearch, setProvSearch,
  showProvDropdown, setShowProvDropdown,
  filteredProv, provRef,
  observaciones, setObservaciones,
  modals
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>1. Información del Proveedor</div>
      <div className={styles.grid2}>
        <div className={styles.formGroup} ref={provRef}>
          <label className={styles.label}>Proveedor *</label>
          <input 
            type="text" 
            className={styles.input} 
            value={provSearch}
            onChange={(e) => {
              setProvSearch(e.target.value);
              setShowProvDropdown(true);
              if (proveedorSeleccionado && proveedorSeleccionado.nombre !== e.target.value) {
                setProveedorSeleccionado(null);
              }
            }}
            onFocus={() => setShowProvDropdown(true)}
            placeholder="Buscar o crear proveedor..."
          />
          {showProvDropdown && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownAction} onClick={() => {
                 modals.setNewProv({ nombre: provSearch, nitCedula: '', telefono: '', personaContacto: '', email: '', direccion: '', observaciones: '', activo: true });
                 modals.setShowProvModal(true);
              }}>
                + Registrar Nuevo Proveedor
              </div>
              {filteredProv.map(p => (
                <div key={p.id} className={styles.dropdownItem} onClick={() => {
                  setProveedorSeleccionado(p);
                  setProvSearch(p.nombre);
                  setShowProvDropdown(false);
                }}>
                  {p.nombre} {p.nitCedula && `(${p.nitCedula})`}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Condición de Pago</label>
            <select className={styles.select} value={condicion} onChange={e => setCondicion(e.target.value)}>
              <option value="CONTADO">Contado</option>
              <option value="CREDITO">Crédito</option>
            </select>
          </div>
          {condicion === 'CREDITO' && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Días Crédito</label>
              <input type="number" min="0" className={styles.input} value={diasCredito} onChange={e => setDiasCredito(e.target.value)} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Observaciones</label>
        <input type="text" className={styles.input} value={observaciones} onChange={e => setObservaciones(e.target.value)} />
      </div>
    </div>
  );
}
