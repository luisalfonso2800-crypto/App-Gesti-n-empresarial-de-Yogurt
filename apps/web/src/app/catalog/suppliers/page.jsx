'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import styles from './suppliers.module.css';
import { ContextBanner } from '../../../components/ui/ContextBanner';


export default function Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
        nombre: '',
        nitCedula: '',
        nombreContacto: '',
        telefono: '',
        email: '',
        direccion: '',
        observaciones: '',
        activo: true
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/suppliers');
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        nombre: '',
        nitCedula: '',
        nombreContacto: '',
        telefono: '',
        email: '',
        direccion: '',
        observaciones: '',
        activo: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await apiClient.patch(`/suppliers/${editingItem.id}`, formData);
      } else {
        await apiClient.post('/suppliers', formData);
      }
      handleCloseModal();
      fetchItems();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await apiClient.patch(`/suppliers/${item.id}`, { activo: !item.activo });
      fetchItems();
    } catch (err) {
      alert(err.message || 'Error al cambiar estado');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Proveedores</h1>
          <p className={styles.subtitle}>Directorio de fabricantes y distribuidores autorizados de insumos, empaques y servicios.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>Nuevo Registro</Button>
      </div>
      <ContextBanner title="Concepto Técnico" description="Directorio de todas las personas y empresas que nos venden los insumos necesarios para operar. Funciona como un directorio centralizado de compras." />


      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : items.length === 0 ? (
        <EmptyState title="No hay registros" description="Crea el primer registro para comenzar" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Nombre</TH>
              <TH>NIT/Cédula</TH>
              <TH>Contacto</TH>
              <TH>Teléfono</TH>
              <TH>Estado</TH>
              <TH>Acciones</TH>
            </TR>
          </THead>
          <TBody>
            {items.map((item) => (
              <TR key={item.id}>

                <TD>{item.nombre}</TD>
                <TD>{item.nitCedula}</TD>
                <TD>{item.nombreContacto}</TD>
                <TD>{item.telefono}</TD>

                <TD>
                  <Badge status={item.activo ? 'active' : 'inactive'}>
                    {item.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TD>
                <TD>
                  <div className={styles.actions}>
                    <Button variant="secondary" onClick={() => handleOpenModal(item)}>Editar</Button>
                    <Button 
                      variant={item.activo ? 'danger' : 'primary'} 
                      onClick={() => handleToggleActive(item)}
                    >
                      {item.activo ? 'Desactivar' : 'Activar'}
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingItem ? 'Editar' : 'Nuevo'}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          
          <Input 
            label="Nombre" 
            name="nombre" 
            
            value={formData.nombre || ''} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="NIT/Cédula" 
            name="nitCedula" 
            
            value={formData.nitCedula || ''} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Nombre Contacto" 
            name="nombreContacto" 
            
            value={formData.nombreContacto || ''} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Teléfono" 
            name="telefono" 
            
            value={formData.telefono || ''} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Email" 
            name="email" 
            
            value={formData.email || ''} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Dirección" 
            name="direccion" 
            
            value={formData.direccion || ''} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Observaciones" 
            name="observaciones" 
            
            value={formData.observaciones || ''} 
            onChange={handleChange} 
            required 
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input 
              type="checkbox" 
              name="activo" 
              checked={formData.activo} 
              onChange={handleChange} 
            />
            Activo
          </label>
          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
