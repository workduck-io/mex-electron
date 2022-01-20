import { ipcRenderer } from 'electron'
import { AppType } from '../../hooks/useInitialize'
import { IpcAction } from '../../data/IpcAction'

export const appNotifierWindow = (action: IpcAction, from: AppType, data?: any) => {
  ipcRenderer.send(action, { from, data })
}
