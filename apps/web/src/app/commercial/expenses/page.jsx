'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import styles from './expenses.module.css';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().substring(0, 10),
    categoria: '',
    descripcion: '',
    valor: 0,
    tipoGasto: 'OPERATIVO',
    periodo: '',
    observaciones: ''
  });

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
    setFormData({
      fecha: new Date().toISOString().substring(0, 10),
      categoria: '',
      descripcion: '',
      valor: 0,
      tipoGasto: 'OPERATIVO',
      periodo: '',
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
      await apiClient.post('/expenses', {
        ...formData,
        fecha: new Date(formData.fecha).toISOString()
      });
      handleCloseModal();
      fetchExpenses();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Gastos</h1>
        <Button onClick={handleOpenModal}>Nuevo Gasto</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : expenses.length === 0 ? (
        <EmptyState title="No hay gastos" description="Registra el primer gasto" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Fecha</TH>
              <TH>Categoría</TH>
              <TH>Descripción</TH>
              <TH>Valor</TH>
              <TH>Tipo</TH>
            </TR>
          </THead>
          <TBody>
            {expenses.map((item) => (
              <TR key={item.id}>
                <TD>{new Date(item.fecha).toLocaleDateString()}</TD>
                <TD>{item.categoria}</TD>
                <TD>{item.descripcion}</TD>
                <TD>${Number(item.valor).toFixed(2)}</TD>
                <TD>{item.tipoGasto}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Nuevo Gasto"
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input 
            label="Fecha" 
            name="fecha" 
            type="date"
            value={formData.fecha} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Categoría" 
            name="categoria" 
            value={formData.categoria} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Descripción" 
            name="descripcion" 
            value={formData.descripcion} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Valor" 
            name="valor" 
            type="number"
            step="0.01"
            value={formData.valor} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Tipo de Gasto" 
            name="tipoGasto" 
            value={formData.tipoGasto} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Periodo" 
            name="periodo" 
            value={formData.periodo} 
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
