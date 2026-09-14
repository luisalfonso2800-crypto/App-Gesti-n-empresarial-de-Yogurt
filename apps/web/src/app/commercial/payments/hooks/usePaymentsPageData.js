/**
 * @file usePaymentsPageData.js
 * @module commercial/payments/hooks
 * @description Hook orquestador de datos y lógica del formulario de cobros y pagos.
 * @responsibility Cargar pagos, clientes y ventas pendientes del backend y procesar nuevos cobros.
 * @usedBy apps/web/src/app/commercial/payments/page.jsx
 * @dependencies react, @/lib/api-client, @/lib/formatters
 */
import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';
import { cleanCurrency } from '@/lib/formatters';

const INITIAL_FORM = {
  fechaPago: new Date().toISOString().substring(0, 10),
  idCliente: '',
  idVenta: '',
  valorPagado: '',
  metodoPago: 'EFECTIVO',
  referencia: '',
  observaciones: ''
};

export function usePaymentsPageData() {
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

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
    let parsedValue = value;
    if (['referencia', 'observaciones'].includes(name)) {
      parsedValue = value.toUpperCase();
    }
    setFormData((prev) => {
      const updated = { ...prev, [name]: parsedValue };
      if (name === 'idCliente') {
        updated.idVenta = '';
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
  const showExceedError = paymentValue > maxPaymentAllowed;

  const selectedClient = clients.find(c => c.id === formData.idCliente);
  const clientName = selectedClient ? selectedClient.nombre : '';
  const projectedBalance = selectedSale ? Math.max(0, Number(selectedSale.saldoPendiente) - paymentValue) : 0;

  const missingFields = [];
  if (!formData.fechaPago) missingFields.push('Fecha de pago');
  if (!formData.idCliente) missingFields.push('Cliente');
  if (formData.idCliente && pendingSales.length === 0) missingFields.push('Cliente al día (sin saldo pendiente)');
  if (!formData.idVenta) missingFields.push('Venta pendiente a abonar');
  if (!formData.valorPagado || paymentValue <= 0) missingFields.push('Valor del pago');
  if (showExceedError) missingFields.push('El valor excede el saldo');
  if (!formData.metodoPago) missingFields.push('Método de pago');

  const isSubmitDisabled = missingFields.length > 0 || isSubmitting;
  const submitTitle = missingFields.length > 0 ? `Complete los campos obligatorios: ${missingFields.join(', ')}` : '';
  const isDirty = !!formData.idCliente || !!formData.valorPagado || !!formData.idVenta;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const payload = {
        ...formData,
        referencia: (formData.referencia || '').trim().toUpperCase() || null,
        observaciones: (formData.observaciones || '').trim().toUpperCase() || null,
        valorPagado: paymentValue,
        fechaPago: new Date(formData.fechaPago).toISOString()
      };
      
      await apiClient.post('/payments', payload);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Error al guardar el pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    payments,
    clients,
    loading,
    error,
    submitError,
    isModalOpen,
    isSubmitting,
    formData,
    pendingSales,
    paymentValue,
    showExceedError,
    clientName,
    projectedBalance,
    isSubmitDisabled,
    submitTitle,
    isDirty,
    handleOpenModal,
    handleCloseModal,
    handleChange,
    handleSubmit
  };
}
