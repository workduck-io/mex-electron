import { ipcRenderer } from 'electron'
import { useEditorStore } from '../Editor/Store/EditorStore'
import { useInitialize } from './useInitialize'

// Save the data in the local file database
export const useSyncData = () => {
  const { update } = useInitialize()
  // This will load the current node directly and not push to the history.
  const loadNode = useEditorStore((state) => state.loadNode)
  const setIpc = () => {
    ipcRenderer.on('sync-data', (_event, arg) => {
      update(arg)
      loadNode(useEditorStore.getState().node)
    })
  }
  return { setIpc }
}
