import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const E2E_DIR = path.resolve(__dirname, '..');
const MAX_LINES = 150;
const MAX_TESTS = 15;
let hasErrors = false;

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.test-data') {
      scanDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.spec.js') && !entry.name.includes('legacy') && !entry.name.includes('.bak')) {
      validateFile(fullPath);
    }
  }
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relPath = path.relative(process.cwd(), filePath);
  
  if (lines.length > MAX_LINES) {
    console.error(`❌ [LÍMITE EXCEDIDO] ${relPath} tiene ${lines.length} líneas (Máximo permitido: ${MAX_LINES})`);
    hasErrors = true;
  }

  const testCount = (content.match(/test\s*\(/g) || []).length;
  if (testCount > MAX_TESTS) {
    console.error(`❌ [TESTS EXCEDIDOS] ${relPath} tiene ${testCount} tests (Máximo permitido: ${MAX_TESTS})`);
    hasErrors = true;
  }

  if (/for\s*\(\s*const\s+.*\s+of\s+validationCases/i.test(content)) {
    console.error(`❌ [ANTI-PATRÓN] ${relPath} utiliza bucles dinámicos sobre arrays de validación.`);
    hasErrors = true;
  }
}

console.log('🔍 Auditando cumplimiento de límites en tests E2E...');
scanDir(E2E_DIR);

if (hasErrors) {
  console.error('\n🚨 Falló la validación arquitectural. Corrige los archivos antes de continuar.');
  process.exit(1);
} else {
  console.log('\n✅ Todos los tests cumplen los estándares (<150 líneas, tests explícitos, sin bucles).');
  process.exit(0);
}
