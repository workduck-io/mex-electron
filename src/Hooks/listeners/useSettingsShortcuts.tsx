import { useEffect } from 'react'
import { useContentStore } from '../../store/useContentStore'
import tinykeys from 'tinykeys'
import { useKeyListener } from '../useShortcutListener'

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
