import { useHistory } from 'react-router'
import tinykeys from 'tinykeys'
import { useEffect } from 'react'
import { performClick } from '../../components/mex/Onboarding/steps'
import { useSpotlightEditorStore } from '../../store/editor.spotlight'
import useLoad from '../useLoad'
import { useKeyListener } from '../useShortcutListener'

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
