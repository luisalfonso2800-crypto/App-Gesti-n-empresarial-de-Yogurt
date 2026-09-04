'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import styles from './presentations.module.css';

export default function PresentationsPage() {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    cantidadOz: 0,
    cantidadMl: 0,
    tipoEnvase: '',
    activo: true,
    observaciones: ''
  });

  const fetchPresentations = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/presentations');
      setPresentations(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar presentaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresentations();
  }, []);

  const handleOpenModal = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        nombre: '',
        cantidadOz: 0,
        cantidadMl: 0,
        tipoEnvase: '',
        activo: true,
        observaciones: ''
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
        await apiClient.patch(`/presentations/${editingItem.id}`, formData);
      } else {
        await apiClient.post('/presentations', formData);
      }
      handleCloseModal();
      fetchPresentations();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await apiClient.patch(`/presentations/${item.id}`, { activo: !item.activo });
      fetchPresentations();
    } catch (err) {
      alert(err.message || 'Error al cambiar estado');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Presentaciones</h1>
          <p className={styles.subtitle}>Formatos comerciales y tamaños de empaque final en los que se distribuyen los productos terminados.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>Nueva Presentación</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : presentations.length === 0 ? (
        <EmptyState title="No hay presentaciones" description="Crea la primera presentación para comenzar" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Nombre</TH>
              <TH>Volumen (Oz/Ml)</TH>
              <TH>Envase</TH>
              <TH>Estado</TH>
              <TH>Acciones</TH>
            </TR>
          </THead>
          <TBody>
            {presentations.map((item) => (
              <TR key={item.id}>
                <TD>{item.nombre}</TD>
                <TD>{item.cantidadOz} oz / {item.cantidadMl} ml</TD>
                <TD>{item.tipoEnvase}</TD>
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
        title={editingItem ? 'Editar Presentación' : 'Nueva Presentación'}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input 
            label="Nombre" 
            name="nombre" 
            value={formData.nombre || ''} 
            onChange={handleChange} 
            required 
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input 
              label="Cantidad (Oz)" 
              name="cantidadOz" 
              type="number" 
              step="0.01"
              value={formData.cantidadOz || 0} 
              onChange={handleChange} 
              required 
            />
            <Input 
              label="Cantidad (Ml)" 
              name="cantidadMl" 
              type="number" 
              step="0.01"
              value={formData.cantidadMl || 0} 
              onChange={handleChange} 
              required 
            />
          </div>
          <Input 
            label="Tipo de Envase" 
            name="tipoEnvase" 
            value={formData.tipoEnvase || ''} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Observaciones" 
            name="observaciones" 
            value={formData.observaciones || ''} 
            onChange={handleChange} 
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
