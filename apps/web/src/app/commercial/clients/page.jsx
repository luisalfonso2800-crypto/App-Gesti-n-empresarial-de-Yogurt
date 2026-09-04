'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import styles from './clients.module.css';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    tipoCliente: 'MINORISTA',
    canal: 'DIRECTO',
    contacto: '',
    telefono: '',
    direccion: '',
    diasCredito: 0,
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
      diasCredito: 0,
      observaciones: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/clients', formData);
      handleCloseModal();
      fetchClients();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Clientes</h1>
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

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Nuevo Cliente"
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input 
            label="Nombre" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Tipo de Cliente" 
            name="tipoCliente" 
            value={formData.tipoCliente} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Canal" 
            name="canal" 
            value={formData.canal} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Contacto" 
            name="contacto" 
            value={formData.contacto} 
            onChange={handleChange} 
          />
          <Input 
            label="Teléfono" 
            name="telefono" 
            value={formData.telefono} 
            onChange={handleChange} 
          />
          <Input 
            label="Dirección" 
            name="direccion" 
            value={formData.direccion} 
            onChange={handleChange} 
          />
          <Input 
            label="Días de Crédito" 
            name="diasCredito"
            type="number" 
            value={formData.diasCredito} 
            onChange={handleChange} 
            required
          />
          <Input 
            label="Observaciones" 
            name="observaciones" 
            value={formData.observaciones} 
            onChange={handleChange} 
          />
          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
