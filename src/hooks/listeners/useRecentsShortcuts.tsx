import { performClick } from '../../components/mex/Onboarding/steps'
import { spotlightShortcuts } from '../../components/spotlight/Shortcuts/list'
import tinykeys from 'tinykeys'
import { useEffect } from 'react'
import { useKeyListener } from '../useShortcutListener'
import useLoad from '../useLoad'
import { useSpotlightEditorStore } from '../../store/editor.spotlight'

export const useRecentsShortcuts = () => {
  const { loadNodeProps } = useLoad()
  const savedEditorNode = useSpotlightEditorStore((state) => state.node)

  const { shortcutDisabled } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [spotlightShortcuts.Tab.keystrokes]: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) {
          loadNodeProps(savedEditorNode)
          performClick()
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [savedEditorNode, shortcutDisabled])
}
