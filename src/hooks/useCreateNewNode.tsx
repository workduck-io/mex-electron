import { useApi } from '@apis/useSaveApi'
import { IpcAction } from '@data/IpcAction'
import { getUntitledDraftKey, getUntitledKey } from '@editor/Components/SyncBlock/getNewBlockData'
import { appNotifierWindow } from '@electron/utils/notifiers'
import useDataStore from '@store/useDataStore'
import { useEditorStore } from '@store/useEditorStore'
import toast from 'react-hot-toast'
import { AppType } from './useInitialize'
import useLoad from './useLoad'
import { useNavigation } from './useNavigation'

export const useCreateNewNode = () => {
  const addILink = useDataStore((s) => s.addILink)
  const { push } = useNavigation()
  const { saveNewNodeAPI } = useApi()
  const { saveNodeName } = useLoad()

  const createNewNode = (parent?: string) => {
    const newNodeId = parent !== undefined ? getUntitledKey(parent) : getUntitledDraftKey()
    const node = addILink({ ilink: newNodeId, showAlert: false })

    if (node === undefined) {
      toast.error('The node clashed')
      return
    }

    saveNodeName(useEditorStore.getState().node.nodeid)
    saveNewNodeAPI(node.nodeid)
    push(node.nodeid, { withLoading: false })
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, node.nodeid)

    return node.nodeid
  }

  return { createNewNode }
}
