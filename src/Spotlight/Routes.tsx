import React, { memo, useEffect, useState } from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import Spotlight from './components/Spotlight'
import MexIt from './components/MexIt'
import GlobalStyle from './styles/global'
import Bubble from './components/Bubble'
import Settings from './components/Settings'
import { useSpotlightContext } from './utils/context'
import { useSpotlightEditorStore } from './store/editor'
import { getHtmlString } from './components/Source'
import { useSpotlightSettingsStore } from './store/settings'
import { ipcRenderer } from 'electron'
import { IpcAction } from './utils/constants'
import { FileData } from '../Types/data'
import { getNewDraftKey } from '../Editor/Components/SyncBlock/getNewBlockData'
import { useRecentsStore } from '../Editor/Store/RecentsStore'
import { useInitialize, AppType } from '../Data/useInitialize'

const GlobalListener = memo(() => {
  const [temp, setTemp] = useState<any>()
  const { setSelection } = useSpotlightContext()
  const setIsPreview = useSpotlightEditorStore((state) => state.setIsPreview)
  const showSource = useSpotlightSettingsStore((state) => state.showSource)
  const setBubble = useSpotlightSettingsStore((state) => state.setBubble)
  const { addRecent, clear } = useRecentsStore(({ addRecent, clear }) => ({ addRecent, clear }))

  const { init, update } = useInitialize()

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
  }, [showSource, temp, setIsPreview, setSelection])

  useEffect(() => {
    ipcRenderer.on(IpcAction.SELECTED_TEXT, (_event, data) => {
      if (!data) {
        setSelection(undefined)
        setIsPreview(false)
      } else setTemp(data)
    })

    ipcRenderer.on(IpcAction.RECIEVE_LOCAL_DATA, (_event, arg: FileData) => {
      const editorID = getNewDraftKey()
      init(arg, editorID, AppType.SPOTLIGHT)
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

    ipcRenderer.on(IpcAction.SYNC_DATA, (_event, arg) => {
      update(arg)
      // loadNode(useEditorStore.getState().node)
    })

    ipcRenderer.send(IpcAction.GET_LOCAL_DATA)
  }, [])

  return <></>
})

GlobalListener.displayName = 'GlobalListener'

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Spotlight} />
        <Route path="/new" component={MexIt} />
        <Route path="/settings" component={Settings} />
      </Switch>
      <GlobalListener />
      <Bubble />
      <GlobalStyle />
    </Router>
  )
}

export default Routes
