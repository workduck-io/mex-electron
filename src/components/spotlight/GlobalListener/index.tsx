import React, { memo, useEffect, useState } from 'react'
import { useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { getHtmlString } from '../../../components/spotlight/Source'
import { useSpotlightSettingsStore } from '../../../store/settings.spotlight'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../../../data/IpcAction'
import { FileData } from '../../../types/data'
import { getNewDraftKey } from '../../../editor/Components/SyncBlock/getNewBlockData'
import { useNewSearchStore } from '../../../store/useSearchStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { useInitialize, AppType } from '../../../hooks/useInitialize'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { convertDataToRawText } from '../../../utils/search/localSearch'
import { useLocation, useHistory } from 'react-router'
import { useAuthStore } from '../../../services/auth/useAuth'
import useAnalytics from '../../../services/analytics'
import useOnboard from '../../../store/useOnboarding'
import { mog } from '../../../utils/lib/helper'
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
  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)

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

  return <></>
})

GlobalListener.displayName = 'GlobalListener'

export default GlobalListener
