/**
 * @file Header.jsx
 * @module components/shell
 * @description Barra de navegación superior (SRP + CSS Modules + Dropdown Multi-lista).
 * @responsibility Renderizar instrumentación SCADA, píldora de Onboarding, carrito y delegar lógica.
 * @usedBy apps/web/src/components/shell/Shell.jsx
 * @dependencies react, lucide-react, @/components/ui/icons, ./parts/useHeaderCart, ./parts/HeaderCartDropdown, ./parts/HeaderCartModals
 */
'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import shellStyles from './shell.module.css';
import styles from './header.module.css';
import { ShoppingCartIcon } from '@/components/ui/icons';
import { Layers, PlusCircle } from 'lucide-react';
import { OnboardingWizardWidget } from './OnboardingWizardWidget';
import { PlantToolsModal } from '@/components/common/tools/PlantToolsModal';
import { useHeaderCart } from './parts/useHeaderCart';
import HeaderCartDropdown from './parts/HeaderCartDropdown';
import HeaderCartModals from './parts/HeaderCartModals';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleQuickSale = () => {
    if (pathname === '/commercial/sales') {
      window.dispatchEvent(new CustomEvent('open-sales-modal'));
    } else {
      router.push('/commercial/sales?action=new');
    }
  };

  const {
    lists, activeListId, activeList, cartCount, isSyncing,
    isCartOpen, setIsCartOpen, cartRef, listToDelete, setListToDelete,
    deleteError, setDeleteError, isSubmittingDelete,
    editNameModalOpen, setEditNameModalOpen, editNameValue, setEditNameValue,
    editNameError, setEditNameError, isSubmittingEditName, isCreatingList,
    createList, setActiveList, removeFromCart, clearCart, proceedToPurchase,
    handleEditNameSubmit, handleDeleteList, showNotification
  } = useHeaderCart();

  return (
    <header className={shellStyles.header}>
      <div className={shellStyles.scadaInstrumentation}>
        <div className={shellStyles.scadaStatus}>
          <span className={shellStyles.scadaStatusLed}></span>
          SISTEMA EN LÍNEA
        </div>
        <div className={shellStyles.scadaClock}>
          {new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
        </div>
        <div className={shellStyles.scadaOperator}>
          OPERADOR-01
        </div>
      </div>

      <div className={shellStyles.headerRight}>
        <OnboardingWizardWidget />

        {activeList && (
          <div className={styles.activeListBadge}>
            <Layers size={16} /> Lista Activa: {activeList.customName}
          </div>
        )}

        <button
          type="button"
          onClick={handleQuickSale}
          className={styles.quickSaleBtn}
          title="Registrar nueva venta rápida"
          aria-label="Registrar nueva venta"
        >
          <PlusCircle size={14} /> Nueva Venta
        </button>

        <PlantToolsModal />

        <div className={shellStyles.cartContainer} ref={cartRef}>
          <button 
            className={`${shellStyles.cartButton} ${cartCount > 0 ? shellStyles.cartActive : ''}`}
            onClick={() => setIsCartOpen(!isCartOpen)}
            aria-label="Abrir carrito de compras"
          >
            <ShoppingCartIcon size={20} />
            {cartCount > 0 && <span className={shellStyles.cartBadge}>{cartCount}</span>}
          </button>
          
          {isCartOpen && (
            <HeaderCartDropdown
              lists={lists}
              activeListId={activeListId}
              isSyncing={isSyncing}
              isCreatingList={isCreatingList}
              createList={createList}
              setActiveList={setActiveList}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              proceedToPurchase={proceedToPurchase}
              setEditNameValue={setEditNameValue}
              setEditNameModalOpen={setEditNameModalOpen}
              setListToDelete={setListToDelete}
              showNotification={showNotification}
            />
          )}
        </div>
      </div>

      <HeaderCartModals
        editNameModalOpen={editNameModalOpen}
        setEditNameModalOpen={setEditNameModalOpen}
        editNameValue={editNameValue}
        setEditNameValue={setEditNameValue}
        editNameError={editNameError}
        setEditNameError={setEditNameError}
        isSubmittingEditName={isSubmittingEditName}
        handleEditNameSubmit={handleEditNameSubmit}
        listToDelete={listToDelete}
        setListToDelete={setListToDelete}
        deleteError={deleteError}
        setDeleteError={setDeleteError}
        isSubmittingDelete={isSubmittingDelete}
        handleDeleteList={handleDeleteList}
      />
    </header>
  );
}
