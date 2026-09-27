/**
 * @file RecipesList.jsx
 * @module catalog/recipes/components
 * @description Tabla y vista móvil de recetas con diseño dual responsivo (MAN-UI-002, SRP < 150 líneas).
 */
import React from 'react';
import { Eye, Power, Trash2 } from 'lucide-react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import ProductAvatar from '@/components/ui/ProductAvatar';
import { resolveProductImage } from '@/lib/presetImages';
import { RecipeMobileCard } from './RecipeMobileCard';
import styles from '../recipes.module.css';

export function RecipesList({ 
  items, loading, error, onEdit, onToggleActive, onDelete, onNewRecipe,
  canCreate = true, disabledTooltip = ''
}) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (items.length === 0) {
    return (
      <AssistedEmptyState
        icon="📋"
        title="Comienza formulando tu primera Receta Técnica"
        description="Las recetas vinculan tus productos con los insumos de bodega y las bases en tanque, definiendo ingredientes, empaques, tiempos y temperaturas de elaboración."
        actionLabel="+ Formular Nueva Receta"
        onAction={() => { if (canCreate && onNewRecipe) onNewRecipe(null); }}
        topButtonLabel="Nueva Receta"
        canAction={canCreate}
        disabledTooltip={disabledTooltip}
      />
    );
  }

  return (
    <div className={styles.recipesListWrapper}>
      {/* Vista Móvil: Tarjetas Fluidas (< 768px) */}
      <div className={styles.mobileCardsContainer} role="feed" aria-label="Tarjetas de Recetas">
        {items.map((item) => (
          <RecipeMobileCard key={item.id} item={item} onEdit={onEdit} onToggleActive={onToggleActive} onDelete={onDelete} />
        ))}
      </div>

      {/* Vista Desktop: Tabla Tradicional (>= 768px) */}
      <div className={styles.desktopTableContainer}>
        <Table>
          <THead>
            <TR>
              <TH>Nombre Receta</TH>
              <TH>Producto Asociado</TH>
              <TH>Rendimiento</TH>
              <TH>N° Etapas</TH>
              <TH>Estado</TH>
              <TH>Acciones</TH>
            </TR>
          </THead>
          <TBody>
            {items.map((item) => (
              <TR key={item.id}>
                <TD><span className={styles.recipeNameText}>{item.nombre}</span></TD>
                <TD>
                  <div className={styles.productCell}>
                    {item.producto ? (
                      <>
                        <div className={styles.productAvatarBox}>
                          <ProductAvatar src={resolveProductImage(item.producto)} alt={item.producto.nombre} name={item.producto.nombre} size={36} />
                        </div>
                        <div className={styles.productInfoText}>
                          <span className={styles.productNameText}>{item.producto.nombre}</span>
                          <span className={styles.productPresentationText}>{item.producto.presentacion?.nombre || 'A Granel'}</span>
                        </div>
                      </>
                    ) : (
                      <span>{item.idProducto}</span>
                    )}
                  </div>
                </TD>
                <TD>{item.rendimientoBase} {item.unidadRendimiento}</TD>
                <TD>{item.etapas?.filter(e => e.activo !== false).length || 0}</TD>
                <TD>
                  <Badge status={item.activo ? 'active' : 'inactive'}>{item.activo ? 'Activo' : 'Inactivo'}</Badge>
                </TD>
                <TD>
                  <div className={styles.tableActionsGroup}>
                    <button type="button" className={styles.btnBomEdit} onClick={() => onEdit(item)} title="Ver BOM" aria-label="Ver BOM">
                      <Eye size={14} /><span>Ver BOM</span>
                    </button>
                    <button
                      type="button"
                      className={`${styles.btnStatusToggle} ${item.activo ? styles.btnStatusActive : styles.btnStatusInactive}`}
                      onClick={() => onToggleActive(item)}
                      title={item.activo ? 'Desactivar receta' : 'Activar receta'}
                    >
                      <Power size={13} /><span>{item.activo ? 'Desactivar' : 'Activar'}</span>
                    </button>
                    {onDelete && (
                      <button
                        type="button"
                        className={`${styles.btnDeleteCompact} ${item.activo ? styles.btnDeleteDisabled : ''}`}
                        onClick={() => !item.activo && onDelete(item)}
                        disabled={item.activo}
                        title={item.activo ? 'Desactive la receta para eliminarla' : 'Eliminar receta'}
                        aria-label={`Eliminar receta ${item.nombre}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
