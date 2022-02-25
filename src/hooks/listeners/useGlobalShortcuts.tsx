import { CategoryType, useSpotlightContext } from '../../store/Context/context.spotlight'

import { ipcRenderer } from 'electron'
import tinykeys from 'tinykeys'
import { useContentStore } from '../../store/useContentStore'
import { useEffect } from 'react'
import { useKeyListener } from '../useShortcutListener'
import { useLocation } from 'react-router'
import { useSpotlightAppStore } from '../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../store/editor.spotlight'
import { useSpotlightSettingsStore } from '../../store/settings.spotlight'

export const useGlobalShortcuts = () => {
  const location = useLocation()

  const { setSelection, setSearch, setActiveItem, search, selection } = useSpotlightContext()

  const { showSource } = useSpotlightSettingsStore(({ showSource, toggleSource }) => ({
    showSource,
    toggleSource
  }))
  const setSaved = useContentStore((state) => state.setSaved)

  const setIsPreview = useSpotlightEditorStore((state) => state.setIsPreview)
  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const setCurrentListItem = useSpotlightEditorStore((s) => s.setCurrentListItem)

  const handleCancel = () => {
    setNormalMode(true)
    setIsPreview(false)
    setSaved(false)
    setSearch({ value: '', type: CategoryType.search })
    setActiveItem({ item: null, active: false })
  }

  const { shortcutDisabled } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) {
          if (selection && normalMode) {
            setSelection(undefined) // * this will do something
          } else {
            handleCancel()
            if (normalMode) ipcRenderer.send('close')
          }
          setCurrentListItem(undefined)
        }
      },
      Tab: (event) => {
        event.preventDefault()
        setNormalMode(false)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [showSource, selection, normalMode, search, location, shortcutDisabled])
}
