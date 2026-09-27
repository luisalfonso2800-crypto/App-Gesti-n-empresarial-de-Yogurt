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
import { Layers, PlusCircle, Menu } from 'lucide-react';
import { OnboardingWizardWidget } from './OnboardingWizardWidget';
import { PlantToolsModal } from '@/components/common/tools/PlantToolsModal';
import { useHeaderCart } from './parts/useHeaderCart';
import HeaderCartDropdown from './parts/HeaderCartDropdown';
import HeaderCartModals from './parts/HeaderCartModals';
import { getModuleInfo } from './parts/headerModuleTitles';

export function Header({ onToggleMobile }) {
  const router = useRouter();
  const pathname = usePathname();
  const { title: moduleTitle, subtitle: moduleSubtitle } = getModuleInfo(pathname);

  const handleQuickSale = () => {
    if (pathname === '/commercial/sales') {
      window.dispatchEvent(new CustomEvent('open-sales-modal'));
    } else {
      router.push('/commercial/sales?action=new');
    }
  };

  const cartState = useHeaderCart();
  const {
    lists, activeListId, activeList, cartCount, isSyncing,
    isCartOpen, setIsCartOpen, cartRef, isCreatingList,
    createList, setActiveList, removeFromCart, clearCart, proceedToPurchase,
    setEditNameValue, setEditNameModalOpen, setListToDelete, showNotification
  } = cartState;

  return (
    <header className={shellStyles.header}>
      {onToggleMobile && (
        <button
          type="button"
          onClick={onToggleMobile}
          className={shellStyles.mobileMenuBtn}
          aria-label="Abrir menú lateral"
          title="Menú"
        >
          <Menu size={20} strokeWidth={2} />
        </button>
      )}

      <div className={styles.moduleTitleGroup}>
        <h1 className={styles.moduleTitle}>{moduleTitle}</h1>
        {moduleSubtitle && <p className={styles.moduleSubtitle}>{moduleSubtitle}</p>}
      </div>

      <div className={shellStyles.scadaInstrumentation}>
        <div className={shellStyles.scadaStatus}>
          <span className={shellStyles.scadaStatusLed}></span>
          <span className={shellStyles.scadaStatusText}>SISTEMA EN LÍNEA</span>
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
          <button
            type="button"
            className={styles.activeListBadge}
            onClick={() => setIsCartOpen((prev) => !prev)}
            title={`Lista Activa: ${activeList.customName} (Clic para ver/cambiar)`}
            aria-label={`Lista de compra activa: ${activeList.customName}. Abrir menú`}
          >
            <Layers size={16} /> 
            <span className={styles.responsiveBtnText}>Lista: {activeList.customName}</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleQuickSale}
          className={styles.quickSaleBtn}
          title="Registrar nueva venta rápida"
          aria-label="Registrar nueva venta"
        >
          <PlusCircle size={14} /> 
          <span className={styles.responsiveBtnText}>Nueva Venta</span>
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

      <HeaderCartModals cartModals={cartState} />
    </header>
  );
}
