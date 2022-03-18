import { ipcRenderer } from 'electron'
import { IpcAction } from '../data/IpcAction'
import { FileData } from '../types/data'

export const useLocalData = () => {
  const getLocalData = async () => {
    const localData = await ipcRenderer.invoke(IpcAction.GET_LOCAL_DATA)

    const { fileData } = localData
    return fileData
  }
  return { getLocalData }
}
