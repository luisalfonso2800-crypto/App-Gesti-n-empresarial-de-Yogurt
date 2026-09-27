'use client';
/**
 * @file page.jsx
 * @module catalog/presentations
 * @description Vista principal que orquesta presentaciones de productos con paginación estricta y diseño responsivo.
 * @responsibility Carga de datos base y coordinación de componentes de presentación.
 * @usedBy Next.js App Router
 * @dependencies Hooks y Componentes locales.
 */
import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePresentationsData } from './hooks/usePresentationsData';
import { usePresentationForm } from './hooks/usePresentationForm';
import { PresentationsHeader } from './components/PresentationsHeader';
import { PresentationsTable } from './components/PresentationsTable';
import { PresentationModal } from './components/PresentationModal';
import { ConfirmDeletePresentationModal } from './components/ConfirmDeletePresentationModal';

function PresentationsContent() {
  const searchParams = useSearchParams();
  const { 
    presentations, 
    totalItems, 
    currentPage, 
    totalPages, 
    pageSize, 
    setCurrentPage, 
    loading, 
    error, 
    fetchPresentations, 
    handleToggleActive, 
    deletePresentation 
  } = usePresentationsData();

  const form = usePresentationForm({ onSuccess: fetchPresentations });

  useEffect(() => {
    if (searchParams.get('crear') === 'true') {
      const tipoUso = searchParams.get('tipoUso');
      const defaultTipoEnvase = tipoUso === 'SEMIELABORADO' ? 'BALDE' : 'ENVASE';
      form.handleOpenModal({ tipoEnvase: defaultTipoEnvase });
    }
  }, [searchParams]);

  const [deletingItem, setDeletingItem] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState(null);

  const handleOpenDelete = (item) => {
    setDeletingItem(item);
    setDeleteError(null);
  };

  const handleCloseDelete = () => {
    setDeletingItem(null);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    setDeleteError(null);
    const result = await deletePresentation(deletingItem.id);
    setIsDeleting(false);
    if (result.success) {
      handleCloseDelete();
    } else {
      setDeleteError(result.error);
    }
  };

  return (
    <div>
      <PresentationsHeader onNew={() => form.handleOpenModal(null)} />
      <PresentationsTable 
        presentations={presentations}
        totalItems={totalItems}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        loading={loading}
        error={error}
        onEdit={form.handleOpenModal}
        onToggleActive={handleToggleActive}
        onDelete={handleOpenDelete}
        onNew={() => form.handleOpenModal(null)}
      />
      <PresentationModal 
        isOpen={form.isModalOpen}
        onClose={form.handleCloseModal}
        isEditing={form.isEditing}
        editingItem={form.editingItem}
        formData={form.formData}
        setFormData={form.setFormData}
        handleChange={form.handleChange}
        handleSubmit={form.handleSubmit}
        isSubmitting={form.isSubmitting}
        errorMsg={form.errorMsg}
      />
      <ConfirmDeletePresentationModal
        isOpen={Boolean(deletingItem)}
        item={deletingItem}
        isDeleting={isDeleting}
        errorMessage={deleteError}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDelete}
      />
    </div>
  );
}

export default function PresentationsPage() {
  return (
    <Suspense fallback={null}>
      <PresentationsContent />
    </Suspense>
  );
}
