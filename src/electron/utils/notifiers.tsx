import { AppType } from '@data/constants'
import { ipcRenderer } from 'electron'

import { IpcAction } from '../../data/IpcAction'

export const appNotifierWindow = (action: IpcAction, from: AppType, data?: any) => {
  ipcRenderer.send(action, { from, data })
}
