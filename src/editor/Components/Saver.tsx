import saveLine from '@iconify-icons/ri/save-line'
import { TippyProps } from '@tippyjs/react'
import { getPlateSelectors, usePlateSelectors, usePlateId, getPlateId, platesStore } from '@udecode/plate'
import React, { useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useUpdater } from '../../hooks/useUpdater'
import tinykeys from 'tinykeys'
import useAnalytics from '../../services/analytics'
import { ActionType } from '../../services/analytics/events'
import { useHelpStore } from '../../store/useHelpStore'
import { useSaveData } from '../../hooks/useSaveData'
import { useKeyListener } from '../../hooks/useShortcutListener'
import { useTags } from '../../hooks/useTags'
import { getEventNameFromElement } from '../../utils/lib/strings'
import { useApi } from '../../apis/useSaveApi'
import { convertEntryToRawText } from '../../utils/search/localSearch'
import { useNewSearchStore } from '../../store/useSearchStore'
import IconButton from '../../style/Buttons'
import { useLinks } from '../../hooks/useLinks'
import { useContentStore } from '../../store/useContentStore'
import { NodeProperties, useEditorStore } from '../../store/useEditorStore'
import { useSnippetStore } from '../../store/useSnippetStore'
import { NodeEditorContent } from '../../types/Types'

export const useDataSaverFromContent = () => {
  const setContent = useContentStore((state) => state.setContent)
  const getContent = useContentStore((state) => state.getContent)
  const { updateLinksFromContent, getNodeIdFromUid } = useLinks()
  const { updateTagsFromContent } = useTags()
  const { saveDataAPI } = useApi()
  const updateDocNew = useNewSearchStore((store) => store.updateDoc)
  const saveData = useSaveData()

  // By default saves to API use false to not save
  const saveEditorValueAndUpdateStores = useCallback((uid: string, editorValue: any[], saveApi?: boolean) => {
    if (editorValue) {
      setContent(uid, editorValue)
      if (saveApi !== false) saveDataAPI(uid, editorValue)
      updateLinksFromContent(uid, editorValue)
      updateTagsFromContent(uid, editorValue)
      const title = getNodeIdFromUid(uid)
      updateDocNew(uid, convertEntryToRawText(uid, editorValue), title)
    }
  }, [])

  const saveNodeAPIandFs = (uid: string) => {
    const content = getContent(uid)
    console.log('saving to api for uid: ', { uid, content })
    saveDataAPI(uid, content.content)
    saveData()
  }

  const saveNodeWithValue = (uid: string, value: NodeEditorContent) => {
    const content = getContent(uid)
    console.log('saving to api for uid: ', { uid, content })
    // saveDataAPI(uid, content.content)
    saveEditorValueAndUpdateStores(uid, value, true)
    saveData()
  }

  return { saveEditorValueAndUpdateStores, saveNodeAPIandFs, saveNodeWithValue }
}

export const useSaver = () => {
  const saveData = useSaveData()

  // const editorState = usePlateSelectors(usePlateId()).value(

  const { saveEditorValueAndUpdateStores } = useDataSaverFromContent()

  /**
   * Should be run on explicit save as it saves the current editor state
   * and everything else in the api and file system
   */
  const onSave = (
    node?: NodeProperties,
    writeToFile?: boolean, // Saved to file unless explicitly set to false
    notification?: boolean, // Shown notification unless explicitly set to false
    content?: any[] //  Replace content with given content instead of fetching from plate value
  ) => {
    const state = platesStore.get.state()

    const defaultNode = useEditorStore.getState().node
    const cnode = node || defaultNode
    // const nodeContent = content ?? editorState
    // setContent then save

    const editorId = getPlateId()
    const hasState = !!state[editorId]
    if (hasState) {
      const editorState = content ?? state[editorId].get.value()
      saveEditorValueAndUpdateStores(cnode.uid, editorState)
    }

    if (writeToFile !== false) {
      // console.log('CALLED')
      saveData()
    }
    if (notification !== false) toast('Saved!', { duration: 1000 })
  }

  return { onSave, saveEditorValueAndUpdateStores }
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
