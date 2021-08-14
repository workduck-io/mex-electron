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
import 'regenerator-runtime/runtime';
import { app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, shell, Tray } from 'electron';
import path from 'path';
import fs from 'fs';
import { DefaultFileData } from './Defaults/baseData';
import { getSaveLocation } from './Defaults/data';
import { FileData } from './Types/data';
import toggleWindow from './Spotlight/utils/toggleWindow';
import MenuBuilder from './Spotlight/utils/menu';
import { getSelectedText } from './Spotlight/utils/getSelectedText';
import { sanitizeHtml } from './Spotlight/utils/sanitizeHtml';

let tray;
let mexWindow: BrowserWindow | null;
let mainWindow: BrowserWindow | null = null;

let trayIconSrc = path.join(__dirname, '..', 'assets/icon.png');
if (process.platform === 'darwin') {
  trayIconSrc = path.join(__dirname, '..', 'assets/icons/icon16x16.png');
} else if (process.platform === 'win32') {
  trayIconSrc = path.join(__dirname, '..', 'assets/icon.ico');
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets') : path.join(__dirname, '../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

const MEX_WINDOW_OPTIONS = {
  width: 2560,
  height: 1660,
  show: false,
  icon: getAssetPath('icon.png'),
  webPreferences: {
    nodeIntegration: true,
  },
};

const SPOTLIGHT_WINDOW_OPTIONS = {
  show: false,
  width: 700,
  height: 400,
  center: false,
  alwaysOnTop: true,
  maximizable: false,
  resizable: false,
  frame: false,
  icon: getAssetPath('icon.png'),
  webPreferences: {
    nodeIntegration: true,
    nodeIntegrationInSubFrames: false,
    enableRemoteModule: true,
    contextIsolation: false,
  },
};

export const setFileData = (data: FileData) => {
  const dataPath = path.join(app.getPath('userData'), DataFileName);

  fs.writeFileSync(dataPath, JSON.stringify(data));
};

export const getFileData = () => {
  let fileData: FileData;

  const dataPath = path.join(app.getPath('userData'), DataFileName);

  if (fs.existsSync(dataPath)) {
    const stringData = fs.readFileSync(dataPath, 'utf-8');
    fileData = JSON.parse(stringData);
  } else {
    fs.writeFileSync(dataPath, JSON.stringify(DefaultFileData));
    fileData = DefaultFileData;
  }
  return fileData;
};

const createSpotLighWindow = () => {
  mainWindow = new BrowserWindow(SPOTLIGHT_WINDOW_OPTIONS);
  mainWindow.loadURL(`file://${__dirname}/Spotlight/index.html`);

  mainWindow.setAlwaysOnTop(true, 'floating', 1);
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('Main Window is not initialized!');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
};

const createMexWindow = () => {
  // MEX here
  mexWindow = new BrowserWindow(MEX_WINDOW_OPTIONS);
  mexWindow.loadURL(`file://${__dirname}/index.html`);

  mexWindow.webContents.on('did-finish-load', () => {
    if (!mexWindow) {
      throw new Error('"mexWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mexWindow.minimize();
    } else {
      mexWindow.show();
    }
  });

  const menuBuilder = new MenuBuilder(mexWindow);
  menuBuilder.buildMenu();

  mexWindow.on('closed', () => {
    mexWindow = null;
  });

  mexWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
};

const createWindow = () => {
  createMexWindow();
  createSpotLighWindow();
};

const sendToRenderer = (selection: any) => {
  const text = sanitizeHtml(selection.text);
  const metaSelection = {
    ...selection,
    text,
  };
  mainWindow?.webContents.send('selected-text', metaSelection);
};

const toggleMainWindow = (window, isSelection) => {
  if (!window) {
    createSpotLighWindow();
  } else {
    toggleWindow(window, isSelection);
  }
};

const handleSelectedText = async () => {
  const selection = await getSelectedText();
  if (selection.text && selection.metadata) {
    sendToRenderer(selection);
  }

  return selection.text && selection.metadata;
};

const syncFileData = () => {
  const fileData: FileData = getFileData();
  mainWindow?.webContents.send('recieve-local-data', fileData);
};

const handleToggleMainWindow = async () => {
  const isSelection = await handleSelectedText();
  toggleMainWindow(mainWindow, isSelection);
  syncFileData();
};

const closeWindow = () => {
  mainWindow?.close();
};

// app.on('browser-window-blur', () => {
//   app?.hide();
// });

ipcMain.on('close', closeWindow);

app
  .whenReady()
  .then(() => {
    // globalShortcut.register('Escape', closeWindow);
    globalShortcut.register('CommandOrControl+Shift+L', handleToggleMainWindow);

    const icon = nativeImage.createFromPath(trayIconSrc);

    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
      { label: 'Open Mex', type: 'radio' },
      { label: 'Toggle Spotlight search ', type: 'radio' },
      { label: 'Create new Mex', type: 'radio', checked: true },
      { label: 'Search', type: 'radio' },
    ]);

    tray.setToolTip('Mex');
    tray.setContextMenu(contextMenu);
    return 0;
  })
  .then(createWindow)
  .catch(console.log);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) createSpotLighWindow();
  if (mexWindow === null) createMexWindow();
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

  // console.log('Sending data', fileData, dataPath);

  event.sender.send('recieve-local-data', fileData);
});

ipcMain.on('set-local-data', (_event, arg) => {
  fs.writeFileSync(getSaveLocation(app), JSON.stringify(arg));
});

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
