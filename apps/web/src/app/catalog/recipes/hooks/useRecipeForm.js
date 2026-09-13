/**
 * @file useRecipeForm.js
 * @module catalog/recipes/hooks
 * @description Estado y manejo del formulario/modal de recetas con soporte dual para insumos y productos WIP.
 * @responsibility Controlar la creación y edición de la receta técnica, gestionar etapas, detalles y costeo dinámico.
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export function useRecipeForm({ supplies = [], products = [], prices = [], onSaveSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    idProducto: '',
    rendimientoBase: 0,
    unidadRendimiento: 'Litros',
    observaciones: '',
    activo: true,
    etapas: []
  });

  const handleOpenEditor = async (item) => {
    if (item) {
      try {
        const fullItem = await apiClient.get(`/recipes/${item.id}/bom`);
        // Asegurar que cada detalle preserve su idInsumo o idProductoIntermedio intacto
        setFormData(fullItem);
      } catch (err) {
        alert('Error al cargar la receta: ' + err.message);
        return;
      }
    } else {
      setFormData({
        nombre: '',
        idProducto: '',
        rendimientoBase: 0,
        unidadRendimiento: 'Litros',
        observaciones: '',
        activo: true,
        etapas: []
      });
    }
    setIsEditing(true);
  };

  const handleCloseEditor = () => setIsEditing(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? (value === '' ? '' : parseFloat(value) || 0) : value
    }));
  };

  const addEtapa = () => {
    setFormData(prev => ({
      ...prev,
      etapas: [
        ...prev.etapas,
        {
          nombre: '',
          orden: prev.etapas.length + 1,
          tiempoMinimoMin: 0,
          tiempoEstandarMin: 0,
          tiempoMaximoMin: 0,
          tempMinimaGrados: 0,
          tempMaximaGrados: 0,
          instrucciones: '',
          activo: true,
          detalles: []
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
    newEtapas.forEach((e, i) => { e.orden = i + 1; });
    setFormData(prev => ({ ...prev, etapas: newEtapas }));
  };

  const addDetalle = (etapaIndex) => {
    const newEtapas = [...formData.etapas];
    newEtapas[etapaIndex].detalles.push({
      idInsumo: null,
      idProductoIntermedio: null,
      cantidadRequerida: 0,
      unidad: '',
      mermaPorcentaje: 0,
      esOpcional: false,
      grupoVariante: 'NINGUNO',
      tipoInsumo: 'BASE',
      activo: true
    });
    setFormData(prev => ({ ...prev, etapas: newEtapas }));
  };

  const updateDetalle = (etapaIndex, detalleIndex, field, value) => {
    const newEtapas = [...formData.etapas];
    const currentDet = newEtapas[etapaIndex].detalles[detalleIndex];
    let det = { ...currentDet };

    if (field === 'resourceSelector') {
      // Manejar el selector agrupado con prefijo 'INS:' o 'PROD:'
      if (!value) {
        det.idInsumo = null;
        det.idProductoIntermedio = null;
        det.unidad = '';
      } else if (value.startsWith('INS:')) {
        const insumoId = value.replace('INS:', '');
        const ins = supplies.find(s => s.id === insumoId);
        det.idInsumo = insumoId;
        det.idProductoIntermedio = null;
        det.unidad = ins ? ins.unidadBase : 'Unidades';
        if (det.tipoInsumo === 'INTERMEDIO_WIP') {
          det.tipoInsumo = 'BASE';
        }
      } else if (value.startsWith('PROD:')) {
        const prodId = value.replace('PROD:', '');
        det.idProductoIntermedio = prodId;
        det.idInsumo = null;
        det.unidad = 'Litros';
        det.tipoInsumo = 'INTERMEDIO_WIP';
      }
    } else {
      det[field] = value;
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
      // Sanitizar el payload para asegurar que cada ingrediente viaje con idInsumo / idProductoIntermedio normalizados
      const sanitizedPayload = {
        ...formData,
        rendimientoBase: Number(formData.rendimientoBase) || 0,
        etapas: formData.etapas?.map(etapa => ({
          ...etapa,
          orden: Number(etapa.orden) || 1,
          tiempoMinimoMin: Number(etapa.tiempoMinimoMin) || 0,
          tiempoEstandarMin: Number(etapa.tiempoEstandarMin) || 0,
          tiempoMaximoMin: Number(etapa.tiempoMaximoMin) || 0,
          tempMinimaGrados: Number(etapa.tempMinimaGrados) || 0,
          tempMaximaGrados: Number(etapa.tempMaximaGrados) || 0,
          detalles: etapa.detalles?.map(det => ({
            ...det,
            idInsumo: det.idInsumo || null,
            idProductoIntermedio: det.idProductoIntermedio || null,
            cantidadRequerida: Number(det.cantidadRequerida) || 0,
            mermaPorcentaje: Number(det.mermaPorcentaje) || 0,
            esOpcional: Boolean(det.esOpcional),
            tipoInsumo: det.tipoInsumo || (det.idProductoIntermedio ? 'INTERMEDIO_WIP' : 'BASE')
          }))
        }))
      };

      if (formData.id) {
        await apiClient.patch(`/recipes/${formData.id}`, sanitizedPayload);
      } else {
        await apiClient.post('/recipes', sanitizedPayload);
      }
      handleCloseEditor();
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  // Cálculo de costos dinámico con soporte dual: Insumos y Productos Intermedios / WIP
  const calculateCost = () => {
    let total = 0;
    // Mapa rápido de precios de insumos
    const priceMap = prices.reduce((acc, p) => ({ ...acc, [p.idInsumo]: p.costoUnidadBase }), {});

    formData.etapas?.forEach(etapa => {
      etapa.detalles?.forEach(det => {
        if (!det.esOpcional && det.activo !== false) {
          const req = parseFloat(det.cantidadRequerida) || 0;
          const merma = parseFloat(det.mermaPorcentaje) || 0;
          const totalReq = req * (1 + (merma / 100));

          let unitCost = 0;
          if (det.idProductoIntermedio) {
            // Resolver costo unitario para producto semielaborado (costoBase o costoPromedio del inventario)
            const prod = products.find(p => p.id === det.idProductoIntermedio);
            if (prod) {
              unitCost = Number(prod.costoBase ?? prod.inventario?.costoPromedio ?? prod.inventarioProducto?.costoPromedio ?? 0);
            }
          } else if (det.idInsumo) {
            // Resolver costo unitario para insumo desde precio proveedor o costoBase
            const insumoRecord = supplies.find(s => s.id === det.idInsumo);
            const priceFromMap = parseFloat(priceMap[det.idInsumo]);
            unitCost = !isNaN(priceFromMap) && priceFromMap > 0
              ? priceFromMap
              : Number(insumoRecord?.costoBase || 0);
          }

          total += (totalReq * unitCost);
        }
      });
    });

    return total;
  };

  return {
    isEditing,
    formData,
    handleOpenEditor,
    handleCloseEditor,
    handleChange,
    addEtapa,
    updateEtapa,
    removeEtapa,
    addDetalle,
    updateDetalle,
    removeDetalle,
    handleSubmit,
    calculateCost
  };
}
