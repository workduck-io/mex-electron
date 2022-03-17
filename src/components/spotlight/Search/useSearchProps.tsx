import BackIcon from '@iconify/icons-ph/caret-circle-left-light'
import LensIcon from '@iconify/icons-ph/magnifying-glass-bold'
import { getPlateSelectors } from '@udecode/plate'
import { cleanString } from '../../../data/Defaults/idPrefixes'
import { IpcAction } from '../../../data/IpcAction'
import { useSaver } from '../../../editor/Components/Saver'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { AppType } from '../../../hooks/useInitialize'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { getDeserializeSelectionToNodes } from '../../../utils/htmlDeserializer'
import { convertEntryToRawText } from '../../../utils/search/parseData'

import { useSearch } from '../../../hooks/useSearch'

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
  const ilinks = useDataStore((store) => store.ilinks)
  const getContent = useContentStore((store) => store.getContent)
  const addILink = useDataStore((store) => store.addILink)
  const node = useSpotlightEditorStore((store) => store.node)
  const addRecent = useRecentsStore((store) => store.addRecent)
  const addInResearchNodes = useRecentsStore((store) => store.addInResearchNodes)
  const setNormalMode = useSpotlightAppStore((store) => store.setNormalMode)
  const setInput = useSpotlightAppStore((store) => store.setInput)
  const preview = useSpotlightEditorStore((store) => store.preview)
  const { onSave } = useSaver()

  const { setSearch } = useSpotlightContext()

  const { updateDocument } = useSearch()

  const saveIt = async (options?: SaveItProps) => {
    let editorContent = getPlateSelectors().value()

    if (options?.removeHighlight) {
      const deserializedContent = getDeserializeSelectionToNodes(preview, false)
      if (deserializedContent && preview.isSelection) {
        const previewContent = [{ children: deserializedContent }]
        const activeNodeContent = getContent(node.nodeid)?.content ?? []

        editorContent = [...activeNodeContent, ...previewContent]
      }
    }

    onSave(node, true, false, editorContent)

    if (options?.saveAndClose) appNotifierWindow(IpcAction.CLOSE_SPOTLIGHT, AppType.SPOTLIGHT, { hide: true })

    appNotifierWindow(IpcAction.SHOW_TOAST, AppType.SPOTLIGHT, {
      status: 'success',
      title: 'Saved successfully!',
      independent: options?.saveAndClose
    })

    const parsedDoc = convertEntryToRawText(node.nodeid, editorContent, node.title)
    await updateDocument('node', parsedDoc)

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
