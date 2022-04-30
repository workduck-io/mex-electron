import toast from 'react-hot-toast'
import { useApi } from '../apis/useSaveApi'
import { IpcAction } from '../data/IpcAction'
import { getUntitledDraftKey } from '../editor/Components/SyncBlock/getNewBlockData'
import { appNotifierWindow } from '../electron/utils/notifiers'
import useDataStore from '../store/useDataStore'
import { useEditorStore } from '../store/useEditorStore'
import { NavigationType, ROUTE_PATHS, useRouting } from '../views/routes/urls'
import { AppType } from './useInitialize'
import useLoad from './useLoad'
import { useNavigation } from './useNavigation'

export const useNewNote = () => {
  const addILink = useDataStore((store) => store.addILink)
  const { push } = useNavigation()
  const { saveNewNodeAPI } = useApi()
  const { goTo } = useRouting()
  const { saveNodeName } = useLoad()
  const createNewNote = () => {
    const newNodeId = getUntitledDraftKey()
    const node = addILink({ ilink: newNodeId, showAlert: false })

    if (node === undefined) {
      toast.error('The node clashed')
      return
    }

    saveNodeName(useEditorStore.getState().node.nodeid)
    saveNewNodeAPI(node.nodeid)
    push(node.nodeid, { withLoading: false })
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, node.nodeid)
    goTo(ROUTE_PATHS.node, NavigationType.push, node.nodeid)

    return node.nodeid
  }

  return { createNewNote }
}
