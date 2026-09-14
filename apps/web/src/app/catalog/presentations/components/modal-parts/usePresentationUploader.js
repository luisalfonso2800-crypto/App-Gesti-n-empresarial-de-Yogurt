/**
 * @file usePresentationUploader.js
 * @module catalog/presentations/hooks
 * @description Hook especializado para subida multipart y limpieza de imágenes de presentación.
 * @responsibility Gestionar blob preview, llamadas a /uploads/presentations y estados de carga.
 * @usedBy apps/web/src/app/catalog/presentations/components/PresentationModal.jsx
 * @dependencies react, @/lib/api-client
 */

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function usePresentationUploader({ isOpen, currentImageUrl, onImageChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [localBlobUrl, setLocalBlobUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (localBlobUrl) URL.revokeObjectURL(localBlobUrl);
    };
  }, [localBlobUrl]);

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

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    if (!file.type || !file.type.startsWith('image/')) {
      return setUploadError('Formato inválido: solo se permiten archivos de imagen (PNG, JPG, WEBP).');
    }
    if (file.size > 3 * 1024 * 1024) {
      return setUploadError('El archivo excede el tamaño máximo permitido de 3 MB.');
    }

    const blobPreview = URL.createObjectURL(file);
    if (localBlobUrl) URL.revokeObjectURL(localBlobUrl);
    setLocalBlobUrl(blobPreview);

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    setIsUploading(true);
    try {
      const response = await apiClient.post('/uploads/presentations', uploadFormData);
      const returnedUrl = response?.url || response?.data?.url;
      if (returnedUrl) onImageChange(returnedUrl);
      else throw new Error('Respuesta inválida del servidor al guardar la imagen.');
    } catch (err) {
      const safeErr = err.response?.data?.message || err.message || 'Error al procesar la subida';
      setUploadError(typeof safeErr === 'object' ? JSON.stringify(safeErr) : String(safeErr));
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearImage = async () => {
    if (localBlobUrl) {
      URL.revokeObjectURL(localBlobUrl);
      setLocalBlobUrl(null);
    }
    setUploadError('');
    onImageChange('');
    if (currentImageUrl && typeof currentImageUrl === 'string' && currentImageUrl.startsWith('/uploads/presentations/')) {
      try {
        await apiClient.delete('/uploads/presentations', {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: currentImageUrl })
        });
      } catch (err) {
        console.warn('Aviso: no fue posible eliminar el archivo físico:', err.message);
      }
    }
  };

  return {
    isUploading,
    uploadError,
    localBlobUrl,
    handleFileChange,
    handleClearImage
  };
}
