import { CategoryType, useSpotlightContext } from '../../store/Context/context.spotlight'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../views/routes/urls'

import { spotlightShortcuts } from '../../components/spotlight/Shortcuts/list'
import tinykeys from 'tinykeys'
import { useContentStore } from '../../store/useContentStore'
import { useEffect } from 'react'
import { useKeyListener } from '../useShortcutListener'

export const useMexItShortcuts = () => {
  const { goTo } = useRouting()
  const { setSelection, setSearch } = useSpotlightContext()
  const setSaved = useContentStore((state) => state.setSaved)

  const handleCancel = () => {
    setSaved(false)
    setSearch({ value: '', type: CategoryType.search })
    setSelection(undefined)
  }

  const { shortcutDisabled } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [spotlightShortcuts.escape.keystrokes]: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) {
          handleCancel()
          goTo(ROUTE_PATHS.dashborad, NavigationType.push)
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcutDisabled])
}
