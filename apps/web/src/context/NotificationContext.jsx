/**
 * @file NotificationContext.jsx
 * @module context/NotificationContext
 * @description Contexto global para sistema de notificaciones/toasts de la UI.
 * @responsibility Proveer la API estandarizada de notificaciones a través de la aplicación.
 * @usedBy apps/web/src/app/layout.jsx
 * @dependencies react
 */
'use client';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  }, []);

  useEffect(() => {
    const handleEvent = (e) => {
      if (e.detail) showNotification(e.detail.message, e.detail.type);
    };
    window.addEventListener('showNotification', handleEvent);
    return () => window.removeEventListener('showNotification', handleEvent);
  }, [showNotification]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px', 
          padding: '1rem', borderRadius: '4px', zIndex: 9999,
          backgroundColor: notification.type === 'error' ? '#f44336' : notification.type === 'warning' ? '#ff9800' : notification.type === 'success' ? '#4caf50' : '#2196f3',
          color: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
}
