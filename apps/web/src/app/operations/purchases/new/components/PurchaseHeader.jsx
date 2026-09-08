/**
 * @file purchases/new/components/PurchaseHeader.jsx
 * @module components/PurchaseHeader
 * @description Selector de proveedor, condiciones de pago, fecha y consecutivo de orden.
 * @responsibility Proveer la UI para la cabecera de la compra.
 * @usedBy apps/web/src/app/operations/purchases/new/page.jsx
 * @dependencies React
 */
import React from 'react';
import styles from '../new-purchase.module.css';

export function PurchaseHeader({ proveedorSeleccionado, condicion, setCondicion, diasCredito, setDiasCredito, generatedId }) {
  return (
    <div className={styles.purchaseHeader}>
      <h2>Cabecera de Compra</h2>
      <p>Proveedor: {proveedorSeleccionado?.nombre || 'Ninguno'}</p>
      <p>ID Generado: {generatedId}</p>
      <div>
        <label>Condición:</label>
        <select value={condicion} onChange={e => setCondicion(e.target.value)}>
          <option value="CONTADO">Contado</option>
          <option value="CREDITO">Crédito</option>
        </select>
        {condicion === 'CREDITO' && (
          <input type="number" value={diasCredito} onChange={e => setDiasCredito(e.target.value)} placeholder="Días" />
        )}
      </div>
    </div>
  );
}
