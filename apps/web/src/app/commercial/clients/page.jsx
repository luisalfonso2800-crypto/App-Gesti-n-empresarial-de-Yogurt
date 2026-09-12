'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import SmartModal, { SubmitButton } from '../../../components/ui/SmartModal';
import SmartSelect from '../../../components/ui/inputs/SmartSelect';
import StrictNumberInput from '../../../components/ui/inputs/StrictNumberInput';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import styles from './clients.module.css';
import modalStyles from '../../../components/ui/SmartModal.module.css';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    tipoCliente: 'MINORISTA',
    canal: 'DIRECTO',
    contacto: '',
    telefono: '',
    direccion: '',
    diasCredito: '',
    observaciones: ''
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/clients');
      setClients(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      nombre: '',
      tipoCliente: 'MINORISTA',
      canal: 'DIRECTO',
      contacto: '',
      telefono: '',
      direccion: '',
      diasCredito: '',
      observaciones: ''
    });
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const formatPhone = (value) => {
    if (!value) return '';
    const digits = value.toString().replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    if (['nombre', 'contacto', 'direccion', 'observaciones'].includes(name)) {
      parsedValue = value.toUpperCase();
    }
    if (name === 'telefono') {
      parsedValue = formatPhone(value);
    }
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const isDirty = !!formData.nombre || !!formData.contacto;

  const missingFields = [];
  if (!formData.nombre?.trim()) missingFields.push('Nombre / Razón Social');
  if (!formData.tipoCliente) missingFields.push('Tipo de cliente');
  if (!formData.canal) missingFields.push('Canal');
  if (formData.diasCredito === '' || formData.diasCredito === null || formData.diasCredito === undefined) missingFields.push('Días de crédito');
  if (formData.telefono && formData.telefono.replace(/\D/g, '').length < 10) missingFields.push('Teléfono debe tener 10 dígitos');

  const isSubmitDisabled = missingFields.length > 0 || isSubmitting;
  const submitTitle = missingFields.length > 0
    ? `Complete los campos obligatorios: ${missingFields.join(', ')}`
    : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await apiClient.post('/clients', {
        ...formData,
        nombre: (formData.nombre || '').trim().toUpperCase(),
        contacto: (formData.contacto || '').trim().toUpperCase() || null,
        direccion: (formData.direccion || '').trim().toUpperCase() || null,
        observaciones: (formData.observaciones || '').trim().toUpperCase() || null,
        telefono: formData.telefono ? formData.telefono.replace(/\D/g, '').trim() : null,
        diasCredito: Number(formData.diasCredito) || 0
      });
      handleCloseModal();
      fetchClients();
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Error al guardar el cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Clientes</h1>
          <p className={styles.subtitle}>Directorio de compradores comerciales (supermercados, tiendas, cafeterías) y personas naturales.</p>
        </div>
        <Button onClick={handleOpenModal}>Nuevo Cliente</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : clients.length === 0 ? (
        <EmptyState title="No hay clientes" description="Registra el primer cliente" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Nombre</TH>
              <TH>Tipo</TH>
              <TH>Canal</TH>
              <TH>Teléfono</TH>
              <TH>Estado</TH>
            </TR>
          </THead>
          <TBody>
            {clients.map((item) => (
              <TR key={item.id}>
                <TD>{item.nombre}</TD>
                <TD>{item.tipoCliente}</TD>
                <TD>{item.canal}</TD>
                <TD>{item.telefono}</TD>
                <TD>
                  <Badge status={item.activo ? 'active' : 'inactive'}>
                    {item.activo ? 'ACTIVO' : 'INACTIVO'}
                  </Badge>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <SmartModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Nuevo Cliente"
        isDirty={isDirty}
        isSubmitting={isSubmitting}
      >
        {submitError && (
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
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Razón Social / Nombre <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="nombre" 
              value={formData.nombre} 
              onChange={handleChange} 
              placeholder="Ej: MINIMERCADO LA ESQUINA"
              className={modalStyles.input} 
              style={{ textTransform: 'uppercase' }}
              required 
            />
          </div>

          <div className={modalStyles.twoColumns}>
            <SmartSelect
              label="Tipo de Cliente"
              name="tipoCliente"
              value={formData.tipoCliente}
              onChange={handleChange}
              options={[
                { id: 'MAYORISTA', label: 'Mayorista' },
                { id: 'MINORISTA', label: 'Minorista' },
                { id: 'CONSUMIDOR_FINAL', label: 'Consumidor Final' }
              ]}
              required
            />
            
            <SmartSelect
              label="Canal"
              name="canal"
              value={formData.canal}
              onChange={handleChange}
              options={[
                { id: 'DIRECTO', label: 'Venta Directa' },
                { id: 'DISTRIBUIDOR', label: 'Distribuidor' },
                { id: 'INSTITUCIONAL', label: 'Institucional' }
              ]}
              required
            />
          </div>

          <div className={modalStyles.twoColumns}>
            <div className={modalStyles.inputGroup}>
              <label className={modalStyles.label}>Persona de Contacto</label>
              <input 
                name="contacto" 
                value={formData.contacto} 
                onChange={handleChange} 
                className={modalStyles.input} 
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            
            <div className={modalStyles.inputGroup}>
              <label className={modalStyles.label}>Teléfono / Celular</label>
              <input 
                name="telefono" 
                value={formData.telefono} 
                onChange={handleChange} 
                placeholder="Ej: 300 123 4567"
                className={modalStyles.input}
                style={formData.telefono && formData.telefono.replace(/\D/g, '').length < 10 ? { border: '1px solid #EF4444' } : {}}
              />
              {formData.telefono && formData.telefono.replace(/\D/g, '').length < 10 && (
                <span style={{ color: '#DC2626', fontSize: '0.72rem', display: 'block', marginTop: '3px' }}>
                  El celular debe tener 10 dígitos
                </span>
              )}
            </div>
          </div>

          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Dirección</label>
            <input 
              name="direccion" 
              value={formData.direccion} 
              onChange={handleChange} 
              className={modalStyles.input} 
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div style={{ width: '50%' }}>
            <StrictNumberInput
              label="Días de Crédito"
              name="diasCredito"
              value={formData.diasCredito}
              onChange={handleChange}
              placeholder="Ej: 30"
              required
            />
          </div>

          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Observaciones</label>
            <textarea 
              name="observaciones" 
              value={formData.observaciones} 
              onChange={handleChange} 
              className={modalStyles.input} 
              style={{ minHeight: '80px', resize: 'vertical', textTransform: 'uppercase' }}
            />
          </div>

          {formData.nombre && formData.tipoCliente && formData.canal && (
            <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '0.76rem', color: '#166534' }}>
              <strong>Resumen:</strong> Se registrará el cliente <strong>{formData.nombre}</strong> clasificado como <strong>{formData.tipoCliente.toLowerCase()}</strong> para el canal <strong>{formData.canal.toLowerCase()}</strong>. {Number(formData.diasCredito) > 0 ? `Se le otorgarán ${formData.diasCredito} días de crédito.` : 'Las ventas serán de contado (0 días de crédito).'}
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
              text="Guardar Cliente"
              disabled={isSubmitDisabled}
              title={submitTitle}
              style={isSubmitDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            />
          </div>
        </form>
      </SmartModal>
    </div>
  );
}
