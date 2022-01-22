import { useAuth } from '@workduck-io/dwindle'
import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import tinykeys from 'tinykeys'
import { usePlateEditorRef } from '@udecode/plate'

import { AppleNote } from '../../../utils/importers/appleNotes'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { useAuthStore } from '../../../services/auth/useAuth'
import { useHistoryStore } from '../../../store/useHistoryStore'
import useOnboard from '../../../store/useOnboarding'
import { useInitialize, AppType } from '../../../hooks/useInitialize'
import useLoad from '../../../hooks/useLoad'
import { useLocalData } from '../../../hooks/useLocalData'
import { useNewSearchStore } from '../../../store/useSearchStore'
import useDataStore from '../../../store/useDataStore'
import { useNavigation } from '../../../hooks/useNavigation'
import { useLinks, getUidFromNodeIdAndLinks } from '../../../hooks/useLinks'
import generatePlugins from '../../../editor/Plugins/plugins'
import { useSaver } from '../../../editor/Components/Saver'
import { useSaveAndExit } from '../../../hooks/useSaveAndExit'
// import { convertDataToRawText } from '../../../utils/Search/localSearch'
import { IpcAction } from '../../../data/IpcAction'
import config from '../../../apis/config'
import { performClick } from '../Onboarding/steps'
import { flexIndexKeys } from '../../../utils/search/flexsearch'
import { getNewDraftKey } from '../../../editor/Components/SyncBlock/getNewBlockData'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { getMexHTMLDeserializer } from '../../../utils/htmlDeserializer'
import { useSyncData } from '../../../hooks/useSyncData'
import { useHelpStore } from '../../../store/useHelpStore'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useEditorStore } from '../../../store/useEditorStore'
import { convertDataToRawText } from '../../../utils/search/localSearch'

const Init = () => {
  const [appleNotes, setAppleNotes] = useState<AppleNote[]>([])
  const history = useHistory()
  const { addRecent, clear } = useRecentsStore(({ addRecent, clear }) => ({ addRecent, clear }))
  // const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const pushHs = useHistoryStore((store) => store.push)
  const isOnboarding = useOnboard((s) => s.isOnboarding)

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

  /**
   * Initialization of the app data, search index and auth,
   * also sends the auth details to the other processess
   * */
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      getLocalData()
        .then((d) => {
          // console.log('Data here', d)
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

          // const res = searchIndexNew('design')
          // console.log('Initial Results are: ', res)

          return fileData
        })
        .then((d) => {
          const userAuthenticatedEmail = initCognito({
            UserPoolId: config.cognito.USER_POOL_ID,
            ClientId: config.cognito.APP_CLIENT_ID
          })
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
            loadNode(getUidFromNodeIdAndLinks(d.ilinks, d.baseNodeId))
          }
        })
        .then(() => history.push('/editor'))
        .catch((e) => console.error(e)) // eslint-disable-line no-console
    })()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const editor = usePlateEditorRef()
  const plugins = generatePlugins()

  /**
   * Sets handlers for IPC Calls
   * */
  useEffect(() => {
    ipcRenderer.on(IpcAction.OPEN_NODE, (_event, { nodeId }) => {
      if (isOnboarding) {
        pushHs(nodeId)
        addRecent(nodeId)
        loadNode(nodeId, { savePrev: false, fetch: false })
        performClick(false)
      }
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
      const uid = addILink(newNodeId)
      push(uid)
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

        const newNodeContent = getMexHTMLDeserializer(note.HTMLContent, editor, plugins)
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
          loadNode(node.uid)
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
  }, [shortcuts, shortcutDisabled, node.uid]) // eslint-disable-line react-hooks/exhaustive-deps

  // As this is a non-rendering component
  return null
}

export default Init