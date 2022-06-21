import { useApi } from '@apis/useSaveApi'
import { IpcAction } from '@data/IpcAction'
import { getUntitledDraftKey, getUntitledKey } from '@editor/Components/SyncBlock/getNewBlockData'
import { appNotifierWindow } from '@electron/utils/notifiers'
import useDataStore from '@store/useDataStore'
import { useEditorStore } from '@store/useEditorStore'
import { mog } from '@utils/lib/helper'
import toast from 'react-hot-toast'
import { useHierarchy } from './useHierarchy'
import { AppType } from './useInitialize'
import useLoad from './useLoad'
import { useNavigation } from './useNavigation'

export const useCreateNewNode = () => {
  const { push } = useNavigation()
  const addILink = useDataStore((s) => s.addILink)
  const { addInHierachy } = useHierarchy()
  const { saveNodeName } = useLoad()

  const createNewNode = async (options?: {
    path?: string
    parent?: string
    openedNotePath?: string
    noRedirect?: boolean
  }) => {
    const childNodepath = options?.parent !== undefined ? getUntitledKey(options?.parent) : getUntitledDraftKey()

    const newNotePath = options?.path || childNodepath

    const noteInHierarychy = await addInHierachy(newNotePath, { openedNotePath: options?.openedNotePath })
    mog('NOTE IN heirarchy', { noteInHierarychy })

    const node = addILink({
      ilink: newNotePath,
      openedNotePath: options.openedNotePath,
      nodeid: noteInHierarychy?.nodeid,
      showAlert: false
    })

    if (node === undefined) {
      toast.error('The node clashed')

      return
    }

    saveNodeName(useEditorStore.getState().node.nodeid)

    if (!options?.noRedirect) {
      push(node.nodeid, { withLoading: false })
      appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, node.nodeid)
    }

    return node.nodeid
  }

  return { createNewNode }
}
