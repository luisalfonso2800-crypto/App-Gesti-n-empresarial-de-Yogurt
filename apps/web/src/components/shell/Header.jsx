'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './shell.module.css';
import { ShoppingCartIcon, TrashIcon } from '../ui/icons';
import { Button } from '../ui/Button';

export function Header() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const loadCart = () => {
    try {
      const stored = sessionStorage.getItem('selectedForPurchase');
      if (stored) {
        setCartItems(JSON.parse(stored));
      } else {
        setCartItems([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const removeFromCart = (id) => {
    const newCart = cartItems.filter(item => item.id !== id);
    setCartItems(newCart);
    sessionStorage.setItem('selectedForPurchase', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    setCartItems([]);
    sessionStorage.setItem('selectedForPurchase', JSON.stringify([]));
    window.dispatchEvent(new Event('cartUpdated'));
    setIsCartOpen(false);
  };

  const proceedToPurchase = () => {
    setIsCartOpen(false);
    router.push('/operations/purchases/new');
  };

  const cartCount = cartItems.length;

  return (
    <header className={styles.header}>
      <div className={styles.headerLinks}>
        <Link href="/" className={styles.headerLink}>Dashboard</Link>
        <Link href="/catalog/products" className={styles.headerLink}>Catálogos</Link>
        <Link href="/operations/purchases" className={styles.headerLink}>Operaciones</Link>
        <Link href="/commercial/sales" className={styles.headerLink}>Comercial</Link>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.cartContainer}>
          <button 
            className={`${styles.cartButton} ${cartCount > 0 ? styles.cartActive : ''}`}
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            <ShoppingCartIcon size={20} />
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>
          
          {isCartOpen && (
            <div className={styles.cartDropdown}>
              <div className={styles.cartHeader}>
                <h3>Lista de Compra</h3>
              </div>
              
              <div className={styles.cartBody}>
                {cartCount === 0 ? (
                  <p className={styles.cartEmpty}>No hay insumos seleccionados.</p>
                ) : (
                  <ul className={styles.cartList}>
                    {cartItems.map(item => (
                      <li key={item.id} className={styles.cartItem}>
                        <div className={styles.cartItemInfo}>
                          <span className={styles.cartItemName}>{item.nombreInsumo}</span>
                          <span className={styles.cartItemProv}>{item.nombreProveedor}</span>
                          <span className={styles.cartItemPrice}>${item.costoUnidadBase}</span>
                        </div>
                        <button 
                          className={styles.cartItemRemove} 
                          onClick={() => removeFromCart(item.id)}
                          title="Remover"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {cartCount > 0 && (
                <div className={styles.cartFooter}>
                  <Button variant="secondary" onClick={clearCart}>Vaciar lista</Button>
                  <Button variant="primary" onClick={proceedToPurchase}>Preparar Orden</Button>
                </div>
              )}
            </div>
          )}
        </div>
        <div>Bienvenido</div>
      </div>
    </header>
  );
}
