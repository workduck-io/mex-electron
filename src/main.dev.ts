/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import fs from 'fs';
import path from 'path';
import 'regenerator-runtime/runtime';
import { DefaultFileData } from './Defaults/baseData';
import { DataFileName } from './Defaults/data';
import MenuBuilder from './menu';
import { FileData } from './Types/data';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  // console.log('Installing Dev Tools', { installer, forceDownload, extensions });

  return installer
    .default(
      extensions.map(name => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    mainWindow.webContents.on('did-frame-finish-load', async () => {
      await installExtensions();
    });
  }

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // mainWindow.webContents.setWindow
  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Don't Respect the OSX convention of having the application in memory even
  // after all windows have been closed [:?]

  // if (process.platform !== 'darwin') {
  app.quit();
  // }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.on('get-local-data', event => {
  let fileData: FileData;

  const dataPath = path.join(app.getPath('userData'), DataFileName);

  if (fs.existsSync(dataPath)) {
    const stringData = fs.readFileSync(dataPath, 'utf-8');
    fileData = JSON.parse(stringData);
  } else {
    fs.writeFileSync(dataPath, JSON.stringify(DefaultFileData));
    fileData = DefaultFileData;
  }

  // console.log('Sending data', fileData, dataPath);

  event.sender.send('recieve-local-data', fileData);
});

ipcMain.on('set-local-data', (_event, arg) => {
  const dataPath = path.join(app.getPath('userData'), DataFileName);

  fs.writeFileSync(dataPath, JSON.stringify(arg));
});
