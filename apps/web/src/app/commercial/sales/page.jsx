/**
 * @file page.jsx
 * @module commercial/sales
 * @description Orquestador del componente de Ventas Comerciales.
 * @responsibility Integrar carga de estados de venta y el form de facturación dinámica.
 * @usedBy Next.js App Router
 * @dependencies Hooks y Componentes locales
 */
'use client';
import React, { useState } from 'react';
import { useSalesData } from './hooks/useSalesData';
import { useSaleForm } from './hooks/useSaleForm';
import { useClientsPageData } from '../clients/hooks/useClientsPageData';
import ClientFormModal from '../clients/components/ClientFormModal';
import { SalesHeader } from './components/SalesHeader';
import SalesDashboardKpis from './components/SalesDashboardKpis';
import SalesDateFilterBar from './components/SalesDateFilterBar';
import { SalesTable } from './components/SalesTable';
import { SaleModal } from './components/SaleModal';

export default function SalesPage() {
  const [mostrarCifras, setMostrarCifras] = useState(false);
  const {
    sales, filteredSales, paginatedSales, loading, error, fetchSales,
    fechaInicio, fechaFin, handleDateChange, handleDateReset,
    currentPage, totalPages, totalItems, setCurrentPage
  } = useSalesData();

  const form = useSaleForm({ onSuccess: fetchSales });
  const clientHook = useClientsPageData();

  const handleCreatedClientSubmit = async (e) => {
    await clientHook.handleSubmit(e);
    const updated = await form.reloadClients();
    if (clientHook.formData.nombre) {
      const created = updated.find(c => c.nombre === clientHook.formData.nombre.trim().toUpperCase());
      if (created) form.setFormData(prev => ({ ...prev, idCliente: created.id }));
    }
  };

  return (
    <div>
      <SalesHeader
        onNew={form.handleOpenModal}
        mostrarCifras={mostrarCifras}
        onTogglePrivacy={() => setMostrarCifras(prev => !prev)}
      />
      <SalesDateFilterBar
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        onDateChange={handleDateChange}
        onReset={handleDateReset}
      />
      {!loading && !error && (
        <SalesDashboardKpis
          sales={filteredSales}
          allSales={sales}
          mostrarCifras={mostrarCifras}
        />
      )}
      <SalesTable
        sales={paginatedSales}
        loading={loading}
        error={error}
        onNew={form.handleOpenModal}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPrevPage={() => setCurrentPage(p => Math.max(1, p - 1))}
        onNextPage={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        mostrarCifras={mostrarCifras}
      />
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
