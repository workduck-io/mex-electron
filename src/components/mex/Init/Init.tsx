import { usePlateEditorRef } from '@udecode/plate'
import { useAuth } from '@workduck-io/dwindle'
import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import tinykeys from 'tinykeys'

import config from '../../../config.json'
import { IpcAction } from '../../../data/IpcAction'
import { useSaver } from '../../../editor/Components/Saver'
import { getNewDraftKey } from '../../../editor/Components/SyncBlock/getNewBlockData'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { AppType, useInitialize } from '../../../hooks/useInitialize'
import { getNodeidFromPathAndLinks, useLinks } from '../../../hooks/useLinks'
import useLoad from '../../../hooks/useLoad'
import { useNavigation } from '../../../hooks/useNavigation'
import { useSaveAndExit } from '../../../hooks/useSaveAndExit'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useRecieveTokens, useSyncData } from '../../../hooks/useSyncData'
import { useAuthentication, useAuthStore } from '../../../services/auth/useAuth'
import { useAnalysis, useAnalysisIPC } from '../../../store/useAnalysis'
import useBlockStore from '../../../store/useBlockStore'
import useDataStore from '../../../store/useDataStore'
import { useEditorStore } from '../../../store/useEditorStore'
import { useHelpStore } from '../../../store/useHelpStore'
import { useHistoryStore } from '../../../store/useHistoryStore'
import { useLayoutStore } from '../../../store/useLayoutStore'
import useOnboard from '../../../store/useOnboarding'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { getMexHTMLDeserializer } from '../../../utils/htmlDeserializer'
import { AppleNote } from '../../../utils/importers/appleNotes'
import { mog } from '../../../utils/lib/helper'
import { NavigationType, ROUTE_PATHS, useBrowserNavigation, useRouting } from '../../../views/routes/urls'
import { useCalendar } from '../../../hooks/useCalendar'

import { useEditorBuffer } from '../../../hooks/useEditorBuffer'
import { useRedirectAuth } from '../Auth/useRedirectAuth'
import { useActionPerformer } from '../../spotlight/Actions/useActionPerformer'
import { useLocalData, useTokenData } from '@hooks/useLocalData'

