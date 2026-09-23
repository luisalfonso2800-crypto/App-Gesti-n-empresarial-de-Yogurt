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

module.exports = {
  saveChainState,
  loadChainState,
  clearChainState,
};
