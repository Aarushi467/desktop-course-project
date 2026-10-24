
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

  win.loadURL('http://localhost:5174');
}

ipcMain.handle('show-rules', async () => {
  const result = await dialog.showMessageBox({
    type: 'info',
    title: 'Exam Rules',
    message: 'Please read the exam rules carefully.',
    detail: 'Stay on the exam screen. Keep the camera enabled. Do not use external assistance.',
    buttons: ['Start Test', 'Cancel'],
    cancelId: 1,
  });

  return result.response;
});

app.whenReady().then(createWindow);
