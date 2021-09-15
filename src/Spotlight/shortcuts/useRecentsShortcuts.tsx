import { useHistory } from 'react-router'
import { useContentStore } from '../../Editor/Store/ContentStore'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { useSpotlightEditorStore } from '../store/editor'
import { useSpotlightContext } from '../utils/context'
import tinykeys from 'tinykeys'
import { useEffect } from 'react'
import { ipcRenderer } from 'electron'

export const useRecentsShortcuts = () => {
  const history = useHistory()
  const loadNodeFromId = useEditorStore((state) => state.loadNodeFromId)
  const savedEditorId = useSpotlightEditorStore((state) => state.nodeId)

  const setSaved = useContentStore((state) => state.setSaved)
  const removeContent = useContentStore((state) => state.removeContent)
  const { setSelection, setSearch, selection } = useSpotlightContext()

  const handleCancel = () => {
    setSaved(false)
    setSearch('')
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Tab: (event) => {
        event.preventDefault()
        loadNodeFromId(savedEditorId)
        history.replace('/new')
      },
      Escape: (event) => {
        event.preventDefault()
        if (selection) {
          setSelection(undefined)
          removeContent(savedEditorId)
        } else {
          handleCancel()
          ipcRenderer.send('close')
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [savedEditorId, selection])
}
