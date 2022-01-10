import saveLine from '@iconify-icons/ri/save-line'
import { TippyProps } from '@tippyjs/react'
import { getPlateSelectors, usePlateSelectors, usePlateId, getPlateId, platesStore } from '@udecode/plate'
import React, { useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useUpdater } from '../../Data/useUpdater'
import tinykeys from 'tinykeys'
import useAnalytics from '../../analytics'
import { ActionType } from '../../analytics/events'
import { useHelpStore } from '../../Components/Help/HelpModal'
import { useSaveData } from '../../Data/useSaveData'
import { useKeyListener } from '../../Hooks/useCustomShortcuts/useShortcutListener'
import { useTags } from '../../Hooks/useTags/useTags'
import { getEventNameFromElement } from '../../Lib/strings'
import { useApi } from '../../Requests/Save'
import { convertEntryToRawText } from '../../Search/localSearch'
import { useNewSearchStore } from '../../Search/SearchStore'
import IconButton from '../../Styled/Buttons'
import { useLinks } from '../Actions/useLinks'
import { useContentStore } from '../Store/ContentStore'
import { NodeProperties, useEditorStore } from '../Store/EditorStore'
import { useSnippetStore } from '../Store/SnippetStore'

export const useDataSaverFromContent = () => {
  const setFsContent = useContentStore((state) => state.setContent)
  const getContent = useContentStore((state) => state.getContent)
  const { updateLinksFromContent, getNodeIdFromUid } = useLinks()
  const { updateTagsFromContent } = useTags()
  const { saveDataAPI } = useApi()
  const updateDocNew = useNewSearchStore((store) => store.updateDoc)
  const saveData = useSaveData()

  // By default saves to API use false to not save
  const saveEditorAndUpdateStates = useCallback((node: NodeProperties, editorState: any[], saveApi?: boolean) => {
    if (editorState) {
      setFsContent(node.uid, editorState)
      if (saveApi !== false) saveDataAPI(node.uid, editorState)
      updateLinksFromContent(node.uid, editorState)
      updateTagsFromContent(node.uid, editorState)
      const title = getNodeIdFromUid(node.uid)
      updateDocNew(node.uid, convertEntryToRawText(node.uid, editorState), title)
    }
  }, [])

  const saveNodeAPIandFs = (uid: string) => {
    // console.log('saving to api for uid: ', { uid })
    const content = getContent(uid)
    saveDataAPI(uid, content.content)
    saveData()
  }

  return { saveEditorAndUpdateStates, saveNodeAPIandFs }
}

export const useSaver = () => {
  const saveData = useSaveData()

  // const editorState = usePlateSelectors(usePlateId()).value(

  const { saveEditorAndUpdateStates } = useDataSaverFromContent()

  /**
   * Should be run on explicit save as it saves the current editor state
   * and everything else in the api and file system
   */
  const onSave = (
    node?: NodeProperties,
    writeToFile?: boolean, // Saved to file unless explicitly set to false
    notification?: boolean // Shown notification unless explicitly set to false
  ) => {
    const state = platesStore.get.state()

    const defaultNode = useEditorStore.getState().node
    const cnode = node || defaultNode
    // setContent then save

    const editorId = getPlateId()
    const hasState = !!state[editorId]
    if (hasState) {
      const editorState = state[editorId].get.value()
      saveEditorAndUpdateStates(cnode, editorState)
    }

    if (writeToFile !== false) {
      // console.log('CALLED')
      saveData()
    }
    if (notification !== false) toast('Saved!', { duration: 1000 })
  }

  return { onSave, saveEditorAndUpdateStates }
}

interface SaverButtonProps {
  title?: string
  shortcut?: string
  noButton?: boolean
  // Warning doesn't get the current node in the editor
  saveOnUnmount?: boolean
  callbackAfterSave?: (uid?: string) => void
  callbackBeforeSave?: () => void
  singleton?: TippyProps['singleton']
}

/** A very special saver button
 *
 * It implements the save action and shortcuts in isolation so that the editor does not rerender on every document save.
 */
export const SaverButton = ({
  callbackAfterSave,
  callbackBeforeSave,
  title,
  shortcut,
  saveOnUnmount,
  noButton,
  singleton
}: SaverButtonProps) => {
  const { onSave: onSaveFs } = useSaver()

  const shortcuts = useHelpStore((state) => state.shortcuts)
  const { shortcutDisabled } = useKeyListener()
  const node = useEditorStore((state) => state.node)

  const onSave = () => {
    if (callbackBeforeSave) callbackBeforeSave()
    onSaveFs(node)
    if (callbackAfterSave) callbackAfterSave(node.uid)
  }

  useEffect(() => {
    if (saveOnUnmount) {
      return () => {
        onSave()
      }
    }
  }, [])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.save.keystrokes]: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) onSave()
      }
    })

    return () => {
      unsubscribe()
    }
  })

  if (noButton) return <></>

  return (
    <IconButton
      shortcut={shortcut}
      size={24}
      icon={saveLine}
      singleton={singleton}
      onClick={onSave}
      title={title ?? 'Save'}
    />
  )
}

export const useSnippetSaver = () => {
  const snippet = useSnippetStore((store) => store.editor.snippet)
  const updateSnippet = useSnippetStore((state) => state.updateSnippet)
  const editorState = usePlateSelectors(usePlateId()).value()
  const saveData = useSaveData()
  const { updater } = useUpdater()

  const onSave = (title: string) => {
    if (editorState) updateSnippet(snippet.id, { ...snippet, title, content: editorState })
    updater()
    saveData()
    toast('Snippet Saved!', { duration: 1000 })
  }

  return { onSave }
}

interface SnippetSaverButtonProps extends SaverButtonProps {
  getSnippetTitle: () => string
}

export const SnippetSaverButton = ({ callbackAfterSave, title, getSnippetTitle }: SnippetSaverButtonProps) => {
  const { onSave: onSaveFs } = useSnippetSaver()
  const shortcuts = useHelpStore((state) => state.shortcuts)
  const { trackEvent } = useAnalytics()

  const onSave = () => {
    const snippetTitle = getSnippetTitle()

    trackEvent(getEventNameFromElement('Editor', ActionType.CREATE, 'Snippet'), { 'mex-title': snippetTitle })

    onSaveFs(snippetTitle)
    if (callbackAfterSave) callbackAfterSave()
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.save.keystrokes]: (event) => {
        event.preventDefault()
        onSave()
      }
    })
    return () => {
      unsubscribe()
    }
  })

  return <IconButton size={24} icon={saveLine} onClick={onSave} title={title ?? 'Save'} />
}
