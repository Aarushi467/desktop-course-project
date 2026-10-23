
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL('http://localhost:5173');
}

ipcMain.handle('show-rules', async () => {
  const result = await dialog.showMessageBox({
    type: 'info',
    title: 'Examination Rules',
    message: 'Before you begin',
    detail:
      'Ensure you are ready to take the examination. Starting the test will begin your exam session.',
    buttons: ['Start Test', 'Cancel'],
    defaultId: 0,
    cancelId: 1,
  });

  return result.response;
});

app.whenReady().then(createWindow);
