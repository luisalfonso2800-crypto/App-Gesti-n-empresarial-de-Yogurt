'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import SmartModal, { SubmitButton } from '../../../components/ui/SmartModal';
import SmartSelect from '../../../components/ui/inputs/SmartSelect';
import CurrencySmartInput from '../../../components/ui/inputs/CurrencySmartInput';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import { formatCurrency, cleanCurrency } from '../../../lib/formatters';
import styles from './payments.module.css';
import modalStyles from '../../../components/ui/SmartModal.module.css';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fechaPago: new Date().toISOString().substring(0, 10),
    idCliente: '',
    idVenta: '',
    valorPagado: '',
    metodoPago: 'EFECTIVO',
    referencia: '',
    observaciones: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [paymentsData, clientsData, salesData] = await Promise.all([
        apiClient.get('/payments'),
        apiClient.get('/clients'),
        apiClient.get('/sales')
      ]);
      setPayments(paymentsData);
      setClients(clientsData);
      setSales(salesData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      fechaPago: new Date().toISOString().substring(0, 10),
      idCliente: '',
      idVenta: '',
      valorPagado: '',
      metodoPago: 'EFECTIVO',
      referencia: '',
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
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'idCliente') {
        updated.idVenta = ''; // reset venta upon client change
      }
      return updated;
    });
  };

  const pendingSales = useMemo(() => {
    if (!formData.idCliente) return [];
    return sales.filter(s => s.idCliente === formData.idCliente && Number(s.saldoPendiente) > 0);
  }, [sales, formData.idCliente]);

  const selectedSale = sales.find(s => s.id === formData.idVenta);
  const maxPaymentAllowed = selectedSale ? Number(selectedSale.saldoPendiente) : 0;
  
  const paymentValue = cleanCurrency(formData.valorPagado);
  const isPaymentValid = paymentValue > 0 && paymentValue <= maxPaymentAllowed;
  const showExceedError = paymentValue > maxPaymentAllowed;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPaymentValid || !formData.idCliente || !formData.idVenta) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const payload = {
        ...formData,
        valorPagado: paymentValue,
        fechaPago: new Date(formData.fechaPago).toISOString()
      };
      
      await apiClient.post('/payments', payload);
      setIsModalOpen(false);
      fetchData(); // Recargar datos reactivamente
    } catch (err) {
      setSubmitError(err.message || 'Error al guardar el pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDirty = !!formData.idCliente || !!formData.valorPagado || !!formData.idVenta;

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Pagos y Cobros</h1>
          <p className={styles.subtitle}>Control de ingresos por cartera de clientes, recaudos efectivos y saldos pendientes por cobrar.</p>
        </div>
        <Button onClick={handleOpenModal}>Nuevo Pago</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : payments.length === 0 ? (
        <EmptyState title="No hay pagos" description="Registra el primer pago" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Fecha</TH>
              <TH>Cliente</TH>
              <TH>Venta (ID)</TH>
              <TH>Valor</TH>
              <TH>Método</TH>
            </TR>
          </THead>
          <TBody>
            {payments.map((item) => (
              <TR key={item.id}>
                <TD>{new Date(item.fechaPago).toLocaleDateString()}</TD>
                <TD>{item.cliente?.nombre || item.idCliente}</TD>
                <TD>{item.idVenta}</TD>
                <TD>{formatCurrency(item.valorPagado)}</TD>
                <TD>{item.metodoPago}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <SmartModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Nuevo Pago"
        isDirty={isDirty}
        isSubmitting={isSubmitting}
      >
        {submitError && (
          <div className={modalStyles.errorBanner}>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Fecha de Pago <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="fechaPago" 
              type="date" 
              value={formData.fechaPago ?? ''} 
              onChange={handleChange} 
              className={modalStyles.input} 
              required 
            />
          </div>

          <SmartSelect
            label="Cliente"
            name="idCliente"
            value={formData.idCliente ?? ''}
            onChange={handleChange}
            options={clients.map(c => ({ id: c.id, label: c.nombre, subtext: c.documento }))}
            required
            placeholder="Seleccione un cliente"
          />

          {formData.idCliente && pendingSales.length === 0 && (
            <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', textAlign: 'center', fontWeight: 500 }}>
              Este cliente está al día
            </div>
          )}

          {formData.idCliente && pendingSales.length > 0 && (
            <SmartSelect
              label="Venta Pendiente"
              name="idVenta"
              value={formData.idVenta ?? ''}
              onChange={handleChange}
              options={pendingSales.map(s => ({
                id: s.id,
                label: `Venta ${new Date(s.fechaVenta).toLocaleDateString()} - ${s.canalVenta}`,
                subtext: `Saldo: ${formatCurrency(s.saldoPendiente)}`
              }))}
              required
              placeholder="Seleccione venta a abonar"
            />
          )}

          <CurrencySmartInput
            label="Valor Pagado"
            name="valorPagado"
            value={formData.valorPagado ?? ''}
            onChange={handleChange}
            placeholder="Ej: 50.000"
            required
            error={showExceedError ? 'El valor excede el saldo pendiente' : null}
          />

          <SmartSelect
            label="Método de Pago"
            name="metodoPago"
            value={formData.metodoPago ?? ''}
            onChange={handleChange}
            options={[
              { id: 'EFECTIVO', label: 'Efectivo' },
              { id: 'TRANSFERENCIA', label: 'Transferencia' },
              { id: 'TARJETA', label: 'Tarjeta' }
            ]}
            required
          />

          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Referencia</label>
            <input 
              name="referencia" 
              type="text" 
              value={formData.referencia ?? ''} 
              onChange={handleChange} 
              className={modalStyles.input} 
            />
          </div>

          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Observaciones</label>
            <textarea 
              name="observaciones" 
              value={formData.observaciones ?? ''} 
              onChange={handleChange} 
              className={modalStyles.input} 
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
          </div>

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
              text="Guardar Pago"
              disabled={!isPaymentValid || (formData.idCliente && pendingSales.length === 0)}
            />
          </div>
        </form>
      </SmartModal>
    </div>
  );
}
