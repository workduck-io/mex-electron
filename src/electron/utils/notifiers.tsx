import { ipcRenderer } from 'electron'

import { IpcAction } from '../../data/IpcAction'
import { AppType } from '../../hooks/useInitialize'

export const appNotifierWindow = (action: IpcAction, from: AppType, data?: any) => {
  ipcRenderer.send(action, { from, data })
}
