import { usePlateEditorRef } from '@udecode/plate'
import { useAuth } from '@workduck-io/dwindle'
import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useLayoutStore } from '../../../store/useLayoutStore'
import tinykeys from 'tinykeys'
import config from '../../../apis/config'
// import { convertDataToRawText } from '../../../utils/Search/localSearch'
import { IpcAction } from '../../../data/IpcAction'
import { useSaver } from '../../../editor/Components/Saver'
import { getNewDraftKey } from '../../../editor/Components/SyncBlock/getNewBlockData'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { AppType, useInitialize } from '../../../hooks/useInitialize'
import { getUidFromNodeIdAndLinks, useLinks } from '../../../hooks/useLinks'
import useLoad from '../../../hooks/useLoad'
import { useLocalData } from '../../../hooks/useLocalData'
import { useNavigation } from '../../../hooks/useNavigation'
import { useSaveAndExit } from '../../../hooks/useSaveAndExit'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useSyncData } from '../../../hooks/useSyncData'
import { useUpdater } from '../../../hooks/useUpdater'
import { useAuthStore } from '../../../services/auth/useAuth'
import useDataStore from '../../../store/useDataStore'
import { useEditorStore } from '../../../store/useEditorStore'
import { useHelpStore } from '../../../store/useHelpStore'
import { useHistoryStore } from '../../../store/useHistoryStore'
import useOnboard from '../../../store/useOnboarding'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { useNewSearchStore } from '../../../store/useSearchStore'
import { getMexHTMLDeserializer } from '../../../utils/htmlDeserializer'
import { AppleNote } from '../../../utils/importers/appleNotes'
import { mog } from '../../../utils/lib/helper'
import { flexIndexKeys } from '../../../utils/search/flexsearch'
import { convertDataToRawText } from '../../../utils/search/localSearch'
import { performClick } from '../Onboarding/steps'
import { useOnboardingData } from '../Onboarding/hooks'

