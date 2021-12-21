import React, { memo, useEffect, useState } from 'react'
import { useSpotlightContext } from '../../utils/context'
import { useSpotlightEditorStore } from '../../store/editor'
import { getHtmlString } from '../../components/Source'
import { useSpotlightSettingsStore } from '../../store/settings'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../../utils/constants'
import { FileData } from '../../../Types/data'
import { getNewDraftKey } from '../../../Editor/Components/SyncBlock/getNewBlockData'
import { useNewSearchStore } from '../../../Search/SearchStore'
import { useRecentsStore } from '../../../Editor/Store/RecentsStore'
import { useInitialize, AppType } from '../../../Data/useInitialize'
import { useSpotlightAppStore } from '../../../Spotlight/store/app'
import { convertDataToRawText } from '../../../Search/localSearch'
import { useLocation, useHistory } from 'react-router'
import { useAuthStore } from '../../../Hooks/useAuth/useAuth'
import useAnalytics from '../../../analytics'
import useOnboard from '../../../Components/Onboarding/store'
interface IndexAndFileData {
  fileData: FileData
  indexData: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

const GlobalListener = memo(() => {
  const location = useLocation()
  const [temp, setTemp] = useState<any>()
  const { setSelection, setSearch } = useSpotlightContext()
  const setIsPreview = useSpotlightEditorStore((state) => state.setIsPreview)
  const showSource = useSpotlightSettingsStore((state) => state.showSource)
  const setBubble = useSpotlightSettingsStore((state) => state.setBubble)
  const { addRecent, clear } = useRecentsStore(({ addRecent, clear }) => ({ addRecent, clear }))
  const setReset = useSpotlightAppStore((state) => state.setReset)
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const initializeSearchIndex = useNewSearchStore((store) => store.initializeSearchIndex)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)

  const { init, update } = useInitialize()
  const { identifyUser } = useAnalytics()
  const history = useHistory()

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
    setIsPreview(true)
  }, [showSource, temp])

  useEffect(() => {
    ipcRenderer.on(IpcAction.SELECTED_TEXT, (_event, data) => {
      if (location.pathname === '/') {
        setIsPreview(false)
        setSearch('')
      }
      if (!data) {
        setSelection(undefined)
        setIsPreview(false)
      } else setTemp(data)
    })

    ipcRenderer.on(IpcAction.INIT_HEAP_INSTANCE, (_event, arg) => {
      if (arg.heap) {
        window.heap = JSON.parse(arg.heap)
        identifyUser(userDetails?.email)
      }
    })

    ipcRenderer.on(IpcAction.SPOTLIGHT_BLURRED, () => {
      setReset()
    })

    ipcRenderer.on(IpcAction.LOGGED_IN, (_event, arg) => {
      if (arg.loggedIn) {
        if (arg.userDetails && arg.workspaceDetails) setAuthenticated(arg.userDetails, arg.workspaceDetails)
        history.replace('/')
      } else setUnAuthenticated()
    })

    ipcRenderer.on(IpcAction.RECIEVE_LOCAL_DATA, (_event, arg: IndexAndFileData) => {
      const { fileData, indexData } = arg
      const editorID = getNewDraftKey()
      init(fileData, editorID, AppType.SPOTLIGHT)
      const initList = convertDataToRawText(fileData)
      initializeSearchIndex(initList, indexData)
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

    ipcRenderer.send(IpcAction.GET_LOCAL_DATA)
  }, [])

  return <></>
})

GlobalListener.displayName = 'GlobalListener'

export default GlobalListener
