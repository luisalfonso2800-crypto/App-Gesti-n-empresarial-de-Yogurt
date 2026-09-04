'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import styles from './sales.module.css';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    idCliente: '',
    fechaVenta: new Date().toISOString().substring(0, 10),
    canalVenta: 'DIRECTO',
    tipoPago: 'CONTADO',
    totalVenta: 0,
    valorPagado: 0,
    saldoPendiente: 0,
    estado: 'COMPLETADO',
    observaciones: '',
    detalles: []
  });

  const fetchSales = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/sales');
      setSales(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      idCliente: '',
      fechaVenta: new Date().toISOString().substring(0, 10),
      canalVenta: 'DIRECTO',
      tipoPago: 'CONTADO',
      totalVenta: 0,
      valorPagado: 0,
      saldoPendiente: 0,
      estado: 'COMPLETADO',
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
      await apiClient.post('/sales', {
        ...formData,
        fechaVenta: new Date(formData.fechaVenta).toISOString()
      });
      handleCloseModal();
      fetchSales();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Ventas</h1>
          <p className={styles.subtitle}>Facturación, pedidos y despachos de productos terminados a clientes.</p>
        </div>
        <Button onClick={handleOpenModal}>Nueva Venta</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : sales.length === 0 ? (
        <EmptyState title="No hay ventas" description="Registra la primera venta" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Cliente (ID)</TH>
              <TH>Fecha</TH>
              <TH>Total</TH>
              <TH>Saldo</TH>
              <TH>Estado</TH>
            </TR>
          </THead>
          <TBody>
            {sales.map((item) => (
              <TR key={item.id}>
                <TD>{item.idCliente}</TD>
                <TD>{new Date(item.fechaVenta).toLocaleDateString()}</TD>
                <TD>${Number(item.totalVenta).toFixed(2)}</TD>
                <TD>${Number(item.saldoPendiente).toFixed(2)}</TD>
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
        title="Nueva Venta"
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input 
            label="ID Cliente" 
            name="idCliente" 
            value={formData.idCliente} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Fecha Venta" 
            name="fechaVenta" 
            type="date"
            value={formData.fechaVenta} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Canal de Venta" 
            name="canalVenta" 
            value={formData.canalVenta} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Tipo de Pago" 
            name="tipoPago" 
            value={formData.tipoPago} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Total Venta" 
            name="totalVenta" 
            type="number"
            step="0.01"
            value={formData.totalVenta} 
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
            label="Saldo Pendiente" 
            name="saldoPendiente" 
            type="number"
            step="0.01"
            value={formData.saldoPendiente} 
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
