import saveLine from '@iconify-icons/ri/save-line'
import { useStoreEditorValue } from '@udecode/plate'
import { ipcRenderer } from 'electron'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import tinykeys from 'tinykeys'
import { useHelpStore } from '../../Components/Help/HelpModal'
import { useSaveData } from '../../Data/useSaveData'
import IconButton from '../../Styled/Buttons'
import { useLinks } from '../Actions/useLinks'
import { useContentStore } from '../Store/ContentStore'
import { useEditorStore } from '../Store/EditorStore'
import { useSnippetStore } from '../Store/SnippetStore'

export const useSaver = () => {
  const setFsContent = useContentStore((state) => state.setContent)

  const id = useEditorStore((state) => state.node.id)
  const { updateLinksFromContent } = useLinks()

  const saveData = useSaveData()
  const editorState = useStoreEditorValue()

  const onSave = () => {
    // setContent then save
    if (editorState) {
      setFsContent(id, editorState)
      updateLinksFromContent(id, editorState)
    }
    saveData()
    toast('Saved!', { duration: 1000 })
  }

  return { onSave }
}

interface SaverButtonProps {
  title?: string
  noButton?: boolean
  callbackAfterSave?: () => void
  callbackBeforeSave?: () => void
}

/** A very special saver button
 *
 * It implements the save action and shortcuts in isolation so that the editor does not rerender on every document save.
 */
export const SaverButton = ({ callbackAfterSave, callbackBeforeSave, title, noButton }: SaverButtonProps) => {
  const { onSave: onSaveFs } = useSaver()

  const shortcuts = useHelpStore((state) => state.shortcuts)

  const onSave = () => {
    if (callbackBeforeSave) callbackBeforeSave()
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

  if (noButton) return <></>

  return <IconButton size={24} icon={saveLine} onClick={onSave} title={title ?? 'Save'} />
}

export const useSnippetSaver = () => {
  const snippet = useSnippetStore((store) => store.editor.snippet)
  const updateSnippet = useSnippetStore((state) => state.updateSnippet)
  const editorState = useStoreEditorValue()
  const saveData = useSaveData()

  const onSave = (title: string) => {
    if (editorState) updateSnippet(snippet.id, { ...snippet, title, content: editorState })
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

  const onSave = () => {
    const snippetTitle = getSnippetTitle()
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
