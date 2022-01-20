import { ipcRenderer } from 'electron'
import { IpcAction } from '../Spotlight/utils/constants'
import { FileData } from '../Types/data'

interface IndexAndFileData {
  fileData: FileData
  indexData: any // eslint-disable-line @typescript-eslint/no-explicit-any
}
export const useLocalData = () => {
  const getLocalData = async () => {
    const prom = new Promise<IndexAndFileData>((resolve) => {
      ipcRenderer.on(IpcAction.RECIEVE_LOCAL_DATA, (_event, arg: IndexAndFileData) => {
        resolve(arg)
      })
    })

    ipcRenderer.send(IpcAction.GET_LOCAL_DATA)

    return prom
  }
  return { getLocalData }
}
