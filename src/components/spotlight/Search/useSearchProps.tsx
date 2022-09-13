import { SEPARATOR } from '@components/mex/Sidebar/treeUtils'
import { defaultContent } from '@data/Defaults/baseData'
import { getBlockMetadata } from '@editor/Actions/useEditorBlockSelection'
import { getLatestContent } from '@hooks/useEditorBuffer'
import { getPlateSelectors } from '@udecode/plate'
import { convertValueToTasks } from '@utils/lib/contentConvertTask'

import { cleanString } from '../../../data/Defaults/idPrefixes'
import { IpcAction } from '../../../data/IpcAction'
import { useSaver } from '../../../editor/Components/Saver'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import useLoad from '../../../hooks/useLoad'
import { useSearch } from '../../../hooks/useSearch'
import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useContentStore } from '../../../store/useContentStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { AppType } from '../../../types/Types'
import { getDeserializeSelectionToNodes } from '../../../utils/htmlDeserializer'
import { checkIfUntitledDraftNode } from '../../../utils/lib/strings'
import { getTitleFromContent } from '../../../utils/search/parseData'
import { useRouting } from '../../../views/routes/urls'

export const useSearchProps = () => {
  const currentListItem = useSpotlightEditorStore((store) => store.currentListItem)
  const normalMode = useSpotlightAppStore((store) => store.normalMode)
  const node = useSpotlightEditorStore((store) => store.node)

  const { location } = useRouting()
  const { activeItem } = useSpotlightContext()
  const isActionSearch = location.pathname === '/action' || location.pathname === '/action/view'

  if (isActionSearch) {
    return {
      icon: activeItem?.item?.icon,
      placeholder: activeItem?.item?.description
    }
  }

  const icon = !normalMode ? 'ph:caret-circle-left-light' : 'ph:magnifying-glass-bold'

  const path = node.path
  const placeholder = !normalMode ? cleanString(path) : '[[  for Backlinks or / for actions'

  return {
    icon: currentListItem?.icon ?? icon,
    placeholder: currentListItem?.description ?? placeholder
  }
}

type SaveItProps = {
  beforeSave?: (props: any) => void
  saveAndClose?: boolean
  removeHighlight?: boolean
  isNewTask?: boolean
  path?: string
  notify?: boolean
  // Will not save on blur if false
  // defaults to true if absent
  saveAfterBlur?: boolean
  saveToFile?: boolean
}

export const useSaveChanges = () => {
  const getContent = useContentStore((store) => store.getContent)

  const addRecent = useRecentsStore((store) => store.addRecent)
  const addInResearchNodes = useRecentsStore((store) => store.addInResearchNodes)
  const setNormalMode = useSpotlightAppStore((store) => store.setNormalMode)
  const setInput = useSpotlightAppStore((store) => store.setInput)
  const setSaveAfterBlur = useSpotlightAppStore((store) => store.setSaveAfterBlur)
  const preview = useSpotlightEditorStore((store) => store.preview)

  const { setSearch } = useSpotlightContext()

  const { onSave } = useSaver()
  const { saveNodeName } = useLoad()
  const { updateDocument } = useSearch()

  const saveIt = async (options?: SaveItProps) => {
    const node = useSpotlightEditorStore.getState().node

    let editorContent = getPlateSelectors().value()
    const existingContent = getContent(node.nodeid)
    const latestContent = getLatestContent(node.nodeid)

    if (options?.removeHighlight) {
      const deserializedContent = getDeserializeSelectionToNodes(preview, false)
      if (deserializedContent && preview.isSelection) {
        const lastBlock = deserializedContent.at(-1)
        const previewContent = [
          ...deserializedContent.slice(0, deserializedContent.length - 1),
          { ...lastBlock, blockMeta: getBlockMetadata(preview.metadata?.url) }
        ]
        const activeNodeContent = latestContent ?? defaultContent.content

        if (options?.isNewTask) {
          const convertedContent = convertValueToTasks(previewContent)
          editorContent = [...activeNodeContent, ...convertedContent]
        } else {
          editorContent = [...activeNodeContent, ...previewContent]
        }
      }
    }

    // * Check if draft node

    const metadata = existingContent?.metadata ?? {}
    const isUntitledDraftNode = checkIfUntitledDraftNode(node.path)
    const isNewDraftNode = metadata?.createdAt === metadata?.updatedAt

    let path = node.path
    const title = getTitleFromContent(editorContent)

    if (isNewDraftNode && isUntitledDraftNode) {
      if (options?.beforeSave) {
        path = path.split(SEPARATOR).slice(0, -1).join(SEPARATOR) + `${SEPARATOR}${title}`
      } else {
        path = saveNodeName(node.nodeid, title)
      }
    }

    // mog('Saving via Save', { node, editorContent })
    if (options?.beforeSave) {
      options?.beforeSave({ path, noteId: node.nodeid, noteContent: editorContent })
    } else onSave(node, options?.saveToFile ?? false, false, editorContent)

    if (options?.saveAfterBlur === false) {
      setSaveAfterBlur(false)
    }

    if (options?.saveAndClose) appNotifierWindow(IpcAction.CLOSE_SPOTLIGHT, AppType.SPOTLIGHT, { hide: true })

    if (options?.notify !== false) {
      appNotifierWindow(IpcAction.SHOW_TOAST, AppType.SPOTLIGHT, {
        status: 'success',
        title: 'Saved successfully!',
        independent: options?.saveAndClose
      })
    }

    await updateDocument('node', node.nodeid, editorContent)

    setSearch({ value: '', type: CategoryType.search })
    setInput('')
    setNormalMode(true)

    // * Add this item in recents list of Mex
    addRecent(node.nodeid)
    addInResearchNodes(node.nodeid)
    appNotifierWindow(IpcAction.REFRESH_NODE, AppType.SPOTLIGHT, { nodeid: node.nodeid })
  }

  return {
    saveIt
  }
}

export default useSearchProps
