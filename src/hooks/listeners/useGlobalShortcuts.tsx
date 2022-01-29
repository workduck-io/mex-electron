import { getPlateActions } from '@udecode/plate'
import { ipcRenderer } from 'electron'
import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'
import tinykeys from 'tinykeys'
import { useSpotlightAppStore } from '../../store/app.spotlight'
import { useSpotlightContext } from '../../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../../store/editor.spotlight'
import { useSpotlightSettingsStore } from '../../store/settings.spotlight'
import { useContentStore } from '../../store/useContentStore'
import { useKeyListener } from '../useShortcutListener'

export const useGlobalShortcuts = () => {
  const history = useHistory()
  const location = useLocation()

  const { setSelection, setSearch, search, selection } = useSpotlightContext()

  const { showSource, toggleSource } = useSpotlightSettingsStore(({ showSource, toggleSource }) => ({
    showSource,
    toggleSource
  }))
  const setSaved = useContentStore((state) => state.setSaved)

  const removeContent = useContentStore((state) => state.removeContent)
  const savedEditorNode = useSpotlightEditorStore((state) => state.node)
  const setIsPreview = useSpotlightEditorStore((state) => state.setIsPreview)
  const setBubble = useSpotlightSettingsStore((state) => state.setBubble)
  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)

  const handleCancel = () => {
    setSaved(false)
    setSearch('')
  }

  const { shortcutDisabled } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      // Alt: (event) => {
      //   event.preventDefault()
      //   if (!shortcutDisabled) history.push('/settings')
      // },
      // '$mod+Shift+KeyB': (event) => {
      //   event.preventDefault()
      //   if (!shortcutDisabled) setBubble()
      // },
      Escape: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) {
          getPlateActions(savedEditorNode.nodeid).resetEditor()
          setNormalMode(true)
          if (selection && !search) {
            setSelection(undefined)

            removeContent(savedEditorNode.nodeid)
          } else if (search) {
            setIsPreview(false)
            handleCancel()
          } else {
            setIsPreview(false)
            handleCancel()
            ipcRenderer.send('close')
          }
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [showSource, selection, search, location, shortcutDisabled])
}
