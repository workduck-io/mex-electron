import tinykeys from 'tinykeys'
import { useEffect } from 'react'
import { CategoryType, useSpotlightContext } from '../../store/Context/context.spotlight'
import { useContentStore } from '../../store/useContentStore'
import { useKeyListener } from '../useShortcutListener'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../views/routes/urls'

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
      Escape: (event) => {
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
