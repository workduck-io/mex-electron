import { ipcRenderer } from 'electron'
import { AppType } from '../../Data/useInitialize'
import { IpcAction } from './constants'

export const appNotifierWindow = (action: IpcAction, from: AppType, data?: any) => {
  ipcRenderer.send(action, { from, data })
}
