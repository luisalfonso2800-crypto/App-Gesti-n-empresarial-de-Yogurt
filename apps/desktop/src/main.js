const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const http = require('http');

/**
 * @file main.js
 * @description Proceso principal de Electron para MANNÁ ERP (≤ 140 líneas).
 */
const GOT_LOCK = app.requestSingleInstanceLock();
if (!GOT_LOCK) {
  app.quit();
  process.exit(0);
}

let mainWindow = null;
const FRONTEND_URL = process.env.DESKTOP_WEB_URL || 'https://app-gesti-n-empresarial-de-yogurt-a.vercel.app';
const API_URL = process.env.DESKTOP_API_URL || 'https://api-production-ec9ee.up.railway.app/api/v1';

function checkService(url, timeoutMs = 1500) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: timeoutMs }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function waitForServices(maxAttempts = 20, delayMs = 1000) {
  for (let i = 0; i < maxAttempts; i++) {
    const [webReady, apiReady] = await Promise.all([
      checkService(FRONTEND_URL),
      checkService(`${API_URL}/health`).catch(() => false)
    ]);
    if (webReady) return true;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return false;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 1280,
    minHeight: 800,
    title: 'MANNÁ — Gestión Empresarial de Yogurt',
    backgroundColor: '#182622',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  Menu.setApplicationMenu(null);

  mainWindow.loadURL(FRONTEND_URL).catch(() => {
    mainWindow.loadURL(`data:text/html;charset=utf-8,
      <html><body style="background:#182622;color:#F6F4EB;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;">
        <h2>Conectando con MANNÁ ERP...</h2>
        <p>Asegúrate de que los servicios locales se encuentren activos.</p>
        <button onclick="location.reload()" style="padding:10px 20px;cursor:pointer;background:#8F704A;color:#fff;border:none;border-radius:4px;margin-top:16px;">Reintentar</button>
      </body></html>`);
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.whenReady().then(async () => {
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Liberación ordenada
});
