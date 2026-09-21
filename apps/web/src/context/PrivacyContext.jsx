/**
 * @file PrivacyContext.jsx
 * @module context/PrivacyContext
 * @description Contexto global para modo privacidad y enmascaramiento de valores sensibles.
 * @responsibility Proveer reactividad para ocultar o mostrar cifras monetarias.
 * @usedBy apps/web/src/app/layout.jsx, Header.jsx, formatters.js
 * @dependencies react
 */
'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PrivacyContext = createContext({
  isPrivacyActive: false,
  togglePrivacyMode: () => {},
  maskValue: (v) => v,
});

const STORAGE_KEY = 'manna_privacy_mode';
const MASKED_STRING = '$ ••••••';

export function PrivacyProvider({ children }) {
  const [isPrivacyActive, setIsPrivacyActive] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsPrivacyActive(stored === 'true');
      }
    } catch {
      // Ignorar errores de acceso a localStorage en SSR o entornos restringidos
    }
  }, []);

  const togglePrivacyMode = useCallback(() => {
    setIsPrivacyActive((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Ignorar error al escribir en localStorage
      }
      return next;
    });
  }, []);

  const maskValue = useCallback((valorFormateado) => {
    if (isPrivacyActive) return MASKED_STRING;
    return valorFormateado;
  }, [isPrivacyActive]);

  return (
    <PrivacyContext.Provider value={{ isPrivacyActive, togglePrivacyMode, maskValue }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export const usePrivacy = () => useContext(PrivacyContext);
