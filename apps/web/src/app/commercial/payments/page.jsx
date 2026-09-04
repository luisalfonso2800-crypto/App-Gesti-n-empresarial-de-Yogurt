'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import styles from './payments.module.css';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fechaPago: new Date().toISOString().substring(0, 10),
    idCliente: '',
    idVenta: '',
    valorPagado: 0,
    metodoPago: 'EFECTIVO',
    referencia: '',
    observaciones: ''
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/payments');
      setPayments(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar pagos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      fechaPago: new Date().toISOString().substring(0, 10),
      idCliente: '',
      idVenta: '',
      valorPagado: 0,
      metodoPago: 'EFECTIVO',
      referencia: '',
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
      await apiClient.post('/payments', {
        ...formData,
        fechaPago: new Date(formData.fechaPago).toISOString()
      });
      handleCloseModal();
      fetchPayments();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Pagos y Cobros</h1>
        <Button onClick={handleOpenModal}>Nuevo Pago</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : payments.length === 0 ? (
        <EmptyState title="No hay pagos" description="Registra el primer pago" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Fecha</TH>
              <TH>Cliente (ID)</TH>
              <TH>Venta (ID)</TH>
              <TH>Valor</TH>
              <TH>Método</TH>
            </TR>
          </THead>
          <TBody>
            {payments.map((item) => (
              <TR key={item.id}>
                <TD>{new Date(item.fechaPago).toLocaleDateString()}</TD>
                <TD>{item.idCliente}</TD>
                <TD>{item.idVenta}</TD>
                <TD>${Number(item.valorPagado).toFixed(2)}</TD>
                <TD>{item.metodoPago}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Nuevo Pago"
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input 
            label="Fecha de Pago" 
            name="fechaPago" 
            type="date"
            value={formData.fechaPago} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="ID Cliente" 
            name="idCliente" 
            value={formData.idCliente} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="ID Venta" 
            name="idVenta" 
            value={formData.idVenta} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Valor Pagado" 
            name="valorPagado" 
            type="number"
            step="0.01"
            value={formData.valorPagado} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Método de Pago" 
            name="metodoPago" 
            value={formData.metodoPago} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Referencia" 
            name="referencia" 
            value={formData.referencia} 
            onChange={handleChange} 
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
