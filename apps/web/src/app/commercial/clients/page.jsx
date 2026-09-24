/**
 * @file page.jsx
 * @module commercial/clients
 * @description Orquestador de la vista de Clientes (SRP + CSS Modules).
 * @responsibility Presentar la cabecera, tabla de clientes registrados y delegar lógica y formulario modal.
 * @usedBy Next.js App Router
 * @dependencies react, @/components/ui/Button, @/components/ui/Table, @/components/ui/Badge, @/components/ui/States, @/components/ui/AssistedEmptyState
 */
'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import styles from './clients.module.css';
import { useClientsPageData } from './hooks/useClientsPageData';
import ClientFormModal from './components/ClientFormModal';

export default function ClientsPage() {
  const {
    clients,
    loading,
    error,
    submitError,
    isModalOpen,
    isSubmitting,
    formData,
    isDirty,
    isSubmitDisabled,
    submitTitle,
    handleOpenModal,
    handleCloseModal,
    handleChange,
    handleSubmit
  } = useClientsPageData();

  return (
    <div>
      <div className={styles.header}>
        <div />
        <Button onClick={handleOpenModal}>Nuevo Cliente</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : clients.length === 0 ? (
        <AssistedEmptyState
          icon="👥"
          title="Comienza registrando tu primer Cliente"
          description="Directorio de compradores comerciales (supermercados, tiendas, cafeterías) y personas naturales."
          actionLabel="+ Nuevo Cliente"
          onAction={handleOpenModal}
          topButtonLabel="Nuevo Cliente"
        />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Nombre</TH>
              <TH>Tipo</TH>
              <TH>Canal</TH>
              <TH>Teléfono</TH>
              <TH>Estado</TH>
            </TR>
          </THead>
          <TBody>
            {clients.map((item) => (
              <TR key={item.id}>
                <TD>{item.nombre}</TD>
                <TD>{item.tipoCliente}</TD>
                <TD>{item.canal}</TD>
                <TD>{item.telefono}</TD>
                <TD>
                  <Badge status={item.activo ? 'active' : 'inactive'}>
                    {item.activo ? 'ACTIVO' : 'INACTIVO'}
                  </Badge>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <ClientFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        isSubmitting={isSubmitting}
        submitError={submitError}
        isDirty={isDirty}
        isSubmitDisabled={isSubmitDisabled}
        submitTitle={submitTitle}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
