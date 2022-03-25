import { ipcRenderer } from 'electron'
import { IpcAction } from '../data/IpcAction'
import { useAuthStore } from '../services/auth/useAuth'
import { AuthTokenData } from '../types/auth'
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

export const useTokenData = () => {
  const setTokenData = (tokenData: AuthTokenData) => {
    ipcRenderer.send(IpcAction.SET_TOKEN_DATA, tokenData)
  }
  const getTokenData = () => {
    const authenticated = useAuthStore.getState().authenticated
    if (authenticated) ipcRenderer.send(IpcAction.GET_TOKEN_DATA)
  }
  return { getTokenData, setTokenData }
}
