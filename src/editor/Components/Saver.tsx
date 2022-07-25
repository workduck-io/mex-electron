import saveLine from '@iconify/icons-ri/save-line'
import { TippyProps } from '@tippyjs/react'
import { getPlateId, platesStore } from '@udecode/plate'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import tinykeys from 'tinykeys'
import { useApi } from '@apis/useSaveApi'
import { useSnippetBuffer } from '@hooks/useEditorBuffer'
import { useLinks } from '@hooks/useLinks'
import { useSaveData } from '@hooks/useSaveData'
import { useSearch } from '@hooks/useSearch'
import { useKeyListener } from '@hooks/useShortcutListener'
import { useTags } from '@hooks/useTags'
import { useUpdater } from '@hooks/useUpdater'
import useAnalytics from '@services/analytics'
import { ActionType } from '@services/analytics/events'
import { useContentStore } from '@store/useContentStore'
import { NodeProperties, useEditorStore } from '@store/useEditorStore'
import { useHelpStore } from '@store/useHelpStore'
import { useSnippetStore } from '@store/useSnippetStore'
import useTodoStore from '@store/useTodoStore'
import IconButton from '@style/Buttons'
import { getTodosFromContent } from '@utils/lib/content'
import { mog } from '@utils/lib/helper'
import { getEventNameFromElement } from '@utils/lib/strings'
import { useNodes } from '@hooks/useNodes'

interface SaveEditorValueOptions {
  // If not set, defaults to true
  saveApi?: boolean

  // Defaults to false
  isShared?: boolean
}

export const useDataSaverFromContent = () => {
  const setContent = useContentStore((state) => state.setContent)
  const getContent = useContentStore((state) => state.getContent)

  const { updateLinksFromContent } = useLinks()
  const updateNodeTodos = useTodoStore((store) => store.replaceContentOfTodos)

  const { updateTagsFromContent } = useTags()
  const { saveDataAPI } = useApi()

  const { updateDocument } = useSearch()

  // By default saves to API use false to not save
  const saveEditorValueAndUpdateStores = async (
    nodeId: string,
    editorValue: any[],
    options?: SaveEditorValueOptions
  ) => {
    if (editorValue) {
      setContent(nodeId, editorValue)
      mog('saveEditorValueAndUpdateStores', { nodeId, editorValue, options })

      if (options?.saveApi !== false) saveDataAPI(nodeId, editorValue, options?.isShared ?? false)

      updateLinksFromContent(nodeId, editorValue)
      updateTagsFromContent(nodeId, editorValue)

      // Update operations for only notes owned by the user
      if (options?.isShared !== true) {
        updateNodeTodos(nodeId, getTodosFromContent(editorValue))
        updateDocument('node', nodeId, editorValue)
      }
    }
  }

  const saveNodeAPIandFs = (nodeId: string) => {
    const content = getContent(nodeId)
    mog('saving to api for nodeId: ', { nodeId, content })
    saveDataAPI(nodeId, content.content)
    // saveData()
  }

  // const saveNodeWithValue = (nodeId: string, value: NodeEditorContent) => {
  //   // const content = getContent(nodeId)
  //   mog('saving to api for nodeId: ', { nodeId, value })
  //   // saveDataAPI(nodeId, content.content)
  //   saveEditorValueAndUpdateStores(nodeId, value, true)
  //   // saveData()
  // }

  return { saveEditorValueAndUpdateStores, saveNodeAPIandFs }
}

export const useSaver = () => {
  const { saveData } = useSaveData()
  const { isSharedNode } = useNodes()

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

    // * Editor Id is different from nodeId
    const editorId = getPlateId()
    const hasState = !!state[editorId]
    const isShared = isSharedNode(cnode.nodeid)

    if (hasState || content) {
      const editorState = content ?? state[editorId].get.value()
      saveEditorValueAndUpdateStores(cnode.nodeid, editorState, { isShared })
    }

    if (writeToFile !== false) {
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
  callbackAfterSave?: (nodeId?: string) => void
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
    if (callbackAfterSave) callbackAfterSave(node.nodeid)
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
  // const editorState = usePlateSelectors(usePlateId()).value()
  const { saveAndClearBuffer } = useSnippetBuffer()
  const { updater } = useUpdater()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)

  const onSave = () => {
    saveAndClearBuffer()
    updater()

    mog('saveSnippet in onSave')
    toast('Snippet Saved!', { duration: 1000 })
  }

  return { onSave }
}

interface SnippetExtras {
  title: string
  template: boolean
}
interface SnippetSaverButtonProps extends SaverButtonProps {
  getSnippetExtras: () => SnippetExtras
}

export const SnippetSaverButton = ({ callbackAfterSave, title, getSnippetExtras }: SnippetSaverButtonProps) => {
  const { onSave: onSaveFs } = useSnippetSaver()
  const shortcuts = useHelpStore((state) => state.shortcuts)
  const { trackEvent } = useAnalytics()

  const onSave = () => {
    const extras = getSnippetExtras()
    trackEvent(getEventNameFromElement('Editor', ActionType.CREATE, 'Snippet'), { 'mex-title': extras.title })

    onSaveFs()

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

  return (
    <IconButton
      size={24}
      shortcut={shortcuts.save.keystrokes}
      icon={saveLine}
      onClick={onSave}
      title={title ?? 'Save'}
    />
  )
}
