/**
 * @file PresentationModal.jsx
 * @module catalog/presentations/components
 * @description Modal de registro y actualización de presentaciones sin presets gráficos y con subida local pura.
 * @responsibility Presentar el formulario, gestionar carga/limpieza local de imagen, capturar unidades volumétricas y asegurar envío sanitizado mediante onSubmit.
 * @usedBy apps/web/src/app/catalog/presentations/page.jsx
 * @dependencies react, @/components/ui/SmartModal, @/components/ui/inputs/SmartSelect, @/lib/api-client, lucide-react
 */

import React, { useState, useRef, useEffect } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import { apiClient } from '@/lib/api-client';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import styles from '@/components/ui/SmartModal.module.css';

/**
 * Resuelve la URL de imagen a renderizar en el cliente.
 * Si es una ruta relativa (/uploads/...), antepone el host del backend para garantizar carga en pantalla.
 * @param {string} url - URL almacenada en el estado
 * @returns {string} URL formateada para el elemento <img>
 */
function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '') 
    : 'http://localhost:3001';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function PresentationModal({ 
  isOpen, onClose, isEditing, editingItem, formData, handleChange, handleSubmit, 
  isSubmitting, errorMsg 
}) {
  // Flag unificado de edición considerando prop explícito o fallback a editingItem
  const activeIsEditing = isEditing !== undefined ? Boolean(isEditing) : Boolean(editingItem);

  // Referencia para el input de archivo local oculto
  const fileInputRef = useRef(null);

  // Estados locales para subida de imagen y errores asíncronos
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [localBlobUrl, setLocalBlobUrl] = useState(null);

  // Liberar objeto URL creado con URL.createObjectURL para evitar fugas de memoria
  useEffect(() => {
    return () => {
      if (localBlobUrl) {
        URL.revokeObjectURL(localBlobUrl);
      }
    };
  }, [localBlobUrl]);

  // Limpiar estados locales cuando se abre o cierra el modal
  useEffect(() => {
    if (!isOpen) {
      if (localBlobUrl) {
        URL.revokeObjectURL(localBlobUrl);
        setLocalBlobUrl(null);
      }
      setUploadError('');
      setIsUploading(false);
    }
  }, [isOpen]);

  const isDirty = Boolean(formData.nombre || formData.tipoEnvase !== 'ENVASE');

  /**
   * Manejador de cambios en inputs de texto, forzando UPPERCASE en campos clave
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (['nombre', 'observaciones'].includes(name)) {
      handleChange({ target: { name, value: (value ?? '').toUpperCase() } });
    } else {
      handleChange(e);
    }
  };

  /**
   * Previene la inserción del signo negativo en inputs numéricos
   */
  const handleKeyDownNumeric = (e) => {
    if (e.key === '-') {
      e.preventDefault();
    }
  };

  /**
   * Dispara el selector nativo de archivos oculto
   */
  const handleTriggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Carga de archivo de imagen local, validación MIME/tamaño y envío vía FormData
   */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    // Validación estricta de tipo de archivo (solo imágenes)
    if (!file.type || !file.type.startsWith('image/')) {
      setUploadError('Formato inválido: solo se permiten archivos de imagen (PNG, JPG, WEBP).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validación de peso máximo: 3 MB
    if (file.size > 3 * 1024 * 1024) {
      setUploadError('El archivo excede el tamaño máximo permitido de 3 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Previsualización instantánea en la interfaz del usuario
    const blobPreview = URL.createObjectURL(file);
    if (localBlobUrl) {
      URL.revokeObjectURL(localBlobUrl);
    }
    setLocalBlobUrl(blobPreview);

    // Empaquetado multipart en FormData
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    setIsUploading(true);
    try {
      const response = await apiClient.post('/uploads/presentations', uploadFormData);
      const returnedUrl = response?.url || response?.data?.url;
      if (returnedUrl) {
        handleChange({ target: { name: 'imagenUrl', value: returnedUrl } });
      } else {
        throw new Error('Respuesta inválida del servidor al guardar la imagen.');
      }
    } catch (err) {
      // Extracción de texto plano seguro evitando objetos cíclicos
      const safeErrorMessage = err.response?.data?.message || err.message || 'Error al procesar la subida';
      setUploadError(typeof safeErrorMessage === 'object' ? JSON.stringify(safeErrorMessage) : String(safeErrorMessage));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  /**
   * Limpia o elimina la imagen activa del formulario y remueve el archivo en disco si aplica
   */
  const handleClearImage = async () => {
    const currentUrl = formData.imagenUrl;
    if (localBlobUrl) {
      URL.revokeObjectURL(localBlobUrl);
      setLocalBlobUrl(null);
    }
    setUploadError('');
    handleChange({ target: { name: 'imagenUrl', value: '' } });

    // Si la imagen era un archivo subido localmente en /uploads/presentations/, solicitar remoción física
    if (currentUrl && typeof currentUrl === 'string' && currentUrl.startsWith('/uploads/presentations/')) {
      try {
        await apiClient.delete('/uploads/presentations', {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: currentUrl }),
        });
      } catch (err) {
        console.warn('Aviso: no fue posible eliminar el archivo físico inmediatamente:', err.message);
      }
    }
  };

  /**
   * Envío del formulario sanitizado únicamente vía onSubmit del <form>
   */
  const onSubmit = (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    const cantOz = Math.max(0, Number(formData.cantidadOz) || 0);
    const cantMl = Math.max(0, Number(formData.cantidadMl) || 0);
    const cleanImg = (formData.imagenUrl || '').trim();

    handleSubmit(e, {
      ...formData,
      nombre: (formData.nombre || '').trim().toUpperCase(),
      observaciones: (formData.observaciones || '').trim().toUpperCase(),
      tipoEnvase: (formData.tipoEnvase || 'ENVASE').trim().toUpperCase(),
      cantidadOz: cantOz,
      cantidadMl: cantMl,
      imagenUrl: cleanImg || null,
      activo: Boolean(formData.activo)
    });
  };

  // Validación de campos obligatorios requeridos
  const missingFields = [];
  if (!formData.nombre?.trim()) missingFields.push('Nombre de la presentación');
  if (formData.cantidadOz === '' || formData.cantidadOz === null || formData.cantidadOz === undefined) missingFields.push('Cantidad en Oz');
  if (formData.cantidadMl === '' || formData.cantidadMl === null || formData.cantidadMl === undefined) missingFields.push('Cantidad en Ml');
  if (!formData.tipoEnvase) missingFields.push('Tipo de envase');

  const isSubmitDisabled = missingFields.length > 0 || isSubmitting || isUploading;
  const submitTitle = isUploading
    ? 'Espere mientras se completa la subida de la imagen...'
    : missingFields.length > 0
    ? `Complete los campos obligatorios: ${missingFields.join(', ')}`
    : 'Guardar cambios de la presentación';

  // Mensaje de error general a renderizar (prioriza error de subida o error del servidor)
  const activeError = uploadError || (
    typeof errorMsg === 'string' ? errorMsg : (errorMsg?.message || '')
  );

  // URL activa de previsualización
  const activeDisplayImage = localBlobUrl || resolveImageUrl(formData.imagenUrl);

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={activeIsEditing ? 'Editar Presentación' : 'Nueva Presentación'}
      isDirty={isDirty}
      isSubmitting={isSubmitting || isUploading}
    >
      {activeError && (
        <div style={{
          marginBottom: '1rem',
          backgroundColor: '#FEF2F2',
          border: '1px solid #F87171',
          color: '#B91C1C',
          padding: '0.6rem 0.85rem',
          borderRadius: '6px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚠️</span>
          <span>{activeError}</span>
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nombre de la Presentación <span style={{color: '#e11d48'}}>*</span></label>
          <input 
            name="nombre" 
            value={formData.nombre ?? ''} 
            onChange={handleInputChange} 
            placeholder="Ej: BOTELLA VIDRIO 250ML"
            className={styles.input}
            style={{ textTransform: 'uppercase' }}
            required 
          />
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Cantidad (Oz) <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="cantidadOz" 
              type="text"
              inputMode="decimal"
              value={formData.cantidadOz ? String(formData.cantidadOz).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''} 
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                handleChange({ target: { name: 'cantidadOz', value: raw } });
              }}
              onKeyDown={handleKeyDownNumeric}
              placeholder="0"
              className={styles.input}
              required 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Cantidad (Ml) <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="cantidadMl" 
              type="text"
              inputMode="decimal"
              value={formData.cantidadMl ? String(formData.cantidadMl).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''} 
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                handleChange({ target: { name: 'cantidadMl', value: raw } });
              }}
              onKeyDown={handleKeyDownNumeric}
              placeholder="0"
              className={styles.input}
              required 
            />
          </div>
        </div>

        <SmartSelect
          label="Tipo de Envase"
          name="tipoEnvase"
          value={formData.tipoEnvase ?? 'ENVASE'}
          onChange={handleChange}
          options={[
            { id: 'UNIDAD', label: 'UNIDAD' },
            { id: 'ENVASE', label: 'ENVASE' },
            { id: 'BOLSA', label: 'BOLSA' },
            { id: 'CAJA', label: 'CAJA' },
            { id: 'BULTO', label: 'BULTO' },
            { id: 'BOTELLA', label: 'BOTELLA' },
            { id: 'BIDÓN', label: 'BIDÓN' },
            { id: 'CANASTILLA', label: 'CANASTILLA' },
            { id: 'OTRO', label: 'OTRO' }
          ]}
          required
          placeholder="Seleccione envase"
        />

        {/* Sección de Imagen del Envase: Columna de Acciones + Visor Ampliado */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>IMAGEN DEL ENVASE</label>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
            {/* Columna Izquierda (Acciones) */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem', minWidth: '160px' }}>
              {/* Input file oculto para disparador estético */}
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />

              <button
                type="button"
                onClick={handleTriggerFileSelect}
                disabled={isUploading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: '#1C3F35',
                  backgroundColor: '#F3F4F6',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  cursor: isUploading ? 'not-allowed' : 'pointer'
                }}
              >
                <Upload size={15} />
                <span>{isUploading ? 'Subiendo...' : 'Subir Imagen Local'}</span>
              </button>

              {/* Botón de eliminar imagen visible exclusivamente si hay imagen activa */}
              {activeDisplayImage && (
                <button
                  type="button"
                  onClick={handleClearImage}
                  title="Eliminar imagen actual"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.6rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: '#DC2626',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={15} />
                  <span>Eliminar Imagen</span>
                </button>
              )}
            </div>

            {/* Columna Derecha (Visor Ampliado de Imagen) */}
            <div style={{
              flex: 1,
              height: '150px',
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: '0.5rem'
            }}>
              {activeDisplayImage ? (
                <img 
                  src={activeDisplayImage} 
                  alt="Previsualización del envase" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain' 
                  }} 
                />
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  color: '#9CA3AF'
                }}>
                  <ImageIcon size={28} strokeWidth={1.5} />
                  <span style={{ fontSize: '0.8rem' }}>Sin imagen asignada</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Observaciones</label>
          <input 
            name="observaciones" 
            value={formData.observaciones ?? ''} 
            onChange={handleInputChange} 
            className={styles.input}
            style={{ textTransform: 'uppercase' }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', cursor: 'pointer', userSelect: 'none' }}>
          <input 
            type="checkbox" 
            name="activo" 
            checked={Boolean(formData.activo)} 
            onChange={handleChange}
          />
          <span style={{ fontSize: '0.875rem', color: '#1c1917' }}>Presentación Activa</span>
        </label>

        {formData.nombre && (
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '0.76rem', color: '#166534' }}>
            <strong>Resumen:</strong> Se {activeIsEditing ? 'actualizará' : 'registrará'} la presentación <strong>{formData.nombre}</strong>{formData.tipoEnvase ? <> (envase de <strong>{formData.tipoEnvase.replace('_', ' ').toLowerCase()}</strong>)</> : null}, con capacidad de <strong>{formData.cantidadOz || 0} Oz</strong> ({formData.cantidadMl || 0} Ml).
          </div>
        )}

        <div className={styles.actions}>
          <button 
            type="button" 
            onClick={onClose}
            className={styles.btnCancel}
          >
            Cancelar
          </button>
          <SubmitButton 
            isSubmitting={isSubmitting || isUploading} 
            text={activeIsEditing ? 'Guardar Cambios' : 'Crear Presentación'}
            disabled={isSubmitDisabled}
            title={submitTitle}
            style={isSubmitDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          />
        </div>
      </form>
    </SmartModal>
  );
}
