import { ipcRenderer } from 'electron'
import { IpcAction } from '../Spotlight/utils/constants'
import { FileData } from '../Types/data'

export const useLocalData = () => {
  const getLocalData = async () => {
    const prom = new Promise<FileData>((resolve) => {
      ipcRenderer.on(IpcAction.RECIEVE_LOCAL_DATA, (_event, arg: FileData) => {
        resolve(arg)
      })
    })

    ipcRenderer.send(IpcAction.GET_LOCAL_DATA)

    return prom
  }
  return { getLocalData }
}
