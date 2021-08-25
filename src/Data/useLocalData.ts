import { ipcRenderer } from 'electron'
import { FileData } from '../Types/data'

export const useLocalData = async () => {
  const prom = new Promise<FileData>((resolve) => {
    ipcRenderer.on('recieve-local-data', (_event, arg: FileData) => {
      resolve(arg)
    })
  })

  ipcRenderer.send('get-local-data')
  return prom
}
