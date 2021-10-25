import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useKeyListener } from '../../Hooks/useCustomShortcuts/useShortcutListener'
import tinykeys from 'tinykeys'

export const useResultsShortcuts = () => {
  const history = useHistory()

  const { shortcutDisabled } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Tab: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) history.replace('/new')
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcutDisabled])
}
