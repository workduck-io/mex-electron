import { useEffect } from 'react'
import { useKeyListener } from '../../Hooks/useCustomShortcuts/useShortcutListener'
import tinykeys from 'tinykeys'
import { useSpotlightContext } from '../utils/context'

export const useResultsShortcuts = () => {
  const { shortcutDisabled } = useKeyListener()
  const { setSearch } = useSpotlightContext()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Enter: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) {
          // setEditSearchedNode(true)
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [shortcutDisabled])
}
