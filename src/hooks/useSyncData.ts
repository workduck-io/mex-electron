import { ipcRenderer } from 'electron'
import { IpcAction } from '../Spotlight/utils/constants'
import { useEditorStore } from '../editor/Store/EditorStore'
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
