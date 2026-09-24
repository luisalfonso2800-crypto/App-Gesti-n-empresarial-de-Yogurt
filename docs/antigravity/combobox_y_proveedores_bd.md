# ANÁLISIS DE COMBOBOX Y PROVEEDORES REALES EN BASE DE DATOS

Fecha: 24 de septiembre de 2026

---

## Bloque 1 — Código y Funcionamiento de `SupplierPriceCombobox.jsx`

Archivo: [`apps/web/src/app/catalog/supplier-prices/components/modal-parts/SupplierPriceCombobox.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/supplier-prices/components/modal-parts/SupplierPriceCombobox.jsx)

```jsx
/**
 * @file SupplierPriceCombobox.jsx
 * @module catalog/supplier-prices/components/modal-parts
 * @description Selector reactivo estilizado con búsqueda y alta rápida (+ Nuevo) para Insumos y Proveedores.
 * @responsibility Renderizar input de búsqueda interactiva, dropdown acoplado y botón de limpieza.
 * @usedBy apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '../supplier-price-modal.module.css';

export default function SupplierPriceCombobox({
  label,
  placeholder,
  value,
  items = [],
  onSelect,
  onClear,
  onAddNew,
  addNewLabel,
  disabled = false,
  required = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  const selectedItem = items.find(i => String(i.id) === String(value));

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = items.filter(item => {
    const text = `${item.nombre || ''} ${item.subtext || ''} ${item.categoria || ''}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.comboboxWrapper} ref={wrapperRef}>
      <div className={styles.comboboxHeader}>
        <label className={styles.comboboxLabel}>
          {label} {required && <span className={styles.requiredAsterisk}>*</span>}
        </label>
      </div>

      <div className={styles.inputWrapper}>
        <input
          type="text"
          disabled={disabled}
          placeholder={selectedItem ? selectedItem.nombre : placeholder}
          value={isOpen ? searchTerm : (selectedItem ? selectedItem.nombre : '')}
          onFocus={() => {
            if (!disabled) {
              setSearchTerm('');
              setIsOpen(true);
            }
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`${styles.comboboxInput} ${disabled ? styles.inputDisabled : ''}`}
        />
        {selectedItem && !isOpen && (
          <button
            type="button"
            className={styles.innerClearBtn}
            onClick={() => onClear()}
            title="Borrar selección"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && !disabled && (
        <div className={styles.comboboxDropdown}>
          {onAddNew && (
            <div
              className={styles.dropdownAction}
              onClick={() => {
                setIsOpen(false);
                onAddNew(searchTerm);
              }}
            >
              {addNewLabel}
            </div>
          )}

          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`${styles.dropdownItem} ${String(item.id) === String(value) ? styles.dropdownItemSelected : ''}`}
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
                setSearchTerm('');
              }}
            >
              <div className={styles.itemTitle}>{item.nombre}</div>
              {(item.subtext || item.categoria) && (
                <div className={styles.itemSubtitle}>{item.subtext || item.categoria}</div>
              )}
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className={styles.dropdownEmpty}>Sin coincidencias</div>
          )}
        </div>
      )}
    </div>
  );
}
```

### Respuestas a las preguntas sobre el filtro:
1. **¿El filtro matchea contra nombre solo, o contra nombre + subtext?**  
   Matchea contra una concatenación:  
   `const text = `${item.nombre || ''} ${item.subtext || ''} ${item.categoria || ''}`.toLowerCase();`  
   Por tanto, busca simultáneamente en el **nombre**, en el **subtext** (marca/contacto) y en la **categoría**.

2. **¿Es case-insensitive?**  
   **Sí**, convierte ambos (`text` y `searchTerm`) a minúsculas mediante `.toLowerCase()`.

3. **¿Es `includes` o `startsWith`?**  
   Utiliza **`includes()`**: `text.includes(searchTerm.toLowerCase())`. Puede coincidir con cualquier subsecuencia dentro de la cadena.

4. **¿Qué pasa si el filtro queda vacío (muestra "Sin coincidencias" o la lista completa)?**  
   Al ser `searchTerm = ''`, `text.includes('')` devuelve **`true`** para todos los elementos, por lo que **muestra la lista completa** de items disponibles.  
   Solo muestra `<div className={styles.dropdownEmpty}>Sin coincidencias</div>` cuando `filteredItems.length === 0` (ningún item contiene el término buscado).

---

## Bloque 2 — Los Proveedores Reales en la BD / Seeds

### 2.1 Proveedores canónicos de `seed-test-data.js`:
Ubicación: [`apps/api/prisma/seed-test-data.js`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/api/prisma/seed-test-data.js#L51-L56)
- **`Lácteos El Campo`** (NIT: `900123456-1`, teléfono: `3001234567`)
- **`Distribuidora Fruver`** (NIT: `900234567-2`, teléfono: `3002345678`)
- **`Plásticos y Empaques`** (NIT: `900345678-3`, teléfono: `3003456789`)
- **`Insumos Alimenticios`** (NIT: `900456789-4`, teléfono: `3004567890`)

### 2.2 Proveedores persistidos en la base de datos activa:
Consultados vía `GET http://localhost:4000/api/v1/suppliers`:
- `E2E_CHAIN_SUPPLIER_LACTEOS_1790272919035`
- `PROV_ORIGINAL_1790272929190`
- `PROV_NAME_DUP_1790272930647`
- `PROVEEDOR_OPC_1790272941086`
- `PROVEEDOR_NOCON_1790272943623`
- `PROVEEDOR_NOOBS_1790272946132`
- `PROVEEDOR TEST E2E 740252`
- Múltiples `E2E_TEST_SUPPLIER_*` activos.

> **Recomendación para los tests E2E:**  
> Como los nombres en BD contienen sufijos creados dinámicamente en los tests o cadenas E2E (ej. `E2E_CHAIN_SUPPLIER_LACTEOS_*`), tipear `"Lacteos"` o `"LACTEOS"` o `"PROVEEDOR"` en el combobox filtra con éxito y encuentra coincidencias activas inmediatamente.
