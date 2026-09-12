'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import SmartModal, { SubmitButton } from '../../../components/ui/SmartModal';
import SmartSelect from '../../../components/ui/inputs/SmartSelect';
import CurrencySmartInput from '../../../components/ui/inputs/CurrencySmartInput';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import { formatCurrency, cleanCurrency } from '../../../lib/formatters';
import styles from './expenses.module.css';
import modalStyles from '../../../components/ui/SmartModal.module.css';
import { montoATextoPesos } from '../../../utils/numberToWords';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().substring(0, 10),
    categoria: '',
    descripcion: '',
    valor: '',
    tipoGasto: 'OPERATIVO',
    periodo: '',
    observaciones: ''
  });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/expenses');
      setExpenses(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar gastos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      fecha: new Date().toISOString().substring(0, 10),
      categoria: '',
      descripcion: '',
      valor: '',
      tipoGasto: 'OPERATIVO',
      periodo: '',
      observaciones: ''
    });
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isDirty = !!formData.categoria || !!formData.descripcion || !!formData.valor;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanValue = cleanCurrency(formData.valor);
    if (!cleanValue || cleanValue <= 0) {
      setSubmitError('El valor del gasto debe ser mayor a cero');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await apiClient.post('/expenses', {
        ...formData,
        valor: cleanValue,
        fecha: new Date(formData.fecha).toISOString()
      });
      handleCloseModal();
      fetchExpenses();
    } catch (err) {
      setSubmitError(err.message || 'Error al guardar el gasto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Gastos</h1>
          <p className={styles.subtitle}>Registro de erogaciones operativas, servicios públicos, nómina y costos indirectos de fabricación.</p>
        </div>
        <Button onClick={handleOpenModal}>Nuevo Gasto</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : expenses.length === 0 ? (
        <EmptyState title="No hay gastos" description="Registra el primer gasto" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Fecha</TH>
              <TH>Categoría</TH>
              <TH>Descripción</TH>
              <TH>Valor</TH>
              <TH>Tipo</TH>
            </TR>
          </THead>
          <TBody>
            {expenses.map((item) => (
              <TR key={item.id}>
                <TD>{new Date(item.fecha).toLocaleDateString()}</TD>
                <TD>{item.categoria.replace('_', ' ')}</TD>
                <TD>{item.descripcion}</TD>
                <TD>{formatCurrency(item.valor)}</TD>
                <TD>{item.tipoGasto}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <SmartModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Nuevo Gasto"
        isDirty={isDirty}
        isSubmitting={isSubmitting}
      >
        {submitError && (
          <div className={modalStyles.errorBanner}>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className={modalStyles.twoColumns}>
            <div className={modalStyles.inputGroup}>
              <label className={modalStyles.label}>Fecha <span style={{color: '#e11d48'}}>*</span></label>
              <input 
                name="fecha" 
                type="date"
                value={formData.fecha} 
                onChange={handleChange} 
                className={modalStyles.input} 
                required 
              />
            </div>
            
            <div className={modalStyles.inputGroup}>
              <label className={modalStyles.label}>Periodo <span style={{color: '#e11d48'}}>*</span></label>
              <input 
                name="periodo" 
                value={formData.periodo} 
                onChange={handleChange} 
                placeholder="Ej: Enero 2026"
                className={modalStyles.input} 
                required 
              />
            </div>
          </div>

          <div className={modalStyles.twoColumns}>
            <SmartSelect
              label="Categoría"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              options={[
                { id: 'SERVICIOS_PUBLICOS', label: 'Servicios Públicos' },
                { id: 'NOMINA', label: 'Nómina' },
                { id: 'MANTENIMIENTO', label: 'Mantenimiento' },
                { id: 'ALQUILER', label: 'Alquiler' },
                { id: 'TRANSPORTE', label: 'Transporte / Fletes' },
                { id: 'OTROS', label: 'Otros Gastos' },
              ]}
              required
              placeholder="Seleccione categoría"
            />
            
            <SmartSelect
              label="Tipo de Gasto"
              name="tipoGasto"
              value={formData.tipoGasto}
              onChange={handleChange}
              options={[
                { id: 'OPERATIVO', label: 'Operativo' },
                { id: 'ADMINISTRATIVO', label: 'Administrativo' },
                { id: 'VENTAS', label: 'Ventas y Marketing' },
                { id: 'FINANCIERO', label: 'Financiero' },
              ]}
              required
            />
          </div>

          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Descripción <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleChange} 
              placeholder="Descripción del gasto"
              className={modalStyles.input} 
              required 
            />
          </div>

          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Valor ($) <span style={{color: '#e11d48'}}>*</span></label>
            <input
              name="valor"
              type="text"
              inputMode="numeric"
              min="0"
              placeholder="0"
              value={formData.valor ? String(formData.valor).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                handleChange({ target: { name: 'valor', value: raw } });
              }}
              onKeyDown={(e) => {
                if (e.key === '-') e.preventDefault();
              }}
              className={modalStyles.input}
              required
            />
            {formData.valor && parseInt(String(formData.valor).replace(/\D/g, ''), 10) > 0 && (
              <span style={{ fontSize: '0.75rem', color: '#065F46', marginTop: '0.25rem', display: 'block', fontWeight: '600' }}>
                ✦ {montoATextoPesos(parseInt(String(formData.valor).replace(/\D/g, ''), 10))}
              </span>
            )}
          </div>

          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Observaciones</label>
            <textarea 
              name="observaciones" 
              value={formData.observaciones} 
              onChange={handleChange} 
              className={modalStyles.input} 
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          {formData.categoria && formData.descripcion && formData.valor && formData.tipoGasto && (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
              <strong>Resumen:</strong> Se registrará un gasto de <strong>{formData.categoria.replace('_', ' ')}</strong> por un valor de <strong>{formatCurrency(formData.valor)}</strong>, clasificado como gasto <strong>{formData.tipoGasto.toLowerCase()}</strong> para el periodo de {formData.periodo || 'no especificado'}.
            </div>
          )}

          <div className={modalStyles.actions}>
            <button 
              type="button" 
              onClick={handleCloseModal}
              className={modalStyles.btnCancel}
            >
              Cancelar
            </button>
            <SubmitButton 
              isSubmitting={isSubmitting} 
              text="Guardar Gasto"
              disabled={!formData.categoria || !formData.valor || !formData.descripcion || isSubmitting}
            />
          </div>
        </form>
      </SmartModal>
    </div>
  );
}
