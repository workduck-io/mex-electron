import { useHistory } from 'react-router'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { useSpotlightEditorStore } from '../store/editor'
import tinykeys from 'tinykeys'
import { useEffect } from 'react'

export const useRecentsShortcuts = () => {
  const history = useHistory()
  const loadNodeFromId = useEditorStore((state) => state.loadNodeFromId)
  const savedEditorId = useSpotlightEditorStore((state) => state.nodeId)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Tab: (event) => {
        event.preventDefault()
        loadNodeFromId(savedEditorId)
        history.replace('/new')
      }
    })
    return () => {
      unsubscribe()
    }
  }, [savedEditorId])
}
