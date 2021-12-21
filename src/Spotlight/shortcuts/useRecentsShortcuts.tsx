import { useHistory } from 'react-router'
import { useSpotlightEditorStore } from '../store/editor'
import tinykeys from 'tinykeys'
import { useEffect } from 'react'
import useLoad from '../../Hooks/useLoad/useLoad'
import { performClick } from '../../Components/Onboarding/steps'

import { useKeyListener } from '../../Hooks/useCustomShortcuts/useShortcutListener'

export const useRecentsShortcuts = () => {
  const history = useHistory()
  const { loadNodeProps } = useLoad()
  const savedEditorNode = useSpotlightEditorStore((state) => state.node)

  const { shortcutDisabled } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Tab: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) {
          loadNodeProps(savedEditorNode)
          history.replace('/new')
          performClick()
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [savedEditorNode, shortcutDisabled])
}
