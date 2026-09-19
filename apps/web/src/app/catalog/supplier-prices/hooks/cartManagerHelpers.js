/**
 * @file cartManagerHelpers.js
 * @module catalog/supplier-prices/hooks
 * @description Utilidades de normalización y búsqueda para el administrador de carrito en tarifas de proveedores.
 * @responsibility Transformar ítems crudos a modelo canónico de carrito y buscar duplicados en lista.
 * @usedBy apps/web/src/app/catalog/supplier-prices/hooks/useCartManager.jsx
 */

export function buildCartItem(item) {
  return {
    ...item,
    nombreInsumo: item.insumo?.Nombre_Insumo || item.insumo?.nombre || 'Insumo',
    nombreProveedor: item.proveedor?.Nombre_Proveedor || item.proveedor?.nombre || 'Proveedor',
    idInsumo: item.idInsumo,
    idProveedor: item.idProveedor,
    idPresentacion: item.idPresentacion,
    marca: item.insumo?.Marca || item.insumo?.marca || 'Sin marca',
    categoria: item.insumo?.Categoria || item.insumo?.categoria || 'Materia Prima',
    presentacionCompra: item.presentacionCompra || 'Paquete',
    contenidoBase: item.cantidadEquivalenteBase || item.cantidadPresentacion || 1,
    unidadBase: item.insumo?.Unidad_Base || item.insumo?.unidadBase || 'Unidades',
    unidadMedida: item.unidadPresentacion || item.insumo?.Unidad_Base || item.insumo?.unidadBase || 'Unidad',
    stockMinimo: item.insumo?.Stock_Minimo || item.insumo?.stockMinimo || 0,
    precioCompra: item.precioCompra,
    costoUnidadBase: item.costoUnidadBase,
    tieneIva: item.tieneIva !== undefined ? item.tieneIva : true,
    porcentajeIva: item.porcentajeIva !== undefined ? item.porcentajeIva : 19.0,
    precioIncluyeIva: item.precioIncluyeIva !== undefined ? item.precioIncluyeIva : true,
    costoBaseSinIva: item.costoBaseSinIva !== undefined ? item.costoBaseSinIva : 0,
  };
}

export function findExistingCartItem(cartItems, targetItem) {
  return cartItems.find(i => 
    (i.insumoId === targetItem.idInsumo || i.idInsumo === targetItem.idInsumo) &&
    (i.proveedorId === targetItem.idProveedor || i.idProveedor === targetItem.idProveedor) &&
    (i.presentacionId === targetItem.idPresentacion || i.idPresentacion === targetItem.idPresentacion || (!i.presentacionId && !targetItem.idPresentacion))
  );
}
