import { useHistory } from 'react-router'
import { useContentStore } from '../../editor/Store/ContentStore'
import { useSpotlightContext } from '../utils/context'
import tinykeys from 'tinykeys'
import { useEffect } from 'react'
import { useKeyListener } from '../../Hooks/useCustomShortcuts/useShortcutListener'

export const useMexItShortcuts = () => {
  const history = useHistory()
  const { setSelection, setSearch } = useSpotlightContext()
  const setSaved = useContentStore((state) => state.setSaved)

  const handleCancel = () => {
    setSaved(false)
    setSearch('')
    setSelection(undefined)
  }

  const { shortcutDisabled } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) {
          handleCancel()
          history.replace('/')
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcutDisabled])
}
