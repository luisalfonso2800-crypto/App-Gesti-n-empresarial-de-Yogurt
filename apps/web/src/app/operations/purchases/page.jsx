'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import styles from './purchases.module.css';
import { ContextBanner } from '../../../components/ui/ContextBanner';


export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    idProveedor: '',
    fechaCompra: new Date().toISOString().substring(0, 10),
    estado: 'PENDIENTE',
    total: 0,
    observaciones: '',
    detalles: []
  });

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/purchases');
      setPurchases(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar compras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      idProveedor: '',
      fechaCompra: new Date().toISOString().substring(0, 10),
      estado: 'PENDIENTE',
      total: 0,
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
      await apiClient.post('/purchases', {
        ...formData,
        fechaCompra: new Date(formData.fechaCompra).toISOString()
      });
      handleCloseModal();
      fetchPurchases();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Compras</h1>
          <p className={styles.subtitle}>Registro y control de órdenes de adquisición de insumos a proveedores externos.</p>
        </div>
        <Button onClick={handleOpenModal}>Nueva Compra</Button>
      </div>
      <ContextBanner title="Concepto Técnico" description="Aquí se documenta la llegada de nuevos insumos a la planta. Registra qué se recibió, cuánto costó y confirma que la cantidad física coincida con la comprada." />


      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : purchases.length === 0 ? (
        <EmptyState title="No hay compras" description="Registra la primera compra" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Proveedor (ID)</TH>
              <TH>Fecha</TH>
              <TH>Total</TH>
              <TH>Estado</TH>
            </TR>
          </THead>
          <TBody>
            {purchases.map((item) => (
              <TR key={item.id}>
                <TD>{item.idProveedor}</TD>
                <TD>{new Date(item.fechaCompra).toLocaleDateString()}</TD>
                <TD>${Number(item.total).toFixed(2)}</TD>
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
        title="Nueva Compra"
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input 
            label="ID Proveedor" 
            name="idProveedor" 
            value={formData.idProveedor} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Fecha Compra" 
            name="fechaCompra" 
            type="date"
            value={formData.fechaCompra} 
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
            label="Total" 
            name="total" 
            type="number"
            step="0.01"
            value={formData.total} 
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
