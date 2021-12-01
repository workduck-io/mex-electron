import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'
import { useSpotlightSettingsStore } from '../store/settings'
import tinykeys from 'tinykeys'
import { useContentStore } from '../../Editor/Store/ContentStore'
import { useSpotlightContext } from '../utils/context'
import { useSpotlightEditorStore } from '../store/editor'
import { ipcRenderer } from 'electron'
import { useKeyListener } from '../../Hooks/useCustomShortcuts/useShortcutListener'

export const useGlobalShortcuts = () => {
  const history = useHistory()
  const location = useLocation()

  const { showSource, toggleSource } = useSpotlightSettingsStore(({ showSource, toggleSource }) => ({
    showSource,
    toggleSource
  }))
  const setSaved = useContentStore((state) => state.setSaved)

  const removeContent = useContentStore((state) => state.removeContent)
  const { setSelection, setSearch, search, selection } = useSpotlightContext()
  const savedEditorNode = useSpotlightEditorStore((state) => state.node)
  const setIsPreview = useSpotlightEditorStore((state) => state.setIsPreview)
  const setBackPressed = useSpotlightSettingsStore((state) => state.setBackPressed)
  const setBubble = useSpotlightSettingsStore((state) => state.setBubble)

  const handleCancel = () => {
    setSaved(false)
    setSearch('')
  }

  const { shortcutDisabled, shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Alt: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) history.push('/settings')
      },
      '$mod+Shift+KeyB': (event) => {
        event.preventDefault()
        if (!shortcutDisabled) setBubble()
      },
      Escape: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) {
          if (location.pathname === '/settings') {
            setBackPressed(true)
            history.go(-1)
          } else if (location.pathname === '/new') {
            setSelection(undefined)
            handleCancel()
            history.replace('/')
          } else if (selection && !search) {
            setSelection(undefined)
            removeContent(savedEditorNode.uid)
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
      // '$mod+Shift+,': (event) => {
      //   toggleSource(!showSource)
      // },
    })
    return () => {
      unsubscribe()
    }
  }, [showSource, selection, search, location, shortcutDisabled])
}
