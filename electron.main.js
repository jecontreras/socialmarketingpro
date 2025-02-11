const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Cargar la aplicación Angular
  
    // **Modifica esta línea con el nombre correcto de la carpeta en dist/**
    const angularDistPath = path.join(__dirname, 'dist', 'index.html');

    mainWindow.loadURL(`file://${angularDistPath}`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Manejar la recarga en MacOS
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Cerrar la app cuando todas las ventanas están cerradas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// **Ejemplo de comunicación entre Angular y Electron**
ipcMain.on('ping', (event, arg) => {
  console.log(`Mensaje recibido desde Angular: ${arg}`);
  event.reply('pong', 'Hola desde Electron!');
});
