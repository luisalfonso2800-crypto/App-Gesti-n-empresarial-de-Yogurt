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
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import { apiClient } from '@/lib/api-client';
import { useCart } from '@/context/CartContext';
import { useNotification } from '@/context/NotificationContext';
import { OnboardingWizardWidget } from './OnboardingWizardWidget';

export function Header() {
  const router = useRouter();
  const { lists, activeListId, activeList, cartItems, cartCount, setActiveList, removeFromCart, clearCart, createList, refreshCart, isSyncing, deleteList } = useCart();
  const { showNotification } = useNotification();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);

  const [listToDelete, setListToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  const [editNameModalOpen, setEditNameModalOpen] = useState(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [editNameError, setEditNameError] = useState(null);
  const [isSubmittingEditName, setIsSubmittingEditName] = useState(false);

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
    if (!editNameModalOpen || !editNameValue.trim() || isSubmittingEditName) return;
    setIsSubmittingEditName(true);
    setEditNameError(null);
    try {
      const nombreFinal = `Lista de Compra - ${editNameValue.trim().toUpperCase()} - ${new Date().toLocaleDateString()}`;
      if (!editNameModalOpen.startsWith('local-')) {
        await apiClient.patch(`/purchases/orders/${editNameModalOpen}`, { nombre: nombreFinal });
      } else {
        // If local list, we could update context, but for now we prioritize backend lists as requested
      }
      showNotification('Nombre actualizado', 'success');
      setEditNameModalOpen(null);
      setEditNameValue('');
      refreshCart();
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Error al actualizar nombre';
      setEditNameError(msg);
      showNotification(msg, 'error');
    } finally {
      setIsSubmittingEditName(false);
    }
  };

  const handleDeleteList = async () => {
    if (!listToDelete || isSubmittingDelete) return;
    setIsSubmittingDelete(true);
    setDeleteError(null);
    try {
      if (!listToDelete.startsWith('local-')) {
        await apiClient.delete(`/purchases/orders/${listToDelete}`);
      } else {
        deleteList(listToDelete);
      }
      showNotification('Lista eliminada correctamente', 'success');
      setListToDelete(null);
      refreshCart();
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Error al eliminar lista';
      setDeleteError(msg);
      showNotification(msg, 'error');
    } finally {
      setIsSubmittingDelete(false);
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
      <div className={styles.scadaInstrumentation}>
        <div className={styles.scadaStatus}>
          <span className={styles.scadaStatusLed}></span>
          SISTEMA EN LÍNEA
        </div>
        <div className={styles.scadaClock}>
          {new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
        </div>
        <div className={styles.scadaOperator}>
          OPERADOR-01
        </div>
      </div>
      <div className={styles.headerRight}>
        <OnboardingWizardWidget />
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

      <SmartModal 
        isOpen={!!editNameModalOpen} 
        onClose={() => { setEditNameModalOpen(null); setEditNameError(null); }} 
        title="EDITAR NOMBRE DE LISTA"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {editNameError && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #F87171',
              color: '#B91C1C',
              padding: '0.6rem 0.8rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 500
            }}>
              ⚠️ {editNameError}
            </div>
          )}

          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>NUEVO NOMBRE PERSONALIZADO:</label>
          <input 
            type="text" 
            value={editNameValue} 
            onChange={(e) => {
              setEditNameValue(e.target.value.toUpperCase());
              setEditNameError(null);
            }}
            placeholder="EJ. PROVEEDORES LOCALES"
            style={{ 
              padding: '0.5rem', 
              borderRadius: '4px', 
              border: '1px solid #d1d5db', 
              width: '100%',
              textTransform: 'uppercase'
            }}
          />

          {/* Resumen Poka-Yoke */}
          {editNameValue.trim() && (
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              color: '#166534',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.76rem',
              lineHeight: 1.4
            }}>
              <strong>Acción a realizar:</strong> Se actualizará el nombre de la lista a:{' '}
              <code>LISTA DE COMPRA - {editNameValue.trim().toUpperCase()} - {new Date().toLocaleDateString()}</code>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => { setEditNameModalOpen(null); setEditNameError(null); }}>Cancelar</Button>
            <SubmitButton
              onClick={handleEditNameSubmit}
              loading={isSubmittingEditName}
              disabled={!editNameValue.trim() || isSubmittingEditName}
              missingFields={!editNameValue.trim() ? ['Nuevo nombre personalizado'] : []}
            >
              Guardar Nombre
            </SubmitButton>
          </div>
        </div>
      </SmartModal>

      <SmartModal 
        isOpen={!!listToDelete} 
        onClose={() => { setListToDelete(null); setDeleteError(null); }} 
        title="DESCARTAR LISTA"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          {deleteError && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #F87171',
              color: '#B91C1C',
              padding: '0.6rem 0.8rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 500
            }}>
              ⚠️ {deleteError}
            </div>
          )}

          <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>
            ¿Estás seguro que deseas eliminar esta lista de compra? Esta acción no se puede deshacer.
          </p>

          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#991B1B',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.76rem',
            lineHeight: 1.4
          }}>
            <strong>Advertencia Poka-Yoke:</strong> Se eliminará la lista activa junto con todos los insumos que contiene.
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => { setListToDelete(null); setDeleteError(null); }}>Cancelar</Button>
            <SubmitButton 
              variant="danger" 
              onClick={handleDeleteList}
              loading={isSubmittingDelete}
              disabled={isSubmittingDelete}
            >
              Eliminar Lista
            </SubmitButton>
          </div>
        </div>
      </SmartModal>
    </header>
  );
}
