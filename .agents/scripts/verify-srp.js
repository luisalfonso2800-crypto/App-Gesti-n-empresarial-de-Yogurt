/**
 * @file verify-srp.js
 * @module Scripts/Quality
 * @description Guardián automatizado de arquitectura modular, Single Responsibility Principle (SRP) y CSS Modules.
 * Audita estáticamente archivos en apps/web/src asegurando límites de líneas y ausencia de inline styles.
 * @rules
 * - Regla 1: page.jsx < 120 líneas (excluyendo dashboard/page.jsx).
 * - Regla 2: componentes .jsx < 150 líneas.
 * - Regla 3: cero ocurrencias de style={{.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../');
const WEB_SRC = path.join(ROOT_DIR, 'apps/web/src');

// Exclusión explícita solicitada
const EXCLUDED_FILES = [
  path.join(ROOT_DIR, 'apps/web/src/app/dashboard/page.jsx').replace(/\\/g, '/')
];

const LIMITS = {
  PAGE_MAX_LINES: 120,
  COMPONENT_MAX_LINES: 150
};

/**
 * Recorre recursivamente un directorio buscando archivos relevantes.
 * @param {string} dir 
 * @param {Function} callback 
 */
function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        walkDir(fullPath, callback);
      }
    } else if (entry.isFile()) {
      callback(fullPath, entry.name);
    }
  }
}

/**
 * Audita el codebase o conjunto de archivos.
 * En modo estricto o acotado por alcance de commits/PRs activos.
 */
function runAudit() {
  console.log('\n🔍 [SRP-GUARDIAN] Iniciando auditoría estática de SRP y CSS Modules en apps/web/src...\n');

  let auditedCount = 0;
  const violations = [];

  // Obtenemos los archivos modificados o creados activamente en el entorno de trabajo
  // para auditar con rigor la integridad del trabajo actual sin colapsar por deuda técnica no intervenida.
  let targetFiles = [];
  try {
    const cp = require('child_process');
    const diff = cp.execSync('git diff --name-only HEAD', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim().split('\n');
    const status = cp.execSync('git status --porcelain', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim().split('\n');
    const untracked = status.filter(l => l.startsWith('??')).map(l => l.substring(3).trim());
    const allCandidates = [...new Set([...diff, ...untracked])];

    targetFiles = allCandidates
      .map(f => f.trim().replace(/\\/g, '/'))
      .filter(f => f.startsWith('apps/web/src/') && f.endsWith('.jsx'));
  } catch (e) {
    targetFiles = [];
  }

  // Si se pasa el flag --all se audita todo apps/web/src; por defecto audita los archivos en alcance de trabajo
  const auditAll = process.argv.includes('--all');

  if (auditAll || targetFiles.length === 0) {
    walkDir(WEB_SRC, (filePath) => {
      const normalized = filePath.replace(/\\/g, '/');
      if (normalized.endsWith('.jsx')) {
        checkFile(normalized, violations);
        auditedCount++;
      }
    });
  } else {
    for (const relFile of targetFiles) {
      const fullPath = path.join(ROOT_DIR, relFile).replace(/\\/g, '/');
      if (fs.existsSync(fullPath)) {
        checkFile(fullPath, violations);
        auditedCount++;
      }
    }
  }

  // Reporte de resultados
  console.log(`📊 Archivos auditados: ${auditedCount}`);

  if (violations.length > 0) {
    console.error('\n❌ [SRP-GUARDIAN] Se encontraron violaciones en las reglas de SRP y CSS Modules:');
    violations.forEach(v => {
      const rel = path.relative(ROOT_DIR, v.file).replace(/\\/g, '/');
      console.error(`  - [${v.type}] ${rel}: ${v.message}`);
    });
    console.error(`\nTotal infracciones: ${violations.length}\n`);
    process.exit(1);
  } else {
    console.log('✔ Verificación SRP y CSS Modules exitosa (0 infracciones)\n');
    process.exit(0);
  }
}

/**
 * Valida un archivo individual contra las 3 reglas nucleares.
 */
function checkFile(filePath, violations) {
  const normalized = filePath.replace(/\\/g, '/');
  if (EXCLUDED_FILES.includes(normalized)) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').length;
  const isPage = normalized.endsWith('/page.jsx') || normalized.endsWith('\\page.jsx');

  // Regla 1: page.jsx no puede superar 120 líneas
  if (isPage && lines > LIMITS.PAGE_MAX_LINES) {
    violations.push({
      file: normalized,
      type: 'PAGE_OVERSIZED',
      message: `${lines} líneas (Límite máximo permitido: ${LIMITS.PAGE_MAX_LINES})`
    });
  }

  // Regla 2: cualquier otro componente .jsx no puede superar 150 líneas
  if (!isPage && lines > LIMITS.COMPONENT_MAX_LINES) {
    violations.push({
      file: normalized,
      type: 'COMPONENT_OVERSIZED',
      message: `${lines} líneas (Límite máximo permitido: ${LIMITS.COMPONENT_MAX_LINES})`
    });
  }

  // Regla 3: cero ocurrencias de style={{
  if (content.includes('style={{')) {
    violations.push({
      file: normalized,
      type: 'INLINE_STYLE_VETO',
      message: 'Contiene estilos en línea prohibidos (style={{ ... }}). Migrar a CSS Modules.'
    });
  }
}

runAudit();
