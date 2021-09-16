import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'
import { useSpotlightSettingsStore } from '../store/settings'
import tinykeys from 'tinykeys'
import { useContentStore } from '../../Editor/Store/ContentStore'
import { useSpotlightContext } from '../utils/context'
import { useSpotlightEditorStore } from '../store/editor'
import { ipcRenderer } from 'electron'

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
  const savedEditorId = useSpotlightEditorStore((state) => state.nodeId)
  const setIsPreview = useSpotlightEditorStore((state) => state.setIsPreview)
  const setBackPressed = useSpotlightSettingsStore((state) => state.setBackPressed)

  const handleCancel = () => {
    setSaved(false)
    setSearch('')
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Alt: (event) => {
        event.preventDefault()
        history.push('/settings')
      },
      Escape: (event) => {
        event.preventDefault()
        if (location.pathname === '/settings') {
          setBackPressed(true)
          history.go(-1)
        } else if (location.pathname === '/new') {
          setSelection(undefined)
          handleCancel()
          history.replace('/')
        } else if (selection && !search) {
          setSelection(undefined)
          removeContent(savedEditorId)
        } else if (search) {
          setIsPreview(false)
          handleCancel()
        } else {
          setIsPreview(false)
          handleCancel()
          ipcRenderer.send('close')
        }
      }
      // '$mod+Shift+,': (event) => {
      //   toggleSource(!showSource)
      // },
    })
    return () => {
      unsubscribe()
    }
  }, [showSource, selection, search, location])
}
