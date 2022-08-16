import { tinykeys } from '@workduck-io/tinykeys'
import { useContentStore } from '../../store/useContentStore'
import { useEffect } from 'react'
import { useHelpStore } from '../../store/useHelpStore'
import { useKeyListener } from '../useShortcutListener'

export const useSettingsShortcuts = () => {
  const setSaved = useContentStore((state) => state.setSaved)
  const shortcuts = useHelpStore((state) => state.shortcuts)

  const { shortcutDisabled } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.save.keystrokes]: (event) => {
        if (!shortcutDisabled) setSaved(true)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcutDisabled])
}
