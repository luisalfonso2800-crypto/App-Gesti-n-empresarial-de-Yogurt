/**
 * @file page.jsx
 * @module catalog/presentations
 * @description Vista principal que orquesta presentaciones de productos.
 * @responsibility Carga de datos base y coordinación de componentes de presentación.
 * @usedBy Next.js App Router
 * @dependencies Hooks y Componentes locales.
 */
'use client';
import React from 'react';
import { usePresentationsData } from './hooks/usePresentationsData';
import { usePresentationForm } from './hooks/usePresentationForm';
import { PresentationsHeader } from './components/PresentationsHeader';
import { PresentationsTable } from './components/PresentationsTable';
import { PresentationModal } from './components/PresentationModal';

export default function PresentationsPage() {
  const { presentations, loading, error, fetchPresentations, handleToggleActive } = usePresentationsData();
  const form = usePresentationForm({ onSuccess: fetchPresentations });

  return (
    <div>
      <PresentationsHeader onNew={() => form.handleOpenModal(null)} />
      <PresentationsTable 
        presentations={presentations} loading={loading} error={error}
        onEdit={form.handleOpenModal} onToggleActive={handleToggleActive}
      />
      <PresentationModal 
        isOpen={form.isModalOpen} onClose={form.handleCloseModal}
        isEditing={form.isEditing} editingItem={form.editingItem} formData={form.formData}
        setFormData={form.setFormData} handleChange={form.handleChange} handleSubmit={form.handleSubmit}
        isSubmitting={form.isSubmitting} errorMsg={form.errorMsg}
      />
    </div>
  );
}
