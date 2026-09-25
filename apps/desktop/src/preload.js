const { contextBridge } = require('electron');

/**
 * @file preload.js
 * @description Script de precarga seguro para el contenedor de escritorio MANNÁ.
 */
contextBridge.exposeInMainWorld('mannaDesktop', {
  isElectron: true,
  platform: process.platform,
  version: '1.0.0'
});
