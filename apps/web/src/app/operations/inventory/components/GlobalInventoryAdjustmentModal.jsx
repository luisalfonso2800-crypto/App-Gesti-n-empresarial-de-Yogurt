/**
 * @file GlobalInventoryAdjustmentModal.jsx
 * @module operations/inventory/components
 * @description Modal para carga de saldo inicial y ajustes globales de inventario en frío.
 * @responsibility Permitir seleccionar cualquier insumo registrado, capturar existencias y costo unitario con Poka-Yoke.
 * @usedBy apps/web/src/app/operations/inventory/page.jsx
 * @dependencies react, @/components/ui/SmartModal, @/components/ui/inputs/SmartSelect, @/components/ui/inputs/CurrencySmartInput, @/lib/formatters, @/utils/numberToWords
 */

import React, { useState, useEffect } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import CurrencySmartInput from '@/components/ui/inputs/CurrencySmartInput';
import { formatCurrency, cleanCurrency } from '@/lib/formatters';
import { montoATextoPesos } from '@/utils/numberToWords';
import { apiClient } from '@/lib/api-client';
import styles from '@/components/ui/SmartModal.module.css';

export function GlobalInventoryAdjustmentModal({ isOpen, onClose, onSuccess }) {
  const [supplies, setSupplies] = useState([]);
  const [loadingSupplies, setLoadingSupplies] = useState(false);
  
  const [idInsumo, setIdInsumo] = useState('');
  const [tipo, setTipo] = useState('CARGA_INICIAL');
  const [cantidad, setCantidad] = useState('');
  const [costoUnitario, setCostoUnitario] = useState('');
  const [motivo, setMotivo] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar insumos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      setLoadingSupplies(true);
      setErrorMessage('');
      apiClient.get('/supplies')
        .then((data) => {
          setSupplies(data || []);
        })
        .catch((err) => {
          console.error('Error al cargar insumos para ajuste global:', err);
          setErrorMessage('No fue posible cargar el catálogo de insumos.');
        })
        .finally(() => {
          setLoadingSupplies(false);
        });
    } else {
      setIdInsumo('');
      setTipo('CARGA_INICIAL');
      setCantidad('');
      setCostoUnitario('');
      setMotivo('');
      setErrorMessage('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const selectedInsumo = supplies.find(s => String(s.id) === String(idInsumo));
  const unidadBase = selectedInsumo?.unidadBase || 'Unidades';

  // Si cambia el insumo y tiene costoBase preconfigurado, precargarlo opcionalmente
  useEffect(() => {
    if (selectedInsumo && selectedInsumo.costoBase && !costoUnitario && (tipo === 'CARGA_INICIAL' || tipo === 'AJUSTE_POSITIVO')) {
      setCostoUnitario(String(Math.round(Number(selectedInsumo.costoBase))));
    }
  }, [selectedInsumo, tipo]);

  const isCostRequired = tipo === 'CARGA_INICIAL' || tipo === 'AJUSTE_POSITIVO';
  const numericQty = Number(cantidad) || 0;
  const numericCost = cleanCurrency(costoUnitario);

  // Validación de campos obligatorios requeridos
  const missingFields = [];
  if (!idInsumo) missingFields.push('Insumo');
  if (numericQty <= 0) missingFields.push('Cantidad mayor a 0');
  if (isCostRequired && numericCost <= 0) missingFields.push('Costo unitario mayor a $ 0');
  if (['AJUSTE_NEGATIVO', 'MERMA_DESPERDICIO'].includes(tipo) && !motivo.trim()) {
    missingFields.push('Motivo obligatorio');
  }

  const isSubmitDisabled = missingFields.length > 0 || isSubmitting;
  const submitTitle = missingFields.length > 0
    ? `Complete los campos requeridos: ${missingFields.join(', ')}`
    : isSubmitting
    ? 'Guardando ajuste de inventario...'
    : 'Registrar ajuste en inventario';

  const isDirty = Boolean(idInsumo || cantidad || costoUnitario || motivo);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    setIsSubmitting(true);
    setErrorMessage('');

    let cantidadAjuste = Math.abs(numericQty);
    if (['AJUSTE_NEGATIVO', 'MERMA_DESPERDICIO'].includes(tipo)) {
      cantidadAjuste = -cantidadAjuste;
    }

    const payload = {
      idInsumo,
      cantidadAjuste,
      tipo,
      motivo: motivo.trim().toUpperCase() || (tipo === 'CARGA_INICIAL' ? 'SALDO INICIAL' : 'AJUSTE GLOBAL'),
      costoUnitario: isCostRequired ? numericCost : undefined
    };

    try {
      await apiClient.post('/inventory/adjustments', payload);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      const safeMsg = err.response?.data?.message || err.message || 'Error al procesar el ajuste';
      setErrorMessage(typeof safeMsg === 'object' ? JSON.stringify(safeMsg) : String(safeMsg));
    } finally {
      setIsSubmitting(false);
    }
  };

  const tipoLabelMap = {
    CARGA_INICIAL: 'Saldo Inicial (+)',
    AJUSTE_POSITIVO: 'Ajuste Positivo (+)',
    AJUSTE_NEGATIVO: 'Ajuste Negativo (-)',
    MERMA_DESPERDICIO: 'Merma / Desperdicio (-)'
  };

  return (
    <SmartModal
      isOpen={isOpen}
      onClose={onClose}
      title="Saldo Inicial / Ajuste Global de Inventario"
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {/* Banner de error dinámico */}
      {errorMessage && (
        <div style={{
          marginBottom: '1rem',
          backgroundColor: '#FEF2F2',
          border: '1px solid #F87171',
          color: '#B91C1C',
          padding: '0.6rem 0.85rem',
          borderRadius: '6px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        {/* Selector de Insumo */}
        <SmartSelect
          label="Insumo a Ajustar"
          name="idInsumo"
          value={idInsumo}
          onChange={(e) => setIdInsumo(e.target.value)}
          options={supplies.map(s => ({
            id: s.id,
            label: s.nombre,
            subtext: `${s.unidadBase}${s.categoria ? ` - ${s.categoria}` : ''}`
          }))}
          required
          placeholder={loadingSupplies ? 'Cargando insumos...' : 'Seleccione un insumo del catálogo'}
        />

        {/* Tipo de Ajuste */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Tipo de Ajuste <span style={{ color: '#e11d48' }}>*</span>
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className={styles.select}
            required
          >
            <option value="CARGA_INICIAL">Carga de Saldo Inicial (+)</option>
            <option value="AJUSTE_POSITIVO">Ajuste Positivo (+)</option>
            <option value="AJUSTE_NEGATIVO">Ajuste Negativo (-)</option>
            <option value="MERMA_DESPERDICIO">Merma / Desperdicio (-)</option>
          </select>
        </div>

        {/* Cantidad con indicación dinámica de unidadBase */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Cantidad {selectedInsumo ? `(${unidadBase})` : ''} <span style={{ color: '#e11d48' }}>*</span>
          </label>
          <input
            type="number"
            min="0.001"
            step="any"
            value={cantidad}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || !val.includes('-')) {
                setCantidad(val);
              }
            }}
            placeholder="0"
            className={styles.input}
            required
          />
          {selectedInsumo && (
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              Unidad técnica de medida del insumo: <strong>{unidadBase}</strong>
            </span>
          )}
        </div>

        {/* Costo Unitario en Moneda para CARGA_INICIAL y AJUSTE_POSITIVO */}
        {isCostRequired && (
          <CurrencySmartInput
            label={`Costo Unitario por ${unidadBase}`}
            value={costoUnitario}
            onChange={(e) => setCostoUnitario(e.target.value)}
            placeholder="Ej: 25.000"
            required={isCostRequired}
            name="costoUnitario"
          />
        )}

        {/* Motivo / Observaciones en UPPERCASE */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Motivo / Documento Origen {['AJUSTE_NEGATIVO', 'MERMA_DESPERDICIO'].includes(tipo) && <span style={{ color: '#e11d48' }}>*</span>}
          </label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo((e.target.value ?? '').toUpperCase())}
            placeholder={tipo === 'CARGA_INICIAL' ? 'EJ: INVENTARIO FÍSICO INICIAL' : 'EJ: CONTEO FÍSICO, ENVASE DAÑADO'}
            className={styles.input}
            style={{ textTransform: 'uppercase' }}
            required={['AJUSTE_NEGATIVO', 'MERMA_DESPERDICIO'].includes(tipo)}
          />
        </div>

        {/* Cápsula Resumen Poka-Yoke */}
        {selectedInsumo && numericQty > 0 && (
          <div style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            color: '#166534',
            padding: '0.65rem 0.85rem',
            borderRadius: '6px',
            fontSize: '0.76rem',
            lineHeight: 1.45
          }}>
            <strong>Resumen:</strong> Se registrarán <strong>{numericQty} {unidadBase}</strong> de <strong>{selectedInsumo.nombre}</strong>
            {isCostRequired && numericCost > 0 ? (
              <> con costo unitario de <strong>{formatCurrency(numericCost)}</strong> ({montoATextoPesos(numericCost)})</>
            ) : null} bajo el concepto de <strong>{tipoLabelMap[tipo] || tipo}</strong>.
          </div>
        )}

        {/* Botonera de acciones */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            className={styles.btnCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <SubmitButton
            isSubmitting={isSubmitting}
            text="Guardar Ajuste"
            disabled={isSubmitDisabled}
            title={submitTitle}
            style={isSubmitDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          />
        </div>
      </form>
    </SmartModal>
  );
}
