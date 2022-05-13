import { useMentionStore } from '@store/useMentionStore'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../data/IpcAction'
import { useTokenStore } from '../services/auth/useTokens'
import { useEditorStore } from '../store/useEditorStore'
import { useInitialize } from './useInitialize'

// Save the data in the local file database
export const useSyncData = () => {
  const { update } = useInitialize()
  // This will load the current node directly and not push to the history.
  const loadNode = useEditorStore((state) => state.loadNode)
  const setIpc = () => {
    ipcRenderer.on(IpcAction.SYNC_DATA, (_event, arg) => {
      update(arg)
      loadNode(useEditorStore.getState().node)
    })
  }

  return { setIpc }
}

export const useRecieveTokens = () => {
  const setTokenData = useTokenStore((s) => s.setData)

  const setReceiveToken = () => {
    ipcRenderer.on(IpcAction.RECIEVE_TOKEN_DATA, (_event, arg) => {
      console.log('Recieved token data', arg)
      setTokenData(arg)
    })
  }

  return { setReceiveToken }
}

export const useRecieveMentions = () => {
  const initMentionData = useMentionStore((s) => s.initMentionData)

  const setReceiveMention = () => {
    ipcRenderer.on(IpcAction.RECIEVE_MENTION_DATA, (_event, arg) => {
      console.log('Recieved mention data', arg)
      initMentionData(arg.mentionable ?? [], arg.invitedUsers ?? [])
    })
  }

  return { setReceiveMention }
}
