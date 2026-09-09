/**
 * @file Header.jsx
 * @module components/shell
 * @description Barra de navegación superior con soporte multi-lista vertical tipo acordeón.
 * @responsibility Renderizar enlaces y dropdown multi-lista del carrito en acordeón.
 * @usedBy apps/web/src/components/shell/Shell.jsx
 * @dependencies next/link, lucide-react, @/context/CartContext
 */
'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './shell.module.css';
import { ShoppingCartIcon, TrashIcon } from '@/components/ui/icons';
import { Layers, PlusCircle, ArrowRightLeft, ListPlus, Trash2, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { apiClient } from '@/lib/api-client';
import { useCart } from '@/context/CartContext';
import { useNotification } from '@/context/NotificationContext';

export function Header() {
  const router = useRouter();
  const { lists, activeListId, activeList, cartItems, cartCount, setActiveList, removeFromCart, clearCart, createList, refreshCart, isSyncing, deleteList } = useCart();
  const { showNotification } = useNotification();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);

  const [listToDelete, setListToDelete] = useState(null);
  const [editNameModalOpen, setEditNameModalOpen] = useState(null);
  const [editNameValue, setEditNameValue] = useState('');
  // Bloquea el botón "Nueva" mientras el POST al backend está en curso
  const [isCreatingList, setIsCreatingList] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditNameSubmit = async () => {
    if (!editNameModalOpen || !editNameValue.trim()) return;
    try {
      const nombreFinal = `Lista de Compra - ${editNameValue.trim()} - ${new Date().toLocaleDateString()}`;
      if (!editNameModalOpen.startsWith('local-')) {
        await apiClient.patch(`/purchases/orders/${editNameModalOpen}`, { nombre: nombreFinal });
      } else {
        // If local list, we could update context, but for now we prioritize backend lists as requested
      }
      showNotification('Nombre actualizado', 'success');
      setEditNameModalOpen(null);
      refreshCart();
    } catch (e) {
      showNotification(e.message || 'Error al actualizar nombre', 'error');
    }
  };

  const handleDeleteList = async () => {
    if (!listToDelete) return;
    try {
      if (!listToDelete.startsWith('local-')) {
        await apiClient.delete(`/purchases/orders/${listToDelete}`);
      } else {
        deleteList(listToDelete);
      }
      showNotification('Lista eliminada correctamente', 'success');
      refreshCart();
    } catch (e) {
      showNotification('Error al eliminar lista', 'error');
    } finally {
      setListToDelete(null);
    }
  };

  const proceedToPurchase = async () => {
    if (!activeListId || !activeList) return;
    try {
      if (activeListId.startsWith('local-')) {
        const payload = {
          nombre: activeList.name,
          items: cartItems.map(item => ({
            insumoId: item.insumoId || item.idInsumo || item.id,
            proveedorId: item.proveedorId || item.idProveedor,
            presentacionId: item.presentacionId || item.idPresentacion || null,
            cantidad: Number(item.cantidad || 1),
            precioEstimado: Number(item.precioEmpaque || item.precio || item.precioEstimado || item.costoUnidadBase || 0)
          }))
        };
        const order = await apiClient.post('/purchases/orders', payload);
        refreshCart();
        router.push(`/operations/purchases/new?orderId=${order.id}`);
      } else {
        router.push(`/operations/purchases/new?orderId=${activeListId}`);
      }
      setIsCartOpen(false);
    } catch (e) {
      showNotification(e.message || 'Error al preparar la orden.', 'error');
      setIsCartOpen(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLinks}>
        <Link href="/" className={styles.headerLink}>Dashboard</Link>
        <Link href="/catalog/products" className={styles.headerLink}>Catálogos</Link>
        <Link href="/operations/purchases" className={styles.headerLink}>Operaciones</Link>
        <Link href="/commercial/sales" className={styles.headerLink}>Comercial</Link>
      </div>
      <div className={styles.headerRight}>
        {activeList && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', background: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
             <Layers size={16} /> Lista Activa: {activeList.customName}
          </div>
        )}
        <div className={styles.cartContainer} ref={cartRef}>
          <button 
            className={`${styles.cartButton} ${cartCount > 0 ? styles.cartActive : ''}`}
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            <ShoppingCartIcon size={20} />
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>
          
          {isCartOpen && (
            <div className={styles.cartDropdown} style={{ width: '450px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
              <div className={styles.cartHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: 0 }}>Listas de Compra</h3>
                <button
                  onClick={async () => {
                    if (isCreatingList) return;
                    setIsCreatingList(true);
                    try {
                      const newId = await createList('Nueva Lista');
                      if (!newId) showNotification('No se pudo crear la lista. Intente de nuevo.', 'error');
                    } finally {
                      setIsCreatingList(false);
                    }
                  }}
                  disabled={isCreatingList}
                  title="Crear Lista"
                  style={{ background: 'none', border: 'none', cursor: isCreatingList ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4f46e5', opacity: isCreatingList ? 0.6 : 1 }}
                >
                  <ListPlus size={18} /> {isCreatingList ? 'Creando...' : 'Nueva'}
                </button>
              </div>
              
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {isSyncing ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>Sincronizando...</div>
                ) : Object.keys(lists).length === 0 ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>Sin listas activas</div>
                ) : (
                  Object.values(lists).map(l => (
                    <div key={l.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <div 
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', cursor: 'pointer', background: activeListId === l.id ? '#f8fafc' : 'white' }}
                        onClick={() => setActiveList(l.id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, overflow: 'hidden' }}>
                           {activeListId === l.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                           <span style={{ fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                             {l.codigo ? `${l.codigo} - ${l.customName} - ${new Date(l.createdAt).toLocaleDateString()}` : l.name}
                           </span>
                           <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', background: '#e2e8f0', borderRadius: '999px', color: '#475569' }}>{l.items?.length || 0} ítems</span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditNameValue(l.customName || l.name); setEditNameModalOpen(l.id); }} 
                          style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '0.25rem' }}
                          title="Editar Nombre"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setListToDelete(l.id); }} 
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      {activeListId === l.id && (
                        <div style={{ padding: '0.5rem 1rem', background: '#f8fafc' }}>
                          {l.items?.length === 0 ? (
                            <p className={styles.cartEmpty}>No hay insumos seleccionados en esta lista.</p>
                          ) : (
                            <ul className={styles.cartList}>
                              {l.items.map(item => (
                                <li key={item.id} className={styles.cartItem}>
                                  <div className={styles.cartItemInfo} style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', flex: 1 }}>
                                    <span className={styles.cartItemName} style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                      {item.insumo?.nombre || item.nombre || 'Insumo sin nombre'}
                                    </span>
                                    <span className={styles.cartItemProv} style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                      {item.proveedor?.razonSocial || item.proveedor?.nombre || item.proveedorNombre || item.presentacion?.nombre || ''}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: '#374151' }}>
                                      Cant: {Number(item.cantidad || 0)} | Precio/Sub: ${(Number(item.precioEstimado || 0) * Number(item.cantidad || 0)).toFixed(2)}
                                    </span>
                                  </div>
                                  <button 
                                    className={styles.cartItemRemove} 
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
                            <div className={styles.cartFooter} style={{ marginTop: '0.5rem', borderTop: 'none', padding: 0 }}>
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
          )}
        </div>
      </div>

      <Modal isOpen={!!editNameModalOpen} onClose={() => setEditNameModalOpen(null)} title="Editar Nombre de Lista">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Nuevo nombre personalizado:</label>
          <input 
            type="text" 
            value={editNameValue} 
            onChange={(e) => setEditNameValue(e.target.value)}
            placeholder="Ej. Proveedores Locales"
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', width: '100%' }}
          />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setEditNameModalOpen(null)}>Cancelar</Button>
            <Button variant="primary" onClick={handleEditNameSubmit}>Guardar</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!listToDelete} onClose={() => setListToDelete(null)} title="Descartar Lista">
        <p>¿Estás seguro que deseas eliminar esta lista de compra? Esta acción no se puede deshacer.</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setListToDelete(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDeleteList}>Eliminar</Button>
        </div>
      </Modal>
    </header>
  );
}
