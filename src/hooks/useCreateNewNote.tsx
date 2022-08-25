import { getUntitledDraftKey, getUntitledKey } from '@editor/Components/SyncBlock/getNewBlockData'
import useDataStore from '@store/useDataStore'
import { useEditorStore } from '@store/useEditorStore'
import { NodeEditorContent } from '../types/Types'
import toast from 'react-hot-toast'
import { useHierarchy } from './useHierarchy'
import { useLinks } from './useLinks'
import useLoad from './useLoad'
import { useNavigation } from './useNavigation'
import { mog } from '@utils/lib/helper'
import { useLastOpened } from './useLastOpened'
import { useContentStore } from '@store/useContentStore'
import { useSnippets } from './useSnippets'

export type NewNoteOptions = {
  path?: string
  parent?: string
  noteId?: string
  noteContent?: NodeEditorContent
  openedNotePath?: string
  noRedirect?: boolean
}

export const useCreateNewNote = () => {
  const { push } = useNavigation()
  const addILink = useDataStore((s) => s.addILink)
  const checkValidILink = useDataStore((s) => s.checkValidILink)
  const getMetadata = useContentStore((s) => s.getMetadata)
  const { getSnippet } = useSnippets()

  const { saveNodeName } = useLoad()
  const { getParentILink } = useLinks()
  const { addInHierarchy } = useHierarchy()
  const { addLastOpened } = useLastOpened()

  const createNewNote = (options?: NewNoteOptions) => {
    const childNodepath = options?.parent !== undefined ? getUntitledKey(options?.parent) : getUntitledDraftKey()

    const newNotePath = options?.path || childNodepath

    const uniquePath = checkValidILink({
      notePath: newNotePath,
      openedNotePath: options?.openedNotePath,
      showAlert: false
    })

    const parentNoteId = getParentILink(uniquePath)?.nodeid

    const nodeMetadata = getMetadata(parentNoteId)
    const noteContent =
      options?.noteContent || (nodeMetadata?.templateID && getSnippet(nodeMetadata.templateID).content)

    const node = addILink({
      ilink: newNotePath,
      nodeid: options?.noteId,
      openedNotePath: options?.openedNotePath,
      showAlert: false
    })

    if (node === undefined) {
      toast.error('The node clashed')

      return undefined
    }

    mog('NODE CREATED IS HERE', { node })

    addInHierarchy({
      noteId: node.nodeid,
      notePath: node.path,
      parentNoteId,
      noteContent
    })
    saveNodeName(useEditorStore.getState().node.nodeid)

    addLastOpened(node.nodeid)

    if (!options?.noRedirect) {
      push(node.nodeid, { withLoading: false, fetch: false })
    }

    return node
  }

  return { createNewNote }
}
