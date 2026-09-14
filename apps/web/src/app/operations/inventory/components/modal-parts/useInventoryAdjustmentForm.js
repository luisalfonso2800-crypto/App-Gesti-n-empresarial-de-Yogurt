/**
 * @file useInventoryAdjustmentForm.js
 * @module operations/inventory/components/modal-parts
 * @description Hook de estado, carga asíncrona y validación Poka-Yoke para GlobalInventoryAdjustmentModal.
 * @responsibility Administrar ciclo de vida del formulario de ajuste, carga de catálogo de insumos y payload al API.
 * @usedBy apps/web/src/app/operations/inventory/components/GlobalInventoryAdjustmentModal.jsx
 * @dependencies react, @/lib/api-client, @/lib/formatters
 */
import { useState, useEffect } from 'react';
import { cleanCurrency } from '@/lib/formatters';
import { apiClient } from '@/lib/api-client';

export function useInventoryAdjustmentForm({ isOpen, onClose, onSuccess }) {
  const [supplies, setSupplies] = useState([]);
  const [loadingSupplies, setLoadingSupplies] = useState(false);
  
  const [idInsumo, setIdInsumo] = useState('');
  const [tipo, setTipo] = useState('CARGA_INICIAL');
  const [cantidad, setCantidad] = useState('');
  const [costoUnitario, setCostoUnitario] = useState('');
  const [motivo, setMotivo] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar insumos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      setLoadingSupplies(true);
      setErrorMessage('');
      apiClient.get('/supplies')
        .then((data) => {
          setSupplies(data || []);
        })
        .catch((err) => {
          console.error('Error al cargar insumos para ajuste global:', err);
          setErrorMessage('No fue posible cargar el catálogo de insumos.');
        })
        .finally(() => {
          setLoadingSupplies(false);
        });
    } else {
      setIdInsumo('');
      setTipo('CARGA_INICIAL');
      setCantidad('');
      setCostoUnitario('');
      setMotivo('');
      setErrorMessage('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const selectedInsumo = supplies.find(s => String(s.id) === String(idInsumo));
  const unidadBase = selectedInsumo?.unidadBase || 'Unidades';

  // Precargar costoBase sugerido si existe
  useEffect(() => {
    if (selectedInsumo && selectedInsumo.costoBase && !costoUnitario && (tipo === 'CARGA_INICIAL' || tipo === 'AJUSTE_POSITIVO')) {
      setCostoUnitario(String(Math.round(Number(selectedInsumo.costoBase))));
    }
  }, [selectedInsumo, tipo, costoUnitario]);

  const isCostRequired = tipo === 'CARGA_INICIAL' || tipo === 'AJUSTE_POSITIVO';
  const numericQty = Number(cantidad) || 0;
  const numericCost = cleanCurrency(costoUnitario);

  const missingFields = [];
  if (!idInsumo) missingFields.push('Insumo');
  if (numericQty <= 0) missingFields.push('Cantidad mayor a 0');
  if (isCostRequired && numericCost <= 0) missingFields.push('Costo unitario mayor a $ 0');
  if (['AJUSTE_NEGATIVO', 'MERMA_DESPERDICIO'].includes(tipo) && !motivo.trim()) {
    missingFields.push('Motivo obligatorio');
  }

  const isSubmitDisabled = missingFields.length > 0 || isSubmitting;
  const submitTitle = missingFields.length > 0
    ? `Complete los campos requeridos: ${missingFields.join(', ')}`
    : isSubmitting
    ? 'Guardando ajuste de inventario...'
    : 'Registrar ajuste en inventario';

  const isDirty = Boolean(idInsumo || cantidad || costoUnitario || motivo);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    setIsSubmitting(true);
    setErrorMessage('');

    let cantidadAjuste = Math.abs(numericQty);
    if (['AJUSTE_NEGATIVO', 'MERMA_DESPERDICIO'].includes(tipo)) {
      cantidadAjuste = -cantidadAjuste;
    }

    const payload = {
      idInsumo,
      cantidadAjuste,
      tipo,
      motivo: motivo.trim().toUpperCase() || (tipo === 'CARGA_INICIAL' ? 'SALDO INICIAL' : 'AJUSTE GLOBAL'),
      costoUnitario: isCostRequired ? numericCost : undefined
    };

    try {
      await apiClient.post('/inventory/adjustments', payload);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      const safeMsg = err.response?.data?.message || err.message || 'Error al procesar el ajuste';
      setErrorMessage(typeof safeMsg === 'object' ? JSON.stringify(safeMsg) : String(safeMsg));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    supplies,
    loadingSupplies,
    idInsumo,
    setIdInsumo,
    tipo,
    setTipo,
    cantidad,
    setCantidad,
    costoUnitario,
    setCostoUnitario,
    motivo,
    setMotivo,
    isSubmitting,
    errorMessage,
    selectedInsumo,
    unidadBase,
    isCostRequired,
    numericQty,
    numericCost,
    isDirty,
    isSubmitDisabled,
    submitTitle,
    handleSubmit
  };
}
