import { IpcAction } from '@data/IpcAction'
import { useCreateNewNote } from '@hooks/useCreateNewNote'
import { useEditorBuffer } from '@hooks/useEditorBuffer'
import useLoad from '@hooks/useLoad'
import { useRecieveMentions, useRecieveTokens, useSyncData } from '@hooks/useSyncData'
import { useAuthentication } from '@services/auth/useAuth'
import syncStores from '@store/syncStore/synced'
import { useAnalysisIPC } from '@store/useAnalysis'
import { useEditorStore } from '@store/useEditorStore'
import { useHistoryStore } from '@store/useHistoryStore'
import useModalStore, { ModalsType } from '@store/useModalStore'
import useOnboard from '@store/useOnboarding'
import { useRecentsStore } from '@store/useRecentsStore'
import { mog } from '@utils/lib/helper'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { ipcRenderer } from 'electron'
import { useEffect } from 'react'
import { useRedirectAuth } from '../Auth/useRedirectAuth'

export const useIpcListenerOnInit = () => {
  const clear = useRecentsStore((store) => store.clear)
  const pushHs = useHistoryStore((store) => store.push)
  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const addRecent = useRecentsStore((store) => store.addRecent)
  const toggleModal = useModalStore((store) => store.toggleOpen)

  // * Custom hooks
  const { goTo } = useRouting()
  const { loadNode } = useLoad()
  const { setIpc } = useSyncData()
  const { logout } = useAuthentication()
  const setAnalysisIpc = useAnalysisIPC()
  const { createNewNote } = useCreateNewNote()
  const { setReceiveToken } = useRecieveTokens()
  const { redirectAuthHandler } = useRedirectAuth()
  const { saveAndClearBuffer } = useEditorBuffer()
  const { setReceiveMention } = useRecieveMentions()

  /**
   * Sets handlers for IPC Calls
   * */
  useEffect(() => {
    ipcRenderer.on(IpcAction.OPEN_NODE, (_event, { nodeid }) => {
      pushHs(nodeid)
      addRecent(nodeid)
      loadNode(nodeid)
    })
    // ipcRenderer.on(IpcAction.CLEAR_RECENTS, () => {
    //   clear()
    // })
    // ipcRenderer.on(IpcAction.NEW_RECENT_ITEM, (_event, arg) => {
    //   const { data } = arg
    //   addRecent(data)
    // })

    ipcRenderer.on(IpcAction.REDIRECT_TO, (_event, { page }) => {
      if (page) {
        goTo(page, NavigationType.replace)
      }
    })

    ipcRenderer.on(IpcAction.REFRESH_NODE, (_event, { nodeid }) => {
      if (nodeid === useEditorStore.getState().node.nodeid) {
        loadNode(nodeid, { fetch: false })
      }
    })

    ipcRenderer.on(IpcAction.CREATE_NEW_NODE, () => {
      const note = createNewNote()
      goTo(ROUTE_PATHS.node, NavigationType.push, note?.nodeid)
    })

    ipcRenderer.on(IpcAction.OPEN_REMINDER, (_event, { reminder }) => {
      if (!reminder) return

      loadNode(reminder?.nodeid)
      goTo(ROUTE_PATHS.node, NavigationType.push, reminder?.nodeid)
    })

    ipcRenderer.on(IpcAction.WINDOW_BLUR, () => {
      saveAndClearBuffer()
    })

    ipcRenderer.on(IpcAction.SHOW_RELEASE_NOTES, (_event, { version }) => {
      const showedReleaseNotes = useModalStore.getState().init

      mog('SHOW RELEASE NOTES', { version, showedReleaseNotes })

      if (!showedReleaseNotes) toggleModal(ModalsType.releases, true)
    })

    ipcRenderer.on(IpcAction.OPEN_PREFERENCES, () => {
      goTo(`${ROUTE_PATHS.settings}/themes`, NavigationType.push)
    })
  }, [isOnboarding])

  useEffect(() => {
    redirectAuthHandler()

    setIpc()
    setReceiveToken()
    setReceiveMention()

    // Setup recieving the analysis call
    setAnalysisIpc()
    syncStores()

    ipcRenderer.on(IpcAction.FORCE_SIGNOUT, () => {
      logout()
    })
  }, [])
}
