/**
 * @file PresentationsTable.jsx
 * @module catalog/presentations/components
 * @description Tabla de catálogo enriquecida y responsiva para presentaciones comerciales (SRP < 150 líneas).
 * @responsibility Orquestar vista de tabla desktop y tarjetas móviles, con paginación de 10 elementos.
 * @usedBy apps/web/src/app/catalog/presentations/page.jsx
 * @dependencies @/components/ui/Table, States, AssistedEmptyState, PresentationMobileCard, PresentationTableRow, PresentationsPagination
 */
import React from 'react';
import { Table, THead, TBody, TR, TH } from '@/components/ui/Table';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import { PresentationMobileCard } from './PresentationMobileCard';
import { PresentationTableRow } from './PresentationTableRow';
import { PresentationsPagination } from './PresentationsPagination';
import styles from '../presentations.module.css';

function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '') : 'http://localhost:3001';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function PresentationsTable({ 
  presentations, 
  totalItems, 
  currentPage, 
  totalPages, 
  pageSize, 
  onPageChange,
  loading, 
  error, 
  onEdit, 
  onToggleActive, 
  onDelete, 
  onNew 
}) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (totalItems === 0) {
    return (
      <AssistedEmptyState
        icon="🧴"
        title="Comienza registrando tu primera Presentación"
        description="Define los envases y moldes físicos (botellas, vasos) donde se empacan los productos."
        actionLabel="+ Nueva Presentación"
        onAction={() => onNew && onNew()}
        topButtonLabel="Nueva Presentación"
      />
    );
  }

  return (
    <div className={styles.presentationsWrapper}>
      {/* Vista Móvil: Tarjetas Fluidas (MAN-UI-002) */}
      <div className={styles.mobileCardsContainer}>
        {presentations.map((item) => (
          <PresentationMobileCard
            key={item.id}
            item={item}
            imageSrc={resolveImageUrl(item.imagenUrl || item.imageUrl || item.image)}
            onEdit={onEdit}
            onToggleActive={onToggleActive}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Vista Desktop / Tablet: Tabla Enriquecida */}
      <div className={styles.desktopTableContainer}>
        <Table>
          <THead>
            <TR>
              <TH className={styles.thumbnailHeader}>Vista</TH>
              <TH>Nombre y Detalle</TH>
              <TH>Tipo de Envase</TH>
              <TH>Capacidad (Oz / Ml)</TH>
              <TH>Unidad</TH>
              <TH>Tapilla</TH>
              <TH>Estado</TH>
              <TH className={styles.actionsHeader}>Acciones</TH>
            </TR>
          </THead>
          <TBody>
            {presentations.map((item) => (
              <PresentationTableRow
                key={item.id}
                item={item}
                imageSrc={resolveImageUrl(item.imagenUrl || item.imageUrl || item.image)}
                onEdit={onEdit}
                onToggleActive={onToggleActive}
                onDelete={onDelete}
              />
            ))}
          </TBody>
        </Table>
      </div>

      {/* Paginación estricta (máximo 10 items por página) */}
      <PresentationsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
}
