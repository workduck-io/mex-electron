import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  nativeImage,
  shell,
  Tray,
} from 'electron';
import path from 'path';
import toggleWindow from './utils/toggleWindow';
import MenuBuilder from './utils/menu';
import { getSelectedText } from './utils/getSelectedText';
import { sanitizeHtml } from './utils/sanitizeHtml';
import activeWindow from 'active-win';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
let tray;

let trayIconSrc = path.join(__dirname, '..', 'assets/icon.png');
if (process.platform === 'darwin') {
  trayIconSrc = path.join(__dirname, '..', 'assets/icons/icon16x16.png');
} else if (process.platform === 'win32') {
  trayIconSrc = path.join(__dirname, '..', 'assets/icon.ico');
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

const WINDOW_OPTIONS = {
  show: false,
  width: 700,
  height: 400,
  center: false,
  alwaysOnTop: true,
  useContentSize: true,
  maximizable: false,
  frame: false,
  icon: getAssetPath('icon.png'),
  webPreferences: {
    nodeIntegration: true,
    enableRemoteModule: true,
    contextIsolation: false,
  },
};

const createWindow = () => {
  mainWindow = new BrowserWindow(WINDOW_OPTIONS);
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

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

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
};

const sendToRenderer = (selection: any) => {
  const text = sanitizeHtml(selection.text);
  const metaSelection = {
    ...selection,
    text
  };
  mainWindow?.webContents.send('selected-text', metaSelection);
};

const toggleMainWindow = (window, isSelection) => {
  if (!window) {
    createWindow();
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

const handleToggleMainWindow = async () => {
  const isSelection = await handleSelectedText();
  toggleMainWindow(mainWindow, isSelection);
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
  if (mainWindow === null) createWindow();
});
