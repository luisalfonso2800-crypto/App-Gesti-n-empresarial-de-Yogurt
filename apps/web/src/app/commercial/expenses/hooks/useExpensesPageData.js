/**
 * @file useExpensesPageData.js
 * @module commercial/expenses/hooks
 * @description Hook de estado, carga de datos y persistencia para la vista de Gastos Operativos.
 * @responsibility Administrar ciclo de vida del formulario de gastos, sanitización y mutación en API.
 * @usedBy apps/web/src/app/commercial/expenses/page.jsx
 * @dependencies react, @/lib/api-client, @/lib/formatters
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { cleanCurrency } from '@/lib/formatters';

const INITIAL_FORM = {
  fecha: new Date().toISOString().substring(0, 10),
  categoria: '',
  descripcion: '',
  valor: '',
  tipoGasto: 'OPERATIVO',
  periodo: '',
  observaciones: ''
};

export function useExpensesPageData() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

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
    setFormData(INITIAL_FORM);
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    if (['descripcion', 'periodo', 'observaciones'].includes(name)) {
      parsedValue = value.toUpperCase();
    }
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const isDirty = !!formData.categoria || !!formData.descripcion || !!formData.valor;

  const missingFields = [];
  if (!formData.fecha) missingFields.push('Fecha');
  if (!formData.periodo?.trim()) missingFields.push('Periodo');
  if (!formData.categoria) missingFields.push('Categoría');
  if (!formData.tipoGasto) missingFields.push('Tipo de gasto');
  if (!formData.descripcion?.trim()) missingFields.push('Descripción');
  if (!formData.valor || Number(String(formData.valor).replace(/\D/g, '')) <= 0) missingFields.push('Valor');

  const isSubmitDisabled = missingFields.length > 0 || isSubmitting;
  const submitTitle = missingFields.length > 0 ? `Complete los campos obligatorios: ${missingFields.join(', ')}` : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

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
        periodo: (formData.periodo || '').trim().toUpperCase(),
        descripcion: (formData.descripcion || '').trim().toUpperCase(),
        observaciones: (formData.observaciones || '').trim().toUpperCase() || null,
        valor: cleanValue,
        fecha: new Date(formData.fecha).toISOString()
      });
      handleCloseModal();
      fetchExpenses();
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Error al guardar el gasto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    expenses,
    loading,
    error,
    submitError,
    isModalOpen,
    isSubmitting,
    formData,
    isDirty,
    isSubmitDisabled,
    submitTitle,
    handleOpenModal,
    handleCloseModal,
    handleChange,
    handleSubmit
  };
}
