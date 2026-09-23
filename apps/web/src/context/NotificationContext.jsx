/**
 * @file NotificationContext.jsx
 * @module context/NotificationContext
 * @description Contexto global para sistema de notificaciones/toasts de la UI.
 * @responsibility Proveer la API estandarizada de notificaciones a través de la aplicación.
 *   Soporta pausa y reanudación del timer de auto-cierre para que el usuario pueda
 *   interactuar con botones dentro del toast sin que desaparezca.
 * @usedBy apps/web/src/app/layout.jsx
 * @dependencies react
 */
'use client';
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import styles from './notification.module.css';


const NotificationContext = createContext();

// Duración estándar del toast en milisegundos
const TOAST_DURATION = 4000;

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  // Ref al timer activo para poder cancelarlo y reanudar desde fuera
  const timerRef = useRef(null);

  // Tiempo restante cuando el usuario pausó el timer al hacer hover
  const remainingRef = useRef(TOAST_DURATION);

  // Timestamp del último arranque del timer (para calcular tiempo restante)
  const startedAtRef = useRef(null);

  /**
   * Inicia el timer de auto-cierre con el tiempo indicado.
   * @param {number} delay - Milisegundos antes de ocultar el toast
   */
  const startTimer = useCallback((delay) => {
    clearTimeout(timerRef.current);
    startedAtRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      setNotification(null);
      remainingRef.current = TOAST_DURATION;
    }, delay);
  }, []);

  /**
   * Muestra una notificación toast.
   * Cancela cualquier notificación previa y reinicia el timer completo.
   * @param {string|ReactNode} message - Contenido del toast (puede ser JSX)
   * @param {'info'|'success'|'error'|'warning'} type - Tipo visual del toast
   */
  const showNotification = useCallback((message, type = 'info') => {
    clearTimeout(timerRef.current);
    remainingRef.current = TOAST_DURATION;
    setNotification({ message, type });
    startTimer(TOAST_DURATION);
  }, [startTimer]);

  /**
   * Pausa el auto-cierre cuando el cursor entra al toast.
   * Calcula el tiempo restante para poder reanudarlo exactamente donde quedó.
   */
  const pauseNotification = useCallback(() => {
    if (timerRef.current && startedAtRef.current) {
      const elapsed = Date.now() - startedAtRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * Reanuda el auto-cierre cuando el cursor sale del toast.
   * Usa el tiempo restante calculado en pauseNotification.
   */
  const resumeNotification = useCallback(() => {
    if (notification && remainingRef.current > 0) {
      startTimer(remainingRef.current);
    }
  }, [notification, startTimer]);

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // Escuchar eventos globales de notificación (emitidos con window.dispatchEvent)
  useEffect(() => {
    const handleEvent = (e) => {
      if (e.detail) showNotification(e.detail.message, e.detail.type);
    };
    window.addEventListener('showNotification', handleEvent);
    return () => window.removeEventListener('showNotification', handleEvent);
  }, [showNotification]);

  // Mapa de clases CSS por tipo de notificación
  const TYPE_CLASS = {
    error: styles.toastError,
    warning: styles.toastWarning,
    success: styles.toastSuccess,
    info: styles.toastInfo,
  };

  return (
    <NotificationContext.Provider value={{ showNotification, pauseNotification, resumeNotification }}>
      {children}
      {notification && (
        <div
          onMouseEnter={pauseNotification}
          onMouseLeave={resumeNotification}
          className={`${styles.toast} ${TYPE_CLASS[notification.type] || styles.toastInfo}`}
        >
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
