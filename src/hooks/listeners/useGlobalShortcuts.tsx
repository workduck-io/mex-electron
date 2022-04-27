import { CategoryType, useSpotlightContext } from '../../store/Context/context.spotlight'

import { ipcRenderer } from 'electron'
import { spotlightShortcuts } from '../../components/spotlight/Shortcuts/list'
import tinykeys from 'tinykeys'
import { useContentStore } from '../../store/useContentStore'
import { useEffect } from 'react'
import { useKeyListener } from '../useShortcutListener'
import { useLocation } from 'react-router'
import { useSaveChanges } from '../../components/spotlight/Search/useSearchProps'
import { useSpotlightAppStore } from '../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../store/editor.spotlight'
import { useSpotlightSettingsStore } from '../../store/settings.spotlight'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../views/routes/urls'
import { useActionStore } from '../../components/spotlight/Actions/useActionStore'

export const useGlobalShortcuts = () => {
  const { setSelection, setSearch, setActiveItem, activeItem, search, selection } = useSpotlightContext()

  const { showSource } = useSpotlightSettingsStore(({ showSource, toggleSource }) => ({
    showSource,
    toggleSource
  }))
  const setSaved = useContentStore((state) => state.setSaved)
  const setInput = useSpotlightAppStore((store) => store.setInput)

  const { goTo, location } = useRouting()
  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const setCurrentListItem = useSpotlightEditorStore((s) => s.setCurrentListItem)
  // const clearPerformedAction = useActionStore((store) => store.clear)
  const setView = useSpotlightAppStore((store) => store.setView)

  const handleCancel = () => {
    setNormalMode(true)
    setSaved(false)
    setSearch({ value: '', type: CategoryType.search })
    setActiveItem({ item: null, active: false })
  }

  const { saveIt } = useSaveChanges()
  const { shortcutDisabled } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [spotlightShortcuts.escape.keystrokes]: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) {
          if (location.pathname === '/action') {
            if (useSpotlightAppStore.getState().view === 'item') {
              setView(undefined)
            } else {
              // * If no value is present, take back to home view
              if (!search.value) {
                handleCancel()
                setView(undefined)
                // clearPerformedAction()
                goTo(ROUTE_PATHS.home, NavigationType.replace)
                return
              }
              // * clear action search

              setInput('')
              setSearch({ value: '', type: CategoryType.search })
            }
          } else if (selection && normalMode && !search.value && !activeItem.active) {
            ipcRenderer.send('close') // * To be continued when flow are introd
            setSelection(undefined) // * this will do something
          } else if ((search.value && normalMode) || activeItem.active) {
            setInput('')
            handleCancel()
          } else {
            if (!normalMode) {
              saveIt()
              handleCancel()
            }
            if (normalMode) ipcRenderer.send('close')
          }
          setCurrentListItem(undefined)
        }
      }
      // [spotlightShortcuts.Tab.keystrokes]: (event) => {
      //   event.preventDefault()
      //   setNormalMode(false)
      // }
    })
    return () => {
      unsubscribe()
    }
  }, [showSource, activeItem.active, selection, normalMode, search, location, shortcutDisabled])
}
