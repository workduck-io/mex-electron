import { getUntitledDraftKey, getUntitledKey } from '@editor/Components/SyncBlock/getNewBlockData'
import useDataStore from '@store/useDataStore'
import { useEditorStore } from '@store/useEditorStore'
import { NodeEditorContent } from '../types/Types'
import toast from 'react-hot-toast'
import { useHierarchy } from './useHierarchy'
import { useLinks } from './useLinks'
import useLoad from './useLoad'
import { useNavigation } from './useNavigation'
import { useLastOpened } from './useLastOpened'
import { useContentStore } from '@store/useContentStore'
import { useSnippets } from './useSnippets'
import { useNamespaces } from './useNamespaces'
import { DRAFT_NODE, mog } from '@workduck-io/mex-utils'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'

export type NewNoteOptions = {
  path?: string
  parent?: string
  noteId?: string
  noteContent?: NodeEditorContent
  openedNotePath?: string
  noRedirect?: boolean
  // If provided added to that namespace
  // Otherwise default namespace
  namespace?: string
}

export const useCreateNewNote = () => {
  const { push } = useNavigation()
  const { goTo } = useRouting()
  const addILink = useDataStore((s) => s.addILink)
  const checkValidILink = useDataStore((s) => s.checkValidILink)
  const getMetadata = useContentStore((s) => s.getMetadata)
  const { getSnippet } = useSnippets()

  const { saveNodeName } = useLoad()
  const { getParentILink } = useLinks()
  const { addInHierarchy } = useHierarchy()
  const { addLastOpened } = useLastOpened()
  const { getDefaultNamespace } = useNamespaces()

  const createNewNote = (options?: NewNoteOptions) => {
    const childNodepath = options?.parent !== undefined ? getUntitledKey(options?.parent) : getUntitledDraftKey()
    const defaultNamespace = getDefaultNamespace()

    const namespacePath = options?.namespace !== defaultNamespace?.id ? DRAFT_NODE : childNodepath

    const newNotePath = options?.path || namespacePath

    const uniquePath = checkValidILink({
      notePath: newNotePath,
      openedNotePath: options?.openedNotePath,
      showAlert: false,
      namespace: options?.namespace
    })

    // Use namespace of parent if namespace not provided
    const parentNote = getParentILink(uniquePath)
    const parentNoteId = parentNote?.nodeid

    const nodeMetadata = getMetadata(parentNoteId)
    // Filling note content by template if nothing in options and notepath is not Drafts (it may cause problems with capture otherwise)
    const noteContent =
      options?.noteContent ||
      (nodeMetadata?.templateID && parentNote?.path !== 'Drafts' && getSnippet(nodeMetadata.templateID)?.content)

    // TODO: Get default namespace name here
    const namespace = options?.namespace ?? parentNote?.namespace ?? defaultNamespace?.id

    const node = addILink({
      ilink: newNotePath,
      nodeid: options?.noteId,
      openedNotePath: options?.openedNotePath,
      showAlert: false,
      namespace
    })

    if (node === undefined) {
      toast.error('The node clashed')

      return undefined
    }

    addInHierarchy({
      noteId: node.nodeid,
      notePath: node.path,
      parentNoteId,
      noteContent,
      namespace: node.namespace
    }).then(() => {
      saveNodeName(useEditorStore.getState().node.nodeid)

      addLastOpened(node.nodeid)
    })
    if (!options?.noRedirect) {
      push(node.nodeid, { withLoading: false, fetch: false })
      goTo(ROUTE_PATHS.node, NavigationType.push, node.nodeid)
    }
    return node
  }

  return { createNewNote }
}
