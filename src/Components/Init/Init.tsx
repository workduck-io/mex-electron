import { useAuth } from '@workduck-io/dwindle'
import { ipcRenderer } from 'electron'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { flexIndexKeys } from '../../Search/flexsearch'
import tinykeys from 'tinykeys'
import { useHelpStore } from '../../Components/Help/HelpModal'
import { useInitialize, AppType } from '../../Data/useInitialize'
import { useLocalData } from '../../Data/useLocalData'
import { useSyncData } from '../../Data/useSyncData'
import { getUidFromNodeIdAndLinks } from '../../Editor/Actions/useLinks'
import { useHistoryStore } from '../../Editor/Store/HistoryStore'
import { useRecentsStore } from '../../Editor/Store/RecentsStore'
import { useAuthStore } from '../../Hooks/useAuth/useAuth'
import { useKeyListener } from '../../Hooks/useCustomShortcuts/useShortcutListener'
import useLoad from '../../Hooks/useLoad/useLoad'
import config from '../../Requests/config'
import { convertDataToRawText } from '../../Search/localSearch'
import { useNewSearchStore } from '../../Search/SearchStore'
import { IpcAction } from '../../Spotlight/utils/constants'

import { useSaveAndExit } from '../../Hooks/useSaveAndExit/useSaveAndExit'
import useDataStore from '../../Editor/Store/DataStore'
import { useNavigation } from '../../Hooks/useNavigation/useNavigation'
import { getNewDraftKey } from '../../Editor/Components/SyncBlock/getNewBlockData'
import { appNotifierWindow } from '../../Spotlight/utils/notifiers'
import useOnboard from '../Onboarding/store'
import { performClick } from '../Onboarding/steps'

const Init = () => {
  const history = useHistory()
  const { addRecent, clear } = useRecentsStore(({ addRecent, clear }) => ({ addRecent, clear }))
  // const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const pushHs = useHistoryStore((store) => store.push)
  const isOnboarding = useOnboard((s) => s.isOnboarding)

  const { init } = useInitialize()
  const { loadNode } = useLoad()
  const { initCognito } = useAuth()

  useSaveAndExit()

  const { getLocalData } = useLocalData()
  const initFlexSearchIndex = useNewSearchStore((store) => store.initializeSearchIndex)
  const fetchIndexLocalStorage = useNewSearchStore((store) => store.fetchIndexLocalStorage)
  const addILink = useDataStore((store) => store.addILink)
  const { push } = useNavigation()

  /** Initialization of the app details occur here */
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
        .then(({ d, auth }) => auth && loadNode(getUidFromNodeIdAndLinks(d.ilinks, d.baseNodeId)))
        .then(() => history.push('/editor'))
        .catch((e) => console.error(e)) // eslint-disable-line no-console
    })()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [fetchIndexLocalStorage, isOnboarding]) // eslint-disable-line react-hooks/exhaustive-deps

  const { setIpc } = useSyncData()

  useEffect(() => {
    setIpc()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const shortcuts = useHelpStore((store) => store.shortcuts)
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
          history.push('/editor')
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
  }, [shortcuts, shortcutDisabled]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

export default Init
