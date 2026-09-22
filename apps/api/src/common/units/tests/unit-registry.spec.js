import { 
  normalizeUnit, 
  getMagnitude, 
  getFactor, 
  areCompatible, 
  convert, 
  convertVolumeToMass,
  MAGNITUDES 
} from '../unit-registry';
import { UnitConverter } from '../../utils/unit-converter';

describe('Unit Registry & Dimensions (Bloque 3 Remediación)', () => {
  describe('TEST-AUD-01: Compatibilidad dimensional misma magnitud (HAL-F1-06, HAL-F2-01)', () => {
    it('debe reconocer como compatibles unidades de masa en distintas escalas (kg vs g, g vs mg)', () => {
      expect(areCompatible('kg', 'g')).toBe(true);
      expect(areCompatible('g', 'mg')).toBe(true);
      expect(areCompatible('Kilogramos', 'gramos')).toBe(true);
      expect(UnitConverter.areUnitsCompatible('kg', 'g')).toBe(true);
    });

    it('debe reconocer como compatibles unidades de volumen en distintas escalas (l vs ml, oz vs ml)', () => {
      expect(areCompatible('l', 'ml')).toBe(true);
      expect(areCompatible('Litros', 'mililitros')).toBe(true);
      expect(areCompatible('oz', 'ml')).toBe(true);
      expect(areCompatible('onza', 'Litros')).toBe(true);
    });

    it('debe rechazar incompatibilidad dimensional entre masa y volumen', () => {
      expect(areCompatible('kg', 'l')).toBe(false);
      expect(areCompatible('g', 'ml')).toBe(false);
    });
  });

  describe('TEST-AUD-02: Conversión dimensional con sinónimos (HAL-F1-04, HAL-F1-05)', () => {
    it('debe convertir 1 "Litros" a 1000 "ml" exactamente', () => {
      expect(convert(1, 'Litros', 'ml')).toBe(1000);
      expect(UnitConverter.convert(1, 'Litros', 'ml')).toBe(1000);
    });

    it('debe convertir 2.5 "Kilogramos" a 2500 "g"', () => {
      expect(convert(2.5, 'Kilogramos', 'g')).toBe(2500);
      expect(convert(500, 'mg', 'g')).toBe(0.5);
    });
  });

  describe('TEST-AUD-EMERG-01: Factor canónico de Onza fluida (HAL-F1-01)', () => {
    it('debe convertir 1 "oz" a 29.5735 "ml" tanto en backend como alineado con frontend', () => {
      const ml = convert(1, 'oz', 'ml');
      expect(ml).toBeCloseTo(29.5735, 4);
    });
  });

  describe('TEST-AUD-17: Empaques nominales y clasificación de conteo (HAL-F2-04)', () => {
    it('debe clasificar VASO, TAPA, ETIQUETA, BOTELLA como magnitud CONTEO y ser compatibles entre sí o con UND', () => {
      expect(getMagnitude('VASO')).toBe(MAGNITUDES.CONTEO);
      expect(getMagnitude('TAPA')).toBe(MAGNITUDES.CONTEO);
      expect(getMagnitude('ETIQUETA')).toBe(MAGNITUDES.CONTEO);
      expect(areCompatible('VASO', 'UND')).toBe(true);
      expect(areCompatible('TAPA', 'UNIDAD')).toBe(true);
    });
  });

  describe('Densidad explícita masa ↔ volumen (HAL-F2-03)', () => {
    it('debe requerir densidad positiva para calcular masa a partir de volumen', () => {
      // 10 Litros de leche con densidad 1.032 kg/L = 10.32 kg
      const masaKg = convertVolumeToMass(10, 1.032);
      expect(masaKg).toBeCloseTo(10.32, 2);
    });

    it('debe lanzar error si la densidad es cero o negativa', () => {
      expect(() => convertVolumeToMass(10, 0)).toThrow(/Densidad/);
    });
  });
});
