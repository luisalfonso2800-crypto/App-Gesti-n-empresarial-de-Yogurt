/**
 * @file SaleModal.jsx
 * @module commercial/sales/components
 * @description Vista del formulario de captura para nuevas ventas.
 * @responsibility Presentar al usuario los controles para definir los montos y términos de la venta.
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 * @dependencies @/components/ui/Modal, Input, Button
 */
import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import styles from '../sales.module.css';

export function SaleModal({ isOpen, onClose, formData, handleChange, handleSubmit }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Venta">
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="ID Cliente" name="idCliente" value={formData.idCliente} onChange={handleChange} required />
        <Input label="Fecha Venta" name="fechaVenta" type="date" value={formData.fechaVenta} onChange={handleChange} required />
        <Input label="Canal de Venta" name="canalVenta" value={formData.canalVenta} onChange={handleChange} required />
        <Input label="Tipo de Pago" name="tipoPago" value={formData.tipoPago} onChange={handleChange} required />
        <Input label="Total Venta" name="totalVenta" type="number" step="0.01" value={formData.totalVenta} onChange={handleChange} required />
        <Input label="Valor Pagado" name="valorPagado" type="number" step="0.01" value={formData.valorPagado} onChange={handleChange} required />
        <Input label="Saldo Pendiente" name="saldoPendiente" type="number" step="0.01" value={formData.saldoPendiente} onChange={handleChange} required />
        <Input label="Estado" name="estado" value={formData.estado} onChange={handleChange} required />
        <Input label="Observaciones" name="observaciones" value={formData.observaciones} onChange={handleChange} />
        <div className={styles.formActions}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Modal>
  );
}
