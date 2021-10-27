import { useHistory } from 'react-router'
import { useSpotlightEditorStore } from '../store/editor'
import tinykeys from 'tinykeys'
import { useEffect } from 'react'
import useLoad from '../../Hooks/useLoad/useLoad'
import { useKeyListener } from '../../Hooks/useCustomShortcuts/useShortcutListener'

export const useRecentsShortcuts = () => {
  const history = useHistory()
  const { loadNode } = useLoad()
  const savedEditorId = useSpotlightEditorStore((state) => state.nodeId)

  const { shortcutDisabled } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Tab: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) {
          loadNode(savedEditorId)
          history.replace('/new')
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [savedEditorId, shortcutDisabled])
}
