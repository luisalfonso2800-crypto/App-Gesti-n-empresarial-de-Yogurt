#!/usr/bin/env node

/**
 * @file run-e2e-selector.js
 * @description Lanzador interactivo jerárquico de pruebas E2E.
 * Paso 1: Seleccionar Suites (con [X] o Enter para suite completa).
 * Paso 2: Seleccionar Categorías/Specs específicas dentro de las suites (si no marca ninguna, corre la suite completa).
 * Paso 3: Pregunta de previsualización del navegador (S/N).
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');

const E2E_DIR = path.join(__dirname, '../../apps/web/e2e');

// Escanear suites y sus archivos .spec.js correspondientes
function scanSuitesAndSpecs() {
  if (!fs.existsSync(E2E_DIR)) return {};
  const entries = fs.readdirSync(E2E_DIR, { withFileTypes: true });
  const data = {};

  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'helpers') {
      const suitePath = path.join(E2E_DIR, entry.name);
      const specs = fs.readdirSync(suitePath).filter(f => f.endsWith('.spec.js')).sort();
      if (specs.length > 0) {
        data[entry.name] = specs;
      }
    }
  }
  return data;
}

const suiteData = scanSuitesAndSpecs();
const suiteNames = Object.keys(suiteData).sort();

if (suiteNames.length === 0) {
  console.log('❌ No se encontraron suites en apps/web/e2e');
  process.exit(1);
}

// Estados de navegación
let step = 'SELECT_SUITES'; // 'SELECT_SUITES' -> 'SELECT_SPECS' -> 'ASK_HEADED' -> 'RUN'

// Selección de Suites
const selectedSuites = new Set();
let cursorSuiteIndex = 0;

// Selección de Specs
let allAvailableSpecs = []; // Array de { suite, file, label, id }
const selectedSpecs = new Set();
let cursorSpecIndex = 0;

function clearScreen() {
  process.stdout.write('\x1Bc');
}

function renderSuitesMenu() {
  clearScreen();
  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
  console.log('\x1b[1m\x1b[32m%s\x1b[0m', '  🧪 PASO 1: SELECCIONA LA(S) SUITE(S) A EVALUAR');
  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
  console.log('\x1b[90m%s\x1b[0m\n', '  [↑/↓]: Mover | [Espacio]: Marcar [X] | [A]: Todas | [Enter]: Continuar');

  suiteNames.forEach((suite, idx) => {
    const isCurrent = idx === cursorSuiteIndex;
    const isChecked = selectedSuites.has(suite);
    const box = isChecked ? '\x1b[32m[X]\x1b[0m' : '[ ]';
    const pointer = isCurrent ? '\x1b[33m❯\x1b[0m' : ' ';
    const count = suiteData[suite].length;
    const label = isCurrent 
      ? `\x1b[1m\x1b[33m${suite.toUpperCase()}\x1b[0m \x1b[90m(${count} categorías)\x1b[0m` 
      : `${suite.toUpperCase()} \x1b[90m(${count} categorías)\x1b[0m`;
    console.log(`  ${pointer} ${box} ${label}`);
  });

  console.log('\n\x1b[90m%s\x1b[0m', `  Suites seleccionadas: ${selectedSuites.size} de ${suiteNames.length}`);
}

function prepareSpecsList() {
  allAvailableSpecs = [];
  selectedSpecs.clear();
  cursorSpecIndex = 0;

  for (const suite of selectedSuites) {
    const specs = suiteData[suite] || [];
    specs.forEach(file => {
      allAvailableSpecs.push({
        suite,
        file,
        id: `e2e/${suite}/${file}`,
        label: `${suite} ➔ ${file.replace('.spec.js', '')}`
      });
    });
  }
}

function renderSpecsMenu() {
  clearScreen();
  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
  console.log('\x1b[1m\x1b[32m%s\x1b[0m', '  🎯 PASO 2: SELECCIONA CATEGORÍAS ESPECÍFICAS (OPCIONAL)');
  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
  console.log('\x1b[33m%s\x1b[0m', '  💡 Si NO seleccionas ninguna, ¡se ejecutará la suite COMPLETA!');
  console.log('\x1b[90m%s\x1b[0m\n', '  [↑/↓]: Mover | [Espacio]: Marcar [X] | [A]: Todas | [Enter]: Continuar');

  allAvailableSpecs.forEach((item, idx) => {
    const isCurrent = idx === cursorSpecIndex;
    const isChecked = selectedSpecs.has(item.id);
    const box = isChecked ? '\x1b[32m[X]\x1b[0m' : '[ ]';
    const pointer = isCurrent ? '\x1b[33m❯\x1b[0m' : ' ';
    const label = isCurrent ? `\x1b[1m\x1b[33m${item.label}\x1b[0m` : item.label;
    console.log(`  ${pointer} ${box} ${label}`);
  });

  const totalMsg = selectedSpecs.size === 0 
    ? '\x1b[32m[SUITE COMPLETA ACTIVA]\x1b[0m Todas las categorías serán evaluadas' 
    : `\x1b[33m${selectedSpecs.size}\x1b[0m categoría(s) específica(s) seleccionada(s)`;
  console.log('\n\x1b[90m  Estado:\x1b[0m %s', totalMsg);
}

function askHeadedMode() {
  clearScreen();
  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
  console.log('\x1b[1m\x1b[32m%s\x1b[0m', '  🖥️  PASO 3: CONFIGURACIÓN DE VISUALIZACIÓN DEL NAVEGADOR');
  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════\n');
  
  if (selectedSpecs.size === 0) {
    console.log(`  Objetivo: \x1b[32mSuite(s) Completa(s) -> ${Array.from(selectedSuites).join(', ')}\x1b[0m\n`);
  } else {
    console.log(`  Objetivo: \x1b[32m${selectedSpecs.size} archivo(s) específico(s)\x1b[0m\n`);
  }

  console.log('\x1b[1m  ¿Desea previsualizar el navegador en pantalla durante la prueba?\x1b[0m');
  console.log('  Presione \x1b[1m\x1b[32m[S]\x1b[0m para SÍ (Ventana visible) o \x1b[1m\x1b[31m[N]\x1b[0m para NO (Modo oculto ultra-rápido):');
}

function runTests(headed) {
  clearScreen();
  let targets = [];

  if (selectedSpecs.size > 0) {
    targets = Array.from(selectedSpecs);
  } else {
    targets = Array.from(selectedSuites).map(s => `e2e/${s}`);
  }

  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
  console.log('\x1b[1m\x1b[32m%s\x1b[0m', '  🚀 INICIANDO EJECUCIÓN E2E PLAYWRIGHT');
  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
  console.log(`  Objetivos:  \x1b[33m${targets.join(', ')}\x1b[0m`);
  console.log(`  Modo:       \x1b[33m${headed ? 'Visible (con ventana abierta)' : 'Headless (oculto en segundo plano)'}\x1b[0m`);
  console.log('\x1b[36m%s\x1b[0m\n', '───────────────────────────────────────────────────────────');

  const args = ['--filter', 'web', 'exec', 'playwright', 'test', ...targets];
  if (headed) {
    args.push('--headed');
  } else {
    args.push('--project=chromium');
  }

  const env = { ...process.env, CI: 'true' };

  const child = spawn(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', args, {
    stdio: 'inherit',
    env,
    cwd: path.join(__dirname, '../..'),
    shell: true
  });

  child.on('close', (code) => {
    console.log('\n\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
    if (code === 0) {
      console.log('\x1b[1m\x1b[32m%s\x1b[0m', '  ✔ PRUEBAS E2E COMPLETADAS SATISFACTORIAMENTE');
    } else {
      console.log('\x1b[1m\x1b[31m%s\x1b[0m', `  ❌ ALGUNAS PRUEBAS FALLARON (Código de salida: ${code})`);
    }
    console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════\n');
    process.exit(code);
  });
}

// Iniciar terminal en modo raw para captura de teclas directas
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

renderSuitesMenu();

process.stdin.on('keypress', (str, key) => {
  if (key && (key.ctrl && key.name === 'c')) {
    clearScreen();
    process.exit(0);
  }

  // PASO 1: SELECCIONAR SUITES
  if (step === 'SELECT_SUITES') {
    if (key.name === 'up') {
      cursorSuiteIndex = (cursorSuiteIndex - 1 + suiteNames.length) % suiteNames.length;
      renderSuitesMenu();
    } else if (key.name === 'down') {
      cursorSuiteIndex = (cursorSuiteIndex + 1) % suiteNames.length;
      renderSuitesMenu();
    } else if (key.name === 'space') {
      const suite = suiteNames[cursorSuiteIndex];
      if (selectedSuites.has(suite)) {
        selectedSuites.delete(suite);
      } else {
        selectedSuites.add(suite);
      }
      renderSuitesMenu();
    } else if (str && (str.toLowerCase() === 'a')) {
      if (selectedSuites.size === suiteNames.length) {
        selectedSuites.clear();
      } else {
        suiteNames.forEach(s => selectedSuites.add(s));
      }
      renderSuitesMenu();
    } else if (key.name === 'return') {
      if (selectedSuites.size === 0) {
        selectedSuites.add(suiteNames[cursorSuiteIndex]);
      }
      prepareSpecsList();
      step = 'SELECT_SPECS';
      renderSpecsMenu();
    }
  }

  // PASO 2: SELECCIONAR CATEGORÍAS / SPECS (OPCIONAL)
  else if (step === 'SELECT_SPECS') {
    if (key.name === 'up') {
      cursorSpecIndex = (cursorSpecIndex - 1 + allAvailableSpecs.length) % allAvailableSpecs.length;
      renderSpecsMenu();
    } else if (key.name === 'down') {
      cursorSpecIndex = (cursorSpecIndex + 1) % allAvailableSpecs.length;
      renderSpecsMenu();
    } else if (key.name === 'space') {
      const spec = allAvailableSpecs[cursorSpecIndex];
      if (selectedSpecs.has(spec.id)) {
        selectedSpecs.delete(spec.id);
      } else {
        selectedSpecs.add(spec.id);
      }
      renderSpecsMenu();
    } else if (str && (str.toLowerCase() === 'a')) {
      if (selectedSpecs.size === allAvailableSpecs.length) {
        selectedSpecs.clear();
      } else {
        allAvailableSpecs.forEach(s => selectedSpecs.add(s.id));
      }
      renderSpecsMenu();
    } else if (key.name === 'return') {
      step = 'ASK_HEADED';
      askHeadedMode();
    }
  }

  // PASO 3: NAVEGADOR VISIBLE U OCULTO (S/N)
  else if (step === 'ASK_HEADED') {
    if (str && (str.toLowerCase() === 's' || str.toLowerCase() === 'y')) {
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      step = 'RUN';
      runTests(true);
    } else if (str && (str.toLowerCase() === 'n')) {
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      step = 'RUN';
      runTests(false);
    }
  }
});
