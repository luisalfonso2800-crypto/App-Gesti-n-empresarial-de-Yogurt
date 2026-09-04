'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import styles from './products.module.css';

export default function Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
        nombre: '',
        idPresentacion: '',
        categoria: '',
        descripcion: '',
        canalVenta: '',
        precioVenta: 0,
        margenObjetivo: 0,
        observaciones: '',
        activo: true
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/products');
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
        idPresentacion: '',
        categoria: '',
        descripcion: '',
        canalVenta: '',
        precioVenta: 0,
        margenObjetivo: 0,
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
        await apiClient.patch(`/products/${editingItem.id}`, formData);
      } else {
        await apiClient.post('/products', formData);
      }
      handleCloseModal();
      fetchItems();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await apiClient.patch(`/products/${item.id}`, { activo: !item.activo });
      fetchItems();
    } catch (err) {
      alert(err.message || 'Error al cambiar estado');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Productos</h1>
        <Button onClick={() => handleOpenModal()}>Nuevo Registro</Button>
      </div>

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
              <TH>Categoría</TH>
              <TH>Precio Venta</TH>
              <TH>Estado</TH>
              <TH>Acciones</TH>
            </TR>
          </THead>
          <TBody>
            {items.map((item) => (
              <TR key={item.id}>

                <TD>{item.nombre}</TD>
                <TD>{item.categoria}</TD>
                <TD>{item.precioVenta}</TD>

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
            label="ID Presentación" 
            name="idPresentacion" 
            
            value={formData.idPresentacion || ''} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Categoría" 
            name="categoria" 
            
            value={formData.categoria || ''} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Descripción" 
            name="descripcion" 
            
            value={formData.descripcion || ''} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Canal de Venta" 
            name="canalVenta" 
            
            value={formData.canalVenta || ''} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Precio Venta" 
            name="precioVenta" 
            type="number" step="0.01"
            value={formData.precioVenta || 0} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Margen Objetivo" 
            name="margenObjetivo" 
            type="number" step="0.01"
            value={formData.margenObjetivo || 0} 
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
