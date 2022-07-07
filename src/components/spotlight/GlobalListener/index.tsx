import { AppType, useInitialize } from '../../../hooks/useInitialize'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import React, { memo, useEffect, useState } from 'react'

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
import { useGoogleCalendarAutoFetch } from '../../../hooks/useCalendar'
import { useMentionData, useTokenData } from '../../../hooks/useLocalData'
import { useRecieveMentions, useRecieveTokens } from '../../../hooks/useSyncData'
import { useActionStore, UpdateActionsType } from '../Actions/useActionStore'
import { useActionsPerfomerClient } from '../Actions/useActionPerformer'
import { useActionsCache } from '../Actions/useActionsCache'
import { useShareModalStore } from '@components/mex/Mention/ShareModalStore'
import { useCreateNewNote } from '@hooks/useCreateNewNote'

const GlobalListener = memo(() => {
  const [temp, setTemp] = useState<any>()
  const { setSelection } = useSpotlightContext()
  const setSpotlightTrigger = useSpotlightSettingsStore((state) => state.setSpotlightTrigger)

  const showSource = useSpotlightSettingsStore((state) => state.showSource)
  const setBubble = useSpotlightSettingsStore((state) => state.setBubble)
  const { addRecent, clear } = useRecentsStore(({ addRecent, clear }) => ({ addRecent, clear }))
  const setReset = useSpotlightAppStore((state) => state.setReset)
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const addInRecentResearchNodes = useRecentsStore((store) => store.addInResearchNodes)
  const addResultHash = useActionsCache((store) => store.addResultHash)
  const closeShareModal = useShareModalStore((store) => store.closeModal)
  const setILinks = useDataStore((store) => store.setIlinks)

  const { getTokenData } = useTokenData()
  // const { initActionsInStore, initActionsOfGroup } = useActions()
  const { setReceiveToken } = useRecieveTokens()
  const { onSave } = useSaver()
  const { init, update } = useInitialize()
  const { identifyUser } = useAnalytics()
  const { initActionPerfomerClient } = useActionsPerfomerClient()
  const { goTo } = useRouting()

  const addActions = useActionsCache((store) => store.addActions)
  const addGroupedActions = useActionsCache((store) => store.addGroupedActions)
  const setActionGroups = useActionsCache((store) => store.setActionGroups)
  const removeActionsByGroupId = useActionsCache((store) => store.removeActionsByGroupId)
  const setConnectedGroups = useActionsCache((store) => store.setConnectedGroups)
  const clearActionStore = useActionStore((store) => store.clear)
  const clearActionCache = useActionsCache((store) => store.clearActionCache)
  const setView = useActionStore((store) => store.setView)
  const { setReceiveMention } = useRecieveMentions()
  const { getMentionData } = useMentionData()
  const { createNewNote } = useCreateNewNote()

  // const { initActionPerformers } = useActionPerformer()

  const userDetails = useAuthStore((state) => state.userDetails)

  useEffect(() => {
    if (showSource && temp) {
      // const source = getHtmlString(temp.metadata)
      // const text: string = temp.text

      const html = {
        ...temp
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
        // * If user captures a content when in action mode, then we need to redirect him to the home page
        setView(undefined)
        goTo(ROUTE_PATHS.home, NavigationType.replace)
        setSpotlightTrigger()
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

      // Close the modal
      closeShareModal()

      if (!normalMode) {
        const content = getPlateSelectors().value()

        const isNodePresent = ilinks.find((ilink) => ilink.nodeid === node.nodeid)

        if (!isNodePresent) {
          createNewNote({ path: node.path, noteId: node.nodeid })
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
        if (arg.userDetails && arg.workspaceDetails) {
          setAuthenticated(arg.userDetails, arg.workspaceDetails)
          initActionPerfomerClient(arg?.userDetails?.userID)
        }
        getTokenData()
        getMentionData()
        goTo(ROUTE_PATHS.home, NavigationType.replace)
      } else {
        setUnAuthenticated()
        useRecentsStore.getState().clear()
        useActionsCache.getState().clearActionCache()
        localStorage.clear()
      }
    })

    ipcRenderer.on(IpcAction.UPDATE_ILINKS, (_event, arg) => {
      if (arg.ilinks) setILinks(arg.ilinks)
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
      addRecent(data)
    })

    ipcRenderer.on(IpcAction.START_ONBOARDING, (_event) => {
      changeOnboarding(true)
    })

    ipcRenderer.on(IpcAction.SYNC_DATA, (_event, arg) => {
      update(arg)
    })

    ipcRenderer.on(IpcAction.UPDATE_ACTIONS, (_event, arg) => {
      const { groups, actionList, actions, actionGroupId, connectedGroups, type, key, hash } = arg?.data || {}

      if (type === UpdateActionsType.CLEAR) {
        clearActionStore()
        clearActionCache()
      } else if (type === UpdateActionsType.REMOVE_ACTION_BY_GROUP_ID) removeActionsByGroupId(actions)
      else if (type === UpdateActionsType.AUTH_GROUPS) setConnectedGroups(connectedGroups)
      else if (type === UpdateActionsType.UPDATE_HASH) addResultHash(key, hash)
      else if (groups) setActionGroups(groups)
      else if (actionList) addActions(actionList)
      else if (actions && actionGroupId) {
        addGroupedActions(actionGroupId, actions)
      }
    })

    ipcRenderer.send(IpcAction.GET_LOCAL_DATA)

    ipcRenderer.on(IpcAction.FORCE_SIGNOUT, (_event) => {
      useRecentsStore.getState().clear()
      useActionsCache.getState().clearActionCache()
      localStorage.clear()
    })

    initActionPerfomerClient(useAuthStore.getState()?.userDetails?.userID)
    setReceiveToken()
    setReceiveMention()
  }, [])

  useGoogleCalendarAutoFetch()

  return (
    <>
      <ReminderArmer />
    </>
  )
})

GlobalListener.displayName = 'GlobalListener'

export default GlobalListener
