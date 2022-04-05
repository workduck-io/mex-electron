import BackIcon from '@iconify/icons-ph/caret-circle-left-light'
import LensIcon from '@iconify/icons-ph/magnifying-glass-bold'
import { ELEMENT_DEFAULT, getPlateSelectors } from '@udecode/plate'
import { cleanString, generateTempId } from '../../../data/Defaults/idPrefixes'
import { IpcAction } from '../../../data/IpcAction'
import { useSaver } from '../../../editor/Components/Saver'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { AppType } from '../../../hooks/useInitialize'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useContentStore } from '../../../store/useContentStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { getDeserializeSelectionToNodes } from '../../../utils/htmlDeserializer'

import { useSearch } from '../../../hooks/useSearch'
import useLoad from '../../../hooks/useLoad'
import { checkIfUntitledDraftNode } from '../../../utils/lib/strings'
import { getTitleFromContent } from '../../../utils/search/parseData'

export const useSearchProps = () => {
  const currentListItem = useSpotlightEditorStore((store) => store.currentListItem)
  const normalMode = useSpotlightAppStore((store) => store.normalMode)
  const node = useSpotlightEditorStore((store) => store.node)

  const icon = !normalMode ? BackIcon : LensIcon

  const path = node.path
  const placeholder = !normalMode ? cleanString(path) : '[[  for links or / for actions'

  return {
    icon: currentListItem?.icon ?? icon,
    placeholder: currentListItem?.description ?? placeholder
  }
}

type SaveItProps = {
  saveAndClose?: boolean
  removeHighlight?: boolean
  path?: string
}

export const useSaveChanges = () => {
  const getContent = useContentStore((store) => store.getContent)
  const node = useSpotlightEditorStore((store) => store.node)
  const addRecent = useRecentsStore((store) => store.addRecent)
  const addInResearchNodes = useRecentsStore((store) => store.addInResearchNodes)
  const setNormalMode = useSpotlightAppStore((store) => store.setNormalMode)
  const setInput = useSpotlightAppStore((store) => store.setInput)
  const preview = useSpotlightEditorStore((store) => store.preview)
  const { onSave } = useSaver()

  const { setSearch } = useSpotlightContext()

  const { saveNodeName } = useLoad()
  const { updateDocument } = useSearch()

  const saveIt = async (options?: SaveItProps) => {
    let editorContent = getPlateSelectors().value()
    const existingContent = getContent(node.nodeid)

    if (options?.removeHighlight) {
      const deserializedContent = getDeserializeSelectionToNodes(preview, false)
      if (deserializedContent && preview.isSelection) {
        const previewContent = deserializedContent
        const activeNodeContent = existingContent?.content ?? []

        editorContent = [...activeNodeContent, ...previewContent]
      }
    }

    // * Check if draft node

    const metadata = existingContent?.metadata ?? {}
    const isUntitledDraftNode = checkIfUntitledDraftNode(node.path)
    const isNewDraftNode = metadata?.createdAt === metadata?.updatedAt

    if (isNewDraftNode || isUntitledDraftNode) {
      const title = getTitleFromContent(editorContent)
      saveNodeName(node.nodeid, title)
    }

    onSave(node, true, false, editorContent)
    if (options?.saveAndClose) appNotifierWindow(IpcAction.CLOSE_SPOTLIGHT, AppType.SPOTLIGHT, { hide: true })

    appNotifierWindow(IpcAction.SHOW_TOAST, AppType.SPOTLIGHT, {
      status: 'success',
      title: 'Saved successfully!',
      independent: options?.saveAndClose
    })

    await updateDocument('node', node.nodeid, editorContent)

    setSearch({ value: '', type: CategoryType.search })
    setInput('')
    setNormalMode(true)

    // * Add this item in recents list of Mex
    addRecent(node.nodeid)
    addInResearchNodes(node.nodeid)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, { nodeid: node.nodeid })
  }

  return {
    saveIt
  }
}

export default useSearchProps
