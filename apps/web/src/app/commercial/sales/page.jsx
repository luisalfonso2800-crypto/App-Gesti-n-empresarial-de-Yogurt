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
import { useClientsPageData } from '../clients/hooks/useClientsPageData';
import ClientFormModal from '../clients/components/ClientFormModal';
import { SalesHeader } from './components/SalesHeader';
import { SalesTable } from './components/SalesTable';
import { SaleModal } from './components/SaleModal';

export default function SalesPage() {
  const { sales, loading, error, fetchSales } = useSalesData();
  const form = useSaleForm({ onSuccess: fetchSales });
  const clientHook = useClientsPageData();

  const handleCreatedClientSubmit = async (e) => {
    await clientHook.handleSubmit(e);
    const updated = await form.reloadClients();
    if (clientHook.formData.nombre) {
      const created = updated.find(c => c.nombre === clientHook.formData.nombre.trim().toUpperCase());
      if (created) {
        form.setFormData(prev => ({ ...prev, idCliente: created.id }));
      }
    }
  };

  return (
    <div>
      <SalesHeader onNew={form.handleOpenModal} />
      <SalesTable sales={sales} loading={loading} error={error} onNew={form.handleOpenModal} />
      <SaleModal 
        isOpen={form.isModalOpen} onClose={form.handleCloseModal}
        formData={form.formData} handleChange={form.handleChange}
        handleDetailsChange={form.handleDetailsChange}
        handleSubmit={form.handleSubmit}
        products={form.products}
        clients={form.clients}
        isSubmitting={form.isSubmitting}
        errorMsg={form.errorMsg}
        onNewClient={clientHook.handleOpenModal}
      />
      <ClientFormModal
        isOpen={clientHook.isModalOpen}
        onClose={clientHook.handleCloseModal}
        formData={clientHook.formData}
        isSubmitting={clientHook.isSubmitting}
        submitError={clientHook.submitError}
        isDirty={clientHook.isDirty}
        isSubmitDisabled={clientHook.isSubmitDisabled}
        submitTitle={clientHook.submitTitle}
        handleChange={clientHook.handleChange}
        handleSubmit={handleCreatedClientSubmit}
      />
    </div>
  );
}
