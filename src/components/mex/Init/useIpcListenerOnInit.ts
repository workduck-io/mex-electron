import { IpcAction } from '@data/IpcAction'
import { useCreateNewNote } from '@hooks/useCreateNewNote'
import { useEditorBuffer } from '@hooks/useEditorBuffer'
import useLoad from '@hooks/useLoad'
import { useAuthentication } from '@services/auth/useAuth'
import { useHistoryStore } from '@store/useHistoryStore'
import useOnboard from '@store/useOnboarding'
import { useRecentsStore } from '@store/useRecentsStore'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { ipcRenderer } from 'electron'
import { useEffect } from 'react'

export const useIpcListenerOnInit = () => {
  const clear = useRecentsStore((store) => store.clear)
  const pushHs = useHistoryStore((store) => store.push)
  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const addRecent = useRecentsStore((store) => store.addRecent)

  // * Custom hooks
  const { goTo } = useRouting()
  const { loadNode } = useLoad()
  const { logout } = useAuthentication()
  const { saveAndClearBuffer } = useEditorBuffer()
  const { createNewNote } = useCreateNewNote()

  /**
   * Sets handlers for IPC Calls
   * */
  useEffect(() => {
    ipcRenderer.on(IpcAction.OPEN_NODE, (_event, { nodeid }) => {
      pushHs(nodeid)
      addRecent(nodeid)
      loadNode(nodeid)
    })
    ipcRenderer.on(IpcAction.CLEAR_RECENTS, () => {
      clear()
    })
    ipcRenderer.on(IpcAction.NEW_RECENT_ITEM, (_event, arg) => {
      const { data } = arg
      addRecent(data)
    })

    ipcRenderer.on(IpcAction.REDIRECT_TO, (_event, { page }) => {
      if (page) {
        goTo(page, NavigationType.replace)
      }
    })
    ipcRenderer.on(IpcAction.CREATE_NEW_NODE, () => {
      const note = createNewNote()
      goTo(ROUTE_PATHS.node, NavigationType.push, note?.nodeid)
    })

    ipcRenderer.on(IpcAction.OPEN_REMINDER, (_event, { reminder }) => {
      if (!reminder) return

      loadNode(reminder.nodeid)
      goTo(ROUTE_PATHS.node, NavigationType.push, reminder.nodeid)
    })

    ipcRenderer.on(IpcAction.MEX_BLURRED, () => {
      saveAndClearBuffer()
    })

    ipcRenderer.on(IpcAction.OPEN_PREFERENCES, () => {
      goTo(`${ROUTE_PATHS.settings}/themes`, NavigationType.push)
    })
  }, [isOnboarding])

  useEffect(() => {
    ipcRenderer.on(IpcAction.FORCE_SIGNOUT, () => {
      localStorage.clear()
      logout()
      goTo(ROUTE_PATHS.login, NavigationType.push)
    })
  }, [])
}