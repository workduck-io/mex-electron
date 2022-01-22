import { useEffect } from 'react'
import { useSpotlightContext } from '../../store/Context/context.spotlight'
import tinykeys from 'tinykeys'
import { useKeyListener } from '../useShortcutListener'

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
