import { BrowserWindow, BrowserWindowConstructorOptions, LoadURLOptions } from "electron";

type LoadURLType = { url: string; options?: LoadURLOptions }

export type WindowOptions = {
  windowConstructorOptions: BrowserWindowConstructorOptions
  loadURL: LoadURLType
  alwaysOnTop?: boolean
  onLoad?: (window?: BrowserWindow) => void
  onClose?: (window?: BrowserWindow) => void
  onBlurHide?: boolean
  onLoadShow?: boolean
}
