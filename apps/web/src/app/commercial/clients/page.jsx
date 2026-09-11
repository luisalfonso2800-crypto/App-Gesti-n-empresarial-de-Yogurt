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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isDirty = !!formData.nombre || !!formData.contacto;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await apiClient.post('/clients', {
        ...formData,
        diasCredito: Number(formData.diasCredito) || 0
      });
      handleCloseModal();
      fetchClients();
    } catch (err) {
      setSubmitError(err.message || 'Error al guardar el cliente');
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
          <div className={modalStyles.errorBanner}>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Razón Social / Nombre <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="nombre" 
              value={formData.nombre} 
              onChange={handleChange} 
              placeholder="Ej: Minimercado La Esquina"
              className={modalStyles.input} 
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
              />
            </div>
            
            <StrictNumberInput
              label="Teléfono / Celular"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Solo números"
            />
          </div>

          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Dirección</label>
            <input 
              name="direccion" 
              value={formData.direccion} 
              onChange={handleChange} 
              className={modalStyles.input} 
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
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          {formData.nombre && formData.tipoCliente && formData.canal && (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
              <strong>Resumen:</strong> Se registrará el cliente <strong>{formData.nombre}</strong> clasificado como <strong>{formData.tipoCliente.toLowerCase()}</strong> para el canal <strong>{formData.canal.toLowerCase()}</strong>. {formData.diasCredito > 0 ? `Se le otorgarán ${formData.diasCredito} días de crédito.` : 'Las ventas serán de contado (0 días de crédito).'}
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
              disabled={!formData.nombre}
            />
          </div>
        </form>
      </SmartModal>
    </div>
  );
}
