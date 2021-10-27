import { useEffect } from 'react'
import { useContentStore } from '../../Editor/Store/ContentStore'
import tinykeys from 'tinykeys'
import { useKeyListener } from '../../Hooks/useCustomShortcuts/useShortcutListener'

export const useSettingsShortcuts = () => {
  const setSaved = useContentStore((state) => state.setSaved)

  const { shortcutDisabled } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+s': (event) => {
        if (!shortcutDisabled) setSaved(true)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcutDisabled])
}
