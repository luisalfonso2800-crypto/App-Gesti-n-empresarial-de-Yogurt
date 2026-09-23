const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '.test-data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function saveChainState(moduleName, data) {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${moduleName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`[chain-state] Saved: ${filePath}`);
}

function loadChainState(moduleName) {
  const filePath = path.join(DATA_DIR, `${moduleName}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function clearChainState(moduleName) {
  const filePath = path.join(DATA_DIR, `${moduleName}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`[chain-state] Cleared: ${filePath}`);
  }
}

/**
 * Limpieza preventiva de entidades E2E_ antes o después de cada corrida.
 */
async function cleanupByPrefix(request, resource, prefix = 'E2E_') {
  try {
    const res = await request.get(`/api/v1/${resource}`).catch(() => null);
    if (!res || !res.ok()) return { deleted: 0, failed: 0 };
    
    const body = await res.json();
    const allItems = Array.isArray(body) ? body : (body.data || []);
    const items = allItems.filter(item => {
      const name = item.nombre || item.nombreInsumo || item.nombrePresentacion || item.name || '';
      return name.startsWith(prefix);
    });

    let deleted = 0;
    let failed = 0;
    for (const item of items) {
      const id = item.id || item.idInsumo || item.idPresentacion;
      if (!id) continue;
      const delRes = await request.delete(`/api/v1/${resource}/${id}`).catch(() => null);
      if (delRes && delRes.ok()) deleted++;
      else failed++;
    }
    return { deleted, failed };
  } catch {
    return { deleted: 0, failed: 0 };
  }
}

module.exports = {
  saveChainState,
  loadChainState,
  clearChainState,
  cleanupByPrefix,
};

