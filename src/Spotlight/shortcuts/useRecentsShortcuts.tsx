import { useHistory } from 'react-router'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { useSpotlightEditorStore } from '../store/editor'
import tinykeys from 'tinykeys'
import { useEffect } from 'react'
import useLoad from '../../Hooks/useLoad/useLoad'

export const useRecentsShortcuts = () => {
  const history = useHistory()
  const { loadNode } = useLoad()
  const savedEditorId = useSpotlightEditorStore((state) => state.nodeId)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Tab: (event) => {
        event.preventDefault()
        loadNode(savedEditorId)
        history.replace('/new')
      }
    })
    return () => {
      unsubscribe()
    }
  }, [savedEditorId])
}