const Init = () => {
  const [appleNotes, setAppleNotes] = useState<AppleNote[]>([])
  const { goTo } = useRouting()
  const { addRecent, clear } = useRecentsStore(({ addRecent, clear }) => ({ addRecent, clear }))
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const pushHs = useHistoryStore((store) => store.push)
  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const focusMode = useLayoutStore((s) => s.focusMode)
  const toggleFocusMode = useLayoutStore((s) => s.toggleFocusMode)

  const { init } = useInitialize()
  const { loadNode, getNode } = useLoad()
  const { initCognito } = useAuth()
  const { logout } = useAuthentication()

  const { getLocalData } = useLocalData()
  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode)
  const { getUpcomingEvents, getUserEvents } = useCalendar()

  const addILink = useDataStore((store) => store.addILink)
  const { push } = useNavigation()
  const { getNodeidFromPath } = useLinks()
  const { onSave } = useSaver()
  const { setReceiveToken } = useRecieveTokens()
  // const { getAuthorizedGroups } = useActions()

  /**
   * Setup save
   * */
  useSaveAndExit()

  const { getTokenData } = useTokenData()
  const { saveAndClearBuffer } = useEditorBuffer()
  const { initActionPerfomerClient } = useActionPerformer()

  /**
   * Initialization of the app data, search index and auth,
   * also sends the auth details to the other processess
   * */
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ; (async () => {
      getLocalData()
        .then((d) => {
          mog('Initializaing', { d })
          return d
        })
        .then(({ fileData }) => {
          init(fileData)
          getTokenData()
          // setOnboardData()
          return fileData
        })
        .then((d) => {
          const userAuthenticatedEmail = initCognito({
            UserPoolId: config.cognito.USER_POOL_ID,
            ClientId: config.cognito.APP_CLIENT_ID
          })
          if (userAuthenticatedEmail) {
            ipcRenderer.send(IpcAction.LOGGED_IN, { loggedIn: true })
            initActionPerfomerClient(useAuthStore.getState().workspaceDetails?.id)
            return { d, auth: true }
          }
          setUnAuthenticated()
          ipcRenderer.send(IpcAction.LOGGED_IN, { loggedIn: false })
          return { d, auth: false }
        })
        .then(({ d, auth }) => {
          if (auth) {
            // TODO: Fix loading of the __null__ node on first start of a fresh install
            const baseNodeId = getNodeidFromPathAndLinks(d.ilinks, d.baseNodeId)
            loadNode(baseNodeId, {
              fetch: false,
              savePrev: false,
              withLoading: false
            })

            // * Fetch quick flow templates
            // getTemplates()

            // mog('Initialization complete', { d, auth })

            return { nodeid: baseNodeId }
          }
        })
        // For development
        // .then(() => goTo(ROUTE_PATHS.search, NavigationType.push))
        .then(({ nodeid }) => {
          // mog('Navigating to ', { nodeid })

          // TODO: REMOVE THIS AFTER INTEGRATIONS
          // goTo(ROUTE_PATHS.integrations, NavigationType.replace)
          // getAuthorizedGroups(true).then(() => mog('Authorized groups loaded'))

          goTo(ROUTE_PATHS.node, NavigationType.replace, nodeid)
        })
        // .then(({ nodeid }) => goTo(ROUTE_PATHS.node, NavigationType.push, nodeid))
        .catch((e) => console.error(e)) // eslint-disable-line no-console
    })()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const editor = usePlateEditorRef()

  /**
   * Sets handlers for IPC Calls
   * */
  useEffect(() => {
    ipcRenderer.on(IpcAction.OPEN_NODE, (_event, { nodeid }) => {
      // if (isOnboarding) {
      pushHs(nodeid)
      addRecent(nodeid)
      loadNode(nodeid)
      // performClick(false)
      // }
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
      const newNodeId = getNewDraftKey()
      const node = addILink({ ilink: newNodeId })
      push(node.nodeid)
      appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, node.nodeid)

      goTo(ROUTE_PATHS.node, NavigationType.push, node.nodeid)
    })

    ipcRenderer.on(IpcAction.OPEN_REMINDER, (_event, { reminder }) => {
      // mog('Opening Reminder', { reminder })
      if (!reminder) return
      // updateReminderState(reminder.id, {
      //   ...reminder.state,
      //   done: true
      // })
      loadNode(reminder.nodeid)
      goTo(ROUTE_PATHS.node, NavigationType.push, reminder.nodeid)
    })

    ipcRenderer.on(IpcAction.MEX_BLURRED, () => {
      saveAndClearBuffer()
    })
    ipcRenderer.on(IpcAction.OPEN_PREFERENCES, () => {
      goTo(`${ROUTE_PATHS.settings}/themes`, NavigationType.push)
    })
    ipcRenderer.on(IpcAction.SET_APPLE_NOTES_DATA, (_event, arg: AppleNote[]) => {
      setAppleNotes(arg)
      const appleNotesUID = getNodeidFromPath('Apple Notes')
      loadNode(appleNotesUID)
      goTo(ROUTE_PATHS.node, NavigationType.push, appleNotesUID)
    })
  }, [isOnboarding]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    ipcRenderer.on(IpcAction.FORCE_SIGNOUT, () => {
      localStorage.clear()
      logout()
      goTo(ROUTE_PATHS.login, NavigationType.push)
    })
  }, [])

  useEffect(() => {
    if (editor && appleNotes.length > 0) {
      const appleNotesParentKey = 'Apple Notes'

      appleNotes.forEach((note) => {
        const title = note.NoteTitle
        const nodeKey = `${appleNotesParentKey}.${title}`
        let nodeUID = addILink({ ilink: nodeKey }).nodeid

        const newNodeContent = getMexHTMLDeserializer(note.HTMLContent, editor, [])
        if (!nodeUID) nodeUID = getNodeidFromPath(nodeKey)

        const newNode = getNode(nodeUID)
        onSave(newNode, true, false, [{ children: newNodeContent }])
      })

      setAppleNotes([])
    }
  }, [appleNotes, editor]) // eslint-disable-line react-hooks/exhaustive-deps

  const { setIpc } = useSyncData()
  const setAnalysisIpc = useAnalysisIPC()

  const { redirectAuthHandler } = useRedirectAuth()

  // * Mex App redirect auth Handler
  useEffect(() => {
    redirectAuthHandler()
  }, [])

  // Setup sending the analysis call
  useAnalysis()

  useEffect(() => {
    const e1 = getUserEvents()
    const e2 = getUpcomingEvents()
    mog('Setting up IPC', { e1, e2 })
  }, [])

  // useEffect(() => {
  //   ipcRenderer.on(IpcAction.GET_LOCAL_INDEX, async () => {
  //     const searchIndex = await fetchIndexLocalStorage()
  //     mog('SearchIndexForLocal', { searchIndex })
  //     alert('YOOOO')
  //     ipcRenderer.send(IpcAction.SET_LOCAL_INDEX, { searchIndex })
  //   })
  // }, [fetchIndexLocalStorage])
  //

  useEffect(() => {
    setIpc()
    setReceiveToken()

    // Setup recieving the analysis call
    setAnalysisIpc()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /** Set shortcuts */
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const node = useEditorStore((store) => store.node)
  const { shortcutDisabled, shortcutHandler } = useKeyListener()
  // const { onSave } = useSaver()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showSnippets.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSnippets, () => {
          // onSave(undefined, false, false)
          goTo(ROUTE_PATHS.snippets, NavigationType.push)
        })
      },
      [shortcuts.showIntegrations.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showIntegrations, () => {
          // onSave(undefined, false, false)
          goTo(ROUTE_PATHS.integrations, NavigationType.push)
        })
      },
      [shortcuts.showEditor.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showEditor, () => {
          loadNode(node.nodeid)
          goTo(ROUTE_PATHS.node, NavigationType.push, node.nodeid)
        })
      },
      [shortcuts.showTasks.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showEditor, () => {
          goTo(ROUTE_PATHS.tasks, NavigationType.push)
        })
      },
      [shortcuts.showArchive.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showArchive, () => {
          goTo(ROUTE_PATHS.archive, NavigationType.push)
        })
      },
      [shortcuts.showSearch.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSearch, () => {
          // onSave(undefined, false, false)
          goTo(ROUTE_PATHS.search, NavigationType.push)
        })
      },
      [shortcuts.showSettings.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSettings, () => {
          // onSave(undefined, false, false)
          goTo(`${ROUTE_PATHS.settings}/themes`, NavigationType.push)
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled, node.nodeid]) // eslint-disable-line react-hooks/exhaustive-deps

  useBrowserNavigation()

  useEffect(() => {
    if (focusMode.on) {
      const unsubscribe = tinykeys(window, {
        Escape: (event) => {
          event.preventDefault()
          // shortcutHandler(shortcuts.showSnippets, () => {
          // onSave(undefined, false, false)

          toggleFocusMode()
          // })
        }
      })
      return () => {
        unsubscribe()
      }
    }
  }, [focusMode]) // eslint-disable-line react-hooks/exhaustive-deps
  // As this is a non-rendering component

  useEffect(() => {
    if (isBlockMode) {
      const unsubscribe = tinykeys(window, {
        Escape: (event) => {
          event.preventDefault()
          // shortcutHandler(shortcuts.showSnippets, () => {
          // onSave(undefined, false, false)

          setIsBlockMode(false)
          // })
        }
      })
      return () => {
        unsubscribe()
      }
    }
  }, [isBlockMode])

  return null
}

export default Init
