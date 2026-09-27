/**
 * @file DiscardLotModal.jsx
 * @module operations/lots/components
 * @description Modal inteligente Poka-Yoke para dar de baja lotes por vencimiento o merma (SRP < 150 líneas).
 * @responsibility Reemplazar prompt/alert nativos por un modal ergonómico MANNÁ.
 * @usedBy apps/web/src/app/operations/lots/page.jsx
 * @dependencies react, lucide-react, @/components/ui/SmartModal, ../lots.module.css
 */
'use client';

import React, { useState, useEffect } from 'react';
import SmartModal from '@/components/ui/SmartModal';
import { Button } from '@/components/ui/Button';
import { Trash2, AlertCircle } from 'lucide-react';
import styles from '../lots.module.css';

export function DiscardLotModal({
  isOpen,
  onClose,
  lot,
  onConfirm,
  submitting = false
}) {
  const [qty, setQty] = useState('');
  const [motivo, setMotivo] = useState('Vencimiento en Cava');
  const [errorInput, setErrorInput] = useState('');

  const maxQty = Number(lot?.cantidadDisponible) || 0;
  const unit = lot?.unidad || 'UND';
  const codLote = lot?.codigoLote || (lot?.id ? lot.id.split('-')[0].toUpperCase() : '');

  useEffect(() => {
    if (isOpen && lot) {
      setQty(String(maxQty));
      setMotivo('Vencimiento en Cava');
      setErrorInput('');
    }
  }, [isOpen, lot, maxQty]);

  if (!isOpen || !lot) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(qty);
    if (isNaN(num) || num <= 0) {
      setErrorInput('La cantidad debe ser mayor a 0');
      return;
    }
    if (num > maxQty) {
      setErrorInput(`La cantidad máxima permitida para dar de baja es ${maxQty}`);
      return;
    }
    setErrorInput('');
    onConfirm({
      id: lot.id,
      cantidad: num,
      motivo
    });
  };

  return (
    <SmartModal
      isOpen={isOpen}
      onClose={onClose}
      title="Dar de Baja Lote por Vencimiento"
      subtitle={`Lote: ${codLote} | Saldo Disponible: ${maxQty} ${unit}`}
      icon={Trash2}
      isDirty={qty !== String(maxQty) || motivo !== 'Vencimiento en Cava'}
      isSubmitting={submitting}
    >
      <form onSubmit={handleSubmit} className={styles.discardForm}>
        <div className={styles.discardAlertBanner}>
          <AlertCircle size={18} className={styles.discardAlertIcon} />
          <span>
            Esta acción descontará el saldo del lote de la cava y registrará la merma correspondiente.
          </span>
        </div>

        {errorInput && (
          <div className={styles.discardErrorBadge}>
            {errorInput}
          </div>
        )}

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Cantidad a dar de baja (Máx: {maxQty} {unit}) *</label>
          <input
            type="number"
            step="any"
            className={styles.fieldInput}
            value={qty}
            onChange={(e) => {
              setQty(e.target.value);
              setErrorInput('');
            }}
            max={maxQty}
            min={0.01}
            required
            autoFocus
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Motivo de la baja *</label>
          <select
            className={styles.fieldSelect}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
          >
            <option value="Vencimiento en Cava">Vencimiento en Cava (FEFO)</option>
            <option value="Merma por Rotura o Deterioro">Merma por Rotura o Deterioro de Envase</option>
            <option value="No Conformidad de Calidad">No Conformidad de Calidad Sensorial</option>
            <option value="Contaminación de Cepa">Contaminación de Cepa / Iniciador</option>
            <option value="Ajuste de Auditoría">Ajuste de Inventario / Auditoría</option>
          </select>
        </div>

        <div className={styles.modalActions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="danger"
            disabled={submitting}
          >
            {submitting ? 'Procesando baja...' : 'Confirmar Baja'}
          </Button>
        </div>
      </form>
    </SmartModal>
  );
}
