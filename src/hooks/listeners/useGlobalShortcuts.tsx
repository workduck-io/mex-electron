import { getPlateActions } from '@udecode/plate'
import { ipcRenderer } from 'electron'
import { useEffect } from 'react'
import { useLocation } from 'react-router'
import tinykeys from 'tinykeys'
import { useSpotlightAppStore } from '../../store/app.spotlight'
import { CategoryType, useSpotlightContext } from '../../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../../store/editor.spotlight'
import { useSpotlightSettingsStore } from '../../store/settings.spotlight'
import { useContentStore } from '../../store/useContentStore'
import { useKeyListener } from '../useShortcutListener'
import { mog } from '../../utils/lib/helper'

export const useGlobalShortcuts = () => {
  const location = useLocation()

  const { setSelection, setSearch, setActiveItem, search, selection } = useSpotlightContext()

  const { showSource } = useSpotlightSettingsStore(({ showSource, toggleSource }) => ({
    showSource,
    toggleSource
  }))
  const setSaved = useContentStore((state) => state.setSaved)

  const removeContent = useContentStore((state) => state.removeContent)
  const savedEditorNode = useSpotlightEditorStore((state) => state.node)
  const setIsPreview = useSpotlightEditorStore((state) => state.setIsPreview)
  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const setCurrentListItem = useSpotlightEditorStore((s) => s.setCurrentListItem)

  const handleCancel = () => {
    setSaved(false)
    setSearch({ value: '', type: CategoryType.search })
    setActiveItem({ item: null, active: false })
  }

  const { shortcutDisabled } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        mog('Shortcut disabled', { shortcutDisabled })
        if (!shortcutDisabled) {
          getPlateActions(savedEditorNode.nodeid).resetEditor()
          if (selection && !search.value) {
            setSelection(undefined)

            removeContent(savedEditorNode.nodeid)
          } else if (search.value) {
            setIsPreview(false)
            handleCancel()
          } else {
            setIsPreview(false)
            handleCancel()
            if (normalMode) ipcRenderer.send('close')
          }
          setNormalMode(true)
          setCurrentListItem(undefined)
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [showSource, selection, normalMode, search, location, shortcutDisabled])
}
