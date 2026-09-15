/**
 * @file ToolCalculatorTab.jsx
 * @module components/common/tools
 * @description Pestaña de calculadora aritmética compacta para planta (SRP < 150 líneas).
 * @responsibility Manejo de display, operaciones básicas (+, -, *, /), porcentaje y cálculo reactivo.
 * @usedBy apps/web/src/components/common/tools/PlantToolsModal.jsx
 * @dependencies react, ./plant-tools.module.css
 */
'use client';

import React, { useState } from 'react';
import styles from './plant-tools.module.css';

export function ToolCalculatorTab() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [overwrite, setOverwrite] = useState(false);

  const handleDigit = (digit) => {
    if (overwrite || display === '0') {
      setDisplay(digit);
      setOverwrite(false);
    } else {
      setDisplay(display.length < 12 ? display + digit : display);
    }
  };

  const handleDot = () => {
    if (overwrite) {
      setDisplay('0.');
      setOverwrite(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const calculate = (a, b, op) => {
    const numA = Number(a);
    const numB = Number(b);
    if (isNaN(numA) || isNaN(numB)) return '0';
    let result = 0;
    switch (op) {
      case '+': result = numA + numB; break;
      case '-': result = numA - numB; break;
      case '×': result = numA * numB; break;
      case '÷': result = numB === 0 ? 'Error' : numA / numB; break;
      default: return String(b);
    }
    if (result === 'Error') return 'Error';
    return String(Math.round(result * 100000) / 100000);
  };

  const handleOperation = (op) => {
    if (display === 'Error') return;
    if (operation && !overwrite) {
      const res = calculate(prevValue, display, operation);
      setDisplay(res);
      setPrevValue(res);
    } else {
      setPrevValue(display);
    }
    setOperation(op);
    setOverwrite(true);
  };

  const handleEqual = () => {
    if (!operation || prevValue === null || display === 'Error') return;
    const res = calculate(prevValue, display, operation);
    setDisplay(res);
    setPrevValue(null);
    setOperation(null);
    setOverwrite(true);
  };

  const handlePercent = () => {
    if (display === 'Error') return;
    const current = Number(display);
    if (isNaN(current)) return;
    const res = prevValue !== null ? (Number(prevValue) * current) / 100 : current / 100;
    setDisplay(String(Math.round(res * 100000) / 100000));
    setOverwrite(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setOverwrite(false);
  };

  return (
    <div>
      <div className={styles.calcDisplay}>
        <div className={styles.calcExpression}>
          {prevValue !== null && operation ? `${prevValue} ${operation}` : ''}
        </div>
        <div className={styles.calcValue}>{display}</div>
      </div>

      <div className={styles.calcGrid}>
        <button type="button" className={`${styles.calcBtn} ${styles.calcBtnAction}`} onClick={handleClear}>C</button>
        <button type="button" className={`${styles.calcBtn} ${styles.calcBtnOp}`} onClick={handlePercent}>%</button>
        <button type="button" className={`${styles.calcBtn} ${styles.calcBtnOp}`} onClick={() => handleOperation('÷')}>÷</button>
        <button type="button" className={`${styles.calcBtn} ${styles.calcBtnOp}`} onClick={() => handleOperation('×')}>×</button>

        <button type="button" className={styles.calcBtn} onClick={() => handleDigit('7')}>7</button>
        <button type="button" className={styles.calcBtn} onClick={() => handleDigit('8')}>8</button>
        <button type="button" className={styles.calcBtn} onClick={() => handleDigit('9')}>9</button>
        <button type="button" className={`${styles.calcBtn} ${styles.calcBtnOp}`} onClick={() => handleOperation('-')}>-</button>

        <button type="button" className={styles.calcBtn} onClick={() => handleDigit('4')}>4</button>
        <button type="button" className={styles.calcBtn} onClick={() => handleDigit('5')}>5</button>
        <button type="button" className={styles.calcBtn} onClick={() => handleDigit('6')}>6</button>
        <button type="button" className={`${styles.calcBtn} ${styles.calcBtnOp}`} onClick={() => handleOperation('+')}>+</button>

        <button type="button" className={styles.calcBtn} onClick={() => handleDigit('1')}>1</button>
        <button type="button" className={styles.calcBtn} onClick={() => handleDigit('2')}>2</button>
        <button type="button" className={styles.calcBtn} onClick={() => handleDigit('3')}>3</button>
        <button type="button" className={`${styles.calcBtn} ${styles.calcBtnEqual}`} onClick={handleEqual}>=</button>

        <button type="button" className={styles.calcBtn} onClick={() => handleDigit('0')}>0</button>
        <button type="button" className={styles.calcBtn} onClick={() => handleDigit('00')}>00</button>
        <button type="button" className={styles.calcBtn} onClick={handleDot}>.</button>
        <button type="button" className={styles.calcBtn} onClick={() => setDisplay(display.length > 1 ? display.slice(0, -1) : '0')}>⌫</button>
      </div>
    </div>
  );
}
