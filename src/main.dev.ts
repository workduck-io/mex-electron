/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import chokidar from 'chokidar';
import 'core-js/stable';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import fs from 'fs';
import path from 'path';
import { DefaultFileData } from './Defaults/baseData';
import { getSaveLocation } from './Defaults/data';
import MenuBuilder from './menu';
import { FileData } from './Types/data';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // mainWindow.webContents.openDevTools();

  // Send data back if modified externally
  chokidar
    .watch(getSaveLocation(app), {
      alwaysStat: true,
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        // pollInterval: 1000,
      },
    })
    .on('change', () => {
      // console.log({ path, event, c: count++ });
      let fileData: FileData;
      if (fs.existsSync(getSaveLocation(app))) {
        const stringData = fs.readFileSync(getSaveLocation(app), 'utf-8');
        fileData = JSON.parse(stringData);
      } else {
        return;
      }

      if (mainWindow) {
        mainWindow.webContents.send('sync-data', fileData);
      }
    });
};
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('get-local-data', event => {
  let fileData: FileData;

  if (fs.existsSync(getSaveLocation(app))) {
    const stringData = fs.readFileSync(getSaveLocation(app), 'utf-8');
    fileData = JSON.parse(stringData);
  } else {
    fs.writeFileSync(getSaveLocation(app), JSON.stringify(DefaultFileData));
    fileData = DefaultFileData;
  }
  event.sender.send('recieve-local-data', fileData);
});

ipcMain.on('set-local-data', (_event, arg) => {
  fs.writeFileSync(getSaveLocation(app), JSON.stringify(arg));
});
