
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', {
  showRulesDialog: () => ipcRenderer.invoke('show-rules'),
});
