import { CategoryType, useSpotlightContext } from '../../store/Context/context.spotlight'
import { getPlateSelectors, usePlateSelectors, usePlatesSelectors } from '@udecode/plate'

import { AppType } from '../useInitialize'
import { IpcAction } from '../../data/IpcAction'
import { appNotifierWindow } from '../../electron/utils/notifiers'
import { ipcRenderer } from 'electron'
import { mog } from '../../utils/lib/helper'
import tinykeys from 'tinykeys'
import { useContentStore } from '../../store/useContentStore'
import useDataStore from '../../store/useDataStore'
import { useEffect } from 'react'
import { useKeyListener } from '../useShortcutListener'
import { useLocation } from 'react-router'
import { useRecentsStore } from '../../store/useRecentsStore'
import { useSaver } from '../../editor/Components/Saver'
import { useSpotlightAppStore } from '../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../store/editor.spotlight'
import { useSpotlightSettingsStore } from '../../store/settings.spotlight'

export const useGlobalShortcuts = () => {
  const location = useLocation()

  const { onSave } = useSaver()
  const { setSelection, setSearch, setActiveItem, search, selection } = useSpotlightContext()

  const { showSource } = useSpotlightSettingsStore(({ showSource, toggleSource }) => ({
    showSource,
    toggleSource
  }))
  const setSaved = useContentStore((state) => state.setSaved)
  const setInput = useSpotlightAppStore((store) => store.setInput)
  const ilinks = useDataStore((store) => store.ilinks)
  const addRecent = useRecentsStore((store) => store.addRecent)
  const addILink = useDataStore((store) => store.addILink)

  const setIsPreview = useSpotlightEditorStore((state) => state.setIsPreview)
  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const node = useSpotlightEditorStore((store) => store.node)
  const setCurrentListItem = useSpotlightEditorStore((s) => s.setCurrentListItem)
  const addInRecentResearchNodes = useRecentsStore((store) => store.addInResearchNodes)

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
          } else if (search.value) {
            setInput('')
            handleCancel()
          } else {
            if (!normalMode) {
              const content = getPlateSelectors().value()

              const isNodePresent = ilinks.find((ilink) => ilink.nodeid === node.nodeid)
              if (!isNodePresent) {
                addILink({ ilink: node.path, nodeid: node.nodeid })
              }

              addRecent(node.nodeid)
              addInRecentResearchNodes(node.nodeid)
              onSave(node, true, false, content)
              appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, { nodeid: node.nodeid })
              handleCancel()
            }
            if (normalMode) ipcRenderer.send('close')
          }
          setCurrentListItem(undefined)
        }
      }
      // Tab: (event) => {
      //   event.preventDefault()
      //   setNormalMode(false)
      // }
    })
    return () => {
      unsubscribe()
    }
  }, [showSource, selection, normalMode, search, location, shortcutDisabled])
}
