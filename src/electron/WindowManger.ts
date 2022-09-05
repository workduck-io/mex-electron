import { BrowserWindow } from "electron";
import { createMexWindow } from "./utils/helper";

class WindowManger {
  private windowRef: Record<string, BrowserWindow>
  private static instance: WindowManger;

  private constructor() { }

  public static getInstance(): WindowManger {
    if (!WindowManger.instance) {
      WindowManger.instance = new WindowManger();
    }

    return WindowManger.instance;
  }

  public createWindow = (windowId: string): BrowserWindow => {
    let window = this.windowRef?.[windowId];
    if (window) return window

    window =  
  }

  public getWindow = (windowId: string): BrowserWindow => {
    const window = this.windowRef?.[windowId]

    return window
  }

}


export const windowManger = WindowManger.getInstance() 
