import { AppType, useInitialize } from '../../../hooks/useInitialize'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import React, { memo, useEffect, useState } from 'react'

import { FileData } from '../../../types/data'
import { IpcAction } from '../../../data/IpcAction'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { getHtmlString } from '../../../components/spotlight/Source'
import { getNewDraftKey } from '../../../editor/Components/SyncBlock/getNewBlockData'
import { getPlateSelectors } from '@udecode/plate'
import { ipcRenderer } from 'electron'
import { mog } from '../../../utils/lib/helper'
import useAnalytics from '../../../services/analytics'
import { useAuthStore } from '../../../services/auth/useAuth'
import useDataStore from '../../../store/useDataStore'
import useOnboard from '../../../store/useOnboarding'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { useSaver } from '../../../editor/Components/Saver'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useSpotlightSettingsStore } from '../../../store/settings.spotlight'
import ReminderArmer from '../Reminder/ReminderArmer'

const GlobalListener = memo(() => {
  const [temp, setTemp] = useState<any>()
  const { setSelection } = useSpotlightContext()
  const showSource = useSpotlightSettingsStore((state) => state.showSource)
  const setBubble = useSpotlightSettingsStore((state) => state.setBubble)
  const { addRecent, clear } = useRecentsStore(({ addRecent, clear }) => ({ addRecent, clear }))
  const setReset = useSpotlightAppStore((state) => state.setReset)
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const addILink = useDataStore((store) => store.addILink)
  const addInRecentResearchNodes = useRecentsStore((store) => store.addInResearchNodes)

  const { onSave } = useSaver()
  const { init, update } = useInitialize()
  const { identifyUser } = useAnalytics()
  const { goTo } = useRouting()

  const userDetails = useAuthStore((state) => state.userDetails)

  useEffect(() => {
    if (showSource && temp) {
      const source = getHtmlString(temp.metadata)
      const text: string = temp.text

      const html = {
        ...temp,
        text: text.concat(source)
      }
      setSelection(html)
    } else {
      setSelection(temp)
    }
    // setNormalMode(false)
  }, [showSource, temp])

  useEffect(() => {
    ipcRenderer.on(IpcAction.SELECTED_TEXT, (_event, data) => {
      if (!data) {
        setSelection(undefined)
      } else {
        setTemp(data)
      }
    })

    ipcRenderer.on(IpcAction.INIT_HEAP_INSTANCE, (_event, arg) => {
      if (arg.heap) {
        window.heap = JSON.parse(arg.heap)
        identifyUser(userDetails?.email)
      }
    })

    ipcRenderer.on(IpcAction.SPOTLIGHT_BLURRED, () => {
      const normalMode = useSpotlightAppStore.getState().normalMode
      const node = useSpotlightEditorStore.getState().node
      const ilinks = useDataStore.getState().ilinks

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
        setReset()
      }
    })

    ipcRenderer.on(IpcAction.LOGGED_IN, (_event, arg) => {
      if (arg.loggedIn) {
        if (arg.userDetails && arg.workspaceDetails) setAuthenticated(arg.userDetails, arg.workspaceDetails)
        goTo(ROUTE_PATHS.home, NavigationType.replace)
      } else setUnAuthenticated()
    })

    ipcRenderer.on(IpcAction.RECEIVE_LOCAL_DATA, (_event, arg) => {
      const { fileData } = arg
      const editorID = getNewDraftKey()
      init(fileData, editorID, AppType.SPOTLIGHT)
    })

    ipcRenderer.on(IpcAction.SPOTLIGHT_BUBBLE, (_event, arg) => {
      setBubble()
    })

    ipcRenderer.on(IpcAction.CLEAR_RECENTS, (_event) => {
      clear()
    })

    ipcRenderer.on(IpcAction.NEW_RECENT_ITEM, (_event, { data }) => {
      mog('Data is coming ', { data })
      addRecent(data)
    })

    ipcRenderer.on(IpcAction.START_ONBOARDING, (_event) => {
      changeOnboarding(true)
    })

    ipcRenderer.on(IpcAction.SYNC_DATA, (_event, arg) => {
      update(arg)
    })

    ipcRenderer.send(IpcAction.GET_LOCAL_DATA)
  }, [])

  return (
    <>
      <ReminderArmer />
    </>
  )
})

GlobalListener.displayName = 'GlobalListener'

export default GlobalListener
