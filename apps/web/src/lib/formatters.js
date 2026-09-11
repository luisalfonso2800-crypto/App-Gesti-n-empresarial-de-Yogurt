/**
 * @file formatters.js
 * @module lib/formatters
 * @description Utilidades para formateo de valores numéricos y monedas
 * @responsibility Proveer funciones puras para dar formato y limpiar valores numéricos en la interfaz
 * @usedBy Componentes de interfaz de usuario y formularios
 * @dependencies Ninguna
 */

/**
 * Convierte cualquier valor válido a entero redondeado y retorna formato de moneda colombiana.
 * @param {string|number} val - El valor a formatear.
 * @returns {string} El valor formateado como moneda sin decimales, o cadena vacía si es null/undefined/''.
 */
export const formatCurrency = (val) => {
  if (val === null || val === undefined || val === '') return '';
  const numeric = Math.round(Number(val) || 0);
  if (isNaN(numeric)) return '';
  
  let formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numeric);
  
  // En algunos entornos el locale 'es-CO' agrega 'COP' o decimales errados. Aseguramos el string final sin comas decimales.
  // Esto previene resultados como $5.804.339,1
  // Limpiamos los espacios duros (NBSP) por espacios normales también
  return formatted.replace(/,\d+$/, '').replace(/\s/g, ' ');
};

/**
 * Remueve el símbolo $ y todos los puntos o comas dejando solo dígitos.
 * @param {string|number} str - La cadena a limpiar.
 * @returns {number} Número entero puro o 0 si está vacío.
 */
export const cleanCurrency = (str) => {
  if (str === null || str === undefined || str === '') return 0;
  if (typeof str === 'number') return Math.round(str);
  
  const cleaned = String(str).replace(/\D/g, '');
  if (cleaned === '') return 0;
  
  return parseInt(cleaned, 10);
};

/**
 * Remueve cualquier caracter que no sea dígito.
 * @param {string} str - La cadena a limpiar.
 * @returns {string} Cadena solo con dígitos.
 */
export const onlyNumbers = (str) => {
  if (str === null || str === undefined) return '';
  return String(str).replace(/\D/g, '');
};

/**
 * Traduce números enteros a texto legible (0 - 999.999.999).
 * @param {number} num - El número a traducir.
 * @returns {string} Texto en español con "PESOS M/CTE".
 */
export const numberToWordsSpanish = (num) => {
  if (num === null || num === undefined || num === '') return '';
  let n = parseInt(num, 10);
  if (isNaN(n)) return '';
  if (n === 0) return 'Cero pesos M/CTE';
  
  const unidades = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const decenas1X = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
  const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

  function traducirTresDigitos(n) {
    if (n === 0) return '';
    if (n === 100) return 'cien';
    
    let u = n % 10;
    let d = Math.floor((n / 10) % 10);
    let c = Math.floor(n / 100);
    
    let res = '';
    
    if (c > 0) res += centenas[c] + ' ';
    
    if (d === 1) {
      res += decenas1X[u] + ' ';
      return res.trim();
    } else if (d === 2) {
      if (u === 0) res += 'veinte ';
      else res += 'veinti' + (u === 1 ? 'ún' : unidades[u]) + ' ';
    } else if (d > 2) {
      res += decenas[d] + ' ';
      if (u > 0) res += 'y ' + (u === 1 ? 'un' : unidades[u]) + ' ';
    } else if (d === 0) {
      if (u === 1) res += 'un ';
      else if (u > 1) res += unidades[u] + ' ';
    }
    
    return res.trim();
  }
  
  let texto = '';
  let millones = Math.floor(n / 1000000);
  n = n % 1000000;
  let miles = Math.floor(n / 1000);
  let cientos = n % 1000;
  
  if (millones > 0) {
    if (millones === 1) texto += 'un millón ';
    else texto += traducirTresDigitos(millones) + ' millones ';
  }
  
  if (miles > 0) {
    if (miles === 1) texto += 'mil ';
    else texto += traducirTresDigitos(miles) + ' mil ';
  }
  
  if (cientos > 0) {
    texto += traducirTresDigitos(cientos);
  }
  
  texto = texto.trim();
  if (texto === '') return '';
  
  texto = texto.charAt(0).toUpperCase() + texto.slice(1);
  return texto + ' pesos M/CTE';
};
