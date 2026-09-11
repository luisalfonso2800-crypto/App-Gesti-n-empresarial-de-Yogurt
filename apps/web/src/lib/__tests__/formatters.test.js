import { formatCurrency, cleanCurrency, numberToWordsSpanish, onlyNumbers } from '../formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formatea un valor con decimales redondeando al entero más cercano', () => {
      // Nota: El espacio entre $ y el número depende del locale 'es-CO' en distintos entornos. 
      // Si falla por el espacio ("$ 15.001" vs "$15.001"), ajustar Intl.NumberFormat o el test.
      const result = formatCurrency(15000.80);
      // Usando replace para remover espacios que el locale podría agregar (ej. non-breaking space)
      expect(result.replace(/\s/g, '')).toBe('$15.001');
    });

    it('retorna cadena vacía cuando se le pasa cadena vacía', () => {
      expect(formatCurrency('')).toBe('');
    });

    it('retorna cadena vacía cuando se le pasa null o undefined', () => {
      expect(formatCurrency(null)).toBe('');
      expect(formatCurrency(undefined)).toBe('');
    });

    it('retorna "$0" cuando se le pasa 0 explícito', () => {
      expect(formatCurrency(0)).toBe('$0');
    });
  });

  describe('cleanCurrency', () => {
    it('remueve el símbolo $ y puntos, retornando un número entero', () => {
      expect(cleanCurrency('$1.250.000')).toBe(1250000);
    });

    it('retorna 0 si está vacío', () => {
      expect(cleanCurrency('')).toBe(0);
      expect(cleanCurrency(null)).toBe(0);
      expect(cleanCurrency(undefined)).toBe(0);
    });

    it('funciona con números', () => {
      expect(cleanCurrency(500)).toBe(500);
      expect(cleanCurrency(500.8)).toBe(501);
    });
  });

  describe('onlyNumbers', () => {
    it('remueve caracteres no numéricos', () => {
      expect(onlyNumbers('123-abc.45')).toBe('12345');
    });

    it('retorna vacío si se le pasa vacío', () => {
      expect(onlyNumbers('')).toBe('');
      expect(onlyNumbers(null)).toBe('');
    });
  });

  describe('numberToWordsSpanish', () => {
    it('traduce números correctamente', () => {
      expect(numberToWordsSpanish(50000)).toBe('Cincuenta mil pesos M/CTE');
      expect(numberToWordsSpanish(1250)).toBe('Un mil doscientos cincuenta pesos M/CTE');
      expect(numberToWordsSpanish(0)).toBe('Cero pesos M/CTE');
    });
  });
});
