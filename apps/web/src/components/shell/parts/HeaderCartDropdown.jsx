/**
 * @file HeaderCartDropdown.jsx
 * @module components/shell/parts
 * @description Desplegable multi-lista vertical tipo acordeón para el carrito de compras.
 * @responsibility Renderizar las listas, items seleccionados, y controles de edición/eliminación.
 * @usedBy apps/web/src/components/shell/Header.jsx
 * @dependencies react, lucide-react, @/components/ui/icons, @/components/ui/Button
 */
import React from 'react';
import { Layers, ListPlus, Trash2, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { TrashIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/Button';
import shellStyles from '../shell.module.css';
import styles from '../header.module.css';

export default function HeaderCartDropdown({
  lists,
  activeListId,
  isSyncing,
  isCreatingList,
  createList,
  setActiveList,
  removeFromCart,
  clearCart,
  proceedToPurchase,
  setEditNameValue,
  setEditNameModalOpen,
  setListToDelete,
  showNotification
}) {
  return (
    <div className={`${shellStyles.cartDropdown} ${styles.cartDropdownContainer}`}>
      <div className={styles.cartHeaderContainer}>
        <h3 className={styles.cartHeaderTitle}>Listas de Compra</h3>
        <button
          onClick={async () => {
            if (isCreatingList) return;
            try {
              const newId = await createList('Nueva Lista');
              if (!newId) showNotification('No se pudo crear la lista. Intente de nuevo.', 'error');
            } catch (err) {
              showNotification(err.message || 'Error al crear lista', 'error');
            }
          }}
          disabled={isCreatingList}
          title="Crear Lista"
          className={`${styles.btnCreateList} ${isCreatingList ? styles.btnCreateListDisabled : ''}`}
        >
          <ListPlus size={18} /> {isCreatingList ? 'Creando...' : 'Nueva'}
        </button>
      </div>
      
      <div className={styles.listsScrollContainer}>
        {isSyncing ? (
          <div className={styles.syncingMessage}>Sincronizando...</div>
        ) : Object.keys(lists).length === 0 ? (
          <div className={styles.emptyListsMessage}>Sin listas activas</div>
        ) : (
          Object.values(lists).map((l) => (
            <div key={l.id} className={styles.listItemWrapper}>
              <div 
                className={`${styles.listItemHeader} ${activeListId === l.id ? styles.listItemHeaderActive : ''}`}
                onClick={() => setActiveList(l.id)}
              >
                <div className={styles.listItemHeaderInfo}>
                  {activeListId === l.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  <span className={styles.listItemHeaderText}>
                    {l.codigo ? `${l.codigo} - ${l.customName} - ${new Date(l.createdAt).toLocaleDateString()}` : l.name}
                  </span>
                  <span className={styles.listItemBadge}>
                    {l.items?.length || 0} ítems
                  </span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditNameValue(l.customName || l.name);
                    setEditNameModalOpen(l.id);
                  }} 
                  className={styles.btnActionIcon}
                  title="Editar Nombre"
                >
                  <Pencil size={16} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setListToDelete(l.id);
                  }} 
                  className={`${styles.btnActionIcon} ${styles.btnActionDanger}`}
                  title="Eliminar Lista"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              {activeListId === l.id && (
                <div className={styles.listItemsDetails}>
                  {l.items?.length === 0 ? (
                    <p className={shellStyles.cartEmpty}>No hay insumos seleccionados en esta lista.</p>
                  ) : (
                    <ul className={shellStyles.cartList}>
                      {l.items.map((item) => (
                        <li key={item.id} className={shellStyles.cartItem}>
                          <div className={styles.cartItemInfoWrapper}>
                            <span className={shellStyles.cartItemName}>
                              {item.insumo?.nombre || item.nombre || 'Insumo sin nombre'}
                            </span>
                            <span className={shellStyles.cartItemProv}>
                              {item.proveedor?.razonSocial || item.proveedor?.nombre || item.proveedorNombre || item.presentacion?.nombre || ''}
                            </span>
                            <span className={styles.cartItemSubInfo}>
                              Cant: {Number(item.cantidad || 0)} | Precio/Sub: ${(Number(item.precioEstimado || 0) * Number(item.cantidad || 0)).toFixed(2)}
                            </span>
                          </div>
                          <button 
                            className={shellStyles.cartItemRemove} 
                            onClick={() => removeFromCart(item.id, l.id)}
                            title="Remover"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {l.items?.length > 0 && (
                    <div className={styles.cartFooterCustom}>
                      <Button variant="secondary" onClick={() => clearCart(l.id)}>Vaciar lista</Button>
                      <Button variant="primary" onClick={proceedToPurchase}>{l.codigo ? 'Ver Orden' : 'Preparar Orden'}</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
