import { ipcRenderer } from 'electron'
import { IpcAction } from '../data/IpcAction'
import { FileData } from '../types/data'

export const useLocalData = () => {
  const getLocalData = async () => {
    const prom = new Promise<{ fileData: FileData }>((resolve) => {
      ipcRenderer.on(IpcAction.RECEIVE_LOCAL_DATA, (_event, arg: any) => {
        resolve(arg)
      })
    })

    ipcRenderer.send(IpcAction.GET_LOCAL_DATA)

    return prom
  }
  return { getLocalData }
}
