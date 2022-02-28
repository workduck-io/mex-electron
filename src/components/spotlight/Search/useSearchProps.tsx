import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'

import { AppType } from '../../../hooks/useInitialize'
import BackIcon from '@iconify-icons/ph/caret-circle-left-light'
import { IpcAction } from '../../../data/IpcAction'
import LensIcon from '@iconify-icons/ph/magnifying-glass-bold'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { cleanString } from '../../../data/Defaults/idPrefixes'
import { getDeserializeSelectionToNodes } from '../../../utils/htmlDeserializer'
import { getPlateSelectors } from '@udecode/plate'
import { mog } from '../../../utils/lib/helper'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { useSaver } from '../../../editor/Components/Saver'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'

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
}

export const useSaveChanges = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const getContent = useContentStore((store) => store.getContent)
  const addILink = useDataStore((store) => store.addILink)
  const node = useSpotlightEditorStore((store) => store.node)
  const addRecent = useRecentsStore((store) => store.addRecent)
  const addInResearchNodes = useRecentsStore((store) => store.addInResearchNodes)
  const setNormalMode = useSpotlightAppStore((store) => store.setNormalMode)
  const preview = useSpotlightEditorStore((store) => store.preview)
  const { onSave } = useSaver()

  const { setSearch } = useSpotlightContext()

  const saveIt = (options?: SaveItProps) => {
    const isNodePresent = ilinks.find((ilink) => ilink.nodeid === node.nodeid)
    if (!isNodePresent) {
      addILink({ ilink: node.path, nodeid: node.nodeid })
    }

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

    setSearch({ value: '', type: CategoryType.search })
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
