/**
 * @file useRecipeForm.js
 * @module catalog/recipes/hooks
 * @description Estado y manejo del modal/formulario de recetas (BOM, cálculos).
 * @responsibility Controlar la creación y edición de la receta técnica, gestionar etapas y detalles.
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export function useRecipeForm({ supplies, prices, onSaveSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', idProducto: '', rendimientoBase: 0, unidadRendimiento: 'Litros',
    observaciones: '', activo: true, etapas: []
  });

  const handleOpenEditor = async (item) => {
    if (item) {
      try {
        const fullItem = await apiClient.get(`/recipes/${item.id}/bom`);
        setFormData(fullItem);
      } catch (err) {
        alert('Error al cargar la receta: ' + err.message);
        return;
      }
    } else {
      setFormData({
        nombre: '', idProducto: '', rendimientoBase: 0, unidadRendimiento: 'Litros',
        observaciones: '', activo: true, etapas: []
      });
    }
    setIsEditing(true);
  };

  const handleCloseEditor = () => setIsEditing(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const addEtapa = () => {
    setFormData(prev => ({
      ...prev,
      etapas: [
        ...prev.etapas,
        {
          nombre: '', orden: prev.etapas.length + 1, tiempoMinimoMin: 0, tiempoEstandarMin: 0,
          tiempoMaximoMin: 0, tempMinimaGrados: 0, tempMaximaGrados: 0, instrucciones: '',
          activo: true, detalles: []
        }
      ]
    }));
  };

  const updateEtapa = (index, field, value) => {
    const newEtapas = [...formData.etapas];
    newEtapas[index] = { ...newEtapas[index], [field]: value };
    setFormData(prev => ({ ...prev, etapas: newEtapas }));
  };

  const removeEtapa = (index) => {
    const newEtapas = [...formData.etapas];
    newEtapas.splice(index, 1);
    newEtapas.forEach((e, i) => e.orden = i + 1);
    setFormData(prev => ({ ...prev, etapas: newEtapas }));
  };

  const addDetalle = (etapaIndex) => {
    const newEtapas = [...formData.etapas];
    newEtapas[etapaIndex].detalles.push({
      idInsumo: '', cantidadRequerida: 0, unidad: '', mermaPorcentaje: 0,
      esOpcional: false, grupoVariante: 'NINGUNO', tipoInsumo: 'BASE', activo: true
    });
    setFormData(prev => ({ ...prev, etapas: newEtapas }));
  };

  const updateDetalle = (etapaIndex, detalleIndex, field, value) => {
    const newEtapas = [...formData.etapas];
    const det = { ...newEtapas[etapaIndex].detalles[detalleIndex], [field]: value };
    if (field === 'idInsumo') {
      const ins = supplies.find(s => s.id === value);
      if (ins) det.unidad = ins.unidadBase;
    }
    newEtapas[etapaIndex].detalles[detalleIndex] = det;
    setFormData(prev => ({ ...prev, etapas: newEtapas }));
  };

  const removeDetalle = (etapaIndex, detalleIndex) => {
    const newEtapas = [...formData.etapas];
    newEtapas[etapaIndex].detalles.splice(detalleIndex, 1);
    setFormData(prev => ({ ...prev, etapas: newEtapas }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await apiClient.patch(`/recipes/${formData.id}`, formData);
      } else {
        await apiClient.post('/recipes', formData);
      }
      handleCloseEditor();
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  // Cálculo de costos, componente crítico comentado línea a línea
  const calculateCost = () => {
    let total = 0;
    // 1. Convertir el arreglo de precios en un diccionario de acceso rápido
    const priceMap = prices.reduce((acc, p) => ({ ...acc, [p.idInsumo]: p.costoUnidadBase }), {});
    
    // 2. Iterar sobre las etapas de la receta
    formData.etapas?.forEach(etapa => {
      // 3. Iterar sobre los detalles de cada etapa
      etapa.detalles?.forEach(det => {
        // 4. Buscar el precio del insumo en el mapa
        const cost = parseFloat(priceMap[det.idInsumo]) || 0;
        // 5. Determinar la cantidad neta requerida del insumo
        const req = parseFloat(det.cantidadRequerida) || 0;
        // 6. Obtener el porcentaje de merma esperado
        const merma = parseFloat(det.mermaPorcentaje) || 0;
        // 7. Calcular cantidad bruta incluyendo merma
        const totalReq = req * (1 + (merma / 100));
        // 8. Sumar al costo total solo si el insumo es obligatorio y está activo
        if (!det.esOpcional && det.activo !== false) {
            total += (totalReq * cost);
        }
      });
    });
    return total;
  };

  return {
    isEditing, formData, handleOpenEditor, handleCloseEditor,
    handleChange, addEtapa, updateEtapa, removeEtapa,
    addDetalle, updateDetalle, removeDetalle, handleSubmit, calculateCost
  };
}