const Init = () => {
  const [appleNotes, setAppleNotes] = useState<AppleNote[]>([])
  const history = useHistory()
  const { addRecent, clear } = useRecentsStore(({ addRecent, clear }) => ({ addRecent, clear }))
  // const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const pushHs = useHistoryStore((store) => store.push)
  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const focusMode = useLayoutStore((s) => s.focusMode)
  const toggleFocusMode = useLayoutStore((s) => s.toggleFocusMode)

  const { init } = useInitialize()
  const { loadNode, getNode } = useLoad()
  const { initCognito } = useAuth()

  const { getLocalData } = useLocalData()
  const initFlexSearchIndex = useNewSearchStore((store) => store.initializeSearchIndex)
  const fetchIndexLocalStorage = useNewSearchStore((store) => store.fetchIndexLocalStorage)
  const addILink = useDataStore((store) => store.addILink)
  const { push } = useNavigation()
  const { getUidFromNodeId } = useLinks()
  const { onSave } = useSaver()

  /**
   * Setup save
   * */
  useSaveAndExit()

  const { closeOnboarding } = useOnboardingData()

  const { getTemplates } = useUpdater()

  const auth = useAuthStore((store) => store.authenticated)

  /**
   * Initialization of the app data, search index and auth,
   * also sends the auth details to the other processess
   * */
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      getLocalData()
        .then((d) => {
          mog('Initializaing', { d })
          return d
        })
        .then(({ fileData, indexData }) => {
          init(fileData)
          // setOnboardData()
          return { fileData, indexData }
        })
        .then(({ fileData, indexData }) => {
          const initList = convertDataToRawText(fileData)
          const index = initFlexSearchIndex(initList, indexData)
          return fileData
        })
        .then((d) => {
          const userAuthenticatedEmail = initCognito({
            UserPoolId: config.cognito.USER_POOL_ID,
            ClientId: config.cognito.APP_CLIENT_ID
          })
          mog('Authorizing', { userAuthenticatedEmail })
          if (userAuthenticatedEmail) {
            // setAuthenticated({ email: userAuthenticatedEmail })
            ipcRenderer.send(IpcAction.LOGGED_IN, { loggedIn: true })
            return { d, auth: true }
          }
          setUnAuthenticated()
          ipcRenderer.send(IpcAction.LOGGED_IN, { loggedIn: false })
          return { d, auth: false }
        })
        .then(({ d, auth }) => {
          if (auth) {
            // TODO: Fix loading of the __null__ node on first start of a fresh install
            mog('Loading Initial Node', { d, auth })
            loadNode(getUidFromNodeIdAndLinks(d.ilinks, d.baseNodeId), {
              fetch: false,
              savePrev: false,
              withLoading: false
            })

            // Fetch quick flow templates
            getTemplates()
          }
        })
        .then(() => history.push('/editor'))
        .catch((e) => console.error(e)) // eslint-disable-line no-console
    })()
  }, [auth]) // eslint-disable-line react-hooks/exhaustive-deps
  const editor = usePlateEditorRef()

  /**
   * Sets handlers for IPC Calls
   * */
  useEffect(() => {
    ipcRenderer.on(IpcAction.OPEN_NODE, (_event, { path }) => {
      if (isOnboarding) {
        pushHs(path)
        addRecent(path)
        loadNode(path, { savePrev: false, fetch: false })
        performClick(false)
      }
    })
    ipcRenderer.on(IpcAction.CLEAR_RECENTS, () => {
      clear()
    })
    ipcRenderer.on(IpcAction.STOP_ONBOARDING, () => {
      closeOnboarding()
    })
    ipcRenderer.on(IpcAction.NEW_RECENT_ITEM, (_event, arg) => {
      const { data } = arg
      addRecent(data)
    })
    ipcRenderer.on(IpcAction.REDIRECT_TO, (_event, { page }) => {
      if (page) {
        history.replace(page)
      }
    })
    ipcRenderer.on(IpcAction.GET_LOCAL_INDEX, () => {
      fetchIndexLocalStorage()
      const searchIndex = {}
      flexIndexKeys.forEach((key) => {
        const t = localStorage.getItem(key)
        if (t === null) searchIndex[key] = ''
        else searchIndex[key] = t
      })
      ipcRenderer.send(IpcAction.SET_LOCAL_INDEX, { searchIndex })
    })
    ipcRenderer.on(IpcAction.CREATE_NEW_NODE, () => {
      const newNodeId = getNewDraftKey()
      const nodeid = addILink(newNodeId)
      push(nodeid)
      appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, newNodeId)
    })
    ipcRenderer.on(IpcAction.OPEN_PREFERENCES, () => {
      history.push('/settings')
    })
    ipcRenderer.on(IpcAction.SET_APPLE_NOTES_DATA, (_event, arg: AppleNote[]) => {
      setAppleNotes(arg)
      history.push('/editor')
      const appleNotesUID = getUidFromNodeId('Apple Notes')
      loadNode(appleNotesUID)
    })
  }, [fetchIndexLocalStorage, isOnboarding]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (editor && appleNotes.length > 0) {
      const appleNotesParentKey = 'Apple Notes'

      appleNotes.forEach((note) => {
        const title = note.NoteTitle
        const nodeKey = `${appleNotesParentKey}.${title}`
        let nodeUID = addILink(nodeKey)

        const newNodeContent = getMexHTMLDeserializer(note.HTMLContent, editor, [])
        if (!nodeUID) nodeUID = getUidFromNodeId(nodeKey)

        const newNode = getNode(nodeUID)
        onSave(newNode, true, false, [{ children: newNodeContent }])
      })

      setAppleNotes([])
    }
  }, [appleNotes, editor])

  const { setIpc } = useSyncData()

  useEffect(() => {
    setIpc()
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
          history.push('/snippets')
        })
      },
      [shortcuts.showIntegrations.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showIntegrations, () => {
          // onSave(undefined, false, false)
          history.push('/integrations')
        })
      },
      [shortcuts.showEditor.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showEditor, () => {
          loadNode(node.nodeid)
          history.push('/editor')
        })
      },
      [shortcuts.showArchive.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showArchive, () => {
          history.push('/archive')
        })
      },
      [shortcuts.showSearch.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSearch, () => {
          // onSave(undefined, false, false)
          history.push('/search')
        })
      },
      [shortcuts.showSettings.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSettings, () => {
          // onSave(undefined, false, false)
          history.push('/settings')
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled, node.nodeid]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (focusMode) {
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
  return null
}

export default Init
