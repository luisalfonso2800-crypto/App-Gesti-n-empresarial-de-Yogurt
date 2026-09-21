/**
 * @file InvoiceConfigContext.jsx
 * @module context/InvoiceConfigContext
 * @description Contexto global y proveedor reactivo de configuración de comprobantes de venta con persistencia en API (PostgreSQL) y fallback en localStorage.
 */
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export const DEFAULT_INVOICE_CONFIG = {
  nombreComercial: 'MANNÀ',
  razonSocial: 'Alimentos Naturales S.A.S.',
  holding: 'GUERRERO PRADO HOLDING COMPANY FAMILY S.A.S.',
  nit: '901.234.567-8',
  ciudad: 'Santa Marta, Magdalena - Colombia',
  telefono: '+57 300 123 4567',
  correo: 'hola@manna.com.co',
  web: 'www.manna.com.co',
  instagram: '@manna.alimentos',
  qrUrl: 'https://manna.com.co',
  lemaCabecera: 'Semilla · Tiempo · Fruto',
  citaEditorial: 'Sabor que nace de lo natural. Tradición que mira al futuro.',
  fraseProposito: 'Gracias por ser parte de este propósito.',
  piePagina: 'SABOR QUE NACE DE LO NATURAL'
};

const STORAGE_KEY = 'manna_invoice_config';

const InvoiceConfigContext = createContext({
  config: DEFAULT_INVOICE_CONFIG,
  loading: false,
  updateConfig: async () => {},
  resetConfig: async () => {},
  fetchConfig: async () => {}
});

export function InvoiceConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_INVOICE_CONFIG);
  const [loading, setLoading] = useState(false);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/company-config');
      const data = res?.data || res;
      if (data && typeof data === 'object') {
        setConfig(prev => ({ ...prev, ...data }));
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
      }
    } catch {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setConfig(prev => ({ ...prev, ...JSON.parse(stored) }));
      } catch {}
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const updateConfig = async (newValues) => {
    try {
      const res = await apiClient.put('/company-config', newValues);
      const data = res?.data || res;
      const updated = { ...config, ...newValues, ...(typeof data === 'object' ? data : {}) };
      setConfig(updated);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    } catch (e) {
      console.error('Error al guardar configuración en API:', e);
      const fallback = { ...config, ...newValues };
      setConfig(fallback);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback)); } catch {}
      return fallback;
    }
  };

  const resetConfig = async () => {
    return updateConfig(DEFAULT_INVOICE_CONFIG);
  };

  return (
    <InvoiceConfigContext.Provider value={{ config, loading, updateConfig, resetConfig, fetchConfig }}>
      {children}
    </InvoiceConfigContext.Provider>
  );
}

export function useInvoiceConfig() {
  return useContext(InvoiceConfigContext);
}
