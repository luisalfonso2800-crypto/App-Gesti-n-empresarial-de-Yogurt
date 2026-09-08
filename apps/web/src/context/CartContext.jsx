/**
 * @file CartContext.jsx
 * @module context/CartContext
 * @description Contexto global para manejar el carrito temporal de compras (lista de insumos).
 * @responsibility Proveer estado reactivo unificado, aislar sessionStorage y exponer métodos de mutación.
 * @usedBy apps/web/src/app/layout.jsx, Header.jsx, useCartManager.js, usePurchaseData.js
 * @dependencies react
 */
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('selectedForPurchase');
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading cart from session:', e);
    }
  }, []);

  const updateCart = (newCart) => {
    setCartItems(newCart);
    try {
      sessionStorage.setItem('selectedForPurchase', JSON.stringify(newCart));
    } catch (e) {
      console.error('Error saving cart to session:', e);
    }
  };

  const addToCart = (item) => {
    const existing = cartItems.find(i => i.id === item.id);
    if (!existing) {
      updateCart([...cartItems, item]);
    }
  };

  const removeFromCart = (id) => {
    updateCart(cartItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    updateCart([]);
  };

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((acc, item) => acc + (Number(item.precioCompra || item.costoUnidadBase || item.precioEstimado || 0) * Number(item.cantidad || 1)), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
