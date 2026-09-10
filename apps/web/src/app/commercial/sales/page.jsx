/**
 * @file page.jsx
 * @module commercial/sales
 * @description Orquestador del componente de Ventas Comerciales.
 * @responsibility Integrar carga de estados de venta y el form de facturación dinámica.
 * @usedBy Next.js App Router
 * @dependencies Hooks y Componentes locales
 */
'use client';
import React from 'react';
import { useSalesData } from './hooks/useSalesData';
import { useSaleForm } from './hooks/useSaleForm';
import { SalesHeader } from './components/SalesHeader';
import { SalesTable } from './components/SalesTable';
import { SaleModal } from './components/SaleModal';

export default function SalesPage() {
  const { sales, loading, error, fetchSales } = useSalesData();
  const form = useSaleForm({ onSuccess: fetchSales });

  return (
    <div>
      <SalesHeader onNew={form.handleOpenModal} />
      <SalesTable sales={sales} loading={loading} error={error} />
      <SaleModal 
        isOpen={form.isModalOpen} onClose={form.handleCloseModal}
        formData={form.formData} handleChange={form.handleChange}
        handleDetailsChange={form.handleDetailsChange}
        handleSubmit={form.handleSubmit}
        products={form.products}
        clients={form.clients}
      />
    </div>
  );
}
