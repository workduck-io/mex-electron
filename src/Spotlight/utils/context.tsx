import { ipcRenderer } from 'electron'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import tinykeys from 'tinykeys'
import { useInitialize } from '../../Data/useInitialize'
import { getNewDraftKey } from '../../Editor/Components/SyncBlock/getNewBlockData'
import { getHtmlString } from '../components/Source'
import { useContentStore } from '../../Editor/Store/ContentStore'
import { FileData } from '../../Types/data'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import useDataStore from '../../Editor/Store/DataStore'

export const useLocalShortcuts = () => {
  const history = useHistory()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        ipcRenderer.send('close')
      },
      Tab: (event) => {
        event.preventDefault()
        history.replace('/new')
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

  const { init, update } = useInitialize()

  const value = {
    search,
    setSearch,
    selection,
    setSelection,
    localData
  }

  useEffect(() => {
    ipcRenderer.on('selected-text', (_event, data) => {
      if (!data) setSelection(undefined)
      else {
        const source = getHtmlString(data?.metadata)
        const text: string = data?.text

        const html = {
          ...data,
          text: text.concat(source)
        }

        setSelection(html)
      }
    })

    ipcRenderer.on('recieve-local-data', (_event, arg: FileData) => {
      const editorID = getNewDraftKey()
      init(arg, editorID)
      setLocalData(arg)
    })

    ipcRenderer.on('sync-data', (_event, arg) => {
      update(arg)
      // loadNode(useEditorStore.getState().node)
    })

    ipcRenderer.send('get-local-data')
  }, [])

  return <SpotlightContext.Provider value={value}>{children}</SpotlightContext.Provider>
}

export const useSpotlightContext = () => useContext(SpotlightContext)
