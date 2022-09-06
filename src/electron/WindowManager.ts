import { IS_DEV } from "@data/Defaults/dev_";
import { IpcAction } from "@data/IpcAction";
import { WindowOptions } from "../types/window.types";
import { BrowserWindow, shell } from "electron";
import { mog } from "@utils/lib/helper";

class WindowManager {
  private windowRef: Record<string, BrowserWindow>
  private static instance: WindowManager;

  private constructor() {
    mog("Window Manager constructor")
  }

  public static getInstance(): WindowManager {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }

    return WindowManager.instance;
  }

  public createWindow = (windowId: string, options: WindowOptions): BrowserWindow => {
    let window: BrowserWindow = this.windowRef?.[windowId];
    if (window) return window

    window = new BrowserWindow(options.windowConstructorOptions)
    this.windowRef = { ...this.windowRef, [windowId]: window }
    window.loadURL(options.loadURL.url, options.loadURL.options)

    window.webContents.on('did-finish-load', () => {
      if (!window) {
        throw new Error('Unable to initialize Browser window!')
      }

      if (options.onLoad) options.onLoad(window)

      if (options.onLoadShow) {
        window.focus()
        window.show()
      }
    })

    window.on('blur', () => {
      if (options?.onBlurHide) window.hide()
      window.webContents.send(IpcAction.WINDOW_BLUR)
    })

    window.on('close', () => {
      this.deleteWindow(windowId)
    })

    if (IS_DEV) window.webContents.openDevTools({ mode: 'right' })

    window.webContents?.on('new-window', (event, url) => {
      event.preventDefault()
      shell.openExternal(url)
    })

    if (options.alwaysOnTop) {
      window.setAlwaysOnTop(true, 'modal-panel', 100)
      window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
    }

    return window
  }

  public getWindow = (windowId: string): BrowserWindow => {
    const window = this.windowRef?.[windowId]

    return window
  }

  public sendToWindow = (windowId: string, ipcType: IpcAction, data?: any) => {
    const window = this.getWindow(windowId);

    if (window) window.webContents.send(ipcType, data)
  }

  public deleteWindow = (windowId: string) => {
    const window = this.getWindow(windowId);

    if (window) {
      const { [windowId]: ref, ...windows } = this.windowRef
      this.windowRef = windows

      window.close()
    }
  }

}

export const windowManager = WindowManager.getInstance() 
