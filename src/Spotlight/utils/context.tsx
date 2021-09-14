import { ipcRenderer } from 'electron'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import tinykeys from 'tinykeys'
import { AppType, useInitialize } from '../../Data/useInitialize'
import { getNewDraftKey } from '../../Editor/Components/SyncBlock/getNewBlockData'
import { getHtmlString } from '../components/Source'
import { useContentStore } from '../../Editor/Store/ContentStore'
import { FileData } from '../../Types/data'
import { useSpotlightSettingsStore } from '../store/settings'
import { IpcAction } from './constants'
import { useRecentsStore } from '../../Editor/Store/RecentsStore'

export const useLocalShortcuts = () => {
  const history = useHistory()
  const { setSelection, setSearch } = useSpotlightContext()
  const setSaved = useContentStore((state) => state.setSaved)

  const handleCancel = () => {
    setSaved(false)
    setSearch('')
    setSelection(undefined)
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        handleCancel()
        ipcRenderer.send('close')
      },
      Tab: (event) => {
        event.preventDefault()
        history.replace('/new')
      },
      Alt: (event) => {
        event.preventDefault()
        history.replace('/settings')
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])
}

export const useSettingsShortcuts = () => {
  const history = useHistory()
  const setSaved = useContentStore((state) => state.setSaved)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        history.replace('/')
      },
      '$mod+s': (event) => {
        setSaved(true)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])
}

export const useMexPageShortcuts = () => {
  const history = useHistory()
  const { setSelection, setSearch } = useSpotlightContext()
  const setSaved = useContentStore((state) => state.setSaved)

  const handleCancel = () => {
    setSaved(false)
    setSearch('')
    setSelection(undefined)
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        handleCancel()
        history.replace('/')
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])
}

type SpotlightContextType = {
  search: string
  setSearch: (val: any) => void
  selection: any
  localData: FileData | undefined
  setSelection: (val: any) => void
}

const SpotlightContext = createContext<SpotlightContextType>(undefined!)

export const SpotlightProvider: React.FC = ({ children }: any) => {
  const [search, setSearch] = useState<string>('')
  const [selection, setSelection] = useState<any>()
  const [localData, setLocalData] = useState<FileData>()
  const [temp, setTemp] = useState<any>()
  const showSource = useSpotlightSettingsStore((state) => state.showSource)

  const setBubble = useSpotlightSettingsStore((state) => state.setBubble)
  const { addRecent, clear } = useRecentsStore(({ addRecent, clear }) => ({ addRecent, clear }))

  const { init, update } = useInitialize()

  const value = {
    search,
    setSearch,
    selection,
    setSelection,
    localData
  }

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
  }, [showSource, temp])

  useEffect(() => {
    ipcRenderer.on(IpcAction.SELECTED_TEXT, (_event, data) => {
      if (!data) setSelection(undefined)
      else setTemp(data)
    })

    ipcRenderer.on(IpcAction.RECIEVE_LOCAL_DATA, (_event, arg: FileData) => {
      const editorID = getNewDraftKey()
      init(arg, editorID, AppType.SPOTLIGHT)
      setLocalData(arg)
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

  return <SpotlightContext.Provider value={value}>{children}</SpotlightContext.Provider>
}

export const useSpotlightContext = () => useContext(SpotlightContext)
