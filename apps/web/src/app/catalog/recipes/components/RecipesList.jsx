/**
 * @file RecipesList.jsx
 * @module catalog/recipes/components
 * @description Tabla de recetas existentes.
 * @responsibility Renderizar lista de recetas y sus acciones.
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies @/components/ui/Table, Badge, Button, States
 */
import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import ProductAvatar from '@/components/ui/ProductAvatar';
import { resolveProductImage } from '@/lib/presetImages';
import styles from '../recipes.module.css';

export function RecipesList({ 
  items, 
  loading, 
  error, 
  onEdit, 
  onToggleActive, 
  onDelete,
  onNewRecipe,
  canCreate = true,
  disabledTooltip = ''
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
            <TD>{item.nombre}</TD>
            <TD>
              <div className={styles.productCell}>
                {item.producto ? (
                  <>
                    <div className={styles.productAvatarBox}>
                      <ProductAvatar
                        src={resolveProductImage(item.producto)}
                        alt={item.producto.nombre}
                        name={item.producto.nombre}
                        size={40}
                      />
                    </div>
                    <div className={styles.productInfoText}>
                      <span className={styles.productNameText}>{item.producto.nombre}</span>
                      <span className={styles.productPresentationText}>
                        {item.producto.presentacion?.nombre || 'A Granel'}
                      </span>
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
              <Badge status={item.activo ? 'active' : 'inactive'}>
                {item.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </TD>
            <TD>
              <div className={styles.tableActionsGroup}>
                <button
                  type="button"
                  className={styles.btnBomEdit}
                  onClick={() => onEdit(item)}
                  title="Ver explosión BOM y editar formulación"
                >
                  👁️ Ver BOM
                </button>
                <button
                  type="button"
                  className={`${styles.btnStatusToggle} ${item.activo ? styles.btnStatusActive : styles.btnStatusInactive}`}
                  onClick={() => onToggleActive(item)}
                  title={item.activo ? "Desactivar receta" : "Activar receta"}
                >
                  {item.activo ? 'Desactivar' : 'Activar'}
                </button>
                {onDelete && (
                  <button
                    type="button"
                    className={`${styles.btnDeleteCompact} ${item.activo ? styles.btnDeleteDisabled : ''}`}
                    onClick={() => onDelete(item)}
                    title={item.activo ? "Debe desactivar la receta antes de poder eliminarla" : "Eliminar receta técnica de forma segura"}
                    aria-label={`Eliminar receta ${item.nombre}`}
                    disabled={item.activo}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
