const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('hyperGarage', {
  platform: process.platform,
  version: '1.0.0'
});
