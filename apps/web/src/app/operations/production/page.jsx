'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import styles from './production.module.css';

export default function ProductionPage() {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    idProducto: '',
    fechaProduccion: new Date().toISOString().substring(0, 10),
    cantidadPlanificada: 0,
    estado: 'PENDIENTE',
    observaciones: '',
    detalles: []
  });

  const fetchProductions = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/production');
      setProductions(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar producción');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      idProducto: '',
      fechaProduccion: new Date().toISOString().substring(0, 10),
      cantidadPlanificada: 0,
      estado: 'PENDIENTE',
      observaciones: '',
      detalles: []
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
      await apiClient.post('/production', {
        ...formData,
        fechaProduccion: new Date(formData.fechaProduccion).toISOString()
      });
      handleCloseModal();
      fetchProductions();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Producción</h1>
        <Button onClick={handleOpenModal}>Nueva Orden</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : productions.length === 0 ? (
        <EmptyState title="No hay producción" description="Registra la primera orden" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Producto (ID)</TH>
              <TH>Fecha</TH>
              <TH>Planificada</TH>
              <TH>Producida</TH>
              <TH>Estado</TH>
            </TR>
          </THead>
          <TBody>
            {productions.map((item) => (
              <TR key={item.id}>
                <TD>{item.idProducto}</TD>
                <TD>{new Date(item.fechaProduccion).toLocaleDateString()}</TD>
                <TD>{Number(item.cantidadPlanificada).toFixed(2)}</TD>
                <TD>{item.cantidadProducidaReal ? Number(item.cantidadProducidaReal).toFixed(2) : '-'}</TD>
                <TD>
                  <Badge status={item.estado === 'COMPLETADO' ? 'active' : 'inactive'}>
                    {item.estado}
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
        title="Nueva Orden de Producción"
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input 
            label="ID Producto" 
            name="idProducto" 
            value={formData.idProducto} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Fecha Producción" 
            name="fechaProduccion" 
            type="date"
            value={formData.fechaProduccion} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Cantidad Planificada" 
            name="cantidadPlanificada" 
            type="number"
            step="0.01"
            value={formData.cantidadPlanificada} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Estado" 
            name="estado" 
            value={formData.estado} 
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
