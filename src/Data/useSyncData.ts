import { ipcRenderer } from 'electron'
import { useEditorStore } from '../Editor/Store/EditorStore'
import { useInitialize } from './useInitialize'

// Save the data in the local file database
export const useSyncData = () => {
  const { update } = useInitialize()
  const loadNode = useEditorStore((state) => state.loadNode)
  const setIpc = () => {
    ipcRenderer.on('sync-data', (_event, arg) => {
      update(arg)
      loadNode(useEditorStore.getState().node)
    })
  }
  return setIpc
}
