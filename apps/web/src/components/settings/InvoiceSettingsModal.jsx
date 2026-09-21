/**
 * @file InvoiceSettingsModal.jsx
 * @module components/settings
 * @description Modal de configuración administrativa de comprobantes de venta (SRP < 120 líneas).
 * @usedBy apps/web/src/components/shell/Sidebar.jsx
 */
'use client';

import React, { useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import SmartModal from '@/components/ui/SmartModal';
import modalStyles from '@/components/ui/SmartModal.module.css';
import { useInvoiceConfig } from '@/context/InvoiceConfigContext';
import styles from './invoice-settings-modal.module.css';

export default function InvoiceSettingsModal({ isOpen, onClose }) {
  const { config, updateConfig, resetConfig } = useInvoiceConfig();
  const [activeTab, setActiveTab] = useState('legal');
  const [localForm, setLocalForm] = useState(config);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen) setLocalForm(config);
  }, [isOpen, config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateConfig(localForm);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    setIsSubmitting(true);
    try {
      await resetConfig();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SmartModal isOpen={isOpen} onClose={onClose} title="Configuración de Comprobante" subtitle="Parámetros legales, contacto y lemas editoriales MANNÁ" isDirty={false}>
      <form onSubmit={handleSave} className={styles.container}>
        <div className={styles.tabsRow}>
          <button type="button" className={`${styles.tabBtn} ${activeTab === 'legal' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('legal')}>Identificación Legal</button>
          <button type="button" className={`${styles.tabBtn} ${activeTab === 'contact' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('contact')}>Canales de Contacto</button>
          <button type="button" className={`${styles.tabBtn} ${activeTab === 'motto' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('motto')}>Lemas y Textos</button>
        </div>

        {activeTab === 'legal' && (
          <div className={styles.sectionFields}>
            <div className={styles.fieldGroup}><label className={styles.fieldLabel}>Nombre Comercial</label><input className={styles.fieldInput} name="nombreComercial" value={localForm.nombreComercial || ''} onChange={handleChange} /></div>
            <div className={styles.fieldGroup}><label className={styles.fieldLabel}>NIT</label><input className={styles.fieldInput} name="nit" value={localForm.nit || ''} onChange={handleChange} /></div>
            <div className={`${styles.fieldGroup} ${styles.fullWidthCol}`}><label className={styles.fieldLabel}>Razón Social</label><input className={styles.fieldInput} name="razonSocial" value={localForm.razonSocial || ''} onChange={handleChange} /></div>
            <div className={`${styles.fieldGroup} ${styles.fullWidthCol}`}><label className={styles.fieldLabel}>Holding</label><input className={styles.fieldInput} name="holding" value={localForm.holding || ''} onChange={handleChange} /></div>
            <div className={`${styles.fieldGroup} ${styles.fullWidthCol}`}><label className={styles.fieldLabel}>Ciudad / Sedes</label><input className={styles.fieldInput} name="ciudad" value={localForm.ciudad || ''} onChange={handleChange} /></div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className={styles.sectionFields}>
            <div className={styles.fieldGroup}><label className={styles.fieldLabel}>Teléfono / WhatsApp</label><input className={styles.fieldInput} name="telefono" value={localForm.telefono || ''} onChange={handleChange} /></div>
            <div className={styles.fieldGroup}><label className={styles.fieldLabel}>Correo Electrónico</label><input className={styles.fieldInput} name="correo" value={localForm.correo || ''} onChange={handleChange} /></div>
            <div className={styles.fieldGroup}><label className={styles.fieldLabel}>Sitio Web</label><input className={styles.fieldInput} name="web" value={localForm.web || ''} onChange={handleChange} /></div>
            <div className={styles.fieldGroup}><label className={styles.fieldLabel}>Instagram</label><input className={styles.fieldInput} name="instagram" value={localForm.instagram || ''} onChange={handleChange} /></div>
            <div className={`${styles.fieldGroup} ${styles.fullWidthCol}`}><label className={styles.fieldLabel}>URL de Código QR</label><input className={styles.fieldInput} name="qrUrl" value={localForm.qrUrl || ''} onChange={handleChange} /></div>
          </div>
        )}

        {activeTab === 'motto' && (
          <div className={styles.sectionFields}>
            <div className={`${styles.fieldGroup} ${styles.fullWidthCol}`}><label className={styles.fieldLabel}>Lema de Cabecera</label><input className={styles.fieldInput} name="lemaCabecera" value={localForm.lemaCabecera || ''} onChange={handleChange} /></div>
            <div className={`${styles.fieldGroup} ${styles.fullWidthCol}`}><label className={styles.fieldLabel}>Cita Editorial Superior</label><textarea className={styles.fieldTextarea} name="citaEditorial" value={localForm.citaEditorial || ''} onChange={handleChange} /></div>
            <div className={`${styles.fieldGroup} ${styles.fullWidthCol}`}><label className={styles.fieldLabel}>Frase de Agradecimiento (Observaciones)</label><input className={styles.fieldInput} name="fraseProposito" value={localForm.fraseProposito || ''} onChange={handleChange} /></div>
            <div className={`${styles.fieldGroup} ${styles.fullWidthCol}`}><label className={styles.fieldLabel}>Pie de Página Final</label><input className={styles.fieldInput} name="piePagina" value={localForm.piePagina || ''} onChange={handleChange} /></div>
          </div>
        )}

        <div className={styles.actionsContainer}>
          <button type="button" onClick={handleReset} className={styles.btnReset}><RotateCcw size={14} /> Predeterminados</button>
          <div className={styles.rightActions}>
            <button type="button" onClick={onClose} className={modalStyles.btnCancel}>Cancelar</button>
            <button type="submit" className={styles.btnSave}><Save size={14} /> Guardar Configuración</button>
          </div>
        </div>
      </form>
    </SmartModal>
  );
}
